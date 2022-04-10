/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Range } from '../../../core/range.js';
import { BracketInfo, BracketPairWithMinIndentationInfo } from '../../../textModelBracketPairs.js';
import { TextEditInfo } from './beforeEditPositionMapper.js';
import { LanguageAgnosticBracketTokens } from './brackets.js';
import { lengthAdd, lengthGreaterThanEqual, lengthLessThanEqual, lengthOfString, lengthsToRange, lengthZero, positionToLength, toLength } from './length.js';
import { parseDocument } from './parser.js';
import { DenseKeyProvider } from './smallImmutableSet.js';
import { FastTokenizer, TextBufferTokenizer } from './tokenizer.js';
export class BracketPairsTree extends Disposable {
    constructor(textModel, getLanguageConfiguration) {
        super();
        this.textModel = textModel;
        this.getLanguageConfiguration = getLanguageConfiguration;
        this.didChangeEmitter = new Emitter();
        this.denseKeyProvider = new DenseKeyProvider();
        this.brackets = new LanguageAgnosticBracketTokens(this.denseKeyProvider, this.getLanguageConfiguration);
        this.onDidChange = this.didChangeEmitter.event;
        if (textModel.backgroundTokenizationState === 0 /* Uninitialized */) {
            // There are no token information yet
            const brackets = this.brackets.getSingleLanguageBracketTokens(this.textModel.getLanguageId());
            const tokenizer = new FastTokenizer(this.textModel.getValue(), brackets);
            this.initialAstWithoutTokens = parseDocument(tokenizer, [], undefined, true);
            this.astWithTokens = this.initialAstWithoutTokens;
        }
        else if (textModel.backgroundTokenizationState === 2 /* Completed */) {
            // Skip the initial ast, as there is no flickering.
            // Directly create the tree with token information.
            this.initialAstWithoutTokens = undefined;
            this.astWithTokens = this.parseDocumentFromTextBuffer([], undefined, false);
        }
        else if (textModel.backgroundTokenizationState === 1 /* InProgress */) {
            this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer([], undefined, true);
            this.astWithTokens = this.initialAstWithoutTokens;
        }
    }
    didLanguageChange(languageId) {
        return this.brackets.didLanguageChange(languageId);
    }
    //#region TextModel events
    handleDidChangeBackgroundTokenizationState() {
        if (this.textModel.backgroundTokenizationState === 2 /* Completed */) {
            const wasUndefined = this.initialAstWithoutTokens === undefined;
            // Clear the initial tree as we can use the tree with token information now.
            this.initialAstWithoutTokens = undefined;
            if (!wasUndefined) {
                this.didChangeEmitter.fire();
            }
        }
    }
    handleDidChangeTokens({ ranges }) {
        const edits = ranges.map(r => new TextEditInfo(toLength(r.fromLineNumber - 1, 0), toLength(r.toLineNumber, 0), toLength(r.toLineNumber - r.fromLineNumber + 1, 0)));
        this.astWithTokens = this.parseDocumentFromTextBuffer(edits, this.astWithTokens, false);
        if (!this.initialAstWithoutTokens) {
            this.didChangeEmitter.fire();
        }
    }
    handleContentChanged(change) {
        const edits = change.changes.map(c => {
            const range = Range.lift(c.range);
            return new TextEditInfo(positionToLength(range.getStartPosition()), positionToLength(range.getEndPosition()), lengthOfString(c.text));
        }).reverse();
        this.astWithTokens = this.parseDocumentFromTextBuffer(edits, this.astWithTokens, false);
        if (this.initialAstWithoutTokens) {
            this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer(edits, this.initialAstWithoutTokens, false);
        }
    }
    //#endregion
    /**
     * @pure (only if isPure = true)
    */
    parseDocumentFromTextBuffer(edits, previousAst, immutable) {
        // Is much faster if `isPure = false`.
        const isPure = false;
        const previousAstClone = isPure ? previousAst === null || previousAst === void 0 ? void 0 : previousAst.deepClone() : previousAst;
        const tokenizer = new TextBufferTokenizer(this.textModel, this.brackets);
        const result = parseDocument(tokenizer, edits, previousAstClone, immutable);
        return result;
    }
    getBracketsInRange(range) {
        const startOffset = toLength(range.startLineNumber - 1, range.startColumn - 1);
        const endOffset = toLength(range.endLineNumber - 1, range.endColumn - 1);
        const result = new Array();
        const node = this.initialAstWithoutTokens || this.astWithTokens;
        collectBrackets(node, lengthZero, node.length, startOffset, endOffset, result);
        return result;
    }
    getBracketPairsInRange(range, includeMinIndentation) {
        const result = new Array();
        const startLength = positionToLength(range.getStartPosition());
        const endLength = positionToLength(range.getEndPosition());
        const node = this.initialAstWithoutTokens || this.astWithTokens;
        const context = new CollectBracketPairsContext(result, includeMinIndentation, this.textModel);
        collectBracketPairs(node, lengthZero, node.length, startLength, endLength, context);
        return result;
    }
}
function collectBrackets(node, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, result, level = 0) {
    if (node.kind === 4 /* List */) {
        for (const child of node.children) {
            nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
            if (lengthLessThanEqual(nodeOffsetStart, endOffset) && lengthGreaterThanEqual(nodeOffsetEnd, startOffset)) {
                collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, result, level);
            }
            nodeOffsetStart = nodeOffsetEnd;
        }
    }
    else if (node.kind === 2 /* Pair */) {
        // Don't use node.children here to improve performance
        level++;
        {
            const child = node.openingBracket;
            nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
            if (lengthLessThanEqual(nodeOffsetStart, endOffset) && lengthGreaterThanEqual(nodeOffsetEnd, startOffset)) {
                const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
                result.push(new BracketInfo(range, level - 1, !node.closingBracket));
            }
            nodeOffsetStart = nodeOffsetEnd;
        }
        if (node.child) {
            const child = node.child;
            nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
            if (lengthLessThanEqual(nodeOffsetStart, endOffset) && lengthGreaterThanEqual(nodeOffsetEnd, startOffset)) {
                collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, result, level);
            }
            nodeOffsetStart = nodeOffsetEnd;
        }
        if (node.closingBracket) {
            const child = node.closingBracket;
            nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
            if (lengthLessThanEqual(nodeOffsetStart, endOffset) && lengthGreaterThanEqual(nodeOffsetEnd, startOffset)) {
                const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
                result.push(new BracketInfo(range, level - 1, false));
            }
            nodeOffsetStart = nodeOffsetEnd;
        }
    }
    else if (node.kind === 3 /* UnexpectedClosingBracket */) {
        const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
        result.push(new BracketInfo(range, level - 1, true));
    }
    else if (node.kind === 1 /* Bracket */) {
        const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
        result.push(new BracketInfo(range, level - 1, false));
    }
}
class CollectBracketPairsContext {
    constructor(result, includeMinIndentation, textModel) {
        this.result = result;
        this.includeMinIndentation = includeMinIndentation;
        this.textModel = textModel;
    }
}
function collectBracketPairs(node, nodeOffset, nodeOffsetEnd, startOffset, endOffset, context, level = 0) {
    var _a;
    if (node.kind === 2 /* Pair */) {
        const openingBracketEnd = lengthAdd(nodeOffset, node.openingBracket.length);
        let minIndentation = -1;
        if (context.includeMinIndentation) {
            minIndentation = node.computeMinIndentation(nodeOffset, context.textModel);
        }
        context.result.push(new BracketPairWithMinIndentationInfo(lengthsToRange(nodeOffset, nodeOffsetEnd), lengthsToRange(nodeOffset, openingBracketEnd), node.closingBracket
            ? lengthsToRange(lengthAdd(openingBracketEnd, ((_a = node.child) === null || _a === void 0 ? void 0 : _a.length) || lengthZero), nodeOffsetEnd)
            : undefined, level, minIndentation));
        level++;
    }
    let curOffset = nodeOffset;
    for (const child of node.children) {
        const childOffset = curOffset;
        curOffset = lengthAdd(curOffset, child.length);
        if (lengthLessThanEqual(childOffset, endOffset) && lengthLessThanEqual(startOffset, curOffset)) {
            collectBracketPairs(child, childOffset, curOffset, startOffset, endOffset, context, level);
        }
    }
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { escapeRegExpCharacters } from '../../../../../base/common/strings.js';
import { BracketAstNode } from './ast.js';
import { toLength } from './length.js';
import { identityKeyProvider, SmallImmutableSet } from './smallImmutableSet.js';
import { Token } from './tokenizer.js';
export class BracketTokens {
    constructor(map) {
        this.map = map;
        this.hasRegExp = false;
        this._regExpGlobal = null;
    }
    static createFromLanguage(configuration, denseKeyProvider) {
        function getId(languageId, openingText) {
            return denseKeyProvider.getKey(`${languageId}:::${openingText}`);
        }
        const brackets = configuration.characterPair.getColorizedBrackets();
        const closingBrackets = new Map();
        const openingBrackets = new Set();
        for (const [openingText, closingText] of brackets) {
            openingBrackets.add(openingText);
            let info = closingBrackets.get(closingText);
            const openingTextId = getId(configuration.languageId, openingText);
            if (!info) {
                info = { openingBrackets: SmallImmutableSet.getEmpty(), first: openingTextId };
                closingBrackets.set(closingText, info);
            }
            info.openingBrackets = info.openingBrackets.add(openingTextId, identityKeyProvider);
        }
        const map = new Map();
        for (const [closingText, info] of closingBrackets) {
            const length = toLength(0, closingText.length);
            map.set(closingText, new Token(length, 2 /* ClosingBracket */, info.first, info.openingBrackets, BracketAstNode.create(length, configuration.languageId, info.openingBrackets)));
        }
        for (const openingText of openingBrackets) {
            const length = toLength(0, openingText.length);
            const openingTextId = getId(configuration.languageId, openingText);
            const bracketIds = SmallImmutableSet.getEmpty().add(openingTextId, identityKeyProvider);
            map.set(openingText, new Token(length, 1 /* OpeningBracket */, openingTextId, bracketIds, BracketAstNode.create(length, configuration.languageId, bracketIds)));
        }
        return new BracketTokens(map);
    }
    getRegExpStr() {
        if (this.isEmpty) {
            return null;
        }
        else {
            const keys = [...this.map.keys()];
            keys.sort();
            keys.reverse();
            return keys.map(k => prepareBracketForRegExp(k)).join('|');
        }
    }
    /**
     * Returns null if there is no such regexp (because there are no brackets).
    */
    get regExpGlobal() {
        if (!this.hasRegExp) {
            const regExpStr = this.getRegExpStr();
            this._regExpGlobal = regExpStr ? new RegExp(regExpStr, 'g') : null;
            this.hasRegExp = true;
        }
        return this._regExpGlobal;
    }
    getToken(value) {
        return this.map.get(value);
    }
    findClosingTokenText(openingBracketIds) {
        for (const [closingText, info] of this.map) {
            if (info.bracketIds.intersects(openingBracketIds)) {
                return closingText;
            }
        }
        return undefined;
    }
    get isEmpty() {
        return this.map.size === 0;
    }
}
function prepareBracketForRegExp(str) {
    const escaped = escapeRegExpCharacters(str);
    // This bracket pair uses letters like e.g. "begin" - "end" (see https://github.com/microsoft/vscode/issues/132162)
    const needsWordBoundaries = (/^[\w ]+$/.test(str));
    return (needsWordBoundaries ? `\\b${escaped}\\b` : escaped);
}
export class LanguageAgnosticBracketTokens {
    constructor(denseKeyProvider, getLanguageConfiguration) {
        this.denseKeyProvider = denseKeyProvider;
        this.getLanguageConfiguration = getLanguageConfiguration;
        this.languageIdToBracketTokens = new Map();
    }
    didLanguageChange(languageId) {
        const existing = this.languageIdToBracketTokens.get(languageId);
        if (!existing) {
            return false;
        }
        const newRegExpStr = BracketTokens.createFromLanguage(this.getLanguageConfiguration(languageId), this.denseKeyProvider).getRegExpStr();
        return existing.getRegExpStr() !== newRegExpStr;
    }
    getSingleLanguageBracketTokens(languageId) {
        let singleLanguageBracketTokens = this.languageIdToBracketTokens.get(languageId);
        if (!singleLanguageBracketTokens) {
            singleLanguageBracketTokens = BracketTokens.createFromLanguage(this.getLanguageConfiguration(languageId), this.denseKeyProvider);
            this.languageIdToBracketTokens.set(languageId, singleLanguageBracketTokens);
        }
        return singleLanguageBracketTokens;
    }
}

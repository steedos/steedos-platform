/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { commonPrefixLength, commonSuffixLength } from '../../../../base/common/strings.js';
import { CoreEditingCommands } from '../../../browser/coreCommands.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { InlineCompletionTriggerKind } from '../../../common/languages.js';
import { BaseGhostTextWidgetModel } from './ghostText.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { inlineSuggestCommitId } from './consts.js';
import { inlineCompletionToGhostText } from './inlineCompletionToGhostText.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { fixBracketsInLine } from '../../../common/model/bracketPairsTextModelPart/fixBrackets.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
let InlineCompletionsModel = class InlineCompletionsModel extends Disposable {
    constructor(editor, cache, commandService, languageConfigurationService, languageFeaturesService, debounceService) {
        super();
        this.editor = editor;
        this.cache = cache;
        this.commandService = commandService;
        this.languageConfigurationService = languageConfigurationService;
        this.languageFeaturesService = languageFeaturesService;
        this.debounceService = debounceService;
        this.onDidChangeEmitter = new Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.completionSession = this._register(new MutableDisposable());
        this.active = false;
        this.disposed = false;
        this.debounceValue = this.debounceService.for(this.languageFeaturesService.inlineCompletionsProvider, 'InlineCompletionsDebounce', { min: 50, max: 200 });
        this._register(commandService.onDidExecuteCommand((e) => {
            // These commands don't trigger onDidType.
            const commands = new Set([
                CoreEditingCommands.Tab.id,
                CoreEditingCommands.DeleteLeft.id,
                CoreEditingCommands.DeleteRight.id,
                inlineSuggestCommitId,
                'acceptSelectedSuggestion',
            ]);
            if (commands.has(e.commandId) && editor.hasTextFocus()) {
                this.handleUserInput();
            }
        }));
        this._register(this.editor.onDidType((e) => {
            this.handleUserInput();
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            if (this.session && !this.session.isValid) {
                this.hide();
            }
        }));
        this._register(toDisposable(() => {
            this.disposed = true;
        }));
        this._register(this.editor.onDidBlurEditorWidget(() => {
            this.hide();
        }));
    }
    handleUserInput() {
        if (this.session && !this.session.isValid) {
            this.hide();
        }
        setTimeout(() => {
            if (this.disposed) {
                return;
            }
            // Wait for the cursor update that happens in the same iteration loop iteration
            this.startSessionIfTriggered();
        }, 0);
    }
    get session() {
        return this.completionSession.value;
    }
    get ghostText() {
        var _a;
        return (_a = this.session) === null || _a === void 0 ? void 0 : _a.ghostText;
    }
    get minReservedLineCount() {
        return this.session ? this.session.minReservedLineCount : 0;
    }
    setExpanded(expanded) {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.setExpanded(expanded);
    }
    setActive(active) {
        var _a;
        this.active = active;
        if (active) {
            (_a = this.session) === null || _a === void 0 ? void 0 : _a.scheduleAutomaticUpdate();
        }
    }
    startSessionIfTriggered() {
        const suggestOptions = this.editor.getOption(55 /* inlineSuggest */);
        if (!suggestOptions.enabled) {
            return;
        }
        if (this.session && this.session.isValid) {
            return;
        }
        this.trigger(InlineCompletionTriggerKind.Automatic);
    }
    trigger(triggerKind) {
        if (this.completionSession.value) {
            if (triggerKind === InlineCompletionTriggerKind.Explicit) {
                void this.completionSession.value.ensureUpdateWithExplicitContext();
            }
            return;
        }
        this.completionSession.value = new InlineCompletionsSession(this.editor, this.editor.getPosition(), () => this.active, this.commandService, this.cache, triggerKind, this.languageConfigurationService, this.languageFeaturesService.inlineCompletionsProvider, this.debounceValue);
        this.completionSession.value.takeOwnership(this.completionSession.value.onDidChange(() => {
            this.onDidChangeEmitter.fire();
        }));
    }
    hide() {
        this.completionSession.clear();
        this.onDidChangeEmitter.fire();
    }
    commitCurrentSuggestion() {
        var _a;
        // Don't dispose the session, so that after committing, more suggestions are shown.
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.commitCurrentCompletion();
    }
    showNext() {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.showNextInlineCompletion();
    }
    showPrevious() {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.showPreviousInlineCompletion();
    }
    hasMultipleInlineCompletions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ((_a = this.session) === null || _a === void 0 ? void 0 : _a.hasMultipleInlineCompletions());
            return result !== undefined ? result : false;
        });
    }
};
InlineCompletionsModel = __decorate([
    __param(2, ICommandService),
    __param(3, ILanguageConfigurationService),
    __param(4, ILanguageFeaturesService),
    __param(5, ILanguageFeatureDebounceService)
], InlineCompletionsModel);
export { InlineCompletionsModel };
export class InlineCompletionsSession extends BaseGhostTextWidgetModel {
    constructor(editor, triggerPosition, shouldUpdate, commandService, cache, initialTriggerKind, languageConfigurationService, registry, debounce) {
        super(editor);
        this.triggerPosition = triggerPosition;
        this.shouldUpdate = shouldUpdate;
        this.commandService = commandService;
        this.cache = cache;
        this.initialTriggerKind = initialTriggerKind;
        this.languageConfigurationService = languageConfigurationService;
        this.registry = registry;
        this.debounce = debounce;
        this.minReservedLineCount = 0;
        this.updateOperation = this._register(new MutableDisposable());
        this.updateSoon = this._register(new RunOnceScheduler(() => {
            let triggerKind = this.initialTriggerKind;
            // All subsequent triggers are automatic.
            this.initialTriggerKind = InlineCompletionTriggerKind.Automatic;
            return this.update(triggerKind);
        }, 50));
        //#region Selection
        // We use a semantic id to track the selection even if the cache changes.
        this.currentlySelectedCompletionId = undefined;
        let lastCompletionItem = undefined;
        this._register(this.onDidChange(() => {
            const currentCompletion = this.currentCompletion;
            if (currentCompletion && currentCompletion.sourceInlineCompletion !== lastCompletionItem) {
                lastCompletionItem = currentCompletion.sourceInlineCompletion;
                const provider = currentCompletion.sourceProvider;
                if (provider.handleItemDidShow) {
                    provider.handleItemDidShow(currentCompletion.sourceInlineCompletions, lastCompletionItem);
                }
            }
        }));
        this._register(toDisposable(() => {
            this.cache.clear();
        }));
        this._register(this.editor.onDidChangeCursorPosition((e) => {
            if (this.cache.value) {
                this.onDidChangeEmitter.fire();
            }
        }));
        this._register(this.editor.onDidChangeModelContent((e) => {
            this.scheduleAutomaticUpdate();
        }));
        this._register(this.registry.onDidChange(() => {
            this.updateSoon.schedule(this.debounce.get(this.editor.getModel()));
        }));
        this.scheduleAutomaticUpdate();
    }
    fixAndGetIndexOfCurrentSelection() {
        if (!this.currentlySelectedCompletionId || !this.cache.value) {
            return 0;
        }
        if (this.cache.value.completions.length === 0) {
            // don't reset the selection in this case
            return 0;
        }
        const idx = this.cache.value.completions.findIndex(v => v.semanticId === this.currentlySelectedCompletionId);
        if (idx === -1) {
            // Reset the selection so that the selection does not jump back when it appears again
            this.currentlySelectedCompletionId = undefined;
            return 0;
        }
        return idx;
    }
    get currentCachedCompletion() {
        if (!this.cache.value) {
            return undefined;
        }
        return this.cache.value.completions[this.fixAndGetIndexOfCurrentSelection()];
    }
    showNextInlineCompletion() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUpdateWithExplicitContext();
            const completions = ((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.completions) || [];
            if (completions.length > 0) {
                const newIdx = (this.fixAndGetIndexOfCurrentSelection() + 1) % completions.length;
                this.currentlySelectedCompletionId = completions[newIdx].semanticId;
            }
            else {
                this.currentlySelectedCompletionId = undefined;
            }
            this.onDidChangeEmitter.fire();
        });
    }
    showPreviousInlineCompletion() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUpdateWithExplicitContext();
            const completions = ((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.completions) || [];
            if (completions.length > 0) {
                const newIdx = (this.fixAndGetIndexOfCurrentSelection() + completions.length - 1) % completions.length;
                this.currentlySelectedCompletionId = completions[newIdx].semanticId;
            }
            else {
                this.currentlySelectedCompletionId = undefined;
            }
            this.onDidChangeEmitter.fire();
        });
    }
    ensureUpdateWithExplicitContext() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.updateOperation.value) {
                // Restart or wait for current update operation
                if (this.updateOperation.value.triggerKind === InlineCompletionTriggerKind.Explicit) {
                    yield this.updateOperation.value.promise;
                }
                else {
                    yield this.update(InlineCompletionTriggerKind.Explicit);
                }
            }
            else if (((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.triggerKind) !== InlineCompletionTriggerKind.Explicit) {
                // Refresh cache
                yield this.update(InlineCompletionTriggerKind.Explicit);
            }
        });
    }
    hasMultipleInlineCompletions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUpdateWithExplicitContext();
            return (((_a = this.cache.value) === null || _a === void 0 ? void 0 : _a.completions.length) || 0) > 1;
        });
    }
    //#endregion
    get ghostText() {
        const currentCompletion = this.currentCompletion;
        const mode = this.editor.getOptions().get(55 /* inlineSuggest */).mode;
        return currentCompletion ? inlineCompletionToGhostText(currentCompletion, this.editor.getModel(), mode, this.editor.getPosition()) : undefined;
    }
    get currentCompletion() {
        const completion = this.currentCachedCompletion;
        if (!completion) {
            return undefined;
        }
        return completion.toLiveInlineCompletion();
    }
    get isValid() {
        return this.editor.getPosition().lineNumber === this.triggerPosition.lineNumber;
    }
    scheduleAutomaticUpdate() {
        // Since updateSoon debounces, starvation can happen.
        // To prevent stale cache, we clear the current update operation.
        this.updateOperation.clear();
        this.updateSoon.schedule(this.debounce.get(this.editor.getModel()));
    }
    update(triggerKind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldUpdate()) {
                return;
            }
            const position = this.editor.getPosition();
            const startTime = new Date();
            const promise = createCancelablePromise((token) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield provideInlineCompletions(this.registry, position, this.editor.getModel(), { triggerKind, selectedSuggestionInfo: undefined }, token, this.languageConfigurationService);
                    const endTime = new Date();
                    this.debounce.update(this.editor.getModel(), endTime.getTime() - startTime.getTime());
                }
                catch (e) {
                    onUnexpectedError(e);
                    return;
                }
                if (token.isCancellationRequested) {
                    return;
                }
                this.cache.setValue(this.editor, result, triggerKind);
                this.onDidChangeEmitter.fire();
            }));
            const operation = new UpdateOperation(promise, triggerKind);
            this.updateOperation.value = operation;
            yield promise;
            if (this.updateOperation.value === operation) {
                this.updateOperation.clear();
            }
        });
    }
    takeOwnership(disposable) {
        this._register(disposable);
    }
    commitCurrentCompletion() {
        if (!this.ghostText) {
            // No ghost text was shown for this completion.
            // Thus, we don't want to commit anything.
            return;
        }
        const completion = this.currentCompletion;
        if (completion) {
            this.commit(completion);
        }
    }
    commit(completion) {
        // Mark the cache as stale, but don't dispose it yet,
        // otherwise command args might get disposed.
        const cache = this.cache.clearAndLeak();
        this.editor.executeEdits('inlineSuggestion.accept', [
            EditOperation.replaceMove(completion.range, completion.text)
        ]);
        if (completion.command) {
            this.commandService
                .executeCommand(completion.command.id, ...(completion.command.arguments || []))
                .finally(() => {
                cache === null || cache === void 0 ? void 0 : cache.dispose();
            })
                .then(undefined, onUnexpectedExternalError);
        }
        else {
            cache === null || cache === void 0 ? void 0 : cache.dispose();
        }
        this.onDidChangeEmitter.fire();
    }
}
export class UpdateOperation {
    constructor(promise, triggerKind) {
        this.promise = promise;
        this.triggerKind = triggerKind;
    }
    dispose() {
        this.promise.cancel();
    }
}
/**
 * The cache keeps itself in sync with the editor.
 * It also owns the completions result and disposes it when the cache is diposed.
*/
export class SynchronizedInlineCompletionsCache extends Disposable {
    constructor(editor, completionsSource, onChange, triggerKind) {
        super();
        this.triggerKind = triggerKind;
        const decorationIds = editor.deltaDecorations([], completionsSource.items.map(i => ({
            range: i.range,
            options: {
                description: 'inline-completion-tracking-range'
            },
        })));
        this._register(toDisposable(() => {
            editor.deltaDecorations(decorationIds, []);
        }));
        this.completions = completionsSource.items.map((c, idx) => new CachedInlineCompletion(c, decorationIds[idx]));
        this._register(editor.onDidChangeModelContent(() => {
            let hasChanged = false;
            const model = editor.getModel();
            for (const c of this.completions) {
                const newRange = model.getDecorationRange(c.decorationId);
                if (!newRange) {
                    onUnexpectedError(new Error('Decoration has no range'));
                    continue;
                }
                if (!c.synchronizedRange.equalsRange(newRange)) {
                    hasChanged = true;
                    c.synchronizedRange = newRange;
                }
            }
            if (hasChanged) {
                onChange();
            }
        }));
        this._register(completionsSource);
    }
}
class CachedInlineCompletion {
    constructor(inlineCompletion, decorationId) {
        this.inlineCompletion = inlineCompletion;
        this.decorationId = decorationId;
        this.semanticId = JSON.stringify({
            text: this.inlineCompletion.text,
            startLine: this.inlineCompletion.range.startLineNumber,
            startColumn: this.inlineCompletion.range.startColumn,
            command: this.inlineCompletion.command
        });
        this.synchronizedRange = inlineCompletion.range;
    }
    toLiveInlineCompletion() {
        return {
            text: this.inlineCompletion.text,
            range: this.synchronizedRange,
            command: this.inlineCompletion.command,
            sourceProvider: this.inlineCompletion.sourceProvider,
            sourceInlineCompletions: this.inlineCompletion.sourceInlineCompletions,
            sourceInlineCompletion: this.inlineCompletion.sourceInlineCompletion,
        };
    }
}
function getDefaultRange(position, model) {
    const word = model.getWordAtPosition(position);
    const maxColumn = model.getLineMaxColumn(position.lineNumber);
    // By default, always replace up until the end of the current line.
    // This default might be subject to change!
    return word
        ? new Range(position.lineNumber, word.startColumn, position.lineNumber, maxColumn)
        : Range.fromPositions(position, position.with(undefined, maxColumn));
}
export function provideInlineCompletions(registry, position, model, context, token = CancellationToken.None, languageConfigurationService) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultReplaceRange = getDefaultRange(position, model);
        const providers = registry.all(model);
        const results = yield Promise.all(providers.map((provider) => __awaiter(this, void 0, void 0, function* () {
            const completions = yield Promise.resolve(provider.provideInlineCompletions(model, position, context, token)).catch(onUnexpectedExternalError);
            return ({
                completions,
                provider,
                dispose: () => {
                    if (completions) {
                        provider.freeInlineCompletions(completions);
                    }
                }
            });
        })));
        const itemsByHash = new Map();
        for (const result of results) {
            const completions = result.completions;
            if (completions) {
                for (const item of completions.items) {
                    const range = item.range ? Range.lift(item.range) : defaultReplaceRange;
                    if (range.startLineNumber !== range.endLineNumber) {
                        // Ignore invalid ranges.
                        continue;
                    }
                    const text = languageConfigurationService && item.completeBracketPairs
                        ? closeBrackets(item.text, range.getStartPosition(), model, languageConfigurationService)
                        : item.text;
                    const trackedItem = ({
                        text,
                        range,
                        command: item.command,
                        sourceProvider: result.provider,
                        sourceInlineCompletions: completions,
                        sourceInlineCompletion: item
                    });
                    itemsByHash.set(JSON.stringify({ text, range: item.range }), trackedItem);
                }
            }
        }
        return {
            items: [...itemsByHash.values()],
            dispose: () => {
                for (const result of results) {
                    result.dispose();
                }
            },
        };
    });
}
function closeBrackets(text, position, model, languageConfigurationService) {
    const lineStart = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
    const newLine = lineStart + text;
    const newTokens = model.tokenizeLineWithEdit(position, newLine.length - (position.column - 1), text);
    const slicedTokens = newTokens === null || newTokens === void 0 ? void 0 : newTokens.sliceAndInflate(position.column - 1, newLine.length, 0);
    if (!slicedTokens) {
        return text;
    }
    console.log(slicedTokens);
    const newText = fixBracketsInLine(slicedTokens, languageConfigurationService);
    return newText;
}
export function minimizeInlineCompletion(model, inlineCompletion) {
    if (!inlineCompletion) {
        return inlineCompletion;
    }
    const valueToReplace = model.getValueInRange(inlineCompletion.range);
    const commonPrefixLen = commonPrefixLength(valueToReplace, inlineCompletion.text);
    const startOffset = model.getOffsetAt(inlineCompletion.range.getStartPosition()) + commonPrefixLen;
    const start = model.getPositionAt(startOffset);
    const remainingValueToReplace = valueToReplace.substr(commonPrefixLen);
    const commonSuffixLen = commonSuffixLength(remainingValueToReplace, inlineCompletion.text);
    const end = model.getPositionAt(Math.max(startOffset, model.getOffsetAt(inlineCompletion.range.getEndPosition()) - commonSuffixLen));
    return {
        range: Range.fromPositions(start, end),
        text: inlineCompletion.text.substr(commonPrefixLen, inlineCompletion.text.length - commonPrefixLen - commonSuffixLen),
    };
}

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
import { FindInput } from '../../../base/browser/ui/findinput/findInput.js';
import { ReplaceInput } from '../../../base/browser/ui/findinput/replaceInput.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';
import { KeybindingsRegistry } from '../../keybinding/common/keybindingsRegistry.js';
import { localize } from '../../../nls.js';
export const historyNavigationVisible = new RawContextKey('suggestWidgetVisible', false, localize('suggestWidgetVisible', "Whether suggestion are visible"));
export const HistoryNavigationWidgetContext = 'historyNavigationWidget';
const HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';
const HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';
function bindContextScopedWidget(contextKeyService, widget, contextKey) {
    new RawContextKey(contextKey, widget).bindTo(contextKeyService);
}
function createWidgetScopedContextKeyService(contextKeyService, widget) {
    return contextKeyService.createScoped(widget.target);
}
function getContextScopedWidget(contextKeyService, contextKey) {
    return contextKeyService.getContext(document.activeElement).getValue(contextKey);
}
export function createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, widget) {
    const scopedContextKeyService = createWidgetScopedContextKeyService(contextKeyService, widget);
    bindContextScopedWidget(scopedContextKeyService, widget, HistoryNavigationWidgetContext);
    const historyNavigationForwardsEnablement = new RawContextKey(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);
    const historyNavigationBackwardsEnablement = new RawContextKey(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);
    return {
        scopedContextKeyService,
        historyNavigationForwardsEnablement,
        historyNavigationBackwardsEnablement,
    };
}
let ContextScopedFindInput = class ContextScopedFindInput extends FindInput {
    constructor(container, contextViewProvider, options, contextKeyService, showFindOptions = false) {
        super(container, contextViewProvider, showFindOptions, options);
        this._register(createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, { target: this.inputBox.element, historyNavigator: this.inputBox }).scopedContextKeyService);
    }
};
ContextScopedFindInput = __decorate([
    __param(3, IContextKeyService)
], ContextScopedFindInput);
export { ContextScopedFindInput };
let ContextScopedReplaceInput = class ContextScopedReplaceInput extends ReplaceInput {
    constructor(container, contextViewProvider, options, contextKeyService, showReplaceOptions = false) {
        super(container, contextViewProvider, showReplaceOptions, options);
        this._register(createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, { target: this.inputBox.element, historyNavigator: this.inputBox }).scopedContextKeyService);
    }
};
ContextScopedReplaceInput = __decorate([
    __param(3, IContextKeyService)
], ContextScopedReplaceInput);
export { ContextScopedReplaceInput };
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'history.showPrevious',
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(ContextKeyExpr.has(HistoryNavigationWidgetContext), ContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true), historyNavigationVisible.isEqualTo(false)),
    primary: 16 /* UpArrow */,
    secondary: [512 /* Alt */ | 16 /* UpArrow */],
    handler: (accessor) => {
        const widget = getContextScopedWidget(accessor.get(IContextKeyService), HistoryNavigationWidgetContext);
        if (widget) {
            const historyInputBox = widget.historyNavigator;
            historyInputBox.showPreviousValue();
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'history.showNext',
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(ContextKeyExpr.has(HistoryNavigationWidgetContext), ContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true), historyNavigationVisible.isEqualTo(false)),
    primary: 18 /* DownArrow */,
    secondary: [512 /* Alt */ | 18 /* DownArrow */],
    handler: (accessor) => {
        const widget = getContextScopedWidget(accessor.get(IContextKeyService), HistoryNavigationWidgetContext);
        if (widget) {
            const historyInputBox = widget.historyNavigator;
            historyInputBox.showNextValue();
        }
    }
});

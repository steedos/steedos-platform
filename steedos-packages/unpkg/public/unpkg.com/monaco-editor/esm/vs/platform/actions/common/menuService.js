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
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Emitter } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IMenuService, isIMenuItem, MenuItemAction, MenuRegistry, SubmenuItemAction } from './actions.js';
import { ICommandService } from '../../commands/common/commands.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
let MenuService = class MenuService {
    constructor(_commandService) {
        this._commandService = _commandService;
        //
    }
    /**
     * Create a new menu for the given menu identifier. A menu sends events when it's entries
     * have changed (placement, enablement, checked-state). By default it does send events for
     * sub menu entries. That is more expensive and must be explicitly enabled with the
     * `emitEventsForSubmenuChanges` flag.
     */
    createMenu(id, contextKeyService, options) {
        return new Menu(id, Object.assign({ emitEventsForSubmenuChanges: false, eventDebounceDelay: 50 }, options), this._commandService, contextKeyService, this);
    }
};
MenuService = __decorate([
    __param(0, ICommandService)
], MenuService);
export { MenuService };
let Menu = class Menu {
    constructor(_id, _options, _commandService, _contextKeyService, _menuService) {
        this._id = _id;
        this._options = _options;
        this._commandService = _commandService;
        this._contextKeyService = _contextKeyService;
        this._menuService = _menuService;
        this._disposables = new DisposableStore();
        this._menuGroups = [];
        this._contextKeys = new Set();
        this._build();
        // Rebuild this menu whenever the menu registry reports an event for this MenuId.
        // This usually happen while code and extensions are loaded and affects the over
        // structure of the menu
        const rebuildMenuSoon = new RunOnceScheduler(() => {
            this._build();
            this._onDidChange.fire(this);
        }, _options.eventDebounceDelay);
        this._disposables.add(rebuildMenuSoon);
        this._disposables.add(MenuRegistry.onDidChangeMenu(e => {
            if (e.has(_id)) {
                rebuildMenuSoon.schedule();
            }
        }));
        // When context keys change we need to check if the menu also has changed. However,
        // we only do that when someone listens on this menu because (1) context key events are
        // firing often and (2) menu are often leaked
        const contextKeyListener = this._disposables.add(new DisposableStore());
        const startContextKeyListener = () => {
            const fireChangeSoon = new RunOnceScheduler(() => this._onDidChange.fire(this), _options.eventDebounceDelay);
            contextKeyListener.add(fireChangeSoon);
            contextKeyListener.add(_contextKeyService.onDidChangeContext(e => {
                if (e.affectsSome(this._contextKeys)) {
                    fireChangeSoon.schedule();
                }
            }));
        };
        this._onDidChange = new Emitter({
            // start/stop context key listener
            onFirstListenerAdd: startContextKeyListener,
            onLastListenerRemove: contextKeyListener.clear.bind(contextKeyListener)
        });
        this.onDidChange = this._onDidChange.event;
    }
    dispose() {
        this._disposables.dispose();
        this._onDidChange.dispose();
    }
    _build() {
        // reset
        this._menuGroups.length = 0;
        this._contextKeys.clear();
        const menuItems = MenuRegistry.getMenuItems(this._id);
        let group;
        menuItems.sort(Menu._compareMenuItems);
        for (const item of menuItems) {
            // group by groupId
            const groupName = item.group || '';
            if (!group || group[0] !== groupName) {
                group = [groupName, []];
                this._menuGroups.push(group);
            }
            group[1].push(item);
            // keep keys for eventing
            this._collectContextKeys(item);
        }
    }
    _collectContextKeys(item) {
        Menu._fillInKbExprKeys(item.when, this._contextKeys);
        if (isIMenuItem(item)) {
            // keep precondition keys for event if applicable
            if (item.command.precondition) {
                Menu._fillInKbExprKeys(item.command.precondition, this._contextKeys);
            }
            // keep toggled keys for event if applicable
            if (item.command.toggled) {
                const toggledExpression = item.command.toggled.condition || item.command.toggled;
                Menu._fillInKbExprKeys(toggledExpression, this._contextKeys);
            }
        }
        else if (this._options.emitEventsForSubmenuChanges) {
            // recursively collect context keys from submenus so that this
            // menu fires events when context key changes affect submenus
            MenuRegistry.getMenuItems(item.submenu).forEach(this._collectContextKeys, this);
        }
    }
    getActions(options) {
        const result = [];
        for (let group of this._menuGroups) {
            const [id, items] = group;
            const activeActions = [];
            for (const item of items) {
                if (this._contextKeyService.contextMatchesRules(item.when)) {
                    const action = isIMenuItem(item)
                        ? new MenuItemAction(item.command, item.alt, options, this._contextKeyService, this._commandService)
                        : new SubmenuItemAction(item, this._menuService, this._contextKeyService, options);
                    activeActions.push(action);
                }
            }
            if (activeActions.length > 0) {
                result.push([id, activeActions]);
            }
        }
        return result;
    }
    static _fillInKbExprKeys(exp, set) {
        if (exp) {
            for (let key of exp.keys()) {
                set.add(key);
            }
        }
    }
    static _compareMenuItems(a, b) {
        let aGroup = a.group;
        let bGroup = b.group;
        if (aGroup !== bGroup) {
            // Falsy groups come last
            if (!aGroup) {
                return 1;
            }
            else if (!bGroup) {
                return -1;
            }
            // 'navigation' group comes first
            if (aGroup === 'navigation') {
                return -1;
            }
            else if (bGroup === 'navigation') {
                return 1;
            }
            // lexical sort for groups
            let value = aGroup.localeCompare(bGroup);
            if (value !== 0) {
                return value;
            }
        }
        // sort on priority - default is 0
        let aPrio = a.order || 0;
        let bPrio = b.order || 0;
        if (aPrio < bPrio) {
            return -1;
        }
        else if (aPrio > bPrio) {
            return 1;
        }
        // sort on titles
        return Menu._compareTitles(isIMenuItem(a) ? a.command.title : a.title, isIMenuItem(b) ? b.command.title : b.title);
    }
    static _compareTitles(a, b) {
        const aStr = typeof a === 'string' ? a : a.original;
        const bStr = typeof b === 'string' ? b : b.original;
        return aStr.localeCompare(bStr);
    }
};
Menu = __decorate([
    __param(2, ICommandService),
    __param(3, IContextKeyService),
    __param(4, IMenuService)
], Menu);

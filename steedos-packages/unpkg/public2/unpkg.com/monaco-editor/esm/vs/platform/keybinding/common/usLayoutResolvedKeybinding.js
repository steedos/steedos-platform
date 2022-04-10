/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { KeyCodeUtils, IMMUTABLE_CODE_TO_KEY_CODE } from '../../../base/common/keyCodes.js';
import { ChordKeybinding, SimpleKeybinding } from '../../../base/common/keybindings.js';
import { BaseResolvedKeybinding } from './baseResolvedKeybinding.js';
import { removeElementsAfterNulls } from './resolvedKeybindingItem.js';
/**
 * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
 */
export class USLayoutResolvedKeybinding extends BaseResolvedKeybinding {
    constructor(actual, os) {
        super(os, actual.parts);
    }
    _keyCodeToUILabel(keyCode) {
        if (this._os === 2 /* Macintosh */) {
            switch (keyCode) {
                case 15 /* LeftArrow */:
                    return '←';
                case 16 /* UpArrow */:
                    return '↑';
                case 17 /* RightArrow */:
                    return '→';
                case 18 /* DownArrow */:
                    return '↓';
            }
        }
        return KeyCodeUtils.toString(keyCode);
    }
    _getLabel(keybinding) {
        if (keybinding.isDuplicateModifierCase()) {
            return '';
        }
        return this._keyCodeToUILabel(keybinding.keyCode);
    }
    _getAriaLabel(keybinding) {
        if (keybinding.isDuplicateModifierCase()) {
            return '';
        }
        return KeyCodeUtils.toString(keybinding.keyCode);
    }
    _getElectronAccelerator(keybinding) {
        return KeyCodeUtils.toElectronAccelerator(keybinding.keyCode);
    }
    _getDispatchPart(keybinding) {
        return USLayoutResolvedKeybinding.getDispatchStr(keybinding);
    }
    static getDispatchStr(keybinding) {
        if (keybinding.isModifierKey()) {
            return null;
        }
        let result = '';
        if (keybinding.ctrlKey) {
            result += 'ctrl+';
        }
        if (keybinding.shiftKey) {
            result += 'shift+';
        }
        if (keybinding.altKey) {
            result += 'alt+';
        }
        if (keybinding.metaKey) {
            result += 'meta+';
        }
        result += KeyCodeUtils.toString(keybinding.keyCode);
        return result;
    }
    _getSingleModifierDispatchPart(keybinding) {
        if (keybinding.keyCode === 5 /* Ctrl */ && !keybinding.shiftKey && !keybinding.altKey && !keybinding.metaKey) {
            return 'ctrl';
        }
        if (keybinding.keyCode === 4 /* Shift */ && !keybinding.ctrlKey && !keybinding.altKey && !keybinding.metaKey) {
            return 'shift';
        }
        if (keybinding.keyCode === 6 /* Alt */ && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.metaKey) {
            return 'alt';
        }
        if (keybinding.keyCode === 57 /* Meta */ && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.altKey) {
            return 'meta';
        }
        return null;
    }
    /**
     * *NOTE*: Check return value for `KeyCode.Unknown`.
     */
    static _scanCodeToKeyCode(scanCode) {
        const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
        if (immutableKeyCode !== -1 /* DependsOnKbLayout */) {
            return immutableKeyCode;
        }
        switch (scanCode) {
            case 10 /* KeyA */: return 31 /* KeyA */;
            case 11 /* KeyB */: return 32 /* KeyB */;
            case 12 /* KeyC */: return 33 /* KeyC */;
            case 13 /* KeyD */: return 34 /* KeyD */;
            case 14 /* KeyE */: return 35 /* KeyE */;
            case 15 /* KeyF */: return 36 /* KeyF */;
            case 16 /* KeyG */: return 37 /* KeyG */;
            case 17 /* KeyH */: return 38 /* KeyH */;
            case 18 /* KeyI */: return 39 /* KeyI */;
            case 19 /* KeyJ */: return 40 /* KeyJ */;
            case 20 /* KeyK */: return 41 /* KeyK */;
            case 21 /* KeyL */: return 42 /* KeyL */;
            case 22 /* KeyM */: return 43 /* KeyM */;
            case 23 /* KeyN */: return 44 /* KeyN */;
            case 24 /* KeyO */: return 45 /* KeyO */;
            case 25 /* KeyP */: return 46 /* KeyP */;
            case 26 /* KeyQ */: return 47 /* KeyQ */;
            case 27 /* KeyR */: return 48 /* KeyR */;
            case 28 /* KeyS */: return 49 /* KeyS */;
            case 29 /* KeyT */: return 50 /* KeyT */;
            case 30 /* KeyU */: return 51 /* KeyU */;
            case 31 /* KeyV */: return 52 /* KeyV */;
            case 32 /* KeyW */: return 53 /* KeyW */;
            case 33 /* KeyX */: return 54 /* KeyX */;
            case 34 /* KeyY */: return 55 /* KeyY */;
            case 35 /* KeyZ */: return 56 /* KeyZ */;
            case 36 /* Digit1 */: return 22 /* Digit1 */;
            case 37 /* Digit2 */: return 23 /* Digit2 */;
            case 38 /* Digit3 */: return 24 /* Digit3 */;
            case 39 /* Digit4 */: return 25 /* Digit4 */;
            case 40 /* Digit5 */: return 26 /* Digit5 */;
            case 41 /* Digit6 */: return 27 /* Digit6 */;
            case 42 /* Digit7 */: return 28 /* Digit7 */;
            case 43 /* Digit8 */: return 29 /* Digit8 */;
            case 44 /* Digit9 */: return 30 /* Digit9 */;
            case 45 /* Digit0 */: return 21 /* Digit0 */;
            case 51 /* Minus */: return 83 /* Minus */;
            case 52 /* Equal */: return 81 /* Equal */;
            case 53 /* BracketLeft */: return 87 /* BracketLeft */;
            case 54 /* BracketRight */: return 89 /* BracketRight */;
            case 55 /* Backslash */: return 88 /* Backslash */;
            case 56 /* IntlHash */: return 0 /* Unknown */; // missing
            case 57 /* Semicolon */: return 80 /* Semicolon */;
            case 58 /* Quote */: return 90 /* Quote */;
            case 59 /* Backquote */: return 86 /* Backquote */;
            case 60 /* Comma */: return 82 /* Comma */;
            case 61 /* Period */: return 84 /* Period */;
            case 62 /* Slash */: return 85 /* Slash */;
            case 106 /* IntlBackslash */: return 92 /* IntlBackslash */;
        }
        return 0 /* Unknown */;
    }
    static _resolveSimpleUserBinding(binding) {
        if (!binding) {
            return null;
        }
        if (binding instanceof SimpleKeybinding) {
            return binding;
        }
        const keyCode = this._scanCodeToKeyCode(binding.scanCode);
        if (keyCode === 0 /* Unknown */) {
            return null;
        }
        return new SimpleKeybinding(binding.ctrlKey, binding.shiftKey, binding.altKey, binding.metaKey, keyCode);
    }
    static resolveUserBinding(input, os) {
        const parts = removeElementsAfterNulls(input.map(keybinding => this._resolveSimpleUserBinding(keybinding)));
        if (parts.length > 0) {
            return [new USLayoutResolvedKeybinding(new ChordKeybinding(parts), os)];
        }
        return [];
    }
}

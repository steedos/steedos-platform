/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class KeyCodeStrMap {
    constructor() {
        this._keyCodeToStr = [];
        this._strToKeyCode = Object.create(null);
    }
    define(keyCode, str) {
        this._keyCodeToStr[keyCode] = str;
        this._strToKeyCode[str.toLowerCase()] = keyCode;
    }
    keyCodeToStr(keyCode) {
        return this._keyCodeToStr[keyCode];
    }
    strToKeyCode(str) {
        return this._strToKeyCode[str.toLowerCase()] || 0 /* Unknown */;
    }
}
const uiMap = new KeyCodeStrMap();
const userSettingsUSMap = new KeyCodeStrMap();
const userSettingsGeneralMap = new KeyCodeStrMap();
export const EVENT_KEY_CODE_MAP = new Array(230);
export const NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE = {};
const scanCodeIntToStr = [];
const scanCodeStrToInt = Object.create(null);
const scanCodeLowerCaseStrToInt = Object.create(null);
/**
 * -1 if a ScanCode => KeyCode mapping depends on kb layout.
 */
export const IMMUTABLE_CODE_TO_KEY_CODE = [];
/**
 * -1 if a KeyCode => ScanCode mapping depends on kb layout.
 */
export const IMMUTABLE_KEY_CODE_TO_CODE = [];
for (let i = 0; i <= 193 /* MAX_VALUE */; i++) {
    IMMUTABLE_CODE_TO_KEY_CODE[i] = -1 /* DependsOnKbLayout */;
}
for (let i = 0; i <= 127 /* MAX_VALUE */; i++) {
    IMMUTABLE_KEY_CODE_TO_CODE[i] = -1 /* DependsOnKbLayout */;
}
(function () {
    // See https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
    // See https://github.com/microsoft/node-native-keymap/blob/master/deps/chromium/keyboard_codes_win.h
    const empty = '';
    const mappings = [
        // keyCodeOrd, immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel
        [0, 1, 0 /* None */, 'None', 0 /* Unknown */, 'unknown', 0, 'VK_UNKNOWN', empty, empty],
        [0, 1, 1 /* Hyper */, 'Hyper', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 2 /* Super */, 'Super', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 3 /* Fn */, 'Fn', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 4 /* FnLock */, 'FnLock', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 5 /* Suspend */, 'Suspend', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 6 /* Resume */, 'Resume', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 7 /* Turbo */, 'Turbo', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 8 /* Sleep */, 'Sleep', 0 /* Unknown */, empty, 0, 'VK_SLEEP', empty, empty],
        [0, 1, 9 /* WakeUp */, 'WakeUp', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [31, 0, 10 /* KeyA */, 'KeyA', 31 /* KeyA */, 'A', 65, 'VK_A', empty, empty],
        [32, 0, 11 /* KeyB */, 'KeyB', 32 /* KeyB */, 'B', 66, 'VK_B', empty, empty],
        [33, 0, 12 /* KeyC */, 'KeyC', 33 /* KeyC */, 'C', 67, 'VK_C', empty, empty],
        [34, 0, 13 /* KeyD */, 'KeyD', 34 /* KeyD */, 'D', 68, 'VK_D', empty, empty],
        [35, 0, 14 /* KeyE */, 'KeyE', 35 /* KeyE */, 'E', 69, 'VK_E', empty, empty],
        [36, 0, 15 /* KeyF */, 'KeyF', 36 /* KeyF */, 'F', 70, 'VK_F', empty, empty],
        [37, 0, 16 /* KeyG */, 'KeyG', 37 /* KeyG */, 'G', 71, 'VK_G', empty, empty],
        [38, 0, 17 /* KeyH */, 'KeyH', 38 /* KeyH */, 'H', 72, 'VK_H', empty, empty],
        [39, 0, 18 /* KeyI */, 'KeyI', 39 /* KeyI */, 'I', 73, 'VK_I', empty, empty],
        [40, 0, 19 /* KeyJ */, 'KeyJ', 40 /* KeyJ */, 'J', 74, 'VK_J', empty, empty],
        [41, 0, 20 /* KeyK */, 'KeyK', 41 /* KeyK */, 'K', 75, 'VK_K', empty, empty],
        [42, 0, 21 /* KeyL */, 'KeyL', 42 /* KeyL */, 'L', 76, 'VK_L', empty, empty],
        [43, 0, 22 /* KeyM */, 'KeyM', 43 /* KeyM */, 'M', 77, 'VK_M', empty, empty],
        [44, 0, 23 /* KeyN */, 'KeyN', 44 /* KeyN */, 'N', 78, 'VK_N', empty, empty],
        [45, 0, 24 /* KeyO */, 'KeyO', 45 /* KeyO */, 'O', 79, 'VK_O', empty, empty],
        [46, 0, 25 /* KeyP */, 'KeyP', 46 /* KeyP */, 'P', 80, 'VK_P', empty, empty],
        [47, 0, 26 /* KeyQ */, 'KeyQ', 47 /* KeyQ */, 'Q', 81, 'VK_Q', empty, empty],
        [48, 0, 27 /* KeyR */, 'KeyR', 48 /* KeyR */, 'R', 82, 'VK_R', empty, empty],
        [49, 0, 28 /* KeyS */, 'KeyS', 49 /* KeyS */, 'S', 83, 'VK_S', empty, empty],
        [50, 0, 29 /* KeyT */, 'KeyT', 50 /* KeyT */, 'T', 84, 'VK_T', empty, empty],
        [51, 0, 30 /* KeyU */, 'KeyU', 51 /* KeyU */, 'U', 85, 'VK_U', empty, empty],
        [52, 0, 31 /* KeyV */, 'KeyV', 52 /* KeyV */, 'V', 86, 'VK_V', empty, empty],
        [53, 0, 32 /* KeyW */, 'KeyW', 53 /* KeyW */, 'W', 87, 'VK_W', empty, empty],
        [54, 0, 33 /* KeyX */, 'KeyX', 54 /* KeyX */, 'X', 88, 'VK_X', empty, empty],
        [55, 0, 34 /* KeyY */, 'KeyY', 55 /* KeyY */, 'Y', 89, 'VK_Y', empty, empty],
        [56, 0, 35 /* KeyZ */, 'KeyZ', 56 /* KeyZ */, 'Z', 90, 'VK_Z', empty, empty],
        [22, 0, 36 /* Digit1 */, 'Digit1', 22 /* Digit1 */, '1', 49, 'VK_1', empty, empty],
        [23, 0, 37 /* Digit2 */, 'Digit2', 23 /* Digit2 */, '2', 50, 'VK_2', empty, empty],
        [24, 0, 38 /* Digit3 */, 'Digit3', 24 /* Digit3 */, '3', 51, 'VK_3', empty, empty],
        [25, 0, 39 /* Digit4 */, 'Digit4', 25 /* Digit4 */, '4', 52, 'VK_4', empty, empty],
        [26, 0, 40 /* Digit5 */, 'Digit5', 26 /* Digit5 */, '5', 53, 'VK_5', empty, empty],
        [27, 0, 41 /* Digit6 */, 'Digit6', 27 /* Digit6 */, '6', 54, 'VK_6', empty, empty],
        [28, 0, 42 /* Digit7 */, 'Digit7', 28 /* Digit7 */, '7', 55, 'VK_7', empty, empty],
        [29, 0, 43 /* Digit8 */, 'Digit8', 29 /* Digit8 */, '8', 56, 'VK_8', empty, empty],
        [30, 0, 44 /* Digit9 */, 'Digit9', 30 /* Digit9 */, '9', 57, 'VK_9', empty, empty],
        [21, 0, 45 /* Digit0 */, 'Digit0', 21 /* Digit0 */, '0', 48, 'VK_0', empty, empty],
        [3, 1, 46 /* Enter */, 'Enter', 3 /* Enter */, 'Enter', 13, 'VK_RETURN', empty, empty],
        [9, 1, 47 /* Escape */, 'Escape', 9 /* Escape */, 'Escape', 27, 'VK_ESCAPE', empty, empty],
        [1, 1, 48 /* Backspace */, 'Backspace', 1 /* Backspace */, 'Backspace', 8, 'VK_BACK', empty, empty],
        [2, 1, 49 /* Tab */, 'Tab', 2 /* Tab */, 'Tab', 9, 'VK_TAB', empty, empty],
        [10, 1, 50 /* Space */, 'Space', 10 /* Space */, 'Space', 32, 'VK_SPACE', empty, empty],
        [83, 0, 51 /* Minus */, 'Minus', 83 /* Minus */, '-', 189, 'VK_OEM_MINUS', '-', 'OEM_MINUS'],
        [81, 0, 52 /* Equal */, 'Equal', 81 /* Equal */, '=', 187, 'VK_OEM_PLUS', '=', 'OEM_PLUS'],
        [87, 0, 53 /* BracketLeft */, 'BracketLeft', 87 /* BracketLeft */, '[', 219, 'VK_OEM_4', '[', 'OEM_4'],
        [89, 0, 54 /* BracketRight */, 'BracketRight', 89 /* BracketRight */, ']', 221, 'VK_OEM_6', ']', 'OEM_6'],
        [88, 0, 55 /* Backslash */, 'Backslash', 88 /* Backslash */, '\\', 220, 'VK_OEM_5', '\\', 'OEM_5'],
        [0, 0, 56 /* IntlHash */, 'IntlHash', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [80, 0, 57 /* Semicolon */, 'Semicolon', 80 /* Semicolon */, ';', 186, 'VK_OEM_1', ';', 'OEM_1'],
        [90, 0, 58 /* Quote */, 'Quote', 90 /* Quote */, '\'', 222, 'VK_OEM_7', '\'', 'OEM_7'],
        [86, 0, 59 /* Backquote */, 'Backquote', 86 /* Backquote */, '`', 192, 'VK_OEM_3', '`', 'OEM_3'],
        [82, 0, 60 /* Comma */, 'Comma', 82 /* Comma */, ',', 188, 'VK_OEM_COMMA', ',', 'OEM_COMMA'],
        [84, 0, 61 /* Period */, 'Period', 84 /* Period */, '.', 190, 'VK_OEM_PERIOD', '.', 'OEM_PERIOD'],
        [85, 0, 62 /* Slash */, 'Slash', 85 /* Slash */, '/', 191, 'VK_OEM_2', '/', 'OEM_2'],
        [8, 1, 63 /* CapsLock */, 'CapsLock', 8 /* CapsLock */, 'CapsLock', 20, 'VK_CAPITAL', empty, empty],
        [59, 1, 64 /* F1 */, 'F1', 59 /* F1 */, 'F1', 112, 'VK_F1', empty, empty],
        [60, 1, 65 /* F2 */, 'F2', 60 /* F2 */, 'F2', 113, 'VK_F2', empty, empty],
        [61, 1, 66 /* F3 */, 'F3', 61 /* F3 */, 'F3', 114, 'VK_F3', empty, empty],
        [62, 1, 67 /* F4 */, 'F4', 62 /* F4 */, 'F4', 115, 'VK_F4', empty, empty],
        [63, 1, 68 /* F5 */, 'F5', 63 /* F5 */, 'F5', 116, 'VK_F5', empty, empty],
        [64, 1, 69 /* F6 */, 'F6', 64 /* F6 */, 'F6', 117, 'VK_F6', empty, empty],
        [65, 1, 70 /* F7 */, 'F7', 65 /* F7 */, 'F7', 118, 'VK_F7', empty, empty],
        [66, 1, 71 /* F8 */, 'F8', 66 /* F8 */, 'F8', 119, 'VK_F8', empty, empty],
        [67, 1, 72 /* F9 */, 'F9', 67 /* F9 */, 'F9', 120, 'VK_F9', empty, empty],
        [68, 1, 73 /* F10 */, 'F10', 68 /* F10 */, 'F10', 121, 'VK_F10', empty, empty],
        [69, 1, 74 /* F11 */, 'F11', 69 /* F11 */, 'F11', 122, 'VK_F11', empty, empty],
        [70, 1, 75 /* F12 */, 'F12', 70 /* F12 */, 'F12', 123, 'VK_F12', empty, empty],
        [0, 1, 76 /* PrintScreen */, 'PrintScreen', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [79, 1, 77 /* ScrollLock */, 'ScrollLock', 79 /* ScrollLock */, 'ScrollLock', 145, 'VK_SCROLL', empty, empty],
        [7, 1, 78 /* Pause */, 'Pause', 7 /* PauseBreak */, 'PauseBreak', 19, 'VK_PAUSE', empty, empty],
        [19, 1, 79 /* Insert */, 'Insert', 19 /* Insert */, 'Insert', 45, 'VK_INSERT', empty, empty],
        [14, 1, 80 /* Home */, 'Home', 14 /* Home */, 'Home', 36, 'VK_HOME', empty, empty],
        [11, 1, 81 /* PageUp */, 'PageUp', 11 /* PageUp */, 'PageUp', 33, 'VK_PRIOR', empty, empty],
        [20, 1, 82 /* Delete */, 'Delete', 20 /* Delete */, 'Delete', 46, 'VK_DELETE', empty, empty],
        [13, 1, 83 /* End */, 'End', 13 /* End */, 'End', 35, 'VK_END', empty, empty],
        [12, 1, 84 /* PageDown */, 'PageDown', 12 /* PageDown */, 'PageDown', 34, 'VK_NEXT', empty, empty],
        [17, 1, 85 /* ArrowRight */, 'ArrowRight', 17 /* RightArrow */, 'RightArrow', 39, 'VK_RIGHT', 'Right', empty],
        [15, 1, 86 /* ArrowLeft */, 'ArrowLeft', 15 /* LeftArrow */, 'LeftArrow', 37, 'VK_LEFT', 'Left', empty],
        [18, 1, 87 /* ArrowDown */, 'ArrowDown', 18 /* DownArrow */, 'DownArrow', 40, 'VK_DOWN', 'Down', empty],
        [16, 1, 88 /* ArrowUp */, 'ArrowUp', 16 /* UpArrow */, 'UpArrow', 38, 'VK_UP', 'Up', empty],
        [78, 1, 89 /* NumLock */, 'NumLock', 78 /* NumLock */, 'NumLock', 144, 'VK_NUMLOCK', empty, empty],
        [108, 1, 90 /* NumpadDivide */, 'NumpadDivide', 108 /* NumpadDivide */, 'NumPad_Divide', 111, 'VK_DIVIDE', empty, empty],
        [103, 1, 91 /* NumpadMultiply */, 'NumpadMultiply', 103 /* NumpadMultiply */, 'NumPad_Multiply', 106, 'VK_MULTIPLY', empty, empty],
        [106, 1, 92 /* NumpadSubtract */, 'NumpadSubtract', 106 /* NumpadSubtract */, 'NumPad_Subtract', 109, 'VK_SUBTRACT', empty, empty],
        [104, 1, 93 /* NumpadAdd */, 'NumpadAdd', 104 /* NumpadAdd */, 'NumPad_Add', 107, 'VK_ADD', empty, empty],
        [3, 1, 94 /* NumpadEnter */, 'NumpadEnter', 3 /* Enter */, empty, 0, empty, empty, empty],
        [94, 1, 95 /* Numpad1 */, 'Numpad1', 94 /* Numpad1 */, 'NumPad1', 97, 'VK_NUMPAD1', empty, empty],
        [95, 1, 96 /* Numpad2 */, 'Numpad2', 95 /* Numpad2 */, 'NumPad2', 98, 'VK_NUMPAD2', empty, empty],
        [96, 1, 97 /* Numpad3 */, 'Numpad3', 96 /* Numpad3 */, 'NumPad3', 99, 'VK_NUMPAD3', empty, empty],
        [97, 1, 98 /* Numpad4 */, 'Numpad4', 97 /* Numpad4 */, 'NumPad4', 100, 'VK_NUMPAD4', empty, empty],
        [98, 1, 99 /* Numpad5 */, 'Numpad5', 98 /* Numpad5 */, 'NumPad5', 101, 'VK_NUMPAD5', empty, empty],
        [99, 1, 100 /* Numpad6 */, 'Numpad6', 99 /* Numpad6 */, 'NumPad6', 102, 'VK_NUMPAD6', empty, empty],
        [100, 1, 101 /* Numpad7 */, 'Numpad7', 100 /* Numpad7 */, 'NumPad7', 103, 'VK_NUMPAD7', empty, empty],
        [101, 1, 102 /* Numpad8 */, 'Numpad8', 101 /* Numpad8 */, 'NumPad8', 104, 'VK_NUMPAD8', empty, empty],
        [102, 1, 103 /* Numpad9 */, 'Numpad9', 102 /* Numpad9 */, 'NumPad9', 105, 'VK_NUMPAD9', empty, empty],
        [93, 1, 104 /* Numpad0 */, 'Numpad0', 93 /* Numpad0 */, 'NumPad0', 96, 'VK_NUMPAD0', empty, empty],
        [107, 1, 105 /* NumpadDecimal */, 'NumpadDecimal', 107 /* NumpadDecimal */, 'NumPad_Decimal', 110, 'VK_DECIMAL', empty, empty],
        [92, 0, 106 /* IntlBackslash */, 'IntlBackslash', 92 /* IntlBackslash */, 'OEM_102', 226, 'VK_OEM_102', empty, empty],
        [58, 1, 107 /* ContextMenu */, 'ContextMenu', 58 /* ContextMenu */, 'ContextMenu', 93, empty, empty, empty],
        [0, 1, 108 /* Power */, 'Power', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 109 /* NumpadEqual */, 'NumpadEqual', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [71, 1, 110 /* F13 */, 'F13', 71 /* F13 */, 'F13', 124, 'VK_F13', empty, empty],
        [72, 1, 111 /* F14 */, 'F14', 72 /* F14 */, 'F14', 125, 'VK_F14', empty, empty],
        [73, 1, 112 /* F15 */, 'F15', 73 /* F15 */, 'F15', 126, 'VK_F15', empty, empty],
        [74, 1, 113 /* F16 */, 'F16', 74 /* F16 */, 'F16', 127, 'VK_F16', empty, empty],
        [75, 1, 114 /* F17 */, 'F17', 75 /* F17 */, 'F17', 128, 'VK_F17', empty, empty],
        [76, 1, 115 /* F18 */, 'F18', 76 /* F18 */, 'F18', 129, 'VK_F18', empty, empty],
        [77, 1, 116 /* F19 */, 'F19', 77 /* F19 */, 'F19', 130, 'VK_F19', empty, empty],
        [0, 1, 117 /* F20 */, 'F20', 0 /* Unknown */, empty, 0, 'VK_F20', empty, empty],
        [0, 1, 118 /* F21 */, 'F21', 0 /* Unknown */, empty, 0, 'VK_F21', empty, empty],
        [0, 1, 119 /* F22 */, 'F22', 0 /* Unknown */, empty, 0, 'VK_F22', empty, empty],
        [0, 1, 120 /* F23 */, 'F23', 0 /* Unknown */, empty, 0, 'VK_F23', empty, empty],
        [0, 1, 121 /* F24 */, 'F24', 0 /* Unknown */, empty, 0, 'VK_F24', empty, empty],
        [0, 1, 122 /* Open */, 'Open', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 123 /* Help */, 'Help', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 124 /* Select */, 'Select', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 125 /* Again */, 'Again', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 126 /* Undo */, 'Undo', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 127 /* Cut */, 'Cut', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 128 /* Copy */, 'Copy', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 129 /* Paste */, 'Paste', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 130 /* Find */, 'Find', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 131 /* AudioVolumeMute */, 'AudioVolumeMute', 112 /* AudioVolumeMute */, 'AudioVolumeMute', 173, 'VK_VOLUME_MUTE', empty, empty],
        [0, 1, 132 /* AudioVolumeUp */, 'AudioVolumeUp', 113 /* AudioVolumeUp */, 'AudioVolumeUp', 175, 'VK_VOLUME_UP', empty, empty],
        [0, 1, 133 /* AudioVolumeDown */, 'AudioVolumeDown', 114 /* AudioVolumeDown */, 'AudioVolumeDown', 174, 'VK_VOLUME_DOWN', empty, empty],
        [105, 1, 134 /* NumpadComma */, 'NumpadComma', 105 /* NUMPAD_SEPARATOR */, 'NumPad_Separator', 108, 'VK_SEPARATOR', empty, empty],
        [110, 0, 135 /* IntlRo */, 'IntlRo', 110 /* ABNT_C1 */, 'ABNT_C1', 193, 'VK_ABNT_C1', empty, empty],
        [0, 1, 136 /* KanaMode */, 'KanaMode', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 0, 137 /* IntlYen */, 'IntlYen', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 138 /* Convert */, 'Convert', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 139 /* NonConvert */, 'NonConvert', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 140 /* Lang1 */, 'Lang1', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 141 /* Lang2 */, 'Lang2', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 142 /* Lang3 */, 'Lang3', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 143 /* Lang4 */, 'Lang4', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 144 /* Lang5 */, 'Lang5', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 145 /* Abort */, 'Abort', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 146 /* Props */, 'Props', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 147 /* NumpadParenLeft */, 'NumpadParenLeft', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 148 /* NumpadParenRight */, 'NumpadParenRight', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 149 /* NumpadBackspace */, 'NumpadBackspace', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 150 /* NumpadMemoryStore */, 'NumpadMemoryStore', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 151 /* NumpadMemoryRecall */, 'NumpadMemoryRecall', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 152 /* NumpadMemoryClear */, 'NumpadMemoryClear', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 153 /* NumpadMemoryAdd */, 'NumpadMemoryAdd', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 154 /* NumpadMemorySubtract */, 'NumpadMemorySubtract', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 155 /* NumpadClear */, 'NumpadClear', 126 /* Clear */, 'Clear', 12, 'VK_CLEAR', empty, empty],
        [0, 1, 156 /* NumpadClearEntry */, 'NumpadClearEntry', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [5, 1, 0 /* None */, empty, 5 /* Ctrl */, 'Ctrl', 17, 'VK_CONTROL', empty, empty],
        [4, 1, 0 /* None */, empty, 4 /* Shift */, 'Shift', 16, 'VK_SHIFT', empty, empty],
        [6, 1, 0 /* None */, empty, 6 /* Alt */, 'Alt', 18, 'VK_MENU', empty, empty],
        [57, 1, 0 /* None */, empty, 57 /* Meta */, 'Meta', 0, 'VK_COMMAND', empty, empty],
        [5, 1, 157 /* ControlLeft */, 'ControlLeft', 5 /* Ctrl */, empty, 0, 'VK_LCONTROL', empty, empty],
        [4, 1, 158 /* ShiftLeft */, 'ShiftLeft', 4 /* Shift */, empty, 0, 'VK_LSHIFT', empty, empty],
        [6, 1, 159 /* AltLeft */, 'AltLeft', 6 /* Alt */, empty, 0, 'VK_LMENU', empty, empty],
        [57, 1, 160 /* MetaLeft */, 'MetaLeft', 57 /* Meta */, empty, 0, 'VK_LWIN', empty, empty],
        [5, 1, 161 /* ControlRight */, 'ControlRight', 5 /* Ctrl */, empty, 0, 'VK_RCONTROL', empty, empty],
        [4, 1, 162 /* ShiftRight */, 'ShiftRight', 4 /* Shift */, empty, 0, 'VK_RSHIFT', empty, empty],
        [6, 1, 163 /* AltRight */, 'AltRight', 6 /* Alt */, empty, 0, 'VK_RMENU', empty, empty],
        [57, 1, 164 /* MetaRight */, 'MetaRight', 57 /* Meta */, empty, 0, 'VK_RWIN', empty, empty],
        [0, 1, 165 /* BrightnessUp */, 'BrightnessUp', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 166 /* BrightnessDown */, 'BrightnessDown', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 167 /* MediaPlay */, 'MediaPlay', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 168 /* MediaRecord */, 'MediaRecord', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 169 /* MediaFastForward */, 'MediaFastForward', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 170 /* MediaRewind */, 'MediaRewind', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [114, 1, 171 /* MediaTrackNext */, 'MediaTrackNext', 119 /* MediaTrackNext */, 'MediaTrackNext', 176, 'VK_MEDIA_NEXT_TRACK', empty, empty],
        [115, 1, 172 /* MediaTrackPrevious */, 'MediaTrackPrevious', 120 /* MediaTrackPrevious */, 'MediaTrackPrevious', 177, 'VK_MEDIA_PREV_TRACK', empty, empty],
        [116, 1, 173 /* MediaStop */, 'MediaStop', 121 /* MediaStop */, 'MediaStop', 178, 'VK_MEDIA_STOP', empty, empty],
        [0, 1, 174 /* Eject */, 'Eject', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [117, 1, 175 /* MediaPlayPause */, 'MediaPlayPause', 122 /* MediaPlayPause */, 'MediaPlayPause', 179, 'VK_MEDIA_PLAY_PAUSE', empty, empty],
        [0, 1, 176 /* MediaSelect */, 'MediaSelect', 123 /* LaunchMediaPlayer */, 'LaunchMediaPlayer', 181, 'VK_MEDIA_LAUNCH_MEDIA_SELECT', empty, empty],
        [0, 1, 177 /* LaunchMail */, 'LaunchMail', 124 /* LaunchMail */, 'LaunchMail', 180, 'VK_MEDIA_LAUNCH_MAIL', empty, empty],
        [0, 1, 178 /* LaunchApp2 */, 'LaunchApp2', 125 /* LaunchApp2 */, 'LaunchApp2', 183, 'VK_MEDIA_LAUNCH_APP2', empty, empty],
        [0, 1, 179 /* LaunchApp1 */, 'LaunchApp1', 0 /* Unknown */, empty, 0, 'VK_MEDIA_LAUNCH_APP1', empty, empty],
        [0, 1, 180 /* SelectTask */, 'SelectTask', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 181 /* LaunchScreenSaver */, 'LaunchScreenSaver', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 182 /* BrowserSearch */, 'BrowserSearch', 115 /* BrowserSearch */, 'BrowserSearch', 170, 'VK_BROWSER_SEARCH', empty, empty],
        [0, 1, 183 /* BrowserHome */, 'BrowserHome', 116 /* BrowserHome */, 'BrowserHome', 172, 'VK_BROWSER_HOME', empty, empty],
        [112, 1, 184 /* BrowserBack */, 'BrowserBack', 117 /* BrowserBack */, 'BrowserBack', 166, 'VK_BROWSER_BACK', empty, empty],
        [113, 1, 185 /* BrowserForward */, 'BrowserForward', 118 /* BrowserForward */, 'BrowserForward', 167, 'VK_BROWSER_FORWARD', empty, empty],
        [0, 1, 186 /* BrowserStop */, 'BrowserStop', 0 /* Unknown */, empty, 0, 'VK_BROWSER_STOP', empty, empty],
        [0, 1, 187 /* BrowserRefresh */, 'BrowserRefresh', 0 /* Unknown */, empty, 0, 'VK_BROWSER_REFRESH', empty, empty],
        [0, 1, 188 /* BrowserFavorites */, 'BrowserFavorites', 0 /* Unknown */, empty, 0, 'VK_BROWSER_FAVORITES', empty, empty],
        [0, 1, 189 /* ZoomToggle */, 'ZoomToggle', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 190 /* MailReply */, 'MailReply', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 191 /* MailForward */, 'MailForward', 0 /* Unknown */, empty, 0, empty, empty, empty],
        [0, 1, 192 /* MailSend */, 'MailSend', 0 /* Unknown */, empty, 0, empty, empty, empty],
        // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
        // If an Input Method Editor is processing key input and the event is keydown, return 229.
        [109, 1, 0 /* None */, empty, 109 /* KEY_IN_COMPOSITION */, 'KeyInComposition', 229, empty, empty, empty],
        [111, 1, 0 /* None */, empty, 111 /* ABNT_C2 */, 'ABNT_C2', 194, 'VK_ABNT_C2', empty, empty],
        [91, 1, 0 /* None */, empty, 91 /* OEM_8 */, 'OEM_8', 223, 'VK_OEM_8', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_KANA', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_HANGUL', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_JUNJA', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_FINAL', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_HANJA', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_KANJI', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_CONVERT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_NONCONVERT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_ACCEPT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_MODECHANGE', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_SELECT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_PRINT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_EXECUTE', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_SNAPSHOT', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_HELP', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_APPS', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_PROCESSKEY', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_PACKET', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_DBE_SBCSCHAR', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_DBE_DBCSCHAR', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_ATTN', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_CRSEL', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_EXSEL', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_EREOF', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_PLAY', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_ZOOM', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_NONAME', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_PA1', empty, empty],
        [0, 1, 0 /* None */, empty, 0 /* Unknown */, empty, 0, 'VK_OEM_CLEAR', empty, empty],
    ];
    let seenKeyCode = [];
    let seenScanCode = [];
    for (const mapping of mappings) {
        const [_keyCodeOrd, immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel] = mapping;
        if (!seenScanCode[scanCode]) {
            seenScanCode[scanCode] = true;
            scanCodeIntToStr[scanCode] = scanCodeStr;
            scanCodeStrToInt[scanCodeStr] = scanCode;
            scanCodeLowerCaseStrToInt[scanCodeStr.toLowerCase()] = scanCode;
            if (immutable) {
                IMMUTABLE_CODE_TO_KEY_CODE[scanCode] = keyCode;
                if ((keyCode !== 0 /* Unknown */)
                    && (keyCode !== 3 /* Enter */)
                    && (keyCode !== 5 /* Ctrl */)
                    && (keyCode !== 4 /* Shift */)
                    && (keyCode !== 6 /* Alt */)
                    && (keyCode !== 57 /* Meta */)) {
                    IMMUTABLE_KEY_CODE_TO_CODE[keyCode] = scanCode;
                }
            }
        }
        if (!seenKeyCode[keyCode]) {
            seenKeyCode[keyCode] = true;
            if (!keyCodeStr) {
                throw new Error(`String representation missing for key code ${keyCode} around scan code ${scanCodeStr}`);
            }
            uiMap.define(keyCode, keyCodeStr);
            userSettingsUSMap.define(keyCode, usUserSettingsLabel || keyCodeStr);
            userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel || usUserSettingsLabel || keyCodeStr);
        }
        if (eventKeyCode) {
            EVENT_KEY_CODE_MAP[eventKeyCode] = keyCode;
        }
        if (vkey) {
            NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[vkey] = keyCode;
        }
    }
    // Manually added due to the exclusion above (due to duplication with NumpadEnter)
    IMMUTABLE_KEY_CODE_TO_CODE[3 /* Enter */] = 46 /* Enter */;
})();
export var KeyCodeUtils;
(function (KeyCodeUtils) {
    function toString(keyCode) {
        return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toString = toString;
    function fromString(key) {
        return uiMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromString = fromString;
    function toUserSettingsUS(keyCode) {
        return userSettingsUSMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsUS = toUserSettingsUS;
    function toUserSettingsGeneral(keyCode) {
        return userSettingsGeneralMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsGeneral = toUserSettingsGeneral;
    function fromUserSettings(key) {
        return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromUserSettings = fromUserSettings;
    function toElectronAccelerator(keyCode) {
        if (keyCode >= 93 /* Numpad0 */ && keyCode <= 108 /* NumpadDivide */) {
            // [Electron Accelerators] Electron is able to parse numpad keys, but unfortunately it
            // renders them just as regular keys in menus. For example, num0 is rendered as "0",
            // numdiv is rendered as "/", numsub is rendered as "-".
            //
            // This can lead to incredible confusion, as it makes numpad based keybindings indistinguishable
            // from keybindings based on regular keys.
            //
            // We therefore need to fall back to custom rendering for numpad keys.
            return null;
        }
        switch (keyCode) {
            case 16 /* UpArrow */:
                return 'Up';
            case 18 /* DownArrow */:
                return 'Down';
            case 15 /* LeftArrow */:
                return 'Left';
            case 17 /* RightArrow */:
                return 'Right';
        }
        return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toElectronAccelerator = toElectronAccelerator;
})(KeyCodeUtils || (KeyCodeUtils = {}));
export function KeyChord(firstPart, secondPart) {
    const chordPart = ((secondPart & 0x0000FFFF) << 16) >>> 0;
    return (firstPart | chordPart) >>> 0;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../base/common/uri.js';
import { Range } from './core/range.js';
import { TokenizationRegistry as TokenizationRegistryImpl } from './tokenizationRegistry.js';
import { Codicon } from '../../base/common/codicons.js';
/**
 * @internal
 */
export class TokenMetadata {
    static getLanguageId(metadata) {
        return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
    }
    static getTokenType(metadata) {
        return (metadata & 768 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
    }
    static getFontStyle(metadata) {
        return (metadata & 15360 /* FONT_STYLE_MASK */) >>> 10 /* FONT_STYLE_OFFSET */;
    }
    static getForeground(metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    }
    static getBackground(metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    }
    static getClassNameFromMetadata(metadata) {
        const foreground = this.getForeground(metadata);
        let className = 'mtk' + foreground;
        const fontStyle = this.getFontStyle(metadata);
        if (fontStyle & 1 /* Italic */) {
            className += ' mtki';
        }
        if (fontStyle & 2 /* Bold */) {
            className += ' mtkb';
        }
        if (fontStyle & 4 /* Underline */) {
            className += ' mtku';
        }
        if (fontStyle & 8 /* Strikethrough */) {
            className += ' mtks';
        }
        return className;
    }
    static getInlineStyleFromMetadata(metadata, colorMap) {
        const foreground = this.getForeground(metadata);
        const fontStyle = this.getFontStyle(metadata);
        let result = `color: ${colorMap[foreground]};`;
        if (fontStyle & 1 /* Italic */) {
            result += 'font-style: italic;';
        }
        if (fontStyle & 2 /* Bold */) {
            result += 'font-weight: bold;';
        }
        let textDecoration = '';
        if (fontStyle & 4 /* Underline */) {
            textDecoration += ' underline';
        }
        if (fontStyle & 8 /* Strikethrough */) {
            textDecoration += ' line-through';
        }
        if (textDecoration) {
            result += `text-decoration:${textDecoration};`;
        }
        return result;
    }
    static getPresentationFromMetadata(metadata) {
        const foreground = this.getForeground(metadata);
        const fontStyle = this.getFontStyle(metadata);
        return {
            foreground: foreground,
            italic: Boolean(fontStyle & 1 /* Italic */),
            bold: Boolean(fontStyle & 2 /* Bold */),
            underline: Boolean(fontStyle & 4 /* Underline */),
            strikethrough: Boolean(fontStyle & 8 /* Strikethrough */),
        };
    }
}
export class Token {
    constructor(offset, type, language) {
        this._tokenBrand = undefined;
        this.offset = offset;
        this.type = type;
        this.language = language;
    }
    toString() {
        return '(' + this.offset + ', ' + this.type + ')';
    }
}
/**
 * @internal
 */
export class TokenizationResult {
    constructor(tokens, endState) {
        this._tokenizationResultBrand = undefined;
        this.tokens = tokens;
        this.endState = endState;
    }
}
/**
 * @internal
 */
export class EncodedTokenizationResult {
    constructor(tokens, endState) {
        this._encodedTokenizationResultBrand = undefined;
        this.tokens = tokens;
        this.endState = endState;
    }
}
/**
 * @internal
 */
export var CompletionItemKinds;
(function (CompletionItemKinds) {
    const byKind = new Map();
    byKind.set(0 /* Method */, Codicon.symbolMethod);
    byKind.set(1 /* Function */, Codicon.symbolFunction);
    byKind.set(2 /* Constructor */, Codicon.symbolConstructor);
    byKind.set(3 /* Field */, Codicon.symbolField);
    byKind.set(4 /* Variable */, Codicon.symbolVariable);
    byKind.set(5 /* Class */, Codicon.symbolClass);
    byKind.set(6 /* Struct */, Codicon.symbolStruct);
    byKind.set(7 /* Interface */, Codicon.symbolInterface);
    byKind.set(8 /* Module */, Codicon.symbolModule);
    byKind.set(9 /* Property */, Codicon.symbolProperty);
    byKind.set(10 /* Event */, Codicon.symbolEvent);
    byKind.set(11 /* Operator */, Codicon.symbolOperator);
    byKind.set(12 /* Unit */, Codicon.symbolUnit);
    byKind.set(13 /* Value */, Codicon.symbolValue);
    byKind.set(15 /* Enum */, Codicon.symbolEnum);
    byKind.set(14 /* Constant */, Codicon.symbolConstant);
    byKind.set(15 /* Enum */, Codicon.symbolEnum);
    byKind.set(16 /* EnumMember */, Codicon.symbolEnumMember);
    byKind.set(17 /* Keyword */, Codicon.symbolKeyword);
    byKind.set(27 /* Snippet */, Codicon.symbolSnippet);
    byKind.set(18 /* Text */, Codicon.symbolText);
    byKind.set(19 /* Color */, Codicon.symbolColor);
    byKind.set(20 /* File */, Codicon.symbolFile);
    byKind.set(21 /* Reference */, Codicon.symbolReference);
    byKind.set(22 /* Customcolor */, Codicon.symbolCustomColor);
    byKind.set(23 /* Folder */, Codicon.symbolFolder);
    byKind.set(24 /* TypeParameter */, Codicon.symbolTypeParameter);
    byKind.set(25 /* User */, Codicon.account);
    byKind.set(26 /* Issue */, Codicon.issues);
    /**
     * @internal
     */
    function toIcon(kind) {
        let codicon = byKind.get(kind);
        if (!codicon) {
            console.info('No codicon found for CompletionItemKind ' + kind);
            codicon = Codicon.symbolProperty;
        }
        return codicon;
    }
    CompletionItemKinds.toIcon = toIcon;
    const data = new Map();
    data.set('method', 0 /* Method */);
    data.set('function', 1 /* Function */);
    data.set('constructor', 2 /* Constructor */);
    data.set('field', 3 /* Field */);
    data.set('variable', 4 /* Variable */);
    data.set('class', 5 /* Class */);
    data.set('struct', 6 /* Struct */);
    data.set('interface', 7 /* Interface */);
    data.set('module', 8 /* Module */);
    data.set('property', 9 /* Property */);
    data.set('event', 10 /* Event */);
    data.set('operator', 11 /* Operator */);
    data.set('unit', 12 /* Unit */);
    data.set('value', 13 /* Value */);
    data.set('constant', 14 /* Constant */);
    data.set('enum', 15 /* Enum */);
    data.set('enum-member', 16 /* EnumMember */);
    data.set('enumMember', 16 /* EnumMember */);
    data.set('keyword', 17 /* Keyword */);
    data.set('snippet', 27 /* Snippet */);
    data.set('text', 18 /* Text */);
    data.set('color', 19 /* Color */);
    data.set('file', 20 /* File */);
    data.set('reference', 21 /* Reference */);
    data.set('customcolor', 22 /* Customcolor */);
    data.set('folder', 23 /* Folder */);
    data.set('type-parameter', 24 /* TypeParameter */);
    data.set('typeParameter', 24 /* TypeParameter */);
    data.set('account', 25 /* User */);
    data.set('issue', 26 /* Issue */);
    /**
     * @internal
     */
    function fromString(value, strict) {
        let res = data.get(value);
        if (typeof res === 'undefined' && !strict) {
            res = 9 /* Property */;
        }
        return res;
    }
    CompletionItemKinds.fromString = fromString;
})(CompletionItemKinds || (CompletionItemKinds = {}));
/**
 * How an {@link InlineCompletionsProvider inline completion provider} was triggered.
 */
export var InlineCompletionTriggerKind;
(function (InlineCompletionTriggerKind) {
    /**
     * Completion was triggered automatically while editing.
     * It is sufficient to return a single completion item in this case.
     */
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Automatic"] = 0] = "Automatic";
    /**
     * Completion was triggered explicitly by a user gesture.
     * Return multiple completion items to enable cycling through them.
     */
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Explicit"] = 1] = "Explicit";
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
export var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (SignatureHelpTriggerKind = {}));
/**
 * A document highlight kind.
 */
export var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * @internal
 */
export function isLocationLink(thing) {
    return thing
        && URI.isUri(thing.uri)
        && Range.isIRange(thing.range)
        && (Range.isIRange(thing.originSelectionRange) || Range.isIRange(thing.targetSelectionRange));
}
/**
 * @internal
 */
export var SymbolKinds;
(function (SymbolKinds) {
    const byKind = new Map();
    byKind.set(0 /* File */, Codicon.symbolFile);
    byKind.set(1 /* Module */, Codicon.symbolModule);
    byKind.set(2 /* Namespace */, Codicon.symbolNamespace);
    byKind.set(3 /* Package */, Codicon.symbolPackage);
    byKind.set(4 /* Class */, Codicon.symbolClass);
    byKind.set(5 /* Method */, Codicon.symbolMethod);
    byKind.set(6 /* Property */, Codicon.symbolProperty);
    byKind.set(7 /* Field */, Codicon.symbolField);
    byKind.set(8 /* Constructor */, Codicon.symbolConstructor);
    byKind.set(9 /* Enum */, Codicon.symbolEnum);
    byKind.set(10 /* Interface */, Codicon.symbolInterface);
    byKind.set(11 /* Function */, Codicon.symbolFunction);
    byKind.set(12 /* Variable */, Codicon.symbolVariable);
    byKind.set(13 /* Constant */, Codicon.symbolConstant);
    byKind.set(14 /* String */, Codicon.symbolString);
    byKind.set(15 /* Number */, Codicon.symbolNumber);
    byKind.set(16 /* Boolean */, Codicon.symbolBoolean);
    byKind.set(17 /* Array */, Codicon.symbolArray);
    byKind.set(18 /* Object */, Codicon.symbolObject);
    byKind.set(19 /* Key */, Codicon.symbolKey);
    byKind.set(20 /* Null */, Codicon.symbolNull);
    byKind.set(21 /* EnumMember */, Codicon.symbolEnumMember);
    byKind.set(22 /* Struct */, Codicon.symbolStruct);
    byKind.set(23 /* Event */, Codicon.symbolEvent);
    byKind.set(24 /* Operator */, Codicon.symbolOperator);
    byKind.set(25 /* TypeParameter */, Codicon.symbolTypeParameter);
    /**
     * @internal
     */
    function toIcon(kind) {
        let icon = byKind.get(kind);
        if (!icon) {
            console.info('No codicon found for SymbolKind ' + kind);
            icon = Codicon.symbolProperty;
        }
        return icon;
    }
    SymbolKinds.toIcon = toIcon;
})(SymbolKinds || (SymbolKinds = {}));
export class FoldingRangeKind {
    /**
     * Creates a new {@link FoldingRangeKind}.
     *
     * @param value of the kind.
     */
    constructor(value) {
        this.value = value;
    }
}
/**
 * Kind for folding range representing a comment. The value of the kind is 'comment'.
 */
FoldingRangeKind.Comment = new FoldingRangeKind('comment');
/**
 * Kind for folding range representing a import. The value of the kind is 'imports'.
 */
FoldingRangeKind.Imports = new FoldingRangeKind('imports');
/**
 * Kind for folding range representing regions (for example marked by `#region`, `#endregion`).
 * The value of the kind is 'region'.
 */
FoldingRangeKind.Region = new FoldingRangeKind('region');
/**
 * @internal
 */
export var Command;
(function (Command) {
    /**
     * @internal
     */
    function is(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        return typeof obj.id === 'string' &&
            typeof obj.title === 'string';
    }
    Command.is = is;
})(Command || (Command = {}));
export var InlayHintKind;
(function (InlayHintKind) {
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
})(InlayHintKind || (InlayHintKind = {}));
/**
 * @internal
 */
export const TokenizationRegistry = new TokenizationRegistryImpl();

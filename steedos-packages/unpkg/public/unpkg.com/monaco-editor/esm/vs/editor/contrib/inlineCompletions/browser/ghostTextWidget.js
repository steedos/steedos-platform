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
var _a;
import * as dom from '../../../../base/browser/dom.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import './ghostText.css';
import { applyFontInfo } from '../../../browser/config/domFontInfo.js';
import { EditorFontLigatures } from '../../../common/config/editorOptions.js';
import { LineTokens } from '../../../common/tokens/lineTokens.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { createStringBuilder } from '../../../common/core/stringBuilder.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { ghostTextBackground, ghostTextBorder, ghostTextForeground } from '../../../common/core/editorColorRegistry.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
const ttPolicy = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('editorGhostText', { createHTML: value => value });
let GhostTextWidget = class GhostTextWidget extends Disposable {
    constructor(editor, model, instantiationService, languageService) {
        super();
        this.editor = editor;
        this.model = model;
        this.instantiationService = instantiationService;
        this.languageService = languageService;
        this.disposed = false;
        this.partsWidget = this._register(this.instantiationService.createInstance(DecorationsWidget, this.editor));
        this.additionalLinesWidget = this._register(new AdditionalLinesWidget(this.editor, this.languageService.languageIdCodec));
        this.viewMoreContentWidget = undefined;
        this._register(this.editor.onDidChangeConfiguration((e) => {
            if (e.hasChanged(29 /* disableMonospaceOptimizations */)
                || e.hasChanged(105 /* stopRenderingLineAfter */)
                || e.hasChanged(88 /* renderWhitespace */)
                || e.hasChanged(83 /* renderControlCharacters */)
                || e.hasChanged(45 /* fontLigatures */)
                || e.hasChanged(44 /* fontInfo */)
                || e.hasChanged(59 /* lineHeight */)) {
                this.update();
            }
        }));
        this._register(toDisposable(() => {
            var _a;
            this.disposed = true;
            this.update();
            (_a = this.viewMoreContentWidget) === null || _a === void 0 ? void 0 : _a.dispose();
            this.viewMoreContentWidget = undefined;
        }));
        this._register(model.onDidChange(() => {
            this.update();
        }));
        this.update();
    }
    shouldShowHoverAtViewZone(viewZoneId) {
        return (this.additionalLinesWidget.viewZoneId === viewZoneId);
    }
    update() {
        var _a;
        const ghostText = this.model.ghostText;
        if (!this.editor.hasModel() || !ghostText || this.disposed) {
            this.partsWidget.clear();
            this.additionalLinesWidget.clear();
            return;
        }
        const inlineTexts = new Array();
        const additionalLines = new Array();
        function addToAdditionalLines(lines, className) {
            if (additionalLines.length > 0) {
                const lastLine = additionalLines[additionalLines.length - 1];
                if (className) {
                    lastLine.decorations.push(new LineDecoration(lastLine.content.length + 1, lastLine.content.length + 1 + lines[0].length, className, 0 /* Regular */));
                }
                lastLine.content += lines[0];
                lines = lines.slice(1);
            }
            for (const line of lines) {
                additionalLines.push({
                    content: line,
                    decorations: className ? [new LineDecoration(1, line.length + 1, className, 0 /* Regular */)] : []
                });
            }
        }
        const textBufferLine = this.editor.getModel().getLineContent(ghostText.lineNumber);
        this.editor.getModel().getLineTokens(ghostText.lineNumber);
        let hiddenTextStartColumn = undefined;
        let lastIdx = 0;
        for (const part of ghostText.parts) {
            let lines = part.lines;
            if (hiddenTextStartColumn === undefined) {
                inlineTexts.push({
                    column: part.column,
                    text: lines[0],
                    preview: part.preview,
                });
                lines = lines.slice(1);
            }
            else {
                addToAdditionalLines([textBufferLine.substring(lastIdx, part.column - 1)], undefined);
            }
            if (lines.length > 0) {
                addToAdditionalLines(lines, 'ghost-text');
                if (hiddenTextStartColumn === undefined && part.column <= textBufferLine.length) {
                    hiddenTextStartColumn = part.column;
                }
            }
            lastIdx = part.column - 1;
        }
        if (hiddenTextStartColumn !== undefined) {
            addToAdditionalLines([textBufferLine.substring(lastIdx)], undefined);
        }
        this.partsWidget.setParts(ghostText.lineNumber, inlineTexts, hiddenTextStartColumn !== undefined ? { column: hiddenTextStartColumn, length: textBufferLine.length + 1 - hiddenTextStartColumn } : undefined);
        this.additionalLinesWidget.updateLines(ghostText.lineNumber, additionalLines, ghostText.additionalReservedLineCount);
        if (ghostText.parts.some(p => p.lines.length < 0)) {
            // Not supported at the moment, condition is always false.
            this.viewMoreContentWidget = this.renderViewMoreLines(new Position(ghostText.lineNumber, this.editor.getModel().getLineMaxColumn(ghostText.lineNumber)), '', 0);
        }
        else {
            (_a = this.viewMoreContentWidget) === null || _a === void 0 ? void 0 : _a.dispose();
            this.viewMoreContentWidget = undefined;
        }
    }
    renderViewMoreLines(position, firstLineText, remainingLinesLength) {
        const fontInfo = this.editor.getOption(44 /* fontInfo */);
        const domNode = document.createElement('div');
        domNode.className = 'suggest-preview-additional-widget';
        applyFontInfo(domNode, fontInfo);
        const spacer = document.createElement('span');
        spacer.className = 'content-spacer';
        spacer.append(firstLineText);
        domNode.append(spacer);
        const newline = document.createElement('span');
        newline.className = 'content-newline suggest-preview-text';
        newline.append('⏎  ');
        domNode.append(newline);
        const disposableStore = new DisposableStore();
        const button = document.createElement('div');
        button.className = 'button suggest-preview-text';
        button.append(`+${remainingLinesLength} lines…`);
        disposableStore.add(dom.addStandardDisposableListener(button, 'mousedown', (e) => {
            var _a;
            (_a = this.model) === null || _a === void 0 ? void 0 : _a.setExpanded(true);
            e.preventDefault();
            this.editor.focus();
        }));
        domNode.append(button);
        return new ViewMoreLinesContentWidget(this.editor, position, domNode, disposableStore);
    }
};
GhostTextWidget = __decorate([
    __param(2, IInstantiationService),
    __param(3, ILanguageService)
], GhostTextWidget);
export { GhostTextWidget };
class DecorationsWidget {
    constructor(editor) {
        this.editor = editor;
        this.decorationIds = [];
        this.disposableStore = new DisposableStore();
    }
    dispose() {
        this.clear();
        this.disposableStore.dispose();
    }
    clear() {
        this.editor.deltaDecorations(this.decorationIds, []);
        this.disposableStore.clear();
    }
    setParts(lineNumber, parts, hiddenText) {
        this.disposableStore.clear();
        const textModel = this.editor.getModel();
        if (!textModel) {
            return;
        }
        const hiddenTextDecorations = new Array();
        if (hiddenText) {
            hiddenTextDecorations.push({
                range: Range.fromPositions(new Position(lineNumber, hiddenText.column), new Position(lineNumber, hiddenText.column + hiddenText.length)),
                options: {
                    inlineClassName: 'ghost-text-hidden',
                    description: 'ghost-text-hidden'
                }
            });
        }
        this.decorationIds = this.editor.deltaDecorations(this.decorationIds, parts.map(p => {
            return ({
                range: Range.fromPositions(new Position(lineNumber, p.column)),
                options: {
                    description: 'ghost-text',
                    after: { content: p.text, inlineClassName: p.preview ? 'ghost-text-decoration-preview' : 'ghost-text-decoration' },
                    showIfCollapsed: true,
                }
            });
        }).concat(hiddenTextDecorations));
    }
}
class AdditionalLinesWidget {
    constructor(editor, languageIdCodec) {
        this.editor = editor;
        this.languageIdCodec = languageIdCodec;
        this._viewZoneId = undefined;
    }
    get viewZoneId() { return this._viewZoneId; }
    dispose() {
        this.clear();
    }
    clear() {
        this.editor.changeViewZones((changeAccessor) => {
            if (this._viewZoneId) {
                changeAccessor.removeZone(this._viewZoneId);
                this._viewZoneId = undefined;
            }
        });
    }
    updateLines(lineNumber, additionalLines, minReservedLineCount) {
        const textModel = this.editor.getModel();
        if (!textModel) {
            return;
        }
        const { tabSize } = textModel.getOptions();
        this.editor.changeViewZones((changeAccessor) => {
            if (this._viewZoneId) {
                changeAccessor.removeZone(this._viewZoneId);
                this._viewZoneId = undefined;
            }
            const heightInLines = Math.max(additionalLines.length, minReservedLineCount);
            if (heightInLines > 0) {
                const domNode = document.createElement('div');
                renderLines(domNode, tabSize, additionalLines, this.editor.getOptions(), this.languageIdCodec);
                this._viewZoneId = changeAccessor.addZone({
                    afterLineNumber: lineNumber,
                    heightInLines: heightInLines,
                    domNode,
                    afterColumnAffinity: 1 /* Right */
                });
            }
        });
    }
}
function renderLines(domNode, tabSize, lines, opts, languageIdCodec) {
    const disableMonospaceOptimizations = opts.get(29 /* disableMonospaceOptimizations */);
    const stopRenderingLineAfter = opts.get(105 /* stopRenderingLineAfter */);
    // To avoid visual confusion, we don't want to render visible whitespace
    const renderWhitespace = 'none';
    const renderControlCharacters = opts.get(83 /* renderControlCharacters */);
    const fontLigatures = opts.get(45 /* fontLigatures */);
    const fontInfo = opts.get(44 /* fontInfo */);
    const lineHeight = opts.get(59 /* lineHeight */);
    const sb = createStringBuilder(10000);
    sb.appendASCIIString('<div class="suggest-preview-text">');
    for (let i = 0, len = lines.length; i < len; i++) {
        const lineData = lines[i];
        const line = lineData.content;
        sb.appendASCIIString('<div class="view-line');
        sb.appendASCIIString('" style="top:');
        sb.appendASCIIString(String(i * lineHeight));
        sb.appendASCIIString('px;width:1000000px;">');
        const isBasicASCII = strings.isBasicASCII(line);
        const containsRTL = strings.containsRTL(line);
        const lineTokens = LineTokens.createEmpty(line, languageIdCodec);
        renderViewLine(new RenderLineInput((fontInfo.isMonospace && !disableMonospaceOptimizations), fontInfo.canUseHalfwidthRightwardsArrow, line, false, isBasicASCII, containsRTL, 0, lineTokens, lineData.decorations, tabSize, 0, fontInfo.spaceWidth, fontInfo.middotWidth, fontInfo.wsmiddotWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures !== EditorFontLigatures.OFF, null), sb);
        sb.appendASCIIString('</div>');
    }
    sb.appendASCIIString('</div>');
    applyFontInfo(domNode, fontInfo);
    const html = sb.build();
    const trustedhtml = ttPolicy ? ttPolicy.createHTML(html) : html;
    domNode.innerHTML = trustedhtml;
}
class ViewMoreLinesContentWidget extends Disposable {
    constructor(editor, position, domNode, disposableStore) {
        super();
        this.editor = editor;
        this.position = position;
        this.domNode = domNode;
        this.allowEditorOverflow = false;
        this.suppressMouseDown = false;
        this._register(disposableStore);
        this._register(toDisposable(() => {
            this.editor.removeContentWidget(this);
        }));
        this.editor.addContentWidget(this);
    }
    getId() {
        return 'editor.widget.viewMoreLinesWidget';
    }
    getDomNode() {
        return this.domNode;
    }
    getPosition() {
        return {
            position: this.position,
            preference: [0 /* EXACT */]
        };
    }
}
registerThemingParticipant((theme, collector) => {
    const foreground = theme.getColor(ghostTextForeground);
    if (foreground) {
        // `!important` ensures that other decorations don't cause a style conflict (#132017).
        collector.addRule(`.monaco-editor .ghost-text-decoration { color: ${foreground.toString()} !important; }`);
        collector.addRule(`.monaco-editor .ghost-text-decoration-preview { color: ${foreground.toString()} !important; }`);
        collector.addRule(`.monaco-editor .suggest-preview-text .ghost-text { color: ${foreground.toString()} !important; }`);
    }
    const background = theme.getColor(ghostTextBackground);
    if (background) {
        collector.addRule(`.monaco-editor .ghost-text-decoration { background-color: ${background.toString()}; }`);
        collector.addRule(`.monaco-editor .ghost-text-decoration-preview { background-color: ${background.toString()}; }`);
        collector.addRule(`.monaco-editor .suggest-preview-text .ghost-text { background-color: ${background.toString()}; }`);
    }
    const border = theme.getColor(ghostTextBorder);
    if (border) {
        collector.addRule(`.monaco-editor .suggest-preview-text .ghost-text { border: 1px solid ${border}; }`);
        collector.addRule(`.monaco-editor .ghost-text-decoration { border: 1px solid ${border}; }`);
        collector.addRule(`.monaco-editor .ghost-text-decoration-preview { border: 1px solid ${border}; }`);
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { forEach } from '../../../base/common/collections.js';
/**
 * Compatibility with old options
 */
export function migrateOptions(options) {
    const wordWrap = options.wordWrap;
    if (wordWrap === true) {
        options.wordWrap = 'on';
    }
    else if (wordWrap === false) {
        options.wordWrap = 'off';
    }
    const lineNumbers = options.lineNumbers;
    if (lineNumbers === true) {
        options.lineNumbers = 'on';
    }
    else if (lineNumbers === false) {
        options.lineNumbers = 'off';
    }
    const autoClosingBrackets = options.autoClosingBrackets;
    if (autoClosingBrackets === false) {
        options.autoClosingBrackets = 'never';
        options.autoClosingQuotes = 'never';
        options.autoSurround = 'never';
    }
    const cursorBlinking = options.cursorBlinking;
    if (cursorBlinking === 'visible') {
        options.cursorBlinking = 'solid';
    }
    const renderWhitespace = options.renderWhitespace;
    if (renderWhitespace === true) {
        options.renderWhitespace = 'boundary';
    }
    else if (renderWhitespace === false) {
        options.renderWhitespace = 'none';
    }
    const renderLineHighlight = options.renderLineHighlight;
    if (renderLineHighlight === true) {
        options.renderLineHighlight = 'line';
    }
    else if (renderLineHighlight === false) {
        options.renderLineHighlight = 'none';
    }
    const acceptSuggestionOnEnter = options.acceptSuggestionOnEnter;
    if (acceptSuggestionOnEnter === true) {
        options.acceptSuggestionOnEnter = 'on';
    }
    else if (acceptSuggestionOnEnter === false) {
        options.acceptSuggestionOnEnter = 'off';
    }
    const tabCompletion = options.tabCompletion;
    if (tabCompletion === false) {
        options.tabCompletion = 'off';
    }
    else if (tabCompletion === true) {
        options.tabCompletion = 'onlySnippets';
    }
    const suggest = options.suggest;
    if (suggest && typeof suggest.filteredTypes === 'object' && suggest.filteredTypes) {
        const mapping = {};
        mapping['method'] = 'showMethods';
        mapping['function'] = 'showFunctions';
        mapping['constructor'] = 'showConstructors';
        mapping['deprecated'] = 'showDeprecated';
        mapping['field'] = 'showFields';
        mapping['variable'] = 'showVariables';
        mapping['class'] = 'showClasses';
        mapping['struct'] = 'showStructs';
        mapping['interface'] = 'showInterfaces';
        mapping['module'] = 'showModules';
        mapping['property'] = 'showProperties';
        mapping['event'] = 'showEvents';
        mapping['operator'] = 'showOperators';
        mapping['unit'] = 'showUnits';
        mapping['value'] = 'showValues';
        mapping['constant'] = 'showConstants';
        mapping['enum'] = 'showEnums';
        mapping['enumMember'] = 'showEnumMembers';
        mapping['keyword'] = 'showKeywords';
        mapping['text'] = 'showWords';
        mapping['color'] = 'showColors';
        mapping['file'] = 'showFiles';
        mapping['reference'] = 'showReferences';
        mapping['folder'] = 'showFolders';
        mapping['typeParameter'] = 'showTypeParameters';
        mapping['snippet'] = 'showSnippets';
        forEach(mapping, entry => {
            const value = suggest.filteredTypes[entry.key];
            if (value === false) {
                suggest[entry.value] = value;
            }
        });
        // delete (<any>suggest).filteredTypes;
    }
    const hover = options.hover;
    if (hover === true) {
        options.hover = {
            enabled: true
        };
    }
    else if (hover === false) {
        options.hover = {
            enabled: false
        };
    }
    const parameterHints = options.parameterHints;
    if (parameterHints === true) {
        options.parameterHints = {
            enabled: true
        };
    }
    else if (parameterHints === false) {
        options.parameterHints = {
            enabled: false
        };
    }
    const autoIndent = options.autoIndent;
    if (autoIndent === true) {
        options.autoIndent = 'full';
    }
    else if (autoIndent === false) {
        options.autoIndent = 'advanced';
    }
    const matchBrackets = options.matchBrackets;
    if (matchBrackets === true) {
        options.matchBrackets = 'always';
    }
    else if (matchBrackets === false) {
        options.matchBrackets = 'never';
    }
    const { renderIndentGuides, highlightActiveIndentGuide } = options;
    if (!options.guides) {
        options.guides = {};
    }
    if (renderIndentGuides !== undefined) {
        options.guides.indentation = !!renderIndentGuides;
    }
    if (highlightActiveIndentGuide !== undefined) {
        options.guides.highlightActiveIndentation = !!highlightActiveIndentGuide;
    }
}

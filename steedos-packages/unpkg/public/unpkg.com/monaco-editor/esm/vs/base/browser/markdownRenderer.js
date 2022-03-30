/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as DOM from './dom.js';
import * as dompurify from './dompurify/dompurify.js';
import { DomEmitter } from './event.js';
import { createElement } from './formattedTextRenderer.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { renderLabelWithIcons } from './ui/iconLabel/iconLabels.js';
import { raceCancellation } from '../common/async.js';
import { CancellationTokenSource } from '../common/cancellation.js';
import { onUnexpectedError } from '../common/errors.js';
import { Event } from '../common/event.js';
import { parseHrefAndDimensions, removeMarkdownEscapes } from '../common/htmlContent.js';
import { markdownEscapeEscapedIcons } from '../common/iconLabels.js';
import { defaultGenerator } from '../common/idGenerator.js';
import { DisposableStore } from '../common/lifecycle.js';
import { marked } from '../common/marked/marked.js';
import { parse } from '../common/marshalling.js';
import { FileAccess, Schemas } from '../common/network.js';
import { cloneAndChange } from '../common/objects.js';
import { dirname, resolvePath } from '../common/resources.js';
import { escape } from '../common/strings.js';
import { URI } from '../common/uri.js';
/**
 * Low-level way create a html element from a markdown string.
 *
 * **Note** that for most cases you should be using [`MarkdownRenderer`](./src/vs/editor/browser/core/markdownRenderer.ts)
 * which comes with support for pretty code block rendering and which uses the default way of handling links.
 */
export function renderMarkdown(markdown, options = {}, markedOptions = {}) {
    var _a;
    const disposables = new DisposableStore();
    let isDisposed = false;
    const cts = disposables.add(new CancellationTokenSource());
    const element = createElement(options);
    const _uriMassage = function (part) {
        let data;
        try {
            data = parse(decodeURIComponent(part));
        }
        catch (e) {
            // ignore
        }
        if (!data) {
            return part;
        }
        data = cloneAndChange(data, value => {
            if (markdown.uris && markdown.uris[value]) {
                return URI.revive(markdown.uris[value]);
            }
            else {
                return undefined;
            }
        });
        return encodeURIComponent(JSON.stringify(data));
    };
    const _href = function (href, isDomUri) {
        const data = markdown.uris && markdown.uris[href];
        let uri = URI.revive(data);
        if (isDomUri) {
            if (href.startsWith(Schemas.data + ':')) {
                return href;
            }
            if (!uri) {
                uri = URI.parse(href);
            }
            // this URI will end up as "src"-attribute of a dom node
            // and because of that special rewriting needs to be done
            // so that the URI uses a protocol that's understood by
            // browsers (like http or https)
            return FileAccess.asBrowserUri(uri).toString(true);
        }
        if (!uri) {
            return href;
        }
        if (URI.parse(href).toString() === uri.toString()) {
            return href; // no transformation performed
        }
        if (uri.query) {
            uri = uri.with({ query: _uriMassage(uri.query) });
        }
        return uri.toString();
    };
    // signal to code-block render that the
    // element has been created
    let signalInnerHTML;
    const withInnerHTML = new Promise(c => signalInnerHTML = c);
    const renderer = new marked.Renderer();
    renderer.image = (href, title, text) => {
        let dimensions = [];
        let attributes = [];
        if (href) {
            ({ href, dimensions } = parseHrefAndDimensions(href));
            attributes.push(`src="${href}"`);
        }
        if (text) {
            attributes.push(`alt="${text}"`);
        }
        if (title) {
            attributes.push(`title="${title}"`);
        }
        if (dimensions.length) {
            attributes = attributes.concat(dimensions);
        }
        return '<img ' + attributes.join(' ') + '>';
    };
    renderer.link = (href, title, text) => {
        if (typeof href !== 'string') {
            return '';
        }
        // Remove markdown escapes. Workaround for https://github.com/chjj/marked/issues/829
        if (href === text) { // raw link case
            text = removeMarkdownEscapes(text);
        }
        href = _href(href, false);
        if (markdown.baseUri) {
            href = resolveWithBaseUri(URI.from(markdown.baseUri), href);
        }
        title = typeof title === 'string' ? removeMarkdownEscapes(title) : '';
        href = removeMarkdownEscapes(href);
        if (!href
            || /^data:|javascript:/i.test(href)
            || (/^command:/i.test(href) && !markdown.isTrusted)
            || /^command:(\/\/\/)?_workbench\.downloadResource/i.test(href)) {
            // drop the link
            return text;
        }
        else {
            // HTML Encode href
            href = href.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            return `<a data-href="${href}" title="${title || href}">${text}</a>`;
        }
    };
    renderer.paragraph = (text) => {
        return `<p>${text}</p>`;
    };
    if (options.codeBlockRenderer) {
        renderer.code = (code, lang) => {
            const value = options.codeBlockRenderer(lang !== null && lang !== void 0 ? lang : '', code);
            // when code-block rendering is async we return sync
            // but update the node with the real result later.
            const id = defaultGenerator.nextId();
            raceCancellation(Promise.all([value, withInnerHTML]), cts.token).then(values => {
                var _a;
                if (!isDisposed && values) {
                    const span = element.querySelector(`div[data-code="${id}"]`);
                    if (span) {
                        DOM.reset(span, values[0]);
                    }
                    (_a = options.asyncRenderCallback) === null || _a === void 0 ? void 0 : _a.call(options);
                }
            }).catch(() => {
                // ignore
            });
            return `<div class="code" data-code="${id}">${escape(code)}</div>`;
        };
    }
    if (options.actionHandler) {
        const onClick = options.actionHandler.disposables.add(new DomEmitter(element, 'click'));
        const onAuxClick = options.actionHandler.disposables.add(new DomEmitter(element, 'auxclick'));
        options.actionHandler.disposables.add(Event.any(onClick.event, onAuxClick.event)(e => {
            const mouseEvent = new StandardMouseEvent(e);
            if (!mouseEvent.leftButton && !mouseEvent.middleButton) {
                return;
            }
            let target = mouseEvent.target;
            if (target.tagName !== 'A') {
                target = target.parentElement;
                if (!target || target.tagName !== 'A') {
                    return;
                }
            }
            try {
                let href = target.dataset['href'];
                if (href) {
                    if (markdown.baseUri) {
                        href = resolveWithBaseUri(URI.from(markdown.baseUri), href);
                    }
                    options.actionHandler.callback(href, mouseEvent);
                }
            }
            catch (err) {
                onUnexpectedError(err);
            }
            finally {
                mouseEvent.preventDefault();
            }
        }));
    }
    if (!markdown.supportHtml) {
        // TODO: Can we deprecated this in favor of 'supportHtml'?
        // Use our own sanitizer so that we can let through only spans.
        // Otherwise, we'd be letting all html be rendered.
        // If we want to allow markdown permitted tags, then we can delete sanitizer and sanitize.
        // We always pass the output through dompurify after this so that we don't rely on
        // marked for sanitization.
        markedOptions.sanitizer = (html) => {
            const match = markdown.isTrusted ? html.match(/^(<span[^>]+>)|(<\/\s*span>)$/) : undefined;
            return match ? html : '';
        };
        markedOptions.sanitize = true;
        markedOptions.silent = true;
    }
    markedOptions.renderer = renderer;
    // values that are too long will freeze the UI
    let value = (_a = markdown.value) !== null && _a !== void 0 ? _a : '';
    if (value.length > 100000) {
        value = `${value.substr(0, 100000)}…`;
    }
    // escape theme icons
    if (markdown.supportThemeIcons) {
        value = markdownEscapeEscapedIcons(value);
    }
    let renderedMarkdown = marked.parse(value, markedOptions);
    // Rewrite theme icons
    if (markdown.supportThemeIcons) {
        const elements = renderLabelWithIcons(renderedMarkdown);
        renderedMarkdown = elements.map(e => typeof e === 'string' ? e : e.outerHTML).join('');
    }
    const htmlParser = new DOMParser();
    const markdownHtmlDoc = htmlParser.parseFromString(sanitizeRenderedMarkdown(markdown, renderedMarkdown), 'text/html');
    markdownHtmlDoc.body.querySelectorAll('img')
        .forEach(img => {
        const src = img.getAttribute('src'); // Get the raw 'src' attribute value as text, not the resolved 'src'
        if (src) {
            let href = src;
            try {
                if (markdown.baseUri) { // absolute or relative local path, or file: uri
                    href = resolveWithBaseUri(URI.from(markdown.baseUri), href);
                }
            }
            catch (err) { }
            img.src = _href(href, true);
        }
    });
    element.innerHTML = sanitizeRenderedMarkdown(markdown, markdownHtmlDoc.body.innerHTML);
    // signal that async code blocks can be now be inserted
    signalInnerHTML();
    // signal size changes for image tags
    if (options.asyncRenderCallback) {
        for (const img of element.getElementsByTagName('img')) {
            const listener = disposables.add(DOM.addDisposableListener(img, 'load', () => {
                listener.dispose();
                options.asyncRenderCallback();
            }));
        }
    }
    return {
        element,
        dispose: () => {
            isDisposed = true;
            cts.cancel();
            disposables.dispose();
        }
    };
}
function resolveWithBaseUri(baseUri, href) {
    const hasScheme = /^\w[\w\d+.-]*:/.test(href);
    if (hasScheme) {
        return href;
    }
    if (baseUri.path.endsWith('/')) {
        return resolvePath(baseUri, href).toString();
    }
    else {
        return resolvePath(dirname(baseUri), href).toString();
    }
}
function sanitizeRenderedMarkdown(options, renderedMarkdown) {
    const { config, allowedSchemes } = getSanitizerOptions(options);
    dompurify.addHook('uponSanitizeAttribute', (element, e) => {
        if (e.attrName === 'style' || e.attrName === 'class') {
            if (element.tagName === 'SPAN') {
                if (e.attrName === 'style') {
                    e.keepAttr = /^(color\:#[0-9a-fA-F]+;)?(background-color\:#[0-9a-fA-F]+;)?$/.test(e.attrValue);
                    return;
                }
                else if (e.attrName === 'class') {
                    e.keepAttr = /^codicon codicon-[a-z\-]+( codicon-modifier-[a-z\-]+)?$/.test(e.attrValue);
                    return;
                }
            }
            e.keepAttr = false;
            return;
        }
    });
    // build an anchor to map URLs to
    const anchor = document.createElement('a');
    // https://github.com/cure53/DOMPurify/blob/main/demos/hooks-scheme-allowlist.html
    dompurify.addHook('afterSanitizeAttributes', (node) => {
        // check all href/src attributes for validity
        for (const attr of ['href', 'src']) {
            if (node.hasAttribute(attr)) {
                anchor.href = node.getAttribute(attr);
                if (!allowedSchemes.includes(anchor.protocol.replace(/:$/, ''))) {
                    node.removeAttribute(attr);
                }
            }
        }
    });
    try {
        return dompurify.sanitize(renderedMarkdown, Object.assign(Object.assign({}, config), { RETURN_TRUSTED_TYPE: true }));
    }
    finally {
        dompurify.removeHook('uponSanitizeAttribute');
        dompurify.removeHook('afterSanitizeAttributes');
    }
}
function getSanitizerOptions(options) {
    const allowedSchemes = [
        Schemas.http,
        Schemas.https,
        Schemas.mailto,
        Schemas.data,
        Schemas.file,
        Schemas.vscodeFileResource,
        Schemas.vscodeRemote,
        Schemas.vscodeRemoteResource,
    ];
    if (options.isTrusted) {
        allowedSchemes.push(Schemas.command);
    }
    return {
        config: {
            // allowedTags should included everything that markdown renders to.
            // Since we have our own sanitize function for marked, it's possible we missed some tag so let dompurify make sure.
            // HTML tags that can result from markdown are from reading https://spec.commonmark.org/0.29/
            // HTML table tags that can result from markdown are from https://github.github.com/gfm/#tables-extension-
            ALLOWED_TAGS: ['ul', 'li', 'p', 'b', 'i', 'code', 'blockquote', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'em', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'del', 'a', 'strong', 'br', 'img', 'span'],
            ALLOWED_ATTR: ['href', 'data-href', 'target', 'title', 'src', 'alt', 'class', 'style', 'data-code', 'width', 'height', 'align'],
            ALLOW_UNKNOWN_PROTOCOLS: true,
        },
        allowedSchemes
    };
}

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Meta = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var config = {
        group: "华炎魔方",
        name: "builder-button",
        componentName: "Button",
        title: "按钮",
        docUrl: "",
        screenshot: "",
        icon: "fa fa-file-code-o",
        npm: {
            package: "@steedos-builder/react",
            version: "{{version}}",
            exportName: "Button",
            main: "",
            destructuring: true,
            subName: ""
        },
        props: [
            {
                name: "text",
                propType: "string"
            },
            {
                name: "link",
                propType: "string"
            }
        ],
        preview: {
            text: "Submit",
            link: "https://www.steedos.cn"
        },
        targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
        engines: ["amis"],
        // settings for amis.
        amis: {}
    };
    var button = __assign(__assign({}, config), { snippets: [
            {
                title: config.title,
                screenshot: "",
                schema: {
                    componentName: config.name,
                    props: config.preview
                }
            }
        ], amis: {
            render: {
                type: config.name,
                usage: "renderer",
                weight: 1,
                framework: "react"
            },
            plugin: {
                rendererName: config.name,
                // $schema: '/schemas/UnkownSchema.json',
                name: config.title,
                description: config.title,
                tags: [config.group],
                icon: config.icon,
                scaffold: __assign({ type: config.name, label: config.title, name: config.name }, config.preview),
                previewSchema: __assign({ type: config.name }, config.preview),
                panelTitle: "设置",
                panelControls: [
                    {
                        type: "text",
                        name: "text",
                        label: "标题"
                    },
                    {
                        type: "text",
                        name: "link",
                        label: "链接"
                    }
                ]
            }
        } });

    var components = [button];
    var componentList = [
        {
            title: "基本组件",
            icon: "",
            children: [button]
        }
    ];
    var meta = {
        componentList: componentList,
        components: components
    };

    return meta;

})));

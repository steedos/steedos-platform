Steedos.getInstnaceFilePreviewAmisSchema = function (ctx) {
    return {
        name: "preview-" + ctx._id,
        amis_schema:
        {
            "type": "service",
            "body": [
                {
                    "type": "button",
                    "body": "预览",
                    "level": "link",
                    "id": "u:instance_preview",
                    "className": "inline",
                    "onEvent": {
                        "click": {
                            "weight": 0,
                            "actions": [
                                {
                                    "ignoreError": false,
                                    "actionType": "drawer",
                                    "drawer": {
                                        "type": "drawer",
                                        "title": {
                                            "type": "tpl",
                                            "id": "u:63440f27b2fc",
                                            "tpl": "${original.name}",
                                            "className": "flex justify-center items-center"
                                        },
                                        "body": [
                                            {
                                                "type": "page",
                                                "body": [
                                                    {
                                                        "type": "office-viewer",
                                                        "id": "u:d27be9cc371d",
                                                        "wordOptions": {
                                                            "ignoreWidth": false,
                                                            "padding": "",
                                                            "bulletUseFont": true,
                                                            "enableVar": false
                                                        },
                                                        "src": "/api/files/instances/${_id}",
                                                        "visibleOn": "${ARRAYINCLUDES(['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],original.type)}",
                                                        "className": "flex justify-center items-center h-full",
                                                        "loading": true
                                                    },
                                                    {
                                                        "type": "office-viewer",
                                                        "wordOptions": {
                                                            "ignoreWidth": false,
                                                            "padding": "",
                                                            "bulletUseFont": true,
                                                            "enableVar": false
                                                        },
                                                        "src": "/api/files/instances/${_id}",
                                                        "visibleOn": "${ARRAYINCLUDES(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],original.type)}",
                                                        "className": "office-viewer-excel",
                                                        "loading": true,
                                                        "id": "u:7e36ef6f5cd2"
                                                    },
                                                    {
                                                        "type": "iframe",
                                                        "src": "${context.rootUrl}/api/page/public/pdf_view?fileUrl=/api/files/instances/${_id}",
                                                        "visibleOn": "${ARRAYINCLUDES(['application/pdf'],original.type)}",
                                                        "id": "u:dc63f1f2d0ab",
                                                        "source": "src"
                                                    },
                                                    {
                                                        "type": "image",
                                                        "id": "u:4d9071791016",
                                                        "visibleOn": "${ARRAYINCLUDES(['image/png', 'image/jpeg', 'image/bmp', 'image/gif', 'image/svg', 'image/tiff'],original.type)}",
                                                        "src": "/api/files/instances/${_id}",
                                                        "imageMode": "original"
                                                    }
                                                ],
                                                "bodyClassName": "p-0",
                                                "css": {
                                                    ".drawer-container-office-preview .office-viewer-excel": {
                                                        "height": "100% !important"
                                                    },
                                                    ".drawer-excel-file .antd-Page-body>div": {
                                                        "height": "100%"
                                                    }
                                                },
                                                "id": "u:61fd47ac9afc"
                                            }
                                        ],
                                        "className": {
                                            "drawer-container-office-preview": true,
                                            "drawer-excel-file": "${ARRAYINCLUDES(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],original.type)}"
                                        },
                                        "id": "u:cd1199c49cc7",
                                        "actions": [],
                                        "showCloseButton": true,
                                        "closeOnOutside": false,
                                        "closeOnEsc": false,
                                        "showErrorMsg": true,
                                        "showLoading": true,
                                        "draggable": false,
                                        "actionType": "drawer",
                                        "width": "100%",
                                        "resizable": false,
                                        "editorSetting": {
                                            "displayName": ""
                                        },
                                        "position": "bottom",
                                        "hideActions": false,
                                        "height": "100%",
                                        "themeCss": {
                                            "drawerTitleClassName": {
                                                "font": {
                                                    "text-decoration": "underline"
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "visibleOn": true,
                    "editorState": "default"
                }
            ],
            "data": {
                "context": {},
                "dataComponentId": "",
                "record_id": "",
                "record": {},
                "permissions": {}
            },
            "id": "u:38e959664cc7",
            "dsType": "api",
            "asideResizor": false,
            "editorState": "default",
            "pullRefresh": {
                "disabled": true
            },
            "definitions": {}
        },
        type: "amis_button",
        object: "instance"

    }
}

Steedos.getInstnaceFilePreviewAmisData = function (ctx) {
    // console.log("ctx---:", ctx)
    return ctx;
}

Steedos.getInstnaceFilePreviewAmisButtonClass = function () {
    return "mouse-hover hover:inline-block hover:cursor-pointer hover:ml-2.5";
}
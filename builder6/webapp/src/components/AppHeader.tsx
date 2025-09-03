import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';
import { useParams } from 'react-router-dom';

export const getHeaderSchema = (props) => {
    const { logoSrc, customButtons, className } = props
    const isMobile = window.innerWidth <= 768

    const schema = {
        "type": "wrapper",
        "className": 'p-0' + (className ? ` ${className}` : ''),
        body: [
            {
                "type": "wrapper",
                "className": "sticky p-0 top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-[1000] steedos-header-container",
                body: [
                    {
                        "type": "wrapper",
                        "className": 'flex w-full px-4 py-0 h-[50px] justify-between items-center steedos-header-container-line-one',
                        "body": [
                            {
                                type: "service",
                                className: 'p-0 flex flex-1 items-center',
                                "onEvent": {
                                    "@history_paths.changed": {
                                        "actions": [
                                            {
                                                "actionType": "reload",
                                                // amis 3.6需要传入data来触发下面的window:historyPaths重新计算
                                                "data": {
                                                }
                                            }
                                        ]
                                    }
                                },
                                body: [
                                    {
                                        "type": "button",
                                        "className": "toggle-sidebar flex items-center pr-4",
                                        "visibleOn": "${window:innerWidth < 768}",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "document.body.classList.toggle('sidebar-open')",
                                                    },
                                                    {
                                                        "actionType": "rebuild",
                                                        "componentId": "u:app-menu",
                                                        "args": {
                                                            "toggleSidebar": true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "rows",
                                                "colorVariant": "default",
                                                "id": "u:afc3a08e8cf3",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ],
                                    },
                                    {
                                        "type": "button",
                                        "visibleOn": "${window:innerWidth < 768 && (window:historyPaths.length > 1 || window:historyPaths[0].params.record_id)}",
                                        "className":"flex",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "window.goBack()"
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "chevronleft",
                                                "colorVariant": "default",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "steedos-app-launcher",
                                        "showAppName": false,
                                        "hiddenOn": "${window:innerWidth < 768}",
                                        "appId": "${app.id}",
                                    },
                                    {
                                        "className": 'w-auto mx-4 inline-block align-middle',
                                        "type": "tpl",
                                        "tpl": `<a href='/app' class='flex items-center '><img class='block h-6 w-auto' src='${logoSrc}'></a>`,
                                        "hiddenOn": "${window:innerWidth < 768 && (window:historyPaths.length > 1 || window:historyPaths[0].params.record_id)}"
                                    },
                                    {
                                        "className": 'bg-gray-300 w-[1px] h-6 inline-block align-middle mr-4',
                                        "type": "tpl",
                                        "tpl": '',
                                    },
                                    {
                                        "className": 'w-auto mr-4 font-bold text-lg inline-block align-middle',
                                        "type": "tpl",
                                        "tpl": '${app.name}',
                                    },
                                ],
                            },
                            {
                                "type": "steedos-global-header-toolbar",
                                "label": "Global Header",
                                className: 'flex flex-nowrap gap-x-4 items-center',
                                logoutScript: "window.signOut();",
                                customButtons: customButtons
                            }
                        ],
                    },

                ],
            },
            {
                "type": "button",
                "className": 'p-0 absolute inset-0 mt-[50px]',
                visibleOn: '${!!appId}',
                body: [
                    {
                        type: "wrapper",
                        className: 'sidebar-wrapper px-0 pt-0 pb-16 fixed z-20 h-full h-fill ease-in-out duration-300 flex flex-col overflow-y-auto block -translate-x-0 sm:w-[220px] w-64 bg-gray-50 border sm:border-none',
                        visibleOn: '${!!app}',
                        body: [
                            {
                                "type": "flex",
                                "justify": "flex-start",
                                "className": "px-4 py-4",
                                "visibleOn": "${window:innerWidth < 768}",
                                "items": [
                                    {
                                        "type": "button",
                                        "className": "toggle-sidebar flex items-center pr-4",
                                        "onEvent": {
                                            "click": {
                                                "actions": [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "document.body.classList.toggle('sidebar-open')",
                                                    },
                                                    {
                                                        "actionType": "rebuild",
                                                        "componentId": "u:app-menu",
                                                        "args": {
                                                            "toggleSidebar": true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "steedos-icon",
                                                "category": "utility",
                                                "name": "rows",
                                                "colorVariant": "default",
                                                "id": "u:afc3a08e8cf3",
                                                "className": "slds-button_icon slds-global-header__icon"
                                            }
                                        ],
                                    },
                                    {
                                        "type": "steedos-app-launcher",
                                        // "className": "px-4 py-4",
                                        "showAppName": true
                                    }
                                ]
                            },
                            {
                                "type": "steedos-app-menu",
                                "stacked": true,
                                "appId": "${app.id}",
                            },
                        ]
                    },
                    {
                        "type": "wrapper",
                        "className": 'sidebar-overlay',
                        "hiddenOn": `${!isMobile}`,
                    }
                ],
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "custom",
                                "script": "if(window.innerWidth < 768){ document.body.classList.remove('sidebar-open'); }",
                            }
                        ]
                    }
                },
            },
        ],
    }
    return schema;
}


export const AppHeader = () => {

    const params = useParams();
    let { appId = null, objectName } = params;
    // console.log('AppHeader params:', params)

    if(!appId){
        document.body.classList.remove('sidebar-open');
    }

    const isMobile = window.innerWidth < 1024;

    let logoSrc = `/images/logo.png`

    if(Builder.settings?.context?.user?.space?.avatar){
        logoSrc = '/api/v6/files/cfs.avatars.filerecord/' + Builder.settings.context.user.space.avatar
    }

    const faviconLink: any = document.querySelector('link[rel*="icon"], link[rel*="shortcut"]');

    let favicon = '/favicons/favicon.ico';
    if(Builder.settings?.context?.user?.space?.favicon){
        favicon = "/api/v6/files/cfs.avatars.filerecord/" + Builder.settings.context.user.space.favicon;
    }

    if (faviconLink) {
        faviconLink.href = favicon;
    }else{
        const newFaviconLink = document.createElement('link');
        newFaviconLink.rel = 'icon';
        newFaviconLink.href = favicon;
        document.head.appendChild(newFaviconLink);
    }

    const headerSchema = getHeaderSchema({logoSrc, appId});
    const schema = {
        "type": "service",
        "id": "u:global-header",
        name: "globalHeader",
        body: headerSchema,
        "api": {
            "method": "get",
            "cache": "10000",
            "url": "/service/api/apps/${appId}/menus?mobile=" + isMobile,
            "sendOn": "!!appId",
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            },
            "adaptor": `
                const app = payload;
                document.body.classList.add('sidebar')

                if (window.innerWidth >= 768) {
                    document.body.classList.add('sidebar-open')
                }

                return {
                    app: app
                }
            `,
            "messages": {
            }
        },
        dataProvider: function(data, setData){
            window.addEventListener('message', function (event) {
                const { data } = event;
                if (data && data.type === 'page.dataProvider.setData') {
                    // console.log('dataProvider====>setData', data);
                    setData(data.data)
                }
            })
        }
    }

    return <div id="header" className="steedos-global-header-root flex-none"><AmisRender schema={schema} data={{
        context: {
            ...Builder.settings.context,
            appId: appId,
            showSidebar: true,
            stacked: true
        },
        appId: appId,
        showSidebar: true,
        stacked: true
    }} env={{}}></AmisRender></div>
}
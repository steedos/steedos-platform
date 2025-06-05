import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';
import { useParams } from 'react-router-dom';
export const AppHeader = () => {
    const params = useParams();
    let { appId = null, objectName } = params;
    // console.log('AppHeader params:', params)

    if(!appId){
        document.body.classList.remove('sidebar-open');
    }

    const isMobile = window.innerWidth < 1024;

    let logoSrc = `/images/logo_platform.png`

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

    const schema = {
        "type": "service",
        "id": "u:global-header",
        name: "globalHeader",
        body: [
            {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-page-object-detail",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "componentId": "u:steedos-page-object-detail",
                                "actionType": "reload"
                            }
                        ]
                    }
                }
            },
            {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-page-object-listview",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "componentId": "u:steedos-page-object-listview",
                                "actionType": "reload"
                            }
                        ]
                    }
                }
            },
            {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-object-listview",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "componentId": "u:steedos-object-listview",
                                "actionType": "reload"
                            }
                        ]
                    }
                }
            },
             {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-app-menu-${appId}",
                "onEvent": {
                    "click": {
                    "actions": [
                        {
                        "componentId": "u:app-menu",
                        "actionType": "reload"
                        }
                    ]
                    }
                }
            },
             {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-global-header btn-reload-global-header-${appId}",
                "onEvent": {
                    "click": {
                    "actions": [
                        {
                        "componentId": "u:global-header",
                        "actionType": "reload"
                        }
                    ]
                    }
                }
            },
            {
                "type": "button",
                "label": "刷新",
                "className": "hidden btn-reload-global-header-notifications",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "actionType": "broadcast",
                                "args": {
                                    "eventName": "@data.changed.notifications"
                                },
                                "data": {
                                    "type": "${event.data.type}",
                                    "objectName": "notifications",
                                    "recordId": "reload"
                                }
                            }
                        ]
                    }
                },
            },
            {
                "type": "steedos-global-header",
                "logoSrc": logoSrc,
                "customButtons": [
                    {
                        "type": "steedos-app-launcher",
                        "showAppName": false,
                        "appId": "${app.id}",
                        "visibleOn": "${isMobile}"
                    }
                ]
            },
        ],
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
                if (app.showSidebar){
                    document.body.classList.add('sidebar')
                } else {
                    document.body.classList.remove("sidebar")
                }

                if (window.innerWidth >= 768) {
                    document.body.classList.add('sidebar-open')
                }

                return {
                    app: app
                }
            `,
            "messages": {
            }
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
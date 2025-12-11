import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';
import { use } from "i18next";
import { useEffect, useState } from "react";
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
                        "className": 'flex w-full px-4 py-0 h-[50px] justify-between items-center steedos-header-container-line-one ',
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
                                        "visibleOn": "${window:innerWidth < 768 && !!app && app.showSidebar}",
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
                                        // "hiddenOn": "${window:innerWidth < 768}",
                                        "appId": "${app.id}",
                                    },
                                    {
                                        "className": 'w-auto ml-4 inline-block align-middle',
                                        "type": "tpl",
                                        "tpl": `<a href='/app' class='flex items-center '><img class='block h-6 w-auto' src='${logoSrc}'></a>`,
                                        "visibleOn": `${!isMobile && !!logoSrc}`
                                    },
                                    // {
                                    //     "className": 'bg-gray-300 w-[1px] h-6 inline-block align-middle mr-4',
                                    //     "type": "tpl",
                                    //     "tpl": '',
                                    // },
                                    {
                                        "className": 'w-auto ml-4 font-bold text-lg inline-block align-middle',
                                        "type": "tpl",                                        
                                        "hiddenOn": "${window:innerWidth < 768}",
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
                visibleOn: '${!!app && app.showSidebar}',
                body: [
                    {
                        type: "wrapper",
                        className: 'sidebar-wrapper bg-white border-r px-2 pt-2 pb-16 fixed z-20 h-full h-fill flex flex-col overflow-y-auto block transition-all duration-300',
                        visibleOn: '${!!app}',
                        body: [
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

    let [ app, setApp ] = useState(null);
    useEffect(() => {
        const fetchApp = async () => {
            if (appId === '-' || appId == null) {
                setApp({
                    id: '-',
                    name: '',
                    showSidebar: false
                });
                document.body.classList.remove('sidebar');
                return;
            }
            
            if(appId){
                try{
                    const response = await fetch(`${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus?mobile=${isMobile}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if(response.ok){
                        const appData = await response.json();
                        setApp(appData);
                        // 设置侧边栏折叠状态
                        if (appData.showSidebar)
                            document.body.classList.add('sidebar')
                        else 
                            document.body.classList.remove('sidebar')

                        if (window.innerWidth >= 768) {
                            document.body.classList.add('sidebar-open')
                        }

                        if (appData.dark) {
                            document.body.classList.add('dark');
                        } else {
                            document.body.classList.remove('dark');
                        }

                        if (appData.color) {
                            document.body.style.setProperty('--colors-brand-main', `var(--color-${appData.color}-600)`);
                            document.body.style.setProperty('--colors-brand-1', `var(--color-${appData.color}-900)`);
                            document.body.style.setProperty('--colors-brand-2', `var(--color-${appData.color}-800)`);
                            document.body.style.setProperty('--colors-brand-3', `var(--color-${appData.color}-700)`);
                            document.body.style.setProperty('--colors-brand-4', `var(--color-${appData.color}-600)`);
                            document.body.style.setProperty('--colors-brand-5', `var(--color-${appData.color}-500)`);
                            document.body.style.setProperty('--colors-brand-6', `var(--color-${appData.color}-400)`);
                            document.body.style.setProperty('--colors-brand-7', `var(--color-${appData.color}-300)`);
                            document.body.style.setProperty('--colors-brand-8', `var(--color-${appData.color}-200)`);
                            document.body.style.setProperty('--colors-brand-9', `var(--color-${appData.color}-100)`);
                            document.body.style.setProperty('--colors-brand-10', `var(--color-${appData.color}-50)`);
                        }
                    }
                }catch(err){
                    console.error('Failed to fetch app data:', err);
                }
            }
        };
        fetchApp();
    }, [appId]);

    if(!appId){
        document.body.classList.remove('sidebar-open');
    }

    const isMobile = window.innerWidth < 1024;

    let logoSrc = '/images/logo.svg';

    if(Builder.settings?.context?.user?.space?.avatar){
        logoSrc = '/api/v6/files/cfs.avatars.filerecord/' + Builder.settings.context.user.space.avatar
    }

    const faviconLink: any = document.querySelector('link[rel*="icon"], link[rel*="shortcut"]');

    let favicon = '/images/logo.png';
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
        // "api": {
        //     "method": "get",
        //     "cache": "10000",
        //     "url": "/service/api/apps/${appId}/menus?mobile=" + isMobile,
        //     "sendOn": "!!appId",
        //     "headers": {
        //         "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        //     },
        //     "adaptor": `
        //         const app = payload;
        //         if (app.showSidebar)
        //             document.body.classList.add('sidebar')
        //         else 
        //             document.body.classList.remove('sidebar')

        //         if (window.innerWidth >= 768) {
        //             document.body.classList.add('sidebar-open')
        //         }

        //         return {
        //             app: app
        //         }
        //     `,
        //     "messages": {
        //     }
        // },
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

    return app && (<div id="header" className="steedos-global-header-root flex-none"><AmisRender schema={schema} data={{
        context: {
            ...Builder.settings.context,
            app,
            appId: appId,
            showSidebar: true,
            stacked: true
        },
        app, 
        appId: appId,
        showSidebar: true,
        stacked: true
    }} env={{}}></AmisRender></div>)
}
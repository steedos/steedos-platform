import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';
import { use } from "i18next";
import { useEffect, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';

const getHeaderSchema = (props) => {
    const { logoSrc, customButtons, className } = props
    const isMobile = window.innerWidth <= 768

    const schema = {
        "type": "wrapper",
        "className": 'p-0' + (className ? ` ${className}` : ''),
        body: [
            {
                "type": "wrapper",
                "className": "sticky p-0 top-0 z-40 w-full flex-none transition-colors duration-500 lg:z-[1000] steedos-header-container shadow-sm",
                body: [
                    {
                        "type": "wrapper",
                        "className": 'flex w-full px-4 lg:px-5 py-0 h-[64px] justify-between items-center steedos-header-container-line-one',
                        "body": [
                            {
                                type: "service",
                                className: 'p-0 flex flex-1 items-center gap-2',
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
                                        "className": "toggle-sidebar flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors mr-1",
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
                                        "className":"flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors mr-1",
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
                                        "className": "flex items-center"
                                    },
                                    {
                                        "className": 'w-auto ml-3 flex items-center',
                                        "type": "tpl",
                                        "tpl": `<a href='/app' class='flex items-center hover:opacity-80 transition-opacity'><img class='block h-7 w-auto' src='${logoSrc}'></a>`,
                                        "visibleOn": `${!isMobile && !!logoSrc}`
                                    },
                                    // {
                                    //     "className": 'bg-gray-300 w-[1px] h-6 inline-block align-middle mr-4',
                                    //     "type": "tpl",
                                    //     "tpl": '',
                                    // },
                                    {
                                        "className": 'steedos-header-app-name w-auto ml-2 font-semibold !text-lg tracking-tight inline-block align-middle',
                                        "type": "tpl",                                        
                                        "hiddenOn": "${window:innerWidth < 768}",
                                        "tpl": '${app.name}',
                                    },
                                ],
                            },
                            {
                                "type": "steedos-global-header-toolbar",
                                "label": "Global Header",
                                className: 'flex flex-nowrap gap-x-6 items-center',
                                logoutScript: "window.signOut();",
                                customButtons: customButtons
                            }
                        ],
                    },

                ],
            },
            {
                "type": "button",
                "className": 'p-0 absolute inset-0 mt-[64px]',
                visibleOn: '${!!app && app.showSidebar}',
                body: [
                    {
                        type: "wrapper",
                        className: 'sidebar-wrapper px-2 pt-4 pb-16 fixed z-20 h-full h-fill flex flex-col overflow-y-auto block transition-all duration-300',
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
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = useParams();
    let { appId = null, objectName } = params;
    const isMobile = window.innerWidth < 1024;
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

                        const themeColor = appData.color || 'sky';
                        const linkColor = themeColor != 'gray' ? themeColor : 'sky';
                        document.documentElement.style.setProperty('--color-brand-main', `var(--color-${themeColor}-900)`);
                        document.documentElement.style.setProperty('--color-brand-900', `var(--color-${linkColor}-900)`);
                        document.documentElement.style.setProperty('--color-brand-900', `var(--color-${linkColor}-900)`);
                        document.documentElement.style.setProperty('--color-brand-800', `var(--color-${linkColor}-800)`);
                        document.documentElement.style.setProperty('--color-brand-700', `var(--color-${linkColor}-700)`);
                        document.documentElement.style.setProperty('--color-brand-600', `var(--color-${linkColor}-600)`);
                        document.documentElement.style.setProperty('--color-brand-500', `var(--color-${linkColor}-500)`);
                        document.documentElement.style.setProperty('--color-brand-400', `var(--color-${linkColor}-400)`);
                        document.documentElement.style.setProperty('--color-brand-300', `var(--color-${linkColor}-300)`);
                        document.documentElement.style.setProperty('--color-brand-100', `var(--color-${linkColor}-100)`);
                        document.documentElement.style.setProperty('--color-brand-50', `var(--color-${linkColor}-50)`);
                        document.documentElement.style.setProperty('--colors-other-5', `var(--color-${linkColor}-600)`);
                        document.documentElement.style.setProperty('--colors-other-6', `var(--color-${linkColor}-500)`);
                        document.documentElement.style.setProperty('--colors-other-7', `var(--color-${linkColor}-400)`);
                        document.documentElement.style.setProperty('--colors-link-4', `var(--color-${linkColor}-700)`);
                        document.documentElement.style.setProperty('--colors-link-5', `var(--color-${linkColor}-600)`);
                        document.documentElement.style.setProperty('--colors-link-6', `var(--color-${linkColor}-500)`);
                        document.documentElement.style.setProperty('--colors-link-7', `var(--color-${linkColor}-400)`);
                    }
                }catch(err){
                    console.error('Failed to fetch app data:', err);
                }
            }
        };
        if(searchParams.get('embed') != '1'){
            fetchApp();
        }
    }, [appId]);

    if(!appId){
        document.body.classList.remove('sidebar-open');
    }

    if(searchParams.get('embed') == '1'){
        return <></>
    }

    let logoSrc = ''; //'/images/logo.svg';

    if(Builder.settings?.context?.user?.space?.avatar){
        logoSrc = '/api/v6/files/cfs.avatars.filerecord/' + Builder.settings.context.user.space.avatar
    }

    const faviconLink: any = document.querySelector('link[rel*="icon"], link[rel*="shortcut"]');

    let favicon = '/images/logo.svg';
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
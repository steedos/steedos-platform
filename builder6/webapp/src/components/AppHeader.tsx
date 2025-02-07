
import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';



export const AppHeader = () => {
    const  appId = 's3';

    const isMobile = window.innerWidth < 1024
    const logoSrc= `/images/logo_platform.png`
    const schema = {
      "type": "service",
      name: "globalHeader",
      body: [
          {
            "type": "steedos-global-header",
            "logoSrc": logoSrc,
            "customButtons": [
              {
                  "type": "button",
                  "className": "toggle-sidebar",
                  "visibleOn": "${AND(app.showSidebar,!" + isMobile + ")}",
                  "onEvent": {
                      "click": {
                          "actions": [
                              {
                                  "actionType": "custom",
                                  "script": "document.body.classList.toggle('sidebar-open')",
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
                  "showAppName": false,
                  "appId": "${app.id}",
                  "visibleOn": "${isMobile}"
              }
          ]
          },
        ],
      onEvent: {
          "@appsLoaded": {
              "actions": [
                  {
                    "actionType": "custom",
                    "script": "Session.set('_app_menus', event.data.apps)"
                  }
                ]
          }
      }
    }

    return <AmisRender schema={schema} data={{
        context: {
            ...Builder.settings.context,
        },
    }} env={{}}></AmisRender>
}
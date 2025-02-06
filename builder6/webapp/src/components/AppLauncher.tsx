import { AmisRender } from "./AmisRender"
import { Builder } from '@builder6/react';

export const AppLauncher = () => {
    const  appId = 's3';
    return <AmisRender schema={{
        "columnClassName": "items-center flex pb-0",
        "body": [
            {
                "type": "steedos-app-launcher",
                "showAppName": true,
                "appId": appId,
            }
        ],
        "md": "auto",
        "valign": "middle"
    }} data={{
        context: {
            ...Builder.settings.context,
        },
    }} env={{}}></AmisRender>
}
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:51:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-24 17:24:14
 * @Description: 
 */
import { Builder, builder, BuilderComponent } from '@builder6/react';

export const AmisRender = function ({schema = {}, data = {}, env = {}}) {

  const mergedData = {
    app_id: Builder.settings.appId,
    context: Builder.settings.context,
    global: {
      userId: Builder.settings.context.userId,
      spaceId: Builder.settings.context.tenantId,
      user: Builder.settings.context.user, 
      now: new Date(),
    },
    ...data,
  }
  const mergedEnv = {
    ...env,
  }

  const content = {
    data: {
      blocks: [
            {
              id: `builder-amis`,
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              component: {
                name: "Core:Amis",
                options: {
                  schema: schema,
                  data: mergedData,
                  env: mergedEnv,
                },
              },
              responsiveStyles: {
                large: {
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  flexShrink: "0",
                  boxSizing: "border-box",
                  width: "100%",
                },
              },
            },
          ],
          responsiveStyles: {
            large: {
              display: "flex" ,
              flexDirection: "column",
              position: "relative",
              flexShrink: "0",
              boxSizing: "border-box",
              width: "100%",
            },
          },
        },
  } as any;

  return <BuilderComponent model="pages" content={content} data={data}/>
}

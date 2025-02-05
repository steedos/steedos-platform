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
    ...Builder.settings,
    ...data,
  }
  const mergedEnv = {
    assetUrls: Builder.settings.assetUrls,
    unpkgUrl: 'https://unpkg.steedos.cn',
    jumpTo: (to: string, action: string)=>{
      //TODO
      debugger;
      console.log('jumpTo to, action', to, action)
    },
    ...env,
  }

  const assetUrls = mergedEnv.assetUrls || []
  const content = {
    data: {
      blocks: [
        {
          "@type": "@builder.io/sdk:Element",
          "@version": 2,
          layerName: "Page",
          id: `builder-assets`,
          component: {
            name: "Core:AssetsLoader",
            options: {
              urls: assetUrls,
              unpkgUrl: 'https://unpkg.steedos.cn'
            },
          },
          children: [
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
      ],
    },
  };

  return <BuilderComponent model="pages" content={content} data={data}/>
}

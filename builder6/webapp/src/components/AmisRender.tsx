/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:51:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-20 16:19:15
 * @Description: 
 */
import { Builder, builder, BuilderComponent } from '@builder6/react';
import { useNavigate } from 'react-router-dom';

const normalizeLink = (to, location = window.location) => {
  to = to || "";

  if (to && to[0] === "#") {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === "?") {
    to = location.pathname + to;
  }

  const idx = to.indexOf("?");
  const idx2 = to.indexOf("#");
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
    let relativeBase = location.pathname;
    const paths = relativeBase.split("/");
    paths.pop();
    let m;
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === "../") {
        paths.pop();
      }
      pathname = pathname.substring(m[0].length);
    }
    pathname = paths.concat(pathname).join("/");
  }

  return pathname + search + hash;
};

export const AmisRender = function ({schema = {}, data = {}, env = {}}) {
  const navigate = useNavigate(); 
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
    jumpTo: (to: string, action: any, ctx)=>{
      if (to === "goBack") {
        return window.history.back();
      }

      to = normalizeLink(to);

      if (action && action.actionType === "url") {
        action.blank === false ? navigate(to) : window.open(to);
        return;
      }

      // 主要是支持 nav 中的跳转
      if (action && to && action.target) {
        window.open(to, action.target);
        return;
      }
      if (/^https?:\/\//.test(to)) {
        window.location.replace(to);
      } else {
        navigate(to);
      }
    },
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
  console.log(`AmisRender`, content, data)
  return <BuilderComponent model="pages" content={content} data={data}/>
}

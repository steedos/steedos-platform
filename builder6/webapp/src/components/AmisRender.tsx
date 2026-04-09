/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:51:08
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2026-04-07 13:15:58
 * @Description: 
 */
import { Builder, builder, BuilderComponent } from '@builder6/react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  // console.log(`AmisRender`, schema, data, env)
  const navigate = useNavigate(); 
  const location = useLocation();

  // 跟踪应用内 SPA 导航次数，用于判断是否有有效的应用内历史可回退
  // 不能依赖 history.length，因为 SSO 等外部跳转会增加浏览器历史条目
  if(typeof (window as any)._appNavCount === 'undefined'){
    (window as any)._appNavCount = 0;
  }

  if(!(window as any).goBack){
    (window as any).goBack = ()=>{
      if ((window as any)._appNavCount > 0) {
        (window as any)._appNavCount--;
        navigate(-1);
      } else {
        // 没有应用内导航历史，从 URL 解析对象列表页路径
        const pathname = window.location.pathname;
        // URL 模式: /app/{appId}/{objectName}/view/{recordId}
        const match = pathname.match(/^(\/app\/[^/]+\/[^/]+)(\/view\/.*)?$/);
        if (match && match[2]) {
          navigate(match[1]);
        } else {
          navigate(-1);
        }
      }
    }
  }

  if(!(window as any).navigate){
    (window as any).navigate = navigate;
  }

  let locale = Builder.settings.context?.user?.language || Builder.settings.default_language;
  if (locale === 'en') {
    locale = 'en-US'
  }
  const mergedData = {
    app_id: Builder.settings.appId,
    context: Builder.settings.context,
    global: {
      userId: Builder.settings.context.userId,
      spaceId: Builder.settings.context.tenantId,
      user: Builder.settings.context.user, 
      now: new Date(),
    },
    _pathname: location.pathname,
    ...data,
  }
  const mergedEnv = {
    ...env,
    isCurrentUrl: (to: string, ctx?: any) => {
      if (!to) {
        return false;
      }
      const link = normalizeLink(to);
      const pathname = window.location.pathname;
      const search = '';
      const idx = link.indexOf('?');
      let linkPathname = link;
      let linkSearch = '';
      if (~idx) {
        linkPathname = link.substring(0, idx);
        linkSearch = link.substring(idx);
      }
      if (linkSearch) {
        if (linkPathname !== pathname) {
          return false;
        }
        const currentSearch = window.location.search;
        if (!currentSearch) {
          return false;
        }
        const linkParams = new URLSearchParams(linkSearch);
        const currentParams = new URLSearchParams(currentSearch);
        let allMatch = true;
        linkParams.forEach((value, key) => {
          if (currentParams.get(key) !== value) {
            allMatch = false;
          }
        });
        return allMatch;
      }
      const decodedPathname = decodeURI(pathname);
      const decodedLink = decodeURI(linkPathname);
      // 精确匹配
      if (decodedPathname === decodedLink) {
        return true;
      }
      // 前缀匹配（路径段边界）：仅对 object 列表页路径生效
      // 即 /app/{appId}/{objectName} 格式（≤3段），才允许匹配其子路径（如 /view/xxx）
      const linkSegments = decodedLink.replace(/^\//, '').split('/');
      if (linkSegments.length <= 3 && decodedPathname.startsWith(decodedLink + '/')) {
        // 检查是否有更具体的菜单项匹配当前 URL，避免双重高亮
        // 例如："人员"(/app/admin/space_users) 和 "个人资料"(/app/admin/space_users/view/${userId})
        // 当 URL 为 /app/admin/space_users/view/xxx 时，只高亮"个人资料"
        const navPaths = (window as any)._steedosNavPaths;
        if (navPaths && navPaths.some((p: string) => {
          let pp = p;
          const qi = pp.indexOf('?');
          if (qi > -1) pp = pp.substring(0, qi);
          const hi = pp.indexOf('#');
          if (hi > -1) pp = pp.substring(0, hi);
          // 跳过自身
          if (decodeURI(pp) === decodedLink) return false;
          // 处理含模板变量的路径（如 ${context.user.spaceUserId}），取静态前缀
          const tmplIdx = pp.indexOf('${');
          if (tmplIdx > -1) {
            pp = pp.substring(0, tmplIdx);
          }
          const decodedNavPath = decodeURI(pp);
          // 如果存在一个更长的导航路径：
          // 1) 它以当前 link 为前缀（说明它是当前 link 的子路径）
          // 2) 当前 URL 也以它的静态部分为前缀（说明当前 URL 更匹配那个菜单项）
          // 则当前 link 不应该被前缀匹配高亮
          return decodedNavPath.startsWith(decodedLink + '/') &&
                 decodedPathname.startsWith(decodedNavPath);
        })) {
          return false;
        }
        return true;
      }
      return false;
    },
    jumpTo: (to: string, action: any, ctx)=>{
      if (to === "goBack") {
        return (window as any).goBack();
      }

      to = normalizeLink(to);

      if (action && action.actionType === "url") {
        if (action.blank === false) {
          (window as any)._appNavCount = ((window as any)._appNavCount || 0) + 1;
          navigate(to);
        } else {
          window.open(to);
        }
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
        (window as any)._appNavCount = ((window as any)._appNavCount || 0) + 1;
        navigate(to);
      }
    },
    getModalContainer: (props)=>{
      return document.body;
    }
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
                  locale: locale,
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
  // console.log(`AmisRender`, content, data)
  return <BuilderComponent model="pages" content={content} data={data}/>
}

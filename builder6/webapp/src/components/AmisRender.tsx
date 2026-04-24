/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-22 12:51:08
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2026-04-23 16:16:51
 * @Description: 
 */
import { Builder, builder, BuilderComponent } from '@builder6/react';
import { useNavigate, useLocation } from 'react-router-dom';

// 全局：每次 URL 变化时，若当前 pathname 是二栏列表页，记录到 sessionStorage
// 用 history API patch 而不是 useLocation，因为：
// - ApprovalTreeMenu 同根节点切换用 history.replaceState 静默更新 URL，不触发 react-router 的 location 变化
// - 详情页内部跳转可能也走 pushState，需要全局拦截才能不漏
// 用途：goBack fallback 时（_appNavCount=0）恢复带过滤参数的二栏列表 URL
function recordIfGridListUrl() {
  try {
    const pathname = window.location.pathname;
    if (/^\/app\/[^/]+\/[^/]+\/grid\/[^/]+/.test(pathname)) {
      sessionStorage.setItem('steedos_last_list_url', pathname + window.location.search);
      return;
    }
    // 进入三栏列表（/view/none）或离开任何对象页面时，清掉 stale 值。
    // 否则三栏列表会因为 sessionStorage 残留 grid URL 被 widget 的 isGridMode()
    // 误判为 grid 上下文，导致点菜单时三栏被强转成二栏。
    // 详情页 /view/<recordId> 不清——可能是从 grid 列表点行进入的，goBack 还要用。
    const objMatch = pathname.match(/^\/app\/[^/]+\/[^/]+(\/(view|grid)\/([^/?#]+))?/);
    const isThreePaneList = objMatch && objMatch[2] === 'view' && objMatch[3] === 'none';
    const isOutsideObjectPage = !objMatch || !objMatch[1];
    if (isThreePaneList || isOutsideObjectPage) {
      sessionStorage.removeItem('steedos_last_list_url');
    }
  } catch (e) {
    // 忽略 sessionStorage 不可用
  }
}
if (typeof window !== 'undefined' && !(window as any).__steedosLastListUrlPatched) {
  (window as any).__steedosLastListUrlPatched = true;
  const _push = history.pushState;
  const _replace = history.replaceState;
  history.pushState = function () {
    const r = _push.apply(this, arguments as any);
    recordIfGridListUrl();
    return r;
  };
  history.replaceState = function () {
    const r = _replace.apply(this, arguments as any);
    recordIfGridListUrl();
    return r;
  };
  window.addEventListener('popstate', recordIfGridListUrl);
  // 首次加载也记录一次
  recordIfGridListUrl();
}

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

  // 记录"最近访问的二栏列表页 URL"由模块顶层的 history patch 完成，无需在此重复
  if(!(window as any).goBack){
    (window as any).goBack = ()=>{
      if ((window as any)._appNavCount > 0) {
        (window as any)._appNavCount--;
        navigate(-1);
        return;
      }
      // 没有应用内导航历史，走 fallback：
      // 1) 优先使用 sessionStorage 中保存的最近二栏列表 URL（保留 query 参数如 additionalFilters）
      //    必须与当前 pathname 同 /app/{app}/{obj} 前缀，避免读到旧标签遗留的脏值
      const pathname = window.location.pathname;
      const objMatch = pathname.match(/^(\/app\/[^/]+\/[^/]+)(\/(view|grid)\/.*)?$/);
      try {
        const lastListUrl = sessionStorage.getItem('steedos_last_list_url');
        if (
          lastListUrl &&
          objMatch &&
          lastListUrl.startsWith(objMatch[1] + '/grid/')
        ) {
          sessionStorage.removeItem('steedos_last_list_url');
          navigate(lastListUrl);
          return;
        }
      } catch (e) {
        // 忽略
      }
      // 2) 兜底：截掉 /view/... 或 /grid/... 段，回到对象根路径
      //    （正则同时匹配 view/grid 两种，避免截 grid 时丢段后重新触发 #619）
      if (objMatch && objMatch[2]) {
        navigate(objMatch[1]);
      } else {
        navigate(-1);
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

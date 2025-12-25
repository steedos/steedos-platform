/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 19:18:53
 * @Description: 
 */
import Navbar from "./Navbar"
import { AppHeader } from "./AppHeader"
import GlobalLinkInterceptor from "./GlobalLinkInterceptor";
import { useBlocker, useLocation, useNavigationType } from "react-router";
import { useEffect } from "react";

// 路由监听组件
function RouteChangeHandler() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      console.log(`blocker`, currentLocation, nextLocation)
      return currentLocation.pathname !== nextLocation.pathname
    }
      
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const handleNavigation = async () => {
        const result = await (window as any).SteedosUI?.navigationGuard?.executeHandlers(blocker);
        if (result.allowed) {
          // 所有处理器都通过
          blocker.proceed();
        } else {
          blocker.reset();
        }
      }
      handleNavigation();
    }
  }, [blocker]);

  useEffect(() => {
    const routeChangeData = {
      type: 'ROUTE_CHANGE',
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      navigationType,
      timestamp: new Date().toISOString()
    };

    // 发送全局 window message
    window.postMessage(routeChangeData, '*');

    // 如果是父窗口嵌套（iframe），也可以通知父窗口
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(routeChangeData, '*');
    }
  }, [location, navigationType]);

  return null;
}

export const AppLayout = (props) => {
  const { children } = props;
  
  return (
    <>
      <RouteChangeHandler></RouteChangeHandler>
      <GlobalLinkInterceptor></GlobalLinkInterceptor>
      <AppHeader />
      <div className="creator-content-wrapper transition-all duration-300" id="main">
        {children}
      </div>
    </>
  )
}
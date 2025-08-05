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

export const AppLayout = (props) => {
  const { children } = props;
  return (
    <>
      <GlobalLinkInterceptor></GlobalLinkInterceptor>
      <AppHeader />
      <div className="creator-content-wrapper" id="main">
        {children}
      </div>
    </>
  )
}
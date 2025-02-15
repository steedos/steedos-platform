/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 18:14:13
 * @Description: 
 */
import Navbar from "./Navbar"
import { AppHeader } from "./AppHeader"

export const AppLayout = (props) => {
  const { children } = props;
  return (
    <>
      <AppHeader />
      <div className="creator-content-wrapper" id="main">
        {children}
      </div>
    </>
  )
}
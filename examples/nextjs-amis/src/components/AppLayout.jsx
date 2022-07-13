/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 11:14:44
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Navbar } from '@/components/Navbar';
import { getApp } from '@/lib/apps';
import { useRouter } from 'next/router'

export function AppLayout({ children }) {
    const router = useRouter()
    const { app_id, tab_id } = router.query
    const [app, setApp] = useState(null)

    useEffect(() => {
        if(!app_id) return ;
        getApp(app_id)
          .then((data) => {
            setApp(data)
          })
      }, [app_id]);

    useEffect(() => {
        app?.children?.forEach((item)=>{
            item.current = item.id === tab_id;
        })
    }, [tab_id]);

    return (
      <>
        <Navbar navigation={app?.children} />
        <main>{children}</main>
        {/* <Footer /> */}
      </>
    )
  }
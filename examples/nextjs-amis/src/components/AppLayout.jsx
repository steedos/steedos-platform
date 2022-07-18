/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 14:40:25
 * @Description:  
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Navbar } from '@/components/Navbar';
import { getApp } from '@/lib/apps';
import { useRouter } from 'next/router'
import { setSteedosAuth } from '@/lib/steedos.client';
import { useSession } from "next-auth/react"
export function AppLayout({ children }) {
    const router = useRouter()
    const { app_id, tab_id } = router.query
    const [app, setApp] = useState(null)
    const [selected, setSelected] = useState(tab_id)
    const { data: session } = useSession()
    if(session){
      setSteedosAuth(session.steedos.space, session.steedos.token);
    }

    useEffect(() => {
        if(!app_id || !session) return ;
        getApp(app_id)
          .then((data) => {
            setApp(data)
          })
      }, [app_id, session]);

    useEffect(() => {
        setSelected(tab_id)
    }, [tab_id]);

    return (
      <>
        <Navbar navigation={app?.children} selected={selected}/>
        {session && <main>{children}</main>}
        {/* <Footer /> */}
      </>
    )
  }
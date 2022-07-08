/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 11:59:08
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { Navbar } from '@/components/Navbar'
import { getApp } from '@/lib/apps';


export default function Page ({}) {
  const router = useRouter()
  const { app_id, tab_id } = router.query
  const [app, setApp] = useState(null)

  useEffect(() => {
    if(!app_id) return ;
    getApp(app_id)
      .then((data) => {
        data?.children?.forEach((item)=>{
          if(item.id === tab_id){
            item.current = true;
          }
        })
        setApp(data)
      })
  }, [app_id]);
  return (
    <>
      <Navbar navigation={app?.children}/>
      <div id="amis-root" className="app-wrapper"></div>
      <p className='text-2xl font-medium text-slate-900 dark:text-slate-200'>TODO: 自定义微页面</p>
    </>
  )
}

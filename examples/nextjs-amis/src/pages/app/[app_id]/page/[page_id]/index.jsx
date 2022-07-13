/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 10:24:11
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'


export default function Page ({}) {
  const router = useRouter()
  return (
    <>
      <div id="amis-root" className="app-wrapper"></div>
      <p className='text-2xl font-medium text-slate-900 dark:text-slate-200'>TODO: 自定义微页面</p>
    </>
  )
}

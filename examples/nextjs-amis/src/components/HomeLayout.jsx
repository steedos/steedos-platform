/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 10:37:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 11:22:09
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from 'react';
import Head from 'next/head'

import { Footer } from '@/components/home/Footer'
import { Header } from '@/components/home/Header'

export function HomeLayout({ children }) {
  return (
    <>
      <Head>
        <title>Steedos - Build external apps made simple for developers</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header/>
      {children}
      <Footer />
    </>
  )
}

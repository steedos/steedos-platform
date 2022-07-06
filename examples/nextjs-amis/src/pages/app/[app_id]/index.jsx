/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 16:25:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 16:32:12
 * @Description: 
 */
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/router'


import { getApp } from '@/lib/apps';

export default function App() {

  const router = useRouter()
  const { app_id } = router.query
  const [app, setApp] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getApp(app_id)
      .then((data) => {
        setApp(data)
        setLoading(false)
      })
  }, []);

  if (isLoading) return <p>Loading...</p>
  if (!app) return <p>No profile data</p>

  return (
    <>
      <Navbar navigation={app.children}/>
      <div></div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/app',
        permanent: false,
      },
    }
  }
  return {
    props: { },
  }
}
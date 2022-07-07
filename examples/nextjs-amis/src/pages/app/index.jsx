import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar'

import { getApps } from '@/lib/apps';

export default function Apps() {
  const [apps, setApps] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getApps()
      .then((data) => {
        setApps(data)
        setLoading(false)
      })
  }, []);
  if (isLoading) return <p>Loading...</p>
  if (!apps) return <p>No profile data</p>
  return (
    <>
      <Navbar navigation={apps}/>
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
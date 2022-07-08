import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/router'

import { getApps } from '@/lib/apps';

export default function Apps() {
  const [apps, setApps] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setLoading(true)
    getApps()
      .then((data) => {
        setApps(data)
        setLoading(false)
      })
  }, []);
  const handleClick = (e) => {
    e.preventDefault()
    router.push(e.target.parentNode.href)
  }
  if (isLoading) return <p>Loading...</p>
  if (!apps) return <p>No profile data</p>
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {apps.map((app) => (
            <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
              {/* <div className="aspect-w-5 aspect-h-3 bg-gray-200 group-hover:opacity-75">
                <img src="https://console.steedos.cn/api/files/images/iKZwtqo36cX54rcgD" className="w-full h-full object-center object-cover sm:w-full sm:h-full" />
              </div> */}
              <div className="flex-1 p-4 space-y-2 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={app.path} onClick={handleClick}>
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    {app.name}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
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
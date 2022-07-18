/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 14:44:06
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@/lib/objects';
import { unstable_getServerSession } from "next-auth/next"
import { AmisRender } from '@/components/AmisRender'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { values } from 'lodash';

export default function Page ({}) {
  const [selected, setSelected] = useState();
  const router = useRouter()
  const { app_id, tab_id } = router.query
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    if(!tab_id) return ;
    getListSchema(app_id, tab_id, selected?.name)
      .then((data) => {
        if(!schema){
          setSelected(values(data.uiSchema?.list_views).length > 0 ? values(data.uiSchema.list_views)[0] : null)
        }
        setSchema(data)
      })
  }, [tab_id, selected]);

  const newRecord = ()=>{
    router.push('/app/'+app_id+'/'+tab_id+'/view/new')
  }

  return (
    <>
      <div className="z-10 p-4 pb-0">
              <div className="space-y-4">
                  <div className="pointer-events-auto w-full rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
                      <div className="flex justify-between">
                          <div className="font-medium text-slate-900 text-base">{schema?.uiSchema?.label}</div>
                          <div className="ml-6 fill-slate-400">
                          <button onClick={newRecord} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow focus:outline-none">新建</button>
                            </div>
                      </div>
                      <Listbox value={selected} onChange={setSelected}>
                        <div className="mt-1">
                          <Listbox.Button className="min-w-[6rem] w-auto cursor-default py-2 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected?.label}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {values(schema?.uiSchema?.list_views).map((listView, personIdx) => (
                                <Listbox.Option
                                  key={personIdx}
                                  className={({ active }) =>
                                    `cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={listView}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {listView.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                  </div>
              </div>
          </div>
      <AmisRender id={`${app_id}-${tab_id}`} schema={schema?.amisSchema || {}} router={router}></AmisRender>
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
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 16:03:36
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { Navbar } from '@/components/Navbar'
import { getApp } from '@/lib/apps';
import { getListSchema } from '@/lib/objects';

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { values } from 'lodash';

export default function Page ({}) {
  const [selected, setSelected] = useState();
  const router = useRouter()
  const { app_id, tab_id } = router.query
  const [app, setApp] = useState(null)

  const [schema, setSchema] = useState(null);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    if(!app_id) return ;
    getApp(app_id)
      .then((data) => {
        data?.children?.forEach((item)=>{
          if(item.id === tab_id){
            item.current = true;
          }
        })
        setApp(data)
        setLoading(false)
      })
  }, [app_id, tab_id]);

  useEffect(() => {
    setLoading(true)
    if(!tab_id) return ;
    getListSchema(app_id, tab_id, selected?.name)
      .then((data) => {
        if(!schema){
          setSelected(values(data.uiSchema?.list_views).length > 0 ? values(data.uiSchema.list_views)[0] : null)
        }
        setSchema(data)
        setLoading(false)
      })
  }, [tab_id, selected]);

  useEffect(() => {
    (function () {
      let amis = amisRequire('amis/embed');
      if(document.getElementById("amis-root") && schema?.amisSchema){
        console.log(`schema.amisSchema===========>`, schema.amisSchema)
        let amisScoped = amis.embed('#amis-root', 
        schema.amisSchema, 
        {}, 
        {
          theme: 'antd',
          jumpTo: (to, action) => {
            console.log(`jumpTo====>`, to, action)
            if (to === 'goBack') {
                return window.history.back();
            }

            to = normalizeLink(to);

            if (action && action.actionType === 'url') {
                action.blank === false ? (window.location.href = to) : window.open(to);
                return;
            }

            // 主要是支持 nav 中的跳转
            if (action && to && action.target) {
                window.open(to, action.target);
                return;
            }
            console.log(`to`, to)
            if (/^https?:\/\//.test(to)) {
                window.location.replace(to);
            } else {
                router.push(to);
            }
        }
        }
      );
      }
    })();
  }, [schema]);


  const amisRootClick = (e)=>{
    if(e.target.nodeName.toLocaleLowerCase() === 'a' && e.target.href){
      e.preventDefault();
      router.push(e.target.href)
    }
  }

  return (
    <>
      <Navbar navigation={app?.children}/>
      <div className="relative z-10 p-4 pb-0">
              <div className="space-y-4">
                  <div className="pointer-events-auto w-full rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
                      <div className="flex justify-between">
                          <div className="font-medium text-slate-900 text-base">{schema?.uiSchema?.label}</div>
                      </div>
                      <Listbox value={selected} onChange={setSelected}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative min-w-[6rem] w-auto cursor-default py-2 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
      <div id="amis-root" className="app-wrapper" onClick={amisRootClick}></div>
    </>
  )
}

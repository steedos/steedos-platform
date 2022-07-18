/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 14:45:26
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { getViewSchema, getFormSchema, getObjectRelateds } from '@/lib/objects';
import { AmisRender } from '@/components/AmisRender'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Tab } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Record({ }) {

    const router = useRouter()
    const { app_id, tab_id, record_id } = router.query
    const [isEditing, setIsEditing] = useState(false);
    const [schema, setSchema] = useState(null);
    const [relateds, setRelateds] = useState(null);

    useEffect(() => {
        setIsEditing(false)
    }, [router]);

    useEffect(() => {
        if(record_id === 'new'){
            setIsEditing(true)
        }else{
            setIsEditing(false)
        }
    }, [record_id]);

    useEffect(() => {
        if(isEditing){
            editRecord(tab_id, record_id)
        }else{
            viewRecord(tab_id, record_id);
        }
    }, [tab_id, record_id, isEditing]);

    const viewRecord = (tab_id, record_id)=>{
        if(tab_id && record_id){
            getViewSchema(tab_id, record_id)
            .then((data) => {
                setSchema(data)
            });
            getObjectRelateds(app_id, tab_id, record_id).then((data)=>{
                setRelateds(data)
            })
        }
    }

    const editRecord = () => {
        if(tab_id && record_id){
            getFormSchema(tab_id, {recordId: record_id, tabId: tab_id, appId: app_id})
            .then((data) => {
                setSchema(data)
            })
        }
    }

    const cancelClick = () => {
        if(record_id === 'new'){
            router.back()
        }else{
            setIsEditing(false)
        }
    }

    const editClick = ()=>{
        setIsEditing(true)
    }

    return (
        <>
            <div className="z-10 p-4 pb-0">
                <div className="space-y-4">
                    <div className="pointer-events-auto w-full rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
                        <div className=''>
                            <div className="flex justify-between">
                                <div className="font-medium text-slate-900 text-base">{schema?.uiSchema?.label}</div>
                                <div className="ml-6 fill-slate-400">
                                { !isEditing && <button onClick={editClick} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow focus:outline-none">编辑</button>}
                                {  isEditing && <button onClick={cancelClick} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow focus:outline-none">取消</button>}
                                </div>
                            </div>
                            <div className="mt-1 text-slate-700">TODO: 记录名称</div>
                        </div>
                    </div>
                </div>
            </div>
            <AmisRender id={`${app_id}-${tab_id}-${record_id}`} schema={schema?.amisSchema || {}} router={router}></AmisRender>
            <div className="z-10 p-4 pb-0">
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {relateds?.map((related)=>{
                            return (<Tab
                                className={({ selected }) =>
                                    classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    )
                                }
                            >{related?.schema?.uiSchema?.label}</Tab>)
                        })}
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        {relateds?.map((related)=>{
                            return (
                                <Tab.Panel className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                                  )}>
                                    <AmisRender id={`amis-root-related-${related.object_name}-${related.foreign_key}`} schema={related?.schema.amisSchema || {}} router={router}></AmisRender>
                                </Tab.Panel>
                            )
                        })}
                    </Tab.Panels>
                </Tab.Group>
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
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 16:28:37
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Navbar } from '@/components/Navbar'
import { getApp } from '@/lib/apps';
import { getViewSchema, getFormSchema } from '@/lib/objects';

export default function Record({ }) {

    const router = useRouter()
    const { app_id, tab_id, record_id } = router.query
    const [app, setApp] = useState(null)

    const [isEditing, setIsEditing] = useState(false)

    const [schema, setSchema] = useState(null);

    useEffect(() => {
        if (!app_id) return;
        getApp(app_id)
            .then((data) => {
                data?.children?.forEach((item) => {
                    if (item.id === tab_id) {
                        item.current = true;
                    }
                })
                setApp(data)
            })
    }, [app_id]);

    useEffect(() => {
        if(isEditing){
            editRecord(tab_id, record_id)
        }else{
            viewRecord(tab_id, record_id);
        }
    }, [tab_id, record_id, isEditing]);

    useEffect(() => {
        (function () {
            let amis = amisRequire('amis/embed');
            if (document.getElementById("amis-root") && schema) {
                console.log(`schema.amisSchema======record=====>`, schema.amisSchema)
                let amisScoped = amis.embed('#amis-root',
                    schema.amisSchema,
                    {},
                    {
                        theme: 'antd',
                        jumpTo: (to, action) => {
                            console.log(`jumpTo====================>`, to, action)
                            if(action.type === 'submit' && router.asPath === to){
                                setIsEditing(false);
                            }
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

    const viewRecord = (tab_id, record_id)=>{
        if(tab_id && record_id){
            getViewSchema(tab_id, record_id)
            .then((data) => {
                setSchema(data)
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

    return (
        <>
            <Navbar navigation={app?.children} />
            <div className="relative z-10 p-4 pb-0">
                <div className="space-y-4">
                    <div className="pointer-events-auto w-full rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
                        <div className=''>
                            <div className="flex justify-between">
                                <div className="font-medium text-slate-900 text-base">{schema?.uiSchema?.label}</div>
                                <div className="ml-6 fill-slate-400">
                                { !isEditing && <button onClick={()=>{setIsEditing(true)}} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow focus:outline-none">编辑</button>}
                                {  isEditing && <button onClick={()=>{setIsEditing(false)}} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow focus:outline-none">取消</button>}
                            </div>
                            </div>
                            <div className="mt-1 text-slate-700">TODO: 记录名称</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="amis-root" className="app-wrapper"></div>
        </>
    )
}
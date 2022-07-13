/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 10:14:59
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { getViewSchema, getFormSchema } from '@/lib/objects';

const normalizeLink = (to, location = window.location) => {
    to = to || '';
  
    if (to && to[0] === '#') {
      to = location.pathname + location.search + to;
    } else if (to && to[0] === '?') {
      to = location.pathname + to;
    }
  
    const idx = to.indexOf('?');
    const idx2 = to.indexOf('#');
    let pathname = ~idx
      ? to.substring(0, idx)
      : ~idx2
      ? to.substring(0, idx2)
      : to;
    let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
    let hash = ~idx2 ? to.substring(idx2) : location.hash;
  
    if (!pathname) {
      pathname = location.pathname;
    } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
      let relativeBase = location.pathname;
      const paths = relativeBase.split('/');
      paths.pop();
      let m;
      while ((m = /^\.\.?\//.exec(pathname))) {
        if (m[0] === '../') {
          paths.pop();
        }
        pathname = pathname.substring(m[0].length);
      }
      pathname = paths.concat(pathname).join('/');
    }
  
    return pathname + search + hash;
  };

export default function Record({ }) {

    const router = useRouter()
    const { app_id, tab_id, record_id } = router.query
    const [isEditing, setIsEditing] = useState(false);
    const [schema, setSchema] = useState(null);

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

    useEffect(() => {
        (function () {
            let amis = amisRequire('amis/embed');
            if (document.getElementById("amis-root") && schema) {
                let amisScoped = amis.embed('#amis-root',
                    schema.amisSchema,
                    {},
                    {
                        theme: 'antd',
                        jumpTo: (to, action) => {
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
            <div className="relative z-10 p-4 pb-0">
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
            <div id="amis-root" className="app-wrapper"></div>
        </>
    )
}
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 11:12:03
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Navbar } from '@/components/Navbar'
import { getApp } from '@/lib/apps';
import { getListSchema } from '@/lib/objects';

export default function Page ({}) {

  const router = useRouter()
  const { app_id, tab_id } = router.query
  console.log(`app_id: ${app_id}`, `tab_id: ${tab_id}`)
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
  }, [app_id]);

  useEffect(() => {
    setLoading(true)
    if(!tab_id) return ;
    getListSchema(tab_id)
      .then((data) => {
        setSchema(data)
        setLoading(false)
      })
  }, [tab_id]);

  useEffect(() => {
    (function () {
      let amis = amisRequire('amis/embed');
      if(document.getElementById("amis-root") && schema){
        let amisScoped = amis.embed('#amis-root', 
        schema, 
        {}, 
        {
          theme: 'antd'
        }
      );
      }
    })();
  }, [schema]);

  if (isLoading) return <p>Loading...</p>
  if (!app) return <p>No profile data</p>

  return (
    <>
      <Navbar navigation={app.children}/>
      <div id="amis-root" className="app-wrapper"></div>
    </>
  )
}

// export async function getServerSideProps(context) {
//   const schema = {
//     "title": "带边栏联动",
//     "aside": {
//       "type": "form",
//       "wrapWithPanel": false,
//       "target": "window",
//       "submitOnInit": true,
//       "body": [
//         {
//           "type": "input-tree",
//           "name": "cat",
//           "inputClassName": "no-border",
//           "submitOnChange": true,
//           "selectFirst": true,
//           "options": [
//             {
//               "label": "分类1",
//               "value": "cat1"
//             },
//             {
//               "label": "分类2",
//               "value": "cat2",
//               "children": [
//                 {
//                   "label": "分类 2.1",
//                   "value": "cat2.1"
//                 },
//                 {
//                   "label": "分类 2.2",
//                   "value": "cat2.2"
//                 }
//               ]
//             },
//             {
//               "label": "分类3",
//               "value": "cat3"
//             },
//             {
//               "label": "分类4",
//               "value": "cat4"
//             }
//           ]
//         }
//       ]
//     },
//     "toolbar": [
//       {
//         "type": "button",
//         "actionType": "dialog",
//         "label": "新增",
//         "primary": true,
//         "dialog": {
//           "title": "新增",
//           "body": {
//             "type": "form",
//             "name": "sample-edit-form",
//             "api": "post:/amis/api/sample",
//             "body": [
//               {
//                 "type": "input-text",
//                 "name": "engine",
//                 "label": "Engine",
//                 "required": true
//               },
//               {
//                 "type": "divider"
//               },
//               {
//                 "type": "input-text",
//                 "name": "browser",
//                 "label": "Browser",
//                 "required": true
//               },
//               {
//                 "type": "divider"
//               },
//               {
//                 "type": "input-text",
//                 "name": "platform",
//                 "label": "Platform(s)",
//                 "required": true
//               },
//               {
//                 "type": "divider"
//               },
//               {
//                 "type": "input-text",
//                 "name": "version",
//                 "label": "Engine version"
//               },
//               {
//                 "type": "divider"
//               },
//               {
//                 "type": "input-text",
//                 "name": "grade",
//                 "label": "CSS grade"
//               }
//             ]
//           }
//         }
//       }
//     ],
//     "body": {
//       "type": "crud",
//       "draggable": true,
//       "api": {
//         "url": "/amis/api/sample",
//         "sendOn": "this.cat"
//       },
//       "filter": {
//         "title": "条件搜索",
//         "submitText": "",
//         "body": [
//           {
//             "type": "input-text",
//             "name": "keywords",
//             "placeholder": "通过关键字搜索",
//             "addOn": {
//               "label": "搜索",
//               "type": "submit"
//             }
//           },
//           {
//             "type": "plain",
//             "text": "这里的表单项可以配置多个"
//           }
//         ]
//       },
//       "bulkActions": [
//         {
//           "label": "批量删除",
//           "actionType": "ajax",
//           "api": "delete:/amis/api/sample/$ids",
//           "confirmText": "确定要批量删除?"
//         },
//         {
//           "label": "批量修改",
//           "actionType": "dialog",
//           "dialog": {
//             "title": "批量编辑",
//             "name": "sample-bulk-edit",
//             "body": {
//               "type": "form",
//               "api": "/amis/api/sample/bulkUpdate2",
//               "body": [
//                 {
//                   "type": "hidden",
//                   "name": "ids"
//                 },
//                 {
//                   "type": "input-text",
//                   "name": "engine",
//                   "label": "Engine"
//                 }
//               ]
//             }
//           }
//         }
//       ],
//       "quickSaveApi": "/amis/api/sample/bulkUpdate",
//       "quickSaveItemApi": "/amis/api/sample/$id",
//       "columns": [
//         {
//           "name": "id",
//           "label": "ID",
//           "width": 20,
//           "sortable": true,
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "name": "engine",
//           "label": "Rendering engine",
//           "sortable": true,
//           "searchable": true,
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "name": "browser",
//           "label": "Browser",
//           "sortable": true,
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "name": "platform",
//           "label": "Platform(s)",
//           "sortable": true,
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "name": "version",
//           "label": "Engine version",
//           "quickEdit": true,
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "name": "grade",
//           "label": "CSS grade",
//           "quickEdit": {
//             "mode": "inline",
//             "type": "select",
//             "options": [
//               "A",
//               "B",
//               "C",
//               "D",
//               "X"
//             ],
//             "saveImmediately": true
//           },
//           "type": "text",
//           "toggled": true
//         },
//         {
//           "type": "operation",
//           "label": "操作",
//           "width": 130,
//           "buttons": [
//             {
//               "type": "button",
//               "icon": "fa fa-eye",
//               "actionType": "dialog",
//               "dialog": {
//                 "title": "查看",
//                 "body": {
//                   "type": "form",
//                   "body": [
//                     {
//                       "type": "static",
//                       "name": "engine",
//                       "label": "Engine"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "static",
//                       "name": "browser",
//                       "label": "Browser"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "static",
//                       "name": "platform",
//                       "label": "Platform(s)"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "static",
//                       "name": "version",
//                       "label": "Engine version"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "static",
//                       "name": "grade",
//                       "label": "CSS grade"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "html",
//                       "html": "<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>"
//                     }
//                   ]
//                 }
//               }
//             },
//             {
//               "type": "button",
//               "icon": "fa fa-pencil",
//               "actionType": "dialog",
//               "dialog": {
//                 "title": "编辑",
//                 "body": {
//                   "type": "form",
//                   "name": "sample-edit-form",
//                   "api": "/amis/api/sample/$id",
//                   "body": [
//                     {
//                       "type": "input-text",
//                       "name": "engine",
//                       "label": "Engine",
//                       "required": true
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "input-text",
//                       "name": "browser",
//                       "label": "Browser",
//                       "required": true
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "input-text",
//                       "name": "platform",
//                       "label": "Platform(s)",
//                       "required": true
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "input-text",
//                       "name": "version",
//                       "label": "Engine version"
//                     },
//                     {
//                       "type": "divider"
//                     },
//                     {
//                       "type": "input-text",
//                       "name": "grade",
//                       "label": "CSS grade"
//                     }
//                   ]
//                 }
//               }
//             },
//             {
//               "type": "button",
//               "icon": "fa fa-times text-danger",
//               "actionType": "ajax",
//               "confirmText": "您确认要删除?",
//               "api": "delete:/amis/api/sample/$id"
//             }
//           ],
//           "toggled": true
//         }
//       ]
//     }
//   };
//   return {
//     props: { schema },
//   }
// }
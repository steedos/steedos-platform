// import dva from 'dva'
import React, { useMemo, useCallback } from 'react'
import { useRequest } from 'ahooks';
import { Skeleton, message } from 'antd'
import Page , { DvaModel } from '../src'
// import getAllModelsTest from './g6-test/mock/model-test'
// import getAllModulesTest from './g6-test/mock/module-test'
import { toModules, toERDModels  } from './g6-test/mock/steedos-test'


import init from  './unstated'

const ErdPdmPage =  (props) => {
  var href = new URL(window.location.href);
  var foo = href.pathname.split('/schema-builder');
  var ROOT_URL_PATH_PREFIX = '';
  if(foo.length > 1){
      ROOT_URL_PATH_PREFIX = foo[0];
  }
  const { data, error, loading } = useRequest(ROOT_URL_PATH_PREFIX+'/api/v4/objects/schema/erd');
  // alert(JSON.stringify(data))
   const { getModels, getModules } = useMemo(() => ({
    getModels: async () =>  ({ res: toERDModels(data) }),
    getModules: async () => ({ res: toModules() }),
    // getModels: async () =>  ({ res: getAllModelsTest }),
    // getModules: async () => ({ res: getAllModulesTest }),
   }), [data])

   if(error?.message === 'Unauthorized') {
    //  alert(window.location.href)
     message.error('请登录');
     window.location.href = ROOT_URL_PATH_PREFIX+'/login?redirect_uri='+ encodeURI(window.location.href)
   } else {
     if(error)  message.error(error.message);
   }


   const openModelFun = useCallback((args)=>{
     window.open(`${ROOT_URL_PATH_PREFIX}/app/admin/objects/view/${args.model}`,'model')
   } , [])
    
  if(!data) return <Skeleton avatar active paragraph={{ rows: 20 }} >{error?.message}</Skeleton>
   return (
   <Page {...props}
     getModels={getModels}
     getModules={getModules}
     modelEditFun={openModelFun}
     isFullScreen
       />
   )
}
// alert()
// // 创建应用
// const app = dva()
// app.model(DvaModel({namespace: 'erd'}) as any)
// // 注册视图
// app.router(() => (
//   <div>
//    <ErdPdmPage />
//   </div>
// ))
// // 启动应用
// app.start('#app')
init(ErdPdmPage)
// document.appendChild(new HTMLDivElement({}))
// import './testg6'

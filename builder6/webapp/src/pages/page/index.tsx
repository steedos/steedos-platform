import React, { useState, useEffect } from 'react';
import { AmisRender } from '../../components/AmisRender';
import { useParams } from 'react-router-dom';
import { Builder } from "@builder6/react";

// 这是一个简单的辅助函数，模拟 lodash 的 isString，如果项目中已有 lodash 可直接使用
const isString = (val) => typeof val === 'string';


function injectServerCss(cssString) {

  // 1. 创建 style 标签
  const styleTag = document.createElement('style');
  styleTag.id = 'app-page-styles'; // 设置 ID 以便后续更新或删除
  
  // 2. 填入 CSS 内容
  styleTag.innerHTML = cssString;
  
  // 3. 挂载到 head 中
  // 如果之前已经存在，先移除旧的（避免重复堆叠）
  const oldStyle = document.getElementById('app-page-styles');
  if (oldStyle) {
    oldStyle.remove();
  }
  document.head.appendChild(styleTag);
}


export const PageView = () => {
    const { appId, pageId } = useParams();
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 假设 formFactor 是一个需要的变量，你可能需要根据实际情况获取（比如 'PC' 或 'MOBILE'）
    const formFactor = ''; 

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                setLoading(true);
                // 1. 拼接 URL
                const url = `/api/v6/pages/schema/app?app=${appId}&pageId=${pageId}&formFactor=${formFactor}`;
                
                // 2. 发起请求
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 如果需要鉴权 token，请在这里添加
                        // 'Authorization': `Bearer ${token}` 
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const payload = await response.json();

                if(payload && payload.css) {
                  injectServerCss(payload.css);
                }
                // 3. 执行原本 Adaptor 中的逻辑
                // 原逻辑: _.isString(payload.schema) ? JSON.parse(payload.schema) : payload.schema
                let finalSchema = payload.schema;
                if (isString(finalSchema)) {
                    try {
                        finalSchema = JSON.parse(finalSchema);
                    } catch (e) {
                        console.error("Schema parse failed", e);
                    }
                }

                setSchema(finalSchema);
            } catch (err) {
                console.error("Fetch schema failed", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (appId && pageId) {
            fetchSchema();
        }
    }, [appId, pageId]);

    // 4. 处理 Loading 和 Error 状态
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error loading page configuration.</div>;

    // 5. 渲染 Amis
    return (
      <AmisRender 
        schema={{
            type: 'page',
            // 保持原有的样式类名逻辑
            bodyClassName: `p-0 page-${pageId}`,
            // 将获取到的 schema 直接作为 body 渲染
            body: schema 
        }} 
        data={{
            context: {
                app: appId,
                appId: appId,
                app_id: appId,
                ...Builder.settings.context,
            },
            app: appId,
            appId: appId,
            app_id: appId,
            pageId: pageId
        }} 
        env={{}} 
      />
    );
};
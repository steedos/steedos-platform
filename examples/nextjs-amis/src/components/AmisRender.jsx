/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 17:03:51
 * @Description: 
 */

import React, { useState, useEffect, Fragment } from 'react';
import { amisRender, amisRootClick } from '@/lib/amis';

export function AmisRender({id, schema, data, router}) {
    useEffect(() => {
        (function () {
            amisRender(`#${id}`, schema, data, {}, {router: router})
        })();
      }, [id, schema, data]);

    return (
        <div id={id} className="app-wrapper" onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
}
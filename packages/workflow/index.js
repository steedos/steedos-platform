/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-17 11:30:05
 * @Description: 
 */
const express = require('express');
const path = require('path');
exports.init = function ({  }) {
    let desingerDir = path.dirname(require.resolve("@steedos/steedos-plugin-workflow/package.json"));
    require('./src/designerRouter')
    require('@steedos/router').staticRouter().use('/applications', express.static(path.join(desingerDir, 'public')));
    require('./src/instance_files')
    require('./src/office_convert_to_pdf_router')
};
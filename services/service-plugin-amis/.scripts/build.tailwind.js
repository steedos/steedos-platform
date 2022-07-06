/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-06 16:49:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 17:00:03
 * @Description: 
 */

const fs = require('fs');
const path = require('path');
const babel = require("@babel/core");

try {
    const tailwindConfig = fs.readFileSync(path.join(__dirname, '../src/tailwind.js'), 'utf8')
    
    const code = babel.transformSync(tailwindConfig, { 
        sourceType: "script", //移除安全模式
        comments: false,
        presets: [
            [
                "@babel/preset-env"
            ]
        ], 
        targets: {
            chrome: "73",
        }
    }).code;
    fs.writeFileSync(path.join(__dirname, '../public/tailwind/tailwind.js'), code);
} catch (error) {
    console.error(error)
}
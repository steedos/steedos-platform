"use strict";
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const bcrypt = require('bcryptjs');
const CustomStrategy = require('passport-custom').Strategy;
const axios = require('axios');

// Node-Red Configuration
// https://nodered.org/docs/user-guide/runtime/configuration

const steedosRootUrl =  process.env.ROOT_URL || "http://127.0.0.1";

const uiPort = process.env.NODERED_PORT || "1880";
const storageDir = path.join(process.env.STEEDOS_STORAGE_DIR || "./storage", "data", "nodered");

try {
    fs.mkdirSync(storageDir, { recursive: true });
    console.log("目录已成功创建或已存在。");
    // 在这里继续执行其他操作
} catch (err) {
    console.error("创建目录失败:", err);
}

const flowFilePath = path.join(storageDir, 'flows.json');
const templateFlowFilePath = path.join(__dirname, 'flows-template.json'); // 模板文件路径

// 检查并复制模板文件
if (!fs.existsSync(flowFilePath)) {
    console.log(`flows.json 文件不存在，从模板文件复制: ${templateFlowFilePath} 到 ${flowFilePath}`);
    fs.copyFileSync(templateFlowFilePath, flowFilePath);
}

module.exports = {
    flowFile: path.join(storageDir,'flows.json'),
    flowFilePretty: true,
    credentialSecret: process.env.NODERED_CREDENTIAL_SECRET || 'steedos',
    userDir: path.join(storageDir, '.node-red'),
    functionGlobalContext: {
        lodash
    },
    editorTheme: {
        header: {
            title: "Flow Builder",
            image: path.join(__dirname, 'logo.png'),
        },
        page: {
            title: "Flow Builder",
            favicon: path.join(__dirname, 'logo.png'),
        },
        login: {
            image: path.join(__dirname, 'flow-builder.png'),
        },
        tours: false,
    },
    uiPort,
    
    httpStatic: path.join(__dirname, 'public'),
    adminAuth: {
        type: "credentials",
        users: function(username) {
            // 返回一个 Promise
            return new Promise(function(resolve) {
                // 不需要在这里验证密码，因为密码在 authenticate 函数中处理
                // 返回包含用户名的用户对象，但不包含密码
                resolve({ username: username, permissions: "*" });
            });
        },
        authenticate: function(username, password) {
            /* 使用环境变量密码登录 */
            if (username === 'admin') {
                // 将环境变量中的密码与输入的密码进行比较
                if (password === process.env.NODERED_PASSWORD) {
                    return Promise.resolve({username: "admin", permissions: "*"});
                }
            }
            /* 非saas模式下，支持 admin 简档登录 */
            return new Promise(function(resolve) {
                // 构建请求体
                const requestBody = {
                    "user": { "email": username },
                    "password-unencrypted": password
                };

                // 发送 POST 请求到身份验证接口
                axios.post(`${steedosRootUrl}/accounts/password/login`, requestBody)
                    .then(response => {
                        // 根据接口返回的数据判断验证是否成功
                        if (response.status === 200) {
                            console.log('login', response.data)
                            const space = response.data.space;
                            const token = response.data.token;

                            axios.post(`${steedosRootUrl}/api/v4/users/validate`, {}, {
                                headers: {
                                  'Authorization': `Bearer ${space},${token}`
                                }
                            })
                            .then(response2 => {
                                // 根据接口返回的数据判断验证是否成功
                                if (response2.status === 200) {
                                    console.log('validate', response2.data)
                                    const roles = response2.data.roles;
                                    if (roles.includes('admin')) {
                                        // 验证成功，返回包含用户名和权限的用户对象
                                        resolve({ username: username, permissions: "*" });
                                    } else {
                                        console.log('The user does not have the admin role.');
                                        // Perform actions for non-admin users
                                        // 验证失败
                                        resolve(null);
                                    }
                                }
                            // Handle the response here
                            })
                            .catch(error => {
                                // 验证失败
                                resolve(null);
                            });
                        } else {
                            // 验证失败
                            resolve(null);
                        }
                    })
                    .catch(error => {
                        // 处理错误，拒绝 Promise
                        console.error('Authentication error:', error);
                        resolve(null);
                    });
            });
        }
    },
};

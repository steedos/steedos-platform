/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 14:48:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-10 15:25:45
 * @Description: 
 */
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');

function parseOrigin(originEnv) {
    if (originEnv === 'true') {
        return true;
    } else if (originEnv === 'false') {
        return false;
    } else if (/^\/.*\/$/.test(originEnv)) { // 正则表达式检查
        return new RegExp(originEnv.slice(1, -1)); // 去掉两边的斜杠
    } else if (originEnv.startsWith('[') && originEnv.endsWith(']')) { // 数组检查
        const originsArray = JSON.parse(originEnv);
        return originsArray.map(item => {
            if (typeof item === 'string') {
                return item;
            } else if (/^\/.*\/$/.test(item)) {
                return new RegExp(item.slice(1, -1));
            } else {
                throw new Error('Invalid origin value in array');
            }
        });
    } else if (typeof originEnv === 'string') {
        return originEnv;
    } else {
        throw new Error('Invalid origin value');
    }
}

const originEnv = process.env.STEEDOS_CORS_ORIGIN;
let origin = true;
try {
    origin = parseOrigin(originEnv);
    console.log('Parsed origin:', origin);
} catch (error) {
    console.error('Error parsing origin:', error.message);
}

console.log(`origin----<`, origin)

class ExpressAppStatic{
    app = null;
    beforeRouter = null;
    router = null;
    constructor(){
        this.beforeRouter = express.Router();
        this.router = express.Router();
        // 读取环境变量、配置文件, 启动端口, 控制中间件
        const app = express();
		app.use(cors({origin: origin, credentials: true}))
		app.use(compression());
        app.use(session({
            secret: process.env.STEEDOS_SESSION_SECRET || 'steedos',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, maxAge: 800000 },
            name: 'ivan'
        }))
        if(process.env.STEEDOS_API_PORT){
            app.listen(process.env.STEEDOS_API_PORT, err => {
                if (err)
                    return console.log(err)
                app.use(this.staticBeforeRouter())
                app.use(this.staticRouter())
                return console.info(`Steedos Experience Server listening on ${process.env.STEEDOS_API_URL}`);
            });
        }
        this.app = app;
    }

    public staticRouter = ()=>{
        return this.router;
    }

    public staticApp = ()=>{
        return this.app;
    }

    public staticBeforeRouter = ()=>{
        return this.beforeRouter;
    }
}

export const expressApp = new ExpressAppStatic();


export const staticRouter = ()=>{
    return expressApp.staticRouter();
}

export const staticBeforeRouter = ()=>{
    return expressApp.staticBeforeRouter();
}

// setInterval(()=>{
//     console.log(`expressApp.staticRouter()====>`, expressApp.staticRouter())
// }, 1000)
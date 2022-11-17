/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 14:48:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-16 18:27:51
 * @Description: 
 */
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const session = require('express-session')

class ExpressAppStatic{
    app = null;
    beforeRouter = null;
    router = null;
    constructor(){
        this.beforeRouter = express.Router();
        this.router = express.Router();
        // 读取环境变量、配置文件, 启动端口, 控制中间件
        const app = express();
		app.use(cors({origin: true, credentials: true}))
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
                app.use(this.beforeRouter())
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
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 14:48:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 15:58:29
 * @Description: 
 */
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const session = require('express-session')
const _ = require('lodash');

class ExpressAppStatic{
    app = null;
    beforeRouter = null;
    router = null;
    scripts = '';
    constructor(){
        this.beforeRouter = express.Router();
        this.router = express.Router();
        this.initClientJsRouter();
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
                app.use(this.staticBeforeRouter())
                app.use(this.staticRouter())
                return console.info(`Steedos Experience Server listening on ${process.env.STEEDOS_API_URL}`);
            });
        }
        this.app = app;
    }

    private initClientJsRouter = ()=>{
        this.router.get('/client_scripts.js', (req, res)=>{
            res.header('Content-Type', 'application/javascript');
            res.send(this.scripts);
        });
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

    public setClientScripts = (scripts: string)=>{
        this.scripts = scripts;
    }
}

export const expressApp = new ExpressAppStatic();


export const staticRouter = ()=>{
    return expressApp.staticRouter();
}

export const staticBeforeRouter = ()=>{
    return expressApp.staticBeforeRouter();
}

const routersApp = staticRouter();

export const loadRouters = (routers)=>{
    _.each(routers, (router)=>{
        if(router.router.default !== routersApp){
            if(router.router.default){
                _.each(router.router.default.stack, (layer)=>{
                    routersApp.stack.push(layer)
                })
            }
        }
    })
}

export const removeRouter = (path, methods)=>{
    routersApp?.stack.forEach(function(route,i,routes) {
        if (route.route && route.route.path === path) {
            if(JSON.stringify(route.route.methods) === JSON.stringify(methods)){
                routes.splice(i,1);
            }
        }
        if(route.handle.stack){
            route.handle.stack.forEach(function(_route,i,routes) {
                if (_route.route && _route.route.path === path) {
                    if(JSON.stringify(_route.route.methods) === JSON.stringify(methods)){
                        routes.splice(i,1);
                    }
                }
            });
        }
    });
}

// setInterval(()=>{
//     console.log(`expressApp.staticRouter()====>`, expressApp.staticRouter())
// }, 1000)
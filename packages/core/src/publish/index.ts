import express = require('express');
import {auth} from "@steedos/auth";
const _ = require("underscore")

var app = express();
const router = express.Router();

import {PublishListViews} from './publish_listviews'
import {Permission} from './permission'


router.post('/publish', async function(req, res){
    try {
        let data = req.body
        let user = await auth(req, res)
        let spaceId = user.spaceId
        let userId = user.userId

        if(_.isEmpty(userId)){
            throw new Error("No permission")
        }

        if(_.isEmpty(spaceId)){
            throw new Error("spaceId is required")
        }

        let permission = new Permission(spaceId, userId)

        if(!await permission.isSpaceAdmin()){
            throw new Error("No permission")
        }

        if(data.list_views){
            let publishListView = new PublishListViews(spaceId, userId, data.list_views)
            await publishListView.run();
        }
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

export class Publish{
    static init(){
        app.use(router)
        WebApp.connectHandlers.use(app);
    }
}
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
//引入objectql模块
const objectql = require('@steedos/objectql');
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const getPublicAssetUrls = function(assetUrls){
    const values = _.map(_.split(assetUrls), (item)=>{
        if(_.startsWith(item, '/')){
            return Meteor.absoluteUrl(item) ;
        }else{
            return item;
        }
    })
    return _.join(values, ',')
}

router.get('/api/amisFormDesign', auth.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        const { id: flowId } = req.query;
        let assetUrl = "";
        let assetUrls = null;
        if(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS && _.isString(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)){
            assetUrls = getPublicAssetUrls(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS).split(',');
            assetUrl = `assetUrl=${assetUrls.join("&assetUrl=")}&`;
        }else{
            var fullPath = path.resolve(path.dirname(require.resolve('@steedos-ui/builder-widgets' + '/package.json')));
            var packageFile = path.join(fullPath,'package.json');
            var pkg = require(packageFile);
            moduleVersion = pkg.version;
            assetUrls = [`https://unpkg.com/@steedos-ui/builder-widgets@${moduleVersion}/dist/assets.json`];
            assetUrl = `assetUrl=${assetUrls.join("&assetUrl=")}&`;
        }

        // const dataContext = {
        //     rootUrl: __meteor_runtime_config__.ROOT_URL,
        //     tenantId: userSession.spaceId,
        //     userId: userSession.userId,
        //     authToken: userSession.authToken
        // }


        // http://127.0.0.1:5000/app/admin/objects/undefined/flows/grid?related_field_name=object/

        const retUrl = __meteor_runtime_config__.ROOT_URL + `/app/admin/flows/view/${flowId}`
        const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
        const builderHost = `${steedosBuilderUrl}/amis?${assetUrl}&retUrl=${retUrl}`;

        // let data = fs.readFileSync(__dirname+'/design.html', 'utf8');
        // res.send(data.replace('SteedosBuilderHost',steedosBuilderHost).replace('DataContext', JSON.stringify(dataContext)));
        const flow = await objectql.getObject('flows').findOne(flowId, {fields: ['_id', 'form']})
        const formId = flow.form;

        const filename = __dirname+'/amis_form_design.ejs'
        const data = {
            builderHost,
            assetUrls,
            rootUrl: __meteor_runtime_config__.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            id: req.query.id,
            //加入formId字段
            formId: formId
        }

        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            // str => Rendered HTML string
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;
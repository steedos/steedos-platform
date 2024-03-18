const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
let schema = objectql.getSteedosSchema();
const validator = require('validator');

const disabledChangePackageWithSaas = async (req, res, next) => {
    if (validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true) != true) {
        next();
    }else {
        // 禁止操作packages
        res.status(500).send({ status: 'error', message: 'No permission' });
    }
}

router.get('/api/nodes/install', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = JSON.parse(decodeURIComponent(Buffer.from(req.query.data, "base64").toString('utf8')));
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, version, label, description, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.installPackage`, {
            module, version, label, description
        },{
            nodeID: nodeID
        })
        res.redirect(302, `/app/admin/steedos_packages/grid/all`);
        // res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/uninstall', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.uninstallPackage`, {
            module
        },{
            nodeID: nodeID
        })
        res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/reload', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.reloadPackage`, {
            module
        },{
            nodeID: nodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/disable', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.disablePackage`, {
            module
        },{
            nodeID: nodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/enable', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.enablePackage`, {
            module
        },{
            nodeID: nodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(200).send({
            "status": 1,
            "msg": error.message
          }
          );
        // res.status(500).send(error.message);
    }
});
router.get('/api/nodes/versions', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    // console.log(`req.query`, req.query)
    const body = req.query;
    const { module } = body || {};
    if(!module){
        return res.status(500).send({ message: 'Not find module' });
    }
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
       
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.getPackageVersions`, {
            module
        })
        res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/upgrade', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, version} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.upgradePackage`, {
            module, version
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/api/nodes/cloud/saas/packages/purchased', disabledChangePackageWithSaas, core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.getCloudSaasPurchasedPackages`, {
        }, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/cloud/saas/packages/purchased', disabledChangePackageWithSaas, core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    try {
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.installPurchasedPackages`, {}, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/cloud/saas/packages/url', disabledChangePackageWithSaas, core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    try {
        let broker = schema.broker;
        const { module, version, url, auth, registry_url } = req.body;
        const result = await broker.call(`@steedos/service-project.installPackageFromUrl`, {module, version, url, auth, registry_url, fromClient: true}, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})

router.get('/api/nodes/npmrc', disabledChangePackageWithSaas, core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        let broker = schema.broker;
        const result = await broker.call(`@steedos/service-project.getNpmrc`, {}, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send({data: {npmrc: result}});
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})

router.post('/api/nodes/npmrc', disabledChangePackageWithSaas, core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        let broker = schema.broker;
        const { npmrc } = req.body;
        const result = await broker.call(`@steedos/service-project.setNpmrc`, {npmrc}, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/package/add', disabledChangePackageWithSaas, core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        let broker = schema.broker;
        const { package: yarnPackage } = req.body;
        const result = await broker.call(`@steedos/service-project.yarnAddPackage`, {yarnPackage}, {
            meta: {
                user: userSession
            }
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("安装软件包异常, 请检查参数或网络");
    }
});

exports.default = router;
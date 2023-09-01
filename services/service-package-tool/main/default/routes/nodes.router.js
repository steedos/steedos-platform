const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
let schema = objectql.getSteedosSchema();
router.get('/api/nodes/install', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/uninstall', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/reload', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/disable', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/enable', core.requireAuthentication, async function (req, res) {
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
        res.status(500).send(error.message);
    }
});
router.get('/api/nodes/versions', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/upgrade', core.requireAuthentication, async function (req, res) {
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

router.get('/api/nodes/cloud/saas/packages/purchased', core.requireAuthentication, async function (req, res) {
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

router.post('/api/nodes/cloud/saas/packages/purchased', core.requireAuthentication, async function(req, res){
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

router.post('/api/nodes/cloud/saas/packages/url', core.requireAuthentication, async function(req, res){
    const userSession = req.user;
    try {
        let broker = schema.broker;
        const { module, version, url, auth, registry_url } = req.body;
        const result = await broker.call(`@steedos/service-project.installPackageFromUrl`, {module, version, url, auth, registry_url}, {
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

exports.default = router;
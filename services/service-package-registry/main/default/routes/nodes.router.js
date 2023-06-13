const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const registry = require('../manager/registry');
const loader = require('../manager/loader');
const objectql = require('@steedos/objectql');
let schema = objectql.getSteedosSchema();

const packageInstallationNodeID = process.env.STEEDOS_PACKAGE_INSTALLATION_NODEID || null;
console.log(`load nodes.router.js.....`, packageInstallationNodeID)
router.get('/api/nodes/install', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = JSON.parse(decodeURIComponent(Buffer.from(req.query.data, "base64").toString('utf8')));
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        const { module, version, label, description} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`~packages-project-server.installPackage`, {
            module, version, label, description
        },{
            nodeID: packageInstallationNodeID
        })
        res.redirect(302, `/app/admin/steedos_packages/grid/all`);
        // res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        await loader.removePackage(body.module);
        await registry.uninstallModule(body.module)
        const { module, nodeID} = body || {};
        let broker = schema.broker;
        const result = await broker.call(`~packages-project-server.uninstallPackage`, {
            module
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        const result = await broker.call(`~packages-project-server.reloadPackage`, {
            module
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        console.log(`disablePackage ${module}, node id is`, packageInstallationNodeID)
        const result = await broker.call(`~packages-project-server.disablePackage`, {
            module
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        const result = await broker.call(`~packages-project-server.enablePackage`, {
            module
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        const result = await broker.call(`~packages-project-server.getPackageVersions`, {
            module
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
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
        const result = await broker.call(`~packages-project-server.upgradePackage`, {
            module, version
        },{
            nodeID: packageInstallationNodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});

router.get('/api/nodes/cloud/saas/packages/purchased', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        let broker = schema.broker;
        const result = await broker.call(`~packages-project-server.getCloudSaasPurchasedPackages`, {
        }, {
            nodeID: packageInstallationNodeID,
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
        const result = await broker.call(`~packages-project-server.installPurchasedPackages`, {}, {
            nodeID: packageInstallationNodeID,
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
        const result = await broker.call(`~packages-project-server.installPackageFromUrl`, {module, version, url, auth, registry_url}, {
            nodeID: packageInstallationNodeID,
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
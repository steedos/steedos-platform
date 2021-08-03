const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const registry = require('../manager/registry');
const loader = require('../manager/loader');
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
        const result = await broker.call(`~packages-project-server.installPackage`, {
            module, version, label, description
        },{
            nodeID: nodeID
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
            nodeID: nodeID
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
            nodeID: nodeID
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
        const result = await broker.call(`~packages-project-server.disablePackage`, {
            module
        },{
            nodeID: nodeID
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
            nodeID: nodeID
        })
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});

exports.default = router;
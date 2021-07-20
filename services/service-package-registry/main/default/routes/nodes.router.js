const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const registry = require('../manager/registry');
const loader = require('../manager/loader');
router.post('/api/nodes/install', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    // const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        await registry.installModule(body.module, body.version)
        const packageInfo = await loader.loadPackage(body.module);
		loader.appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: false});
        res.status(200).send({}); //TODO 完善返回信息
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/api/nodes/uninstall', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    // const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    const isSpaceAdmin = userSession.is_space_admin;
    const body = req.body;
    if(!isSpaceAdmin){
        return res.status(401).send({ message: 'No permission' });
    }
    try {
        await loader.removePackage(body.module);
        await registry.uninstallModule(body.module)
        res.status(200).send({}); //TODO 完善返回信息
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

        const packages = loader.loadPackagesConfig();
        const package = _.find(packages, (_p, pname)=>{
            return pname === body.module;
        })

        if(package){
            if(package.enable){
                if(package.local){
                    await loader.loadPackage(body.module, package.path);
                }else{
                    await loader.loadPackage(body.module);
                }
            }else{
                return res.status(404).send({ message: 'package is disable: ' + body.module });
            }
            
        }else{
            return res.status(404).send({ message: 'not find package: ' + body.module });
        }
        
        res.status(200).send({});
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
        await loader.disablePackage(body.module);
        res.status(200).send({});
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
        await loader.enablePackage(body.module);
        res.status(200).send({});
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

exports.default = router;
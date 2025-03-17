const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const objectql = require('@steedos/objectql');
const jwt = require('jsonwebtoken');
const DocManager = require('./docManager');
const fileUtility = require('./fileUtility');
const plugins = [];
const cfgSignatureSecret = process.env.STEEDOS_ONLYOFFICE_JWT_SECRET
const cfgSignatureSecretExpiresIn = process.env.STEEDOS_ONLYOFFICE_JWT_EXPIRES_IN || '5m'

router.get('/api/office/editor/cms_file/:cmsId', auth.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');

        req.DocManager = new DocManager(req, res);

        const user = req.user;
        const userGroup = user.group;
        const reviewGroups = ['group-2', ''];
        const commentGroups = {
            view: '',
            edit: ['group-2', ''],
            remove: ['group-2'],
        };
        const userInfoGroups = ['group-2', ''];
        const userDirectUrl = req.query.directUrl === 'true';
        const { cmsId } = req.params;
        if(!cmsId){
            return res.status(404).send({ message: 'File not found' });
        }
        const cmsFile = await objectql.getObject('cms_files').findOne(cmsId);
        if(!cmsFile){
            return res.status(404).send({ message: 'File not found' });
        }
        const fileId = cmsFile.versions[0];
        const file = await objectql.getObject('cfs_files_filerecord').findOne(fileId)
        if (!file) {
            return res.status(404).send({ message: 'File not found' });
        }
        const fileChoiceUrl = '';
        const userId = user.userId;
        const fileName = file.original.name
        const key = file._id;
        const lang = req.DocManager.getLang();
        const mobileRegEx = "android|avantgo|playbook|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino";
        const fileExt = fileUtility.getFileExtension(fileName);
        let type = req.query.type || ''; // type: embedded/mobile/desktop
        if (type === '') {
            type = new RegExp(mobileRegEx, 'i').test(req.get('User-Agent')) ? 'mobile' : 'desktop';
        } else if (type !== 'mobile'
            && type !== 'embedded') {
            type = 'desktop';
        }

        let mode = req.query.mode || 'edit'; // mode: view/edit/review/comment/fillForms/embedded
        let canEdit = fileUtility.getEditExtensions().indexOf(fileExt.slice(1)) !== -1; // check if this file can be edited
        if (((!canEdit && mode === 'edit') || mode === 'fillForms')
            && fileUtility.getFillExtensions().indexOf(fileExt.slice(1)) !== -1) {
            mode = 'fillForms';
            canEdit = true;
        }
        if (!canEdit && mode === 'edit') {
            mode = 'view';
        }
        let submitForm = false;
        if (mode !== 'view') {
            submitForm = user.is_space_admin;
        }

        let actionData = 'null';
        if (req.query.action) {
            try {
                actionData = JSON.stringify(JSON.parse(req.query.action));
            } catch (ex) {
                console.log(ex);
            }
        }
        const name = user.name;
        const data = {
            apiUrl: process.env.STEEDOS_ONLYOFFICE_URL,
            file: {
                cmsId: cmsId,
                name: fileName,
                ext: fileUtility.getFileExtension(fileName, true),
                uri: process.env.ROOT_URL + `/api/v6/onlyoffice/cms_files/${cmsId}/download/` + fileId,
                directUrl: process.env.ROOT_URL + `/api/v6/onlyoffice/cms_files/${cmsId}/download/` + fileId,
                created: new Date().toDateString(),
                favorite: user.favorite != null ? user.favorite : 'null',
            },
            editor: {
                type,
                documentType: fileUtility.getFileType(fileName),
                key,
                token: '',
                callbackUrl: req.DocManager.getCallback(fileName, cmsId, userId),
                createUrl: null,
                templates: null,
                isEdit: canEdit && (mode === 'edit' || mode === 'view' || mode === 'filter' || mode === 'blockcontent'),
                review: canEdit && (mode === 'edit' || mode === 'review'),
                chat: userId !== 'uid-0',
                coEditing: mode === 'view' && userId === 'uid-0' ? { mode: 'strict', change: false } : null,
                comment: mode !== 'view' && mode !== 'fillForms' && mode !== 'embedded' && mode !== 'blockcontent',
                fillForms: mode !== 'view' && mode !== 'comment' && mode !== 'blockcontent',
                modifyFilter: mode !== 'filter',
                modifyContentControl: mode !== 'blockcontent',
                copy: !user.deniedPermissions?.includes('copy'),
                download: !user.deniedPermissions?.includes('download'),
                print: !user.deniedPermissions?.includes('print'),
                mode: mode !== 'view' ? 'edit' : 'view',
                canBackToFolder: type !== 'embedded',
                curUserHostAddress: req.DocManager.curUserHostAddress(),
                lang: lang,
                userid: userId !== 'uid-0' ? userId : null,
                userImage: user.avatar ? `${req.DocManager.getServerUrl()}/images/${user.id}.png` : null,
                name,
                userGroup,
                reviewGroups: JSON.stringify(reviewGroups),
                commentGroups: JSON.stringify(commentGroups),
                userInfoGroups: JSON.stringify(userInfoGroups),
                fileChoiceUrl,
                submitForm,
                plugins: JSON.stringify(plugins),
                actionData,
                fileKey: userId !== 'uid-0'
                    ? JSON.stringify({ fileName, userAddress: req.DocManager.curUserHostAddress() }) : null,
                instanceId: userId !== 'uid-0' ? req.DocManager.getInstanceId() : null,
                protect: !user.deniedPermissions?.includes('protect'),
                goback: user.goback != null ? user.goback : '',
                close: user.close || false,
            },
            dataInsertImage: {
                fileType: 'svg',
                url: `${req.DocManager.getServerUrl(true)}/images/logo.svg`,
                directUrl: !userDirectUrl ? null : `${req.DocManager.getServerUrl()}/images/logo.svg`,
            },
            dataDocument: {
                fileType: 'docx',
                url: `${req.DocManager.getServerUrl(true)}/assets/document-templates/sample/sample.docx`,
                directUrl: !userDirectUrl
                    ? null
                    : `${req.DocManager.getServerUrl()}/assets/document-templates/sample/sample.docx`,
            },
            dataSpreadsheet: {
                fileType: 'csv',
                url: `${req.DocManager.getServerUrl(true)}/csv`,
                directUrl: !userDirectUrl ? null : `${req.DocManager.getServerUrl()}/csv`,
            },
            usersForMentions: user,
            usersForProtect: [],
            usersInfo: [],
        }
        ejs.renderFile(__dirname + '/config.ejs', data, (err, html) => {
            console.log(err);
            data.editor.token = jwt.sign(
                JSON.parse(`{${html}}`),
                cfgSignatureSecret,
                { expiresIn: cfgSignatureSecretExpiresIn },
            );
            data.dataInsertImage.token = jwt.sign(
                data.dataInsertImage,
                cfgSignatureSecret,
                { expiresIn: cfgSignatureSecretExpiresIn },
            );
            data.dataDocument.token = jwt.sign(
                data.dataDocument,
                cfgSignatureSecret,
                { expiresIn: cfgSignatureSecretExpiresIn },
            );
            data.dataSpreadsheet.token = jwt.sign(
                data.dataSpreadsheet,
                cfgSignatureSecret,
                { expiresIn: cfgSignatureSecretExpiresIn },
            );
        })

        const options = {}
        ejs.renderFile(__dirname + '/officeEditor.ejs', data, options, function (err, str) {
            // str => Rendered HTML string
            if (err) {
                console.log(`err`, err)
            }
            res.send(str);
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message });
    }

});

exports.default = router;
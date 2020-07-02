express = Npm.require('express');
router = express.Router();
path = Npm.require('path')
fs = Npm.require('fs')

WebApp.connectHandlers.use '/view/encapsulation/xml', (req, res, next) ->

    # // 实现文件下载 
    fileName = req?.query?.filename

    xml_file_path = Meteor.settings?.records_xml?.xml_file_path

    if xml_file_path

        fileAddress = path.join xml_file_path, fileName

        stats = fs.statSync fileAddress

        if stats.isFile()
            res.setHeader("Content-type", "application/octet-stream")
            res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileName))
            fs.createReadStream(fileAddress).pipe(res);
        else
            res.end 404
    else
        res.end 404
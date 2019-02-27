Meteor.startup ()->
    # 将Creator.Objects 转为yaml文件存在本地
    fs = require('fs')
    path = require('path')
    mkdirp = require('mkdirp')
    yaml = require('js-yaml')
    if Creator.Objects
        ymlObjDirectory = path.resolve path.join(process.cwd(), "../../../../../.steedos/yaml")
        mkdirp.sync ymlObjDirectory
        _.each Creator.Objects, (obj) ->
            objFilePath = path.resolve path.join(ymlObjDirectory, obj.name + '.yml')
            dataStr = yaml.dump obj
            fs.writeFileSync objFilePath, dataStr
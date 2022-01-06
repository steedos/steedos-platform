const cpy = require('cpy');
const path = require('path');
const fs = require('fs');
const request = require("request");
const StreamZip = require('node-stream-zip');
const rimraf = require('rimraf');
console.log(`copy default template start: steedos-projects/project-template`);

const downloadFile = (url, filename, callback) => {
    var stream = fs.createWriteStream(filename);
    request(url).pipe(stream).on('close', callback);
}

const copyTemplateFile = (cwd, callback) => {
    cpy([
        '**',
        '.steedos/**',
        '!.steedos/node_modules/**',
        '!.steedos/.npmrc',
        '!.steedos/.yarnrc',
        '.vscode/**',
        '!**/node_modules/**',
        '!logs/**',
        '!.env.local',
        '!steedos-config-k8s.yml',
        '!storage/**',
        '.gitignore',
        '!init_home.sh',
        '.env',
    ], '../../packages/create-steedos-app/templates/default', {
        parents: true,
        flat: false,
        cwd: cwd,
        rename: (name) => {
            switch (name) {
                case '.env':
                    return 'env'
                case '.gitignore': {
                    return 'gitignore'
                }
                case 'package.json': {
                    return '_package.json'
                }
                default: {
                    return name
                }
            }
        }
    }).then(() => {
        console.log(`copy default template end: packages/create-steedos-app/templates/default`);
        callback();
    }).catch((result) => {
        console.log(`error`, result);
    })
}

/**
 * 1 下载最新的模板项目 https://docs.github.com/en/rest/reference/repos#download-a-repository-archive-zip
 * 2 解压模板项目
 * 3 将模板项目内容拷贝到templates/default文件夹下
 */
const url = `https://api.github.com/repos/steedos/steedos-project-template/zipball`;  // /repos/{owner}/{repo}/zipball/{ref} If you omit :ref, the repository’s default branch (usually master) will be used
const templateFileName = 'project-template.zip';
const templateFolder = '.temp';
if (!fs.existsSync(templateFolder)) {
    fs.mkdirSync(templateFolder);
}
downloadFile({
    url: url,
    method: "GET",
    json: true,
    headers: {
        "User-Agent": "steedos-project-template",
        "content-type": "application/json"
    }
}, path.join(templateFolder, templateFileName), () => {
    const zip = new StreamZip.async({ file: path.join(templateFolder, templateFileName) });
    zip.extract(null, templateFolder).then(() => {
        zip.close();
    }).then(() => {
        const files = fs.readdirSync(templateFolder);
        files.forEach((item) => {
            let fPath = path.join(templateFolder, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory()) {
                console.log(fPath);
                const cwd = path.join(process.cwd(), fPath);
                console.log(`cwd`, cwd);
                copyTemplateFile(cwd, () => {
                    rimraf(templateFolder, () => {

                    })
                });
            }
        })
    })
})
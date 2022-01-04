const cpy = require('cpy');
const path = require('path');
const fs = require('fs');

if (fs.existsSync(path.join(process.cwd(), 'steedos-projects', 'project-dev'))) {
    return;
}

cpy([
    '**',
    '.steedos/**',
    '!.steedos/node_modules/**',
    '.vscode/**',
    '!**/node_modules/**',
    '!logs/**',
    '.env.local',
    '!steedos-config-k8s.yml',
    '!storage/**',
    '.gitignore',
    '!init_home.sh',
    '.env',
], '../../steedos-projects/project-dev', {
    parents: true,
    flat: false,
    cwd: path.join(process.cwd(), 'steedos-projects', 'project-template'),
    rename: (name) => {
        switch (name) {
            // case '.env':
            //     return 'env'
            // case '.gitignore': {
            //     return 'gitignore'
            // }
            // case 'package.json': {
            //     return '_package.json'
            // }
            default: {
                return name
            }
        }
    }
}).then(() => {
    console.log(`Create a development project: steedos-projects/project-dev`);
}).catch((result) => {
    console.log(`error`, result);
})
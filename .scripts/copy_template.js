const cpy = require('cpy');
const path = require('path');
console.log(`copy default template start: steedos-projects/project-template`);
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
    cwd: path.join(process.cwd(), 'steedos-projects', 'project-template'),
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
}).catch((result) => {
    console.log(`error`, result);
})
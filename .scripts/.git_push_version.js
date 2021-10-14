const { execSync } = require('child_process');
let versionInfo = require('../lerna.json');
execSync(`git add . && git commit -m v${versionInfo.version} && git push`);

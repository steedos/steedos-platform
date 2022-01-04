// build 镜像并上传至docker hub
console.log("IMAGE*******************************************************************");
const { execSync } = require("child_process");
const VERSION = require("./steedos-projects/project-community/package.json").version;
const IMAGE_VERSION = `steedos/steedos-project-community:${VERSION}`;

let cwd = process.cwd();
console.log("*  VERSION: ", VERSION);
console.log("*  cwd: ", cwd);

console.log(`*  image: build start!`);
execSync(`docker rmi ${IMAGE_VERSION} --force`);
execSync(`docker build --no-cache=true -t ${IMAGE_VERSION} .`);
console.log(`*  image: build done!`);
console.log(`pushing image to hub...`);
execSync(`docker push ${IMAGE_VERSION}`);
console.log(`*  image: push done!`);

console.log("*******************************************************************IMAGE");
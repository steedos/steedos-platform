var ncl = require('./npm_login.js');
const path = require('path');
var fs = require('fs');
const _ = require('lodash');
const registry = require('./registry');
const userDir = registry.settings.userDir;
const configPath = path.join(userDir, '.npmrc');
const yarnrcConfigPath = path.join(userDir, '.yarnrc');
const timeout = 10 * 1000;
const NPM_TOKENS = {};
const npmLogin = async function (user, pass, email, registry, scope, quotes, configPath) {
    return await new Promise((resolve, reject) => {
        var finalArgs = ncl.processArguments(user, pass, email, registry, scope, quotes, configPath);
        var response;
        var contents;
        var newContents;

        ncl.login(finalArgs, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                response = data;
                NPM_TOKENS[registry] = response.token;
                ncl.readFile(finalArgs, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        contents = data;
                        newContents = ncl.generateFileContents(finalArgs, contents, response);
                        ncl.writeFile(finalArgs, newContents, function (err) {
                            if (err) {
                                // let users know that it didn't work (could be prettier)
                                reject(err);
                            }
                            resolve();
                        });
                    }
                });
            }
        });

        setTimeout(() => {
            reject({ message: `connect ECONNREFUSED ${registry}` })
        }, timeout)
    })
};

async function login(username, password, email, registry, scope) {
    return await npmLogin(username, password, email, registry, scope, true, configPath);
}

function setYarnrcScopes(scopes, registry) {
    const yarnLines = [];
    const npmLines = [];
    _.each(scopes, (scope) => {
        yarnLines.push(`"@${scope}:registry" "${registry}"`);
        npmLines.push(`@${scope}:registry=${registry}`);
    })
    fs.writeFileSync(yarnrcConfigPath, yarnLines.join('\n') + '\n');
    fs.writeFileSync(configPath, npmLines.join('\n') + '\n');
}

function getYarnrcScopes() {
    let data = "";
    if (fs.existsSync(yarnrcConfigPath)) {
        data = fs.readFileSync(yarnrcConfigPath, 'utf-8');
    } else if (fs.existsSync(configPath)) {
        data = fs.readFileSync(configPath, 'utf-8');
    }
    const scopes = {};
    if (data) {
        // console.log(`data`, data);
        try {
            const lines = data.split('\n');
            _.each(lines, (line) => {
                try {
                    let s = line.includes('=') ? line.split('=') : line.split(' ');
                    if (s.length == 2) {
                        scopes[s[0].replace(/\"/g, "")] = s[1].replace(/\"/g, "");
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    return scopes
}

function getNpmAuthInfo(registry) {
    const token = NPM_TOKENS[registry];
    if (token) {
        return { token: token, type: 'Bearer' }
    }
}

module.exports = {
    loginToRegistry: login,
    setYarnrcScopes,
    getYarnrcScopes,
    getNpmAuthInfo
}

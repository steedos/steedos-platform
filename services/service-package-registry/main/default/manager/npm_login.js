const fetch = require('npm-registry-fetch');
const fs = require('fs');
const path = require('path');

function removeSuffix(pattern, suffix) {
    if (pattern.endsWith(suffix)) {
        return pattern.slice(0, -suffix.length);
    }
    return pattern;
}

module.exports = {
    processArguments: function (npmUser, npmPass, npmEmail, npmRegistry, npmScope, quotes, configPath) {
        var registry = npmRegistry || 'https://registry.npmjs.org';
        registry = removeSuffix(registry, '/')
        var homePath = process.env.HOME ? process.env.HOME : process.env.USERPROFILE;
        var finalPath = configPath ? configPath : path.join(homePath, '.npmrc');
        var hasQuotes = quotes ? quotes : false;
        var args = {
            user: npmUser,
            pass: npmPass,
            email: npmEmail,
            registry: registry,
            scope: npmScope,
            quotes: hasQuotes,
            configPath: finalPath
        };

        return args;
    },

    /**
     * 使用 npm-registry-fetch 自行实现 adduser
     */
    login: async function (args, callback) {
        try {
            const url = `${args.registry}/-/user/org.couchdb.user:${args.user}`;
            const body = {
                name: args.user,
                password: args.pass,
                email: args.email
            };

            const res = await fetch(url, {
                method: 'PUT',
                body,
                headers: { 'content-type': 'application/json' },
                // 保证兼容私库需要 basic auth
                auth: {
                    username: args.user,
                    password: args.pass
                }
            });

            const data = await res.json();
            return callback(null, data);
        } catch (err) {
            return callback(err);
        }
    },

    readFile: function (args, callback) {
        fs.readFile(args.configPath, 'utf-8', function (err, contents) {
            if (err) contents = '';
            return callback(null, contents);
        });
    },

    generateFileContents: function (args, contents, response) {
        var lines = contents ? contents.split('\n') : [];

        const registryEndRegexPattern = /\:\//;

        if (args.scope !== undefined) {
            const scopeLine = `${args.scope}:registry=${args.registry}`;
            const index = lines.findIndex(l => l.startsWith(`${args.scope}:registry=`));
            if (index === -1) {
                lines.push(scopeLine);
            } else {
                lines[index] = scopeLine;
            }
        }

        const regPath = args.registry.slice(args.registry.search(registryEndRegexPattern, '') + 1);
        const tokenLinePattern = `${regPath}/:_authToken=`;

        const tokenLine = tokenLinePattern + (args.quotes ? '"' : '') +
            response.token + (args.quotes ? '"' : '');

        const tokenIndex = lines.findIndex(l => l.includes(tokenLinePattern));
        if (tokenIndex === -1) {
            lines.push(tokenLine);
        } else {
            lines[tokenIndex] = tokenLine;
        }

        // 清理空行
        return lines.filter(l => l.trim() !== '');
    },

    writeFile: function (args, lines, callback) {
        fs.writeFile(args.configPath, lines.join('\n') + '\n', callback);
    }
};

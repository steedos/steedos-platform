var objectql = require("@steedos/objectql")
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');
const Cookies = require('cookies');
const steedosAuth = require("@steedos/auth");

// const schemaConfig = require(process.cwd() + '/steedos.config.js')

let steedosSchema = objectql.getSteedosSchema();
steedosSchema.addDataSource('default', {
    driver: 'mongo',
    url: 'mongodb://127.0.0.1/qhd-beta',
    objectFiles: [__dirname + "/../standard-objects"]
})

let express = require('express');
let app = express();
router = express.Router();

router.use('/:dataSourceName/:spaceId', async function (req, res, next) {
    var authToken, user, cookies;
    cookies = new Cookies(req, res);
    authToken = req.headers['x-auth-token'] || cookies.get("X-Auth-Token");
    let spaceId = req.params.spaceId;
    user = null;
    if (authToken) {
        user = await steedosAuth.getSession(authToken, spaceId);
    }
    if (user) {
        // 因为没有spaceId,无法获取roles，暂不启用权限校验
        req.userSession = user;
        return next();
    } else {
        return res.status(401).send({
            errors: [
                {
                    'message': 'You must be logged in to do this.'
                }
            ]
        });
    }
})

app.use('/graphql', router);


app.listen(process.env.PORT || 5000)
console.log('app listenning porst 5000!');
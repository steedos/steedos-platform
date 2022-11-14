/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-11 11:18:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-11 17:17:02
 * @Description: 
 */

var express = require('express')
var app = express()
var router1 = express.Router()
app.listen(5301)

router1.use(`/api/health`, function (req, res, next) {
    console.log(`req`, req)
    res.send('Hello World'+11)
})
app.use(router1)

for (let index = 0; index < 10000; index++) {
    var app2 = express()
    var router = express.Router()
    router.use(`/api/health${index}/:obj`, function (req, res, next) {
        res.send(`Hello World${index}`+req.url)
    })
    app2.use(router)
    app.use(app2)
}

console.log(`start 5301`)
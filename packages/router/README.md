<!--
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:45:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-17 16:50:32
 * @Description: 
-->


## @steedos/router

### staticRouter
提供 express.Router() 单例

使用方式
```
const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();
router.get('/service/api/apps/menus', async function (req: any, res: any) {
    ...
    res.status(200).send({ok: 1});
});
exports.default = router;
```


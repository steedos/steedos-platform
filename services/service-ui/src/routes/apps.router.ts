/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-08 23:28:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 18:11:07
 * @Description: 
 */
import { requireAuthentication } from '@steedos/core';
import { getSteedosSchema } from '@steedos/objectql';
const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();

router.get('/service/api/apps/menus', requireAuthentication, async function (req: any, res: any) {
    const userSession = req.user;
    try {
        const result = await getSteedosSchema().broker.call('apps.getMenus', {}, {meta: {user: userSession}});
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
exports.default = router;
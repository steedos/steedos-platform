import { getSteedosSchema } from '@steedos/objectql'
const router = require('@steedos/router').staticRouter();

router.post('/initServer', async (req, res, next) => {
  try {
    const broker = getSteedosSchema().broker;
    const body: any = req.body;
    const result = await broker.call(`@steedos/service-cloud-init.initServer`, { spaceId: body.spaceId, apiKey: body.apiKey });
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

export default router

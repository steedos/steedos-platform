import { getSteedosSchema } from '@steedos/objectql'
const router = require('@steedos/router').staticRouter();

router.post('/initServer', async (req, res, next) => {
  try {
    return res.status(200).send({})
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

export default router

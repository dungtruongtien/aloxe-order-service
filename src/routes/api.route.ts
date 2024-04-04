import express from 'express'

import orderRouterHandler from './order.route'

const router = express.Router()

router.use('/orders', orderRouterHandler)

export default router

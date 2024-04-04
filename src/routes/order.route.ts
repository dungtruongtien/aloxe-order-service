/* eslint "@typescript-eslint/no-misused-promises": 0 */ // --> OFF
/* eslint @typescript-eslint/unbound-method: 0 */ // --> OFF
/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF

import express from 'express'
import OrderRestController from '../controller/order/order.controller.rest'
const router = express.Router()

const orderController = new OrderRestController()

router.put('/', orderController.updateOrder.bind(orderController))
router.post('/', orderController.createOrder.bind(orderController))

export default router

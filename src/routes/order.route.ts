/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF
import express, { type Router } from 'express'
import OrderRestController from '../controller/order/order.controller.rest'
import { restAuthenticate } from '../middlewares/auth.middleware'

export const createOrderRoute = (): Router => {
  const router = express.Router()

  const orderController = new OrderRestController()

  router.get('/', orderController.getListOrders.bind(orderController))
  router.get('/:id', orderController.getOrder.bind(orderController))
  router.put('/', orderController.updateOrder.bind(orderController))
  router.post('/', orderController.createOrder.bind(orderController))
  router.put('/order-action', restAuthenticate, orderController.orderDriverAction.bind(orderController))
  return router
}

/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF
import express, { type Router } from 'express'
import OrderRestController from '../controller/order/order.controller.rest'

export const createOrderRoute = (): Router => {
  const router = express.Router()

  const orderController = new OrderRestController()

  router.get('/', orderController.getListOrders.bind(orderController))
  router.put('/', orderController.updateOrder.bind(orderController))
  router.post('/', orderController.createOrder.bind(orderController))
  router.post('/driver-action', orderController.orderDriverAction.bind(orderController))
  return router
}

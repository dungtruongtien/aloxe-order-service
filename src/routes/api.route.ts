import express, { type Router } from 'express'
import { createOrderRoute } from './order.route'

export const createRootRoute = (): Router => {
  const router = express.Router()
  const orderRoute = createOrderRoute()

  router.use('/orders', orderRoute)

  return router
}

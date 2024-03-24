import OrderController from '../../../controller/order/order.controller'
import { type IContext } from '../../context'

const orderController = new OrderController()

export default {
  Query: {
    async orders (parent: any, args: any, context: IContext, info: any) {
      return await orderController.getListOrders(null)
    }
  }
}

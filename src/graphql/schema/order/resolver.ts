import OrderGraphController from '../../../controller/order/order.controller.graph'
import { type IContext } from '../../context'

const orderController = new OrderGraphController()

export default {
  Query: {
    async orders (parent: any, args: any, context: IContext, info: any) {
      return await orderController.getListOrders(null)
    }
  }
}

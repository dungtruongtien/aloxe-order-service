import { UserRepository } from '../repository/user.repository'
import { OrderRepository } from '../repository/order.repository'
import { type IOrderService } from '../services/interface'
import { OrderService } from '../services/order.service'
import { type IResponse, type IOrderController } from './interface'
import { type IGetListOrderFilter } from '../repository/interface'

export default class OrderController implements IOrderController {
  private readonly orderService: IOrderService
  private readonly orderRepository = new OrderRepository()
  private readonly userRepository = new UserRepository()
  constructor () {
    this.orderService = new OrderService(this.orderRepository, this.userRepository)
  }

  async getListOrders (filter: IGetListOrderFilter | null): Promise<IResponse> {
    const data = await this.orderService.getListOrders(filter)
    return {
      message: 'success',
      code: '',
      data
    }
  }
}

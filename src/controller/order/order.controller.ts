import { CustomerRepository } from '../../repository/customer/customer.repository'
import { DriverRepository } from '../../repository/driver/driver.repository'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'
import { OrderRepository } from '../../repository/order/order.repository'
import { StaffRepository } from '../../repository/staff/staff.repository'
import { UserRepository } from '../../repository/user/user.repository'
import { type IOrderService } from '../../services/interface'
import { OrderService } from '../../services/order.service'
import { type IResponse } from '../interface'
import { type IOrderController } from './interface'

export default class OrderController implements IOrderController {
  private readonly orderService: IOrderService
  private readonly orderRepository = new OrderRepository()
  private readonly userRepository = new UserRepository()
  private readonly customerRepository = new CustomerRepository()
  private readonly driverRepository = new DriverRepository()
  private readonly staffRepository = new StaffRepository()
  constructor () {
    this.orderService = new OrderService(this.orderRepository, this.userRepository, this.staffRepository, this.driverRepository, this.customerRepository)
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

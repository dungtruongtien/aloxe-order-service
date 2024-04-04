import { CustomerRepository } from '../../repository/customer/customer.repository'
import { DriverRepository } from '../../repository/driver/driver.repository'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'
import { OrderRepository } from '../../repository/order/order.repository'
import { StaffRepository } from '../../repository/staff/staff.repository'
import { UserRepository } from '../../repository/user/user.repository'
import { BookingService } from '../../services/booking/booking.service'
import { type IOrderService } from '../../services/order/order.interface'
import { OrderService } from '../../services/order/order.service'
import { type IResponse } from '../interface'
import { type IOrderGraphController } from './interface'

export default class OrderGraphController implements IOrderGraphController {
  private readonly orderService: IOrderService
  private readonly orderRepository = new OrderRepository()
  private readonly userRepository = new UserRepository()
  private readonly customerRepository = new CustomerRepository()
  private readonly driverRepository = new DriverRepository()
  private readonly staffRepository = new StaffRepository()
  private readonly bookingService = new BookingService()
  constructor () {
    this.orderService = new OrderService(this.orderRepository, this.userRepository, this.staffRepository, this.driverRepository, this.customerRepository, this.bookingService)
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

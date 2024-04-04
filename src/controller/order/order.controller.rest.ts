import { type NextFunction, type Request, type Response } from 'express'
import { CustomerRepository } from '../../repository/customer/customer.repository'
import { DriverRepository } from '../../repository/driver/driver.repository'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'
import { OrderRepository } from '../../repository/order/order.repository'
import { StaffRepository } from '../../repository/staff/staff.repository'
import { UserRepository } from '../../repository/user/user.repository'
import { type IUpdateOrderInput, type IOrderService, type ICreateOrderInput } from '../../services/order/order.interface'
import { OrderService } from '../../services/order/order.service'
import { type IOrderRestController } from './interface'
import { HttpStatusCode } from 'axios'
import { BookingService } from '../../services/booking/booking.service'

export default class OrderRestController implements IOrderRestController {
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

  async getListOrders (req: Request, res: Response, next: NextFunction): Promise<any> {
    const filter = req.query.filter
    const data = await this.orderService.getListOrders(filter as unknown as IGetListOrderFilter)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS',
      data
    })
  }

  async updateOrder (req: Request, res: Response, next: NextFunction): Promise<any> {
    const data = await this.orderService.updateOrder(req.body as IUpdateOrderInput)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS',
      data
    })
  }

  async createOrder (req: Request, res: Response, next: NextFunction): Promise<any> {
    const data = await this.orderService.createOrder(req.body as ICreateOrderInput)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS',
      data
    })
  }
}

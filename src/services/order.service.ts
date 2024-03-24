import { type ICustomerRepo } from '../repository/customer/customer.interface'
import { type IDriverRepo } from '../repository/driver/driver.interface'
import { type IGetListOrderFilter, type IOrderRepo } from '../repository/order/order.interface'
import { type IOrderEntity } from '../repository/order/order.schema'
import { type IStaffRepo } from '../repository/staff/staff.interface'
import { type IGetUsersFilter, type IUserRepo } from '../repository/user/user.interface'
import { type IOrderService } from './interface'
import { type Order } from '@prisma/client'

export class OrderService implements IOrderService {
  private readonly orderRepo: IOrderRepo
  private readonly userRepo: IUserRepo
  private readonly staffRepo: IStaffRepo
  private readonly driverRepo: IDriverRepo
  private readonly customerRepo: ICustomerRepo
  constructor (orderRepo: IOrderRepo, userRepo: IUserRepo, staffRepo: IStaffRepo, driverRepo: IDriverRepo, customerRepo: ICustomerRepo) {
    this.orderRepo = orderRepo
    this.userRepo = userRepo
    this.staffRepo = staffRepo
    this.driverRepo = driverRepo
    this.customerRepo = customerRepo
  }

  async getListOrders (filter: IGetListOrderFilter | null): Promise<IOrderEntity[]> {
    const rs: Order[] = []
    let customerId: number[] = []
    const limit = 1000
    const offset = 0
    if (filter?.search) {
      const userFilter: IGetUsersFilter = {
        phoneNumber: [filter.search]
      }
      const listUsers = await this.userRepo.getUsers(userFilter)
      if (!listUsers) {
        return rs
      }

      customerId = listUsers.map(user => user.customer ? user.customer.id : 0)
      filter.customerIds = customerId
    }
    const orders = await this.orderRepo.getListOrder(filter, limit, offset, {})
    if (!orders) {
      return rs
    }
    // Get staff, customer, driver info to fill in order data
    const staffIds = orders.map(order => order.supportStaffId)
    const staffs = await this.staffRepo.getStaffs({ staffIds })

    const customerIds = orders.map(order => order.customerId)
    const customers = await this.customerRepo.getCustomers({ customerIds })

    const driverIds = orders.map(order => order.driverId)
    const drivers = await this.driverRepo.getDrivers({ driverIds })

    const ordersRes: IOrderEntity[] = []
    orders.forEach((order) => {
      const orderRes: IOrderEntity = {
        ...order,
        staff: staffs[0] ?? {},
        driver: drivers[0] ?? {},
        customer: customers[0] ?? {}
      }
      ordersRes.push(orderRes)
    })
    return ordersRes
  }
}

import { type IOrderService } from './interface'
import { type IUserRepo, type IGetListOrderFilter, type IOrderRepo, type IGetUsersFilter } from '../repository/interface'
import { type Order } from '@prisma/client'

export class OrderService implements IOrderService {
  private readonly orderRepo: IOrderRepo
  private readonly userRepo: IUserRepo
  constructor (orderRepo: IOrderRepo, userRepo: IUserRepo) {
    this.orderRepo = orderRepo
    this.userRepo = userRepo
  }

  async getListOrders (filter: IGetListOrderFilter | null): Promise<Order[]> {
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
    const customerIds = orders.map(order => order.customerId)
    const driverIds = orders.map(order => order.driverId)
    return rs
  }
}

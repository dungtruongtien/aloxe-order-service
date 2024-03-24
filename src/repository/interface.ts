// import { type Prisma, type Order } from '@prisma/client'
// import { type User } from './schema/user'

import { CustomerRepository } from './customer/customer.repository'
import { DriverRepository } from './driver/driver.repository'
import { type IOrderRepo } from './order/order.interface'
import { OrderRepository } from './order/order.repository'
import { type IStaffRepo } from './staff/staff.interface'
import { StaffRepository } from './staff/staff.repository'
import { type IUserRepo } from './user/user.interface'
import { UserRepository } from './user/user.repository'

// enum OrderStatus {
//   DRIVER_CONFIRMED = 1,
//   CANCELLED = 2,
//   ARRIVED = 3,
//   PAID = 4,
//   ONBOARDING = 5,
//   BOOKED = 6,
// }

// enum Sort {
//   ASC = 'ASC',
//   DESC = 'DESC'
// }

// export interface IRepository {
//   order: IOrderRepo
// }

// export interface IGetListOrderFilter {
//   customerId: number
//   customerIds: number[]
//   staffId: number
//   driverId: number
//   status: OrderStatus
//   search: string
// }

// export interface IGetListOrderSort {
//   createAt: Sort
// }

// export interface IOrderRepo {
//   getListOrder: (filter: IGetListOrderFilter | null, limit: number, page: number, sort: Prisma.OrderOrderByWithRelationInput) => Promise<Order[]>
// }

// export interface IGetUsersFilter {
//   phoneNumber: string[]
// }

// export interface IUserRepo {
//   getUsers: (filter?: IGetUsersFilter) => Promise<User[]>
// }
// export interface IStaffRepo {
//   getStaffs: (filter?: IGetUsersFilter) => Promise<User[]>
// }

export interface IRepository {
  order: IOrderRepo
  user: IUserRepo
  staff: IStaffRepo
}

const repos = {
  CustomerRepository,
  DriverRepository,
  StaffRepository,
  OrderRepository,
  UserRepository
}

export default repos

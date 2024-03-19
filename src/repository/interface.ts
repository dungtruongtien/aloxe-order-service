import { type Prisma, type Order } from '@prisma/client'
import { type User } from './schema/user'

enum OrderStatus {
  DRIVER_CONFIRMED = 1,
  CANCELLED = 2,
  ARRIVED = 3,
  PAID = 4,
  ONBOARDING = 5,
  BOOKED = 6,
}

enum Sort {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface IRepository {
  order: IOrderRepo
}

export interface IGetListOrderFilter {
  customerId: number
  customerIds: number[]
  staffId: number
  driverId: number
  status: OrderStatus
  search: string
}

export interface IGetListOrderSort {
  createAt: Sort
}

export interface IOrderRepo {
  getListOrder: (filter: IGetListOrderFilter | null, limit: number, page: number, sort: Prisma.OrderOrderByWithRelationInput) => Promise<Order[]>
}

export interface IGetUsersFilter {
  phoneNumber: string[]
}

export interface IUserRepo {
  getUsers: (filter?: IGetUsersFilter) => Promise<User[]>
}

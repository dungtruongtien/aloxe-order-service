import { type Prisma, type Order } from '@prisma/client'
import { type User } from './user.schema'

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

export interface ICreateCustomerUserInput {
  fullName: string
  phoneNumber: string
  email: string
  address?: string
  dob?: Date
  customer: ICreateCustomerInput
}

export interface ICreateCustomerInput {
  level: string
  customerNo: string
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
  getUser: (userId: number) => Promise<User | null>
  getUsers: (filter?: IGetUsersFilter) => Promise<User[]>
  createCustomerUser: (input: ICreateCustomerUserInput) => Promise<User>
}

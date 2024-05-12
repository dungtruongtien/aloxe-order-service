import { type Prisma, type Order } from '@prisma/client'
import { type User } from './user.schema'

enum OrderStatus {
  BOOKED = 1,
  ONBOARDING = 2,
  ARRIVED = 3,
  CANCELLED = 4,
  PAID = 5,
  DRIVER_FOUND = 6,
  DRIVER_CONFIRMED = 7,
  DRIVER_COME = 8,
  DRIVER_NOT_FOUND = 9,
  WAITING_FOR_DRIVER = 10,
  USER_CANCELLED = 11,
  CONFIRMED = 12,
}

export const OrderStatusMapping: any = {
  1: 'BOOKED',
  2: 'ONBOARDING',
  3: 'ARRIVED',
  4: 'CANCELLED',
  5: 'PAID',
  6: 'DRIVER_FOUND',
  7: 'DRIVER_CONFIRMED',
  8: 'DRIVER_COME',
  9: 'DRIVER_NOT_FOUND',
  10: 'WAITING_FOR_DRIVER',
  11: 'USER_CANCELLED',
  12: 'CONFIRMED'
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
  phoneNumber?: string[]
  customerIds?: number[]
}

export interface IUserRepo {
  getUser: (userId: number) => Promise<User | null>
  getUsers: (filter?: IGetUsersFilter) => Promise<User[]>
  createCustomerUser: (input: ICreateCustomerUserInput) => Promise<User>
}

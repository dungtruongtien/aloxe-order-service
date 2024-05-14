import { type User } from './user.schema'

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

// export interface IRepository {
//   order: IOrderRepo
// }

export interface IGetListOrderSort {
  createAt: Sort
}

// export interface IOrderRepo {
//   getListOrder: (filter: IGetListOrderFilter | null, limit: number, page: number, sort: Prisma.OrderOrderByWithRelationInput) => Promise<Order[]>
// }

export interface IGetUsersFilter {
  phoneNumber?: string[]
  customerIds?: number[]
}

export interface IUserRepo {
  getUser: (userId: number) => Promise<User | null>
  getUsers: (filter?: IGetUsersFilter) => Promise<User[]>
  createCustomerUser: (input: ICreateCustomerUserInput) => Promise<User>
}

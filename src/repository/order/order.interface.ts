import { type Prisma, type Order } from '@prisma/client'

export enum OrderStatus {
  DRIVER_CONFIRMED = 1,
  CANCELLED = 2,
  ARRIVED = 3,
  PAID = 4,
  ONBOARDING = 5,
  BOOKED = 6,
  DRIVER_NOT_FOUND = 7,
  DRIVER_FOUND = 8,
  DRIVER_COME = 9
}

export interface IGetListOrderFilter {
  customerId: number
  customerIds: number[]
  staffId: number
  driverId: number
  status: OrderStatus
  search: string
}

export interface IOrderRepo {
  getListOrder: (filter: IGetListOrderFilter | null, limit: number, page: number, sort: Prisma.OrderOrderByWithRelationInput) => Promise<Order[]>
  getOrder: (id: number) => Promise<Order | null>
  createOrder: (input: Prisma.OrderCreateInput) => Promise<Order>
  updateOrder: (id: number, input: Prisma.OrderUpdateInput) => Promise<Order>
}

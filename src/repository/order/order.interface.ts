import { type Prisma, type Order } from '@prisma/client'

export enum OrderStatus {
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

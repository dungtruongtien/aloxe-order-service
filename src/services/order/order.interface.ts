import { type Order } from '@prisma/client'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'
import { type Staff } from '../../repository/staff/staff.schema'
import { type IOrderEntity } from '../../repository/order/order.schema'

export type VEHICLE_TYPE = 'FOUR_SEAT' | 'FIVE_SEAT' | 'SEVEN_SEAT' | 'VIP'
export const VEHICLE_TYPE_MAPPING: Record<VEHICLE_TYPE, number> = {
  FOUR_SEAT: 1,
  FIVE_SEAT: 2,
  SEVEN_SEAT: 3,
  VIP: 4
}
export interface ICreateOrderCustomerInput {
  phoneNumber: string
  userId: number
  fullName: string
  email: string
}

export interface ICreateOrderInput {
  customer: ICreateOrderCustomerInput
  staff: Staff
  code: string
  status: number
  startTime: string
  endTime: string
  totalPrice: number
  orderDetail: {
    vehicleType: VEHICLE_TYPE
    pickupLongitude: number
    pickupLatitude: number
    returnLongitude: number
    returnLatitude: number
    voucherCode: string
    pickupLocation: string
    returnLocation: string
  }
  customerId: number
}

export interface IUpdateOrderInput {
  id: number
  status: number
  driverId: number
  totalPrice: number
}

export interface IOrderService {
  getListOrders: (filter: IGetListOrderFilter | null) => Promise<IOrderEntity[]>
  getOrder: (id: number) => Promise<IOrderEntity | null>
  createOrder: (input: ICreateOrderInput) => Promise<any>
  updateOrder: (input: IUpdateOrderInput) => Promise<any>
  orderDriverAction: (orderId: number, actionType: string, assignedDriverId: number) => Promise<Order | null>
}

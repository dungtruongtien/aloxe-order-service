import { type Order } from '@prisma/client'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'
import { type Staff } from '../../repository/staff/staff.schema'

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
    vehicleType: string
    pickupLongitude: number
    pickupLatitude: number
    returnLongitude: number
    returnLatitude: number
    voucherCode: string
    pickupLocation: string
    returnLocation: string
  }
}

export interface IUpdateOrderInput {
  id: number
  status: number
  driverId: number
  totalPrice: number
}

export interface IOrderService {
  getListOrders: (filter: IGetListOrderFilter | null) => Promise<Order[]>
  createOrder: (input: ICreateOrderInput) => Promise<any>
  updateOrder: (input: IUpdateOrderInput) => Promise<any>
  orderDriverAction: (driverId: number, orderId: number, actionType: string, assignedDriverId: number) => Promise<Order | null>
}

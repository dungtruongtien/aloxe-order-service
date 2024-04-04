import { type ICustomerRepo } from '../../repository/customer/customer.interface'
import { type IDriverRepo } from '../../repository/driver/driver.interface'
import { type IGetListOrderFilter, type IOrderRepo } from '../../repository/order/order.interface'
import { type IOrderEntity } from '../../repository/order/order.schema'
import { type IStaffRepo } from '../../repository/staff/staff.interface'
import { type ICreateCustomerUserInput, type IGetUsersFilter, type IUserRepo } from '../../repository/user/user.interface'
import { type Prisma, type Order } from '@prisma/client'
import { type IUpdateOrderInput, type ICreateOrderInput, type IOrderService, type ICreateOrderCustomerInput } from './order.interface'
import { type User } from '../../repository/user/user.schema'
import { getDistanceFromLatLonInKm } from '../../utils/distance'
import { zonedTimeToUtc } from 'date-fns-tz'
import { type IBookingService } from '../booking/booking.interface'
import { type IProcessBookingOrderDTO } from './order.dto'

const VEHICLE_TYPE_MAPPING: any = {
  FOUR_SEAT: 1,
  FIVE_SEAT: 2,
  SEVEN_SEAT: 3,
  VIP: 4
}

export class OrderService implements IOrderService {
  private readonly orderRepo: IOrderRepo
  private readonly userRepo: IUserRepo
  private readonly staffRepo: IStaffRepo
  private readonly driverRepo: IDriverRepo
  private readonly customerRepo: ICustomerRepo
  private readonly bookingService: IBookingService
  constructor (orderRepo: IOrderRepo, userRepo: IUserRepo, staffRepo: IStaffRepo, driverRepo: IDriverRepo, customerRepo: ICustomerRepo, bookingService: IBookingService) {
    this.orderRepo = orderRepo
    this.userRepo = userRepo
    this.staffRepo = staffRepo
    this.driverRepo = driverRepo
    this.customerRepo = customerRepo
    this.bookingService = bookingService
  }

  getListOrders = async (filter: IGetListOrderFilter | null): Promise<IOrderEntity[]> => {
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
    const staffIds = orders.map(order => order.supportStaffId ?? 0).filter(staffId => staffId !== 0)
    const staffs = await this.staffRepo.getStaffs({ staffIds })

    const customerIds = orders.map(order => order.customerId)
    const customers = await this.customerRepo.getCustomers({ customerIds })

    const driverIds = orders.map(order => order.driverId ?? 0).filter(driverId => driverId !== 0)
    const drivers = await this.driverRepo.getDrivers({ driverIds })

    const ordersRes: IOrderEntity[] = []
    orders.forEach((order) => {
      const orderRes: IOrderEntity = {
        ...order,
        staff: staffs[0] ?? {},
        driver: drivers[0] ?? {},
        customer: customers[0] ?? {}
      }
      ordersRes.push(orderRes)
    })
    return ordersRes
  }

  createOrder = async (input: ICreateOrderInput): Promise<any> => {
    const { customer } = input
    let user = null

    // Validate exist user or not
    if (customer.phoneNumber) {
      const userInfo = await this.getUserInfo(input.customer)
      user = userInfo
    }

    const resp = { driver: null, price: 0, user, totalPrice: 0 }

    const { orderDetail } = input
    const pickPosition = {
      lat: orderDetail.pickupLatitude,
      long: orderDetail.pickupLongitude
    }
    const returnPosition = {
      lat: orderDetail.returnLatitude,
      long: orderDetail.returnLongitude
    }

    const distance = getDistanceFromLatLonInKm(pickPosition, returnPosition)
    const totalPrice = distance * 10000 // 10000 each km
    resp.totalPrice = totalPrice

    console.log('bookingInput-----', input)
    const orderCreateDto: Prisma.OrderCreateInput = {
      customerId: user?.customer?.id ?? 0,
      supportStaffId: input?.staff?.id || 0,
      code: `BOOK_${new Date().getTime()}`,
      status: 1,
      startTime: new Date(input.startTime).toISOString(),
      endTime: input.endTime,
      totalPrice,
      orderDetail: {
        create: {
          vehicleType: VEHICLE_TYPE_MAPPING[input.orderDetail.vehicleType],
          pickupLongitude: input.orderDetail.pickupLongitude,
          pickupLatitude: input.orderDetail.pickupLatitude,
          returnLongitude: input.orderDetail.returnLongitude,
          returnLatitude: input.orderDetail.returnLatitude,
          voucherCode: input.orderDetail.voucherCode,
          pickupLocation: input.orderDetail.pickupLocation,
          returnLocation: input.orderDetail.returnLocation,
          description: ''
        }
      }
    }
    const orderCreatedRes = await this.orderRepo.createOrder(orderCreateDto)
    // TODO  Push message to queue immediately
    const nowInVN = zonedTimeToUtc(new Date(), 'Asia/Ho_Chi_Minh')
    const startTimeInVN = zonedTimeToUtc(new Date(input.startTime), 'Asia/Ho_Chi_Minh')
    if (startTimeInVN.getTime() <= nowInVN.getTime()) {
      console.log('TODO here', orderCreatedRes)
      const processBookingOrderDTO: IProcessBookingOrderDTO = {
        id: orderCreatedRes.id,
        customerId: user?.customer?.id ?? 0,
        supportStaffId: input?.staff?.id || 0,
        code: `BOOK_${new Date().getTime()}`,
        status: 1,
        startTime: new Date(input.startTime).toISOString(),
        endTime: input.endTime,
        totalPrice,
        orderDetail: {
          vehicleType: VEHICLE_TYPE_MAPPING[input.orderDetail.vehicleType],
          pickupLongitude: input.orderDetail.pickupLongitude,
          pickupLatitude: input.orderDetail.pickupLatitude,
          returnLongitude: input.orderDetail.returnLongitude,
          returnLatitude: input.orderDetail.returnLatitude,
          voucherCode: input.orderDetail.voucherCode,
          pickupLocation: input.orderDetail.pickupLocation,
          returnLocation: input.orderDetail.returnLocation,
          description: ''
        }
      }
      await this.bookingService.processBookingOrder(processBookingOrderDTO)
    }

    return null
  }

  getUserInfo = async (customer: ICreateOrderCustomerInput): Promise<User> => {
    let user: User
    const userFilter: IGetUsersFilter = {
      phoneNumber: [customer.phoneNumber]
    }
    const users = await this.userRepo.getUsers(userFilter)
    console.log('users------', users)
    if (!users || users.length === 0) {
      const input: ICreateCustomerUserInput = {
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        customer: {
          level: 'NORMAL',
          customerNo: 'CUS_01'
        }
      }
      const userCreatedResp = await this.userRepo.createCustomerUser(input)
      if (!userCreatedResp) {
        throw new Error('Cannot create account')
      }
      return userCreatedResp
    } else {
      user = users[0]
    }
    return user
  }

  updateOrder = async (input: IUpdateOrderInput): Promise<Order> => {
    const orderUpdateDto: Prisma.OrderUpdateInput = {
      status: input.status,
      driverId: input.driverId,
      totalPrice: input.totalPrice
    }
    const data = await this.orderRepo.updateOrder(input.id, orderUpdateDto)
    console.log('data-----', data)
    return data
  }
}

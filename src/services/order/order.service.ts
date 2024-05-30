import { type ICustomerRepo } from '../../repository/customer/customer.interface'
import { type DriverOnlineSessionUpdateInput, type IDriverRepo } from '../../repository/driver/driver.interface'
import { OrderStatus, OrderStatusMapping, type IGetListOrderFilter, type IOrderRepo } from '../../repository/order/order.interface'
import { type IOrderEntity } from '../../repository/order/order.schema'
import { type IStaffRepo } from '../../repository/staff/staff.interface'
import {
  type ICreateCustomerUserInput,
  type IGetUsersFilter,
  type IUserRepo
} from '../../repository/user/user.interface'
import { type Prisma, type Order } from '@prisma/client'
import { type IUpdateOrderInput, type ICreateOrderInput, type IOrderService, type ICreateOrderCustomerInput, VEHICLE_TYPE_MAPPING } from './order.interface'
import { type User } from '../../repository/user/user.schema'
import { getDistanceFromLatLonInKm } from '../../utils/distance'
import { type IBookingService } from '../booking/booking.interface'
import { type IProcessBookingOrderDTO } from './order.dto'
import { type INotificationService } from '../notification/notification.interface'
import { PRICE_PER_KM } from '../../common/constant'
import { DriverOnlineSessionWorkingStatusEnum } from '../../repository/driver/driver.repository'
import { BadRequestError } from '../../common/custom_error'

export class OrderService implements IOrderService {
  private readonly orderRepo: IOrderRepo
  private readonly userRepo: IUserRepo
  private readonly staffRepo: IStaffRepo
  private readonly driverRepo: IDriverRepo
  private readonly customerRepo: ICustomerRepo
  private readonly bookingService: IBookingService
  private readonly notificationService: INotificationService
  constructor (orderRepo: IOrderRepo, userRepo: IUserRepo, staffRepo: IStaffRepo, driverRepo: IDriverRepo, customerRepo: ICustomerRepo, bookingService: IBookingService, notificationService: INotificationService) {
    this.orderRepo = orderRepo
    this.userRepo = userRepo
    this.staffRepo = staffRepo
    this.driverRepo = driverRepo
    this.customerRepo = customerRepo
    this.bookingService = bookingService
    this.notificationService = notificationService
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
    const orders = await this.orderRepo.getListOrder(filter, limit, offset, { createdAt: 'desc' })
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
      const staff = staffs.find(staff => staff.id === order.supportStaffId)
      const driver = drivers.find(driver => driver.id === order.driverId)
      const customer = customers.find(customer => customer.id === order.customerId)
      const status = OrderStatusMapping[order.status]
      const orderRes: IOrderEntity = {
        ...order,
        staff,
        driver,
        customer,
        status
      }
      ordersRes.push(orderRes)
    })
    return ordersRes
  }

  getOrder = async (id: number): Promise<IOrderEntity | null> => {
    const order = await this.orderRepo.getOrder(id)
    if (!order) {
      throw new BadRequestError('Order is not exist')
    }
    // Get staff, customer, driver info to fill in order data
    const orderRes: IOrderEntity = {
      ...order
    }
    if (order.supportStaffId) {
      const staffs = await this.staffRepo.getStaffs({ staffIds: [order.supportStaffId] })
      orderRes.staff = staffs[0] ?? {}
    }

    const customers = await this.customerRepo.getCustomers({ customerIds: [order.customerId] })
    orderRes.customer = customers[0] ?? {}

    if (order.driverId) {
      const drivers = await this.driverRepo.getDrivers({ driverIds: [order.driverId] })
      orderRes.driver = drivers[0] ?? {}
    }
    orderRes.status = OrderStatusMapping[order.status]
    return orderRes
  }

  createOrder = async (input: ICreateOrderInput): Promise<any> => {
    const { customer } = input
    if (customer && !customer.phoneNumber) {
      throw new BadRequestError('Customer phone number is required')
    }
    let user = null

    // Validate exist user or not
    if (customer?.phoneNumber || input?.customerId) {
      const userInfo = await this.getUserInfo(input.customer, input.customerId)
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
    const totalPrice = distance * PRICE_PER_KM
    resp.totalPrice = totalPrice

    const orderCreateDto: Prisma.OrderCreateInput = {
      customerId: user?.customer?.id ?? 0,
      supportStaffId: input?.staff?.id || 0,
      code: `BOOK_${new Date().getTime()}`,
      status: OrderStatus.WAITING_FOR_DRIVER,
      startTime: new Date(input.startTime),
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
    const processBookingOrderDTO: IProcessBookingOrderDTO = {
      id: orderCreatedRes.id,
      customerId: user?.customer?.id ?? 0,
      supportStaffId: input?.staff?.id || 0,
      code: `BOOK_${new Date().getTime()}`,
      status: 1,
      startTime: input.startTime,
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

    return await Promise.resolve({ ...orderCreatedRes, status: OrderStatusMapping[orderCreatedRes.status] })
  }

  getUserInfo = async (customer: ICreateOrderCustomerInput, customerId: number): Promise<User> => {
    let user: User
    let userFilter: IGetUsersFilter = {}
    if (customer?.phoneNumber) {
      userFilter = {
        phoneNumber: [customer.phoneNumber]
      }
    }
    if (customerId) {
      userFilter = {
        customerIds: [customerId]
      }
    }
    const users = await this.userRepo.getUsers(userFilter)
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
    return data
  }

  orderDriverAction = async (orderId: number, actionType: string, assignedDriverId: number): Promise<Order | null> => {
    const order = await this.orderRepo.getOrder(orderId)
    if (!order) {
      throw new Error('Order is not exist')
    }
    let bookingResp = null
    switch (actionType) {
      case 'CONFIRMED':
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.DRIVER_CONFIRMED })
        await this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_CONFIRMED' }) })
        return bookingResp
      case 'CANCELLED': {
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.CANCELLED })
        const input: DriverOnlineSessionUpdateInput = {
          driverId: assignedDriverId,
          workingStatus: DriverOnlineSessionWorkingStatusEnum.WAITING_FOR_CUSTOMER
        }
        await this.driverRepo.updateDriverOnlineSession(input)
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'CANCELLED', message: 'Driver is cancelled your booking, please retry to book a new car.' }) })
        return bookingResp
      }
      case 'USER_CANCELLED':
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.CANCELLED })
        if (assignedDriverId) {
          const input: DriverOnlineSessionUpdateInput = {
            driverId: assignedDriverId,
            workingStatus: DriverOnlineSessionWorkingStatusEnum.WAITING_FOR_CUSTOMER
          }
          await this.driverRepo.updateDriverOnlineSession(input)
          await this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'USER_CANCELLED', message: 'Customer cancelled your booking.' }) })
        }
        return bookingResp
      case 'ARRIVED':
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.ARRIVED })
        await this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ARRIVED' }) })
        return bookingResp
      case 'PAID': {
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.PAID })
        if (assignedDriverId) {
          const input: DriverOnlineSessionUpdateInput = {
            driverId: assignedDriverId,
            workingStatus: DriverOnlineSessionWorkingStatusEnum.WAITING_FOR_CUSTOMER
          }
          await this.driverRepo.updateDriverOnlineSession(input)
          this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'PAID' }) })
        }
        return bookingResp
      }
      case 'ONBOARDING':
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.ONBOARDING })
        await this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ONBOARDING' }) })
        return bookingResp
      case 'DRIVER_COME':
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.DRIVER_COME })
        await this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_COME' }) })
        return bookingResp
      default:
        break
    }
    return null
  }
}

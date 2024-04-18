import { type ICustomerRepo } from '../../repository/customer/customer.interface'
import { type DriverOnlineSessionUpdateInput, type IDriverRepo } from '../../repository/driver/driver.interface'
import { OrderStatus, type IGetListOrderFilter, type IOrderRepo } from '../../repository/order/order.interface'
import { type IOrderEntity } from '../../repository/order/order.schema'
import { type IStaffRepo } from '../../repository/staff/staff.interface'
import { type ICreateCustomerUserInput, type IGetUsersFilter, type IUserRepo } from '../../repository/user/user.interface'
import { type Prisma, type Order } from '@prisma/client'
import { type IUpdateOrderInput, type ICreateOrderInput, type IOrderService, type ICreateOrderCustomerInput } from './order.interface'
import { type User } from '../../repository/user/user.schema'
import { getDistanceFromLatLonInKm } from '../../utils/distance'
import { type IBookingService } from '../booking/booking.interface'
import { type IProcessBookingOrderDTO } from './order.dto'
import { type INotificationService } from '../notification/notification.interface'

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
    // TODO  Push message to queue immediately
    console.log('TODO here', orderCreatedRes)
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

  orderDriverAction = async (driverId: number, orderId: number, actionType: string, assignedDriverId: number): Promise<Order | null> => {
    let bookingResp = null
    switch (actionType) {
      case 'CONFIRMED':
        // bookingResp = await Booking.update(
        //   {
        //     status: 'DRIVER_CONFIRMED'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.DRIVER_CONFIRMED })
        // TODO call API to booking service to broadcast message
        // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'DRIVER_CONFIRMED' }))
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_CONFIRMED' }) })
        return bookingResp
      case 'CANCELLED': {
        // bookingResp = await Booking.update(
        //   {
        //     status: 'CANCELLED'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.CANCELLED })
        // await DriverLogginSession.update(
        //   {
        //     drivingStatus: 'WAITING_FOR_CUSTOMER'
        //   },
        //   {
        //     where: { driverId }
        //   }
        // )
        const input: DriverOnlineSessionUpdateInput = {
          id: driverId,
          workingStatus: 1
        }
        await this.driverRepo.updateDriverOnlineSession(input)
        // TODO call API to booking service to broadcast message
        // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'CANCELLED', message: 'Driver is cancelled your booking, please retry to book a new car.' }))
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'CANCELLED', message: 'Driver is cancelled your booking, please retry to book a new car.' }) })
        return bookingResp
      }
      case 'USER_CANCELLED':
        console.log('assignedDriverId---', assignedDriverId)
        // bookingResp = await Booking.update(
        //   {
        //     status: 'CANCELLED'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.CANCELLED })
        if (assignedDriverId) {
          // await DriverLogginSession.update(
          //   {
          //     drivingStatus: 'WAITING_FOR_CUSTOMER'
          //   },
          //   {
          //     where: { driverId: assignedDriverId }
          //   }
          // )
          const input: DriverOnlineSessionUpdateInput = {
            id: driverId,
            workingStatus: 1
          }
          await this.driverRepo.updateDriverOnlineSession(input)
          // TODO call API to booking service to broadcast message
          // broadcastPrivateMessage(assignedDriverId, JSON.stringify({ status: 'USER_CANCELLED', message: 'Customer cancelled your booking.' }))
          this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'USER_CANCELLED', message: 'Customer cancelled your booking.' }) })
        }
        return bookingResp
      case 'ARRIVED':
        // bookingResp = await Booking.update(
        //   {
        //     status: 'ARRIVED'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.ARRIVED })
        // TODO call API to booking service to broadcast message
        // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'ARRIVED' }))
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ARRIVED' }) })
        return bookingResp
      case 'PAID': {
        // bookingResp = await Booking.update(
        //   {
        //     status: 'PAID'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.PAID })
        if (driverId) {
        //   await DriverLogginSession.update(
        //     {
        //       drivingStatus: 'WAITING_FOR_CUSTOMER'
        //     },
        //     {
        //       where: { driverId }
        //     }
        //   )
        // }
          const input: DriverOnlineSessionUpdateInput = {
            id: driverId,
            workingStatus: 2
          }
          await this.driverRepo.updateDriverOnlineSession(input)
          // TODO call API to booking service to broadcast message
          // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'PAID' }))
          this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'PAID' }) })
        }
        return bookingResp
      }
      case 'ONBOARDING':
        // bookingResp = await Booking.update(
        //   {
        //     status: 'ONBOARDING'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.ONBOARDING })
        // TODO call API to booking service to broadcast message
        // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'ONBOARDING' }))
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ONBOARDING' }) })
        return bookingResp
      case 'DRIVER_COME':
        // bookingResp = await Booking.update(
        //   {
        //     status: 'DRIVER_COME'
        //   },
        //   {
        //     where: { id: bookingId }
        //   }
        // )
        bookingResp = await this.orderRepo.updateOrder(orderId, { status: OrderStatus.DRIVER_COME })
        // TODO call API to booking service to broadcast message
        // broadcastPrivateMessage(bookingId, JSON.stringify({ status: 'DRIVER_COME' }))
        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_COME' }) })
        return bookingResp
      default:
        break
    }
    return null
  }
}

import { type IGetListOrderFilter, type IOrderRepo } from './order.interface'
import prisma from '../../client/prisma'
import { type Prisma, type Order } from '@prisma/client'

export class OrderRepository implements IOrderRepo {
  async getListOrder (filter: IGetListOrderFilter | null, limit: number, page: number, sort: Prisma.OrderOrderByWithRelationInput): Promise<Order[]> {
    const where: Prisma.OrderWhereInput = {}
    if (filter?.customerIds && filter?.customerIds.length > 0) {
      where.customerId = {
        in: filter.customerIds
      }
    }
    if (filter?.staffId) {
      where.supportStaffId = {
        equals: filter.staffId
      }
    }
    if (filter?.driverId) {
      where.driverId = {
        equals: filter.driverId
      }
    }
    if (filter?.customerId) {
      where.customerId = {
        equals: filter.customerId
      }
    }
    if (filter?.status) {
      where.status = {
        equals: filter.status
      }
    }
    return await prisma.order.findMany({
      where,
      include: {
        orderDetail: true
      },
      take: limit,
      skip: page,
      orderBy: sort
    })
  }

  async getOrder (id: number): Promise<Order | null> {
    return await prisma.order.findUnique({ where: { id } })
  }

  async createOrder (input: Prisma.OrderCreateInput): Promise<Order> {
    return await prisma.order.create({ data: input })
  }

  async updateOrder (id: number, input: Prisma.OrderUpdateInput): Promise<Order> {
    return await prisma.order.update({ data: input, where: { id } })
  }
}

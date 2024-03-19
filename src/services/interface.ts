import { type Order } from '@prisma/client'
import { type IGetListOrderFilter } from '../repository/interface'

export interface IService {
  order: IOrderService
}

export interface IOrderService {
  getListOrders: (filter: IGetListOrderFilter | null) => Promise<Order[]>
}

import { type NextFunction, type Request, type Response } from 'express'
import { type IGetListOrderFilter } from '../../repository/order/order.interface'

export interface IOrderGraphController {
  getListOrders: (filter: IGetListOrderFilter | null) => Promise<any>
}

export interface IOrderRestController {
  getListOrders: (req: Request, res: Response, next: NextFunction) => Promise<any>
  createOrder: (req: Request, res: Response, next: NextFunction) => Promise<any>
  getOrder: (req: Request, res: Response, next: NextFunction) => Promise<any>
}

export interface IResponse {
  message: string
  code: string
  data: any
}

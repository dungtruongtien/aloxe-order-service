import { type IGetListOrderFilter } from '../repository/interface'

export interface IOrderController {
  getListOrders: (filter: IGetListOrderFilter | null) => Promise<IResponse>
}

export interface IResponse {
  message: string
  code: string
  data: any
}

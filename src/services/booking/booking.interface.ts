import { type IProcessBookingOrderDTO } from '../order/order.dto'

export interface IBookingService {
  processBookingOrder: (input: IProcessBookingOrderDTO) => Promise<any>
}

import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IProcessBookingOrderDTO } from '../order/order.dto'
import { type IBookingService } from './booking.interface'

export class BookingService implements IBookingService {
  async processBookingOrder (input: IProcessBookingOrderDTO): Promise<boolean> {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4005/api/booking/process-booking',
      headers: {
        authorization: INTERNAL_TOKEN
      },
      data: input
    }

    await axios.request(config)
    return true
  }
}

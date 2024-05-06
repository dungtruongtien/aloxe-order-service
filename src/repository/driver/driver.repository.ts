import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IGetDriversFilter, type IDriverRepo, type DriverOnlineSessionUpdateInput } from './driver.interface'
import { type DriverOnlineSession, type Driver } from './driver.schema'

export enum DriverOnlineSessionWorkingStatusEnum {
  WAITING_FOR_CUSTOMER = 1,
  DRIVING = 2
}

export class DriverRepository implements IDriverRepo {
  async getDrivers (filter?: IGetDriversFilter): Promise<Driver[]> {
    let queryFilter = ''
    if (filter?.driverIds && filter.driverIds.length > 0) {
      queryFilter = filter.driverIds.reduce((total, driverId, idx) => {
        total += `id=${driverId}${idx < filter.driverIds.length - 1 && '&'}`
        return total
      }, '')
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/drivers?${queryFilter}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as Driver[]
  }

  async updateDriverOnlineSession (input: DriverOnlineSessionUpdateInput): Promise<DriverOnlineSession> {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://localhost:4003/api/drivers/online-session',
      headers: {
        authorization: INTERNAL_TOKEN
      },
      data: input
    }

    const response = await axios.request(config)
    return response.data.data as DriverOnlineSession
  }
}

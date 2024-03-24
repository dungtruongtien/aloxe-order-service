import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IGetDriversFilter, type IDriverRepo } from './driver.interface'
import { type Driver } from './driver.schema'

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
}

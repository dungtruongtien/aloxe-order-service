import axios from 'axios'
import { type IGetStaffsFilter, type IStaffRepo } from './staff.interface'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type Staff } from './staff.schema'

export class StaffRepository implements IStaffRepo {
  async getStaffs (filter?: IGetStaffsFilter): Promise<Staff[]> {
    let queryFilter = ''
    if (filter?.staffIds && filter.staffIds.length > 0) {
      queryFilter = filter.staffIds.reduce((total, staffId, idx) => {
        total += `id=${staffId}${idx < filter.staffIds.length - 1 && '&'}`
        return total
      }, '')
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/staffs?${queryFilter}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as Staff[]
  }
}

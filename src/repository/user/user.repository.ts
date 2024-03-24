import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type User } from './user.schema'
import { type IGetUsersFilter, type IUserRepo } from './user.interface'

export class UserRepository implements IUserRepo {
  async getUsers (filter?: IGetUsersFilter): Promise<User[]> {
    let queryFilter = ''
    if (filter?.phoneNumber && filter.phoneNumber.length > 0) {
      queryFilter = filter.phoneNumber.reduce((total, phone, idx) => {
        total += `phoneNumber=${phone}${idx < filter.phoneNumber.length - 1 && '&'}`
        return total
      }, '')
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/users?${queryFilter}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as User[]
  }
}

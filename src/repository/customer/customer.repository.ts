import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type ICustomerRepo, type IGetCustomersFilter } from './customer.interface'
import { type Customer } from './customer.schema'

export class CustomerRepository implements ICustomerRepo {
  async getCustomers (filter?: IGetCustomersFilter): Promise<Customer[]> {
    let queryFilter = ''
    if (filter?.customerIds && filter.customerIds.length > 0) {
      queryFilter = filter.customerIds.reduce((total, customerId, idx) => {
        total += `id=${customerId}${idx < filter.customerIds.length - 1 && '&'}`
        return total
      }, '')
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/customers?${queryFilter}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as Customer[]
  }
}

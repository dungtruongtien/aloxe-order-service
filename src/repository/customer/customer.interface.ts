import { type Customer } from './customer.schema'

export interface IGetCustomersFilter {
  customerIds: number[]
}

export interface ICustomerRepo {
  getCustomers: (filter?: IGetCustomersFilter) => Promise<Customer[]>
}

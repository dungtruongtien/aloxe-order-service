import { type Order } from '@prisma/client'
import { type Staff } from '../staff/staff.schema'
import { type Customer } from '../customer/customer.schema'
import { type Driver } from '../user/user.schema'

export interface IOrderEntity extends Order {
  staff?: Staff
  customer?: Customer
  driver?: Driver
}

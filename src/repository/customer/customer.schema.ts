import { type User } from '../user/user.schema'

export interface Customer {
  id: number
  level: string
  customer_id: string
  user_id: number
  user: User
  created_at: Date
  updated_at: Date
}

import { type User } from '../user/user.schema'

export interface Driver {
  id: number
  booking_type: number
  driver_id: string
  user_id: number
  user: User
  license: License
  vehicle: Vehicle
  created_at: Date
  updated_at: Date
}

export interface License {
  id: number
  issued_date: Date
  expired_date: Date
  license_number: string
  driver_id: number
  driver: Driver
  created_at: Date
  updated_at: Date
}

export interface Vehicle {
  id: number
  model: string
  license_plate: string
  driver_id: number
  driver: Driver
  created_at: Date
  updated_at: Date
}

export interface DriverOnlineSession {
  currentLongitude: string
  currentLatitude: string
  onlineStatus: number
  workingStatus: number
  createdAt: string
  updatedAt: string
}

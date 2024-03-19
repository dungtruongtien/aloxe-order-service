export interface User {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  dob: Date
  role: number
  status: number
  createdAt: Date
  updatedAt: Date
  staff?: Staff
  driver?: Driver
  customer?: Customer
}

export interface Staff {
  id: number
  title: string
  staff_id: string
  user_id: number
  created_at: Date
  updated_at: Date
}

export interface Customer {
  id: number
  level: string
  customer_id: string
  user_id: number
  user: User
  created_at: Date
  updated_at: Date
}

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

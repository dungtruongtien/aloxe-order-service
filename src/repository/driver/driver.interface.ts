import { type DriverOnlineSession, type Driver } from './driver.schema'

export interface IGetDriversFilter {
  driverIds: number[]
}

export interface DriverOnlineSessionUpdateInput {
  driverId: number
  currentLongitude?: string
  currentLatitude?: string
  onlineStatus?: number
  workingStatus?: number
}

export interface IDriverRepo {
  getDrivers: (filter?: IGetDriversFilter) => Promise<Driver[]>
  updateDriverOnlineSession: (input: DriverOnlineSessionUpdateInput) => Promise<DriverOnlineSession>
}

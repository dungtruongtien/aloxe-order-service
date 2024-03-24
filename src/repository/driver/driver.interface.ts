import { type Driver } from './driver.schema'

export interface IGetDriversFilter {
  driverIds: number[]
}

export interface IDriverRepo {
  getDrivers: (filter?: IGetDriversFilter) => Promise<Driver[]>
}

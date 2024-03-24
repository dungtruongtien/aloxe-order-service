import { type Staff } from './staff.schema'

export interface IGetStaffsFilter {
  staffIds: number[]
}

export interface IStaffRepo {
  getStaffs: (filter?: IGetStaffsFilter) => Promise<Staff[]>
}

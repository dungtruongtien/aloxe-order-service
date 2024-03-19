import UserAccountController from '../../../controller/account.controller'
import { type IContext } from '../../context'

interface ILoginInput {
  username: string
  password: string
}

const userAccountController = new UserAccountController()

export default {
  Query: {
    async account (parent: any, args: any, context: IContext, info: any) {
      return { id: '1', username: '@ava' }
    },
    accounts () {
      return accounts
    }
  },
  Mutation: {
    async login (parent: any, args: ILoginInput, context: IContext, info: any) {
      return await userAccountController.login(args.username, args.password)
    }
  }
}

const accounts = [
  {
    id: 1,
    token: 'ABC'
  },
  {
    id: 2,
    token: 'CDF'
  }
]

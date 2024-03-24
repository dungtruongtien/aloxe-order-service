import { type PrismaClient } from '@prisma/client'
import prisma from '../../client/prisma'
import { type Request, type Response } from 'express'

interface ICtxUser {
  id: number
  user: {
    id: number
  }
}

interface ICtxInput {
  req: Request
  res: Response
}

export interface IContext {
  // Graphql Context
  prisma: PrismaClient
  account: ICtxUser
}

export default async function initCtx ({ req, res }: ICtxInput): Promise<IContext> {
  // TODO remove this any
  const context: IContext = {
    prisma,
    account: res.locals.account
  }
  return context
}

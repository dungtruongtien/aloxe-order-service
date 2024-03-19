import { type UserAccount, type PrismaClient } from '@prisma/client'
import prisma from '../../client/prisma'
import { type Request, type Response } from 'express'

interface ICtxInput {
  req: Request
  res: Response
}

export interface IContext {
  // Graphql Context
  prisma: PrismaClient
  user: UserAccount
}

export default async function initCtx ({ req, res }: ICtxInput): Promise<IContext> {
  // TODO remove this any
  const context: IContext = {
    prisma,
    user: res.locals.user
  }
  return context
}

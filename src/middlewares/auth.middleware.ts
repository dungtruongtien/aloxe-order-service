import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken'
import { type NextFunction, type Request, type Response } from 'express'
import { AUTH_ACCESS_SERCRET_KEY } from '../common/constant'

const WHITE_LIST_APIS = ['/api/user/v1/register', '/api/auth/v1/login', '/api/auth/v1/token/access', '/api/auth/v1/logout']
const WHITE_LIST_GRAPHQL_OPERATIONS = ['Login']
const GRAPHQL_PATH = '/graphql'

export const graphqlAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  const operationName: string = req.body.operationName
  if (!operationName) {
    throw new Error('Authentication failed')
  }
  if (WHITE_LIST_GRAPHQL_OPERATIONS.includes(operationName)) {
    next()
    return
  }

  const token: string = req.headers.authorization ?? ''
  console.log('req----', req)
  if (!token) {
    throw new Error('Authentication failed')
  }

  jwt.verify(token, AUTH_ACCESS_SERCRET_KEY, function (err: VerifyErrors, decoded: JwtPayload) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Error('TokenExpiredError')
      }

      throw new Error('TokenExpiredError')
    }

    res.locals.user = { ...decoded }
    next()
  })
}

export const restAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  if (WHITE_LIST_APIS.includes(req.originalUrl) || req.originalUrl === GRAPHQL_PATH) {
    next()
    return
  }

  const token: string = req.headers.authorization ?? ''
  if (!token) {
    throw new Error('Authentication failed')
  }

  jwt.verify(token, AUTH_ACCESS_SERCRET_KEY, function (err: VerifyErrors, decoded: JwtPayload) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Error('TokenExpiredError')
      }

      throw new Error('TokenExpiredError')
    }

    res.locals.user = { ...decoded }
    next()
  })
}

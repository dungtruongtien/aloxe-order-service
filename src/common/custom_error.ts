import { GraphQLError, type GraphQLErrorOptions } from 'graphql'

export class CustomError extends GraphQLError {
  public status: number = 0
  constructor (message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

export class ValidationError extends CustomError {
  constructor (message: string) {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
  }
}

export class BusinessError extends GraphQLError {
  constructor (message: string, options?: GraphQLErrorOptions) {
    super(message, options)
    this.message = message
  }
}

export class NotfoundError extends CustomError {
  constructor (message: string, name = 'NotfoundError') {
    super(message)
    this.name = name
    this.status = 404
  }
}

export class AuthenticationError extends CustomError {
  constructor (message: string, name = 'AuthenticationError') {
    super(message)
    this.name = name
    this.status = 401
  }
}

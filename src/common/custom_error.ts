export class CustomError extends Error {
  public status: number = 0
  public code: string = ''
  constructor (message: string) {
    super(message)
    this.name = 'CustomError'
    this.code = '000000'
  }
}

export class ValidationError extends CustomError {
  constructor (message: string, code = 'ValidationError') {
    super(message)
    this.code = 'ValidationError'
    this.status = 400
  }
}

export class NotfoundError extends CustomError {
  constructor (message: string, code = 'NotfoundError') {
    super(message)
    this.code = code
    this.status = 404
  }
}

export class AuthenticationError extends CustomError {
  constructor (message: string, code = 'AuthenticationError') {
    super(message)
    this.code = code
    this.status = 401
  }
}

export class BadRequestError extends CustomError {
  constructor (message: string, code = 'BadRequestError') {
    super(message)
    this.code = code
    this.status = 400
  }
}

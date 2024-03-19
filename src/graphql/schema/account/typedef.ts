import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    accounts: [Account]
  }
  extend type Mutation {
    login(username: String, password: String): AuthTokenRes
  }

  type Account @key(fields: "id") {
    id: ID!
    token: String
  }

  type AuthTokenRes {
    code: String
    message: String
    data: AuthToken
  }
  
  type AuthToken {
    accessToken: String
    fullName: String
    phoneNumber: String
  }
`

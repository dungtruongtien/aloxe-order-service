import express, { type NextFunction, type Request, type Response } from 'express'
import http from 'http'
import { type GraphQLFormattedError } from 'graphql'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import schema from './graphql/schema/schema'
import initCtx from './graphql/context'
import { createRootRoute } from './routes/api.route'

interface MyContext {
  token?: string
}

interface ICustomError {
  message: string
  status?: number
  code: string
}

// eslint-disable-next-line
async function start () {
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer<MyContext>({
    schema: buildSubgraphSchema(schema),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
      console.log('formattedError----', formattedError)
      return formattedError
    }
  })

  await server.start()

  // app.use(logger('dev'));
  // app.use(cookieParser());
  app.use(express.json())
  // app.use(bodyParser.graphql())
  app.use(express.urlencoded({ extended: true }))
  // app.use(graphqlAuthenticate)
  // app.use(restAuthenticate)

  app.use('/api', createRootRoute())

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: initCtx
    })
  )

  app.use((err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    console.log('err-----', err)
    // eslint-disable-next-line
    if (!err.status || (err.status >= 500 && err.status <= 599)) {
      err.status = 500
      err.code = 'INTERNAL_ERROR'
      err.message = 'Internal error'
    }
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      data: null
    })
  })

  httpServer.listen({ port: 4002 }, function () {
    console.log('🚀 Server ready at http://localhost:4002/')
  })
}

start().catch(() => {})

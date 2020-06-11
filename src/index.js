import { ApolloServer } from 'apollo-server'
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda'
import { PrismaClient } from '@prisma/client'
import depthLimit from 'graphql-depth-limit'
import { config } from 'dotenv'
import { isAuthenticated } from './utils/auth'
import schema from './schema'

config()
export const prisma = new PrismaClient()

const appolloServerConfig = {
  schema,
  debug: true, // process.env.NODE_ENV === 'development',
  playground: true,
  // introspection: true,
  uploads: {
    maxFiles: 1,
    maxFileSize: 10000000, // 10 MB
  },
  engine: {
    rewriteError: (error) => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  },
  validationRules: [depthLimit(5)],
  context: ({ req, event }) => {
    const auth = isAuthenticated(req || event)
    return {
      auth,
      db: prisma,
    }
  },
}

export const createLambdaServer = () => new ApolloServerLambda(appolloServerConfig)

export const createLocalServer = () =>
  new ApolloServer({
    ...appolloServerConfig,
    cors: {
      origin: '*',
    },
  })

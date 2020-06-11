import { ApolloServer } from 'apollo-server'

const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')
const { PrismaClient } = require('@prisma/client')
const depthLimit = require('graphql-depth-limit')
require('dotenv').config()

const schema = require('./schema')
const { isAuthenticated } = require('./utils/auth')

const prisma = new PrismaClient()

const appolloServerConfig = {
  schema,
  debug: true,
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
  validationRules: [ depthLimit(5) ],
  context: ({ req }) => {
    const auth = isAuthenticated(req)
    return {
      auth,
      db: prisma,
    }
  },
}

function createLambdaServer() {
  return new ApolloServerLambda(appolloServerConfig)
}

function createLocalServer() {
  return new ApolloServer({
    ...appolloServerConfig,
    cors: {
      origin: '*',
    },
  })
}

module.exports = { createLambdaServer, createLocalServer, prisma }

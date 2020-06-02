// const { ApolloServer } = require('apollo-server-express')
const { ApolloServer } = require('apollo-server')
const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')
const { PrismaClient } = require('@prisma/client')
// const serverless = require('serverless-http')
// const express = require('express')
// const path = require('path')
// const cors = require('cors')
require('dotenv').config()

const schema = require('./schema')
const { isAuthenticated } = require('./utils/auth')

// const app = express()
const prisma = new PrismaClient()

// app.use(cors())


// if (process.env.NODE_ENV !== 'production') {
//   server.applyMiddleware({ app, path: '/api' })
// }

// server.applyMiddleware({ app, path: '/.netlify/functions/api' })
// if (process.env.NODE_ENV === 'production') {
//   app.use('/', express.static(path.join(__dirname, 'client')))
//
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
//   })
// }

// function start() {
//
// }
//
// start()
const appolloServerConfig = {
  schema,
  // debug: false,
  engine: {
    rewriteError: (error) => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  },
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
  return new ApolloServer(appolloServerConfig)
}

module.exports = { createLambdaServer, createLocalServer, prisma }

// module.exports = app
// module.exports.handler = serverless(app)

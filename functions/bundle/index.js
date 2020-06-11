'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.createLocalServer = exports.createLambdaServer = exports.prisma = void 0

var _apolloServer = require('apollo-server')

var _apolloServerLambda = require('apollo-server-lambda')

var _client = require('@prisma/client')

var _graphqlDepthLimit = _interopRequireDefault(require('graphql-depth-limit'))

var _dotenv = require('dotenv')

var _auth = require('./utils/auth')

var _schema = _interopRequireDefault(require('./schema'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

(0, _dotenv.config)()
const prisma = new _client.PrismaClient()
exports.prisma = prisma
const appolloServerConfig = {
  schema: _schema.default,
  debug: true,
  playground: true,
  // introspection: true,
  uploads: {
    maxFiles: 1,
    maxFileSize: 10000000, // 10 MB

  },
  engine: {
    rewriteError: error => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  },
  validationRules: [ (0, _graphqlDepthLimit.default)(5) ],
  context: ({
              req,
            }) => {
    const auth = (0, _auth.isAuthenticated)(req)
    return {
      auth,
      db: prisma,
    }
  },
}

const createLambdaServer = () => new _apolloServerLambda.ApolloServer(appolloServerConfig)

exports.createLambdaServer = createLambdaServer

const createLocalServer = () => new _apolloServer.ApolloServer({
  ...appolloServerConfig,
  cors: {
    origin: '*',
  },
})

exports.createLocalServer = createLocalServer

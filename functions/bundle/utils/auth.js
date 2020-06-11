'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.checkIsAuth = exports.isAuthenticated = void 0

var _jsonwebtoken = _interopRequireDefault(require('jsonwebtoken'))

var _apolloServer = require('apollo-server')

var _messages = require('../constants/messages')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const isAuthenticated = request => {
  if (request) {
    const Authorization = request.headers.authorization

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')

      try {
        const user = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET)

        return {
          isOk: true,
          user,
        }
      } catch (e) {
        throw new _apolloServer.AuthenticationError(e.message)
      }
    }
  }

  return {
    isOk: false,
  }
}

exports.isAuthenticated = isAuthenticated

const checkIsAuth = auth => {
  if (!auth.isOk) {
    throw new _apolloServer.AuthenticationError(_messages.NOT_AUTHENTICATED)
  }
}

exports.checkIsAuth = checkIsAuth

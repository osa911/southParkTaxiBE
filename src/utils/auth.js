const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-express')
const { NOT_AUTHENTICATED } = require('../constants/messages')

function isAuthenticated(request) {
  console.log('isAuthenticated request> ', request)
  if (request) {
    const Authorization = request.headers.authorization
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        return { isOk: true, user }
      } catch (e) {
        throw new AuthenticationError(e.message)
      }
    }
  }

  return { isOk: false }
}

const checkIsAuth = (auth) => {
  if (!auth.isOk) {
    throw new AuthenticationError(NOT_AUTHENTICATED)
  }
}

module.exports = {
  isAuthenticated,
  checkIsAuth,
}

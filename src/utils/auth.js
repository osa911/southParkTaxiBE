import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'
import { NOT_AUTHENTICATED } from '../constants/messages'

export const isAuthenticated = (request) => {
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

export const checkIsAuth = (auth) => {
  console.log('auth> ', auth)
  if (!auth.isOk) {
    throw new AuthenticationError(NOT_AUTHENTICATED)
  }
}

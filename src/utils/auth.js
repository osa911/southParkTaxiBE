import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'
import { NOT_AUTHENTICATED } from '../constants/messages'

export const isAuthenticated = (request) => {
  console.log('request> ', request)
  if (request) {
    const Authorization = request.headers.authorization
    console.log('Authorization> ', Authorization)
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      console.log('token> ', token)
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

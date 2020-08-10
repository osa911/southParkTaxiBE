import { GraphQLError } from 'graphql'

export class ValidationError extends GraphQLError {
  constructor(errors) {
    super(errors)
    if (Array.isArray(errors)) {
      this.state = errors.reduce((result, error) => {
        if (Object.prototype.hasOwnProperty.call(result, error.key)) {
          result[error.key].push(error.message)
        } else {
          result[error.key] = [error.message]
        }
        return result
      }, {})
    } else if (typeof errors === 'string') {
      this.state = {
        message: errors,
      }
    }
  }
}

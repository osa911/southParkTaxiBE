'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.ValidationError = void 0

var _graphql = require('graphql')

class ValidationError extends _graphql.GraphQLError {
  constructor(errors) {
    super('The request is invalid.')
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message)
      } else {
        result[error.key] = [ error.message ]
      }

      return result
    }, {})
  }

}

exports.ValidationError = ValidationError

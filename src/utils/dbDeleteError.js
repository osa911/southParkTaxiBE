import { GraphQLError } from 'graphql'

export const dbDeleteError = (e) => {
  const recordNotFound = /Record to delete does not exist./gi
  if (recordNotFound.test(e.message)) {
    return new GraphQLError('Запись была удаленна ранее.')
  }
  return new GraphQLError('Ошибка удаления')
}

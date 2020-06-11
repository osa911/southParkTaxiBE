import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { Mutation as fileMutation } from './File'
import { Mutation as userMutation, Query as userQuery } from './User'
import { Mutation as carMutation, Query as carQuery } from './Car'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    ...fileMutation,
    ...carMutation,
  },
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...carQuery,
  },
})

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

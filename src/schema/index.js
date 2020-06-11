import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { Mutation as fileMutation } from './File'
import { Mutation as userMutation, Query as userQuery } from './User'
import { Mutation as carMutation, Query as carQuery } from './Car'
import { Mutation as reportMutation, Query as reportQuery } from './Report'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    ...fileMutation,
    ...carMutation,
    ...reportMutation,
  },
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...carQuery,
    ...reportQuery,
  },
})

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

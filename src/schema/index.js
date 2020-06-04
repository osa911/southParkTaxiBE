const graphql = require('graphql')
const userSchema = require('./User')
const fileSchema = require('./File')

const { GraphQLSchema, GraphQLObjectType } = graphql
const { userQuery, userMutation } = userSchema
const { fileMutation } = fileSchema

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    ...fileMutation,
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

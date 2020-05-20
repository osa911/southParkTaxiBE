const graphql = require('graphql')
const userSchema = require('./User')

const { GraphQLSchema, GraphQLObjectType } = graphql
const { userQuery, userMutation } = userSchema

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: userQuery
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

const graphql = require('graphql')
const userSchema = require('./User')
const carSchema = require('./Car')
const fileSchema = require('./File')

const { GraphQLSchema, GraphQLObjectType } = graphql

const { Query: userQuery, Mutation: userMutation } = userSchema
const { Mutation: fileMutation } = fileSchema
const { Mutation: carMutation, Query: carQuery } = carSchema

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
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

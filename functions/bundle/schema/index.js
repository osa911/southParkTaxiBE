'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _graphql = require('graphql')

var _File = require('./File')

var _User = require('./User')

var _Car = require('./Car')

const Mutation = new _graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ..._User.Mutation,
    ..._File.Mutation,
    ..._Car.Mutation,
  },
})
const Query = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    ..._User.Query,
    ..._Car.Query,
  },
})

var _default = new _graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

exports.default = _default

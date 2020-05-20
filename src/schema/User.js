const graphql = require('graphql')
const User = require('../models/User')

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLBoolean } = graphql

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
})

const userQuery = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve (parent, { id }) {
    return User.findById(id)
  },
}

const addUser = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve (parent, { name, password, email }) {
    const user = new User({
      name,
      password,
      email,
    })
    return user.save()
  },
}

const updateMovie = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve (parent, { id, name, password, email }) {
    return UserType.findByIdAndUpdate(
      id,
      { $set: { name, password, email } },
      { new: true },
    )
  },
}

const deleteUser = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve (parent, { id }) {
    return User.findByIdAndRemove(id)
  }
}

const userMutation = {
  addUser,
  updateMovie,
  deleteUser,
}

module.exports = {
  userQuery,
  userMutation
}

const graphql = require('graphql')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { ApolloError } = require('apollo-server-express')

const { checkIsAuth } = require('../utils/auth')
const messages = require('../constants/messages')

const { WRONG_AUTH_CREDENTIAL } = messages
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLEnumType, GraphQLError } = graphql

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: 'role',
        values: {
          ADMIN: { value: 'ADMIN' },
          INVESTOR: { value: 'INVESTOR' },
        },
      }),
    },
  }),
})

const getUserById = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db }) {
    return db.user.findOne({ where: { id } })
  },
}

const getUsersList = {
  type: new GraphQLList(UserType),
  resolve(parent, args, { db, auth }) {
    checkIsAuth(auth)
    return db.user.findMany()
  },
}

class ValidationError extends GraphQLError {
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

const createUser = {
  type: GraphQLString,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, { name, password, email }, { db, auth }) {
    // checkIsAuth(auth)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    })

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )
  },
}

const updateUser = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, { id, name, password, email }, { db, auth }) {
    checkIsAuth(auth)
    return db.user.update({
      where: { id },
      data: {
        name, password, email,
      },
    })
  },
}

const deleteUser = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.user.delete({ where: { id } })
  },
}

const loginUser = {
  type: GraphQLString,
  args: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, { email, password }, { db }) {
    const user = await db.user.findOne({ where: { email } })
    if (!user) {
      console.log('WRONG_AUTH_CREDENTIAL> ', WRONG_AUTH_CREDENTIAL)
      return new ValidationError(WRONG_AUTH_CREDENTIAL)
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return new ApolloError(WRONG_AUTH_CREDENTIAL)
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )
  },
}

const userQuery = {
  getUserById,
  getUsersList,
}

const userMutation = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
}

module.exports = {
  userQuery,
  userMutation,
}

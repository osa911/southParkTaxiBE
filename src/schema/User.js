import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import bCrypt from 'bcrypt'
import JsonWebToken from 'jsonwebtoken'
import { ApolloError } from 'apollo-server'
import { WRONG_AUTH_CREDENTIAL } from '../constants/messages'
import { checkIsAuth } from '../utils/auth'
import { ValidationError } from '../utils/validationError'
import { RoleEnumType, UserType } from './Types'

const getUserById = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db }) {
    return db.user.findOne({ where: { id } })
  },
}

const me = {
  type: UserType,
  resolve(parent, _, { auth }) {
    checkIsAuth(auth)
    return auth.user
  },
}

const getUsersList = {
  type: GraphQLList(UserType),
  resolve(parent, args, { db, auth }) {
    checkIsAuth(auth)
    return db.user.findMany()
  },
}

const createUser = {
  type: UserType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    role: { type: RoleEnumType },
  },
  async resolve(parent, { name, password, email, role, phone }, { db, auth }) {
    // checkIsAuth(auth)
    return await db.user.create({
      data: {
        name,
        email,
        role,
        phone,
        password: await bCrypt.hash(password, 10),
      },
    })
  },
}

const updateUser = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(RoleEnumType) },
  },
  async resolve(parent, { id, name, password, email, role, phone }, { db, auth }) {
    checkIsAuth(auth)
    return await db.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        phone,
        password: await bCrypt.hash(password, 10),
      },
    })
  },
}

// TODO: add cascading cars deleting
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
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, { email, password }, { db }) {
    const user = await db.user.findOne({ where: { email } })
    if (!user) {
      return new ValidationError(WRONG_AUTH_CREDENTIAL)
    }

    const valid = await bCrypt.compare(password, user.password)

    if (!valid) {
      return new ApolloError(WRONG_AUTH_CREDENTIAL)
    }

    const { id, name, role } = user
    return JsonWebToken.sign({ id, email: user.email, name, role }, process.env.JWT_SECRET, {
      expiresIn: '100y',
    })
  },
}

export const Query = {
  getUserById,
  me,
  getUsersList,
}

export const Mutation = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
}

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.Mutation = exports.Query = void 0

var _graphql = require('graphql')

var _bcrypt = _interopRequireDefault(require('bcrypt'))

var _jsonwebtoken = _interopRequireDefault(require('jsonwebtoken'))

var _apolloServer = require('apollo-server')

var _messages = require('../constants/messages')

var _auth = require('../utils/auth')

var _validationError = require('../utils/validationError')

var _Types = require('./Types')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const getUserById = {
  type: _Types.UserType,
  args: {
    id: {
      type: _graphql.GraphQLID,
    },
  },

  resolve(parent, {
    id,
  }, {
            db,
          }) {
    return db.user.findOne({
      where: {
        id,
      },
    })
  },

}
const me = {
  type: _Types.UserType,

  resolve(parent, _, {
    auth,
  }) {
    (0, _auth.checkIsAuth)(auth)
    return auth.user
  },

}
const getUsersList = {
  type: (0, _graphql.GraphQLList)(_Types.UserType),

  resolve(parent, args, {
    db,
    auth,
  }) {
    (0, _auth.checkIsAuth)(auth)
    return db.user.findMany()
  },

}
const createUser = {
  type: _Types.UserType,
  args: {
    name: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    password: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    email: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    phone: {
      type: _graphql.GraphQLString,
    },
    role: {
      type: _Types.RoleEnumType,
    },
  },

  async resolve(parent, {
    name,
    password,
    email,
    role,
    phone,
  }, {
                  db,
                  auth,
                }) {
    (0, _auth.checkIsAuth)(auth)
    return await db.user.create({
      data: {
        name,
        email,
        role,
        phone,
        password: await _bcrypt.default.hash(password, 10),
      },
    })
  },

}
const updateUser = {
  type: _Types.UserType,
  args: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID),
    },
    name: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    password: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    email: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    phone: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    role: {
      type: (0, _graphql.GraphQLNonNull)(_Types.RoleEnumType),
    },
  },

  async resolve(parent, {
    id,
    name,
    password,
    email,
    role,
    phone,
  }, {
                  db,
                  auth,
                }) {
    (0, _auth.checkIsAuth)(auth)
    return await db.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role,
        phone,
        password: await _bcrypt.default.hash(password, 10),
      },
    })
  },

} // TODO: add cascading cars deleting

const deleteUser = {
  type: _Types.UserType,
  args: {
    id: {
      type: _graphql.GraphQLID,
    },
  },

  resolve(parent, {
    id,
  }, {
            db,
            auth,
          }) {
    (0, _auth.checkIsAuth)(auth)
    return db.user.delete({
      where: {
        id,
      },
    })
  },

}
const loginUser = {
  type: _graphql.GraphQLString,
  args: {
    password: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
    email: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
    },
  },

  async resolve(parent, {
    email,
    password,
  }, {
                  db,
                }) {
    const user = await db.user.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return new _validationError.ValidationError(_messages.WRONG_AUTH_CREDENTIAL)
    }

    const valid = await _bcrypt.default.compare(password, user.password)

    if (!valid) {
      return new _apolloServer.ApolloError(_messages.WRONG_AUTH_CREDENTIAL)
    }

    const {
      id,
      name,
      role,
    } = user
    return _jsonwebtoken.default.sign({
      id,
      email: user.email,
      name,
      role,
    }, process.env.JWT_SECRET, {
      expiresIn: '100y',
    })
  },

}
const Query = {
  getUserById,
  me,
  getUsersList,
}
exports.Query = Query
const Mutation = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
}
exports.Mutation = Mutation

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.SheetType = exports.CarType = exports.UserType = exports.RoleEnumType = void 0

var _graphql = require('graphql')

const RoleEnumType = new _graphql.GraphQLEnumType({
  name: 'role',
  values: {
    ADMIN: {
      value: 'ADMIN',
    },
    INVESTOR: {
      value: 'INVESTOR',
    },
  },
})
exports.RoleEnumType = RoleEnumType
const UserType = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: _graphql.GraphQLID,
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
      type: _graphql.GraphQLString,
    },
    cars: {
      type: (0, _graphql.GraphQLList)(CarType),
      description: 'User\'s cars.',

      resolve({
                id,
              }, args, {
                db,
              }) {
        return db.car.findMany({
          where: {
            ownerId: id,
          },
        })
      },

    },
    role: {
      type: RoleEnumType,
    },
  }),
})
exports.UserType = UserType
const CarType = new _graphql.GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'Car id',
    },
    createdAt: {
      type: _graphql.GraphQLString,
      description: 'Date when Car have been added.',
    },
    title: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'Title of Car.',
    },
    govNumber: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'Government number of Car.',
    },
    ownerId: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'User ID - owner of this car.',
    },
    user: {
      type: UserType,

      resolve({
                ownerId,
              }, args, {
                db,
              }) {
        return db.user.findOne({
          where: {
            id: ownerId,
          },
        })
      },

    },
    price: {
      type: _graphql.GraphQLFloat,
      description: 'Price of Car.',
    },
    mileage: {
      type: _graphql.GraphQLFloat,
      description: 'Mileage of Car.',
    },
  }),
})
exports.CarType = CarType
const ReportRowType = new _graphql.GraphQLObjectType({
  name: 'ReportRow',
  fields: {
    address: {
      type: _graphql.GraphQLString,
      description: 'Cell address',
    },
    value: {
      type: _graphql.GraphQLString,
      description: 'Cell value.',
    },
  },
})
const SheetType = new _graphql.GraphQLObjectType({
  name: 'SheetType',
  fields: {
    name: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'Sheets name',
    },
    rows: {
      type: (0, _graphql.GraphQLList)((0, _graphql.GraphQLList)(ReportRowType)),
      description: 'Rows list.',
    },
  },
})
exports.SheetType = SheetType

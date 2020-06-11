'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.Mutation = exports.Query = void 0

var _graphql = require('graphql')

var _Types = require('./Types')

var _auth = require('../utils/auth')

const getCarById = {
  type: _Types.CarType,
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
    return db.car.findOne({
      where: {
        id,
      },
    })
  },

}
const getCarsList = {
  type: (0, _graphql.GraphQLList)(_Types.CarType),

  resolve(parent, args, {
    db,
    auth,
  }) {
    (0, _auth.checkIsAuth)(auth)
    return db.car.findMany()
  },

}
const createCar = {
  type: _Types.CarType,
  args: {
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
    price: {
      type: _graphql.GraphQLFloat,
      description: 'Price of Car.',
    },
    mileage: {
      type: _graphql.GraphQLFloat,
      description: 'Mileage of Car.',
    },
  },

  async resolve(parent, {
    ownerId,
    ...rest
  }, {
                  db,
                  auth,
                }) {
    (0, _auth.checkIsAuth)(auth)
    return await db.car.create({
      data: {
        ...rest,
        user: {
          connect: {
            id: ownerId,
          },
        },
      },
    })
  },

}
const updateCar = {
  type: _Types.CarType,
  args: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString),
      description: 'Car id',
    },
    title: {
      type: _graphql.GraphQLString,
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
    price: {
      type: _graphql.GraphQLFloat,
      description: 'Price of Car.',
    },
    mileage: {
      type: _graphql.GraphQLFloat,
      description: 'Mileage of Car.',
    },
  },

  resolve(parent, {
    id,
    ...rest
  }, {
            db,
            auth,
          }) {
    (0, _auth.checkIsAuth)(auth)
    console.log('rest> ', rest)
    return db.car.update({
      where: {
        id,
      },
      data: rest,
    })
  },

}
const deleteCar = {
  type: _Types.CarType,
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
    return db.car.delete({
      where: {
        id,
      },
    })
  },

}
const Query = {
  getCarById,
  getCarsList,
}
exports.Query = Query
const Mutation = {
  createCar,
  updateCar,
  deleteCar,
}
exports.Mutation = Mutation

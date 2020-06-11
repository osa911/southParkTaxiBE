const graphql = require('graphql')
const { CarType } = require('./Types')
const { checkIsAuth } = require('../utils/auth')

const { GraphQLID, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } = graphql

const getCarById = {
  type: CarType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.car.findOne({ where: { id } })
  },
}

const getCarsList = {
  type: GraphQLList(CarType),
  resolve(parent, args, { db, auth }) {
    checkIsAuth(auth)
    return db.car.findMany()
  },
}

const createCar = {
  type: CarType,
  args: {
    title: { type: GraphQLNonNull(GraphQLString), description: 'Title of Car.' },
    govNumber: { type: GraphQLNonNull(GraphQLString), description: 'Government number of Car.' },
    ownerId: { type: GraphQLNonNull(GraphQLString), description: 'User ID - owner of this car.' },
    price: { type: GraphQLFloat, description: 'Price of Car.' },
    mileage: { type: GraphQLFloat, description: 'Mileage of Car.' },
  },
  async resolve(parent, { ownerId, ...rest }, { db, auth }) {
    checkIsAuth(auth)
    return await db.car.create({
      data: {
        ...rest,
        user: {
          connect: { id: ownerId },
        },
      },
    })
  },
}

const updateCar = {
  type: CarType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString), description: 'Car id' },
    title: { type: GraphQLString, description: 'Title of Car.' },
    govNumber: { type: GraphQLNonNull(GraphQLString), description: 'Government number of Car.' },
    ownerId: { type: GraphQLNonNull(GraphQLString), description: 'User ID - owner of this car.' },
    price: { type: GraphQLFloat, description: 'Price of Car.' },
    mileage: { type: GraphQLFloat, description: 'Mileage of Car.' },
  },
  resolve(parent, { id, ...rest }, { db, auth }) {
    checkIsAuth(auth)
    console.log('rest> ', rest)
    return db.car.update({
      where: { id },
      data: rest,
    })
  },
}

const deleteCar = {
  type: CarType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.car.delete({ where: { id } })
  },
}

const Query = {
  getCarById,
  getCarsList,
}

const Mutation = {
  createCar,
  updateCar,
  deleteCar,
}

module.exports = {
  Query,
  Mutation,
  CarType,
}

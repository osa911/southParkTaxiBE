import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const RoleEnumType = new GraphQLEnumType({
  name: 'role',
  values: {
    ADMIN: { value: 'ADMIN' },
    INVESTOR: { value: 'INVESTOR' },
  },
})

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    cars: {
      type: GraphQLList(CarType),
      description: 'User\'s cars.',
      resolve({ id }, args, { db }) {
        return db.car.findMany({ where: { ownerId: id } })
      },
    },
    role: {
      type: RoleEnumType,
    },
  }),
})

export const CarType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString), description: 'Car id' },
    createdAt: { type: GraphQLString, description: 'Date when Car have been added.' },
    title: { type: GraphQLNonNull(GraphQLString), description: 'Title of Car.' },
    govNumber: { type: GraphQLNonNull(GraphQLString), description: 'Government number of Car.' },
    ownerId: { type: GraphQLNonNull(GraphQLString), description: 'User ID - owner of this car.' },
    user: {
      type: UserType,
      resolve({ ownerId }, args, { db }) {
        return db.user.findOne({ where: { id: ownerId } })
      },
    },
    price: { type: GraphQLFloat, description: 'Price of Car.' },
    mileage: { type: GraphQLFloat, description: 'Mileage of Car.' },
  }),
})

const ReportRowType = new GraphQLObjectType({
  name: 'ReportRow',
  fields: {
    address: { type: GraphQLString, description: 'Cell address' },
    value: { type: GraphQLString, description: 'Cell value.' },
  },
})

export const SheetType = new GraphQLObjectType({
  name: 'SheetType',
  fields: {
    name: { type: GraphQLNonNull(GraphQLString), description: 'Sheets name' },
    rows: { type: GraphQLList(GraphQLList(ReportRowType)), description: 'Rows list.' },
  },
})

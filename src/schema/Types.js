import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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
      description: "User's cars.",
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
    report: {
      type: GraphQLList(ReportType),
      resolve({ id }, args, { db }) {
        return db.report.findMany({ where: { govNumberId: id } })
      },
    },
  }),
})

export const ReportType = new GraphQLObjectType({
  name: 'ReportType',
  fields: () => ({
    exchangeRate: { type: GraphQLFloat },
    govNumber: { type: GraphQLString },
    govNumberId: { type: GraphQLString },
    id: { type: GraphQLString },
    income: { type: GraphQLFloat },
    incomeBranding: { type: GraphQLFloat },
    managementFee: { type: GraphQLFloat },
    managementFeePercent: { type: GraphQLFloat },
    mileage: { type: GraphQLFloat },
    netProfit: { type: GraphQLFloat },
    netProfitUSD: { type: GraphQLFloat },
    serviceFee: { type: GraphQLFloat },
    title: { type: GraphQLString },
    totalIncome: { type: GraphQLFloat },
    trackerFee: { type: GraphQLFloat },
    week: { type: GraphQLInt },
    year: { type: GraphQLInt },
    car: {
      type: CarType,
      resolve({ govNumberId }, args, { db }) {
        return db.car.findOne({ where: { id: govNumberId } })
      },
    },
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

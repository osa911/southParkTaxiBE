import { GraphQLID, GraphQLList } from 'graphql'
import { ReportType } from './Types'
import { checkIsAuth } from '../utils/auth'

const getReportById = {
  type: ReportType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.report.findOne({ where: { id } })
  },
}

const getReportsList = {
  type: GraphQLList(ReportType),
  resolve(parent, args, { db, auth }) {
    checkIsAuth(auth)
    return db.report.findMany()
  },
}

const deleteReport = {
  type: ReportType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.report.delete({ where: { id } })
  },
}

export const Query = {
  getReportById,
  getReportsList,
}

export const Mutation = {
  // createCar,
  // updateCar,
  deleteReport,
}

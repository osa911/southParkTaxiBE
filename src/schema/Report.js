import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { ReportType } from './Types'
import { checkIsAuth } from '../utils/auth'
import { getWeekNumber } from '../utils/getWeekNumber'
import { dbDeleteError } from '../utils/dbDeleteError'

const getReportById = {
  type: ReportType,
  args: { id: { type: GraphQLID } },
  resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    return db.report.findOne({ where: { id } })
  },
}

const getReportsByCarsByOwnerId = {
  type: GraphQLList(ReportType),
  args: {
    ownerId: { type: GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLString },
  },
  resolve(parent, { ownerId, date }, { db, auth }) {
    checkIsAuth(auth)
    if (date) {
      const week = getWeekNumber(date)
      const year = new Date(date).getFullYear()
      return db.report.findMany({
        where: {
          car: { ownerId },
          week,
          year,
        },
      })
    }
    return db.report.findMany({ where: { car: { ownerId } } })
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
  type: GraphQLString,
  args: { id: { type: GraphQLString } },
  async resolve(parent, { id }, { db, auth }) {
    checkIsAuth(auth)
    try {
      await db.report.delete({ where: { id } })
      return 'ok'
    } catch (e) {
      return dbDeleteError(e)
    }
  },
}

export const Query = {
  getReportById,
  getReportsList,
  getReportsByCarsByOwnerId,
}

export const Mutation = {
  // createCar,
  // updateCar,
  deleteReport,
}

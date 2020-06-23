import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLUpload, UserInputError, ApolloError } from 'apollo-server'
import Excel from 'exceljs/lib/exceljs.nodejs.js'
import { getNBUExchangeRate } from '../utils/getNBUExchangeRate'
import { getWeekNumber } from '../utils/getWeekNumber'
import { checkIsAuth } from '../utils/auth'
import { ReportType } from './Types'
import { roundNumber } from '../utils/roundNumber'

const findColumnForReport = (date, cell) => {
  const { value } = cell
  let cellDate = { weekNumber: undefined, year: undefined }
  if (typeof value === 'object') {
    if (value instanceof Date) {
      cellDate.weekNumber = getWeekNumber(value) - 1
      cellDate.year = new Date(value).getFullYear()
    } else {
      cellDate.weekNumber = getWeekNumber(value.result) - 1
      cellDate.year = new Date(value.result).getFullYear()
    }
  }

  const weekNumber = getWeekNumber(date)
  const year = new Date(date).getFullYear()

  if (weekNumber === cellDate.weekNumber && year === cellDate.year) {
    return cell
  }

  return null
}

const reportColumn = {
  1: { type: 'date', dbField: '', title: 'Report Data' },
  2: { type: 'info', dbField: '', title: 'Количество людей на авто' },
  3: { type: 'number', dbField: 'income', title: 'Выручка одного авто в неделю' },
  4: { type: 'number', dbField: '', title: 'процент UBER' },
  5: { type: 'object', dbField: '', title: 'Сумма UBER' },
  6: { type: 'number', dbField: '', title: 'Всего машин в автопарке' },
  7: { type: 'null', dbField: '', title: 'Коэффициент загрузки авто' },
  8: { type: 'number', dbField: '', title: 'Процент водителя' },
  9: { type: 'object', dbField: '', title: 'З/п водителя ( % от выручки + топливо)' },
  10: { type: 'number', dbField: '', title: 'Бонусы водителей:' },
  11: { type: 'number', dbField: 'mileage', title: 'Пробег автомобиля за отчетный период' },
  12: {
    type: 'object',
    dbField: '',
    title: 'Расход топлива на 1 км пробега автомобиля (газ+бензин)',
  },
  13: { type: 'object', dbField: '', title: 'Стоимость топлива за отчетный период' },
  14: {
    type: 'object',
    dbField: '',
    title: 'Выручка с 1 км пробега автомобиля за отчетный период (грн.)',
  },
  15: { type: 'number', dbField: '', title: 'Стоимость ТО за отчетный период (грн.)' },
  16: { type: 'number', dbField: '', title: 'Ремонтный фонд' },
  17: { type: 'number', dbField: 'serviceFee', title: 'Регулярные ТО:' },
  18: { type: 'number', dbField: '', title: 'Затраты на страховку 2019' },
  19: { type: 'number', dbField: 'trackerFee', title: 'Трекер - абонплата' },
  20: { type: 'number', dbField: '', title: 'Общая стоимость моек автомобиля за отчетный период' },
  21: { type: 'number', dbField: 'incomeBranding', title: 'Бонус ,Брендирование АВТО:' },
  22: { type: 'number', dbField: '', title: 'ДРУГОЕ' },
  23: { type: 'object', dbField: 'totalIncome', title: 'Прибыль на один авто' },
  24: { type: 'object', dbField: 'managementFee', title: 'Комисия за управление автопарком %' },
  25: { type: 'object', dbField: 'netProfit', title: 'Чистая Прибыль инвестора на один авто %' },
  26: { type: 'object', dbField: '', title: 'В долларе курс' },
  27: { type: 'number', dbField: '', title: 'Курс' },
}

const uploadReportFile = {
  description: 'Upload file for reading',
  type: GraphQLList(ReportType),
  args: {
    date: { type: GraphQLNonNull(GraphQLString) },
    file: {
      description: 'File to upload',
      type: GraphQLNonNull(GraphQLUpload),
    },
  },
  async resolve(parent, { file, date = '' }, { db, auth }) {
    checkIsAuth(auth)
    const { createReadStream, filename, mimetype, encoding } = await file
    const exchangeRate = await getNBUExchangeRate(date || new Date())
    if (!exchangeRate) throw new Error('Попробуйте еще раз. Сервер НБУ не отвечает.')
    if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const stream = createReadStream()
      // read from a stream
      const workbook = new Excel.Workbook()
      await workbook.xlsx.read(stream)
      let res = []
      let errors = []

      for (const worksheet of workbook.worksheets) {
        const { name } = worksheet
        const reportedCar = await db.car.findOne({ where: { govNumber: name } })
        if (date) {
          const week = getWeekNumber(date)
          const year = new Date(date).getFullYear()
          const reports = await db.report.findMany({ where: { govNumber: name, week, year } })
          if (reports.length) {
            errors.push(
              new UserInputError(`Отчет за неделю #${getWeekNumber(date)} - уже существует!`)
            )
            continue
          }
          let columnForReport
          worksheet.getRow(1).eachCell((cell) => {
            const foundedCell = findColumnForReport(date, cell)
            if (foundedCell) columnForReport = foundedCell
          })

          if (columnForReport) {
            worksheet.getColumn(columnForReport.fullAddress.col).eachCell((cell, row) => {
              if (typeof cell.value === 'object') {
                if (cell.value !== null) {
                  reportColumn[row].value = cell.value.result
                }
              } else {
                reportColumn[row].value = cell.value
              }
            })

            const dbFields = Object.values(reportColumn).reduce(
              (obj, { dbField, value }) => ({
                ...obj,
                ...(dbField ? { [dbField]: value } : {}),
              }),
              {}
            )
            if (!reportedCar) throw new Error('Автомобиль не найдет в системе!')
            if (reportedCar) {
              const {
                income,
                incomeBranding,
                totalIncome,
                managementFee,
                mileage,
                trackerFee,
                serviceFee,
                netProfit,
              } = dbFields

              const data = {
                exchangeRate: roundNumber(exchangeRate),
                govNumber: name,
                car: { connect: { id: reportedCar.id } },
                income: roundNumber(income),
                incomeBranding: roundNumber(incomeBranding),
                managementFee: roundNumber(managementFee),
                managementFeePercent: roundNumber((managementFee / totalIncome) * 100),
                mileage: roundNumber(mileage),
                netProfit: roundNumber(netProfit),
                netProfitUSD: roundNumber(netProfit / exchangeRate),
                serviceFee: roundNumber(serviceFee),
                title: `Отчет за неделю #${week}/${year}`,
                totalIncome: roundNumber(totalIncome),
                trackerFee: roundNumber(trackerFee),
                totalFee: roundNumber(trackerFee + managementFee + serviceFee),
                week,
                year,
              }
              const report = await db.report.create({ data })
              res.push(report)
            }
          }
        }
      }

      if (errors.length) {
        return errors.map((err) => new ApolloError(err))
      }

      if (res.length) {
        return res
      }
      return new Error('Upload for data range impossible')
    }
    throw new Error('Файл должен быть .xlsx')
  },
}

export const Mutation = {
  uploadReportFile,
}

import { GraphQLList, GraphQLNonNull } from 'graphql'
import { GraphQLUpload } from 'apollo-server'
import Excel from 'exceljs/lib/exceljs.nodejs.js'
import { getNBUExchangeRate } from '../utils/getNBUExchangeRate'
import { checkIsAuth } from '../utils/auth'

const { SheetType } = require('./Types')

const singleUploadStream = {
  description: 'Upload file for reading',
  type: GraphQLList(SheetType),
  args: {
    file: {
      description: 'File to upload',
      type: GraphQLNonNull(GraphQLUpload),
    },
  },
  async resolve(parent, { file }, { db, auth }) {
    checkIsAuth(auth)
    const { createReadStream, filename, mimetype, encoding } = await file
    const exchangeRate = await getNBUExchangeRate(new Date())
    console.log('exchangeRate> ', exchangeRate)
    if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const stream = createReadStream()
      // read from a stream
      const workbook = new Excel.Workbook()
      await workbook.xlsx.read(stream)
      let res = []
      workbook.eachSheet(function (worksheet, sheetId) {
        const { name } = worksheet
        const rows = []
        worksheet.eachRow((row, rowNumber) => {
          let cells = []
          row.eachCell(({ address, value }, cellNumber) => {
            cells.push({
              address,
              value,
            })
          })
          rows.push(cells)
        })
        res.push({ name, rows })

        worksheet.eachColumnKey((col, index) => {
          console.log('col> ', col)
          console.log('index> ', index)
          col.eachCell((cell, rowNumber) => {
            console.log('cell> ', cell)
            console.log('rowNumber> ', rowNumber)
          })
        })

        // db.report.create({
        //   data: {
        //     exchangeRate,
        //     govNumber,
        //     govNumberId, // car id
        //     income,
        //     incomeBranding,
        //     managementFee,
        //     managementFeePercent,
        //     mileage,
        //     netProfit,
        //     netProfitUSD,
        //     serviceFee,
        //     title,
        //     totalIncome,
        //     trackerFee,
        //     week,
        //     year,
        //   }
        // })
      })
      return res
    }
    throw new Error('File should be .xlsx')
  },
}

const Mutation = {
  singleUploadStream,
}

module.exports = {
  Mutation,
}

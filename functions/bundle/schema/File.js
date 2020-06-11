'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.Mutation = void 0

var _graphql = require('graphql')

var _apolloServer = require('apollo-server')

var _exceljsNodejs = _interopRequireDefault(require('exceljs/lib/exceljs.nodejs.js'))

var _getNBUExchangeRate = require('../utils/getNBUExchangeRate')

var _auth = require('../utils/auth')

var _Types = require('./Types')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const singleUploadStream = {
  description: 'Upload file for reading',
  type: (0, _graphql.GraphQLList)(_Types.SheetType),
  args: {
    file: {
      description: 'File to upload',
      type: (0, _graphql.GraphQLNonNull)(_apolloServer.GraphQLUpload),
    },
  },

  async resolve(parent, {
    file,
  }, {
                  db,
                  auth,
                }) {
    (0, _auth.checkIsAuth)(auth)
    const {
      createReadStream,
      filename,
      mimetype,
      encoding,
    } = await file
    const exchangeRate = await (0, _getNBUExchangeRate.getNBUExchangeRate)(new Date())
    console.log('exchangeRate> ', exchangeRate)

    if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const stream = createReadStream() // read from a stream

      const workbook = new _exceljsNodejs.default.Workbook()
      await workbook.xlsx.read(stream)
      let res = []
      workbook.eachSheet(function (worksheet, sheetId) {
        const {
          name,
        } = worksheet
        const rows = []
        worksheet.eachRow((row, rowNumber) => {
          let cells = []
          row.eachCell(({
                          address,
                          value,
                        }, cellNumber) => {
            cells.push({
              address,
              value,
            })
          })
          rows.push(cells)
        })
        res.push({
          name,
          rows,
        })
        worksheet.eachColumnKey((col, index) => {
          console.log('col> ', col)
          console.log('index> ', index)
          col.eachCell((cell, rowNumber) => {
            console.log('cell> ', cell)
            console.log('rowNumber> ', rowNumber)
          })
        }) // db.report.create({
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
exports.Mutation = Mutation

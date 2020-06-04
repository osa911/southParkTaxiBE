const graphql = require('graphql')
const { GraphQLUpload } = require('apollo-server')
const Excel = require('exceljs/lib/exceljs.nodejs.js')

const { checkIsAuth } = require('../utils/auth')
const { SheetType } = require('./Types')

const { GraphQLList, GraphQLNonNull } = graphql

const singleUploadStream = {
  description: 'Upload file for reading',
  type: GraphQLList(SheetType),
  args: {
    file: {
      description: 'File to upload',
      type: GraphQLNonNull(GraphQLUpload),
    },
  },
  async resolve(parent, { file }, { auth }) {
    checkIsAuth(auth)
    const { createReadStream, filename, mimetype, encoding } = await file
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

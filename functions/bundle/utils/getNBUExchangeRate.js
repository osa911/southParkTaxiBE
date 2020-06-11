'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.getNBUExchangeRate = void 0

var _nodeFetch = _interopRequireDefault(require('node-fetch'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const getNBUExchangeRate = async date => {
  const workDate = new Date(date)
  const y = workDate.getFullYear()
  const month = workDate.getMonth()
  const day = workDate.getDate()
  const m = `${month}`.length === 1 ? `0${month}` : `${month}`
  const d = `${day}`.length === 1 ? `0${day}` : `${day}`
  const response = await (0, _nodeFetch.default)(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${y}${m}${d}&json`).then(res => res.json())
  if (Array.isArray(response) && response.length > 0) return response[0].rate
  return null
}

exports.getNBUExchangeRate = getNBUExchangeRate

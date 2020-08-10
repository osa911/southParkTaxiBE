import fetch from 'node-fetch'

export const getNBUExchangeRate = async (date) => {
  try {
    const workDate = new Date(date)
    const y = workDate.getFullYear()
    const month = workDate.getMonth()
    const day = workDate.getDate()
    const m = `${month}`.length === 1 ? `0${month}` : `${month}`
    const d = `${day}`.length === 1 ? `0${day}` : `${day}`
    const response = await fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${y}${m}${d}&json`
    )
    const json = await response.json()
    if (Array.isArray(json) && json.length > 0) return json[0].rate
  } catch {
    return null
  }
}

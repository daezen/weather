// const searchQuery = 'Tunja'
const searchQuery = 'Tunja'
const forecast = `http://api.weatherapi.com/v1/forecast.json?key=f1161324e1f843feb8923721241403&q=${searchQuery}&days=3&aqi=no&alerts=no`

try {
  const response = await fetch(forecast)
  const result = JSON.parse(await response.text())
} catch (error) {
  console.error('Error')
}

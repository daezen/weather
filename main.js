// const searchQuery = 'Tunja'
const $form = document.querySelector('[data-submit]')
const $input = document.querySelector('[data-input]')
const $city = document.querySelector('[data-city]')
const $country = document.querySelector('[data-country]')
$form.addEventListener('submit', handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  fetchQuery($input.value)
  $input.value = ''
}

async function fetchQuery(query) {
  const forecast = `https://api.weatherapi.com/v1/forecast.json?key=f1161324e1f843feb8923721241403&q=${query}&days=3&aqi=no&alerts=no`
  try {
    const response = await fetch(forecast)
    const result = JSON.parse(await response.text())
    console.log(result)
  } catch (error) {
    console.error('Error')
  }
}

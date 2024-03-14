import { apiKey } from './apiKey'

const $form = document.querySelector('[data-submit]')

async function handleSubmit(e) {
  e.preventDefault()
  const $input = document.querySelector('[data-input]')
  const query = $input.value.trim()
  if (query === '') return
  try {
    const weatherData = await fetchWeather($input.value)
    updateUI(weatherData)
  } catch (error) {
    console.error(error)
  }
  $input.value = ''
}

async function fetchWeather(query) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}=${query}&days=3&aqi=no&alerts=no`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data from API')
  }
  return response.json()
}

function updateUI(data) {
  updateLocation(data.location)
  updateWeather(data.current)
}

function updateLocation(location) {
  const $city = document.querySelector('[data-city]')
  const $country = document.querySelector('[data-country]')
  $country.textContent = location.country
  $city.textContent = location.name
}

function updateWeather(weather) {
  const $temp = document.querySelector('[data-main-temp]')
  const $feelslike = document.querySelector('[data-feelslike-temp]')
  const $condition = document.querySelector('[data-condition]')
  $feelslike.textContent = `feels ${Math.floor(weather.feelslike_c)}°`
  $temp.textContent = Math.floor(weather.temp_c)
  $condition.textContent = weather.condition.text
}

$form.addEventListener('submit', handleSubmit)

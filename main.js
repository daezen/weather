import { apiKey } from './apiKey'
import dayjs from 'dayjs'

const $form = document.querySelector('[data-submit]')
const $switch = document.querySelector('[data-switch]')
let tempUnit = 'c'
let weatherData

async function handleSubmit(e, query) {
  if (query) {
    weatherData = await fetchWeather(query)
    updateUI(weatherData)
    return
  }
  e.preventDefault()
  const $input = document.querySelector('[data-input]')
  const formQuery = $input.value.trim()
  if (formQuery === '') return
  try {
    weatherData = await fetchWeather(formQuery)
    updateUI(weatherData)
  } catch (error) {
    throw new Error('Failed to fetch data from API')
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
  updateForecast(data.forecast.forecastday)
  updateWeather(data.current)
}

function updateLocation(location) {
  const $city = document.querySelector('[data-city]')
  const $country = document.querySelector('[data-country]')
  $country.textContent = location.country
  $city.textContent = `${location.name},`
}

function updateWeather(weather) {
  const $temp = document.querySelector('[data-main-temp]')
  const $feelslike = document.querySelector('[data-feelslike-temp]')
  const $condition = document.querySelector('[data-condition]')
  if (tempUnit === 'c') {
    $feelslike.textContent = `feels ${Math.floor(weather.feelslike_c)}°`
    $temp.textContent = `${Math.floor(weather.temp_c)}`
  }
  if (tempUnit === 'f') {
    $feelslike.textContent = `feels ${Math.floor(weather.feelslike_f)}°`
    $temp.textContent = `${Math.floor(weather.temp_f)}`
  }

  $condition.textContent = weather.condition.text
}

function updateForecast(forecast) {
  const $forecast = document.querySelectorAll('[data-forecast]')
  $forecast.forEach((element, index) => {
    element.firstElementChild.textContent = dayjs(forecast[index].date).format('ddd')
    if (tempUnit === 'c') element.lastElementChild.textContent = `${Math.floor(forecast[index].day.avgtemp_c)}°C`
    if (tempUnit === 'f') element.lastElementChild.textContent = `${Math.floor(forecast[index].day.avgtemp_f)}°F`
  })
}

function changeTemperatureUnit(e) {
  if (e.target.dataset.unit === undefined) return
  if (e.target.dataset.unit === 'c') tempUnit = 'c'
  if (e.target.dataset.unit === 'f') tempUnit = 'f'
  Array.from($switch.children).forEach(child => child.removeAttribute('style'))
  e.target.style.color = 'white'
  updateUI(weatherData)
}

$switch.addEventListener('mousedown', changeTemperatureUnit)
$form.addEventListener('submit', handleSubmit)
handleSubmit(null, 'Seoul')

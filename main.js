// Importing apiKey and dayjs modules
import { apiKey } from './apiKey'
import dayjs from 'dayjs'

// Selecting DOM elements
const $form = document.querySelector('[data-submit]')
const $switch = document.querySelector('[data-switch]')

// Initializing temperature unit and weather data variables
let tempUnit = 'c'
let weatherData

// Function to handle form submission
async function handleSubmit(e, query) {
  // If query is provided, fetch weather data directly
  if (query) {
    weatherData = await fetchWeather(query)
    updateUI(weatherData)
    return
  }

  // Preventing default form submission behavior
  e.preventDefault()

  // Retrieving input value and trimming whitespace
  const $input = document.querySelector('[data-input]')
  const formQuery = $input.value.trim()

  // If input is empty, return
  if (formQuery === '') return

  try {
    // Fetching weather data based on user input
    weatherData = await fetchWeather(formQuery)
    updateUI(weatherData)
  } catch (error) {
    // Handling errors if API fetch fails
    throw new Error('Failed to fetch data from API')
  }

  // Clearing input field after submission
  $input.value = ''
}

// Function to fetch weather data from API
async function fetchWeather(query) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}=${query}&days=3&aqi=no&alerts=no`
  const response = await fetch(url)

  // Handling HTTP errors
  if (!response.ok) {
    throw new Error('Failed to fetch data from API')
  }

  return response.json()
}

// Function to update UI with weather data
function updateUI(data) {
  updateLocation(data.location)
  updateForecast(data.forecast.forecastday)
  updateWeather(data.current)
}

// Function to update location information in UI
function updateLocation(location) {
  const $city = document.querySelector('[data-city]')
  const $country = document.querySelector('[data-country]')
  $country.textContent = location.country
  $city.textContent = `${location.name},`
}

// Function to update current weather information in UI
function updateWeather(weather) {
  const $temp = document.querySelector('[data-main-temp]')
  const $feelslike = document.querySelector('[data-feelslike-temp]')
  const $condition = document.querySelector('[data-condition]')

  // Displaying temperature and "feels like" temperature based on selected unit
  if (tempUnit === 'c') {
    $feelslike.textContent = `feels ${Math.floor(weather.feelslike_c)}°`
    $temp.textContent = `${Math.floor(weather.temp_c)}`
  }
  if (tempUnit === 'f') {
    $feelslike.textContent = `feels ${Math.floor(weather.feelslike_f)}°`
    $temp.textContent = `${Math.floor(weather.temp_f)}`
  }

  // Displaying current weather condition
  $condition.textContent = weather.condition.text
}

// Function to update forecast information in UI
function updateForecast(forecast) {
  const $forecast = document.querySelectorAll('[data-forecast]')
  $forecast.forEach((element, index) => {
    element.firstElementChild.textContent = dayjs(forecast[index].date).format('ddd')
    if (tempUnit === 'c') element.lastElementChild.textContent = `${Math.floor(forecast[index].day.avgtemp_c)}°C`
    if (tempUnit === 'f') element.lastElementChild.textContent = `${Math.floor(forecast[index].day.avgtemp_f)}°F`
  })
}

// Event handler to change temperature unit
function changeTemperatureUnit(e) {
  // Checking if clicked element has data-unit attribute
  if (e.target.dataset.unit === undefined) return

  // Updating temperature unit based on clicked element
  if (e.target.dataset.unit === 'c') tempUnit = 'c'
  if (e.target.dataset.unit === 'f') tempUnit = 'f'

  // Resetting styles of all temperature unit buttons
  Array.from($switch.children).forEach(child => child.removeAttribute('style'))

  // Applying style to clicked temperature unit button
  e.target.style.color = 'white'

  // Updating UI with new temperature unit
  updateUI(weatherData)
}

// Adding event listeners
$switch.addEventListener('mousedown', changeTemperatureUnit)
$form.addEventListener('submit', handleSubmit)

// Initializing the application with default location (Seoul)
handleSubmit(null, 'Seoul')

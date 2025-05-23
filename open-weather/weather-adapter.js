require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const axios = require('axios');
const { log } = require('./logger');

let lastCall = null;

async function getWeather(args) {
  const { city, units = 'metric' } = args;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  const res = await axios.get(url);
  const data = res.data;

  const result = {
    temperature: data.main.temp,
    conditions: data.weather[0].main
  };

  log('getWeather-success', { city, units, result });
  lastCall = { args, result };
  return result;
}

function repeatLast() {
  if (!lastCall) {
    log('repeat-failed', { reason: 'No previous call' }, 'warn');
    throw new Error('No previous call to repeat');
  }
  return lastCall.result;
}

function revert() {
  log('revert-noop');
  return { message: 'Nothing to revert' };
}

module.exports = { getWeather, repeatLast, revert };

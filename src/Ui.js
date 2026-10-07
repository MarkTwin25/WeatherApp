import { formatHour } from './utils/formats.js';

// Main card
const mainCard = document.getElementById('main-card');
const zone = document.getElementById('zone');
const hour = document.getElementById('hour');
const date = document.getElementById('date');
const celcius = document.getElementById('celcius');
const farenheit = document.getElementById('farenheit');
const mainIcon = document.getElementById('main-icon');
const temperature = document.getElementById('temperature');
const temperatureInfo = document.getElementById('temperature-info');
const days = document.getElementById('days');
const sunriseValue = document.getElementById('sunrise-value');
const sunsetValue = document.getElementById('sunset-value');
const windValue = document.getElementById('wind-value');
const pressureValue = document.getElementById('pressure-value');
const uvIndexValue = document.getElementById('uv-index-value');
const humidityValue = document.getElementById('humidity-value');

async function getIcon(name) {
    try {
        const icon = await import(`./assets/icons/${name}.svg`);
        return icon.default;
    } catch (error) {
        console.log(error);
        const defaulIcon = await import('./assets/icons/clear-day.svg');
        return defaulIcon.default;
    }
}

export async function printMainCard(data, type) {
    // check farenheit or celcius
    let typeWeather = checkType(type);
    // Change background of main card
    mainCard.className = '';
    mainCard.classList.add('main-card');
    mainCard.classList.add(`bg-${data.icon}`);
    // zone
    zone.innerText = data.resolvedAddress;

    const today = new Date();

    const day = today.toLocaleString('en', {
        timeZone: data.timezone,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const timeHour = today.toLocaleString('en', {
        timeZone: data.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    hour.innerText = timeHour;
    date.innerText = day;

    // icon
    const icon = await getIcon(data.icon);
    mainIcon.innerHTML = `<img src="${icon}">`;

    //Temp
    temperature.innerText = `${Math.round(data.temp)} ${typeWeather}°`;

    // Temp info
    temperatureInfo.innerText = data.conditions.split(',')[0];
}

async function createDayCard(day, index, type) {
    const newDay = document.createElement('div');
    newDay.classList.add('day', index);
    const dayName = document.createElement('div');
    dayName.classList.add('day-name');

    dayName.innerText = new Date(`${day.datetime}T00:00:00`).toLocaleString(
        'en',
        {
            weekday: 'long',
        }
    );

    const dayIcon = document.createElement('div');
    dayIcon.classList.add('day-icon');
    const icon = await getIcon(day.icon);
    dayIcon.innerHTML = `<img src="${icon}">`;

    const dayTemperature = document.createElement('div');
    dayTemperature.classList.add('day-temperaure');
    dayTemperature.innerText = day.conditions.split(',')[0];

    const dayInfo = document.createElement('div');
    dayInfo.classList.add('day-info');
    dayInfo.innerText = `${Math.round(day.feelslikemin)}°${type} - ${Math.round(day.feelslikemax)}°${type}`;

    newDay.appendChild(dayName);
    newDay.appendChild(dayIcon);
    newDay.appendChild(dayTemperature);
    newDay.appendChild(dayInfo);
    return newDay;
}

export async function printForecast(data, type) {
    // check farenheit or celcius
    let typeWeather = checkType(type);
    days.innerHTML = '';
    for (let day = 1; day <= data.days.length; day++) {
        const newDay = await createDayCard(
            data.days[day - 1],
            day,
            typeWeather
        );
        days.appendChild(newDay);
    }
}

function checkType(type) {
    let typeWeather;
    if (type === 'celcius') {
        celcius.classList.add('active');
        farenheit.classList.remove('active');
        typeWeather = 'c';
    } else if (type === 'farenheit') {
        farenheit.classList.add('active');
        celcius.classList.remove('active');
        typeWeather = 'F';
    }

    return typeWeather;
}

export async function printTodaysDetails(data, type) {
    sunsetValue.innerText = formatHour(data.current.sunset);
    sunriseValue.innerText = formatHour(data.current.sunrise);
    windValue.innerText = `${data.current.windspeed.toFixed(1)} ${type}/h`;
    pressureValue.innerText = `${data.current.pressure} mb`;
    uvIndexValue.innerText = data.current.uvindex > 5 ? 'High' : 'Low';
    humidityValue.innerText = `${data.current.humidity} %`;
    return;
}

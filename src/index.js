import './template.html';
import './styles.css';
import { getData } from './api.js';
import { printMainCard, printForecast, printTodaysDetails } from './Ui.js';
import {
    celciusToFarenheit,
    farenheitToCelcius,
    kmPerHourToMilesPerHour,
    milesPerHourToKmPerHour,
} from './utils/convertions.js';

const intro = document.getElementById('intro');
const results = document.getElementById('results');
const inputIntro = document.getElementById('input-intro');
const temperatureType = document.getElementById('temperature-type');

// current type (celcius or farenheit)
let currentType = 'celcius';

function handleType(data, type) {
    if (type === 'farenheit') {
        // Print main card
        data.currentConditions.temp = celciusToFarenheit(
            data.currentConditions.temp
        );
        printMainCard(
            {
                resolvedAddress: data.resolvedAddress,
                timezone: data.timezone,
                icon: data.currentConditions.icon,
                temp: data.currentConditions.temp,
                conditions: data.currentConditions.conditions,
            },
            currentType
        );

        // Print forecast
        data.days.forEach((day) => {
            day.feelslikemin = celciusToFarenheit(day.feelslikemin);
            day.feelslikemax = celciusToFarenheit(day.feelslikemax);
        });
        printForecast(
            {
                days: data.days,
            },
            currentType
        );

        // Print today's weather details
        data.currentConditions.windspeed = kmPerHourToMilesPerHour(
            data.currentConditions.windspeed
        );
        printTodaysDetails(
            {
                current: data.currentConditions,
            },
            'm'
        );
    } else if (type === 'celcius') {
        // Print main card
        data.currentConditions.temp = farenheitToCelcius(
            data.currentConditions.temp
        );

        printMainCard(
            {
                resolvedAddress: data.resolvedAddress,
                timezone: data.timezone,
                icon: data.currentConditions.icon,
                temp: data.currentConditions.temp,
                conditions: data.currentConditions.conditions,
            },
            currentType
        );

        // Print forecast
        data.days.forEach((day) => {
            day.feelslikemin = farenheitToCelcius(day.feelslikemin);
            day.feelslikemax = farenheitToCelcius(day.feelslikemax);
        });
        printForecast(
            {
                days: data.days,
            },
            currentType
        );

        // Print today's weather details
        data.currentConditions.windspeed = milesPerHourToKmPerHour(
            data.currentConditions.windspeed
        );
        printTodaysDetails(
            {
                current: data.currentConditions,
            },
            'km'
        );
    }
}

document.body.addEventListener('submit', async (e) => {
    e.preventDefault();
    let data;

    // Intro form (only first time)
    if (e.target.classList.contains('search-intro')) {
        const city = inputIntro.value;
        const errorMessage = document.querySelector('.search-intro .error');

        // check if there's already an error
        if (!errorMessage.classList.contains('hidden')) {
            errorMessage.classList.add('hidden');
        }
        try {
            data = await getData(city);

            printMainCard(
                {
                    resolvedAddress: data.resolvedAddress,
                    timezone: data.timezone,
                    icon: data.currentConditions.icon,
                    temp: data.currentConditions.temp,
                    conditions: data.currentConditions.conditions,
                },
                currentType
            );

            // Print forecast
            printForecast(
                {
                    days: data.days,
                },
                currentType
            );

            // Print today's weather details
            printTodaysDetails(
                {
                    current: data.currentConditions,
                },
                'km'
            );
            // Wait to animation ends
            setTimeout(() => {
                intro.classList.add('disapear');
                intro.style.display = 'none';
                results.classList.add('show-results');
            }, 1000);
        } catch (error) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = error;
        }
    }

    // Main form (every request after 1st one)
    if (e.target.classList.contains('search-main')) {
        const inputMain = document.getElementById('input-main');
        const errorMessage = document.querySelector('.search-main .error');
        const city = inputMain.value;

        // check if there's already an error
        if (!errorMessage.classList.contains('hidden')) {
            errorMessage.classList.add('hidden');
        }

        try {
            data = await getData(city);
            // Print main card
            if (currentType == 'farenheit') {
                handleType(data, currentType);
            } else {
                printMainCard(
                    {
                        resolvedAddress: data.resolvedAddress,
                        timezone: data.timezone,
                        icon: data.currentConditions.icon,
                        temp: data.currentConditions.temp,
                        conditions: data.currentConditions.conditions,
                    },
                    currentType
                );

                // Print forecast
                printForecast(
                    {
                        days: data.days,
                    },
                    currentType
                );

                // Print today's weather details
                printTodaysDetails(
                    {
                        current: data.currentConditions,
                    },
                    'km'
                );
            }
        } catch (error) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = error;
        }
    }

    temperatureType.addEventListener('click', (e) => {
        if (e.target.id === 'farenheit') {
            currentType = 'farenheit';
            handleType(data, currentType);
        } else if (e.target.id === 'celcius') {
            currentType = 'celcius';
            handleType(data, currentType);
        }
    });
});

import { hideLoader, showLoader } from './loader.js';

const API_KEY = 'FSQBNS9NQMTUKA59YV9R8ZUBG';

export const getData = async (city) => {
    showLoader();
    try {
        if (city === '') {
            throw new Error('Enter a valid city');
        }
        const request = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next5days?unitGroup=metric&include=days%2Ccurrent&key=${API_KEY}&contentType=json`
        );

        if (!request.ok) {
            throw new Error('Not found');
        }
        const data = await request.json();

        return {
            resolvedAddress: data.resolvedAddress,
            timezone: data.timezone,
            days: data.days,
            currentConditions: data.currentConditions,
        };
    } catch (error) {
        throw error.message;
    } finally {
        hideLoader();
    }
};

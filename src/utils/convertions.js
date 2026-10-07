export function celciusToFarenheit(celcius) {
    return celcius * (9 / 5) + 32;
}

export function farenheitToCelcius(farenheit) {
    return (farenheit - 32) * (5 / 9);
}

export function milesPerHourToKmPerHour(miles) {
    return miles * 1.609;
}

export function kmPerHourToMilesPerHour(kms) {
    return kms / 1.609;
}

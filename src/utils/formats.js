export function formatHour(hour) {
    const hourSplit = hour.split(':');
    let hourNum = parseInt(hourSplit[0], 10);
    const minutes = hourSplit[1];

    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    let formattedHour = hourNum % 12;
    if (formattedHour === 0) {
        formattedHour = 12;
    }

    if (formattedHour.toString().length === 1) {
        formattedHour = `0${formattedHour}`;
    }

    return `${formattedHour}:${minutes} ${ampm}`;
}

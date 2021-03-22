var moment = require('moment')
exports.getTimeZoneOffset = (date, timeZone) => {
    const options = { timeZone, calendar: 'iso8601', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateTimeFormat = new Intl.DateTimeFormat(undefined, options);
    const parts = dateTimeFormat.formatToParts(date);
    const map = new Map(parts.map(x => [x.type, x.value]));
    const year = map.get('year');
    const month = map.get('month');
    const day = map.get('day');
    const hour = map.get('hour');
    const minute = map.get('minute');
    const second = map.get('second');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
    const lie = new Date(iso + 'Z');
    return -(lie - date) / 60 / 1000;
}
exports.getTimeIntervals = (startTime1, endTime1, increment) => {
    let x = {
        slotInterval: increment,
        openTime: startTime1,
        closeTime: endTime1
    };

    let startTime = moment(x.openTime, "HH:mm");
    let endTime = moment(x.closeTime, "HH:mm").add(1, 'days');

    let allTimes = [];
    while (startTime < endTime) {
        //push start and end times
        var st = startTime.format("HH:mm");
        startTime.add(x.slotInterval, 'minutes');
        var et = startTime.format("HH:mm");
        allTimes.push(st + "-" + et);
    }
    return allTimes;
}

exports.time_convert = (num) => {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + minutes;
}
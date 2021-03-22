var express = require('express');
var router = express.Router();

const FireStoreClient = require('../firebase-controller/fireStoreController');
const timeZoneController = require('../controller/timeZoneConvertor');
const config = require('../config/config')

router.get('/getFreeSlots', async function(req, res) {
    var reqDate = req.query.reqDate;
    var timeZone = req.query.timeZone;
    console.log(reqDate, timeZone)
    var dateArray = reqDate.split('/');
    var timeZoneDiff = 0;
    var doctorTimeZone = timeZoneController.getTimeZoneOffset(new Date(dateArray[0], dateArray[1], dateArray[2]), config.defaultTimeZone);
    var clientTimeZone = timeZoneController.getTimeZoneOffset(new Date(dateArray[0], dateArray[1], dateArray[2]), timeZone)
    timeZoneDiff = doctorTimeZone - clientTimeZone
    var hourDifference = (timeZoneDiff / 60);

    var startHour = () => {
        if (config.availableStartHour > hourDifference) {
            return config.availableStartHour - hourDifference;
        } else {
            return config.availableStartHour + hourDifference;
        }
    }
    var endHour = () => {
        if (config.availableEndHour > hourDifference) {
            return config.availableEndHour - hourDifference;
        } else {
            return config.availableEndHour + hourDifference;
        }
    }
    var stringHourStart = timeZoneController.time_convert(startHour() * 60)
    var stringHourEnd = timeZoneController.time_convert(endHour() * 60)
    console.log("testing hours from " + stringHourStart + " to " + stringHourEnd)
    var a = timeZoneController.getTimeIntervals(stringHourStart, stringHourEnd, config.timeIntervals);
    var find = '/';
    var re = new RegExp(find, 'g');
    var eventModel = {
        startHours: stringHourStart,
        endHours: stringHourEnd,
        date: req.query.reqDate.replace(re, '-'),
    }
    var exitingAray = await FireStoreClient.findByValue('events', eventModel.date, a);
    res.send({ time: timeZoneDiff, startHour: startHour(), endHour: endHour(), timeIntervals: exitingAray })
})

router.post('/createEvent', async function(req, res) {
    var eventModel = {
        time: req.body.startHours + '-' + req.body.endHours,
        date: req.body.date,
    }
    var ifEventExist = FireStoreClient.checkEventExist(eventModel.date, eventModel.time)
    if (ifEventExist === 1) {
        res.status(200).send({ msg: `Sorry event has already been created` })

    } else {
        await FireStoreClient.save('events', eventModel).then(() => {
            res.status(200).send({ msg: `Event created succesfully for ${eventModel.date} at ${eventModel.time}` })
        });
    }
})

router.get('/getEventsFromDate', async function(req, res) {
    var result = await FireStoreClient.checkEventsByDate(req.params.startDate, req.params.endDate);
    if (result.length > 0) {
        res.send({ availableSchedule: result })
    } else {
        res.status(200).send({ msg: "No events found" })
    }
})
module.exports = router;
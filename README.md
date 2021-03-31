# appointment-booking
This Project is developed in Nodejs for testing purpose,

This is an appointment booking API Application based on different Time zones

# App Settings

App configuration can be changed for time zone, availableStartHour, availableEndHour,defaultTimeZone, timeIntervals for doctors timezone.

{
    availableStartHour: 10, //save start time in 24 hours format double digit 
    availableEndHour: 17, //save end time in 24 hours format double digit 
    defaultTimeZone: 'America/Los_Angeles',
    timeIntervals: 30 //set in minutes
}

# Demo


https://user-images.githubusercontent.com/37976696/113167368-490cf100-9261-11eb-8bca-9d266343845a.mp4



# APIs 

=> 1. GET /getFreeSlots

    Parameters: reqDate, timeZone

    Example:    reqDate: 2021/3/28
                timeZone: Asia/Kolkata

=> 2. POST /createEvent

    Body: startHours, endHours, date
    Example: {
                "startHours": "13:30",
                "endHours": "17:00",
                "date": "2021-3-24"
            }

=> 3. GET /getEventsFromDate

    Parameters: startDate, endDate

    Example:    startDate:2021-3-24
                endDate:2021-3-31
                                
# More documentation can be found on
 https://documenter.getpostman.com/view/9795415/TzCMdoMs

Note all dates are required to be passed in "yyyy-mm-dd" format.

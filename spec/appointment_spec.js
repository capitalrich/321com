/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var appointment = rewire('../modules/appointment.js')

  // === Get Method to Database test ===
frisby.create('check that post was successful by pulling data with get method')
	.get('http://cortexapi.ddns.net:8080/api/getAvailabilityByPerson/ab4491@coventry.ac.uk')
	.expectStatus(201)
	.toss()

frisby.create('post booking data to db')
	.post('http://cortexapi.ddns.net:8080/api/addNewAppointment', {
        "startTime": "1300",
        "endTime": "1500",
        "date": "30022016",
        "participants": ["markt","craigs"],
        "bookable": false,
        "location": "Starbucks",
        "reoccurance": false,
        "title": "nodeJStest",
        "notes": "Meeting between mark and craig",
        "parentApp": 630
        }, {json: true}) // the following runs a post to the database and add in the data shown in {}.
	.expectStatus(201)
	.toss()



// frisby.create('editing booking data to db')
// 	.put('http://cortexapi.ddns.net:8080/api/modifyAppointment/nodeJStest', {
//         "startTime": "1100",
//         "endTime": "1300",
//         "date": "30022016",
//         "participants": ["swolejl","craigs","markt"],
//         "bookable": false,
//         "location": "EC2-12",
//         "reoccurance": false,
//         "title": "nodeJS",
//         "notes": "Meeting between joe and craig",
//         "parentApp": 630
//         }, {json: true}) // the following runs a post to the database and add in the data shown in {}.
// 	.expectStatus(201)
// 	.toss()

frisby.create('deleting appointment from db')
    .delete('http://cortexapi.ddns.net:8080/api/deleteAppointmentByTitle/nodeJStest',  {json: true}, { headers: { 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiUGV0ZXIgRXZlcnkiLCJ1c2VybmFtZSI6InBldGVyZSIsImlhdCI6MTQ1Njk1Mjg4MiwiZXhwIjoxNDg4NDg4ODgyfQ._nsgjWboR2-zK9AUH1cZPpVNFa4Gux-FGn4JxbQdpCo' }})
    .expectStatus(201)
    .toss()

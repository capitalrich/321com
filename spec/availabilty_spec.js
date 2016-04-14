/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var availability = rewire('../modules/availability.js')

frisby.create('posting availability data to db')
	.post('http://cortexapi.ddns.net:8080/api/addNewAvailability', {"name": "Testing Time",
	"timeStart": "12.00",
	"timeStop": "13.00",
	"date": "2016_01_10",
	"notes": "testing",
	"recurringWeekly": true,
	"bookable": true,
	"username": "swolej"}, {json: true}, { headers: { 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiUGV0ZXIgRXZlcnkiLCJ1c2VybmFtZSI6InBldGVyZSIsImlhdCI6MTQ1Njk1Mjg4MiwiZXhwIjoxNDg4NDg4ODgyfQ._nsgjWboR2-zK9AUH1cZPpVNFa4Gux-FGn4JxbQdpCo' }})
	.expectStatus(201)
	.toss()

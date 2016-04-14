/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var location = rewire('../modules/location.js')

frisby.create('get all location')
    .get('http://cortexapi.ddns.net:8080/api/getAllLocations',  {json: true})
    .expectStatus(201)
    .toss()

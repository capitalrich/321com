/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var authenticate = rewire('../modules/authenticate.js')

frisby.globalSetup({
	request: {
    headers: {'Authorization': 'Basic cGV0ZXJlOkNoYW5nZU1l','Content-Type': 'application/json'}
  }
})

	// == authenticate test ===
frisby.create('authentication check')
	.post('http://cortexapi.ddns.net:8080/api/authenticate', {"username":"petere", "password":"ChangeMe" }, {json: true})
	.expectStatus(201)
	.toss()

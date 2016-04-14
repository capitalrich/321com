/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var person = rewire('../modules/person.js')

// ========================= REWIRE TESTS =========================
// describe('Testing Theta API calls', function () {

// 	neo4j.__set__('getData', function(url, jsonFile) {
// 		const res = fs.readFileSync('spec/spec_data/' + jsonFile +'.json', 'utf8')
// 		json = JSON.parse(res.toString('utf8'))
// 		return json
// 	})

// 	it('Count amount of Theta appointments', function(done) {
// 		api.getThetaAll(function (json) {
// 			expect(json.Monday.length).toEqual(8)
// 		})
// 		done()
// 	})

// })

// ========================= FRISBY ACCEPTANCE TESTS =========================


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


	// === Post Method to Database test ===
frisby.create('posting user data to db')
	.post('http://cortexapi.ddns.net:8080/api/addNewPerson', {"name":"joe swole",
	"email": "joe.swole@uni.coventry.ac.uk",
	"skills":"gainz",
	"username":"swolej",
	"password": "password1",
	"lecturer":true }, {json: true}) // the following runs a post to the database and add in the data shown in {}.
	.expectStatus(201)
	.toss()


  // === Get Method from Database test ===
frisby.create('check that post was successful by pulling data with get method')
	.get('http://cortexapi.ddns.net:8080/api/lookUpPerson/joe.swole@uni.coventry.ac.uk')
	.expectStatus(201)
	.expectBodyContains('joe.swole@uni.coventry.ac.uk',
	'swolej',
	'joe swole')
	.toss()

  // === Get Method to Database test ===
frisby.create('bad check that post was successful by pulling data with get method')
	.get('http://cortexapi.ddns.net:8080/api/lookUpPerson/ryan.critchley@uni.coventry.ac.uk')
	.expectStatus(401)
	.toss()

frisby.create('Get user by username')
	.get('http://cortexapi.ddns.net:8080/api/lookUpPersonByUsername/markt')
	.expectStatus(201)
	.toss()

	// === Delete Method test ===
frisby.create('successfully remove data from db')
	.delete('http://cortexapi.ddns.net:8080/api/deletePerson/joe.swole@uni.coventry.ac.uk', {json: true})
	.expectStatus(201)
	.toss()

// 	  // === Get Method to Database test (bad test)===
frisby.create('check get method against bad data')
	.get('http://cortexapi.ddns.net:8080/api/lookUpPerson/ryan.critch@uni.coventry.ac.uk')
	.expectStatus(401)
	.toss()

frisby.create('delete user from db')
    .delete('http://cortexapi.ddns.net:8080/api/deletePerson/joe.swole@uni.coventry.ac.uk',  {json: true}, { headers: { 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiUGV0ZXIgRXZlcnkiLCJ1c2VybmFtZSI6InBldGVyZSIsImlhdCI6MTQ1Njk1Mjg4MiwiZXhwIjoxNDg4NDg4ODgyfQ._nsgjWboR2-zK9AUH1cZPpVNFa4Gux-FGn4JxbQdpCo' }})
    .expectStatus(201)
    .toss()


frisby.create('attempting to delete user from db that doesnt exist')
    .delete('http://cortexapi.ddns.net:8080/api/deletePerson/userthatdoesntexist@fake.ac.uk',  {json: true})
    .expectStatus(400)
    .toss()

// 	  // === Get Method ==
frisby.create('get all availability by person')
    .get('http://cortexapi.ddns.net:8080/api/getAvailabilityByPerson/ab4491@coventry.ac.uk',  {json: true})
    .expectStatus(201)
    .toss()

frisby.create('get all lecturers')
	  .get('http://cortexapi.ddns.net:8080/api/getAllLecturer',  {json: true})
	  .expectStatus(201)
	  .toss()

frisby.create('get all availability by person')
    .get('http://cortexapi.ddns.net:8080/api/getUserByName/Peter%20Every',  {json: true})
		.expectStatus(201)
		.toss()

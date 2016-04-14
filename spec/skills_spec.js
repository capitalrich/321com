/* jshint esnext: true, asi: true */

var fs = require('fs')
var rewire = require('rewire')
var frisby = require('frisby')
var api = require('../modules/api.js')
var skills = rewire('../modules/skills.js')

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

frisby.create('get person by skills')
		.get('http://cortexapi.ddns.net:8080/api/getPersonBySkill/Project%20Management',  {json: true})
		.expectStatus(201)
		.toss()

frisby.create('get all skills')
		.get('http://cortexapi.ddns.net:8080/api/getAllSkills',  {json: true})
		.expectStatus(201)
		.toss()

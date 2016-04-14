/* jshint esnext: true, asi: true */
var neo4j = require('node-neo4j')

var jwt = require('jsonwebtoken')

var serverProtocol = "http"
var serverURL =  "cortexapi.ddns.net"
var serverPort = "7474"

var Neo4jUsername = "neo4j"
var Neo4jPassword = "i7Tt3cFVMUNpT8Zfgu0aX5Zm67bb33IGTX9D" // TODO: bad practise!

var serverURI = serverProtocol+"://"+Neo4jUsername+":"+Neo4jPassword+"@"+serverURL+":"+serverPort

var superSecret = 'cortexapiisdabestinthewest';

// Create the neo4J object
var db = new neo4j(serverURI)


// ***************** SKILLS: METHODS FOR CREATING/MODIFYING/DELETING *****************

exports.getAllSkills = (callback) => {
  db.readNodesWithLabel('Skill', function (err, node) {
    if (err) {
				callback({code:401,status:'failed',message:'No skills found',data:''})
    }
			callback({code:201,status:'success',message:'skills found',data:node})
  })
}

// ***************** LOCATIONS: METHODS FOR CREATING/MODIFYING/DELETING *****************

exports.getAllLocations = (callback) => {
  db.readNodesWithLabel('Location', function (err, nodes) {

	if(err || nodes.length <= 0){
			callback({code:401,status:'failed',message:'No locations found',data:''})
	} else {
			var locations = [];
			for(var i=0; i<nodes.length ;i++) {
				locations.push({
					name: nodes[i].name,
				})
			}
				callback({code:201,status:'success',message: nodes.length+' locations found.',data:locations})
		}
	})
}

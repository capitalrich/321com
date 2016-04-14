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

exports.addPerson = (body, callback) => {

    if (body.skills) {
        var sentSkills = body.skills
    }else {
        var sentSkills  = []
    }

    const sentName = body.name
    const sentEmail = body.email
    const sentUsername = body.username
    const sentPassword = body.password
    const lecturerStatus = body.lecturer

    db.readNodesWithLabelsAndProperties('Person',{ email: sentEmail }, function (err, node) {
      if (err) {
        return console.log(err)
      }
      if (node.length > 0){
        // The user already exists
        callback({code:401,status:'failed',message:'Person already exsits with the name '+sentName,data:sentName})
      }
      else {
        // Insert new Person
        db.insertNode({
          name: sentName,
          email: sentEmail,
          skills: sentSkills,
          username: sentUsername,
          password: sentPassword,
          lecturer: lecturerStatus
      }, 'Person', function (err, node) {
        if (err) {
          return console.log(err)
        }
        // Output node data.
        callback({code:201,status:'success',message:'Person Added In '+sentName+' found...',data:node})
      })
      }
    })
}

exports.getPerson = (body, callback) => {
  const lookUpEmailLect = body
  db.readNodesWithLabelsAndProperties('Person',{ email: lookUpEmailLect }, function (err, node) {
    if (node == '') {
      callback({code:401,status:'failed',message:'Person not found '+lookUpEmailLect,data:lookUpEmailLect})
    }
    const foundPersonName = node[0].name
    const foundPersonEamil = node[0].email
    const foundPersonSkills  = node[0].skills
    callback({code:201,status:'success',message:'Person found',data:[foundPersonName, foundPersonEamil, foundPersonSkills]})
  })
}

exports.lookUpPersonByUsername = (body, callback) => {
  const lookUpUsername = body
  db.readNodesWithLabelsAndProperties('Person',{ username: lookUpUsername }, function (err, node) {
    if (node == '') {
      callback({code:401,status:'failed',message:'Person not found '+lookUpEmailLect,data:lookUpEmailLect})
    }
    const foundPersonName = node[0].name
    const foundPersonEamil = node[0].email
    const foundPersonSkills  = node[0].skills
    callback({code:201,status:'success',message:'Person found',data:[foundPersonName, foundPersonEamil, foundPersonSkills]})
  })
}

exports.getUserByName = (body, callback) => {
  const lookUpName = body
  db.readNodesWithLabelsAndProperties('Person',{ name: lookUpName }, function (err, node) {
    console.log(node)
    if (node == '') {
      callback({code:401,status:'failed',message:'Person not found '+lookUpName,data:lookUpName})
    }
    const foundPersonName = node[0].name
    const foundPersonEamil = node[0].email
    const foundPersonUsername  = node[0].username
    var object = {
      Name:foundPersonName,
      Email:foundPersonEamil,
      Username:foundPersonUsername
    }
    callback({code:201,status:'success',message:'Person found',data:object})
  })
}


exports.getAllLecturer = (callback) => {
  	db.cypherQuery("MATCH (p:Person)-[:knows]->(s:Skill) where p.lecturer = true return collect(s.name), p.name, p.email, p.username", function(err, nodes){
      console.log(nodes.data)
      if(nodes == ''){
        callback({code:401,status:'failed',message:'Lecturer not found',data:'null'})
      }
      callback({code:201,status:'success',message:'Lecturer found',data:nodes.data})
    })
}

exports.getPersonBySkill = (skill, callback) => {
	console.log(skill)
	db.cypherQuery("MATCH (p:Person)-[:knows]->(s:Skill{name:\""+skill+"\"}) return p", function(err, nodes){
			if(err || nodes.data.length <= 0){
				callback({code:401,status:'failed',message:'No users with this skill OR skill not found.',data:skill})
			} else {
					var persons = [];
					for(var i=0; i<nodes.data.length ;i++) {
						persons.push({name: nodes.data[i].name, email: nodes.data[i].email})
					}
			  	callback({code:201,status:'success',message:'People who know '+skill+' found...',data:persons})
				}
	})
}

exports.modifyPerson = (body, email, auth, callback) => {
  const lookUpEmail = email
  const sentName = body.name
  const sentEmail = body.email
  const sentPassword = body.password
  const lecturerStatus = body.lecturer
  jwt.verify(auth, superSecret, function (err, decoded) {
    if (err) {
      callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
    } else {
      db.updateNodesWithLabelsAndProperties(['Person'],{ email: lookUpEmail },
        { email: sentEmail,
          name: sentName,
          password: sentPassword,
          lecturer: lecturerStatus
        }, function (err, updatedNodes){

          if(err) throw err

          if(updatedNodes.length === 1){
            callback({code:201,status:'success',message:'person updated',data:updatedNodes})
        } else {
            callback({code:401,status:'failed',message:'user not found',data:lookUpEmail})
        }
      })
    }
  })
}

exports.deletePerson = (body, auth, callback) => {
  const lookUpEmail = body

  jwt.verify(auth, superSecret, function (err, decoded) {
    if (err) {
      callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
    } else {
      db.deleteNodesWithLabelsAndProperties('Person',{ email: lookUpEmail }, function (err, node) {
        if(err) throw err

        if(node === 1){
          callback({code:201,status:'success',message:'person deleted',data:lookUpEmail})
        } else {
          callback({code:401,status:'failed',message:'user not found',data:lookUpEmail})
        }
      })
    }
  })
}

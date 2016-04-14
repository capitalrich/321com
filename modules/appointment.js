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

// ***************** APPOINTMENT: METHODS FOR CREATING/MODIFYING/DELETING *****************

exports.getAvailabilityByPerson = (email, callback) => {
	db.cypherQuery("MATCH (p:Person{email:\""+email+"\"})-[:partakes_in]->(a:Appointment{bookable:true}) return a", function(err, nodes){
			if(err || nodes.data.length <= 0){
				callback({code:401,status:'failed',message:'No available appointments with this user OR no user found.',data:email})
			} else {
					var availability = []
					for(var i=0; i<nodes.data.length ;i++) {
						availability.push({
							name: nodes.data[i].name,
							short: nodes.data[i].short,
							notes: nodes.data[i].notes,
							date: nodes.data[i].date,
							timeStart: nodes.data[i].timeStart,
							timeEnd: nodes.data[i].timeStop,
							recurringWeekly: nodes.data[i].recurringWeekly
						})
					}
			  	callback({code:201,status:'success',message:'Appointments that include '+email+' found...',data:availability})
				}
	})
}

exports.getPersonalAppointments = (email, auth, callback) => {
  console.log(email)
    jwt.verify(auth, superSecret, function (err, decoded) {
      if (err) {
        callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
      } else {
        db.cypherQuery("MATCH (p:Person{email:\""+email+"\"})-[:partakes_in]->(a:Appointment) return a", function(err, nodes){
          console.log('node')
            if(err || nodes.data.length <= 0){
              callback({code:401,status:'failed',message:'No available appointments.',data:email})
            } else {
                var availability = [];
                for(var i=0; i<nodes.data.length ;i++) {
                  availability.push({
                    name: nodes.data[i].name,
                    short: nodes.data[i].short,
                    notes: nodes.data[i].notes,
                    date: nodes.data[i].date,
                    timeStart: nodes.data[i].timeStart,
                    timeStop: nodes.data[i].timeStop,
                    recurringWeekly: nodes.data[i].recurringWeekly
                  })
                }
                console.log(nodes)
                callback({code:201,status:'success',message:'Appointments that include '+email+' found...',data:availability})
              }
        })
      }
  })
}


exports.addNewAppointment = (body, auth, callback) => {

  const sentTitle = body.title
  const sentStartTime = body.startTime
  const sentEndTime = body.endTime
  const sentDate = body.date
  var sentParticipants = body.participants
  const sentBookable = body.bookable
  const sentLocation = body.location
  const sentReocurrance = body.recurrence
  const sentNotes = body.notes
  const sentParentApp = body.parentApp
  console.log(sentParticipants)

  jwt.verify(auth, superSecret, function (err, decoded) {
    if (err) {
      callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
    } else {
      db.insertNode({
            name: sentTitle,
            startTime: sentStartTime,
            endTime: sentEndTime,
            date: sentDate,
            participants: sentParticipants,
            bookable: sentBookable,
            location: sentLocation,
            recurrence: sentReocurrance,
            notes: sentNotes,
            parentApp: sentParentApp
          }, 'Appointment', function (err, node) {
            if (err) {
              return console.log(err)
            }

            for (var i = 0; i < node.participants.length; i++) {
              console.log(i)
              db.readNodesWithLabelsAndProperties('Person',{ username: node.participants[i] }, function (err, personNode) {
                if (err) {
                  return console.log(err)
                }

                db.insertRelationship(personNode[0]._id, node._id, 'partakes_in', {

                  }, function(err, relationship){
                      if(err) throw err;
                })
              })
            }

            db.readNodesWithLabelsAndProperties('Location',{ name: node.location }, function (err, locationNode) {
              if (err) {
                return console.log(err)
              }
              db.insertRelationship(node._id, locationNode[0]._id, 'takes_place_in', {
                }, function(err, relationship){
                    if(err) throw err;
              })
            })

            db.readNode(node.parentApp, function(err, parentNode){
              if(err) {
                console.log('error');
              }
              db.insertRelationship(node._id, parentNode._id, 'parent_node', {
                }, function(err, relationship){
                    if(err) throw err;
              })
            })
            callback({code:201,status:'success',message:'added new appointment',data:node})
          })
    }
})

}

exports.modifyAppointment = (appointmentId, body, callback) => {
  const sentTitle = body.title
  const sentStartTime = body.startTime
  const sentEndTime = body.endTime
  const sentDate = body.date
  var sentParticipants = body.participants
  const sentBookable = body.bookable
  const sentLocation = body.location
  const sentReocurrance = body.recurrence
  const sentNotes = body.notes
  const sentParentApp = body.parentApp

  jwt.verify(auth, superSecret, function (err, decoded) {
    if (err) {
      callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
    } else {
      db.updateNode(appointmentId, {
        name: sentTitle,
        startTime: sentStartTime,
        endTime: sentEndTime,
        date: sentDate,
        participants: sentParticipants,
        bookable: sentBookable,
        location: sentLocation,
        recurrence: sentReocurrance,
        notes: sentNotes,
        parentApp: sentParentApp
      }, function(err, node) {
          if(err) throw err

          if (node === true) {

            // delete each relationship attached to the node
            db.readRelationshipsOfNode(appointmentId, {
            }, function(err, relationships) {
              if (err) throw err
              for (var i = 0; i < relationships.length; i++) {
                db.deleteRelationship(relationships[i]._id, function(err, relationship){
                    if(err) throw err;

                    if (relationship === true){
                        console.log('deleted relationship: '+relationships[i]._id)
                    } else {
                        console.log('could not delete relationship')
                    }
                })
              }
            })

            // attach new relationship for each new participant
            for (var i = 0; i < sentParticipants.length; i++) {
              db.readNodesWithLabelsAndProperties('Person',{ username: sentParticipants[i] }, function (err, personNode) {
                if (err) {
                  return console.log(err)
                }

                db.insertRelationship(personNode[0]._id, appointmentId, 'partakes_in', {
                  }, function(err, relationship){
                    if(err) throw err;
                    console.log('added new relationship');
                })
              })
            }

            // add relationship for new location
            db.readNodesWithLabelsAndProperties('Location',{ name: sentLocation }, function (err, locationNode) {
              if (err) {
                return console.log(err)
              }
              db.insertRelationship(appointmentId, locationNode[0]._id, 'takes_place_in', {
                }, function(err, relationship){
                    if(err) throw err;
              })
            })

            // add relationship for new parent appointment
            db.readNode(sentParentApp, function(err, parentNode){
              if(err) {
                console.log('error');
              }
              db.insertRelationship(appointmentId, parentNode._id, 'parent_node', {
                }, function(err, relationship){
                    if(err) throw err;
              })
            })
            callback({code:201,status:'success',message:'appointment modified',data:node})

          } else {
            callback({code:401,status:'fail',message:'Did not modify appointment',data:'Unsuccessful'})
          }
      })
    }
  })
}


exports.deleteAppointment = (body, callback) => {
  const appointmentId = body

  db.cypherQuery("MATCH (p:Appointment) where ID(p)="+appointmentId+" OPTIONAL MATCH (p)-[r]-() DELETE r,p", function(err, result){
      if(err) throw err;
      callback({code:201,status:'success',message:'Deleted appointment',data:'Appointment'})
  });

}

exports.modifyAppointmentByTitle = (title, body, callback) => {
  const sentTitle = body.title
  const sentStartTime = body.startTime
  const sentEndTime = body.endTime
  const sentDate = body.date
  var sentParticipants = body.participants
  const sentBookable = body.bookable
  const sentLocation = body.location
  const sentReocurrance = body.recurrence
  const sentNotes = body.notes
  const sentParentApp = body.parentApp

  db.updateNode(title, {
    name: sentTitle,
    startTime: sentStartTime,
    endTime: sentEndTime,
    date: sentDate,
    participants: sentParticipants,
    bookable: sentBookable,
    location: sentLocation,
    recurrence: sentReocurrance,
    notes: sentNotes,
    parentApp: sentParentApp
  }, function(err, node) {
      if(err) throw err

      if (node === true) {

        // delete each relationship attached to the node
        db.readRelationshipsOfNode(title, {
        }, function(err, relationships) {
          if (err) throw err
          for (var i = 0; i < relationships.length; i++) {
            db.deleteRelationship(relationships[i]._id, function(err, relationship){
                if(err) throw err;

                if (relationship === true){
                    console.log('deleted relationship: '+relationships[i]._id)
                } else {
                    console.log('could not delete relationship')
                }
            })
          }
        })

        // attach new relationship for each new participant
        for (var i = 0; i < sentParticipants.length; i++) {
          db.readNodesWithLabelsAndProperties('Person',{ username: sentParticipants[i] }, function (err, personNode) {
            if (err) {
              return console.log(err)
            }

            db.insertRelationship(personNode[0]._id, title, 'partakes_in', {
              }, function(err, relationship){
                if(err) throw err;
                console.log('added new relationship');
            })
          })
        }

        // add relationship for new location
        db.readNodesWithLabelsAndProperties('Location',{ name: sentLocation }, function (err, locationNode) {
          if (err) {
            return console.log(err)
          }
          db.insertRelationship(title, locationNode[0]._id, 'takes_place_in', {
            }, function(err, relationship){
                if(err) throw err;
          })
        })

        // add relationship for new parent appointment
        db.readNode(sentParentApp, function(err, parentNode){
          if(err) {
            console.log('error');
          }
          db.insertRelationship(title, parentNode._id, 'parent_node', {
            }, function(err, relationship){
                if(err) throw err;
          })
        })

        callback({code: 201, status:'success', message:'appointment modified', data: node })

      } else {
        callback({code:401,status:'fail',message:'Did not modify appointment',data:'Unsuccessful'})
      }
  })
}

exports.deleteAppointmentByTitle = (body, callback) => {
  const title = body
  console.log('neo4j')
  console.log(title)
  db.cypherQuery("MATCH (p:Appointment)where p.name=\""+title+"\" DETACH DELETE p", function(err, result){
      if(err) throw err;
      callback({code:201,status:'success',message:'Deleted appointment',data:'Appointment'})
  });

}

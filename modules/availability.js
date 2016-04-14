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

exports.addNewAvailability = (body, auth, callback) => {

  const sentTitle = body.name
  const sentStartTime = body.timeStart
  const sentEndTime = body.timeStop
  const sentDate = body.date
  const sentNotes = body.notes
  const sentRecurring = body.recurringWeekly
  const sentBookable = body.bookable
  const sentUsername = body.username

  jwt.verify(auth, superSecret, function (err, decoded) {
    if (err) {
      callback({code:401,status:'failed',message:'invalid authorization token',data:auth})
    } else {
      db.insertNode({
            name: sentTitle,
            timeStart: sentStartTime,
            timeStop: sentEndTime,
            date: sentDate,
            notes: sentNotes,
            recurringWeekly: sentRecurring,
            bookable: sentBookable
          }, 'Appointment', function (err, node) {
            if (err) {
              callback({code:401,status:'failed',message:'Failed to create availability',data:email})
            }
            db.readNodesWithLabelsAndProperties('Person',{ username: sentUsername }, function (err, personNode) {
              db.insertRelationship(personNode[0]._id, node._id, 'takes_place_in', {
                }, function(err, relationship){
                    if(err) throw err;
              })
            })
            callback({code:201,status:'success',message:'Availability created for '+sentUsername,data:node})
        })
    }
  })
}

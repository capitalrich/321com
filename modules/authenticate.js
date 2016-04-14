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

exports.authenticate = (auth, body, callback) => {
  // find the node
  console.log(auth)
  const lookUpUsername = auth.basic.username
  db.readNodesWithLabelsAndProperties('Person' ,{ username: lookUpUsername }, function(err, node) {
    if (err) throw err
    console.log(node)
    if (node == '') {
      callback({code:401,status:'failed',message:'Authentication failed. User not found.',data:lookUpUsername})
    } else if (node) {
      // check if password matches
      if (node[0].password != auth.basic.password) {
        callback({code:403,status:'failed',message:'Authentication failed. Wrong password.',data:lookUpUsername})
      } else {

        // if node is found and password is right
        var token = jwt.sign({
            name: node[0].name,
            username: node[0].username
        }, superSecret, {
            expiresInMinutes: 1440 // expires after 24 hours
        })

        // return the information including token as JSON
        callback({code:201,status:'success',message:'Enjoy your token!',data:token})
      }

    }

  })
}

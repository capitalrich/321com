/* jshint esnext: true, asi: true */

var express = require('express')
var mustache = require('mustache-express')
var bodyParser = require('body-parser')


var api = require('./modules/api.js')
var neo4j = require('./modules/neo4j.js')

var server = express()
server.engine('mustache', mustache())
server.set('view engine', 'mustache')
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


//server.use(express.static(path.join(__dirname, 'views')));

//server.set('views', path.join(__dirname+ 'views'))
//server.set('views', __dirname + '/views')

/***
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.use(restify.CORS())

server.opts(/.*//***, (req,res,next) => {
   res.header("Access-Control-Allow-Origin", "*")
   res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"))
   res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"))
   res.send(200)
   return next()
})
***/

//Redirect Function
server.get('/', function(req, res, next) {
  res.redirect('/home')
})

server.get('/api', function(req, res){
  api.redirect(node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

// ***************** AUTHENTICATE: METHOD FOR AUTHENTICATING *****************

server.post('/api/authenticate', (req, res) => {
  const body = req.body
  const auth = req.authorization
  api.authenticate(auth, body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})


server.get('/api/home', (req, res) => {
  api.getAllSkills( node => {
    res.setHeader('content-type', 'text/html')
    res.end('<h1>'+node.data[0].name+'</h1>')
  })
})

/** API OBJECTS **/
api.getAllSkills( node => {
  skills = node.data;
})


api.getAllLocations( node => {
    locations = node.data;
  })



server.get('/home', (req, res) => {
    res.render('index', {
      skills: skills,
      locations: locations
    })
  }) 

server.get('/result', (req, res) => {
  //console.log(personBySkill)
    res.render('result', {
      person: personBySkill
    })
  }) 

server.post('/yo', (req,res) => {
  //res.setHeader('content-type', node.contentType)
  if (req.body.lecturer == 'true')
            {
              req.body.lecturer = true
            }
            else {
              req.body.lecturer = false
            }
  console.log(req.body);
  res.end('thanks')

})

// ***************** SKILLS *****************

//Get all skills that the sysmtems knows of
server.get('/api/getAllSkills', (req, res) => {
  api.getAllSkills( node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.data)
    res.end()
  })
})


// ***************** ROOMS *****************

//Get all rooms that the sysmtems knows of
server.get('/api/getAllLocations', (req, res) => {
  api.getAllLocations( node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})


// ***************** PERSON: METHODS FOR CREATING/MODIFYING/DELETING *****************
//Get method to look up all lecturers
server.get('/api/getAllLecturer', (req, res) => {
  api.getAllLecturer(node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

//Get method to look up a person
server.get('/api/lookUpPerson/:email', (req, res) => {
  const body = req.params.email
  api.lookUpPerson(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
    console.log(node)
  })
})

//Get method to look up a person
server.get('/api/lookUpPersonByUsername/:username', (req, res) => {
  const body = req.params.username
  api.lookUpPersonByUsername(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

server.get('/api/getUserByName/:Name', (req, res) => {
  const body = req.params.Name
  console.log(body)
  api.getUserByName(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

// *****************Get method to look up perople by a skill they posess*****************
server.get('/api/getPersonBySkill/:skill', (req, res) => {
  const skill = req.params.skill
  api.getPersonBySkill(skill, node => {
    // res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
    personBySkill = node.response.data
  })
})


server.put('/api/modifyPerson/:email', (req, res) => {
  const body = req.body
  const email = req.params.email
  const auth = req.headers.token
  api.modifyPerson(body, email, auth, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

server.del('/api/deletePerson/:email', (req, res) => {
  const body = req.params.email
  const auth = req.headers.token
  api.deletePerson(body, auth, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

// *****************Post to add in new person*****************
server.post('/api/addNewPerson', (req, res) => {
  if (req.body.lecturer == 'true')
            {
              req.body.lecturer = true
            }
            else {
              req.body.lecturer = false
            }
  const body = req.body
  api.addNewPerson(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

// ***************** APPOINTMENT: METHODS FOR CREATING/MODIFYING/DELETING *****************

server.get('/api/getAvailabilityByPerson/:email',(req, res) => {
  	const email = req.params.email
	  api.getAvailabilityByPerson(email, node => {
	    res.setHeader('content-type', node.contentType)
	    res.send(node.code, node.response)
	    res.end()
	  })
})

server.get('/api/getPersonalAppointments/:email',(req, res) => {
  	const email = req.params.email
    const auth = req.headers.token
	  api.getPersonalAppointments(email, auth, node => {
	    res.setHeader('content-type', node.contentType)
	    res.send(node.code, node.response)
	    res.end()
	  })
})

server.post('/api/addNewAppointment', (req,res) => {
  const body = req.body
  const auth = req.headers.token
  api.addNewAppointment(body, auth, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

server.put('/api/modifyAppointment/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId
  const body = req.body

  console.log('modify appointment')
  api.modifyAppointment(appointmentId, body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

server.del('/api/deleteAppointment/:appointmentId', (req, res) => {
  const body = req.params.appointmentId
  console.log('delete appointment')
  console.log(body)
  api.deleteAppointment(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

//===== modify and delete appointment by title =====
server.put('/api/modifyAppointment/:title', (req, res) => {
  const title = req.params.title
  const body = req.body
  api.modifyAppointmentByTitle(title, body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

server.del('/api/deleteAppointmentByTitle/:title', (req, res) => {
  const body = req.params.title
  console.log('delete appointment by title')
  console.log(body)
  api.deleteAppointmentByTitle(body, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})


// ***************** AVAILABILITY: METHODS FOR CREATING/MODIFYING/DELETING *****************
server.post('/api/addNewAvailability', (req,res) => {
  const body = req.body
  const auth = req.headers.token
  api.addNewAvailability(body, auth, node => {
    res.setHeader('content-type', node.contentType)
    res.send(node.code, node.response)
    res.end()
  })
})

// *****************Defines the port and starts the api *****************
var port = process.env.PORT || 8080
server.listen(port, (err) => {
  if (err) {
      console.error(err)
  } else {
    console.log('API is ready at : ' + port)
  }
})

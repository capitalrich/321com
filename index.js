/**

 * Author:        Femi Adeniyi

 * Description:   
   Configuring server to work with existing API to 
   send, receive and manipulate data across
   
 **/


/* jshint esnext: true, asi: true */

// Required Moduless
var express = require('express')
var mustache = require('mustache-express')
var bodyParser = require('body-parser')
var api = require('./modules/api.js')
var neo4j = require('./modules/neo4j.js')

// Initialize server instance
var server = express()

// Set server parametres
server.engine('mustache', mustache())
server.set('view engine', 'mustache')
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));




//Redirect Function
server.get('/', function(req, res, next) {
  res.redirect('/home')
})


/** API OBJECTS **/
api.getAllSkills( node => {
  skills = node.data;
})
api.getAllLocations( node => {
    locations = node.data;
  })


// ROUTES

/*  When the urls below are requested,
    the render function displays the html page,
    and also passes objects to the page
*/
server.get('/home', (req, res) => {
    res.render('index', {
      skills: skills,
      locations: locations
    })
  }) 

server.get('/result', (req, res) => {
    res.render('result', {
      person: personBySkill
    })
  }) 



// *****************Get method to look up perople by a skill they posess*****************

/*  When the url below is requested,
    it stores the ':skill' input in the variable skill,
    through the api method, queries the database using skill value,
    store query result in personBySKill variable
*/
server.get('/api/getPersonBySkill/:skill', (req, res) => {
  const skill = req.params.skill
  api.getPersonBySkill(skill, node => {
    res.send(node.code, node.response)
    res.end()
    personBySkill = node.response.data // 
  })
})

// *****************Post to add in new person*****************

/*  When the url below is requested (a POST request),
    it checkes lecturer (bool) value in the body,
    assigns bool value based on evaluation converting from string,
    through the API creates a new person in the database
*/
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



// *****************Defines the port and starts the api *****************
var port = process.env.PORT || 8080
server.listen(port, (err) => {
  if (err) {
      console.error(err)
  } else {
    console.log('API is ready at : ' + port)
  }
})

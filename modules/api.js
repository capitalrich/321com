/* jshint esnext: true, asi: true */

var jwt = require('jsonwebtoken')
var authenticateModule = require('./authenticate.js')
var personModule = require('./person.js')
var appointmentModule = require('./appointment.js')
var availabilityModule = require('./availability.js')
var skillsModule = require('./skills.js')
var locationModule = require('./location.js')

// ***************** RESPONSE CREATION HELPER *****************

responseHelper = (data) =>{
  var response = {code:data.code, contentType:'application/json', response:{status:data.status, message:data.message, data:data.data}}
  if(data !== null || data !== undefined){
    response.data = data.data
  }
  return response
}

// ***************** Redirect *****************

exports.redirect = (callback) => {
  var data = {code:201, status:'success', message:'Welcome to Cortex', data:'null'}
  callback(responseHelper(data))
}

// ***************** AUTHENTICATE: METHODS FOR AUTHENTICATING *****************

exports.authenticate = (auth, body, callback) => {
    authenticateModule.authenticate(auth, body, data => {
      callback(responseHelper(data))
    })
}

// ***************** SKILLS: METHODS FOR GET/CREATING/MODIFYING/DELETING *****************

exports.getAllSkills = (callback) => {
    skillsModule.getAllSkills(data => {
	    callback(responseHelper(data))
    })
}

// ***************** LOCATIONS: METHODS FOR GET/CREATING/MODIFYING/DELETING *****************

exports.getAllLocations = (callback) => {
    locationModule.getAllLocations(data => {
	    callback(responseHelper(data))
    })
}

// ***************** PERSON: METHODS FOR GET/CREATING/MODIFYING/DELETING *****************
exports.getAllLecturer = (callback) => {
    personModule.getAllLecturer(data => {
      callback(responseHelper(data))
    })
}

exports.lookUpPerson = (body, callback) => {
    personModule.getPerson(body, data => {
      callback(responseHelper(data))
    })
}

exports.lookUpPersonByUsername = (body, callback) => {
    personModule.lookUpPersonByUsername(body, data => {
      callback(responseHelper(data))
    })
}

exports.getUserByName = (body, callback) => {
    personModule.getUserByName(body, data => {
      callback(responseHelper(data))
    })
}

exports.getPersonBySkill = (skill, callback) => {
    personModule.getPersonBySkill(skill, data => {
			callback(responseHelper(data))
    })
}

exports.addNewPerson = (body, callback) => {
    personModule.addPerson(body, data => {
      callback(responseHelper(data))
    })
}

exports.modifyPerson = (body, email, auth, callback) => {
  personModule.modifyPerson(body, email, auth, data => {
    callback(responseHelper(data))
  })
}

exports.deletePerson = (body, auth, callback) => {
  personModule.deletePerson(body, auth, data => {
    callback(responseHelper(data))
  })
}

// ***************** APPOINTMENT: METHODS FOR GET/CREATING/MODIFYING/DELETING *****************

exports.getAvailabilityByPerson = (email, callback) => {
    appointmentModule.getAvailabilityByPerson(email, data => {
			callback(responseHelper(data))
    })
}

exports.getPersonalAppointments = (email, auth, callback) => {
    appointmentModule.getPersonalAppointments(email, auth, data => {
			callback(responseHelper(data))
    })
}

exports.addNewAppointment = (body, auth, callback) => {
    appointmentModule.addNewAppointment(body, auth, data => {
      callback(responseHelper(data))
    })
}

exports.modifyAppointment = (appointmentId, body, callback) => {
    appointmentModule.modifyAppointment(appointmentId, body, data => {
      callback(responseHelper(data))
    })
}

exports.deleteAppointment = (body, callback) => {
  appointmentModule.deleteAppointment(body, data => {
    console.log('apijs')
    callback(responseHelper(data))
  })
}

exports.modifyAppointmentByTitle = (title, body, callback) => {
    appointmentModule.modifyAppointmentByTitle(title, body, data => {
      callback(responseHelper(data))
    })
}

exports.deleteAppointmentByTitle = (body, callback) => {
  appointmentModule.deleteAppointmentByTitle(body, data => {
    console.log('apijs')
    callback(responseHelper(data))
  })
}

// ***************** Availability: METHODS FOR CREATING/MODIFYING/DELETING *****************
exports.addNewAvailability = (body, auth, callback) => {
    availabilityModule.addNewAvailability(body, auth, data => {
			callback(responseHelper(data))
    })
}

```
  ____           _            
 / ___|___  _ __| |_ _____  __
| |   / _ \| '__| __/ _ \ \/ /
| |__| (_) | |  | ||  __/>  <
 \____\___/|_|   \__\___/_/\_\
```

A NodeJS based API for the 321COM module assignment, started in January 2016 that allows other groups to grab Application Data from within their client straight from an online, REST conform source.

Usage Documentation
===================

Usage
-----

Send all data requests to:

```
http://cortexapi.ddns.net:8080/api
```

API specification
-----------------

### GET methods

| Parameter                             | Required | Valid Options                  | Default Value | Description                                                                                                                                                                   |
|---------------------------------------|----------|--------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /api/getAllSkills                     | \-       |                                | empty         | Returns all Skills that are known to the database.                                                                                                                            |
| /api/getAllLocations                  | \-       |                                | empty         | Returns all Locations that are known to the database.                                                                                                                         |
| /api/lookUpPerson/:email              | \-       |                                | empty         | Returns a Person by their email address                                                                                                                                       |
| /api/getPersonBySkill/:skill          |          | Any Skill that's in the system | empty         | Returns all the people who posess the skill you sent. If you don't have the list of available skills you can call /api/getAllSkills. Non existing skills will not be created. |
| /api/getAvailabilityByPerson/:email   | \-       |                                | empty         | Returns all Available timeslots for a Person.                                                                                                                                 |
| /api/getPersonalAppointments/:email   | \-       | User email required            | empty         | Returns all Person Appointments timeslots for a Person. Also required is the auth token which is required in the header                                                       |
|                                       |          |                                |               |                                                                                                                                                                               |
| /api/getAllLecturer                   | \-       |                                | empty         | Returns all lecturers                                                                                                                                                         |
|                                       |          |                                |               |                                                                                                                                                                               |
| /api/lookUpPerson/:email              | \-       |                                | empty         | Returns a Person by their email address                                                                                                                                       |
| /api/lookUpPersonByUsername/:username | \-       |                                | empty         | Returns a Person by their username address                                                                                                                                    |
| /api/getPersonBySkill/:skill          |          | Any Skill that's in the system | empty         | Returns all the people who posess the skill you sent. If you don't have the list of available skills you can call /api/getAllSkills. Non existing skills will not be created. |
| /api/getAvailabilityByPerson/:email   | \-       |                                | empty         | Returns all Available timeslots for a Person.                                                                                                                                 |
| /api/getPersonalAppointments/:email   | \-       | User email required            | empty         | Returns all Person Appointments timeslots for a Person. Also required is the auth token which is required in the header                                                       |
|                                       |          |                                |               |                                                                                                                                                                               |
| /api/getAllLecturer                   | \-       |                                | empty         | Returns all lecturers                                                                                                                                                         |
|                                       |          |                                |               |                                                                                                                                                                               |
| /api/getUserByName/:Name              | \-       |                                | empty         | Returns a Person by their Name address                                                                                                                                        |
|                                       |          |                                |               |                                                                                                                                                                               |

### POST methods

| Parameter               | Required | Valid Options                                                                                                                                                                                                          | Default Value | Requires Authentication | Description                                                                                                                                                                                                   |
|-------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /api/addNewPerson       | required | name (string), email (string), username (string), password (string), skills (array), lecturer (bool)                                                                                                                   | empty         | false                   | The post allows for a lecturer to register to the site using the options given, all data is accepted in only JSON format. For now setting up an account as a lecturer can just be don on signup without auth. |
| /api/authenticate       | required | username (string), password (string)                                                                                                                                                                                   | empty         | false                   | This post allows for authentication to be used, allowing for log in features to be implemented for clients.                                                                                                   |
| /api/addNewAppointment  | required | title (string), endTime (string) (format: HHMM, 24HR clock), date (string) (format: HHMM, 24HR clock), participants (array), bookable (bool), location (string), recurrence (boolean), notes (string), parentApp (int) | none          | true                    | Book part of an Availability.                                                                                                                                                                                 |
| /api/addNewAvailability | required | name (string), timeStart (string), timeStop (string), date (string), notes (string), recurringWeekly (bool), bookable (bool), username (string)                                                                        | empty         | true                    | The post allows users to add in new availability. Authentication is required, must be sent in the header under token.                                                                                         |

### PUT methods

| Parameter                             | Required | Valid Options                                                                                                                                                                                                                                       | Default Value | Needs Authentication | Description                                                                                                                                                                                                                                                                                                                                                                  |
|---------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /api/modifyAppointment/:appointmentId | required | title (string), endTime (string) (format: HHMM, 24HR clock), date (string) (format: HHMM, 24HR clock), participants (array of usernames), bookable (bool), location (string), recurrence (boolean), title (string), notes (string), parentApp (int) | none          | true                 | Put allows you to modify an existing appointment. The start and end time must be sent in specified format (HHMM) in 24hr clock format e.g 1530. The put function will modify the appointment node and delete/recreate any existing relationships. The array of participants sent must be their usernames, Authentication is required, must be sent in the header under token |
| /api/modifyPerson/:email              | required | email (string), name(string), password (string), lecturer(bool)                                                                                                                                                                                     | none          | true                 | This PUT method allows you to modify user properties and all data should be sent in JSON format. Currently does not require authentication but will be implemented soon. Authentication is required, must be sent in the header under token.                                                                                                                                 |

### DELETE methods

| Parameter                            | Required | Valid Options  | Default Value | Needs Authentication | Description                                                                                |
|--------------------------------------|----------|----------------|---------------|----------------------|--------------------------------------------------------------------------------------------|
| api/deletePerson/:email              | required | email (string) | none          | true                 | Delete an account of a user by using the email of the user                                 |
| api/deleteAppointment/:appointmentId | required | id (string)    | none          | true                 | Delete a person appointment, the id of the appointment is required as well as authenticate |

Example Requests
----------------

<!-- YouTube video using Postman-->

Not (yet) available.

Developer information
=====================

Install
-------

-	Git clone this repository to the source directory on your server.
-	run "npm install" to get all
-	Install Neo4j
-	Modify the connection information for Neo4j in neo4j.src/modules/js
-	Forward port 8080 if your server is behind a PAT

Start/Debug
-----------

Run node index.js to start the server. It will run until aborted using Ctrl+C or kill the super thread. Alternatively you can use the node package nodemon during debuging and development to automatically restart the server on changes.

You can run testing suits using the scripts in /sh.

Components
----------

All modules are contained in the modules/ directory.

### api

Controller to wrap and forward api calls to the neo4j module.

### neo4j

Database handler that connects to neo4j and processes api calls that require data from neo4j.

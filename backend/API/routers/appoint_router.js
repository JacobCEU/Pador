const express = require('express')
const appointController = require('../controllers/appoint_controller')
const appointRouter = express.Router()

appointRouter.post('/bookAppointment', appointController.bookAppointment)
appointRouter.get('/appointment', appointController.viewAppointmentByID)
appointRouter.get('/searchAppointment', appointController.searchRef);


module.exports = appointRouter
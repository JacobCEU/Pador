const express = require('express')
const appointController = require('../controllers/appoint_controller')
const appointRouter = express.Router()

appointRouter.post('/bookAppointment', appointController.bookAppointment)
appointRouter.post('/appointment', appointController.viewAppointmentByID)
appointRouter.get('/searchAppointment/:ref_no/:contact_no', appointController.searchRef);


module.exports = appointRouter
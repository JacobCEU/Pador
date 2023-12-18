const express = require('express')
const adminController = require('../controllers/admin_controller')
const adminRouter = express.Router()

adminRouter.post('/adminLogin', adminController.adminLogin)
adminRouter.post('/addAdmin', adminController.addAdmin)
adminRouter.get('/viewToday', adminController.viewToday)
adminRouter.get('/viewAll', adminController.viewAll)
adminRouter.get('/countAppointments', adminController.countAppointmentsByStatus);
adminRouter.put('/finish/:ref_no', adminController.finishAppointment);

// For Details and Cancel/Delete buttons
adminRouter.get('/viewSelected/:ref_no', adminController.viewSelected)
adminRouter.delete('/cancelAppointment/:ref_no', adminController.cancelAppointment)

module.exports = adminRouter
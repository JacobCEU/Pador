const express = require('express');
const paymentController = require('../controllers/payment_controller');
const paymentRouter = express.Router();

// Note: Changed the variable name to paymentRouter
paymentRouter.post('/payment', paymentController.paycard);

module.exports = paymentRouter;
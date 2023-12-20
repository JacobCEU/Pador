const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./API/models/con_db');

// Note: The following line was missing in your code
const paymentRouter = require('./API/routers/payment_router');

db.connectDB();

// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routers setup
let appointRouter = require('./API/routers/appoint_router');
let adminRouter = require('./API/routers/admin_router');

// Use routers
app.use('/appoint', appointRouter);
app.use('/admin', adminRouter);
app.use('/payment', paymentRouter); // Note: Added the payment router

// Error middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

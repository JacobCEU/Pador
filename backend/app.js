const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./API/models/con_db')
db.connectDB()

let appointRouter = require('./API/routers/appoint_router');
let adminRouter = require('./API/routers/admin_router');
//LIST OF ALL DEPENDENCIES: END

//DEPENDENCY MIDDLEWARES: START
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//DEPENDENCY MIDDLEWARES: END

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use('/appoint', appointRouter)
app.use('/admin', adminRouter)
// app.use('/sections', sectionRouter)

//ERROR MIDDLEWARE : START
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
}); //this code handles requests from unknown endpoints

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
    error:{
    message: error.message
}
})
});

module.exports = app;

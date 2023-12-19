const mysql = require('mysql')


const database =mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "pador_db",
    port: 3307
})

const connectDB = ()=>{
    database.connect((error)=>{
        if (error){
            console.log("error connecting to Database")
        }
        else {
            console.log("Successfully connected to the database.")
        }
    })
}

module.exports = {
    database,
    connectDB
}

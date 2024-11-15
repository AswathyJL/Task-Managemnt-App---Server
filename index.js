
require('dotenv').config()
const express = require('express')
const cors = require('cors')

// creating server
taskServer = express()

// enable datasharing
taskServer.use(cors())
// parse data from client request
taskServer.use(express.json())
// import router
const router = require('./routes/router')
// import connection.js file
require('./database/dbConnection')
// port creation 
const PORT = 3000 || process.env.PORT

// run server in specified port
pfServer.listen(PORT,()=>{
    console.log(`pfServer started at port ${PORT} and waiting for client request !!!`);
    })

// resolving get request
pfServer.get('/',(req,res)=>{
    // using response object share server response to client
    res.status(200).send(`<h1 style="color:green;">pfServer Started at port and waiting for client request!!!</h1>`)
})


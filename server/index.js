const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = require('./config/database')
const port = process.env.port || 3000

require('dotenv').config({path: './config/.env'})
connectDB()

app.set('view engine','ejs')
app.use(express.static('../client/public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.listen(port, () => console.log(`listening for requests on ${port}...`))
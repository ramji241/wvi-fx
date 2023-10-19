const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
const connectDB = require('./config/database')
const port = process.env.port || 3001

require('dotenv').config({path: './config/.env'})
connectDB()

app.use(express.static(path.resolve(__dirname, '../client/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/api', (req, res) => res.json({message: 'Hello from server!'}))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/public', 'index.html')))

app.listen(port, () => console.log(`Server listening on ${port}...`))
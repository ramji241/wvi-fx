const express = require('express')
const app = express()
const mongoose = require('mongoose')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
// const passport = require('passport')
// const flash = require('express-flash')
// const logger = require('morgan')
const connectDB = require('./config/database')
const port = process.env.port || 3000

require('dotenv').config({path: './config/.env'})
connectDB()

const mainRoutes = require('./routes/main')

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
// app.use(logger('dev'))
// app.use(flash())
// app.use(
//     session({
//       secret: 'keyboard cat',
//       resave: false,
//       saveUninitialized: false,
//       store: new MongoDBStore({ mongooseConnection: mongoose.connection }),
//     })
//   )
// app.use(passport.initialize())
// app.use(passport.session())

app.use('/', mainRoutes)

app.listen(port, () => console.log(`listening for requests on ${port}...`))
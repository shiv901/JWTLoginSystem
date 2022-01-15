const express = require('express')
const sql = require('mysql')
const env = require('dotenv')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const {checkAuth} = require('./auth/auth')

const app = express()

env.config({path: './.env'})

const db = sql.createConnection({
  host: process.env.ENVIRONMENT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})
db.connect(err=>{
  err ? console.log(err) : console.log('Connected to Server...')
})
app.listen(process.env.PORT, ()=>{
  console.log('Server Started on port : ' + process.env.PORT)
})


// Body Parser
app.use(express.urlencoded({extended: false}))
// Accept JSON data
app.use(express.json())
// Session
app.use(session({
  secret:"secret",
  resave: true,
  httpOnly: false,
  saveUninitialized: true
}))
// flash
app.use(flash())
// CookieParser
app.use(cookieParser())


app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})


app.set('view engine', 'hbs')
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + './views/partials');

// Routers
// app.get('*', checkAuth)
app.use('/', require('./routes/pages'))
app.use('/user', require('./routes/user'))
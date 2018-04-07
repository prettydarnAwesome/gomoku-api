const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
require('dotenv').config()

const botsRouter = require('./routes/bots')
const authorsRouter = require('./routes/authors')
const setsRouter = require('./routes/sets')

let db = require('./db.js')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.set('json spaces', 2);
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use('/bots', botsRouter)
app.use('/authors', authorsRouter)
app.use('/sets', setsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  console.log(err)
  res.locals.error = process.env.DEBUG == 1 ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

module.exports = app

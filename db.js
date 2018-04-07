const dotenv = require('dotenv')
require('dotenv').config()

let r = require('rethinkdb')
r.connect({ host: process.env.DB_ADDRESS, port: process.env.DB_PORT }).then(connection => {
  r.connection = connection
})

module.exports = r
var express = require('express')
var router = express.Router()
const db = require('../db.js')

router.get('/', function (req, res, next) {
  db.db('gomoku').table('Authors').run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/:ids', function (req, res, next) {
  let ids = req.params.ids.split(',')
  db.db('gomoku').table('Authors').getAll(...ids).run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

module.exports = router

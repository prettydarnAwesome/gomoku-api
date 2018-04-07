var express = require('express')
var router = express.Router()
const db = require('../db.js')

router.get('/', function (req, res, next) {
  db.db('gomoku').table('Bots').run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/:id/store', function (req, res, next) {
  let id = req.param.id
  db.db('gomoku').table('Bots').get(id)('store').run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/:ids', function (req, res, next) {
  let ids = req.params.ids.split(',')
  db.db('gomoku').table('Bots').getAll(...ids).run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/author/:ids', function (req, res, next) {
  let ids = req.params.ids.split(',')
  db.db('gomoku').table('Bots').filter(x => ids.includes(x['author'])).run(db.connection, (err, cursor) => {
    cursor.toArray().then(data => res.json(data))
  })
})

module.exports = router

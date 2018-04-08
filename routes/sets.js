var express = require('express')
var router = express.Router()
const db = require('../db.js')

router.get('/', function (req, res, next) {
  db.db('gomoku').table('Sets').merge(set => {
    return {
      scores: db.db('gomoku').table('SetScores').getAll(set('setID'), { index: 'setID' }).coerceTo('array')
    }
  }).run(db.connection, (err, cursor) => {
    if (err) throw err
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/:ids', function (req, res, next) {
  let ids = req.params.ids.split(',')
  db.db('gomoku').table('Sets').getAll(ids).merge(set => {
    return {
      scores: db.db('gomoku').table('SetScores').getAll(set('setID'), { index: 'setID' }).coerceTo('array')
    }
  }).run(db.connection, (err, cursor) => {
    if (err) throw err
    cursor.toArray().then(data => res.json(data))
  })
})

router.get('/bot/:ids', function (req, res, next) {
  let ids = req.params.ids.split(',')
  db.db('gomoku').table('Sets').filter(set => {
    return db.db('gomoku').table('SetScores').getAll(set('setID'), { index: 'setID' })('botID').contains(...ids)
  }).merge(set => {
    return {
      scores: db.db('gomoku').table('SetScores').getAll(set('setID'), { index: 'setID' }).coerceTo('array')
    }
  }).run(db.connection, (err, cursor) => {
    if (err) throw err
    cursor.toArray().then(data => res.json(data))
  })
})

module.exports = router

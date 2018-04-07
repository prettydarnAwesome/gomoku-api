var express = require('express')
var router = express.Router()
const db = require('../db.js')

function getBotsInfo(data) {
  return data.merge(set => {
    let rows = db.db('gomoku').table('SetScores').getAll(set('botID'), { index: 'botID' })
    let totalRows = rows.sum('botWins').add(rows.sum('botDraws').add(rows.sum('botLosses')))
    return {
      winRate: db.branch(totalRows.eq(0), 0,
        rows.sum('botWins').div(totalRows))
    }
  })
}

router.get('/', function (req, res, next) {
  let count = req.query.count ? parseInt(req.query.count) : undefined
  let order = req.query.orderby ? req.query.orderby.split(':') : undefined
  let orderField = order ? order[0] : ''
  let orderDirection = order ? order[1] : ''

  if (order && order.length == 1) order.push('desc')

  let bots = getBotsInfo(db.db('gomoku').table('Bots').without('code', 'store'))
  let ordered = order ? bots.orderBy(orderDirection == 'asc' ? db.asc(orderField) : db.desc(orderField)) : bots
  let filtered = count ? ordered.limit(count) : ordered

  filtered.run(db.connection, (err, cursor) => {
    if (err) throw err
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

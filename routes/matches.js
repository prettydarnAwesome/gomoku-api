var express = require('express')
var router = express.Router()
const db = require('../db.js')

router.get('/:setid', function (req, res, next) {
  let id = req.params.setid
  let index = req.query.index

  let rows = db.db('gomoku').table('Matches').getAll(id, { index: 'setID' }).orderBy(db.asc('index'))
  
  let result = index == undefined ? rows : rows.filter(row => row('index').eq(parseInt(index)))
  
  result.merge(set => {
    return {
      scores: db.db('gomoku').table('MatchScores').getAll(set('matchID'), { index: 'matchID' }).coerceTo('array')
    }
  }).run(db.connection, (err, cursor) => {
    if (err) throw err
    cursor.toArray().then(data => res.json(data))
  })
})

module.exports = router

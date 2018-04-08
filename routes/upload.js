var express = require('express')
var router = express.Router()
const db = require('../db.js')
var multer = require('multer')
var upload = multer()
const babel = require('babel-core')

router.post('/', upload.single('file'), function (req, res, next) {
  console.log('recieved Bot code... filename: ' + req.file.originalname)
  console.log('size:', req.file.size)

  let author = req.body.author
  let botName = req.body.botName
  let password = req.body.password
  let file = req.file.buffer.toString('utf8')

  let authorsTable = db.db('gomoku').table('Authors')

  if (password == process.env.PASSWORD) {
    authorsTable('authorName').contains(author).run(db.connection, async (err, authorExists) => {
      let guid = 0
      if (!authorExists) {
        let result = await authorsTable.insert({
          authorName: author
        }).run(db.connection)

        guid = result.generated_keys[0]
      } else {
        await authorsTable.getAll(author, { index: 'authorName' }).nth(0).run(db.connection, (err, row) => {
          guid = row.authorID
        })
      }

      console.log(guid)

      let minified = babel.transform(file, { compact: true, comments: false }).code;

      await db.db('gomoku').table('Bots').insert({
        authorID: guid,
        botName: botName,
        code: minified,
        store: {}
      }).run(db.connection)
     
      res.json({
        message: 'thank you for your file 💖'
      })
    })
  } else {
    res.json({
      message: 'wrong password, but we still love you 💖'
    })
  }


})

module.exports = router

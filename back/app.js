const express = require('express')
const bodyParser = require('body-parser')
let conn
require('./db').then(c => {
  conn = c
})

const app = express()
app.use(bodyParser.json())

app.post('/api/clubs', (req, res) => {
  conn.query('INSERT INTO club SET ?', req.body)
  .then(({ insertId }) => conn.query('SELECT * FROM club WHERE id = ?', insertId))
  .then(record => res.send(record))
  .catch(err => res.status(500).json({ error: err.message }))
})

app.get('/api/timeslots', (req, res) => {
  console.log('clubId', req.query.clubId)
  conn.query('SELECT * FROM timeslot WHERE clubId = ?', req.query.clubId)
  .then(records => res.send(records))
  .catch(err => res.status(500).json({ error: err.message }))
})

app.post('/api/timeslots', (req, res) => {
  conn.query('INSERT INTO timeslot SET ?', req.body)
  .then(({ insertId }) => conn.query('SELECT * FROM timeslot WHERE id = ?', insertId))
  .then(record => res.send(record))
  .catch(err => res.status(500).json({ error: err.message }))
})


app.listen(5000)
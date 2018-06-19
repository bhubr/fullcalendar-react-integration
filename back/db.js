const mysql = require('promise-mysql')
const { host, user, password, database } = require('./credentials.json')


module.exports = mysql.createConnection({
  host,
  user,
  password,
  database
})
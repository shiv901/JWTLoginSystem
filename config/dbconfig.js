const sql = require('mysql')

// const db = sql.createConnection({
//   host: process.env.ENVIRONMENT,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE
// })
const db = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jwtloginnode'
})

module.exports = db


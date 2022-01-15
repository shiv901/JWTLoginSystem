const sql = require('mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = sql.createConnection({
  host: process.env.ENVIRONMENT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

exports.register = (req, res)=>{
  console.log(req.body)
  // res.send('Form Submitted')

  const {name, email, password, confirm_password} = req.body

  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result)=>{
    if(err) return console.log(err)
    if(result.length > 0) return res.render('register', {message: 'Eamil already in use', success: false, formData: {name,email}})
    if(password !== confirm_password ) return res.render('register', {message: 'Password do not match', success: false, formData: {name,email}})

    let hashedPass = await bcrypt.hash(password, 8)
    console.log(hashedPass)

    db.query('INSERT INTO users SET ?',{name,email,password:hashedPass}, (err, result)=>{
      if(err) return console.log(err)
      console.log(result)
      return res.redirect('/')
    })
  })

}
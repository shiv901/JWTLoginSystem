const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../config/dbconfig')
const jwt = require('jsonwebtoken')
const { authToken } = require('../auth/auth')

const router = express.Router()

router.get('/dashboard', authToken, (req, res)=>{
  // const user = req.user
  // console.log(req.session)
  db.query('SELECT * FROM users', (err, users)=>{
    if(err) return console.log(err)
    // res.json(users)
    req.flash('success_msg', 'Dashboard')
    return res.render('dashboard', {users})
  })
})

router.get('/dashboard/:id', (req, res) => {
  db.query('SELECT id,name,email FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if(err) return console.log(err)
    res.json(results)
  })
})

// router.put('/edit/:id', (req, res) => {

// })

router.delete('/delete/:id', (req, res)=>{
  return res.send(req.params)
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if(err) return console.log(err)
    res.send('User Deleted Successfully')
  })
})


// Login
router.get('/login', (req, res)=> res.render('login'))

router.post('/login', (req,res)=>{
  const {email, password} = req.body

  if(!email || !password) {
        // req.flash('success_msg','Login was successful')
        req.flash('error_msg','Authentication failed')
    return res.render('login', {message: 'Authentication failed'})
  }
  // console.log(email, password)
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, user)=>{
    if(err) return console.log(err, user)

    if(!user.length) {
      req.flash('success_msg','No user found')
      return res.render('login', {message: 'No user found'})
    }  
    try {
      if(await bcrypt.compare(password, user[0].password)){

        const token = jwt.sign(user[0].email, process.env.JWT_SECRET)
        res.cookie('jwt',token, {
          expiresIn: '1hr'
        })

        req.flash('success_msg','Login was successful')
        // req.session.loggedIn = true
        // req.locals.user = user[0]
        return res.redirect('/')
      }else{
        return res.render('login', {message: 'Wrong password', email: user[0].email})
      }
    } catch (error) {
      return console.log(err)
    }
  })
})

router.get('/logout', (req, res) => {
  res.cookie('jwt', '', {expiresIn: 1})
  req.flash('success', 'Logout Successfully')
  res.redirect('/')
})

// Register
router.get('/register', (req, res)=> res.render('register'))

router.post('/register', (req, res)=> {
  const {name, email, password, confirm_password} = req.body
  let errors = []

  if(!name || !email && !password || !confirm_password) errors.push({ message: 'All fields are required' })

  if(password !== confirm_password) errors.push({ message: 'Passwords do not match' })

  if(password.length < 6) errors.push({ message: 'Password must be at least 6 characters'})

  if(errors.length > 0) return res.render('register', { errors,name,email,password })

  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result)=>{
    // console.log(result)
    if(result.length > 0) {
      errors.push({message: 'Eamil already in use'})
      return res.render('register', { errors,name,email,password })
    }

    let hashedPass = await bcrypt.hash(password, 8)

    db.query('INSERT INTO users SET ?',{name,email,password:hashedPass}, (err, result)=>{
      if(err) return console.log(err)
      req.flash('success_msg','You are registered successfully and now you can login')
      return res.redirect('/user/login')
    })
  })
})

module.exports = router
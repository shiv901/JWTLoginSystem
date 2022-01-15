const db = require('../config/dbconfig')
const jwt = require('jsonwebtoken')
// require('dotenv').config();

module.exports = {
  authToken: function (req, res, next) {
    const token = req.cookies.jwt
  
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if(err) {
        req.flash("error_message", "Please login first")
        return res.redirect('/user/login')
      }
      // console.log(req.user)
      // req.locals.user = data.user
      next()
    })
  },

  // checkAuth: function (req, res, next) {
  //   const token = req.cookies.jwt

  //   if(token){
  //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
  //       if(err) {
  //         res.locals.user = null;
  //         next()
  //       } else{
  //         console.log(typeof(decodedToken))
  //         // db.query('SELECT id,name,email FROM users WHERE email = ?', [decodedToken], (err, user)=>{
  //         //   if(err) return console.log(err)
  //         //   console.log(user)
  //         // });
  //         next()
  //       }
  //     })
  //   } else{
  //     res.locals.user = null;
  //     next()
  //   }
  // }

} //Exports ends
const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
  let user = req.session.user
  // console.log(req.session)
  res.render('index', {user});
})


module.exports = router
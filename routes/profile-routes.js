
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router()
const Book = require('../models/Book-model')
const User = require('../models/User-model')



router.get('/profile', (req, res, next) => {
  console.log('usuario logado:', req.session.currentUser._id)
  const userId = req.session.currentUser._id
  console.log(userId)
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.json(err)
  })
  
})


module.exports = router
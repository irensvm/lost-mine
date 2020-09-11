
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
router.put('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `User with ${req.params.id} is updated successfully.` });
    })
    .catch(error => {
      res.json(error);
    });



module.exports = router
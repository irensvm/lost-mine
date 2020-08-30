const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Book = require('../models/Book-model')

router.post('/books', (req, res, next) => {
  // req.body
  Book.create({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  })
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      res.json(err)
    })
})

router.get('/books', (req, res, next) => {

  Book.find()

    .then(books => {
      res.json(books)
    })
    .catch(err => {
      res.json(err)
    })

})
router.get('/books/:id', (req, res, next) => {
  console.log(req.params.id)
  Book.findById(req.params.id)
    .then(book => {
      res.json(book)
    })
    .catch(err => {
      res.json(err)
    })

})

router.put('/books/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Book.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Book with ${req.book.id} is updated successfully.` });
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router

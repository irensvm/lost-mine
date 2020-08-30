const {
  Schema,
  model
} = require('mongoose');

const userSchema = new Schema({
  title: {
    type: String,
    required: true,

  },
  description: String,
  genre: String,
  author: String,

},

  {
    timestamps: true
  });

module.exports = model('Book', userSchema);
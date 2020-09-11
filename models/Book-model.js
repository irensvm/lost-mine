const {
  Schema,
  model
} = require('mongoose');

const userSchema = new Schema({
  title: {
    type: String,
    required: true,

  },
  opinion: String,
  genre: String,
  author: String,
  owner: String,
  lented: String,
  faved:{
    type: Boolean,
    default:false
  },
  rating: String,

},

  {
    timestamps: true
  });

module.exports = model('Book', userSchema);
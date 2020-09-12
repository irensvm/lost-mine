const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,

  },
  opinion: String,
  genre: String,
  author: String,
  owner: String,
  //{type: Schema.Types.ObjectId, ref: 'User'},
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

module.exports = mongoose.model('Book', bookSchema);
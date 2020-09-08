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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  faved:{
    type: Boolean,
    default:false
  }

},

  {
    timestamps: true
  });

module.exports = model('Book', userSchema);
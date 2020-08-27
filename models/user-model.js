const {
  Schema,
  model
} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, 'Not a valid email.']

  },
  passwordHash: String,
  googleID: String,
  fullName: String,
  avatar: {
    type: String,
    default: "https://s3-ap-southeast-2.amazonaws.com/wh1.thewebconsole.com/wh/8994/l/item-avatar.gif"

  },

},

  {
    timestamps: true
  });

module.exports = model('User', userSchema);
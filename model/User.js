const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String
  },
  isuser: {
    type: Boolean,
    default: false
  },
  otp: {
    type: Number
  }
});

module.exports = User = mongoose.model("user", UserSchema);

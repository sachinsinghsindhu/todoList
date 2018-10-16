const mongoose = require('mongoose');
const todo = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  }
});
const user = new mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  todos: [todo],
});

module.exports = mongoose.model('User', user);
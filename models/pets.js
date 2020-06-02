const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Pets', Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  colour: {
    type: String,
    require: true,
  }
}));
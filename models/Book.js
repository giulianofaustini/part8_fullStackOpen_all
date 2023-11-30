const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')



const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ],
  summary: {
    type: String,
    minlength: 10
  }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', schema)


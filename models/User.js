const mongoose = require('mongoose')    


const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    favoriteGenre: {
        type: String,
        required: true,
        minlength: 4
    },
})

module.exports = mongoose.model('User', schema)

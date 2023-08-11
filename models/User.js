const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    _id: Number,
    name_user: {
        type: String,
        required: true
    },
    surname_user: {
        type: String,
        required: true
    },
    middle_name_user: {
        type: String,
        required: true
    },
    phone_user: {
        type: String,
        require: true,
        unique: true
    },
    date_born_user: {
        type: String
    },
    date_register_user: {
        type: String
    },
    image_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images'
    },
    balance_user: {
        type: Number,
        default: 10000
    }
}, {_id: true})

const User = mongoose.model('users', userSchema)

module.exports = User
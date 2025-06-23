const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User;
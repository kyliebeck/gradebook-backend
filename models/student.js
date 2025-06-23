const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    },
    goals: {
        type: String,
        required: false,
    }
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student;
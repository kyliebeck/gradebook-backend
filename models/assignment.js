const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student',
    },
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        enum: ['Math', 'Science', 'History', 'Writing', 'Reading', 'Social-Emotional', 'Arts'],
    },
    assignmentType: {
        type: String,
        enum: ['Homework', 'Classwork', 'Quiz', 'Test', 'Extra-Credit', 'Project'],
    },
    pointsReceived: {
        type: Number,
        required: false,
        default: 0,
    },
    maxPoints: {
        type: Number,
        required: false,
    }
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment;
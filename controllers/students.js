const Student = require('../models/student.js');
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.teacher = req.user._id;
        // Create a new student with the data from req.body
        const createdStudent = await Student.create(req.body);
        createdStudent._doc.teacher = req.user
        res.status(201).json(createdStudent); // 201 Created
    } catch (err) {
        // Setup for error handling
        res.status(500).json({ err: err.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const foundStudents = await Student.find({
            teacher: req.user._id
        })
            .populate("teacher")
        res.status(200).json(foundStudents);

    } catch (err) {
        // Add error handling code
        res.status(500).json({ err: err.message }); // 500 Internal Server Error
    }

});

router.get('/:studentId', verifyToken, async (req, res) => {
    try {
        // Add query to find a single student
        const foundStudent = await Student.findById(req.params.studentId).populate("teacher");

        // Add error handling if a student is not found
        if (!foundStudent) {
            res.status(404);
            throw new Error('Student not found.');
        }
        res.status(200).json(foundStudent); // 200 OK
    } catch (err) {
        // Add error handling code for 404 errors
        if (res.statusCode === 404) {
            res.json({ err: err.message });
        } else {
            // Add else statement to handle all other errors
            res.status(500).json({ err: err.message });
        }
    }
});

router.delete('/:studentId', verifyToken, async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            res.status(404);
            throw new Error('Student not found');
        }
        if (!student.teacher.equals(req.user._id)) {
            return res.status(403).send("You are not Authorized.")
        }
        const deletedStudent = await Student.findByIdAndDelete(req.params.studentId)
        res.status(200).json(deletedStudent);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ err: err.message });
        } else {
            // Add else statement to handle all other errors
            res.status(500).json({ err: err.message });
        }
    }
});

router.put('/:studentId', verifyToken, async (req, res) => {
    try {
        // Add query to update a single student
        const student = await Student.findById(req.params.studentId);
        // Add a check for a not found student
        if (!student) {
            res.status(404);
            throw new Error('Student not found.');
        }
        if (!student.teacher.equals(req.user._id)) {
            return res.status(403).send("You are not Authorized.")
        }
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.studentId,
            req.body,
            { new: true }
        );
        // Add a JSON response with the updated student
        res.status(200).json(updatedStudent);
    } catch (err) {
        // Add code for errors
        if (res.statusCode === 404) {
            res.json({ err: err.message });
        } else {
            res.status(500).json({ err: err.message });
        }
    }
});


module.exports = router;
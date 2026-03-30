const Assignment = require('../models/assignment.js');
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Student = require('../models/student.js');


router.post('/', verifyToken, async (req, res) => {
    try {

        const students = await Student.find({
            teacher: req.user._id
        });

        const createdAssignments = [];

        for (const student of students) {

            const createdAssignment = await Assignment.create({
                ...req.body,
                teacher: req.user._id,
                student: student._id
            });

            const populatedAssignment = await createdAssignment.populate([
                'student',
                'teacher'
            ]);

            createdAssignments.push(populatedAssignment);
        }

        res.status(201).json(createdAssignments);

    } catch (err) {
        console.error(err)
        res.status(500).json({ err: err.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const foundAssignments = await Assignment.find({
            teacher: req.user._id
        })
            .populate("teacher student")

        res.status(200).json(foundAssignments);  // 200 OK
    } catch (err) {
        // Add error handling code
        res.status(500).json({ err: err.message }); // 500 Internal Server Error
    }
});


router.get('/:assignmentId', verifyToken, async (req, res) => {
    try {
        // Add query to find a single assignment created only by the user
        const foundAssignment = await Assignment.findById(req.params.assignmentId).populate('teacher');

        // Add error handling if an assignment is not found
        if (!foundAssignment) {
            res.status(404);
            throw new Error('Assignment not found.');
        }
        res.status(200).json(foundAssignment); // 200 OK
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

router.delete('/group-delete', verifyToken, async (req, res) => {
    try {

        const { title, subject, assignmentType } = req.body;

        const deletedAssignments = await Assignment.find({
            teacher: req.user._id,
            title,
            subject,
            assignmentType
        });

        await Assignment.deleteMany({
            teacher: req.user._id,
            title,
            subject,
            assignmentType
        });

        res.status(200).json(deletedAssignments);

    } catch (err) {
        console.error(err)
        res.status(500).json({ err: err.message })
    }
});

router.delete('/:assignmentId', verifyToken, async (req, res) => {
    try {
        // find the selected assignment to delete
        const foundAssignment = await Assignment.findById(req.params.assignmentId);
        // determine if user has permission to delete
        if (!foundAssignment.teacher.equals(req.user._id)) {
            return res.status(403).send("You are not authorized")
        }
        // determine if assignment exists
        if (!foundAssignment) {
            res.status(404);
            throw new Error('Assignment not found');
        }
        // create new variable for deleted assignment and delete it
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.assignmentId)
        res.status(200).json(deletedAssignment);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ err: err.message });
        } else {
            // Add else statement to handle all other errors
            res.status(500).json({ err: err.message });
        }
    }
})

router.put('/:assignmentId', verifyToken, async (req, res) => {
    try {
        // Add query to update a single assignment
        const assignment = await Assignment.findById(req.params.assignmentId);
        // check permissions
        if (!assignment.teacher.equals(req.user._id)) {
            return res.status(403).send("You are not authorized")
        }
        // Add a check for a not found assignment
        if (!assignment) {
            res.status(404);
            throw new Error('Assignment not found.');
        };
        // update the assignment
        const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, req.body,
            { new: true }
        ).populate('teacher student');
        updatedAssignment._doc.teacher = req.user;
        // Add a JSON response with the updated assignment

        res.status(200).json(updatedAssignment);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }

});












module.exports = router;
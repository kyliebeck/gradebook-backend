const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3000
// Import the controller file
const assignmentRouter = require('./controllers/assignments.js');
const studentRouter = require('./controllers/students.js')
const authRouter = require('./controllers/auth');
const usersRouter = require('./controllers/users');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/assignments', assignmentRouter);
app.use('/students', studentRouter)
app.use('/auth', authRouter);
app.use('/users', usersRouter)


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

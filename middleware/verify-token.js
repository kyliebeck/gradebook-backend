// import jwt to use the verify method
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Assign decoded payload to req.user
        req.user = decoded.payload;

        // Call next() to invoke the next middleware function
        next();
    } catch (err) {
        // If any errors, send back a 401 status and an 'Invalid token.' error message
        res.status(401).json({ err: 'Invalid token.' });
    }
}

// export this function to use it in controller files
module.exports = verifyToken;
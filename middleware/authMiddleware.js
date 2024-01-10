const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
require('dotenv').config({});

const JWT_SECRET ="hhakhkgvbf5768xmnbshgsig"

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET, );
            console.log(decoded)

            // Check if token is close to expiry and refresh if needed
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decoded.exp - currentTimestamp < 300) { // Refresh if within 5 minutes of expiry
                const refreshedToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
                res.setHeader('Authorization', `Bearer ${refreshedToken}`);
            }

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Token expired. Please log in again.' });
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

const localVariables = asyncHandler(async (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
});

module.exports = {
    protect,
    localVariables
};

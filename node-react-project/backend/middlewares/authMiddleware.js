const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in! Please log in to get access.',
            });
        }

        // 2) Verification token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_fallback_secret_key_123'
        );

        // 3) Check if user still exists
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'The user belonging to this token does no longer exist.',
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token. Please log in again!',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Your token has expired! Please log in again.',
            });
        }
        res.status(401).json({ status: 'error', message: error.message });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['Admin', 'Tour Guide']. role='Tourist'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

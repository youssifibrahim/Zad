const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(messages.NOT_LOGGED_IN, 401));
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError(messages.NOT_LOGGED_IN, 401));
        }
        req.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError(messages.NOT_LOGGED_IN, 401));
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(messages.NO_PERMISSION, 403));
        }
        next();
    };
};
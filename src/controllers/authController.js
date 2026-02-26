const User = require('../models/User');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');
const jws = require('jsonwebtoken');

// Create token
const createAndSendToken = (user, statusCode, res) => {
    const token = jws.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    })
}

// Signup
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            phoneNumber: req.body.phoneNumber
        });
        createAndSendToken(newUser, 201, res);
    } catch (err) {
        if (err.code === 11000) {
            return next(new AppError(messages.USER_EXISTS, 400))
        }
        next(err)
    }
}

// Login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError(messages.LOGIN_FAILED, 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user ||
        !(await user.correctPassword(password, user.password))) {
        return next(new AppError(messages.LOGIN_FAILED, 401));
    }
    createAndSendToken(user, 200, res);
};
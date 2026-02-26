const messages = require('../utils/errorMessages');

// Development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

// Production
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            errorCode: err.errorCode,
            message: err.message
        });
    }
    else {
        console.error('ERROR', err);
        res.status(500).json({
            status: 'error',
            message: messages.INTERNAL_SERVER_ERROR
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'TokenExpiredError') {
            error = new AppError(messages.NOT_LOGGED_IN, 401);
        }
        sendErrorProd(error, res);
    }
};
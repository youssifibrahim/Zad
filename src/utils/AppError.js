class AppError extends Error {
    constructor(errorObject, statusCode) {
        super(errorObject.message);
        this.statusCode = statusCode;
        this.errorCode = errorObject.code;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
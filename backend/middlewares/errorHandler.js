const {ValidationError} = require('joi');

const errorHandler = (error, req, res, next) => {
    // default error 
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
    }
    if (error instanceof ValidationError) {
        statusCode = 401;
        data.message = error.message;

        return res.status(statusCode).json(data);
    }

    if (error.status) {
        statusCode = error.status;
    }

    if (error.message) {
        data.message = error.message;
    }

    return res.status(statusCode).json(data);

}
module.exports = errorHandler;
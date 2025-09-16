const createError = require('http-errors');

const validateBody = (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
        return next(createError(400, 'Request body is missing or invalid'));
    }
    if (!req.body.email) {
        return next(createError(400, 'Email is required'));
    }
    next();
};

module.exports = validateBody;
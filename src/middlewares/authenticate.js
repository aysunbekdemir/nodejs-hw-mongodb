const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../db/models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'Authorization header missing or malformed');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            throw createHttpError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(createHttpError(401, error.message));
    }
};

module.exports = authenticate;
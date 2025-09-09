const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const User = require('../db/models/User');
const Session = require('../db/models/Session');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHttpError(409, 'Email in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createHttpError(401, 'Invalid email or password');
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        await Session.deleteMany({ userId: user._id });
        await Session.create({
            userId: user._id,
            accessToken,
            refreshToken,
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({
            status: 200,
            message: 'Successfully logged in an user!',
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

const refreshSession = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createHttpError(401, 'Refresh token missing');
        }

        const session = await Session.findOne({ refreshToken });
        if (!session || session.refreshTokenValidUntil < new Date()) {
            throw createHttpError(401, 'Invalid or expired refresh token');
        }

        const newAccessToken = jwt.sign({ id: session.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: session.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        await Session.deleteMany({ userId: session.userId });
        await Session.create({
            userId: session.userId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
        res.status(200).json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: { accessToken: newAccessToken },
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createHttpError(401, 'Refresh token missing');
        }

        await Session.deleteOne({ refreshToken });
        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, refreshSession, logoutUser };
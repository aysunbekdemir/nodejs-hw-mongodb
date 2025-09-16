const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../db/models/User');
const Session = require('../db/models/Session');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError(409, 'Email in use');
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
            throw createError(401, 'Invalid email or password');
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
            message: 'Successfully logged in a user!',
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
            throw createError(401, 'Refresh token missing');
        }

        const session = await Session.findOne({ refreshToken });
        if (!session || session.refreshTokenValidUntil < new Date()) {
            throw createError(401, 'Invalid or expired refresh token');
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
            throw createError(401, 'Refresh token missing');
        }

        await Session.deleteOne({ refreshToken });
        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const sendResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw createError(404, 'User not found!');
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
        const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            status: 200,
            message: 'Reset password email has been successfully sent.',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email });

        if (!user) {
            throw createError(404, 'User not found!');
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Password has been successfully reset.',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser,
    sendResetEmail,
    resetPassword,
};
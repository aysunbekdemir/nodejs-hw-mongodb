import User from '../models/user.js';
import Session from '../models/session.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await Session.create({
      uid: user._id,
      accessToken,
      refreshToken: 'some_refresh_token', // This should be dynamic
      accessTokenExpiredAt: Date.now() + 3600000,
      refreshTokenExpiredAt: Date.now() + 604800000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await Session.findOneAndDelete({ accessToken: req.token });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// You need to create these functions
const sendResetEmail = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

const resetPassword = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  sendResetEmail,
  resetPassword,
};

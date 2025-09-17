import * as authService from '../services/auth.js';

export const registerUser = async (req, res) => {
    const newUser = await authService.registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        },
    });
};

export const loginUser = async (req, res) => {
    const { accessToken, refreshToken, session } = await authService.loginUser(req.body);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken },
    });
};

export const refreshSession = async (req, res) => {
    const { refreshToken: newRefreshToken, accessToken: newAccessToken, session } = await authService.refreshSession(req.cookies.refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken: newAccessToken },
    });
};

export const logoutUser = async (req, res) => {
    await authService.logoutUser(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
};
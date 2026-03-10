const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Email = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_fallback_secret_key_123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    // Return non-sensitive user data
    const userData = user.toJSON();
    delete userData.password;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: userData,
        },
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phoneNumber } = req.body;

        const newUser = User.build({
            name,
            email,
            password,
            role: role || 'Tourist',
            phoneNumber,
        });

        const verifyToken = newUser.createEmailVerifyToken();
        await newUser.save();

        const verifyURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/auth/verifyEmail/${verifyToken}`;

        try {
            await new Email(newUser, verifyURL).sendVerification();
        } catch (err) {
            newUser.emailVerifyToken = null;
            newUser.emailVerifyExpires = null;
            await newUser.save();
            console.error('Error sending email:', err);
        }

        createSendToken(newUser, 201, res);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Email already exists.' });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password',
            });
        }

        // 2) Check if user exists && password is correct using scope to get password
        const user = await User.scope('withPassword').findOne({ where: { email } });

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect email or password',
            });
        }

        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({
        status: 'success',
        token: null,
        message: 'Logged out successfully',
    });
};

exports.verifyEmail = async (req, res, next) => {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                emailVerifyToken: hashedToken,
                emailVerifyExpires: { [Op.gt]: new Date() },
            },
        });

        // 2) If token has not expired
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is invalid or has expired',
            });
        }

        user.isEmailVerified = true;
        user.emailVerifyToken = null;
        user.emailVerifyExpires = null;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Email successfully verified',
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'There is no user with email address.',
            });
        }

        const otp = user.createPasswordResetOtp();
        await user.save();

        try {
            await new Email(user, otp).sendPasswordResetOtp();

            res.status(200).json({
                status: 'success',
                message: 'Passcode sent to email!',
            });
        } catch (err) {
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();

            return res.status(500).json({
                status: 'error',
                message: 'There was an error sending the email. Try again later!',
            });
        }
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email, otp, and new password.' });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(otp.toString())
            .digest('hex');

        const user = await User.findOne({
            where: {
                email,
                passwordResetToken: hashedToken,
                passwordResetExpires: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Passcode is invalid or has expired',
            });
        }

        user.password = req.body.password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        // Using manual save allows the beforeSave hook to run and re-hash it.
        await user.save();

        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

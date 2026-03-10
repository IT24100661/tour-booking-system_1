const User = require('../models/User');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// GET /api/v1/users/me
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No user found with that ID',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

// PATCH /api/v1/users/updateMe
exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password) {
            return res.status(400).json({
                status: 'error',
                message:
                    'This route is not for password updates. Please use /updateMyPassword.',
            });
        }

        // 2) Filtered out unwanted fields names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'phoneNumber');

        // 3) Update user document
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        await user.update(filteredBody);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

// DELETE /api/v1/users/deleteMe
exports.deleteMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.active = false;
            await user.save();
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

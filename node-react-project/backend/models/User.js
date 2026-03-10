const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sequelize = require('../config/database');

class User extends Model {
    async correctPassword(candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    }

    createPasswordResetOtp() {
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code

        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Token valid for 10 minutes
        this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        return otp;
    }

    createEmailVerifyToken() {
        const verifyToken = crypto.randomBytes(32).toString('hex');

        this.emailVerifyToken = crypto
            .createHash('sha256')
            .update(verifyToken)
            .digest('hex');

        // Token valid for 24 hours
        this.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return verifyToken;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Please provide your name' },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Please provide a valid email address' },
                notEmpty: { msg: 'Please provide your email' },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 100],
                    msg: 'Password must be at least 8 characters long',
                },
            },
        },
        role: {
            type: DataTypes.ENUM('Tourist', 'Tour Guide', 'Hotel Owner', 'Admin'),
            defaultValue: 'Tourist',
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailVerifyToken: {
            type: DataTypes.STRING,
        },
        emailVerifyExpires: {
            type: DataTypes.DATE,
        },
        passwordResetToken: {
            type: DataTypes.STRING,
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        defaultScope: {
            attributes: { exclude: ['password', 'active'] },
        },
        scopes: {
            withPassword: {
                attributes: {},
            },
        },
        hooks: {
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeFind: (options) => {
                if (!options.where) options.where = {};
                // To allow find hidden records manually if needed, optionally check standard param
                // This simulates Mongoose query middleware `find(/^find/, { active: { $ne: false } })`
                // Options can include a symbol to bypass active scope if needed.
                if (options.where.active === undefined) {
                    options.where.active = true;
                }
            },
        },
    }
);

module.exports = User;

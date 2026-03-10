const nodemailer = require('nodemailer');

class Email {
    constructor(user, codeOrUrl) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.codeOrUrl = codeOrUrl;
        this.from = process.env.EMAIL_FROM || 'TravelZone <noreply@travelzone.com>';
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject, textContent) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: textContent
        };

        if (process.env.NODE_ENV !== 'production') {
            console.log("Simulating/Sending email:", mailOptions);
        }

        try {
            await this.newTransport().sendMail(mailOptions);
        } catch (error) {
            console.error('Email send failed:', error);
            // Non-fatal error for development if credentials are empty
        }
    }

    async sendVerification() {
        await this.send(
            'welcome',
            'Welcome to the Family! Please Verify Your Email',
            `Please use this link to verify your email:\n${this.codeOrUrl}`
        );
    }

    async sendPasswordResetOtp() {
        await this.send(
            'passwordReset',
            'Your Password Reset Passcode (valid for 10 minutes)',
            `Hello ${this.firstName},\n\nYour password reset passcode is: ${this.codeOrUrl}\n\nPlease enter this code to reset your password. If you didn't request this, please ignore this email.`
        );
    }
}

module.exports = Email;

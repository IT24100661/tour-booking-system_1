const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.get('/verifyEmail/:token', authController.verifyEmail);

module.exports = router;

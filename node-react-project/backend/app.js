const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const guideRouter = require('./routes/guideRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const touristRouter = require('./routes/touristRoutes');
const adminRouter = require('./routes/adminRoutes');
const paymentRouter = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const hotelRouter = require('./routes/hotelRoutes');

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/guides', guideRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/tourists', touristRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/payments', paymentRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;

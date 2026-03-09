const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

const app = require('./app');
const sequelize = require('./config/database');

// Import models so Sequelize knows about them before syncing
require('./models/index');

const startServer = async () => {
    try {
        // Authenticate with the database
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync all models with the database
        // Note: In production, you'd use migrations instead of sync()
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        const port = process.env.PORT || 5000;
        const server = app.listen(port, () => {
            console.log(`App running on port ${port}...`);
        });

        // Handle unhandled Promise rejections
        process.on('unhandledRejection', (err) => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();

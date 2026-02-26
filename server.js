const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, ':', err.message);
    process.exit(1);
});

dotenv.config({ path: './.env' });

const app = require('./app');

connectDB();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`✅ Server is running in ${process.env.NODE_ENV} mode`);
    console.log(`Listening on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
})
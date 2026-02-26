const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL.replace(
            '<PASSWORD>',
            process.env.DATABASE_PASSWORD
        );
        console.log('Attempting to connect the Database...');
        const conn = await mongoose.connect(dbUrl);
        console.log(`✅ Database Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
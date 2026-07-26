const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // .env ফাইল থেকে MONGO_URI নিয়ে কানেক্ট করার চেষ্টা করবে
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1); // কানেকশন ফেইল করলে সার্ভার বন্ধ করে দেবে
    }
};

module.exports = connectDB;
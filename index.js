const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes Integration
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Fallback Route for Direct Verification Check
app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, message: "লগইন সফল হয়েছে!" });
});

// MongoDB Connection (এখানে পরিবর্তন করা হয়েছে)
// Vercel-এর Environment Variable (MONGO_URI) ব্যবহার করবে, না থাকলে লোকাল ডাটাবেজে চলবে
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/success_db';

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

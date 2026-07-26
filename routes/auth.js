const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Verification = require('../models/Verification');

// --- ১. রেজিস্ট্রেশন (Sign Up) ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'সবগুলো ঘর পূরণ করুন।' });
        }

        // ইমেইল আগে থেকেই আছে কিনা চেক
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'এই ইমেইলটি ইতিমধ্যেই নিবন্ধিত!' });
        }

        // পাসওয়ার্ড এনক্রিপশন (Security Hash)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'নিবন্ধন সফল হয়েছে! এখন লগইন করুন।' });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: 'সার্ভারে সমস্যা হয়েছে।' });
    }
});

// --- ২. লগইন (Login) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' });
        }

        // ডাটাবেসে ইউজার আছে কিনা চেক
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ success: false, message: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!' });
        }

        // পাসওয়ার্ড ভেরিফিকেশন
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!' });
        }

        return res.status(200).json({
            success: true,
            message: 'লগইন সফল হয়েছে!',
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: 'সার্ভারে সমস্যা হয়েছে।' });
    }
});

// --- ৩. ফাইল আপলোড কনফিগারেশন ---
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

// --- ৪. ভেরিফিকেশন জমা ও অ্যাডমিন প্যানেল ---
router.post('/submit-verification', upload.fields([
    { name: 'selfie', maxCount: 1 },
    { name: 'docFront', maxCount: 1 },
    { name: 'docBack', maxCount: 1 }
]), async (req, res) => {
    try {
        const { documentType, documentNumber } = req.body;
        const selfieFile = req.files && req.files['selfie'] ? `/uploads/${req.files['selfie'][0].filename}` : '';
        const docFrontFile = req.files && req.files['docFront'] ? `/uploads/${req.files['docFront'][0].filename}` : '';
        const docBackFile = req.files && req.files['docBack'] ? `/uploads/${req.files['docBack'][0].filename}` : '';

        const randomMatch = Math.floor(Math.random() * (98 - 85 + 1)) + 85;

        const newVerification = new Verification({
            documentType: documentType || 'nid',
            documentNumber: documentNumber || 'N/A',
            selfieUrl: selfieFile,
            docFrontUrl: docFrontFile,
            docBackUrl: docBackFile,
            matchScore: randomMatch,
            status: 'PENDING'
        });

        await newVerification.save();
        return res.status(200).json({ success: true, message: 'আবেদন সফলভাবে জমা হয়েছে!' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'সার্ভারে সমস্যা হয়েছে।' });
    }
});

router.get('/admin/verifications', async (req, res) => {
    try {
        const list = await Verification.find().sort({ createdAt: -1 });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(500).json({ success: false, message: "ডাটা লোড হয়নি।" });
    }
});

router.put('/admin/verification/:id', async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const updated = await Verification.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "আপডেট হয়নি।" });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// =========================================================================
// @route   GET /api/messages/history
// @desc    ধাপ ৪.১: নির্দিষ্ট দুজন ইউজারের মধ্যকার চ্যাট হিস্ট্রি নিয়ে আসা
// =========================================================================
router.get('/history', async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.query;

        // ইমেইল দিয়ে দুজনের ইউজার আইডি খুঁজে বের করা
        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
        }

        // দুজনের মধ্যে আদান-প্রদান হওয়া সমস্ত মেসেজ ফিল্টার করে নিয়ে আসা
        const chatHistory = await Message.find({
            $or: [
                { sender: sender._id, receiver: receiver._id },
                { sender: receiver._id, receiver: sender._id }
            ]
        }).sort({ createdAt: 1 }); // পুরনো মেসেজ থেকে নতুন মেসেজের সিরিয়ালে সাজানো

        res.status(200).json({ success: true, data: chatHistory });
    } catch (error) {
        console.error("Fetch Chat Error: ", error.message);
        res.status(500).json({ success: false, message: 'চ্যাট হিস্ট্রি লোড করতে সমস্যা হয়েছে।' });
    }
});

module.exports = router;
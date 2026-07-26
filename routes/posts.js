const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../config/upload');

// =========================================================================
// @route   POST /api/posts/create
// @desc    ধাপ ৩.১: নতুন পোস্ট (General বা Product) তৈরি করা (ছবি সহ/ছাড়া)
// =========================================================================
router.post('/create', upload.single('postImage'), async (req, res) => {
    try {
        const { email, text, postType, price, category, location } = req.body;

        // পোস্ট করার জন্য ইউজারের ইমেইল প্রয়োজন (টোকেন সেটআপের আগে টেস্ট করার জন্য)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
        }

        // ছবি আপলোড হয়ে থাকলে তার পাথ নেওয়া
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // নতুন পোস্টের অবজেক্ট তৈরি
        const newPostData = {
            user: user._id,
            text,
            image: imagePath,
            postType: postType || 'general'
        };

        // যদি প্রোডাক্ট পোস্ট হয়, তবে প্রোডাক্ট ডিটেইলস যোগ করা
        if (postType === 'product') {
            newPostData.productDetails = { price, category, location };
        }

        const post = new Post(newPostData);
        await post.save();

        res.status(201).json({ success: true, message: 'পোস্টটি সফলভাবে পাবলিশ হয়েছে।', data: post });
    } catch (error) {
        console.error("Create Post Error: ", error.message);
        res.status(500).json({ success: false, message: 'পোস্ট তৈরি করতে সমস্যা হয়েছে।' });
    }
});

// =========================================================================
// @route   GET /api/posts/feed
// @desc    ধাপ ৩.২: ফেসবুকের মতো নিউজফিডের জন্য সব পোস্ট নিয়ে আসা
// =========================================================================
router.get('/feed', async (req, res) => {
    try {
        // সব পোস্ট ডেটাবেজ থেকে নিয়ে আসা এবং সাথে ইউজারের নাম যুক্ত করা (populate)
        const posts = await Post.find()
            .populate('user', 'name email verificationStatus')
            .sort({ createdAt: -1 }); // নতুন পোস্ট আগে দেখাবে

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Fetch Feed Error: ", error.message);
        res.status(500).json({ success: false, message: 'নিউজফিড লোড করতে সমস্যা হয়েছে।' });
    }
});

// =========================================================================
// @route   PUT /api/posts/like/:id
// @desc    ধাপ ৩.৩: পোস্টে লাইক বা আনলাইক করা
// =========================================================================
router.put('/like/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'পোস্ট পাওয়া যায়নি।' });

        // ইউজার অলরেডি লাইক দিয়েছে কিনা চেক করা
        const likeIndex = post.likes.indexOf(user._id);

        if (likeIndex > -1) {
            // অলরেডি লাইক থাকলে তা রিমুভ (Unlike) করা
            post.likes.splice(likeIndex, 1);
            await post.save();
            return res.status(200).json({ success: true, message: 'পোস্ট আনলাইক করা হয়েছে।', likesCount: post.likes.length });
        } else {
            // লাইক না থাকলে নতুন লাইক যোগ করা
            post.likes.push(user._id);
            await post.save();
            return res.status(200).json({ success: true, message: 'পোস্টে লাইক দেওয়া হয়েছে।', likesCount: post.likes.length });
        }
    } catch (error) {
        console.error("Like Error: ", error.message);
        res.status(500).send('Server Error');
    }
});

// =========================================================================
// @route   POST /api/posts/comment/:id
// @desc    ধাপ ৩.৩: পোস্টে কমেন্ট করা
// =========================================================================
router.post('/comment/:id', async (req, res) => {
    try {
        const { email, text } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'পোস্ট পাওয়া যায়নি।' });

        const newComment = {
            user: user._id,
            text: text
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ success: true, message: 'কমেন্ট সফলভাবে যুক্ত হয়েছে।', data: post.comments });
    } catch (error) {
        console.error("Comment Error: ", error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
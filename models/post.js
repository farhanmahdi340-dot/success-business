const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // কোন ইউজার পোস্ট করেছে তার আইডি
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String // ফেসবুকের মতো পোস্টে ছবি দেওয়ার অপশন (ঐচ্ছিক)
    },
    postType: {
        type: String,
        enum: ['general', 'product'], // সাধারণ পোস্ট নাকি বিক্রির প্রোডাক্ট পোস্ট
        default: 'general'
    },
    // যদি প্রোডাক্ট পোস্ট হয়, তবে নিচের ফিল্ডগুলো কাজ করবে
    productDetails: {
        price: { type: Number },
        category: { type: String },
        location: { type: String }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // কারা লাইক দিল তাদের আইডি
        }
    ],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
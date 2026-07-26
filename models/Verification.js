const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    documentType: { 
        type: String, 
        enum: ['nid', 'driving_license', 'passport', 'birth_certificate'],
        required: true 
    },
    documentNumber: { type: String, required: true }, // ডকুমেন্ট নম্বর
    selfieUrl: { type: String, required: true },
    docFrontUrl: { type: String, required: true },
    docBackUrl: { type: String, default: '' },
    status: { type: String, default: 'PENDING' },
    adminNote: { type: String, default: '' },
    matchScore: { type: Number, default: 85 } // AI Face Match Score Simulation
}, { timestamps: true });

module.exports = mongoose.model('Verification', verificationSchema);
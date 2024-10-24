const express = require('express');
const router = express.Router();
const otpService = require('../services/otpService');

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = otpService.generateOTP();
        await otpService.storeOtpInRedis(email, otp);
        console.log("Stored in REDIS");
        await otpService.sendOTP(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP email', error });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const isValid = await otpService.verifyOTP(email, otp);
        if (isValid) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
});

module.exports = router;

const axios = require('axios');

// Send OTP to user
exports.sendOTP = async (user_id) => {
    try {
        // Example: Make a POST request to the OTP Service API
        const response = await axios.post('http://localhost:5000/api/otp/generate', { user_id });
        return response;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

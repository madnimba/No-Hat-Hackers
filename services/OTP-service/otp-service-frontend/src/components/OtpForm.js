import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const OtpForm = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:4002/api/send-otp', { email });
            setMessage(response.data.message);
            setIsOtpSent(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send OTP');
        }
        setOpen(true);
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:4002/api/verify-otp', { email, otp });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to verify OTP');
        }
        setOpen(true);
    };

    return (
        <div style={{ margin: '20px' }}>
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            {isOtpSent && (
                <TextField
                    label="OTP"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                fullWidth
            >
                {isOtpSent ? 'Verify OTP' : 'Send OTP'}
            </Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert severity={isOtpSent ? 'info' : 'success'}>{message}</Alert>
            </Snackbar>
        </div>
    );
};

export default OtpForm;
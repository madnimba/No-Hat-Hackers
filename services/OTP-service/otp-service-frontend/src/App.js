import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Snackbar, Alert, Typography } from '@mui/material';

const App = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const url_params = new URLSearchParams(window.location.search);
  const userId = url_params.get('id');

  useEffect(() => {
    // Fetch email from User-service using the userId
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:3999/user/${userId}/email`);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, [userId]);

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:4002/api/otp/send-otp', { email });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
    setOpen(true);
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:4002/api/otp/verify-otp', { email, otp });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to verify OTP');
    }
    setOpen(true);
  };

  return (
    <div>
      <h2>OTP Service</h2>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Typography variant="h4" gutterBottom>
        Click below to generate OTP (Sent to your email address)
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSendOtp}>
        Send OTP
      </Button>
      {isOtpSent && (
        <div>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="secondary" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </div>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;

const crypto = require('crypto');
const { EmailClient } = require('@azure/communication-email');
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Generate a random OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
}

// Store OTP in Redis
async function storeOtpInRedis(userId, otp, ttl = 300) {
    await redis.set(userId, otp, 'EX', ttl);  // Store OTP for 5 minutes
}

// Send OTP via Azure Communication Service
async function sendOTP(email, otp) {
    try{
        const POLLER_WAIT_TIME = 10

        // Initialize email client from Azure Communication Services
        // const client = new nodemailer.EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
        const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);

        // Prepare the email message
        const message = {
            senderAddress: process.env.EMAIL_SENDER,
            content: {
                subject: 'Your OTP Code',
                plainText: `Your OTP code is: ${otp}`,
            },
            recipients: {
            to: [
                {
                address: email,
                displayName: email,
                },
            ],
            },
        };

        const poller = await emailClient.beginSend(message);

        if (!poller.getOperationState().isStarted) {
            throw "Poller was not started."
        }
  
        let timeElapsed = 0;
        while(!poller.isDone()) {
            poller.poll();
            console.log("Email send polling in progress");
    
            await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
            timeElapsed += 10;
    
            if(timeElapsed > 18 * POLLER_WAIT_TIME) {
            throw "Polling timed out.";
            }
        }
  
        if(poller.getResult().status === 200) {
            console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
        }
        else {
            throw poller.getResult().error;
        }
    } catch (e) {
        console.log(e);
      }
}


// Fetch OTP from Redis
async function fetchOtpFromRedis(userId) {
    return await redis.get(userId);
}

// Verify OTP
async function verifyOTP(userId, otp) {
    const storedOtp = await fetchOtpFromRedis(userId);
    return storedOtp === otp;
}

module.exports = { generateOTP, sendOTP, storeOtpInRedis, verifyOTP };

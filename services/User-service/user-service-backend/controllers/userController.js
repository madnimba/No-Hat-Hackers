const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = Buffer.from(password).toString('base64');
  const user = await createUser(name, email, hashedPassword);
  
  // After successful registration, redirect to login page
  res.status(201).json({
    message: 'Registration successful',
    redirectUrl: '/login' // URL to redirect to login page
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'Incorrect Email Address' });
  }

  const pass1 = Buffer.from(password).toString('base64');
  const isPasswordCorrect = pass1.replace(/=+$/, '') === user.password.replace(/=+$/, '');

  console.log(password);
  console.log(pass1);
  console.log(user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Generate JWT token if the password is correct
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send the token and redirect URL to the frontend
  res.status(200).json({
    token,
    message: 'Login successful',
    redirectUrl: '/dashboard' // URL to redirect the user to
  });
};

module.exports = { register, login };

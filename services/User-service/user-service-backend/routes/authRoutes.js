const express = require('express');
const { register, login, getUserEmail } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/:userId/email', getUserEmail);

module.exports = router;
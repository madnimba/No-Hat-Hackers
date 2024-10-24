const pool = require('../db');

const createUser = async (name, email, password) => {
  const query = 'INSERT INTO users (username, user_email, password) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [name, email, password]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE user_email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };

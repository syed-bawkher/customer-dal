import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config(); // Load environment variables

const pool = mysql
  .createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
  })
  .promise();

const registerUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Please provide both username and password');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword]);
};

const loginUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Please provide both username and password');
  }

  const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
  if (rows.length === 0) {
    throw new Error('Invalid username or password');
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '5h' });
  await pool.query('UPDATE Users SET token = ? WHERE id = ?', [token, user.id]);

  return token;
};

const validateToken = async (token) => {
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const [rows] = await pool.query('SELECT * FROM Users WHERE id = ? AND token = ?', [decoded.id, token]);
      if (rows.length === 0) {
        throw new Error('Invalid token');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

export { registerUser, loginUser, validateToken };

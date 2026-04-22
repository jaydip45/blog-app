const pool = require('../config/db');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const [existingUsers] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const id = uuidv4();

    await pool.query(
      'INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );

    res.status(201).json({
      id,
      name,
      email,
      role: 'USER',
      token: generateToken(id),
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = users[0];

    if (user && (await comparePassword(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  register,
  login,
  getMe,
};

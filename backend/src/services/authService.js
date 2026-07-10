const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

const register = async (data) => {
  const { name, email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered.', 409);
  }
  const user = await User.create({ name, email, password });
  const token = signToken(user._id, user.role);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

const login = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  const token = signToken(user._id, user.role);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { register, login };
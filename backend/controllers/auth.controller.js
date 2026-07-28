import asyncHandler from '../utils/asyncHandler.js';
import { authenticateUser, registerUser } from '../services/auth.service.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password)' });
  }

  try {
    const authData = await registerUser(name, email, password);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...authData,
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error; 
  }
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const authData = await authenticateUser(email, password);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      ...authData,
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ success: false, message: error.message });
    }
    throw error;
  }
});


export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

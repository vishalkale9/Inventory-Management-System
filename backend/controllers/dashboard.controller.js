import asyncHandler from '../utils/asyncHandler.js';
import { getDashboardStats } from '../services/dashboard.service.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  return res.status(200).json({
    success: true,
    ...stats,
  });
});

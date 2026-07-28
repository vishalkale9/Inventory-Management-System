import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getDashboardStats = async () => {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const lowStockProducts = await Product.countDocuments({ quantity: { $lt: 10 } });

  return {
    totalProducts,
    totalCategories,
    lowStockProducts,
  };
};

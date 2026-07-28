import asyncHandler from '../utils/asyncHandler.js';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const category = await createCategory(name, description);
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    if (error.message === 'Category already exists') {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
});

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();
  return res.status(200).json({
    success: true,
    data: categories,
  });
});

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await updateCategory(id, name, description);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Category with this name already exists') {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
});

export const removeCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: result,
    });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    throw error;
  }
});

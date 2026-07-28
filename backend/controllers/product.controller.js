import asyncHandler from '../utils/asyncHandler.js';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from '../services/product.service.js';

export const addProduct = asyncHandler(async (req, res) => {

  const { name, sku, category, purchasePrice, sellingPrice, quantity } = req.body;

  if (!name || !sku || !category) {
    return res.status(400).json({
      success: false,
      message: 'Product name, SKU, and category are required',
    });
  }

  const image = req.file ? req.file.path : null;

  try {
    const product = await createProduct({
      name,
      sku,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
      image,
    });
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (error.message === 'Product SKU must be unique') {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
});

export const listProducts = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;

  const result = await getAllProducts({ search, page, limit });
  return res.status(200).json({
    success: true,
    ...result,
  });
});

export const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    const product = await updateProduct(id, updateData);
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Product SKU must be unique') {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
});

export const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteProduct(id);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: result,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    throw error;
  }
});

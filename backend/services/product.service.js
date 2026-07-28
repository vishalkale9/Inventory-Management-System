import Product from '../models/Product.js';

export const createProduct = async (data) => {
  const productExists = await Product.findOne({ sku: data.sku });
  if (productExists) {
    throw new Error('Product SKU must be unique');
  }

  const product = await Product.create(data);
  return product;
};

export const getAllProducts = async ({ search = '', page = 1, limit = 10 }) => {
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const searchQuery = {};
  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Product.countDocuments(searchQuery);
  const products = await Product.find(searchQuery)
    .populate('category', 'name description')
    .skip(skip)
    .limit(parsedLimit)
    .sort({ createdAt: -1 });

  return {
    products,
    total,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
    limit: parsedLimit,
  };
};

export const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  if (data.sku && data.sku !== product.sku) {
    const skuExists = await Product.findOne({ sku: data.sku });
    if (skuExists) {
      throw new Error('Product SKU must be unique');
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name description');

  return updatedProduct;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  await product.deleteOne();
  return { id };
};

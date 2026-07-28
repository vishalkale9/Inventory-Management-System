import Category from '../models/Category.js';

export const createCategory = async (name, description) => {
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description,
  });

  return category;
};

export const getAllCategories = async () => {
  const categories = await Category.find({});
  return categories;
};

export const updateCategory = async (id, name, description) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  if (name && name !== category.name) {
    const nameExists = await Category.findOne({ name });
    if (nameExists) {
      throw new Error('Category with this name already exists');
    }
    category.name = name;
  }

  if (description !== undefined) {
    category.description = description;
  }

  const updatedCategory = await category.save();
  return updatedCategory;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  await category.deleteOne();
  return { id };
};

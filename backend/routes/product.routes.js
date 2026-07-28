import express from 'express';
import {
  addProduct,
  listProducts,
  editProduct,
  removeProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(listProducts)
  .post(upload.single('image'), addProduct);

router.route('/:id')
  .put(upload.single('image'), editProduct)
  .delete(removeProduct);

export default router;

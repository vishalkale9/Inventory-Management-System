import express from 'express';
import {
  addCategory,
  listCategories,
  editCategory,
  removeCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(listCategories)
  .post(addCategory);

router.route('/:id')
  .put(editCategory)
  .delete(removeCategory);

export default router;

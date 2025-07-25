// routes/categories.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

const router = express.Router();

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// CREATE a new category with validation
router.post(
  '/',
  [body('name').notEmpty().withMessage('Category name is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

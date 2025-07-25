// routes/posts.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

const router = express.Router();

// GET all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET a single post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// CREATE a post with validation
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = new Post(req.body);
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE a post
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE a post
router.delete('/:id', async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

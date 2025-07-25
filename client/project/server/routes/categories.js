const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch categories' 
      });
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create category
router.post('/', auth, [
  body('name').isLength({ min: 1 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error', 
        details: errors.array() 
      });
    }

    const { name, description } = req.body;

    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        slug: generateSlug(name),
        description: description || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Create category error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create category' 
      });
    }

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
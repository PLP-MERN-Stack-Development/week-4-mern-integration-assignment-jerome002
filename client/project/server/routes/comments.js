const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Create comment
router.post('/', auth, [
  body('content').isLength({ min: 1 }).trim(),
  body('post_id').isUUID()
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

    const { content, post_id } = req.body;

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        content,
        post_id,
        author_id: req.user.id
      }])
      .select(`
        *,
        author:users!comments_author_id_fkey(id, username, avatar)
      `)
      .single();

    if (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create comment' 
      });
    }

    res.status(201).json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users!comments_author_id_fkey(id, username, avatar)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch comments' 
      });
    }

    res.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
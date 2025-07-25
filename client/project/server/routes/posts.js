const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(id, username, avatar),
        category:categories!posts_category_id_fkey(id, name, slug),
        comments:comments(id)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Add search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Add category filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get paginated posts
    const { data: posts, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get posts error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch posts' 
      });
    }

    // Transform posts to include comment count
    const transformedPosts = posts.map(post => ({
      ...post,
      comments: post.comments.length
    }));

    res.json({
      success: true,
      data: {
        data: transformedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(id, username, avatar),
        category:categories!posts_category_id_fkey(id, name, slug),
        comments:comments(
          id,
          content,
          created_at,
          author:users!comments_author_id_fkey(id, username, avatar)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create post
router.post('/', auth, [
  body('title').isLength({ min: 1 }).trim(),
  body('content').isLength({ min: 1 }).trim(),
  body('category_id').isUUID()
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

    const { title, content, category_id, featured_image, status = 'published' } = req.body;

    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        title,
        slug: generateSlug(title),
        content,
        excerpt: content.substring(0, 200) + '...',
        featured_image,
        author_id: req.user.id,
        category_id,
        status
      }])
      .select()
      .single();

    if (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create post' 
      });
    }

    res.status(201).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update post
router.put('/:id', auth, [
  body('title').isLength({ min: 1 }).trim(),
  body('content').isLength({ min: 1 }).trim(),
  body('category_id').isUUID()
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

    const { id } = req.params;
    const { title, content, category_id, featured_image, status } = req.body;

    // Check if post exists and user owns it
    const { data: existingPost, error: checkError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (checkError || !existingPost) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    if (existingPost.author_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this post' 
      });
    }

    const updateData = {
      title,
      slug: generateSlug(title),
      content,
      excerpt: content.substring(0, 200) + '...',
      category_id,
      updated_at: new Date().toISOString()
    };

    if (featured_image) updateData.featured_image = featured_image;
    if (status) updateData.status = status;

    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update post' 
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists and user owns it
    const { data: existingPost, error: checkError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (checkError || !existingPost) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    if (existingPost.author_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this post' 
      });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete post' 
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
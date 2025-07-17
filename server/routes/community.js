const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all community posts
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category,
      status = 'active'
    } = req.query;

    const query = { status };
    if (category && category !== 'All') query.category = category;

    const posts = await CommunityPost.find(query)
      .populate('author', 'name email avatar')
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create community post
router.post('/', auth, async (req, res) => {
  try {
    const post = new CommunityPost({
      ...req.body,
      author: req.user.userId
    });

    await post.save();
    await post.populate('author', 'name email avatar');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update community post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findOne({ 
      _id: req.params.id, 
      author: req.user.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    Object.assign(post, req.body);
    await post.save();
    await post.populate('author', 'name email avatar');

    res.json(post);
  } catch (error) {
    console.error('Update community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete community post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findOneAndDelete({ 
      _id: req.params.id, 
      author: req.user.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
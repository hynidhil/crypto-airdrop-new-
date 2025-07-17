const express = require('express');
const Airdrop = require('../models/Airdrop');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all airdrops
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      chain, 
      difficulty, 
      featured, 
      status = 'Active' 
    } = req.query;

    const query = { status };
    
    if (chain && chain !== 'All') query.chain = chain;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (featured === 'true') query.featured = true;

    const airdrops = await Airdrop.find(query)
      .populate('createdBy', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Airdrop.countDocuments(query);

    res.json({
      airdrops,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get airdrops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single airdrop
router.get('/:id', async (req, res) => {
  try {
    const airdrop = await Airdrop.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!airdrop) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }

    res.json(airdrop);
  } catch (error) {
    console.error('Get airdrop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create airdrop (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const airdrop = new Airdrop({
      ...req.body,
      createdBy: req.user.userId
    });

    await airdrop.save();
    await airdrop.populate('createdBy', 'name email');

    res.status(201).json(airdrop);
  } catch (error) {
    console.error('Create airdrop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update airdrop (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const airdrop = await Airdrop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!airdrop) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }

    res.json(airdrop);
  } catch (error) {
    console.error('Update airdrop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete airdrop (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const airdrop = await Airdrop.findByIdAndDelete(req.params.id);
    
    if (!airdrop) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }

    res.json({ message: 'Airdrop deleted successfully' });
  } catch (error) {
    console.error('Delete airdrop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
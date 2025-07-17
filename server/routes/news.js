const express = require('express');
const router = express.Router();

// Mock news data (replace with actual news API integration)
const mockNews = [
  {
    id: '1',
    title: 'LayerZero Announces Major Protocol Upgrade',
    description: 'LayerZero introduces new cross-chain capabilities with enhanced security features.',
    url: 'https://example.com/news/1',
    imageUrl: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Protocol Updates',
    views: 1250,
    comments: 45,
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    title: 'Arbitrum Launches New Developer Incentive Program',
    description: 'Arbitrum announces $100M fund to support ecosystem development and innovation.',
    url: 'https://example.com/news/2',
    imageUrl: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Ecosystem News',
    views: 980,
    comments: 32,
    createdAt: new Date('2024-01-14T14:20:00Z')
  },
  {
    id: '3',
    title: 'Starknet Testnet Reset Creates New Opportunities',
    description: 'Recent testnet reset opens up fresh airdrop farming opportunities for early adopters.',
    url: 'https://example.com/news/3',
    imageUrl: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Testnet News',
    views: 756,
    comments: 28,
    createdAt: new Date('2024-01-13T09:15:00Z')
  }
];

// Get all news
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    let filteredNews = mockNews;
    if (category && category !== 'All') {
      filteredNews = mockNews.filter(article => article.category === category);
    }

    const limitedNews = filteredNews.slice(0, parseInt(limit));

    res.json({
      news: limitedNews,
      total: filteredNews.length
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const article = mockNews.find(item => item.id === req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
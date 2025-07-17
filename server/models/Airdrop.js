const mongoose = require('mongoose');

const airdropSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  chain: {
    type: String,
    required: true,
    trim: true
  },
  reward: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  participants: {
    type: Number,
    default: 0
  },
  timeLeft: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
airdropSchema.index({ chain: 1 });
airdropSchema.index({ difficulty: 1 });
airdropSchema.index({ featured: 1 });
airdropSchema.index({ status: 1 });
airdropSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Airdrop', airdropSchema);
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  manifesto: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#3b82f6',
  },
  symbol: {
    type: String,
    default: '🗳️',
  },
  voteCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);

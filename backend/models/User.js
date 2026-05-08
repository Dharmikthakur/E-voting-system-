const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  votedAt: {
    type: Date,
    default: null,
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    default: null,
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter',
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

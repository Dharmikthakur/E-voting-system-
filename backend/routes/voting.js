const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/voting/candidates
// @desc    Get all candidates
// @access  Public
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/voting/candidate
// @desc    Add a candidate (Admin only conceptually, public for testing)
// @access  Public
router.post('/candidate', async (req, res) => {
  const { name, party, manifesto } = req.body;
  try {
    const newCandidate = new Candidate({ name, party, manifesto });
    const candidate = await newCandidate.save();
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/voting/vote
// @desc    Cast a vote
// @access  Private
router.post('/vote', auth, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: 'User has already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const vote = new Vote({
      user: userId,
      candidate: candidateId,
    });

    await vote.save();

    // Update candidate vote count
    candidate.voteCount += 1;
    await candidate.save();

    // Mark user as voted
    user.hasVoted = true;
    await user.save();

    res.json({ message: 'Vote successfully cast' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/voting/results
// @desc    Get voting results
// @access  Public
router.get('/results', async (req, res) => {
  try {
    const candidates = await Candidate.find().select('name party voteCount').sort({ voteCount: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

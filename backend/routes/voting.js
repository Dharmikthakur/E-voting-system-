const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');
const auth = require('../middleware/auth');

// In-memory election status (persisted via env for simplicity)
let electionOpen = process.env.ELECTION_OPEN !== 'false';

// @route   GET api/voting/status
// @desc    Get election open/close status
// @access  Public
router.get('/status', (req, res) => {
  res.json({ open: electionOpen });
});

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

// @route   POST api/voting/vote
// @desc    Cast a vote
// @access  Private
router.post('/vote', auth, async (req, res) => {
  try {
    if (!electionOpen) {
      return res.status(400).json({ message: 'Election is currently closed. Voting is not allowed.' });
    }

    const { candidateId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already cast your vote' });
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

    // Mark user as voted with timestamp and candidate ref
    user.hasVoted = true;
    user.votedAt = new Date();
    user.votedFor = candidateId;
    await user.save();

    res.json({ message: 'Vote successfully cast', candidateName: candidate.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/voting/results
// @desc    Get voting results sorted by votes
// @access  Public
router.get('/results', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });
    const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
    res.json({ candidates, totalVotes, electionOpen });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/voting/stats
// @desc    Get voter turnout stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalRegistered = await User.countDocuments({ role: 'voter' });
    const totalVoted = await User.countDocuments({ role: 'voter', hasVoted: true });
    const turnout = totalRegistered > 0 ? Math.round((totalVoted / totalRegistered) * 100) : 0;
    res.json({ totalRegistered, totalVoted, turnout, electionOpen });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Export a way to toggle election status (used by admin route)
router.setElectionStatus = (status) => { electionOpen = status; };
router.getElectionStatus = () => electionOpen;

module.exports = router;

const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const votingRouter = require('./voting');

// @route   GET api/admin/stats
// @desc    Get voter turnout and system stats
// @access  Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalRegistered = await User.countDocuments({ role: 'voter' });
    const totalVoted = await User.countDocuments({ role: 'voter', hasVoted: true });
    const totalCandidates = await Candidate.countDocuments();
    const turnout = totalRegistered > 0 ? Math.round((totalVoted / totalRegistered) * 100) : 0;
    const electionOpen = votingRouter.getElectionStatus();
    res.json({ totalRegistered, totalVoted, totalCandidates, turnout, electionOpen });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/candidate
// @desc    Add a candidate
// @access  Admin
router.post('/candidate', adminAuth, async (req, res) => {
  const { name, party, manifesto, color, symbol } = req.body;
  try {
    const newCandidate = new Candidate({ name, party, manifesto, color, symbol });
    const candidate = await newCandidate.save();
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/candidate/:id
// @desc    Remove a candidate
// @access  Admin
router.delete('/candidate/:id', adminAuth, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/election/open
// @desc    Open the election
// @access  Admin
router.post('/election/open', adminAuth, (req, res) => {
  votingRouter.setElectionStatus(true);
  res.json({ message: 'Election is now OPEN', open: true });
});

// @route   POST api/admin/election/close
// @desc    Close the election
// @access  Admin
router.post('/election/close', adminAuth, (req, res) => {
  votingRouter.setElectionStatus(false);
  res.json({ message: 'Election is now CLOSED', open: false });
});

// @route   GET api/admin/voters
// @desc    Get list of voters with status
// @access  Admin
router.get('/voters', adminAuth, async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter' })
      .select('-password')
      .populate('votedFor', 'name party')
      .sort({ createdAt: -1 });
    res.json(voters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/make-admin
// @desc    Promote a user to admin by email
// @access  Admin
router.post('/make-admin', adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} is now an admin`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

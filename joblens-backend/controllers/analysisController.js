const Job = require('../models/Job');

// GET /api/analysis/stats — dashboard summary
const getStats = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });

    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === 'applied').length;
    const notReady = jobs.filter((j) => j.status === 'not_ready').length;

    const scores = jobs.map((j) => j.analysis?.matchScore).filter(Boolean);
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    res.json({ total, applied, notReady, avgScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats };

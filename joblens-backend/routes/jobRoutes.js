const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  moveToApplied,
  addRound,
  updateNotes,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);
router.patch('/:id/move', protect, moveToApplied);
router.patch('/:id/rounds', protect, addRound);
router.patch('/:id/notes', protect, updateNotes);
router.delete('/:id', protect, deleteJob);

module.exports = router;

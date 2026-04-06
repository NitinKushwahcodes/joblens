const express = require('express');
const router = express.Router();
const { uploadResume, getActiveResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/active', protect, getActiveResume);

module.exports = router;

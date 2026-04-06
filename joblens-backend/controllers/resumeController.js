const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { parseResume } = require('../services/aiService');

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // deactivate old resumes
    await Resume.updateMany({ user: req.user._id }, { isActive: false });

    const parsed = await parseResume(rawText);

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      parsedText: rawText,
      parsed,
    });

    res.status(201).json({ resume });
  } catch (err) {
    res.status(500).json({ message: 'Resume processing failed', error: err.message });
  }
};

// GET /api/resume/active
const getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id, isActive: true });
    if (!resume) return res.status(404).json({ message: 'No resume found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadResume, getActiveResume };

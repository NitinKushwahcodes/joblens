const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { analyzeJob } = require('../services/aiService');
const { calculateScore, extractJDSkills } = require('../services/scoringService');

// POST /api/jobs
const createJob = async (req, res) => {
  const { company, role, jobDescription, notes } = req.body;

  if (!company || !role || !jobDescription) {
    return res.status(400).json({ message: 'Company, role, and job description are required' });
  }

  try {
    const resume = await Resume.findOne({ user: req.user._id, isActive: true });
    if (!resume) {
      return res.status(400).json({ message: 'Upload a resume first before analyzing jobs' });
    }

    // run AI analysis
    const aiResult = await analyzeJob(resume.parsedText, jobDescription, role, company);

    // calculate score using our own logic
    const allJDSkills = extractJDSkills(jobDescription);
    const matchScore = calculateScore({
      matchedSkills: aiResult.matchedSkills || [],
      allJDSkills,
      isFresher: resume.parsed?.isFresher ?? true,
      jdText: jobDescription,
      educationList: resume.parsed?.education || [],
      resumeText: resume.parsedText,
    });

    const job = await Job.create({
      user: req.user._id,
      resume: resume._id,
      company,
      role,
      jobDescription,
      notes,
      status: matchScore >= 60 ? 'applied' : 'not_ready',
      analysis: {
        matchScore,
        matchedSkills: aiResult.matchedSkills || [],
        missingSkills: aiResult.missingSkills || [],
        resumeImprovementTips: aiResult.resumeImprovementTips || [],
        interviewTips: aiResult.interviewTips || [],
        roleInsights: aiResult.roleInsights || '',
        coverLetter: aiResult.coverLetter || '',
        recruiterEmail: aiResult.recruiterEmail || '',
        referralMessage: aiResult.referralMessage || '',
        tailoredSummary: aiResult.tailoredSummary || '',
      },
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Job analysis failed', error: err.message });
  }
};

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/jobs/:id/move — move not_ready → applied
const moveToApplied = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'applied';
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/jobs/:id/rounds — add an interview round
const addRound = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Round title required' });

  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.rounds.push({ title, description });
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/jobs/:id/notes
const updateNotes = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes: req.body.notes },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/jobs/:id — hard delete
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createJob, getJobs, getJobById, moveToApplied, addRound, updateNotes, deleteJob };

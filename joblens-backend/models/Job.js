const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    company: { type: String, required: true },
    role: { type: String, required: true },
    jobDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ['not_ready', 'applied'],
      default: 'not_ready',
    },
    analysis: {
      matchScore: Number,
      matchedSkills: [String],
      missingSkills: [String],
      resumeImprovementTips: [String],
      interviewTips: [String],
      roleInsights: String,
      coverLetter: String,
      recruiterEmail: String,
      referralMessage: String,
      tailoredSummary: String,
    },
    rounds: [
      {
        title: String,
        description: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

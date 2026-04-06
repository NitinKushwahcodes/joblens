const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: String,
    filePath: String,
    parsedText: String,
    parsed: {
      summary: String,
      skills: [String],
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          summary: String,
        },
      ],
      isFresher: { type: Boolean, default: true },
      education: [String],
      achievements: [String],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);

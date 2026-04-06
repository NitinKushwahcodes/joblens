// scoring logic — 4 categories, 100 points total

const FRESHER_JD_KEYWORDS = [
  'fresher', '0-1 year', '0 - 1 year', 'entry level', 'entry-level',
  'no experience required', 'internship', 'student', 'graduate', 'trainee',
];

function normalize(str) {
  return str.toLowerCase().trim();
}

// SKILLS — 50 points
function scoreSkills(matchedSkills, allJDSkills) {
  if (!allJDSkills || allJDSkills.length === 0) return 25; // no skills in JD, neutral

  const ratio = matchedSkills.length / allJDSkills.length;

  if (ratio >= 0.5) return 50;
  if (ratio >= 0.25) {
    // proportional between 25 and 50
    const scaled = 25 + ((ratio - 0.25) / 0.25) * 25;
    return Math.round(scaled);
  }
  // below 25% — proportional between 0 and 25
  const scaled = (ratio / 0.25) * 25;
  return Math.max(1, Math.round(scaled)); // minimum 1 if any match at all
}

// EXPERIENCE / PROJECTS — 30 points
function scoreExperienceProjects(isFresher, jdText) {
  const jdLower = normalize(jdText);
  const isFresherFriendly = FRESHER_JD_KEYWORDS.some((kw) => jdLower.includes(kw));

  if (isFresherFriendly) {
    // projects carry full 30, no experience penalty
    return 30;
  }

  if (isFresher) {
    // not fresher-friendly JD, no real experience
    return 10; // projects give 10
  }

  // has experience for non-fresher JD
  return 30; // 20 experience + 10 projects
}

// EDUCATION — 10 points
function scoreEducation(educationList) {
  if (!educationList || educationList.length === 0) return 3;

  const combined = educationList.join(' ').toLowerCase();
  const tier1 = ['iit', 'nit', 'bits', 'iisc', 'iiit-h', 'iiit hyderabad'];

  if (tier1.some((t) => combined.includes(t))) return 10;
  return 5;
}

// OTHER KEYWORDS — 10 points
function scoreKeywords(resumeText, jdText) {
  const otherKeywords = [
    'rest api', 'restful', 'agile', 'microservices', 'git', 'linux',
    'docker', 'ci/cd', 'unit test', 'data structures', 'algorithms',
    'system design', 'oop', 'mvc', 'sql', 'nosql', 'api design',
  ];

  const resumeLower = normalize(resumeText);
  const jdLower = normalize(jdText);

  let matches = 0;
  for (const kw of otherKeywords) {
    if (jdLower.includes(kw) && resumeLower.includes(kw)) matches++;
  }

  if (matches === 0) return 0;
  if (matches <= 2) return 5;
  return 10;
}

function calculateScore({ matchedSkills, allJDSkills, isFresher, jdText, educationList, resumeText }) {
  const skillPts = scoreSkills(matchedSkills, allJDSkills);
  const expPts = scoreExperienceProjects(isFresher, jdText);
  const eduPts = scoreEducation(educationList);
  const kwPts = scoreKeywords(resumeText, jdText);

  const total = Math.min(100, skillPts + expPts + eduPts + kwPts);
  return total;
}

// extract skills from JD text (simple keyword extraction)
function extractJDSkills(jdText) {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'kotlin', 'swift',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'spring',
    'mongodb', 'postgresql', 'mysql', 'redis', 'firebase', 'sqlite',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform',
    'git', 'graphql', 'rest', 'sql', 'html', 'css', 'tailwind',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'linux', 'bash', 'microservices', 'kafka', 'elasticsearch',
  ];

  const jdLower = normalize(jdText);
  return commonSkills.filter((skill) => jdLower.includes(skill));
}

module.exports = { calculateScore, extractJDSkills };

const https = require('https');

// generic HTTPS POST helper
function httpsPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse response'));
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function stripJsonFences(text) {
  return text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
}

// call Gemini 2.0 flash
async function callGemini(prompt) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 },
  };

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await httpsPost(options, body);

  if (res.error) throw new Error(res.error.message);

  const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

// call Groq llama as fallback
async function callGroq(prompt) {
  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  };

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
  };

  const res = await httpsPost(options, body);

  if (res.error) throw new Error(res.error.message);

  const text = res.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Groq response');
  return text;
}

async function callAI(prompt) {
  try {
    return await callGemini(prompt);
  } catch (err) {
    console.warn('Gemini failed, trying Groq:', err.message);
    return await callGroq(prompt);
  }
}

async function parseResume(rawText) {
  const prompt = `You are a professional resume parser. Extract structured information from this resume.
Return ONLY valid JSON, no explanation, no markdown.

IMPORTANT RULES:
- 'projects' and 'experience' are STRICTLY SEPARATE
- projects = personal/college projects the person built
- experience = actual paid jobs or internships at real companies
- If no real jobs/internships exist, set isFresher: true and experience: []
- For each project: give name, 1-2 line description of WHAT was built and WHAT tech was used
- For summary: mention which college, strongest technical areas based on projects, and what kind of roles they are targeting — make it specific not generic
- achievements = competitive programming ratings, certifications, hackathons, awards

Resume Text:
"""
${rawText.slice(0, 4000)}
"""

Return this exact JSON:
{
  "summary": "3-4 line summary mentioning college, strengths from projects, career aim",
  "skills": ["only technical skills — languages, frameworks, tools, databases"],
  "projects": [
    {
      "name": "project name",
      "description": "1-2 lines: what was built and what problem it solves",
      "techStack": ["tech1", "tech2"]
    }
  ],
  "experience": [
    {
      "title": "role title",
      "company": "company name",
      "duration": "duration",
      "summary": "2-3 lines about what was done and what was achieved"
    }
  ],
  "isFresher": true,
  "education": ["degree, institution, year"],
  "achievements": ["achievement 1", "achievement 2"]
}`;

  const raw = await callAI(prompt);
  const clean = stripJsonFences(raw);

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('AI returned invalid response');
  }
}

async function analyzeJob(resumeText, jd, role, company) {
  const prompt = `You are a strict technical recruiter at a top tech company.
Analyze how well this resume matches this job description.
Be honest and specific. Do not over-inflate match scores.
Return ONLY valid JSON, no explanation, no markdown.

Role: ${role}
Company: ${company}

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Job Description:
"""
${jd.slice(0, 2000)}
"""

STRICT MATCHING RULES:
- Only mark a skill as matched if it is EXPLICITLY present in both resume and JD
- Do not infer or assume skill equivalence unless very obvious (e.g. JS = JavaScript)
- If JD is clearly unrelated to the resume, return very few matched skills
- missingSkills = skills explicitly required in JD but not in resume

Return this exact JSON:
{
  "matchedSkills": ["only explicitly matched skills"],
  "missingSkills": ["skills in JD not in resume"],
  "resumeImprovementTips": [
    "Specific tip 1 — what exact section/skill to add or improve",
    "Specific tip 2",
    "Specific tip 3",
    "Specific tip 4",
    "Specific tip 5",
    "Specific tip 6"
  ],
  "interviewTips": [
    "Detailed tip 1 for this specific role — what topics to prepare",
    "Tip 2 — specific DS/algo topics if role is technical",
    "Tip 3 — system design if senior, projects if fresher",
    "Tip 4 — behavioral/HR tips for this company type",
    "Tip 5 — what to highlight from your resume in interview"
  ],
  "roleInsights": "2-3 lines about what this role focuses on technically and what kind of work is expected",
  "coverLetter": "Professional 3-paragraph cover letter. Para 1: specific opening mentioning role and company. Para 2: 2-3 strongest matching experiences/projects with specifics. Para 3: confident closing with call to action. Sound like a real person, not a template.",
  "recruiterEmail": "Cold email to recruiter/HR. Subject line first, then email body. Max 150 words. Professional, direct, mention 1-2 specific achievements. End with a clear ask.",
  "referralMessage": "WhatsApp/LinkedIn message to a college senior or alumni asking for referral. Casual but respectful tone. Max 100 words. Mention common connection (IIT), the role and company, and a brief why-you-re-a-fit.",
  "tailoredSummary": "3-line resume summary rewritten specifically for this role at this company. Mention relevant projects and skills directly."
}`;

  const raw = await callAI(prompt);
  const clean = stripJsonFences(raw);

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('AI returned invalid response');
  }
}

module.exports = { parseResume, analyzeJob };

import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: '📄', title: 'AI Resume Parsing', desc: 'Upload your PDF and get structured skills, projects, and experience extracted instantly.' },
  { icon: '🎯', title: 'Smart Job Matching', desc: 'Paste any JD and get a real match score based on skills, experience, education, and keywords.' },
  { icon: '✉️', title: 'Cover Letter Generator', desc: 'Get a specific, non-generic cover letter tailored to the exact role and company.' },
  { icon: '📧', title: 'Recruiter Cold Email', desc: 'Ready-to-send cold email to recruiters with your strongest achievements highlighted.' },
  { icon: '🤝', title: 'Referral Message', desc: 'WhatsApp/LinkedIn message for alumni referrals — casual but professional tone.' },
  { icon: '📊', title: 'Application Tracker', desc: 'Track every job, log interview rounds, take notes — all in one dashboard.' },
];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur z-10">
        <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400 tracking-tight">
          JobLens
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          AI-Powered Job Applications
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight max-w-2xl">
          Know your match score <br />before you apply
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-10">
          Upload your resume, paste a job description — get an honest match score, cover letter, recruiter email, and interview tips in seconds.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-10">
          Everything you need to apply smarter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="py-6 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        Built by{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">Nitin Kushwah</span>
        {' · '}
        <a href="mailto:nitin.kushwah.cs@gmail.com" className="hover:text-indigo-500 transition-colors">
          nitin.kushwah.cs@gmail.com
        </a>
        {' · '}
        <a
          href="https://www.linkedin.com/in/nitin-kushwah-iitg"
          target="_blank"
          rel="noreferrer"
          className="hover:text-indigo-500 transition-colors"
        >
          linkedin.com/in/nitin-kushwah-iitg
        </a>
      </footer>
    </div>
  );
}

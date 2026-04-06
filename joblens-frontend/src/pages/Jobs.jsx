import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ScoreBadge from '../components/ui/ScoreBadge';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('not_ready');

  useEffect(() => {
    api.get('/api/jobs')
      .then(res => setJobs(res.data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => j.status === tab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs</h1>
        <Link
          to="/dashboard/jobs/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          + Add Job
        </Link>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'not_ready', label: 'Not Ready', count: jobs.filter(j => j.status === 'not_ready').length },
          { key: 'applied', label: 'Applied', count: jobs.filter(j => j.status === 'applied').length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* list */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">
            {tab === 'not_ready'
              ? 'No low-match jobs yet. Add a job to see your match score.'
              : 'No applied jobs yet. Move a job here once you apply.'}
            <br />
            <Link to="/dashboard/jobs/new" className="text-indigo-500 hover:underline mt-2 inline-block">
              + Add a job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(job => (
              <Link
                key={job._id}
                to={`/dashboard/jobs/${job._id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.company}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.role}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <ScoreBadge score={job.analysis?.matchScore} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

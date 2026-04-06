import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ScoreBadge from '../components/ui/ScoreBadge';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [hasResume, setHasResume] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, jobsRes, resumeRes] = await Promise.allSettled([
          api.get('/api/analysis/stats'),
          api.get('/api/jobs'),
          api.get('/api/resume/active'),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (jobsRes.status === 'fulfilled') setRecentJobs(jobsRes.value.data.jobs.slice(0, 5));
        if (resumeRes.status === 'rejected') setHasResume(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const chartData = stats
    ? [
        { name: 'Applied', value: stats.applied, color: '#6366f1' },
        { name: 'Not Ready', value: stats.notReady, color: '#f59e0b' },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Hey {firstName} 👋
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Here's your job application overview</p>

      {/* no resume warning */}
      {!hasResume && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            You haven't uploaded a resume yet. Upload one to start analyzing jobs.
          </p>
          <Link
            to="/dashboard/resume"
            className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 underline ml-4 shrink-0"
          >
            Upload now →
          </Link>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats?.total ?? 0, color: 'text-gray-900 dark:text-white' },
          { label: 'Applied', value: stats?.applied ?? 0, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Not Ready', value: stats?.notReady ?? 0, color: 'text-yellow-500' },
          { label: 'Avg Score', value: stats?.avgScore ? `${stats.avgScore}%` : '—', color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-5 py-4"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* chart */}
      {stats?.total > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Jobs by Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={48}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* recent jobs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Jobs</h2>
          <Link to="/dashboard/jobs" className="text-xs text-indigo-500 hover:underline">View all</Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            No jobs yet.{' '}
            <Link to="/dashboard/jobs/new" className="text-indigo-500 hover:underline">Add your first job →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentJobs.map(job => (
              <Link
                key={job._id}
                to={`/dashboard/jobs/${job._id}`}
                className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={job.analysis?.matchScore} />
                  <StatusBadge status={job.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

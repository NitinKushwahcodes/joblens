import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ScoreCircle from '../components/ui/ScoreCircle';
import StatusBadge from '../components/ui/StatusBadge';
import CopyButton from '../components/ui/CopyButton';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('analysis');
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [roundForm, setRoundForm] = useState({ title: '', description: '' });
  const [addingRound, setAddingRound] = useState(false);
  const [moving, setMoving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/api/jobs/${id}`)
      .then(res => {
        setJob(res.data.job);
        setNotes(res.data.job.notes || '');
      })
      .catch(() => navigate('/dashboard/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const moveToApplied = async () => {
    setMoving(true);
    try {
      const res = await api.patch(`/api/jobs/${id}/move`);
      setJob(res.data.job);
    } finally {
      setMoving(false);
    }
  };

  const deleteJob = async () => {
    if (!confirm('Delete this job?')) return;
    setDeleting(true);
    try {
      await api.delete(`/api/jobs/${id}`);
      navigate('/dashboard/jobs');
    } finally {
      setDeleting(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await api.patch(`/api/jobs/${id}/notes`, { notes });
      setJob(res.data.job);
    } finally {
      setSavingNotes(false);
    }
  };

  const addRound = async () => {
    if (!roundForm.title.trim()) return;
    setAddingRound(true);
    try {
      const res = await api.patch(`/api/jobs/${id}/rounds`, roundForm);
      setJob(res.data.job);
      setRoundForm({ title: '', description: '' });
    } finally {
      setAddingRound(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  const a = job.analysis || {};
  const score = a.matchScore;
  const isApplied = job.status === 'applied';

  const appliedTabs = [
    { key: 'analysis', label: 'Analysis' },
    { key: 'cover', label: 'Cover Letter' },
    { key: 'email', label: 'Recruiter Email' },
    { key: 'referral', label: 'Referral Message' },
    { key: 'rounds', label: `Rounds (${job.rounds?.length || 0})` },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <ScoreCircle score={score} size="md" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{job.company}</h1>
            <p className="text-sm text-gray-500">{job.role}</p>
            <div className="mt-1"><StatusBadge status={job.status} /></div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isApplied && (
            <button
              onClick={moveToApplied}
              disabled={moving}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
            >
              {moving ? 'Moving...' : 'Move to Applied'}
            </button>
          )}
          {isApplied && (
            <button
              onClick={() => { setTab('rounds'); }}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
            >
              + Add Round
            </button>
          )}
          <button
            onClick={deleteJob}
            disabled={deleting}
            className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-medium transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* not_ready view */}
      {!isApplied && (
        <div className="flex flex-col gap-5">
          <SkillsBlock matched={a.matchedSkills} missing={a.missingSkills} />

          {a.resumeImprovementTips?.length > 0 && (
            <Card title="Resume Improvement Tips">
              <ol className="flex flex-col gap-2">
                {a.resumeImprovementTips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                    <span className="text-indigo-400 font-semibold shrink-0">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {a.roleInsights && (
            <Card title="Role Insights">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.roleInsights}</p>
            </Card>
          )}
        </div>
      )}

      {/* applied tabs */}
      {isApplied && (
        <>
          <div className="flex gap-1 overflow-x-auto mb-5 pb-1">
            {appliedTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'analysis' && (
            <div className="flex flex-col gap-5">
              <SkillsBlock matched={a.matchedSkills} missing={a.missingSkills} />
              {a.roleInsights && (
                <Card title="Role Insights">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.roleInsights}</p>
                </Card>
              )}
              {a.interviewTips?.length > 0 && (
                <Card title="Interview Tips">
                  <ol className="flex flex-col gap-2">
                    {a.interviewTips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                        <span className="text-emerald-500 font-semibold shrink-0">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ol>
                </Card>
              )}
              {a.tailoredSummary && (
                <Card title="Tailored Resume Summary">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.tailoredSummary}</p>
                </Card>
              )}
            </div>
          )}

          {tab === 'cover' && (
            <Card title="Cover Letter" action={<CopyButton text={a.coverLetter} />}>
              <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-sans">
                {a.coverLetter}
              </pre>
            </Card>
          )}

          {tab === 'email' && (
            <Card title="Recruiter Cold Email" action={<CopyButton text={a.recruiterEmail} />}>
              <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-sans">
                {a.recruiterEmail}
              </pre>
            </Card>
          )}

          {tab === 'referral' && (
            <Card title="Referral Message" action={<CopyButton text={a.referralMessage} />}>
              <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-sans">
                {a.referralMessage}
              </pre>
            </Card>
          )}

          {tab === 'rounds' && (
            <div className="flex flex-col gap-4">
              {/* add round form */}
              <Card title="Add Interview Round">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={roundForm.title}
                    onChange={e => setRoundForm(r => ({ ...r, title: e.target.value }))}
                    placeholder="Round title (e.g. OA, Technical, HR)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={roundForm.description}
                    onChange={e => setRoundForm(r => ({ ...r, description: e.target.value }))}
                    placeholder="What happened in this round..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <button
                    onClick={addRound}
                    disabled={addingRound || !roundForm.title.trim()}
                    className="self-start px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    {addingRound ? 'Adding...' : 'Add Round'}
                  </button>
                </div>
              </Card>

              {/* rounds list */}
              {job.rounds?.length > 0 && (
                <Card title="Interview Rounds">
                  <div className="flex flex-col gap-3">
                    {job.rounds.map((r, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(r.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        {r.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{r.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* notes — always visible */}
      <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Notes</h2>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes about this job..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {savingNotes ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children, action }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function SkillsBlock({ matched = [], missing = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">
            Matched Skills ({matched.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matched.length > 0 ? matched.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium">
                {s}
              </span>
            )) : <span className="text-xs text-gray-400">None matched</span>}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">
            Missing Skills ({missing.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.length > 0 ? missing.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium">
                {s}
              </span>
            )) : <span className="text-xs text-gray-400">None missing</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

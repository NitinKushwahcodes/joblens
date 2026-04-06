import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    api.get('/api/resume/active')
      .then(res => setResume(res.data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large — max 5MB');
      return;
    }

    const fd = new FormData();
    fd.append('resume', file);
    setUploading(true);
    setError('');

    try {
      const res = await api.post('/api/resume/upload', fd);
      setResume(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files[0]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p = resume?.parsed;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {resume ? `Uploaded: ${resume.originalName}` : 'No resume uploaded yet'}
          </p>
        </div>
        {resume && (
          <button
            onClick={() => inputRef.current.click()}
            className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            Replace
          </button>
        )}
      </div>

      {/* upload area */}
      {!resume && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-indigo-500 font-medium">Parsing with AI...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click or drag your resume here
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
            </>
          )}
        </div>
      )}

      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={e => upload(e.target.files[0])}
      />

      {error && (
        <div className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* replace uploading state */}
      {resume && uploading && (
        <div className="flex items-center gap-3 mb-4 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 rounded-xl">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Parsing with AI...</span>
        </div>
      )}

      {/* parsed resume display */}
      {p && (
        <div className="flex flex-col gap-6 mt-6">

          {/* Summary */}
          <Section title="Summary">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.summary}</p>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {p.skills?.map(s => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </Section>

          {/* Projects */}
          <Section title="Projects">
            <div className="flex flex-col gap-3">
              {p.projects?.map((proj, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{proj.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack?.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Experience */}
          <Section title="Experience">
            {p.isFresher ? (
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                  Fresher
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No professional experience yet — that's okay!
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {p.experience?.map((exp, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{exp.title}</p>
                      <span className="text-xs text-gray-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-indigo-500 mb-2">{exp.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{exp.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Education */}
          <Section title="Education">
            <ul className="flex flex-col gap-1">
              {p.education?.map((e, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">·</span>
                  {e}
                </li>
              ))}
            </ul>
          </Section>

          {/* Achievements */}
          {p.achievements?.length > 0 && (
            <Section title="Achievements">
              <ul className="flex flex-col gap-1">
                {p.achievements.map((a, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">★</span>
                    {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

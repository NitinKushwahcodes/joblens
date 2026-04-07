import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getStrength(password) {
  if (password.length === 0) return null;
  const hasNum = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  if (password.length >= 8 && hasNum && hasSpecial) return 'strong';
  if (password.length >= 6 && hasNum) return 'medium';
  return 'weak';
}

const strengthConfig = {
  weak:   { label: 'Weak — add numbers or special characters',   color: 'bg-red-500',    text: 'text-red-500',     width: 'w-1/3' },
  medium: { label: 'Medium — add a special character to strengthen', color: 'bg-yellow-400', text: 'text-yellow-500',  width: 'w-2/3' },
  strong: { label: 'Strong password',  color: 'bg-emerald-500', text: 'text-emerald-500', width: 'w-full' },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const sc = strength ? strengthConfig[strength] : null;

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        // server unreachable — no internet or server is down
        setError('Unable to reach the server. Check your internet connection or try again later.');
      } else if (err.response.status === 409) {
        setError('An account with this email already exists. Try logging in instead.');
      } else if (err.response.status === 400) {
        setError(err.response.data?.message || 'Please fill in all fields correctly.');
      } else if (err.response.status >= 500) {
        setError('Server error. Please try again in a moment.');
      } else {
        setError(err.response.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold text-xl block mb-8">
          JobLens
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Start optimizing your applications</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4 flex items-start gap-2">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/*
          autoComplete="off" on the FORM would block browser suggestions — we never want that.
          Each input has its own specific autoComplete value so Chrome knows exactly
          what to suggest and whether to offer a strong password.
        */}
        <form onSubmit={handle} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reg-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nitin Kushwah"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Password
            </label>
            {/*
              autoComplete="new-password" is the key:
              - Tells Chrome this is a NEW password field (not login)
              - Triggers Google's "Suggest strong password" option
              - Also enables saving this credential after successful register
            */}
            <input
              id="reg-password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />

            {/* live strength bar */}
            {sc && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${sc.color} ${sc.width}`} />
                </div>
                <p className={`text-xs mt-1 font-medium ${sc.text}`}>{sc.label}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-1"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

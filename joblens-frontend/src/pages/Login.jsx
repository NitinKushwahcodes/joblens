import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        // no response at all — server down or no internet
        setError('Unable to reach the server. Check your internet connection or try again later.');
      } else if (err.response.status === 401) {
        setError('Incorrect email or password. Please try again.');
      } else if (err.response.status === 400) {
        setError(err.response.data?.message || 'Please fill in all fields.');
      } else if (err.response.status >= 500) {
        setError('Server error. Please try again in a moment.');
      } else {
        setError(err.response.data?.message || 'Login failed. Please try again.');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4 flex items-start gap-2">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* autocomplete="on" tells browser to enable saved credentials for this form */}
        <form onSubmit={handle} autoComplete="on" className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Email
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-1"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

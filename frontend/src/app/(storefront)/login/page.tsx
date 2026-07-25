'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi, API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchApi('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.access_token, data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md border border-primary p-8 bg-surface-container">
        <h1 className="text-4xl font-anton uppercase mb-2">Login</h1>
        <p className="text-sm mb-8 text-on-surface-variant">Welcome back to Manna Blessingwear.</p>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary p-4 uppercase font-bold tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="my-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
            <span className="bg-surface-container px-2">Or</span>
          </div>
        </div>

        <a
          href={`${API_URL}/auth/google`}
          className="w-full flex items-center justify-center border border-primary p-3 sm:p-4 text-sm uppercase font-bold tracking-wider sm:tracking-widest hover:bg-primary/5 transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs font-bold uppercase tracking-wider sm:tracking-widest text-center">
          <span>Don't have an account?</span>
          <Link href="/register" className="underline hover:opacity-70">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

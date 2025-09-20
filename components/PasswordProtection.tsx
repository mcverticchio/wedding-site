'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface PasswordProtectionProps {
  children: React.ReactNode;
  correctPassword: string;
}

export function PasswordProtection({ children, correctPassword }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem('wedding-site-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('wedding-site-authenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream">
        <div className="text-ink">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream">
        <div className="mx-4 w-full max-w-md">
          <div className="p-8 bg-white rounded-lg border shadow-soft border-warmSand/60">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-ink">Welcome</h1>
              <p className="text-ink/80">Please enter the password from your invitation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="px-4 py-3 w-full rounded-lg border border-warmSand/60 focus:outline-none focus:ring-2 focus:ring-warmSand/40 focus:border-warmSand/80 text-ink placeholder-ink/50"
                  required
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!password.trim()}
              >
                Enter Site
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

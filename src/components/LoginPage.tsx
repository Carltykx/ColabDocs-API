import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Google } from '../../components/icons';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg border border-border">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-foreground">
            Welcome to CollabDocs
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to continue to your workspace
          </p>
        </div>
        <button
          onClick={loginWithGoogle}
          className="w-full flex justify-center items-center py-3 px-4 border border-border rounded-md shadow-sm bg-secondary text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Google className="h-5 w-5 mr-3" />
          Sign in with Google
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border bg-secondary placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password-2" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border bg-secondary placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
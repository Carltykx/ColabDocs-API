import React from 'react';
import { useAuth } from './src/contexts/AuthContext';
import { LoginPage } from './src/components/LoginPage';
import { AuthenticatedApp } from './src/components/AuthenticatedApp';
import { Spinner } from './src/components/Spinner';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <LoginPage />;
}
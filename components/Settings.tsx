import React from 'react';
import { Theme } from '../types';

interface SettingsProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, onThemeChange }) => {
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    onThemeChange(isDark ? 'light' : 'dark');
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground mt-1">Manage your profile, billing, and workspace settings here.</p>
      
      <div className="mt-8 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <p className="text-muted-foreground mt-1">Customize the look and feel of the application.</p>
        
        <div className="mt-4 bg-secondary p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">Select between light and dark mode.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Light</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                isDark ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={isDark}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-secondary-foreground shadow ring-0 transition duration-200 ease-in-out ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-muted-foreground">Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
};

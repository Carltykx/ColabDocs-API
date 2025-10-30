import React from 'react';
import { View, Workspace, UserProfile } from '../types';
import { Home, FileText, Code, BarChart2, Settings as SettingsIcon, PlusCircle, LogOut } from './icons';
import { useAuth } from '../src/contexts/AuthContext';


interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  currentUser: UserProfile;
  activeView: View;
  onViewChange: (view: View) => void;
  onWorkspaceChange: (workspaceId: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ workspaces, activeWorkspace, currentUser, activeView, onViewChange, onWorkspaceChange }) => {
  const { logout } = useAuth();
  
  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-64 p-4">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
          {activeWorkspace.name.charAt(0)}
        </div>
        <select
          value={activeWorkspace.id}
          onChange={(e) => onWorkspaceChange(e.target.value)}
          className="ml-2 bg-transparent text-foreground font-semibold text-lg border-none focus:ring-0"
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>{ws.name}</option>
          ))}
        </select>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          isActive={activeView === View.Dashboard}
          onClick={() => onViewChange(View.Dashboard)}
        />
        <NavItem
          icon={<FileText className="h-5 w-5" />}
          label="Documents"
          isActive={activeView === View.DocumentEditor}
          onClick={() => onViewChange(View.DocumentEditor)}
        />
        <NavItem
          icon={<Code className="h-5 w-5" />}
          label="API Registry"
          isActive={activeView === View.ApiRegistry}
          onClick={() => onViewChange(View.ApiRegistry)}
        />
        <NavItem
          icon={<BarChart2 className="h-5 w-5" />}
          label="API Analytics"
          isActive={activeView === View.ApiAnalytics}
          onClick={() => onViewChange(View.ApiAnalytics)}
        />
      </nav>

      <div className="mt-auto">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <PlusCircle className="h-5 w-5" />
            <span className="ml-3">Invite team</span>
        </button>
        <div className="border-t border-border my-4"></div>
        <div className="flex items-center">
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-9 w-9 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
           <button onClick={() => onViewChange(View.Settings)} className="ml-auto p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
                <SettingsIcon className="h-5 w-5" />
           </button>
           <button onClick={logout} className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
                <LogOut className="h-5 w-5" />
           </button>
        </div>
      </div>
    </div>
  );
};
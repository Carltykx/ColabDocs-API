import React, { useState, useMemo, useEffect } from 'react';
import { View, UserProfile, Workspace, Document, ApiRegistration, ApiUsageData, Theme } from '../../types';
import { Sidebar } from '../../components/Sidebar';
import { Dashboard } from '../../components/Dashboard';
import { DocumentEditor } from '../../components/DocumentEditor';
import { ApiRegistry } from '../../components/ApiRegistry';
import { ApiAnalytics } from '../../components/ApiAnalytics';
import { Settings } from '../../components/Settings';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToWorkspaces, subscribeToDocuments, subscribeToApis, getWorkspaceMembers } from '../services/firestoreService';
import { Spinner } from './Spinner';

const generateMockUsageData = (): ApiUsageData[] => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const calls = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        const errors = Math.floor(calls * (Math.random() * 0.1));
        data.push({ date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric'}), calls, errors });
    }
    return data;
}

export const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [apis, setApis] = useState<ApiRegistration[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<UserProfile[]>([]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToWorkspaces(user.id, (fetchedWorkspaces) => {
        setWorkspaces(fetchedWorkspaces);
        if (!activeWorkspaceId && fetchedWorkspaces.length > 0) {
          setActiveWorkspaceId(fetchedWorkspaces[0].id);
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user, activeWorkspaceId]);

  useEffect(() => {
    if (activeWorkspaceId) {
      const unsubDocs = subscribeToDocuments(activeWorkspaceId, setDocuments);
      const unsubApis = subscribeToApis(activeWorkspaceId, setApis);

      const activeWs = workspaces.find(ws => ws.id === activeWorkspaceId);
      if (activeWs) {
          getWorkspaceMembers(activeWs.members).then(setMembers);
      }
      
      return () => {
        unsubDocs();
        unsubApis();
      };
    }
  }, [activeWorkspaceId, workspaces]);

  const mockUsageData = useMemo(() => generateMockUsageData(), []);

  const activeWorkspace = useMemo(() => workspaces.find(ws => ws.id === activeWorkspaceId), [workspaces, activeWorkspaceId]);
  const activeDocument = useMemo(() => documents.find(doc => doc.id === activeDocumentId), [documents, activeDocumentId]);

  const handleSelectDocument = (docId: string) => {
    setActiveDocumentId(docId);
    setActiveView(View.DocumentEditor);
  }

  const renderView = () => {
    if (!activeWorkspace) return null;
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard 
                  documents={documents} 
                  apis={apis} 
                  workspace={activeWorkspace}
                  onNewDocument={() => {
                    // TODO: Implement document creation logic
                    setActiveView(View.DocumentEditor)
                  }}
                  onRegisterApi={() => setActiveView(View.ApiRegistry)}
                  onSelectDocument={handleSelectDocument}
                />;
      case View.DocumentEditor:
        return <DocumentEditor document={activeDocument || null} collaborators={members} />;
      case View.ApiRegistry:
        return <ApiRegistry apis={apis} workspaceId={activeWorkspace.id} />;
      case View.ApiAnalytics:
        return <ApiAnalytics usageData={mockUsageData} apis={apis} />;
      case View.Settings:
        return <Settings theme={theme} onThemeChange={setTheme} />;
      default:
        return <div>Unknown View</div>;
    }
  };
  
  if (loading || !user || !activeWorkspace) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-background">
      <Sidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onWorkspaceChange={(id) => setActiveWorkspaceId(id)}
      />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}
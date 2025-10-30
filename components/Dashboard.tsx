
import React from 'react';
import { Document, ApiRegistration, Workspace } from '../types';
import { FileText, Code, Users, PlusCircle } from './icons';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  documents: Document[];
  apis: ApiRegistration[];
  workspace: Workspace;
  onNewDocument: () => void;
  onRegisterApi: () => void;
  onSelectDocument: (docId: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string, description: string }> = ({ icon, title, value, description }) => (
    <div className="bg-secondary p-6 rounded-lg">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ documents, apis, workspace, onNewDocument, onRegisterApi, onSelectDocument }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold">Welcome to {workspace.name}</h1>
      <p className="text-muted-foreground mt-1">Here's an overview of your workspace.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard icon={<FileText className="h-5 w-5"/>} title="Documents" value={documents.length} description="Total documents created" />
        <StatCard icon={<Code className="h-5 w-5"/>} title="Registered APIs" value={apis.length} description="APIs being tracked" />
        <StatCard icon={<Users className="h-5 w-5"/>} title="Team Members" value={workspace.members.length} description="Collaborators in workspace" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Documents</h2>
            <button onClick={onNewDocument} className="flex items-center text-sm text-primary-foreground bg-primary px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Document
            </button>
          </div>
          <div className="bg-secondary rounded-lg p-4 space-y-3">
            {documents.slice(0, 5).map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">Modified {formatDistanceToNow(doc.updatedAt.toDate(), { addSuffix: true })}</p>
                </div>
                <button onClick={() => onSelectDocument(doc.id)} className="text-xs text-primary-foreground bg-primary px-2 py-1 rounded">Open</button>
              </div>
            ))}
            {documents.length === 0 && <p className="text-center text-muted-foreground py-4">No documents yet. Create one!</p>}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Registered APIs</h2>
             <button onClick={onRegisterApi} className="flex items-center text-sm text-primary-foreground bg-primary px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
              <PlusCircle className="h-4 w-4 mr-2" />
              Register API
            </button>
          </div>
          <div className="bg-secondary rounded-lg p-4 space-y-3">
            {apis.slice(0, 5).map(api => (
              <div key={api.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                <div>
                    <p className="font-medium">{api.name} <span className="text-xs text-muted-foreground ml-2">v{api.version}</span></p>
                    <p className="text-xs text-muted-foreground">{api.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${api.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{api.status}</span>
              </div>
            ))}
             {apis.length === 0 && <p className="text-center text-muted-foreground py-4">No APIs registered yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ApiRegistration } from '../types';
import { Code, PlusCircle, Eye, EyeOff } from './icons';
import { createApi } from '../services/firestoreService';

interface ApiRegistryProps {
  apis: ApiRegistration[];
  workspaceId: string;
}

const ApiKeyDisplay: React.FC<{ apiKey: string }> = ({ apiKey }) => {
    const [visible, setVisible] = useState(false);
    
    return (
        <div className="flex items-center font-mono text-sm">
            <span>{visible ? apiKey : '••••••••••••••••••••••••'}</span>
            <button onClick={() => setVisible(!visible)} className="ml-2 text-muted-foreground hover:text-foreground">
                {visible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
        </div>
    );
};

export const ApiRegistry: React.FC<ApiRegistryProps> = ({ apis, workspaceId }) => {
  const [search, setSearch] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [newApiName, setNewApiName] = useState('');
  const [newApiDesc, setNewApiDesc] = useState('');
  const [newApiVersion, setNewApiVersion] = useState('1.0.0');

  const handleRegister = async () => {
    if (!newApiName || !newApiDesc || !newApiVersion) {
        alert("Please fill all fields.");
        return;
    }
    await createApi(workspaceId, {
      name: newApiName,
      description: newApiDesc,
      version: newApiVersion,
      status: 'development'
    });
    setNewApiName('');
    setNewApiDesc('');
    setNewApiVersion('1.0.0');
    setShowRegisterModal(false);
  };

  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(search.toLowerCase()) ||
    api.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Registry</h1>
          <p className="text-muted-foreground mt-1">Discover and manage all your APIs in one place.</p>
        </div>
        <button onClick={() => setShowRegisterModal(true)} className="flex items-center text-sm text-primary-foreground bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Register New API
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search APIs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-secondary">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Version</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">API Key</th>
            </tr>
          </thead>
          <tbody>
            {filteredApis.map(api => (
              <tr key={api.id} className="border-b border-border hover:bg-accent">
                <td className="p-4 font-medium">{api.name}</td>
                <td className="p-4 text-muted-foreground">{api.description}</td>
                <td className="p-4 text-muted-foreground">{api.version}</td>
                <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        api.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        api.status === 'deprecated' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                    }`}>{api.status}</span>
                </td>
                <td className="p-4 text-muted-foreground">
                    <ApiKeyDisplay apiKey={api.apiKey} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApis.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-2" />
                <p>No APIs found matching your search.</p>
            </div>
        )}
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl p-8 w-full max-w-md border border-border">
            <h2 className="text-2xl font-bold mb-4">Register a New API</h2>
            <div className="space-y-4">
              <input type="text" placeholder="API Name (e.g., User Service)" value={newApiName} onChange={e => setNewApiName(e.target.value)} className="w-full bg-secondary px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Description" value={newApiDesc} onChange={e => setNewApiDesc(e.target.value)} className="w-full bg-secondary px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring h-24 resize-none"></textarea>
              <input type="text" placeholder="Version (e.g., 1.0.0)" value={newApiVersion} onChange={e => setNewApiVersion(e.target.value)} className="w-full bg-secondary px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setShowRegisterModal(false)} className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleRegister} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
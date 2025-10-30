import React, { useState, useEffect, useCallback } from 'react';
import { Document, UserProfile } from '../types';
import { improveDocumentWithAI } from '../services/geminiService';
import { Sparkles } from './icons';
import { updateDocument } from '../src/services/firestoreService';
import { useDebounce } from '../src/hooks/useDebounce';

interface DocumentEditorProps {
  document: Document | null;
  collaborators: UserProfile[];
}

// A simple markdown renderer component for preview
const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
    // This is a very basic renderer. In a real app, use a library like react-markdown.
    const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold my-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold my-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none p-4 text-foreground" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, collaborators }) => {
  const [localContent, setLocalContent] = useState(document?.content || '');
  const [isImproving, setIsImproving] = useState(false);
  
  const debouncedContent = useDebounce(localContent, 500);

  useEffect(() => {
    setLocalContent(document?.content || '');
  }, [document]);

  useEffect(() => {
    if (debouncedContent !== document?.content && document) {
        updateDocument(document.id, { content: debouncedContent });
    }
  }, [debouncedContent, document]);

  const handleImproveWithAI = async () => {
    if (!document) return;
    setIsImproving(true);
    try {
      const improvedContent = await improveDocumentWithAI(localContent);
      setLocalContent(improvedContent);
      await updateDocument(document.id, { content: improvedContent });
    } finally {
      setIsImproving(false);
    }
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select or create a document to start editing.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold">{document.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {collaborators.map(user => (
              <img
                key={user.id}
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full border-2 border-background"
                title={user.name}
              />
            ))}
          </div>
          <button
            onClick={handleImproveWithAI}
            disabled={isImproving}
            className="flex items-center text-sm text-primary-foreground bg-primary px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImproving ? (
               <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isImproving ? 'Improving...' : 'Improve with AI'}
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          className="w-full h-full p-4 bg-background text-foreground resize-none focus:outline-none font-mono"
          placeholder="Start writing your markdown document..."
        />
        <div className="w-full h-full p-4 bg-secondary border-l border-border overflow-y-auto">
          <MarkdownPreview content={localContent} />
        </div>
      </div>
       <footer className="p-2 border-t border-border text-xs text-muted-foreground text-center">
        Changes are saved automatically.
      </footer>
    </div>
  );
};
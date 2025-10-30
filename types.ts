import { Timestamp } from 'firebase/firestore';

// User object from Firebase Auth
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// User profile stored in Firestore
export interface UserProfile {
  id: string; // uid from auth
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Workspace {
  id: string;
  name:string;
  ownerId: string;
  members: string[]; // array of user uids
  createdAt: Timestamp;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  workspaceId: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApiRegistration {
  id: string;
  name: string;
  description: string;
  openApiSpecUrl?: string;
  status: 'active' | 'deprecated' | 'development';
  version: string;
  apiKey: string;
  workspaceId: string;
  createdAt: Timestamp;
}

export interface ApiUsageData {
    date: string;
    calls: number;
    errors: number;
}

export enum View {
  Dashboard = 'DASHBOARD',
  DocumentEditor = 'DOCUMENT_EDITOR',
  ApiRegistry = 'API_REGISTRY',
  ApiAnalytics = 'API_ANALYTICS',
  Settings = 'SETTINGS',
}

export type Theme = 'light' | 'dark';
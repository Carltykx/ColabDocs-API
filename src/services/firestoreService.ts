import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { Workspace, Document, ApiRegistration, UserProfile } from '../types';

export const subscribeToWorkspaces = (userId: string, callback: (workspaces: Workspace[]) => void) => {
  const q = query(collection(db, 'workspaces'), where('members', 'array-contains', userId));
  
  return onSnapshot(q, (snapshot) => {
    const workspaces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
    callback(workspaces);
  });
};

export const subscribeToDocuments = (workspaceId: string, callback: (documents: Document[]) => void) => {
  const q = query(collection(db, 'documents'), where('workspaceId', '==', workspaceId));

  return onSnapshot(q, (snapshot) => {
    const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
    callback(documents);
  });
};

export const subscribeToApis = (workspaceId: string, callback: (apis: ApiRegistration[]) => void) => {
  const q = query(collection(db, 'apis'), where('workspaceId', '==', workspaceId));

  return onSnapshot(q, (snapshot) => {
    const apis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiRegistration));
    callback(apis);
  });
};

export const updateDocument = async (docId: string, data: Partial<Document>) => {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export const createApi = async (workspaceId: string, apiData: Omit<ApiRegistration, 'id' | 'apiKey' | 'workspaceId' | 'createdAt'>) => {
    await addDoc(collection(db, 'apis'), {
        ...apiData,
        workspaceId,
        apiKey: `key_live_${Math.random().toString(36).substr(2, 16)}`,
        createdAt: serverTimestamp(),
    });
};

export const getWorkspaceMembers = async (memberIds: string[]): Promise<UserProfile[]> => {
    // In a real app, you might query this more efficiently.
    // For now, we fetch one by one. This is not ideal for large teams.
    const memberPromises = memberIds.map(id => doc(db, 'users', id).get());
    const memberDocs = await Promise.all(memberPromises);
    return memberDocs.map(doc => doc.data() as UserProfile).filter(Boolean);
}

import { create } from 'zustand';
import { db } from '../lib/firebase/config';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/utils/firestore';

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  visualTraits: string;
  personality?: string;
  age?: string;
  appearance?: string;
  goals?: string;
  relationships?: string;
  avatarUrl?: string;
}

interface WorldEntry {
  id: string;
  title: string;
  category: 'location' | 'faction' | 'system' | 'lore' | 'timeline' | 'relic';
  content: string;
  imageUrl?: string;
}

interface StudioState {
  characters: Character[];
  worldEntries: WorldEntry[];
  isLoading: boolean;
  activeId: string | null;
  
  subscribe: (projectId: string) => () => void;
  addCharacter: (projectId: string, char: Partial<Character>) => Promise<void>;
  updateCharacter: (projectId: string, id: string, char: Partial<Character>) => Promise<void>;
  removeCharacter: (projectId: string, id: string) => Promise<void>;
  addWorldEntry: (projectId: string, entry: Partial<WorldEntry>) => Promise<void>;
  updateWorldEntry: (projectId: string, id: string, entry: Partial<WorldEntry>) => Promise<void>;
  removeWorldEntry: (projectId: string, id: string) => Promise<void>;
}

export const useStudioStore = create<StudioState>((set) => ({
  characters: [],
  worldEntries: [],
  isLoading: false,
  activeId: null,

  subscribe: (projectId: string) => {
    set({ isLoading: true });
    
    // Subscribe to characters
    const charUnsub = onSnapshot(collection(db, 'projects', projectId, 'characters'), (snap) => {
      set({ characters: snap.docs.map(d => ({ id: d.id, ...d.data() } as Character)) });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `projects/${projectId}/characters`);
    });

    // Subscribe to worldbuilding
    const worldUnsub = onSnapshot(collection(db, 'projects', projectId, 'worldbuilding'), (snap) => {
      set({ worldEntries: snap.docs.map(d => ({ id: d.id, ...d.data() } as WorldEntry)) });
      set({ isLoading: false });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `projects/${projectId}/worldbuilding`);
    });

    return () => {
      charUnsub();
      worldUnsub();
    };
  },

  addCharacter: async (projectId, char) => {
    const path = `projects/${projectId}/characters`;
    try {
      await addDoc(collection(db, 'projects', projectId, 'characters'), {
        name: char.name || 'New Character',
        role: char.role || 'Supporting',
        description: char.description || '',
        visualTraits: char.visualTraits || '',
        personality: '',
        motivation: '',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateCharacter: async (projectId, id, char) => {
    const path = `projects/${projectId}/characters/${id}`;
    try {
      await updateDoc(doc(db, 'projects', projectId, 'characters', id), {
        ...char,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  removeCharacter: async (projectId, id) => {
    const path = `projects/${projectId}/characters/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', projectId, 'characters', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  addWorldEntry: async (projectId, entry) => {
    const path = `projects/${projectId}/worldbuilding`;
    try {
      await addDoc(collection(db, 'projects', projectId, 'worldbuilding'), {
        title: entry.title || 'New Entry',
        category: entry.category || 'lore',
        content: entry.content || '',
        tags: [],
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateWorldEntry: async (projectId, id, entry) => {
    const path = `projects/${projectId}/worldbuilding/${id}`;
    try {
      await updateDoc(doc(db, 'projects', projectId, 'worldbuilding', id), {
        ...entry,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  removeWorldEntry: async (projectId, id) => {
    const path = `projects/${projectId}/worldbuilding/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', projectId, 'worldbuilding', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },
}));

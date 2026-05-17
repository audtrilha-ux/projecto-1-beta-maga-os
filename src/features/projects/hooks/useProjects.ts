import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { db } from '../../../lib/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../../lib/utils/firestore';

export interface Project {
  projectId: string;
  title: string;
  description?: string;
  coverUrl?: string;
  type: 'novel' | 'manga' | 'script' | 'webtoon';
  tags?: string[];
  subCategory?: string;
  content?: string;
  mangaData?: string; // JSON string for studio/manga state
  updatedAt: any;
  createdAt: any;
}

export function useProjects() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), projectId: doc.id } as Project));
      setProjects(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const createProject = async (data: Partial<Project>) => {
    if (!user) return null;
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ownerId: user.uid,
        title: data.title || 'Untitled ' + (data.type || 'Project'),
        description: data.description || '',
        coverUrl: data.coverUrl || '',
        type: data.type || 'novel',
        tags: data.tags || [],
        subCategory: data.subCategory || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await loadProjects();
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.projectId !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const shareProject = async (project: Project) => {
    if (!user) return;
    const path = 'posts';
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || '',
        projectId: project.projectId,
        title: `Protocolo Iniciado: ${project.title}`,
        content: project.description || `Um novo sistema narrativo do tipo ${project.type} está sendo processado nos servidores 3C.`,
        mediaUrl: project.coverUrl || '',
        mediaType: 'image',
        tags: project.tags || [],
        category: project.type,
        subCategory: project.subCategory,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp()
      });
      alert('Projeto compartilhado no Feed Neural!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return { projects, loading, createProject, deleteProject, shareProject, refresh: loadProjects };
}

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment,
  where
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { Post } from '../types';
import { useAuthStore } from '../../../stores/authStore';

import { handleFirestoreError, OperationType } from '../../../lib/utils/firestore';

export function usePosts(filterType?: string) {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'posts';
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (filterType) {
      q = query(
        collection(db, 'posts'),
        where('category', '==', filterType),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (content: string, title?: string, projectId?: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio') => {
    if (!user) return;
    const path = 'posts';

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || '',
        projectId: projectId || null,
        title: title || '',
        content,
        mediaUrl: mediaUrl || '',
        mediaType: mediaType || null,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    const path = `posts/${postId}`;
    const postRef = doc(db, 'posts', postId);

    try {
      await updateDoc(postRef, {
        likeCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return { posts, loading, createPost, likePost };
}

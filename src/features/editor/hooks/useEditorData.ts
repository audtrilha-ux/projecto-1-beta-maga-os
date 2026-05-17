import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../../lib/utils/firestore';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { CharacterCount } from '@tiptap/extension-character-count';

export function useEditorData(projectId: string | null) {
  const [project, setProject] = useState<any>(null);
  const [panels, setPanels] = useState<any[]>([]);
  const [mangaData, setMangaData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Comece a escrever sua história aqui...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none max-w-none min-h-[700px] text-zinc-300 font-mono text-sm leading-relaxed',
      },
    },
  });

  const loadProject = useCallback(async () => {
    if (!projectId || !editor) return;
    setIsLoading(true);
    try {
      const ref = doc(db, 'projects', projectId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProject(data);
        if (data.content) editor.commands.setContent(data.content);
        if (data.panels) setPanels(data.panels);
        if (data.mangaData) setMangaData(data.mangaData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `projects/${projectId}`);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, editor]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const saveProject = async () => {
    if (!projectId || !editor) return;
    const ref = doc(db, 'projects', projectId);
    try {
      await updateDoc(ref, {
        content: editor.getHTML(),
        panels,
        mangaData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const updateProject = async (updates: any) => {
    if (!projectId) return;
    const ref = doc(db, 'projects', projectId);
    try {
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      setProject((prev: any) => ({ ...prev, ...updates }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  return {
    editor,
    project,
    panels,
    setPanels,
    mangaData,
    setMangaData,
    isLoading,
    saveProject,
    updateProject,
    refresh: loadProject
  };
}

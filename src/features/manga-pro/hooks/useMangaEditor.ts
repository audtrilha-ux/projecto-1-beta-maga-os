import { useState, useCallback, useMemo } from 'react';

export type MangaElementType = 'panel' | 'bubble' | 'text' | 'image' | 'stroke';

export interface MangaElement {
  id: string;
  type: MangaElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  content?: string;
  style?: any;
  layerId: string;
  visible: boolean;
  locked: boolean;
}

export interface PageData {
  id: number;
  elements: MangaElement[];
}

export interface MangaState {
  pages: PageData[];
  currentPageId: number;
  selectedElementId: string | null;
  history: any[];
  historyIndex: number;
}

export function useMangaEditor(initialData?: string) {
  const [state, setState] = useState<MangaState>(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData);
      } catch (e) {
        console.error("Failed to parse initial manga data", e);
      }
    }
    return {
      pages: Array.from({ length: 24 }, (_, i) => ({ id: i + 1, elements: [] })),
      currentPageId: 1,
      selectedElementId: null,
      history: [],
      historyIndex: -1,
    };
  });

  const currentPage = useMemo(() => 
    state.pages.find(p => p.id === state.currentPageId) || state.pages[0],
    [state.pages, state.currentPageId]
  );

  const selectedElement = useMemo(() => 
    currentPage.elements.find(e => e.id === state.selectedElementId) || null,
    [currentPage.elements, state.selectedElementId]
  );

  const addElement = useCallback((type: MangaElementType, props: Partial<MangaElement> = {}) => {
    const newElement: MangaElement = {
      id: `el-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      w: 100,
      h: 100,
      rotation: 0,
      visible: true,
      locked: false,
      layerId: 'Default',
      ...props
    };

    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.currentPageId 
          ? { ...p, elements: [...p.elements, newElement] }
          : p
      ),
      selectedElementId: newElement.id
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<MangaElement>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.currentPageId 
          ? { ...p, elements: p.elements.map(e => e.id === id ? { ...e, ...updates } : e) }
          : p
      )
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const setCurrentPageId = useCallback((id: number) => {
    setState(prev => ({ ...prev, currentPageId: id, selectedElementId: null }));
  }, []);

  const serialize = useCallback(() => {
    return JSON.stringify(state);
  }, [state]);

  return {
    state,
    currentPage,
    selectedElement,
    addElement,
    updateElement,
    selectElement,
    setCurrentPageId,
    serialize
  };
}

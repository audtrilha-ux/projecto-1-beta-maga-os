import { useEffect } from 'react';
import { useStudioStore } from '../../../stores/studioStore';

export function useStudio(projectId: string | null) {
  const store = useStudioStore();

  useEffect(() => {
    if (projectId) {
      return store.subscribe(projectId);
    }
  }, [projectId, store.subscribe]);

  return {
    ...store
  };
}

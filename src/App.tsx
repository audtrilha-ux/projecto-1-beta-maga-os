/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { MainLayout } from './components/layout/MainLayout';
import { AuthScreen } from './features/auth/components/AuthScreen';
import { ProjectDashboard } from './features/projects/components/ProjectDashboard';
import { EditorPage } from './features/editor/components/EditorPage';
import { create } from 'zustand';

// Simple router-like state
interface NavState {
  currentView: 'dashboard' | 'editor' | 'visualizer' | 'studio' | 'feed' | 'profile' | 'manga-pro' | 'project-workspace' | 'community';
  activeProjectId: string | null;
  setNav: (view: 'dashboard' | 'editor' | 'visualizer' | 'studio' | 'feed' | 'profile' | 'manga-pro' | 'project-workspace' | 'community', projectId?: string | null) => void;
}

export const useNavStore = create<NavState>((set) => ({
  currentView: 'dashboard', 
  activeProjectId: null,
  setNav: (view, projectId = null) => set({ currentView: view, activeProjectId: projectId }),
}));

import { VisualizerPage } from './features/visualizer/components/VisualizerPage';
import { StudioPage } from './features/studio/components/StudioPage';
import { CommunityPage } from './features/community/components/CommunityPage';
import { FeedPage } from './features/posts/components/FeedPage';
import { ProfilePage } from './features/profiles/components/ProfilePage';
import { MangaProPage } from './features/manga-pro/components/MangaProPage';
import { ProjectWorkspace } from './features/projects/components/ProjectWorkspace';

export default function App() {
  const { user, loading, init, initialized } = useAuthStore();
  const { currentView } = useNavStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ProjectDashboard />;
      case 'editor':
        return <EditorPage />;
      case 'visualizer':
        return <VisualizerPage />;
      case 'studio':
        return <StudioPage />;
      case 'manga-pro':
        return <MangaProPage />;
      case 'project-workspace':
        return <ProjectWorkspace />;
      case 'feed':
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
}

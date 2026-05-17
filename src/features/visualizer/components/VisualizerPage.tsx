import { useState } from 'react';
import { useNavStore } from '../../../App';
import { useEditorData } from '../../editor/hooks/useEditorData';
import { useStudio } from '../../studio/hooks/useStudio';
import { 
  Sparkles, 
  ImageIcon, 
  Split,
  Layers,
  MessageSquare,
  Trash2,
  Download,
  Maximize2,
  Zap,
  ChevronLeft,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

export function VisualizerPage() {
  const { activeProjectId, setNav } = useNavStore();
  const { 
    project, 
    panels, 
    setPanels, 
    isLoading: isProjectLoading, 
    saveProject
  } = useEditorData(activeProjectId);
  
  const { characters } = useStudio(activeProjectId);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [showAutoSave, setShowAutoSave] = useState(false);

  const handleSave = async () => {
    await saveProject();
    setShowAutoSave(true);
    setTimeout(() => setShowAutoSave(false), 2000);
  };


  const analyzeScript = async () => {
    // This is a bit tricky since we don't have the editor instance here directly
    // In a real app, we'd fetch the content from Firestore first or pass it
    if (!project?.content) return;
    
    setIsAnalyzing(true);
    const studioContext = {
      characters: characters.map(c => ({ name: c.name, visual: c.visualTraits, role: c.role })),
    };

    try {
      const res = await fetch('/api/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          script: project.content, 
          projectType: project.type,
          studioContext
        }),
      });
      const data = await res.json();
      const mappedPanels = data.map((p: any) => ({
        ...p,
        id: Math.random().toString(36).substring(2, 9),
        balloons: p.dialogues.map((d: any, di: number) => ({
          id: Math.random().toString(36).substring(2, 9),
          x: 20 + (di * 10),
          y: 20 + (di * 20),
          text: d.text,
          width: 150,
          height: 100
        }))
      }));
      setPanels(mappedPanels);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePanelImage = async (panelId: string) => {
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;
    
    setIsGenerating(true);
    setActivePanelId(panelId);
    try {
      const res = await fetch('/api/generate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: panel.prompt }),
      });
      const data = await res.json();
      setPanels(prev => prev.map(p => p.id === panelId ? { ...p, imageUrl: data.imageUrl } : p));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 overflow-hidden">
      {/* Dynamic Sub-header Info */}
      <AnimatePresence>
        {showAutoSave && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-600/10 border-b border-indigo-500/20 py-2 text-center overflow-hidden"
          >
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">Structure Sincronized / Panels Updated</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNav('dashboard')} 
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all border border-zinc-800 shadow-xl active:scale-95"
            >
               <ChevronLeft className="w-5 h-5 text-zinc-500" />
            </button>
            <div className="space-y-0.5">
               <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Manga Engine</span>
               </div>
               <h1 className="text-2xl font-serif font-bold text-white tracking-tight italic leading-none">{project?.title || 'Visualizer'}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={handleSave}
             className="p-3 bg-zinc-900 text-zinc-400 rounded-2xl hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
           >
              <Save size={18} />
           </button>
           <button 
             onClick={analyzeScript}
             disabled={isAnalyzing}
             className="px-8 py-3.5 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 shadow-2xl active:scale-95 flex items-center gap-3"
           >
             {isAnalyzing ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
             ) : <Split size={14} />}
             Analyze Script
           </button>
        </div>
      </header>

      {/* Panels Grid */}
      <div className="flex-1 overflow-y-auto p-12 editor-scroll">
        <div className="max-w-7xl mx-auto space-y-16">
          {panels.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-8 opacity-20">
               <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="p-20 border-2 border-dashed border-zinc-600 rounded-full">
                     <ImageIcon size={120} />
                  </motion.div>
               </div>
               <div className="text-center space-y-2">
                 <p className="text-2xl font-serif font-black italic tracking-widest">Awaiting Narrative</p>
                 <p className="text-sm font-medium tracking-widest uppercase">Click 'Analyze Script' to generate visual nodes</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence>
                {panels.map((panel, idx) => (
                  <motion.div 
                    key={panel.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-zinc-900/40 rounded-[3rem] border border-zinc-900 overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:border-indigo-500/30 transition-all"
                  >
                    <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Node {idx + 1}</span>
                       <div className="flex gap-2">
                          <button className="p-2 text-zinc-600 hover:text-indigo-400"><Layers size={14} /></button>
                          <button className="p-2 text-zinc-600 hover:text-red-500"><Trash2 size={14} /></button>
                       </div>
                    </div>

                    <div className="aspect-[4/5] bg-zinc-950 relative group/img overflow-hidden">
                      {panel.imageUrl ? (
                        <>
                          <img src={panel.imageUrl} alt="Panel" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                             <button onClick={() => generatePanelImage(panel.id)} className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-indigo-500 hover:scale-110 transition-all">
                                <Zap size={32} />
                             </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => generatePanelImage(panel.id)}
                          className="w-full h-full flex flex-col items-center justify-center gap-6 group/btn"
                        >
                          <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 group-hover/btn:border-indigo-500/50 transition-all">
                             <ImageIcon size={40} className="text-zinc-700 group-hover/btn:text-indigo-400" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Initialize Visual</span>
                        </button>
                      )}
                    </div>

                    <div className="p-8 space-y-6">
                       <p className="text-xs text-zinc-400 font-medium italic leading-relaxed line-clamp-3">
                         {panel.prompt}
                       </p>
                       <div className="space-y-3">
                          {panel.dialogues.map((d, di) => (
                             <div key={di} className="flex gap-4 p-3 bg-zinc-950 rounded-xl border border-zinc-900/50">
                                <span className="text-[9px] font-black uppercase text-indigo-400 italic min-w-[60px]">{d.character}</span>
                                <span className="text-[10px] text-zinc-500 italic">"{d.text}"</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

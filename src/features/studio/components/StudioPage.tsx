import { useNavStore } from '../../../App';
import { StudioSidebar } from './StudioSidebar';
import { 
  ChevronLeft, 
  Library, 
  Sparkles, 
  User, 
  Map, 
  Search, 
  Target, 
  Zap,
  Globe,
  Users,
  Cpu,
  History,
  Anchor,
  Box
} from 'lucide-react';
import { useStudio } from '../hooks/useStudio';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

export function StudioPage() {
  const { activeProjectId, setNav } = useNavStore();
  const { characters, worldEntries } = useStudio(activeProjectId);

  const getEntryIcon = (category: string) => {
    switch (category) {
      case 'location': return <Globe size={24} />;
      case 'faction': return <Users size={24} />;
      case 'system': return <Cpu size={24} />;
      case 'timeline': return <History size={24} />;
      case 'relic': return <Anchor size={24} />;
      default: return <Target size={24} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'location': return 'text-emerald-400 border-emerald-500/20';
      case 'faction': return 'text-indigo-400 border-indigo-500/20';
      case 'system': return 'text-purple-400 border-purple-500/20';
      case 'timeline': return 'text-rose-400 border-rose-500/20';
      case 'relic': return 'text-sky-400 border-sky-500/20';
      default: return 'text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNav('dashboard')} 
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all border border-zinc-800"
            >
               <ChevronLeft className="w-5 h-5 text-zinc-500" />
            </button>
            <div className="space-y-0.5">
               <div className="flex items-center gap-2 text-indigo-400">
                  <Library size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Base de Conhecimento Neural</span>
               </div>
               <h1 className="text-2xl font-serif font-bold text-white tracking-tight italic leading-none">Cérebro do Projeto</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
         {/* Left Panel: Specialized Sidebar */}
         <aside className="w-96 border-r border-zinc-900 bg-zinc-950/50 flex flex-col overflow-hidden">
             <StudioSidebar projectId={activeProjectId || ''} />
         </aside>

         {/* Main Content Area: Visual Asset Catalog */}
         <main className="flex-1 overflow-y-auto p-12 editor-scroll bg-zinc-950">
            <div className="max-w-6xl mx-auto space-y-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="h-px flex-1 bg-zinc-900"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Visualização da Matriz</span>
                     <div className="h-px flex-1 bg-zinc-900"></div>
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-white italic tracking-tighter">Atlas Narrativo</h2>
               </div>

               <section className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
                        <User size={14} /> Persona Nodes (Personagens)
                     </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                     {characters.map((char) => (
                        <div key={char.id} className="bg-zinc-900/40 rounded-[3rem] border border-zinc-900 p-10 space-y-8 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                           
                           <div className="flex items-start gap-8 relative z-10">
                              <div className="w-28 h-28 rounded-[2.5rem] bg-zinc-950 border border-zinc-900 overflow-hidden relative shadow-2xl shrink-0">
                                 {char.avatarUrl ? (
                                    <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-indigo-400 font-serif italic text-3xl bg-indigo-600/10">
                                       {char.name.charAt(0)}
                                    </div>
                                 )}
                              </div>
                              <div className="space-y-3 pt-2">
                                 <h4 className="text-3xl font-serif font-black text-white tracking-tighter italic leading-none">{char.name}</h4>
                                 <div className="flex gap-2">
                                    <span className="px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">{char.role}</span>
                                    {char.age && <span className="px-4 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest">{char.age}</span>}
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 gap-6 relative z-10">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <Target size={12} className="text-zinc-600" />
                                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Objetivos e Motivação</span>
                                 </div>
                                 <p className="text-[12px] text-zinc-300 font-medium italic border-l-2 border-indigo-500/30 pl-4 py-1">
                                    {char.goals || 'Motivação não definida na matriz...'}
                                 </p>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <Box size={12} className="text-zinc-600" />
                                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Personalidade e Essência</span>
                                 </div>
                                 <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                                    {char.personality || 'Perfil psicológico em processamento...'}
                                 </p>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                              <span className="text-indigo-500">Asset Neural Online</span>
                              <div className="flex gap-1">
                                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                 <div className={cn("w-2 h-2 rounded-full", char.visualTraits ? "bg-indigo-500" : "bg-zinc-800")} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
                        <Map size={14} /> Codex Segments (Mundo)
                     </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {worldEntries.map((entry) => (
                        <div key={entry.id} className={cn(
                          "bg-zinc-900/40 rounded-[3rem] border border-zinc-900 p-10 flex flex-col gap-8 hover:bg-zinc-900/60 transition-all border-l-4 group",
                          getCategoryColor(entry.category)
                        )}>
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-[1.8rem] bg-zinc-950 flex items-center justify-center text-zinc-700 shrink-0 border border-zinc-900 group-hover:text-white transition-colors">
                                 {getEntryIcon(entry.category)}
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{entry.category}</span>
                                 <h4 className="text-3xl font-serif font-black italic text-white leading-none tracking-tight">{entry.title}</h4>
                              </div>
                           </div>
                           <p className="text-[13px] text-zinc-400 leading-relaxed italic font-medium">
                              {entry.content}
                           </p>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
         </main>
      </div>
    </div>
  );
}

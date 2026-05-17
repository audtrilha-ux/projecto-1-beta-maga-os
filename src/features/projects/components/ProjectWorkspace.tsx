import { useState } from 'react';
import { useNavStore } from '../../../App';
import { useEditorData } from '../../editor/hooks/useEditorData';
import { 
  Plus, 
  Book, 
  Users, 
  Globe, 
  Clock, 
  FileText, 
  ScrollText, 
  Layout, 
  ChevronRight, 
  Settings, 
  ArrowLeft,
  Search,
  MoreVertical,
  Star,
  History,
  Cloud,
  ChevronDown,
  Sparkles,
  PenTool,
  Brain,
  MessageSquare,
  Layers,
  Map,
  Sword,
  Shield,
  Zap,
  ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

type ProjectSection = 'novel' | 'characters' | 'world' | 'notes' | 'timeline' | 'manga';
type NovelSubSection = 'overview' | 'chapters' | 'arcs' | 'pages' | 'drafts';

export function ProjectWorkspace() {
  const { setNav, activeProjectId } = useNavStore();
  const { project, isLoading, updateProject } = useEditorData(activeProjectId);
  
  const [activeSection, setActiveSection] = useState<ProjectSection>('novel');
  const [activeNovelSub, setActiveNovelSub] = useState<NovelSubSection>('overview');
  
  const handleAddItem = () => {
    if (activeSection === 'novel') {
      if (activeNovelSub === 'chapters') {
        const currentChapters = project.chapters || [];
        const newChapter = {
          id: `ch-${Date.now()}`,
          title: `Capítulo ${currentChapters.length + 1}`,
          wordCount: '0',
          status: 'Rascunho',
          createdAt: new Date().toISOString()
        };
        updateProject({ chapters: [...currentChapters, newChapter] });
      } else if (activeNovelSub === 'arcs') {
        const currentArcs = project.arcs || [];
        const newArc = {
          id: `arc-${Date.now()}`,
          title: 'Novo Arco Narrativo',
          description: 'Descreva a essência deste arco...',
          progress: 0,
          chapters: []
        };
        updateProject({ arcs: [...currentArcs, newArc] });
      } else if (activeNovelSub === 'drafts' || activeNovelSub === 'pages') {
        const type = activeNovelSub === 'pages' ? 'page' : 'draft';
        const collection = activeNovelSub === 'pages' ? (project.pages || []) : (project.drafts || []);
        const newItem = {
          id: `${type}-${Date.now()}`,
          title: `Nova ${activeNovelSub === 'pages' ? 'Cena' : 'Ideia'}`,
          content: '',
          updatedAt: new Date().toISOString()
        };
        updateProject({ [activeNovelSub]: [...collection, newItem] });
      }
    } else if (activeSection === 'characters') {
      const currentChars = project.characters || [];
      const newChar = {
        id: `char-${Date.now()}`,
        name: 'Novo Personagem',
        role: 'Coadjuvante',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        description: '...'
      };
      updateProject({ characters: [...currentChars, newChar] });
    } else if (activeSection === 'world') {
      const currentWorld = project.world || { locations: [], timeline: [], factions: [] };
      const newLocation = {
        id: `loc-${Date.now()}`,
        name: 'Novo Local',
        description: 'Descrição do ambiente...'
      };
      updateProject({ world: { ...currentWorld, locations: [...(currentWorld.locations || []), newLocation] } });
    } else if (activeSection === 'notes') {
      const currentNotes = project.notes || [];
      const newNote = {
        id: `note-${Date.now()}`,
        content: 'Nova inspiração...',
        tags: ['Ideia'],
        createdAt: new Date().toISOString()
      };
      updateProject({ notes: [...currentNotes, newNote] });
    }
  };

  const handleChangeCover = () => {
    const newUrl = prompt('URL da nova capa:');
    if (newUrl) updateProject({ coverUrl: newUrl });
  };

  if (isLoading || !project) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-300 flex overflow-hidden font-sans select-none">
      {/* Side Navigation (Project Core Sections) */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-[#0d0d0f] flex flex-col z-50 shrink-0">
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center px-4 md:px-6 gap-3">
          <button 
            onClick={() => setNav('dashboard')}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="hidden md:flex flex-col overflow-hidden">
             <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest leading-none">Projetos</span>
             <span className="text-xs font-black text-white truncate italic mt-1">{project.title}</span>
          </div>
        </header>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto no-scrollbar px-2 md:px-4">
           <SidebarItem 
              icon={<Book size={20} />} 
              label="Novel" 
              active={activeSection === 'novel'} 
              onClick={() => setActiveSection('novel')} 
           />
           <SidebarItem 
              icon={<Layout size={20} />} 
              label="Manga Studio" 
              active={activeSection === 'manga'} 
              onClick={() => setActiveSection('manga')} 
           />
           <SidebarItem 
              icon={<Users size={20} />} 
              label="Personagens" 
              active={activeSection === 'characters'} 
              onClick={() => setActiveSection('characters')} 
           />
           <SidebarItem 
              icon={<Globe size={20} />} 
              label="Mundo / Lore" 
              active={activeSection === 'world'} 
              onClick={() => setActiveSection('world')} 
           />
           <SidebarItem 
              icon={<ScrollText size={20} />} 
              label="Notas do Autor" 
              active={activeSection === 'notes'} 
              onClick={() => setActiveSection('notes')} 
           />
           <SidebarItem 
              icon={<Clock size={20} />} 
              label="Timeline" 
              active={activeSection === 'timeline'} 
              onClick={() => setActiveSection('timeline')} 
           />

           <div className="pt-8 pb-4 px-4 hidden md:block">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Configurações</div>
           </div>
           
           <SidebarItem 
              icon={<Settings size={20} />} 
              label="Ajustes do Projeto" 
              className="mt-auto"
           />
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0c]">
         <header className="h-16 md:h-20 border-b border-white/5 bg-[#0d0d0f]/50 flex items-center justify-between px-6 md:px-10 shrink-0">
            <div className="flex items-center gap-6">
                <h2 className="text-xl md:text-2xl font-serif font-black text-white italic tracking-tight">
                   {activeSection === 'novel' ? 'Novel Core' : 
                    activeSection === 'manga' ? 'Manga Studio Pro' :
                    activeSection === 'characters' ? 'Banco de Personagens' : 
                    activeSection === 'world' ? 'Construção de Universo' : 
                    activeSection === 'notes' ? 'Ideário Criativo' : 'Cronologia da Obra'}
                </h2>
                
                {activeSection === 'novel' && (
                  <div className="hidden lg:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
                     <SubTab 
                        label="Visão Geral" 
                        active={activeNovelSub === 'overview'} 
                        onClick={() => setActiveNovelSub('overview')} 
                     />
                     <SubTab 
                        label="Capítulos" 
                        active={activeNovelSub === 'chapters'} 
                        onClick={() => setActiveNovelSub('chapters')} 
                     />
                     <SubTab 
                        label="Arcos" 
                        active={activeNovelSub === 'arcs'} 
                        onClick={() => setActiveNovelSub('arcs')} 
                     />
                     <SubTab 
                        label="Páginas" 
                        active={activeNovelSub === 'pages'} 
                        onClick={() => setActiveNovelSub('pages')} 
                     />
                     <SubTab 
                        label="Rascunhos" 
                        active={activeNovelSub === 'drafts'} 
                        onClick={() => setActiveNovelSub('drafts')} 
                     />
                  </div>
                )}
            </div>

            <div className="flex items-center gap-4">
               <button 
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
               >
                  <Plus size={14} />
                  NOVO ITEM
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 md:p-10 editor-scroll">
            <AnimatePresence mode="wait">
               {activeSection === 'novel' && activeNovelSub === 'overview' && (
                  <motion.div 
                    key="novel-overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                  >
                     <div className="xl:col-span-2 space-y-8">
                        <SectionCard title="SÍNTESE DA OBRA">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Nome da Obra</label>
                                    <div className="relative group/input">
                                       <input 
                                          type="text" 
                                          defaultValue={project.title}
                                          onBlur={(e) => updateProject({ title: e.target.value })}
                                          className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-white font-serif italic text-lg focus:border-indigo-500/50 outline-none transition-all"
                                       />
                                       <PenTool size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800 group-hover/input:text-indigo-500 transition-colors pointer-events-none" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Sinopse Curta</label>
                                    <textarea 
                                       className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 h-32 resize-none focus:border-indigo-500/50 outline-none transition-all editor-scroll"
                                       defaultValue={project.description || ""}
                                       placeholder="Descreva a alma da sua história..."
                                       onBlur={(e) => updateProject({ description: e.target.value })}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <div className="aspect-[2/3] bg-zinc-900 rounded-3xl border-4 border-zinc-950 shadow-2xl relative overflow-hidden group">
                                    {project.coverUrl ? (
                                       <img src={project.coverUrl} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt="Cover" />
                                    ) : (
                                       <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-700">
                                          <ImageIcon size={48} />
                                          <span className="text-[10px] font-black uppercase tracking-widest">Sem Capa</span>
                                       </div>
                                    )}
                                    <button 
                                       onClick={handleChangeCover}
                                       className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl"
                                    >
                                       <PenTool size={16} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </SectionCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <SectionCard title="DADOS TÉCNICOS">
                              <div className="p-8 space-y-6">
                                 <DataRow label="Gênero" value="Cyberpunk / Neural Noir" />
                                 <DataRow label="Tags" value="#Futurismo, #IA, #Dualidade" />
                                 <DataRow label="Status" value="Em Desenvolvimento" />
                                 <DataRow label="Público" value="Seinen / Adulto" />
                              </div>
                           </SectionCard>
                           <SectionCard title="CONQUISTAS / PROGRESSO">
                              <div className="p-8 flex flex-col justify-center h-full space-y-6">
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Capítulos Escritos</span>
                                       <span className="text-xl font-serif font-black italic text-indigo-500">12/24</span>
                                    </div>
                                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                       <div className="h-full bg-indigo-600 w-1/2 rounded-full" />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5">
                                       <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Palavras</span>
                                       <span className="text-lg font-serif font-black text-white italic">42.5k</span>
                                    </div>
                                    <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5">
                                       <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Personagens</span>
                                       <span className="text-lg font-serif font-black text-white italic">8</span>
                                    </div>
                                 </div>
                              </div>
                           </SectionCard>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <SectionCard title="ATIVIDADE RECENTE">
                           <div className="p-8 space-y-6">
                              <ActivityItem label="Capítulo 12 Original" time="2 horas atrás" />
                              <ActivityItem label="Rascunho de Cena 'O Encontro'" time="Ontem" />
                              <ActivityItem label="Lore: A Cidade de Neo-V" time="2 dias atrás" />
                              <ActivityItem label="Personagem: Kaelis" time="Semana passada" />
                           </div>
                        </SectionCard>
                        
                        <SectionCard title="PRÓXIMOS PASSOS">
                           <div className="p-8 space-y-4">
                              <TodoItem label="Finalizar Arco 2" checked={false} />
                              <TodoItem label="Revisar Diálogos Cap 11" checked={true} />
                              <TodoItem label="Expandir Lore de Facções" checked={false} />
                              <button className="w-full py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                 <Plus size={14} />
                                 Adicionar Meta
                              </button>
                           </div>
                        </SectionCard>
                     </div>
                  </motion.div>
               )}

               {activeSection === 'novel' && activeNovelSub === 'chapters' && (
                  <motion.div 
                    key="novel-chapters"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <h3 className="text-xl font-serif font-black text-white italic">Sumário de Capítulos</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Acesso rápido ao manuscrito</p>
                        </div>
                        <div className="flex gap-4">
                           <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400">
                              <Layers size={14} />
                              Reordenar
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                              <Plus size={14} />
                              CRIAR CAPÍTULO
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(project.chapters || []).map((ch: any, i: number) => (
                           <ChapterCard 
                             key={ch.id || i}
                             number={i + 1}
                             title={ch.title}
                             wordCount={ch.wordCount || "0"}
                             status={ch.status || "Rascunho"}
                             onClick={() => setNav('editor', activeProjectId)}
                           />
                        ))}
                        {(!project.chapters || project.chapters.length === 0) && (
                          <button 
                            onClick={handleAddItem}
                            className="aspect-video bg-zinc-900/10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-zinc-700 hover:text-white hover:border-indigo-500/50 transition-all"
                          >
                             <div className="p-4 bg-zinc-900 rounded-2xl shadow-xl transition-all"><Plus size={24} /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest">Escrever Primeiro Capítulo</span>
                          </button>
                        )}
                     </div>
                  </motion.div>
               )}

               {activeSection === 'novel' && activeNovelSub === 'arcs' && (
                  <motion.div 
                    key="novel-arcs"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <h3 className="text-xl font-serif font-black text-white italic">Arcos Narrativos</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Estrutura macro da história</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                           <Plus size={14} />
                           NOVO ARCO
                        </button>
                     </div>

                     <div className="space-y-6">
                        {(project.arcs || []).map((arc: any) => (
                          <ArcItem 
                             key={arc.id}
                             title={arc.title}
                             description={arc.description} 
                             progress={arc.progress}
                             chapters={arc.chapters || []}
                          />
                        ))}
                        {(!project.arcs || project.arcs.length === 0) && (
                           <div className="h-48 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-zinc-700">
                              <Layers size={32} />
                              <p className="text-[10px] font-black uppercase tracking-widest">Nenhum arco definido</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
               )}

               {activeSection === 'novel' && (activeNovelSub === 'pages' || activeNovelSub === 'drafts') && (
                  <motion.div 
                    key="novel-docs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                     {(activeNovelSub === 'pages' ? (project.pages || []) : (project.drafts || [])).map((doc: any, i: number) => (
                        <div key={doc.id || i} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl hover:bg-zinc-900/60 transition-all cursor-pointer group">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-zinc-950 rounded-xl text-zinc-600 group-hover:text-indigo-400 transition-all">
                                 <FileText size={20} />
                              </div>
                              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{activeNovelSub === 'pages' ? 'CENA' : 'RASCUNHO'}</span>
                           </div>
                           <h4 className="text-white font-serif italic font-black text-lg mb-2">
                              {doc.title}
                           </h4>
                           <p className="text-[10px] text-zinc-600 font-medium italic line-clamp-2">
                              {doc.content || (activeNovelSub === 'pages' ? "Descrição granular dos eventos desta unidade narrativa..." : "Notas rápidas e reflexões sobre direções alternativas para a trama...")}
                           </p>
                           <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">v2.1</span>
                              <ChevronRight size={14} className="text-zinc-800" />
                           </div>
                        </div>
                     ))}
                     {(!(activeNovelSub === 'pages' ? project.pages : project.drafts) || (activeNovelSub === 'pages' ? project.pages.length : project.drafts.length) === 0) && (
                       <button 
                        onClick={handleAddItem}
                        className="h-48 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-zinc-700 hover:text-white transition-all"
                       >
                          <Plus size={32} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Adicionar {activeNovelSub === 'pages' ? 'Cena' : 'Rascunho'}</p>
                       </button>
                     )}
                  </motion.div>
               )}

               {activeSection === 'manga' && (
                  <motion.div 
                    key="manga-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-[50vh] gap-8"
                  >
                     <div className="w-32 h-32 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center text-indigo-500 shadow-2xl">
                        <Layout size={64} />
                     </div>
                     <div className="text-center space-y-2">
                        <h3 className="text-2xl font-serif font-black text-white italic">Motor do Studio Pro</h3>
                        <p className="text-sm text-zinc-500 max-w-sm">Acesse o ambiente avançado de diagramação, arte e storyboarding neural.</p>
                     </div>
                     <button 
                        onClick={() => setNav('manga-pro', activeProjectId)}
                        className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-all shadow-xl"
                     >
                        INICIAR EDITOR PRO
                     </button>
                  </motion.div>
               )}

               {activeSection === 'characters' && (
                  <motion.div 
                    key="characters"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <h3 className="text-xl font-serif font-black text-white italic">Banco de Personagens</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Almas que habitam sua obra</p>
                        </div>
                        <div className="flex gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                           <button className="px-4 py-1.5 bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">Todos</button>
                           <button className="px-4 py-1.5 text-zinc-600 text-[9px] font-black uppercase tracking-widest rounded-xl">Principais</button>
                           <button className="px-4 py-1.5 text-zinc-600 text-[9px] font-black uppercase tracking-widest rounded-xl">Secundários</button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(project.characters || []).map((char: any) => (
                           <CharacterCard 
                              key={char.id}
                              name={char.name} 
                              role={char.role} 
                              image={char.image} 
                              description={char.description}
                           />
                        ))}
                        <button 
                           onClick={handleAddItem}
                           className="aspect-[3/4] border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all group"
                        >
                           <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                              <Plus size={32} />
                           </div>
                           <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-white transition-all">Incubar Personagem</span>
                        </button>
                     </div>
                  </motion.div>
               )}

               {activeSection === 'world' && (
                  <motion.div 
                    key="world"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                     <div className="space-y-8">
                        <SectionCard title="LOCAIS">
                           <div className="p-6 space-y-3">
                              {(project.world?.locations || []).map((loc: any) => (
                                <LoreItem 
                                  key={loc.id} 
                                  icon={<Map size={14} />} 
                                  label={loc.name} 
                                  sub={loc.description?.substring(0, 20) + '...'} 
                                />
                              ))}
                              {(!project.world?.locations || project.world.locations.length === 0) && (
                                <>
                                  <LoreItem icon={<Map size={14} />} label="Cidade Alta" sub="Centro da rede" />
                                  <LoreItem icon={<Map size={14} />} label="Setor 09" sub="Favelas neurais" />
                                </>
                              )}
                              <button 
                                onClick={handleAddItem}
                                className="w-full flex items-center justify-center py-3 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-black text-zinc-700 uppercase hover:text-white transition-all"
                              >
                                + Novo Local
                              </button>
                           </div>
                        </SectionCard>
                        <SectionCard title="CRONOLOGIA">
                           <div className="p-6 space-y-3">
                              <LoreItem icon={<Clock size={14} />} label="O Grande Reset" sub="Ano 2045" />
                              <LoreItem icon={<Clock size={14} />} label="Guerra das IAs" sub="Ano 2062" />
                              <LoreItem icon={<Clock size={14} />} label="Era Atual" sub="Ano 2088" />
                              <button className="w-full flex items-center justify-center py-3 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-black text-zinc-700 uppercase hover:text-white transition-all">+ Novo Evento</button>
                           </div>
                        </SectionCard>
                     </div>
                     <div className="md:col-span-2 space-y-8">
                        <SectionCard title="FACÇÕES E REGRAS">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                              <div className="space-y-4">
                                 <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Sistemas de Poder</h5>
                                 <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                       <Zap size={18} className="text-yellow-500" />
                                       <span className="text-xs font-black text-white italic">Neural Flow</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">Capacidade de processar dados diretamente no neocórtex através de links orgânicos...</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">A Ordem de Vane</h5>
                                 <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                       <Shield size={18} className="text-indigo-500" />
                                       <span className="text-xs font-black text-white italic">Dogma da Pureza</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">Facção radical que acredita na superioridade humana sem tecnologia integrada...</p>
                                 </div>
                              </div>
                           </div>
                        </SectionCard>
                        
                        <div className="h-64 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-4 bg-zinc-900/10">
                           <Brain size={40} className="text-zinc-800" />
                           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Mapa Neural do Universo (Em Breve)</p>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeSection === 'notes' && (
                  <motion.div 
                    key="notes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                     <div className="space-y-8">
                        <SectionCard title="BRAINSTORM / NOTAS">
                           <div className="p-8 space-y-6">
                              {(project.notes || []).map((note: any) => (
                                <div key={note.id} className="space-y-3">
                                   <p className="text-sm text-zinc-400 italic leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-white/5">
                                      "{note.content}"
                                   </p>
                                   <div className="flex gap-2">
                                      {note.tags?.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase rounded-full">{tag}</span>
                                      ))}
                                   </div>
                                </div>
                              ))}
                              {(!project.notes || project.notes.length === 0) && (
                                <p className="text-sm text-zinc-400 italic leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-white/5">
                                   "E se o protagonista não for realmente humano, mas uma simulação neural que acredita ser o criador do sistema?"
                                </p>
                              )}
                           </div>
                        </SectionCard>
                        <SectionCard title="LEMBRETES">
                           <div className="p-8 space-y-4">
                              <TodoItem label="Verificar física de viagens na rede" checked={false} />
                              <TodoItem label="Nomes para os clãs da Cidade Baixa" checked={false} />
                           </div>
                        </SectionCard>
                     </div>
                     <div className="bg-[#0d0d0f] rounded-[2.5rem] border border-white/5 p-10 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
                           <PenTool size={32} />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-serif font-black text-white italic">Área de Rabiscos</h4>
                           <p className="text-xs text-zinc-500 max-w-xs mx-auto italic">Um espaço livre para capturar inspirações momentâneas sem se preocupar com a estrutura formal.</p>
                        </div>
                        <button 
                          onClick={handleAddItem}
                          className="px-8 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl active:scale-95 transition-all"
                        >
                          Iniciar Novo Brainstorm
                        </button>
                     </div>
                  </motion.div>
               )}

               {activeSection === 'timeline' && (
                  <motion.div 
                    key="timeline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                     <div className="flex justify-between items-center bg-[#0d0d0f] p-8 rounded-[2rem] border border-white/5">
                        <div className="flex gap-12">
                           <div className="text-center">
                              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Início da Obra</span>
                              <span className="text-xl font-serif font-black text-white italic">Ano 2088</span>
                           </div>
                           <div className="text-center">
                              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Eventos Atuais</span>
                              <span className="text-xl font-serif font-black text-white italic">24 Pontos</span>
                           </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20">
                           <History size={14} />
                           MAPEAR FLASHBACK
                        </button>
                     </div>

                     <div className="relative pl-12 border-l-2 border-zinc-900 space-y-12 ml-4">
                        <TimelineEvent 
                           title="A Queda de Neo-V" 
                           date="Jan, 2088" 
                           description="O sistema principal de defesa neural sofre um colapso inexplicável."
                           icon={<Zap size={14} />}
                           active
                        />
                        <TimelineEvent 
                           title="O Encontro no Setor 9" 
                           date="Fev, 2088" 
                           description="Kaelis e Mira se conhecem em uma negociação de códigos proibidos."
                           icon={<Users size={14} />}
                        />
                        <TimelineEvent 
                           title="A Primeira Singularidade" 
                           date="Mar, 2088" 
                           description="Um rastro de IA senciente é detectado nas camadas profundas da rede."
                           icon={<Brain size={14} />}
                        />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, className }: { icon: any, label: string, active?: boolean, onClick?: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 rounded-xl md:rounded-2xl transition-all group overflow-hidden",
        active ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5",
        className
      )}
    >
       <div className="shrink-0">{icon}</div>
       <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.15em] truncate">{label}</span>
       {active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full hidden md:block" />}
    </button>
  );
}

function SubTab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all relative overflow-hidden",
        active ? "text-white" : "text-zinc-600 hover:text-zinc-400"
      )}
    >
       {active && <motion.div layoutId="subtab" className="absolute inset-0 bg-zinc-800 rounded-xl" />}
       <span className="relative z-10">{label}</span>
    </button>
  );
}

function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="bg-[#0d0d0f] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
       <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">{title}</h4>
          <MoreVertical size={14} className="text-zinc-800" />
       </div>
       {children}
    </section>
  );
}

function DataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-black text-white italic">{value}</span>
    </div>
  );
}

function ActivityItem({ label, time }: { label: string, time: string }) {
  return (
    <div className="flex items-start gap-4 group cursor-pointer">
       <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
       <div className="space-y-0.5">
          <p className="text-[11px] font-black text-zinc-400 group-hover:text-white transition-colors">{label}</p>
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{time}</p>
       </div>
    </div>
  );
}

function TodoItem({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
       <div className={cn(
         "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
         checked ? "bg-indigo-600 border-indigo-600" : "border-zinc-800"
       )}>
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
       </div>
       <span className={cn("text-[10px] font-black uppercase tracking-widest", checked ? "text-zinc-700 line-through" : "text-zinc-400 group-hover:text-white")}>{label}</span>
    </div>
  );
}

function ChapterCard({ number, title, wordCount, status, onClick }: { number: number, title: string, wordCount: string, status: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group bg-zinc-900/30 rounded-[2.5rem] border border-white/5 p-6 h-64 flex flex-col justify-between hover:border-indigo-500/30 hover:bg-zinc-900/60 transition-all cursor-pointer relative overflow-hidden"
    >
       <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all" />
       
       <div>
          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Capítulo {number}</span>
          <h4 className="text-xl font-serif font-black text-white italic tracking-tight mt-2">{title}</h4>
       </div>

       <div className="space-y-4">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
             <span className="text-zinc-600">Palavras: <span className="text-zinc-400">{wordCount}</span></span>
             <span className={cn(status === 'Finalizado' ? "text-green-500" : "text-yellow-500")}>{status}</span>
          </div>
          <button className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
             ABRIR EDITOR
          </button>
       </div>
    </div>
  );
}

function CharacterCard({ name, role, image }: { name: string, role: string, image: string }) {
  return (
    <div className="aspect-[3/4] bg-[#0d0d0f] rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer shadow-2xl">
       <div className="h-2/3 relative overflow-hidden">
          <img src={image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt={name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] to-transparent" />
          <div className="absolute bottom-4 left-4">
             <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">{role}</span>
          </div>
       </div>
       <div className="p-6">
          <h4 className="text-lg font-serif font-black text-white italic tracking-tight mb-2">{name}</h4>
          <p className="text-[9px] text-zinc-600 font-medium italic line-clamp-2">Uma breve descrição sobre a essência deste indivíduo no universo...</p>
       </div>
    </div>
  );
}

function LoreItem({ icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
       <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-indigo-400 transition-all">
             {icon}
          </div>
          <div className="space-y-0.5">
             <span className="block text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
             <span className="block text-[8px] font-black text-zinc-600 italic uppercase tracking-widest">{sub}</span>
          </div>
       </div>
       <ChevronRight size={14} className="text-zinc-800" />
    </div>
  );
}

function TimelineEvent({ title, date, description, icon, active }: { title: string, date: string, description: string, icon: any, active?: boolean }) {
  return (
    <div className="relative group">
       <div className={cn(
         "absolute -left-[53px] w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all z-10",
         active ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-zinc-950 border-zinc-900 text-zinc-700 group-hover:border-zinc-700"
       )}>
          {icon}
       </div>
       <div className="bg-[#0d0d0f] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">{date}</span>
           <h4 className="text-xl font-serif font-black text-white italic mb-2">{title}</h4>
           <p className="text-xs text-zinc-500 italic leading-relaxed">{description}</p>
       </div>
    </div>
  );
}

function ArcItem({ title, description, progress, chapters }: { title: string, description: string, progress: number, chapters: string[] }) {
  return (
    <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900/60 transition-all group">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 flex-1">
             <h4 className="text-xl font-serif font-black text-white italic tracking-tight">{title}</h4>
             <p className="text-xs text-zinc-500 italic max-w-2xl">{description}</p>
          </div>
          <div className="w-full md:w-48 space-y-2">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span>Progresso</span>
                <span>{progress}%</span>
             </div>
             <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className="h-full bg-indigo-600" 
                />
             </div>
          </div>
       </div>
       <div className="mt-8 flex flex-wrap gap-2">
          {chapters.map(c => (
             <span key={c} className="px-4 py-1.5 bg-zinc-950 border border-white/5 rounded-full text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{c}</span>
          ))}
          <button className="px-4 py-1.5 border border-dashed border-zinc-800 rounded-full text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all">+ Add Cap</button>
       </div>
    </div>
  );
}

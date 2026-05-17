import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useNavStore } from '../../../App';
import { useProjects } from '../hooks/useProjects';
import { Plus, Book, ScrollText, ImageIcon, MoreVertical, Layout, MessageSquare, Trash2, Clock, Search, Filter, ArrowUpRight, Star, Share2, Heart, TrendingUp, Sparkles, Brain, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { StudioModal } from '../../../components/shared/StudioModal';

export function ProjectDashboard() {
  const { user } = useAuthStore();
  const { setNav } = useNavStore();
  const { projects, loading, createProject, deleteProject, shareProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedType, setSelectedType] = useState<'novel' | 'manga' | 'script' | 'webtoon'>('novel');
  const [subCategory, setSubCategory] = useState('');

  const handleCreate = async () => {
    const id = await createProject({
      title: newProjectTitle,
      type: selectedType,
      description,
      coverUrl,
      subCategory,
      tags: subCategory ? [subCategory] : []
    });
    if (id) {
      setNav('project-workspace', id);
    }
  };

  const [activeTab, setActiveTab] = useState<'my' | 'templates'>('my');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-zinc-950 editor-scroll scroll-smooth">
      {/* Top Hero Section */}
      <div className="relative border-b border-zinc-900 pb-12 md:pb-20 pt-10 md:pt-16 px-6 md:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
          <div className="space-y-4 md:space-y-6 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-indigo-400"
            >
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
               <h2 className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-black">Neural Studio Core 3.5.0</h2>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter leading-[0.85] italic"
            >
              Crie sem <br/>
              <span className="text-zinc-800">barreiras</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 font-medium text-base md:text-lg max-w-lg italic border-l-2 border-zinc-800 pl-4 md:pl-6 leading-relaxed"
            >
              Potencialize sua narrativa com IA generativa avançada. Transforme scripts em experiências visuais imersivas em segundos.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {projects.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={() => setNav('editor', projects[0].projectId)}
                  className="px-6 md:px-8 py-3.5 md:py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl flex items-center gap-4 hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-[9px] md:text-[10px] group/resume"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Continuar: <span className="text-zinc-400 group-hover/resume:text-white transition-colors truncate max-w-[120px] md:max-w-none">{projects[0].title}</span>
                  <ArrowUpRight size={16} className="text-zinc-600 group-hover/resume:text-white transition-all transform group-hover/resume:translate-x-1 group-hover/resume:-translate-y-1" />
                </motion.button>
              )}
              <motion.button
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 onClick={() => setIsModalOpen(true)}
                 className="px-6 md:px-8 py-3.5 md:py-4 bg-indigo-600 text-white rounded-2xl flex items-center gap-4 hover:bg-indigo-500 transition-all font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-indigo-500/20"
              >
                 <Plus size={16} /> Nova Matriz
              </motion.button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-end gap-6"
          >
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-14 h-14 rounded-full border-[6px] border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                 </div>
              ))}
              <div className="w-14 h-14 rounded-full border-[6px] border-zinc-950 bg-white flex items-center justify-center text-black font-black text-[10px] shadow-2xl">
                 +12k
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right pr-2 italic">
               Junte-se à maior rede de <br/> criadores sintéticos
            </p>
          </motion.div>
        </header>

        {/* Tab System */}
        <div className="mt-12 md:mt-20 flex gap-6 md:gap-12 overflow-x-auto no-scrollbar">
           <button 
            onClick={() => setActiveTab('my')}
            className={cn(
              "text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.5em] transition-all relative pb-4 shrink-0",
              activeTab === 'my' ? "text-white" : "text-zinc-700 hover:text-zinc-500"
            )}
           >
              Meus Manuscritos
              {activeTab === 'my' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
           </button>
           <button 
            onClick={() => setActiveTab('templates')}
            className={cn(
              "text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.5em] transition-all relative pb-4 shrink-0",
              activeTab === 'templates' ? "text-white" : "text-zinc-700 hover:text-zinc-500"
            )}
           >
              Templates Neurais
              {activeTab === 'templates' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
           </button>
        </div>
      </div>

      <div className="px-6 md:px-16 py-10 md:py-12 space-y-16 md:space-y-20">
        {activeTab === 'my' ? (
          <div className="space-y-12 md:space-y-20">
            {/* Featured Actions */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <QuickCard 
                icon={<Sparkles className="text-white" />}
                title="Novo"
                description="Matriz zero"
                onClick={() => setIsModalOpen(true)}
                color="bg-indigo-600"
                dark
              />
              <QuickCard 
                icon={<PenTool className="text-pink-400" />}
                title="Manga"
                description="Editor Pro"
                onClick={() => setNav('manga-pro')}
                color="bg-zinc-900"
              />
              <QuickCard 
                icon={<Brain className="text-indigo-400" />}
                title="Feed"
                description="Destaques"
                onClick={() => setNav('feed')}
                color="bg-zinc-900"
              />
              <QuickCard 
                icon={<TrendingUp className="text-indigo-400" />}
                title="Dados"
                description="Analytics"
                onClick={() => {}}
                color="bg-zinc-900"
              />
            </section>

            {/* Project List */}
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-black text-white italic tracking-tight">Meus Manuscritos</h3>
                    <p className="text-zinc-600 text-xs font-medium tracking-wide">Gerencie seus arquivos neurais ativos</p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3 px-4 py-2 border-r border-zinc-800">
                      <Search size={14} className="text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Filtrar..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-[10px] uppercase font-black tracking-widest text-white focus:outline-none w-32 placeholder:text-zinc-700" 
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <FilterButton icon={<Layout size={14} />} active />
                      <FilterButton icon={<Filter size={14} />} />
                    </div>
                </div>
              </div>
              
              {loading ? (
                  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1,2,3].map(i => <div key={i} className="h-72 w-full bg-zinc-900/50 rounded-[3rem] border border-zinc-800" />)}
                  </div>
              ) : filteredProjects.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[400px] border-4 border-dashed border-zinc-900/50 rounded-[4rem] flex flex-col items-center justify-center gap-8 bg-zinc-900/10 group hover:bg-zinc-900/20 transition-all cursor-pointer" 
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative p-10 bg-white rounded-full text-black group-hover:scale-110 transition-all shadow-2xl">
                      <Plus size={40} />
                    </div>
                  </div>
                  <p className="text-zinc-500 italic font-black tracking-tighter text-2xl">{searchTerm ? 'Sem resultados' : 'Vazio Absoluto'}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((p, idx) => (
                      <ProjectCard 
                        key={p.projectId} 
                        project={p} 
                        idx={idx} 
                        onShare={(e) => {
                          e.stopPropagation();
                          shareProject(p);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          if(confirm('Excluir manuscrito?')) deleteProject(p.projectId);
                        }}
                        onClick={() => setNav('project-workspace', p.projectId)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
             <div className="space-y-1">
                <h3 className="text-3xl font-serif font-black text-white italic tracking-tight">Marketplace de Estruturas</h3>
                <p className="text-zinc-600 text-sm font-medium tracking-wide">Templates otimizados para gêneros específicos</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TemplateCard 
                  title="Dark Shonen Pro"
                  type="Manga"
                  description="Estrutura de 3 atos com sistema de magia pré-configurado."
                  stats="Used by 4.2k"
                />
                <TemplateCard 
                  title="Nordic Noir Novel"
                  type="Novel"
                  description="Pacing focado em mistério e descrições atmosféricas."
                  stats="Used by 1.8k"
                />
                <TemplateCard 
                  title="High Fantasy Codex"
                  type="World"
                  description="Template massivo para worldbuilding épico modular."
                  stats="Used by 9.5k"
                />
             </div>
          </div>
        )}
      </div>

      <StudioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nova Entidade"
      >
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2 flex items-center gap-2">
               <div className="w-1 h-1 bg-indigo-500 rounded-full" />
               Identificador da Obra
            </label>
            <input 
              type="text" 
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Ex: Cyberpunk Neo-Tokyo 2088"
              className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-[2rem] px-8 py-6 text-xl text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600 transition-all font-serif font-black italic shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2 flex items-center gap-2">
               <div className="w-1 h-1 bg-indigo-500 rounded-full" />
               Descrição do Universo
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a premissa neural da sua obra..."
              className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-[2rem] px-8 py-6 text-sm text-zinc-400 placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600 transition-all font-medium italic h-32 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2">Capa (URL)</label>
              <input 
                type="text" 
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-[1.5rem] px-6 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2">Sub-categoria</label>
              <select 
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-[1.5rem] px-6 py-4 text-xs text-white focus:outline-none focus:border-indigo-600 transition-all appearance-none"
              >
                <option value="">Selecione...</option>
                <option value="romance">Romance</option>
                <option value="horror">Horror</option>
                <option value="action">Ação</option>
                <option value="rebanho">Sci-Fi</option>
                <option value="fantasy">Fantasia</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2">Formato da Matriz</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <TypeOption 
                 active={selectedType === 'novel'} 
                 onClick={() => setSelectedType('novel')}
                 icon={<Book size={20} />}
                 label="Novel"
                 description="Literário"
               />
               <TypeOption 
                 active={selectedType === 'manga'} 
                 onClick={() => setSelectedType('manga')}
                 icon={<ImageIcon size={20} />}
                 label="Manga"
                 description="B&W visual"
               />
               <TypeOption 
                 active={selectedType === 'webtoon'} 
                 onClick={() => setSelectedType('webtoon')}
                 icon={<Layout size={20} />}
                 label="Webtoon"
                 description="Vertical scroll"
               />
               <TypeOption 
                 active={selectedType === 'script'} 
                 onClick={() => setSelectedType('script')}
                 icon={<ScrollText size={20} />}
                 label="Script"
                 description="Roteiro"
               />
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={!newProjectTitle}
            className="group w-full relative overflow-hidden bg-white text-black font-black uppercase tracking-[0.3em] py-6 rounded-[2.5rem] hover:bg-white/90 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            Ativar Matriz Criativa
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </StudioModal>
    </div>
  );
}

function ProjectCard({ project, idx, onDelete, onShare, onClick }: { project: any, idx: number, onDelete: (e: any) => void, onShare: (e: any) => void, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, type: 'spring', damping: 20 }}
      whileHover={{ y: -12 }}
      onClick={onClick}
      className={cn(
        "group relative bg-zinc-900/30 rounded-[3.5rem] border-2 border-zinc-900/50 p-8 h-[400px] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 backdrop-blur-xl",
        "hover:border-indigo-500/30 hover:bg-zinc-900/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Dynamic Background Elements */}
      {project.coverUrl ? (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
           <img src={project.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-indigo-600/10 transition-all duration-700" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-zinc-800/10 rounded-full group-hover:scale-150 group-hover:border-indigo-500/10 transition-all duration-1000" />
        </>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-start">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400">{project.type}</span>
                 </div>
                 {idx === 0 && (
                   <div className="px-5 py-2 bg-white text-black rounded-full flex items-center gap-2">
                     <Star size={10} fill="currentColor" />
                     <span className="text-[10px] uppercase tracking-[0.2em] font-black">Featured</span>
                   </div>
                 )}
              </div>
              <h4 className="text-3xl font-serif font-black text-white italic tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h4>
           </div>
           
           <div className="flex flex-col gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(e);
                }}
                className="p-3.5 text-zinc-700 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={onDelete}
                className="p-3.5 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              >
                <Trash2 size={18} />
              </button>
           </div>
        </header>

        <div className="flex-1 mt-6">
           <p className="text-zinc-600 text-sm font-medium italic line-clamp-3 leading-relaxed group-hover:text-zinc-400 transition-colors">
             {project.description || `Uma exploração profunda sobre os temas de ${project.type === 'manga' ? 'arte sequencial e narrativa visual' : 'literatura moderna e fluxo de consciência'}.`}
           </p>
           {project.subCategory && (
             <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-zinc-800/50 rounded-full text-[8px] font-black uppercase text-zinc-500 tracking-widest">{project.subCategory}</span>
             </div>
           )}
        </div>

        <footer className="pt-8 pt-auto flex justify-between items-end border-t border-zinc-800/50">
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                 <StatItem icon={<Heart size={14} />} value="1.2k" />
                 <StatItem icon={<MessageSquare size={14} />} value="48" />
                 <StatItem icon={<Share2 size={14} />} value="12" />
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 overflow-hidden shadow-xl">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.projectId}`} alt="Author" />
                 </div>
                 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                   {project.updatedAt?.toDate ? `Atualizado ${project.updatedAt.toDate().toLocaleDateString()}` : 'Node Ativo'}
                 </p>
              </div>
           </div>
           
           <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-[1.2rem] flex items-center justify-center text-zinc-600 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-110 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <ArrowUpRight size={24} />
           </div>
        </footer>
      </div>
    </motion.div>
  );
}

function TemplateCard({ title, type, description, stats }: { title: string, type: string, description: string, stats: string }) {
  return (
    <div className="bg-zinc-900/40 rounded-[3rem] border border-zinc-900 p-10 space-y-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
       <div className="absolute top-0 right-0 p-8">
          <ArrowUpRight className="text-zinc-800 group-hover:text-indigo-500 transition-colors" />
       </div>
       <div className="space-y-4">
          <span className="px-4 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-widest">{type}</span>
          <h4 className="text-2xl font-serif font-black text-white italic tracking-tight">{title}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed italic">{description}</p>
       </div>
       <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-700">
          <span>{stats}</span>
          <button className="text-indigo-500 hover:text-white transition-colors">Import Matriz</button>
       </div>
    </div>
  );
}

function StatItem({ icon, value }: { icon: any, value: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-600 group-hover/stats:text-zinc-300 transition-colors">
       {icon}
       <span className="text-[11px] font-black italic">{value}</span>
    </div>
  );
}

function QuickCard({ icon, title, description, onClick, color, dark }: { icon: any, title: string, description: string, onClick: () => void, color: string, dark?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-left space-y-4 md:space-y-6 transition-all active:scale-[0.98] hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden",
        color,
        dark ? "shadow-[0_20px_40px_rgba(99,102,241,0.2)] md:shadow-[0_30px_60px_rgba(99,102,241,0.3)]" : "border border-zinc-900"
      )}
    >
      <div className="bg-zinc-950/20 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit group-hover:scale-110 transition-transform">
         {icon}
      </div>
      <div className="space-y-1 md:space-y-2 relative z-10 overflow-hidden">
        <h4 className={cn("text-lg md:text-2xl font-serif font-black italic leading-none truncate", dark ? "text-white" : "text-white")}>{title}</h4>
        <p className={cn("text-[8px] md:text-xs font-medium leading-relaxed italic line-clamp-1", dark ? "text-white/60" : "text-zinc-500")}>{description}</p>
      </div>
      
      {dark && (
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-[50px] group-hover:bg-white/10 transition-all" />
      )}
    </button>
  );
}

function FilterButton({ icon, active }: { icon: any, active?: boolean }) {
  return (
    <button className={cn(
      "p-3 rounded-xl transition-all",
      active ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-zinc-200"
    )}>
       {icon}
    </button>
  );
}

function TypeOption({ active, onClick, icon, label, description }: { active: boolean, onClick: () => void, icon: any, label: string, description: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden h-full",
        active 
          ? "bg-indigo-600/10 border-indigo-600 shadow-[0_20px_40px_rgba(99,102,241,0.1)]" 
          : "bg-zinc-900/30 border-zinc-900 hover:border-zinc-800"
      )}
    >
       <div className={cn(
         "p-4 rounded-2xl transition-all",
         active ? "bg-indigo-600 text-white" : "bg-zinc-950 text-zinc-600 group-hover:text-zinc-400"
       )}>
         {icon}
       </div>
       <div className="text-center space-y-1">
          <p className={cn("text-sm font-black uppercase tracking-widest", active ? "text-white" : "text-zinc-500")}>{label}</p>
          <p className="text-[9px] text-zinc-600 font-medium italic group-hover:text-zinc-500 transition-colors">{description}</p>
       </div>
       
       {active && (
         <div className="absolute top-2 right-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
         </div>
       )}
    </button>
  );
}


import { useState } from 'react';
import { useStudio } from '../hooks/useStudio';
import { User, Map, Sparkles, Plus, Search, Edit3, Trash2, X, Save, AlertCircle, Library, History, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function StudioSidebar({ projectId }: { projectId: string }) {
  const [activeSubTab, setActiveSubTab] = useState<'chars' | 'world' | 'ai'>('chars');
  const { characters, worldEntries, addCharacter, updateCharacter, removeCharacter, addWorldEntry, updateWorldEntry, removeWorldEntry } = useStudio(projectId);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [editingWorldId, setEditingWorldId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<string | null>(null);

  const generateAvatar = async (char: any) => {
    setIsGeneratingAvatar(char.id);
    try {
      const res = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: char.name, 
          visualTraits: char.visualTraits, 
          role: char.role 
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        await updateCharacter(projectId, char.id, { avatarUrl: data.imageUrl });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingAvatar(null);
    }
  };

  const filteredCharacters = characters.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredWorld = worldEntries.filter(w => w.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      {/* Premium Header Tabs */}
      <div className="flex items-center gap-1 p-4 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-20 backdrop-blur-3xl">
        <TabButton active={activeSubTab === 'chars'} icon={<User size={16}/>} label="Cast" onClick={() => setActiveSubTab('chars')} />
        <TabButton active={activeSubTab === 'world'} icon={<Map size={16}/>} label="Lore" onClick={() => setActiveSubTab('world')} />
        <TabButton active={activeSubTab === 'ai'} icon={<Sparkles size={16}/>} label="Neural" onClick={() => setActiveSubTab('ai')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 editor-scroll pb-24">
        {/* Search Bar (Floating Style) */}
        <div className="relative group">
           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search size={14} className="text-zinc-700 group-focus-within:text-indigo-500 transition-colors" />
           </div>
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] py-3.5 pl-12 pr-6 text-[11px] font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner" 
             placeholder="Search database nodes..." 
           />
        </div>

        {activeSubTab === 'chars' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Character Nodes</h4>
                  <p className="text-[9px] text-zinc-700 italic">{characters.length} registered assets</p>
               </div>
               <button 
                onClick={() => addCharacter(projectId, { name: 'New Avatar', role: 'Protagonist', description: '', visualTraits: '' })}
                className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/20 active:scale-90"
               >
                 <Plus size={20} />
               </button>
            </div>
            
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCharacters.map((char, idx) => (
                  <motion.div 
                    key={char.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-zinc-900/40 p-5 rounded-[2rem] border border-zinc-800/80 hover:border-indigo-500/30 transition-all group relative overflow-hidden active:bg-zinc-900/60"
                  >
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                       <button 
                         onClick={() => setEditingCharId(char.id)}
                         className="p-2.5 bg-zinc-950 text-zinc-400 hover:text-indigo-400 rounded-xl hover:bg-zinc-800 border border-zinc-900"
                       >
                         <Edit3 size={14} />
                       </button>
                       <button 
                         onClick={() => removeCharacter(projectId, char.id)}
                         className="p-2.5 bg-zinc-950 text-zinc-500 hover:text-red-500 rounded-xl hover:bg-zinc-800 border border-zinc-900"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-14 h-14 rounded-[1.5rem] bg-zinc-950 border border-zinc-900 overflow-hidden relative group/avatar">
                          {char.avatarUrl ? (
                            <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-400 font-serif italic text-2xl bg-indigo-600/10">
                               {char.name.charAt(0)}
                            </div>
                          )}
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              generateAvatar(char);
                            }}
                            disabled={isGeneratingAvatar === char.id || !char.visualTraits}
                            className={cn(
                              "absolute inset-0 bg-indigo-600/80 flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm disabled:opacity-0",
                              isGeneratingAvatar === char.id && "opacity-100 bg-black/60"
                            )}
                          >
                             {isGeneratingAvatar === char.id ? (
                               <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                             ) : <Sparkles size={16} />}
                          </button>
                       </div>
                       <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-white tracking-tight">{char.name}</h4>
                          <span className="inline-block px-3 py-1 bg-zinc-950 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-zinc-800">
                             {char.role}
                          </span>
                       </div>
                    </div>
                    
                    <p className="mt-4 text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-3 italic">
                      {char.description || 'System awaiting profile definition...'}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-800/50 pt-4">
                       <div className="flex gap-1.5">
                          <div className={cn("w-2 h-2 rounded-full", char.visualTraits ? "bg-indigo-500" : "bg-zinc-800")} />
                          <div className={cn("w-2 h-2 rounded-full", char.description ? "bg-indigo-500" : "bg-zinc-800")} />
                       </div>
                       <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest italic group-hover:text-indigo-400 transition-colors">Neural Ready</span>
                    </div>

                    {editingCharId === char.id && (
                      <EditCharacterModal 
                        char={char} 
                        onClose={() => setEditingCharId(null)} 
                        onSave={(data) => {
                          updateCharacter(projectId, char.id, data);
                          setEditingCharId(null);
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredCharacters.length === 0 && searchQuery && (
               <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                  <Search size={40} />
                  <p className="text-[10px] uppercase font-black tracking-[0.4em]">Node Not Found</p>
               </div>
            )}
          </div>
        )}

        {activeSubTab === 'world' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">World Lore Codex</h4>
                  <p className="text-[9px] text-zinc-700 italic">Structural universe mapping</p>
               </div>
               <button 
                onClick={() => addWorldEntry(projectId, { title: 'New Concept', category: 'lore', content: '' })}
                className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/20 active:scale-90"
               >
                 <Plus size={20} />
               </button>
            </div>

            <div className="grid gap-4">
               <AnimatePresence mode="popLayout">
                  {filteredWorld.map((entry, idx) => (
                    <motion.div 
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/80 group relative hover:bg-zinc-900/60 transition-all"
                    >
                       <div className="absolute top-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => setEditingWorldId(entry.id)} className="p-2.5 bg-zinc-950 text-zinc-500 hover:text-indigo-400 rounded-xl border border-zinc-900">
                             <Edit3 size={14} />
                          </button>
                       </div>

                       <div className="flex items-center gap-3 mb-4">
                          <CategoryBadge category={entry.category} />
                          <span className="text-[9px] uppercase text-zinc-600 font-black tracking-[0.3em] font-mono">{entry.category.toUpperCase()}</span>
                       </div>
                       <h4 className="text-md font-serif font-bold text-white mb-2 italic tracking-tight">{entry.title}</h4>
                       <p className="text-[10px] text-zinc-500 line-clamp-3 leading-relaxed font-medium italic">
                         {entry.content || 'Define core architectural concepts...'}
                       </p>
                       
                       {editingWorldId === entry.id && (
                         <EditWorldModal 
                           entry={entry} 
                           onClose={() => setEditingWorldId(null)} 
                           onSave={(data) => {
                             updateWorldEntry(projectId, entry.id, data);
                             setEditingWorldId(null);
                           }}
                         />
                       )}
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
          </div>
        )}

        {activeSubTab === 'ai' && (
          <div className="space-y-8 pb-10">
            <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all animate-pulse"></div>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-[1.3rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-900/40">
                   <Sparkles size={24} />
                 </div>
                 <h4 className="text-[12px] font-black uppercase text-white tracking-[0.4em]">Neural Core Active</h4>
               </div>
               <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/50">
                 "Our models are now processing your manual nodes to ensure narrative consistency across panels and dialogue."
               </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-4 px-2 mb-4">
                  <div className="h-px flex-1 bg-zinc-900"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 whitespace-nowrap">Active Protocols</span>
                  <div className="h-px flex-1 bg-zinc-900"></div>
               </div>
               <ModelCard title="Narrative Weaver v.4" desc="Pacing & emotional logic weighting." icon={<Library size={14}/>} active />
               <ModelCard title="Visual Logic Engine" desc="Spatial and cinematic panel coherence." icon={<Target size={14}/>} />
               <ModelCard title="Node History Sync" desc="Temporal consistency across chapters." icon={<History size={14}/>} />
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-[2rem] flex gap-5 items-start">
               <AlertCircle className="text-indigo-500 shrink-0 mt-1" size={20} />
               <div className="space-y-2">
                  <p className="text-[11px] text-white font-bold uppercase tracking-widest">Protocol Insight</p>
                  <p className="text-[10px] text-zinc-500 font-medium italic leading-relaxed">
                    Higher density of character visual traits drastically improves image generation precision in the Manga Engine.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-full flex items-center gap-3 shadow-2xl pointer-events-none group">
         <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Database Live Sync</span>
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: any = {
    location: 'bg-emerald-500 shadow-emerald-500/20',
    faction: 'bg-indigo-400 shadow-indigo-400/20',
    system: 'bg-purple-600 shadow-purple-600/20',
    lore: 'bg-amber-700 shadow-amber-700/20',
    timeline: 'bg-rose-500 shadow-rose-500/20',
    relic: 'bg-sky-500 shadow-sky-500/20'
  };
  return <div className={cn("w-2 h-2 rounded-full shadow-lg", colors[category] || 'bg-zinc-800')} />;
}

function EditCharacterModal({ char, onClose, onSave }: { char: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(char);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-indigo-500 mb-1">
                  <User size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Configuration</span>
               </div>
               <h3 className="text-3xl font-serif italic font-bold text-white tracking-tight">Design Cast Avatar</h3>
            </div>
            <button onClick={onClose} className="p-3 bg-zinc-900 hover:bg-white text-zinc-500 hover:text-black rounded-2xl transition-all active:scale-90 border border-zinc-800">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Avatar Identity</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                  placeholder="Character Name..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Protocol Role</label>
                <input 
                   value={formData.role}
                   onChange={e => setFormData({ ...formData, role: e.target.value })}
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                   placeholder="Main, Hero, Villain..."
                />
             </div>
          </div>

          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-900" />
                <span className="text-[9px] font-black uppercase text-zinc-800 tracking-[0.5em]">Neural Mapping</span>
                <div className="flex-1 h-px bg-zinc-900" />
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Age / Cycle</label>
                   <input 
                     value={formData.age}
                     onChange={e => setFormData({ ...formData, age: e.target.value })}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                     placeholder="24, 1500, Unknown..."
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Archetype</label>
                   <input 
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                      placeholder="Protagonist, Rival..."
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1 text-indigo-500">Core Motivation</label>
                <input 
                   value={formData.goals}
                   onChange={e => setFormData({ ...formData, goals: e.target.value })}
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                   placeholder="What drives this character?"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Psychological Profile</label>
                <textarea 
                  rows={3}
                  value={formData.personality}
                  onChange={e => setFormData({ ...formData, personality: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-[11px] text-white focus:border-indigo-500/50 transition-all outline-none resize-none no-scrollbar font-medium italic leading-relaxed shadow-inner"
                  placeholder="Stoic, cheerful, Machiavellian..."
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Neural Narrative (Summary)</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-[11px] text-white focus:border-indigo-500/50 transition-all outline-none resize-none no-scrollbar font-medium italic leading-relaxed shadow-inner"
                  placeholder="How do they act? What is their essence?"
                />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1 flex items-center gap-2">
               <Sparkles size={12} className="text-indigo-400 animate-pulse" /> Visual Matrix (IA Logic Only)
             </label>
             <textarea 
               rows={3}
               value={formData.visualTraits}
               onChange={e => setFormData({ ...formData, visualTraits: e.target.value })}
               placeholder="Essential details: Outfit, hair color, unique eyes, physical stature..."
               className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] px-6 py-5 text-[11px] text-zinc-400 focus:border-indigo-500/50 transition-all outline-none resize-none font-mono leading-relaxed shadow-inner"
             />
          </div>

          <div className="flex gap-4 pt-4">
             <button onClick={onClose} className="flex-1 py-5 rounded-[2rem] border border-zinc-800 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:bg-zinc-900 transition-all active:scale-95">
                Discard Changes
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex-auto py-5 rounded-[2rem] bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
                <Save size={18} /> Sync Asset
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EditWorldModal({ entry, onClose, onSave }: { entry: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(entry);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-indigo-500 mb-1">
                  <Map size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Lore Node Config</span>
               </div>
               <h3 className="text-3xl font-serif italic font-bold text-white tracking-tight">World Codex Update</h3>
            </div>
            <button onClick={onClose} className="p-3 bg-zinc-900 hover:bg-white text-zinc-500 hover:text-black rounded-2xl transition-all active:scale-90 border border-zinc-800">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Node Title</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium shadow-inner"
                  placeholder="Concept Title..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Class Type</label>
                <select 
                   value={formData.category}
                   onChange={e => setFormData({ ...formData, category: e.target.value })}
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none font-medium appearance-none shadow-inner"
                >
                   <option value="location">Geo Node (Location)</option>
                   <option value="faction">Social Bloc (Faction)</option>
                   <option value="system">System Logic (Magic/Tech)</option>
                   <option value="lore">Historical Root (Lore)</option>
                    <option value="timeline">Temporal Event (Timeline)</option>
                    <option value="relic">Object/Relic</option>
                </select>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] pl-1">Lore Data Input</label>
             <textarea 
               rows={8}
               value={formData.content}
               onChange={e => setFormData({ ...formData, content: e.target.value })}
               className="w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] px-8 py-8 text-[12px] text-white focus:border-indigo-500/50 transition-all outline-none resize-none leading-relaxed font-medium italic shadow-inner no-scrollbar"
               placeholder="Describe the historical and structural facts of this concept..."
             />
          </div>

          <div className="flex gap-4 pt-4">
             <button onClick={onClose} className="flex-1 py-5 rounded-[2rem] border border-zinc-800 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:bg-zinc-900 transition-all active:scale-95">
                Discard
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex-auto py-5 rounded-[2rem] bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
                <Save size={18} /> Compile Content
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-3.5 flex items-center justify-center gap-3 transition-all relative group rounded-2xl",
        active ? "bg-white text-black shadow-2xl" : "text-zinc-600 hover:text-zinc-300"
      )}
    >
      <div className={cn(
        "transition-transform",
        active && "scale-110"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeSubTab"
          className="absolute -bottom-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full"
        />
      )}
    </button>
  );
}

function ModelCard({ title, desc, icon, active }: { title: string, desc: string, icon: any, active?: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group",
      active 
        ? "bg-zinc-900 border-indigo-500/50 shadow-2xl shadow-indigo-900/10" 
        : "bg-zinc-950 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40"
    )}>
       <div className="flex justify-between items-start mb-3 relative z-10">
          <div className={cn("p-2.5 rounded-xl border", active ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-900 text-zinc-500 border-zinc-800")}>
             {icon}
          </div>
          {active && (
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-indigo-400 tracking-widest uppercase">Protocol Master</span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-pulse"></div>
            </div>
          )}
       </div>
       <div className="relative z-10 space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-white">{title}</span>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic mb-2">{desc}</p>
       </div>
    </div>
  );
}

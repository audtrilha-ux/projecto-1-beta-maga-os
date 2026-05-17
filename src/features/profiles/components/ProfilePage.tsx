import { useAuthStore } from '../../../stores/authStore';
import { useNavStore } from '../../../App';
import { motion } from 'motion/react';
import { 
  Settings, 
  Grid, 
  Bookmark, 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Edit,
  Share2
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useProjects } from '../../projects/hooks/useProjects';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { setNav } = useNavStore();
  const { projects } = useProjects();

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 editor-scroll">
      {/* Cover Header */}
      <div className="h-64 bg-gradient-to-r from-indigo-900 to-purple-900 relative">
         <div className="absolute inset-0 bg-black/20" />
         <button className="absolute bottom-6 right-8 bg-black/40 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 hover:bg-black/60 transition-all flex items-center gap-2">
            <Edit size={14} /> Edit Cover
         </button>
      </div>

      <div className="max-w-5xl mx-auto px-8">
         <div className="relative -mt-20 flex flex-col md:flex-row items-start md:items-end gap-8 mb-12">
            <div className="w-40 h-40 rounded-[3rem] border-[8px] border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl relative group">
               <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Edit size={24} className="text-white" />
               </div>
            </div>
            
            <div className="flex-1 pb-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                     <h1 className="text-4xl font-serif font-black text-white italic tracking-tighter">{user?.displayName || 'Neural Architect'}</h1>
                     <p className="text-indigo-400 font-bold text-sm tracking-wide">@{user?.email?.split('@')[0] || 'architect'}</p>
                  </div>
                  
                  <div className="flex gap-4">
                     <button className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95 shadow-xl">
                        Follow
                     </button>
                     <button className="p-3 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800 hover:text-white transition-all">
                        <Share2 size={20} />
                     </button>
                     <button className="p-3 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800 hover:text-white transition-all">
                        <Settings size={20} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            {/* Sidebar info */}
            <div className="space-y-10">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Biometria Neural</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed italic">
                     Especialista em narrativas procedimentais e worldbuilding quântico. Atualmente desenvolvendo o protocolo "Echoes of Silence".
                  </p>
               </div>

               <div className="space-y-4 pt-6 border-t border-zinc-900 text-[11px] font-medium text-zinc-500">
                  <div className="flex items-center gap-3">
                     <MapPin size={16} className="text-zinc-700" />
                     <span>Neo-Tokyo Subsector 7</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <LinkIcon size={16} className="text-zinc-700" />
                     <a href="#" className="text-indigo-400 hover:underline">studio.3eatcru.io</a>
                  </div>
                  <div className="flex items-center gap-3">
                     <Calendar size={16} className="text-zinc-700" />
                     <span>Joined May 2026</span>
                  </div>
               </div>

               <div className="flex gap-8 pt-6 border-t border-zinc-900">
                  <div className="text-center">
                     <p className="text-xl font-black text-white italic leading-none">1.2k</p>
                     <p className="text-[9px] font-black uppercase text-zinc-700 tracking-widest mt-2">Seguidores</p>
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-black text-white italic leading-none">482</p>
                     <p className="text-[9px] font-black uppercase text-zinc-700 tracking-widest mt-2">Seguindo</p>
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-black text-white italic leading-none">{projects.length}</p>
                     <p className="text-[9px] font-black uppercase text-zinc-700 tracking-widest mt-2">Projetos</p>
                  </div>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex border-b border-zinc-900">
                  <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-indigo-400 border-b-2 border-indigo-400">
                     Obras Ativas
                  </button>
                  <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all">
                     Log de Versões
                  </button>
                  <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all">
                     Coleções
                  </button>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((p) => (
                    <motion.div 
                      key={p.projectId}
                      whileHover={{ y: -5 }}
                      onClick={() => setNav('editor', p.projectId)}
                      className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-900 p-6 space-y-4 cursor-pointer hover:border-indigo-500/20 transition-all relative overflow-hidden h-[280px] flex flex-col justify-end"
                    >
                       {p.coverUrl && (
                          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                             <img src={p.coverUrl} className="w-full h-full object-cover grayscale" alt="Cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                          </div>
                       )}
                       
                       <div className="relative z-10 space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-700 border border-zinc-800">
                                <Grid size={16} />
                             </div>
                             <div className={cn(
                               "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest",
                               p.type === 'manga' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                             )}>
                                {p.type}
                             </div>
                          </div>
                          <h4 className="text-xl font-serif font-black italic text-white leading-tight tracking-tight">{p.title}</h4>
                          <p className="text-[10px] text-zinc-500 italic line-clamp-2">{p.description}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

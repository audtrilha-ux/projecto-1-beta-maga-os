import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  Menu, 
  Flame, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Eye, 
  Plus,
  Home,
  Compass,
  PenTool,
  Library,
  MoreVertical,
  Play
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNavStore } from '../../../App';
import { useAuthStore } from '../../../stores/authStore';

const CATEGORIES = [
  { label: 'Romance', icon: '❤️' },
  { label: 'Fantasia', icon: '🧞' },
  { label: 'Ação', icon: '⚔️' },
  { label: 'Sci-Fi', icon: '🪐' },
  { label: 'Mais', icon: '📂' },
];

const TRENDING_CARDS = [
  {
    category: 'Fantasia',
    title: 'O Último Guardião das Estrelas',
    author: 'Kael Writer',
    views: '12.4K',
    comments: '87',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80'
  },
  {
    category: 'Romance',
    title: 'Corações em Toquio',
    author: 'HanaSakura',
    views: '9.8K',
    comments: '65',
    image: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&w=400&q=80'
  },
  {
    category: 'Ação',
    title: 'Protocolo Zero',
    author: 'Victor Andrade',
    views: '8.1K',
    comments: '42',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  }
];

export function CommunityPage() {
  const { setNav } = useNavStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Descobrir');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
           <button className="p-2 -ml-2">
              <Menu size={20} className="text-zinc-400" />
           </button>
           <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter leading-none italic">
                MANGA<span className="text-indigo-500">OS</span>
              </h1>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest -mt-0.5">Comunidade</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Search size={20} />
           </button>
           <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-[#050505]">3</div>
           </button>
           <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-2">
              <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-0 max-w-lg mx-auto space-y-8">
        {/* Nav Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
           {['Descobrir', 'Seguindo', 'Tendências', 'Novos', 'Eventos'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                 activeTab === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-500 hover:text-zinc-300"
               )}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Hero Section */}
        <section className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden group shadow-2xl">
           <img 
             src="https://images.unsplash.com/photo-1578632738980-23055589ee99?auto=format&fit=crop&w=800&q=80" 
             className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
             alt="Featured"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
           <div className="absolute bottom-8 left-8 right-8 space-y-4">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Destaque da Semana</span>
              <h2 className="text-3xl font-serif font-black text-white italic leading-tight">O Último Guardião <br/>das Estrelas</h2>
              <p className="text-xs text-zinc-400 font-medium italic max-w-xs line-clamp-2">
                Em um mundo onde as estrelas estão morrendo uma a uma, Kael, o último guardião estelar, desperta...
              </p>
              <button className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-indigo-500 transition-all">
                 <Play size={14} className="fill-current" />
                 Ler agora
              </button>
           </div>
           
           <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex items-center gap-1.5">
              <div className="w-6 h-1.5 bg-indigo-600 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
           </div>
        </section>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
           {CATEGORIES.map((cat) => (
             <button 
               key={cat.label}
               className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all whitespace-nowrap"
             >
               <span>{cat.icon}</span>
               {cat.label}
             </button>
           ))}
        </div>

        {/* Trending Section */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-black text-white italic flex items-center gap-2">
                Em Alta <Flame size={18} className="text-orange-500" />
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                Ver tudo <ChevronRight size={14} />
              </button>
           </div>
           
           <div className="flex items-center gap-6 overflow-x-auto no-scrollbar -mx-4 px-4">
              {TRENDING_CARDS.map((card, i) => (
                <div key={i} className="min-w-[200px] aspect-[3/4] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-xl">
                   <img src={card.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={card.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                   
                   <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                        {card.category}
                      </span>
                   </div>

                   <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-sm font-serif font-black text-white italic tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">{card.title}</h4>
                      <p className="text-[9px] font-black text-white/60 tracking-wider mb-3">{card.author}</p>
                      
                      <div className="flex items-center gap-4 text-[9px] font-black text-white/50 uppercase tracking-widest">
                         <div className="flex items-center gap-1.5"><Eye size={12} /> {card.views}</div>
                         <div className="flex items-center gap-1.5"><MessageCircle size={12} /> {card.comments}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Community Activities */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-black text-white italic">Atividades da Comunidade</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                Ver tudo <ChevronRight size={14} />
              </button>
           </div>

           <ActivityPost 
             user="Victor Andrade"
             action="publicou um novo capítulo"
             time="2h atrás"
             avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=victor"
             title="Protocolo Zero - Capítulo 12"
             content="A verdade por trás do projeto finalmente começa a ser revelada."
             image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
             likes="128"
             comments="34"
           />

           <ActivityPost 
             user="HanaSakura"
             action="comentou em Corações em Toquio"
             time="4h atrás"
             avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=hana"
             content="Que capítulo incrível! Me emocionei demais com essa parte final. Parabéns! ❤️"
             previewImage="https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&w=400&q=80"
             isComment
           />
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 px-6 h-20 flex items-center justify-between max-w-lg mx-auto">
         <BottomNavItem icon={<Home size={22} />} label="Início" onClick={() => setNav('dashboard')} />
         <BottomNavItem icon={<Compass size={22} />} label="Explorar" />
         
         <div className="relative -mt-10">
            <button 
              onClick={() => setNav('dashboard')}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 border-4 border-[#050505] transition-all hover:scale-110 active:scale-90"
            >
               <Plus size={32} />
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-500">Criar</span>
         </div>

         <BottomNavItem icon={<Library size={22} />} label="Biblioteca" />
         <BottomNavItem icon={<Users size={22} />} label="Comunidade" active onClick={() => setNav('community')} />
      </nav>
    </div>
  );
}

function BottomNavItem({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-indigo-400 scale-110" : "text-zinc-600 hover:text-zinc-400"
    )}>
       <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-indigo-500/10")}>
          {icon}
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ActivityPost({ user, action, time, avatar, title, content, image, previewImage, likes, comments, isComment }: any) {
  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-6 space-y-4">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                <img src={avatar} alt={user} className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-xs font-black">
                   <span className="text-indigo-400">{user}</span>{' '}
                   <span className="text-zinc-500 font-medium italic">{action}</span>
                </p>
                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-0.5">{time}</p>
             </div>
          </div>
          <button className="p-2 text-zinc-800 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
       </div>

       <div className={cn("flex gap-4 items-start", isComment && "bg-zinc-950/30 p-4 rounded-2xl border border-white/5")}>
          {image ? (
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/5 shrink-0">
               <img src={image} alt="Work" className="w-full h-full object-cover" />
            </div>
          ) : previewImage && (
             <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 shrink-0 self-center">
                <img src={previewImage} alt="Work" className="w-full h-full object-cover grayscale" />
             </div>
          )}

          <div className="flex-1 space-y-2">
             {title && <h4 className="text-sm font-serif font-black text-white italic tracking-tight">{title}</h4>}
             <p className={cn("text-xs text-zinc-400 leading-relaxed italic line-clamp-3", isComment && "text-zinc-300 font-serif")}>
               {isComment && '"'}{content}{isComment && '"'}
             </p>
             
             {!isComment && (
                <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
                   Ler agora <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
             )}
          </div>
       </div>

       {likes && (
         <div className="pt-2 flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <Heart size={14} className="text-pink-600 fill-pink-600" />
               <span>{likes}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <MessageCircle size={14} />
               <span>{comments}</span>
            </div>
         </div>
       )}
    </div>
  );
}

function Users({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

import { ReactNode } from 'react';
import { auth } from '../../lib/firebase/config';
import { useAuthStore } from '../../stores/authStore';
import { useNavStore } from '../../App';
import { LogOut, Home, MessageCircle, Layout, User, Bell, PenTool, ImageIcon, Library, Box } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function MainLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { currentView, setNav, activeProjectId } = useNavStore();

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-300">
      {/* High-End Sidebar Rail */}
      <aside className="w-20 border-r border-zinc-900 bg-zinc-950 flex flex-col items-center py-10 gap-10 z-50">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setNav('dashboard')}
          className="w-12 h-12 bg-white rounded-[1.3rem] flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all font-black text-black italic text-2xl border-2 border-white/20"
        >
          3C
        </motion.div>

        <nav className="flex-1 flex flex-col gap-6">
          <NavItem 
            active={currentView === 'community' || currentView === 'feed'} 
            icon={<Layout size={22} />} 
            onClick={() => setNav('community')}
            tooltip="Comunidade"
          />
          <NavItem 
            active={currentView === 'dashboard'} 
            icon={<Home size={22} />} 
            onClick={() => setNav('dashboard')}
            tooltip="Portal Core"
          />
          {activeProjectId ? (
            <>
              <NavItem 
                active={currentView === 'editor'} 
                icon={<PenTool size={22} />} 
                onClick={() => setNav('editor', activeProjectId)}
                tooltip="Neural Script"
              />
              <NavItem 
                active={currentView === 'visualizer'} 
                icon={<ImageIcon size={22} />} 
                onClick={() => setNav('visualizer', activeProjectId)}
                tooltip="Manga Engine"
              />
              <NavItem 
                active={currentView === 'studio'} 
                icon={<Library size={22} />} 
                onClick={() => setNav('studio', activeProjectId)}
                tooltip="Studio Core"
              />
            </>
          ) : (
             <NavItem 
               icon={<Box size={22} className="opacity-20" />} 
               onClick={() => {}}
               tooltip="Select Project"
             />
          )}
        </nav>

        <div className="flex flex-col gap-6 items-center">
          <div className="relative group">
            <NavItem icon={<Bell size={22}/>} onClick={() => {}} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950" />
          </div>
          
          <div className="h-px w-8 bg-zinc-900" />

          <div className="relative group">
             <div 
               onClick={() => setNav('profile')}
               className={cn(
                 "w-10 h-10 rounded-2xl border-2 p-0.5 overflow-hidden active:scale-95 transition-transform cursor-pointer group-hover:border-indigo-500/50",
                 currentView === 'profile' ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "border-indigo-500/20"
               )}
             >
               <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="User" className="w-full h-full rounded-[0.8rem] transition-all" />
             </div>
             
             {/* Dynamic tooltip/menu placeholder */}
             <div className="absolute left-[120%] top-0 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl">
                {user?.displayName || 'Active Account'}
             </div>
          </div>

          <button 
            onClick={() => auth.signOut()}
            className="p-3 text-zinc-700 hover:text-red-500 transition-all hover:bg-red-500/5 rounded-2xl"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 h-screen overflow-hidden bg-zinc-950 selection:bg-indigo-500/30">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, active, onClick, tooltip }: { icon: ReactNode, active?: boolean, onClick: () => void, tooltip?: string }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
          active 
            ? "bg-zinc-900 text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-zinc-800" 
            : "text-zinc-700 hover:text-zinc-200 hover:bg-zinc-900/50"
        )}
      >
        {icon}
        {active && (
           <motion.div 
             layoutId="active-indicator"
             className="absolute -left-4 w-1 h-6 bg-white rounded-r-full shadow-[0_0_20px_white]" 
           />
        )}
      </button>
      
      {tooltip && (
        <div className="absolute left-[140%] top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-zinc-800 pointer-events-none shadow-2xl translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
}

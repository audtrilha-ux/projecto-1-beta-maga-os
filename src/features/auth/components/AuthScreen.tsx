import { useState } from 'react';
import { auth } from '../../../lib/firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'motion/react';
import { Box, Sparkles, Globe, Shield, ArrowRight } from 'lucide-react';

export function AuthScreen() {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-zinc-300 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center space-y-16 relative z-10"
      >
        <div className="flex flex-col items-center gap-8">
           <motion.div 
             whileHover={{ rotate: 10, scale: 1.1 }}
             className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-black font-black text-5xl italic shadow-[0_0_60px_rgba(255,255,255,0.15)] border-4 border-white/20"
           >
             3C
           </motion.div>
           
           <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-indigo-400">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                 <span className="text-[10px] uppercase tracking-[0.6em] font-black">Neural Network Online</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-serif font-black text-white tracking-tighter leading-none italic">
                A nova era da <br/> <span className="text-zinc-800">escrita.</span>
              </h1>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            icon={<Box size={20} />} 
            title="Matriz Neural" 
            desc="Processamento de linguagem natural proprietário." 
          />
          <FeatureCard 
            icon={<Sparkles size={20} className="text-indigo-400" />} 
            title="Visual AI" 
            desc="Geração de arte sequencial em tempo real." 
          />
          <FeatureCard 
            icon={<Globe size={20} />} 
            title="Cloud Sync" 
            desc="Sua biblioteca criativa em qualquer lugar." 
          />
        </div>

        <div className="space-y-8">
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full bg-white text-black py-7 rounded-[2.5rem] font-serif font-black italic text-2xl tracking-tighter flex items-center justify-center gap-6 hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
          >
            Sincronizar com Google
            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-8">
             <SecurityTag icon={<Shield size={12} />} label="End-to-End Encryption" />
             <div className="w-1 h-1 bg-zinc-800 rounded-full" />
             <SecurityTag icon={<div className="w-1 h-1 bg-green-500 rounded-full" />} label="Enterprise Ready" />
          </div>
        </div>

        <div className="pt-20">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
             © 2024 / TRIPLE-C CREATIVE SYSTEMS / V.3.5
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-zinc-900 shadow-inner group hover:bg-zinc-900 border border-zinc-900 hover:border-indigo-500/30 transition-all text-left space-y-4">
      <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors w-fit p-3 bg-zinc-950 rounded-xl">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">{title}</h3>
        <p className="text-[10px] text-zinc-600 font-medium italic leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SecurityTag({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-700">
       {icon}
       <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

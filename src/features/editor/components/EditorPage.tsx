import { useState } from 'react';
import { useNavStore } from '../../../App';
import { useEditorData } from '../hooks/useEditorData';
import { useStudio } from '../../studio/hooks/useStudio';
import { EditorContent } from '@tiptap/react';
import { 
  Sparkles, 
  Save, 
  Undo, 
  Redo, 
  Type, 
  PenTool,
  ImageIcon, 
  ChevronRight,
  Split,
  Layers,
  MessageSquare,
  Send,
  Trash2,
  Download,
  Settings,
  BookOpen,
  Plus, 
  ArrowLeft,
  Clock,
  Zap,
  Layout as LayoutIcon,
  Quote,
  Share2,
  Maximize2,
  Library,
  Box,
  Network,
  Map,
  Globe,
  Search,
  BarChart3,
  Film,
  History,
  MoreVertical,
  CheckCircle2,
  Target,
  User,
  ExternalLink,
  Table,
  Link,
  Check,
  Bold,
  Italic,
  Underline,
  List,
  Eye,
  Undo2,
  Redo2,
  Home,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { TextToolbar } from './TextToolbar';

export function EditorPage() {
  const { activeProjectId, setNav } = useNavStore();
  const { 
    editor, 
    project, 
    isLoading: isProjectLoading, 
    saveProject 
  } = useEditorData(activeProjectId);
  
  const { characters, worldEntries } = useStudio(activeProjectId);
  
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [showLorePanel, setShowLorePanel] = useState(false);
  const [isStoryboard, setIsStoryboard] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [aiMenuPos, setAiMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [chapters, setChapters] = useState([{ id: '1', title: 'Capítulo 1: O Início' }]);
  const [activeChapter, setActiveChapter] = useState('1');

  const [activeBottomTab, setActiveBottomTab] = useState('ESCRITA');

  const onSelectionUpdate = ({ editor }: { editor: any }) => {
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const top = Math.min(start.top, end.top) - 50;
      const left = (start.left + end.left) / 2;
      setAiMenuPos({ x: left, y: top });
    } else {
      setAiMenuPos(null);
    }
  };

  const runAiAssistant = async (type: string) => {
    if (!editor) return;
    setIsAiProcessing(true);
    setAiMenuPos(null);
    const content = editor.getText();
    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to, ' ');
    
    const studioContext = {
      characters: characters.map(c => ({ name: c.name, role: c.role, desc: c.description })),
      world: worldEntries.map(w => ({ title: w.title, category: w.category, content: w.content }))
    };
    
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: selectedText || "Continue story", 
          context: content, 
          studioContext,
          type 
        }),
      });
      const data = await res.json();
      if (data.text) {
        editor.chain().focus().insertContent(data.text).run();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleManualSave = async () => {
    await saveProject();
    setShowAutoSave(true);
    setTimeout(() => setShowAutoSave(false), 2000);
  };

  const handleSyncToManga = async () => {
    await saveProject();
    setNav('manga-pro', activeProjectId);
  };

  const exportProject = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([`
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; color: #111; }
            h1 { font-style: italic; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .meta { color: #666; font-size: 0.8em; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <h1>${project?.title}</h1>
          <div class="meta">${project?.type} | ${project?.subCategory}</div>
          ${content}
        </body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title || 'manuscript'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertAsset = (text: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<strong>${text}</strong> `).run();
  };

  const wordCount = editor?.storage.characterCount.words();
  const charCount = editor?.storage.characterCount.characters();

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0c] text-zinc-300 overflow-hidden font-sans select-none">
      {/* Top Header - Manga OS Style */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0d0d0f] z-50 shrink-0">
        <div className="flex items-center gap-4 md:gap-12">
          {/* Logo */}
          <div 
            onClick={() => setNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white italic font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                M
             </div>
             <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black tracking-[0.3em] text-white leading-none">MANGAOS</span>
                <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mt-1 group-hover:text-indigo-400 transition-colors">WRITER_MODE v2.1</span>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
             <button 
               onClick={() => setNav('project-workspace', activeProjectId)}
               className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
             >
                <ArrowLeft size={14} />
                WORKSPACE
             </button>
          </div>

          {/* Mobile Tools */}
          <div className="md:hidden flex items-center gap-2 bg-[#121214] px-2 py-1 rounded-xl border border-white/5 mx-2">
             <button className="p-1.5 text-zinc-600 active:text-white" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={14} /></button>
             <button className="p-1.5 text-zinc-600 active:text-white" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={14} /></button>
             <div className="w-px h-4 bg-white/5 mx-1" />
             <button 
               onClick={handleSyncToManga}
               className="flex items-center gap-1 text-[9px] font-black px-2 py-1 text-indigo-400 bg-indigo-500/10 rounded-lg"
             >
                MANGA
             </button>
          </div>

          {/* Project & Chapter */}
          <div className="flex items-center gap-4 md:gap-10">
             <div className="hidden lg:flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                   <Box size={20} />
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">{project?.title || 'PROJETO LIST'}</p>
                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Projeto ativo</p>
                </div>
             </div>

             <div className="space-y-0.5 max-w-[150px] md:max-w-none">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-white tracking-widest truncate">CAPÍTULO 1</p>
                <p className="text-[7px] md:text-[8px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircle2 size={10} className="text-green-500" />
                   Salvo agora
                </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-8">
           <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500">
                 Versão Atual <ChevronRight size={10} className="rotate-90" />
              </div>
              <span className="text-[10px] font-black text-zinc-300">v1.4.2</span>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-500/30 overflow-hidden shadow-xl shadow-indigo-500/10">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=writer`} alt="User" />
              </div>
              <button className="hidden md:block p-2 text-zinc-600 hover:text-white transition-colors">
                 <MoreVertical size={20} />
              </button>
           </div>

           <button className="flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 bg-indigo-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              <Send size={14} />
              <span className="hidden sm:inline">Publicar Capítulo</span>
              <span className="sm:hidden">Publicar</span>
           </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Mid Area: Editor Header Stats + Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
           {/* Top Stats Bar */}
           <div className="h-auto md:h-20 px-4 md:px-10 py-4 md:py-0 flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 bg-[#0a0a0c] gap-4">
              <div className="flex items-center gap-4 md:gap-12 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                 <StatBlock 
                   label={isAiProcessing ? "AI PROCESSANDO" : "SINCRONIZADO"} 
                   value={isAiProcessing ? "Calculando..." : "Offline: pronto"} 
                   icon={<div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", isAiProcessing ? "bg-indigo-500 shadow-indigo-500 animate-pulse" : "bg-green-500 shadow-green-500")} />}
                   status 
                 />
                 <StatBlock label={wordCount?.toString() || "0"} subLabel="PALAVRAS" icon={<BookOpen size={16} />} />
                 <StatBlock label={editor?.storage.characterCount.characters().toString() || "0"} subLabel="CARACTERES" icon={<Quote size={16} />} />
                 <StatBlock label={chapters.length.toString()} subLabel="CAPÍTULOS" icon={<Layers size={16} />} active />
              </div>

              <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 shrink-0">
                 <div className="flex items-center gap-1 md:gap-2 p-1 bg-[#0d0d0f] border border-white/5 rounded-2xl">
                    <EditorTab label="PROSA" active />
                    <EditorTab label="VISÃO" />
                    <EditorTab label="NEXO" />
                 </div>
                 <div className="hidden md:block h-8 w-px bg-white/5 mx-2" />
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setNav('manga-pro', activeProjectId)}
                      className="p-2.5 md:px-6 md:py-2 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-600/10 flex items-center gap-2"
                    >
                        <Box size={14} />
                        <span className="hidden md:inline">Studio Pro</span>
                    </button>
                    <button className="p-2.5 bg-[#0d0d0f] border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
                        <Search size={18} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Editor Content Area */}
           <section className="flex-1 overflow-y-auto px-6 md:px-24 py-8 md:py-16 flex flex-col items-center editor-scroll relative scroll-smooth bg-[#0a0a0c]">
             <div className="max-w-4xl w-full space-y-8 md:space-y-16">
                {/* Title and Subtitle Block */}
                <div className="space-y-4 md:space-y-6">
                   <h1 className="text-4xl md:text-7xl font-serif font-black italic text-white tracking-tighter leading-none">CAPÍTULO 1</h1>
                   <input 
                     type="text" 
                     placeholder="Adicione um subtítulo opcional..." 
                     className="bg-transparent border-none text-lg md:text-xl text-zinc-700 font-serif italic outline-none w-full placeholder:text-zinc-800"
                   />
                </div>

                {/* Floating Toolbar Node */}
                <div className="sticky top-6 z-40 flex justify-center translate-y-4 md:translate-y-10">
                   <div className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-x-auto no-scrollbar max-w-[90vw]">
                      <ToolBtn icon={<Type size={16} />} label="Normal" />
                      <div className="w-px h-6 bg-white/5 mx-1 md:mx-2" />
                      <ToolBtn icon={<Bold size={16} />} />
                      <ToolBtn icon={<Italic size={16} />} />
                      <ToolBtn icon={<Underline size={16} />} />
                      <ToolBtn icon={<Send className="rotate-45" size={16} />} />
                      <div className="hidden md:block w-px h-6 bg-white/5 mx-2" />
                      <ToolBtn icon={<Quote size={16} />} className="hidden md:flex" />
                      <ToolBtn icon={<Send size={16} />} className="hidden md:flex" />
                      <div className="w-px h-6 bg-white/5 mx-1 md:mx-2" />
                      <ToolBtn icon={<List size={16} />} />
                      <ToolBtn icon={<MoreVertical size={16} />} />
                   </div>
                </div>

                {/* The Editor View */}
                <div className="editor-content-manga-os pt-4 md:pt-10">
                   <EditorContent 
                     editor={editor} 
                     onKeyUp={() => { if (editor) onSelectionUpdate({ editor }); }}
                     onClick={() => { if (editor) onSelectionUpdate({ editor }); }}
                   />
                </div>

                {/* Status Bottom Meta */}
                <div className="pt-10 md:pt-20 pb-20 md:pb-40 flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 gap-6">
                   <div className="flex items-center gap-4 md:gap-6 text-[8px] md:text-[9px] font-black text-zinc-700 uppercase tracking-widest overflow-x-auto no-scrollbar shrink-0">
                      <span>1.561 palavras</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span>154 parágrafos</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span>8.742 caracteres</span>
                   </div>

                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest shrink-0">Meta: 2.000+ palavras</span>
                      <div className="flex-1 md:w-40 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-600 w-3/4 shadow-[0_0_10px_#4f46e5]" />
                      </div>
                   </div>
                </div>
             </div>

             {/* AI Menu Selection (Floating) */}
             <AnimatePresence>
               {aiMenuPos && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ top: aiMenuPos.y, left: aiMenuPos.x }}
                    className="fixed z-[100] -translate-x-1/2 flex items-center gap-1 bg-[#0d0d0f] border border-white/10 p-1.5 rounded-2xl shadow-2xl backdrop-blur-2xl"
                  >
                     <AiMenuBtn label="Expandir" icon={<Sparkles size={12} />} onClick={() => runAiAssistant('continue')} />
                     <AiMenuBtn label="Reescrever" icon={<Zap size={12} />} onClick={() => runAiAssistant('revise')} />
                  </motion.div>
               )}
             </AnimatePresence>

             {/* Mobile: AI Assistant Section (Matching screenshot) */}
             <div className="md:hidden w-full space-y-12 pb-20">
                <div className="flex items-center gap-8 border-b border-white/5 mb-8">
                   <button className="pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white border-b-2 border-indigo-600">Assistente IA</button>
                   <button className="pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
                       ANOTAÇÕES <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[7px] flex items-center justify-center">12</span>
                   </button>
                </div>

                <div className="p-6 bg-[#121214] border border-white/5 rounded-[2rem] space-y-6">
                   <div className="flex items-center gap-3 text-indigo-400">
                      <Sparkles size={14} className="animate-pulse" />
                      <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Sugestões Inteligentes</h4>
                   </div>
                   <AiSelectBlock label="Tom" options={['Sombrio', 'Misterioso', 'Tenso']} active="Sombrio" />
                   <AiSelectBlock label="Ritmo" options={['Lento', 'Moderado', 'Acelerado']} active="Lento" />
                   <AiSelectBlock label="Emoção" options={['Medo', 'Desconfiança', 'Tensão']} active="Medo" />
                </div>

                <div className="p-6 bg-[#121214] border border-white/5 rounded-[2rem] space-y-4 border-green-500/10">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-green-500/80">
                         <Network size={14} />
                         <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Continuidade</h4>
                      </div>
                      <CheckCircle2 size={14} className="text-green-500" />
                   </div>
                   <p className="text-[10px] text-zinc-500 leading-relaxed italic font-medium">A narrativa está consistente.</p>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-400">Personagens</h4>
                   <div className="space-y-2">
                      <MentionItem name="Protagonista" role="Principal" color="bg-indigo-600" />
                      <MentionItem name="Quinto Príncipe" role="Antagonista" color="bg-red-900/50" />
                   </div>
                </div>
             </div>
           </section>

           {/* Bottom Navigator */}
           <nav className="h-16 md:h-20 bg-[#0d0d0f] border-t border-white/5 flex items-center justify-center z-50 shrink-0">
              {/* Desktop Bottom Nav */}
              <div className="hidden md:flex items-center justify-center gap-4 w-full h-full">
                 <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-zinc-950/50 rounded-3xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                    <BottomTab label="ESCRITA" icon={<PenTool size={16} />} active={activeBottomTab === 'ESCRITA'} onClick={() => setActiveBottomTab('ESCRITA')} />
                    <BottomTab label="PERSONAGENS" icon={<User size={16} />} active={activeBottomTab === 'PERSONAGENS'} onClick={() => setActiveBottomTab('PERSONAGENS')} />
                    <BottomTab label="MUNDO" icon={<Globe size={16} />} active={activeBottomTab === 'MUNDO'} onClick={() => setActiveBottomTab('MUNDO')} />
                    <BottomTab label="LINHA" icon={<Clock size={16} />} active={activeBottomTab === 'LINHA'} onClick={() => setActiveBottomTab('LINHA')} labelFull="LINHA DO TEMPO" />
                    <BottomTab label="CAPS" icon={<Layers size={16} />} active={activeBottomTab === 'CAPÍTULOS'} onClick={() => setActiveBottomTab('CAPÍTULOS')} labelFull="CAPÍTULOS" />
                 </div>
              </div>

              {/* Mobile App Navigator Integration */}
              <div className="md:hidden flex items-center justify-around w-full px-4">
                 <AppNavItem icon={<Home size={20} />} label="Projetos" onClick={() => setNav('dashboard')} />
                 <AppNavItem icon={<Layers size={20} />} label="Capítulos" />
                 <AppNavItem icon={<PenTool size={20} />} label="Editor" active />
                 <AppNavItem icon={<ImageIcon size={20} />} label="Manga" onClick={handleSyncToManga} />
                 <AppNavItem icon={<MoreVertical size={20} />} label="Mais" />
              </div>
           </nav>
        </main>

        {/* Right Sidebar: AI Assistant Sidebar (Desktop Only) */}
        <aside className="hidden md:flex w-[380px] lg:w-[420px] border-l border-white/5 bg-[#0d0d0f] flex-col z-40 overflow-y-auto no-scrollbar">
           {/* Assistente Headers */}
           <div className="flex border-b border-white/5">
              <button className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white border-b-2 border-indigo-600">Assistente IA</button>
              <button className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white flex items-center justify-center gap-2">
                 ANOTAÇÕES <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[8px] flex items-center justify-center">12</span>
              </button>
           </div>

           <div className="p-10 space-y-12">
              {/* Sugestões Inteligentes Wrapper */}
              <div className="p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                    <Sparkles size={40} />
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex items-center gap-3 text-indigo-400">
                       <Sparkles size={14} className="animate-pulse" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Sugestões Inteligentes</h4>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <AiSelectBlock label="Tom" options={['Sombrio', 'Misterioso', 'Tenso']} active="Sombrio" />
                    <AiSelectBlock label="Ritmo" options={['Lento', 'Moderado', 'Acelerado']} active="Lento" />
                    <AiSelectBlock label="Emoção" options={['Medo', 'Desconfiança', 'Tensão']} active="Medo" />
                 </div>
              </div>

              {/* Continuidade Block */}
              <div className="p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group border-green-500/10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-green-500/80">
                       <Network size={14} />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Continuidade</h4>
                    </div>
                    <CheckCircle2 size={16} className="text-green-500" />
                 </div>
                 <p className="text-[10px] text-zinc-500 leading-relaxed italic font-medium">
                    A narrativa está consistente com os eventos anteriores.
                 </p>
                 <button className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all">
                    <Eye size={12} />
                    Ver Detalhes
                 </button>
              </div>

              {/* Personagens Mencionados */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-purple-400">
                    <History size={14} className="rotate-180" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Personagens Mencionados</h4>
                 </div>
                 <div className="space-y-3">
                    <MentionItem name="Protagonista" role="Principal" color="bg-indigo-600" />
                    <MentionItem name="Quinto Príncipe" role="Antagonista" color="bg-red-900/50" />
                    <MentionItem name="Seguranças" role="Neutro" color="bg-zinc-800" />
                 </div>
              </div>

              {/* Últimas Alterações */}
              <div className="space-y-6 pt-12 border-t border-white/5">
                 <div className="flex items-center gap-3 text-zinc-500">
                    <History size={14} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Últimas Alterações</h4>
                 </div>
                 <div className="space-y-4">
                    <EditLog text="Você editou 2 parágrafos" time="há 2 min" />
                    <EditLog text="Você adicionou 154 palavras" time="há 5 min" />
                    <EditLog text="Você removeu 1 parágrafo" time="há 12 min" />
                 </div>
                 <button className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-white transition-all">
                    <History size={14} />
                    Ver Histórico Completo
                 </button>
              </div>
           </div>
        </aside>
      </div>

      {/* Global Status Bar Bottom */}
      <footer className="h-10 bg-[#0d0d0f] border-t border-white/5 flex items-center justify-between px-8 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">
         <div className="flex items-center gap-8">
            <span className="text-white">NODE: STACK-V2.1</span>
            <span>Uptime: Locked</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
         </div>
         <div className="flex items-center gap-4">
            <Settings size={12} />
         </div>
      </footer>
    </div>
  );
}

function NavIcon({ icon, active, className, onClick }: { icon: any, active?: boolean, className?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl transition-all relative group",
        active ? "bg-white/5 text-indigo-500 shadow-inner" : "text-zinc-700 hover:text-white",
        className
      )}
    >
       {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-full" />}
       {icon}
    </button>
  );
}

function AppNavItem({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-all p-1", active ? "text-indigo-500" : "text-zinc-600")}>
       {icon}
       <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function StatBlock({ label, value, subLabel, icon, active, status }: { label: string, value?: string, subLabel?: string, icon: any, active?: boolean, status?: boolean }) {
  return (
    <div className={cn(
      "px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 transition-all bg-[#0d0d0f] min-w-[140px]",
      active && "border-indigo-500/30 bg-indigo-500/5",
      status && "bg-[#121214]"
    )}>
       <div className="text-zinc-600 group-active:text-indigo-400">
          {icon}
       </div>
       <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <span className="text-[12px] font-black text-white">{label}</span>
             {value && <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{value}</span>}
          </div>
          {subLabel && <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mt-1">{subLabel}</span>}
       </div>
    </div>
  );
}

function EditorTab({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={cn(
      "px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all",
      active ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-zinc-600 hover:text-white"
    )}>
       {label}
    </button>
  );
}

function ToolBtn({ icon, label, className }: { icon: any, label?: string, className?: string }) {
  return (
    <button className={cn("flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-black text-[10px] uppercase", className)}>
       {icon}
       {label && <span className="tracking-widest flex items-center gap-1">{label} <ChevronRight size={10} className="rotate-90 mt-0.5" /></span>}
    </button>
  );
}

function BottomTab({ label, icon, active, onClick, labelFull }: { label: string, icon: any, active?: boolean, onClick: () => void, labelFull?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-10 py-3.5 rounded-[1.8rem] transition-all relative overflow-hidden group select-none",
        active ? "bg-indigo-600 text-white shadow-2xl scale-105" : "text-zinc-500 hover:text-white hover:bg-white/5"
      )}
    >
       {active && <motion.div layoutId="bg" className="absolute inset-0 bg-indigo-600" />}
       <div className="relative z-10 flex items-center gap-3">
          {icon}
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">{labelFull || label}</span>
       </div>
    </button>
  );
}

function AiSelectBlock({ label, options, active }: { label: string, options: string[], active: string }) {
  return (
    <div className="space-y-4">
       <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">{label}</span>
       <div className="grid grid-cols-3 gap-2">
          {options.map(opt => (
            <button 
              key={opt}
              className={cn(
                "py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                active === opt ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-zinc-950 border-white/5 text-zinc-600 hover:text-white hover:border-white/10"
              )}
            >
               {opt}
            </button>
          ))}
       </div>
    </div>
  );
}

function MentionItem({ name, role, color }: { name: string, role: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#121214] border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
       <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{name}</span>
       </div>
       <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white/80", color)}>
          {role}
       </span>
    </div>
  );
}

function EditLog({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex items-center justify-between text-zinc-600">
       <span className="text-[10px] font-medium italic">{text}</span>
       <span className="text-[9px] font-black uppercase tracking-widest">{time}</span>
    </div>
  );
}
function AiMenuBtn({ label, icon, onClick }: { label: string, icon: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}

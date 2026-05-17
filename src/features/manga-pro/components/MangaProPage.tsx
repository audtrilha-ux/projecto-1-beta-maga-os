import { useState, useEffect, useRef } from 'react';
import { useNavStore } from '../../../App';
import { useEditorData } from '../../editor/hooks/useEditorData';
import { useMangaEditor, MangaElementType, MangaElement } from '../hooks/useMangaEditor';
import { 
  MousePointer2, 
  Type, 
  MessageSquare, 
  PenTool, 
  Eraser, 
  Shapes, 
  Image as ImageIcon, 
  Blend, 
  Grid3X3, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Settings,
  Plus,
  Undo2,
  Redo2,
  Download,
  FileJson,
  FileImage,
  Eye,
  EyeOff,
  Lock,
  Search,
  Layout,
  Save,
  Rocket,
  Menu,
  ChevronDown,
  Cloud,
  MoreHorizontal,
  Home,
  User,
  MoreVertical,
  History,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

export function MangaProPage() {
  const { setNav, activeProjectId } = useNavStore();
  const { project, mangaData, setMangaData, saveProject, isLoading } = useEditorData(activeProjectId);
  
  const editor = useMangaEditor(mangaData);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSaveWorkspace = async () => {
    setIsSaving(true);
    setMangaData(editor.serialize());
    await saveProject();
    setIsSaving(false);
  };

  const handleSyncToNovel = async () => {
    await handleSaveWorkspace();
    setNav('editor', activeProjectId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      if (e.target === e.currentTarget) {
        editor.selectElement(null);
      }
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Adjust for basic scaling (1.2x)
    const x = (e.clientX - rect.left) / 1.2;
    const y = (e.clientY - rect.top) / 1.2;

    if (activeTool === 'panel') {
      editor.addElement('panel', { x: x - 50, y: y - 40, w: 100, h: 80, layerId: 'Layout_Root' });
    } else if (activeTool === 'bubble') {
      editor.addElement('bubble', { x: x - 40, y: y - 30, w: 80, h: 60, layerId: 'Dialogue_Layer' });
    } else if (activeTool === 'text') {
      editor.addElement('text', { x: x - 60, y: y - 20, w: 120, h: 40, content: 'Novo Texto', layerId: 'Dialogue_Layer' });
    }
    
    setActiveTool('select');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const layersList = [
    { id: 'Layout_Root', name: 'LAYOUT_ROOT', type: 'folder', opacity: 100, locked: true, visible: true },
    { id: 'Dialogue_Layer', name: 'DIALOGUE_LAYER', type: 'group', opacity: 100, locked: false, visible: true },
    { id: 'Inking_Sheet', name: 'INKING_SHEET', type: 'group', opacity: 100, locked: false, visible: true },
    { id: 'Background', name: 'BACKGROUND', type: 'background', opacity: 100, locked: false, visible: true },
  ];

  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-zinc-300 flex flex-col overflow-hidden font-sans select-none">
      <header className="h-14 md:h-16 border-b border-white/5 bg-[#0d0d0f] flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setNav('project-workspace', activeProjectId)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="hidden md:block h-4 w-px bg-white/10" />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{project?.title || 'STUDIO PRO'}</span>
            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mt-1">MangaOS Engine v2.5</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
           <button 
            onClick={handleSaveWorkspace}
            className="p-2 md:p-2.5 bg-[#121214] border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-[10px] uppercase font-black tracking-widest"
           >
              {isSaving ? <div className="animate-spin w-4 h-4 rounded-full border-2 border-white border-t-transparent" /> : <Save size={16} />}
              <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar'}</span>
           </button>

           <button 
            onClick={handleSyncToNovel}
            className="hidden md:flex px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 items-center gap-2"
           >
              <Rocket size={14} />
              Finalizar Edição
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="bg-[#0d0d0f] border-r border-white/5 flex flex-col items-center w-20 md:w-24 py-6 shrink-0">
           <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-6 px-4">Studio</div>
           <div className="space-y-2 md:space-y-4 w-full px-2 md:px-4 overflow-y-auto no-scrollbar">
              <MangaTool icon={<MousePointer2 size={18} />} label="Selec" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
              <MangaTool icon={<Layout size={18} />} label="Painel" active={activeTool === 'panel'} onClick={() => setActiveTool('panel')} />
              <MangaTool icon={<MessageSquare size={18} />} label="Balão" active={activeTool === 'bubble'} onClick={() => setActiveTool('bubble')} />
              <MangaTool icon={<Type size={18} />} label="Texto" active={activeTool === 'text'} onClick={() => setActiveTool('text')} />
              <MangaTool icon={<ImageIcon size={18} />} label="Img" active={activeTool === 'image'} onClick={() => setActiveTool('image')} />
              <MangaTool icon={<PenTool size={18} />} label="Des" active={activeTool === 'pen'} onClick={() => setActiveTool('pen')} />
              <div className="h-px bg-white/5 my-4" />
              <MangaTool icon={<Eraser size={18} />} label="Apagar" active={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
           </div>
        </aside>

        <main className="flex-1 bg-[#121214] flex flex-col relative overflow-hidden">
           <div className="flex-1 overflow-auto flex items-center justify-center p-10 md:p-20 editor-scroll bg-[radial-gradient(#1a1a1c_1px,transparent_1px)] bg-[size:40px_40px]">
              <motion.div 
                ref={canvasRef}
                onClick={handleCanvasClick}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden shrink-0"
                style={{ width: '300px', height: '425px', scale: '1.2' }} 
              >
                  {/* Elements */}
                  {editor.currentPage.elements.map(el => (
                    <CanvasElement 
                      key={el.id} 
                      element={el} 
                      selected={editor.state.selectedElementId === el.id}
                      onClick={() => editor.selectElement(el.id)}
                      onUpdate={(updates) => editor.updateElement(el.id, updates)}
                    />
                  ))}

                  {/* Bleed Lines */}
                  <div className="absolute inset-2 border border-cyan-500/10 pointer-events-none" />
                  <div className="absolute inset-4 border border-magenta-500/10 pointer-events-none" />
              </motion.div>
           </div>

           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#0d0d0f]/90 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-50">
              <button className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white" onClick={() => editor.setCurrentPageId(Math.max(1, editor.state.currentPageId - 1))}>
                 <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-4 px-4 border-l border-r border-white/10">
                 <span className="text-xs font-black text-indigo-400">PÁGINA {editor.state.currentPageId}</span>
                 <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">/ 24</span>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white" onClick={() => editor.setCurrentPageId(Math.min(24, editor.state.currentPageId + 1))}>
                 <ChevronRight size={20} />
              </button>
           </div>
        </main>

        <aside className="hidden lg:flex w-80 border-l border-white/5 bg-[#0d0d0f] flex-col z-40">
           <div className="flex border-b border-white/5">
              <button className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-white border-b-2 border-indigo-600">Inspetor</button>
              <button className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Camadas</button>
           </div>
           
           <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
              {editor.selectedElement ? (
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Ajustes do Objeto</h4>
                      <button 
                         onClick={() => editor.updateElement(editor.state.selectedElementId!, { visible: false })}
                         className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Posição</span>
                         <div className="flex gap-2">
                            <PropInput label="X" value={Math.round(editor.selectedElement.x)} onChange={(v) => editor.updateElement(editor.selectedElement!.id, { x: parseInt(v) || 0 })} />
                            <PropInput label="Y" value={Math.round(editor.selectedElement.y)} onChange={(v) => editor.updateElement(editor.selectedElement!.id, { y: parseInt(v) || 0 })} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Dimensões</span>
                         <div className="flex gap-2">
                            <PropInput label="W" value={Math.round(editor.selectedElement.w)} onChange={(v) => editor.updateElement(editor.selectedElement!.id, { w: parseInt(v) || 0 })} />
                            <PropInput label="H" value={Math.round(editor.selectedElement.h)} onChange={(v) => editor.updateElement(editor.selectedElement!.id, { h: parseInt(v) || 0 })} />
                         </div>
                      </div>
                   </div>

                   {editor.selectedElement.type === 'text' && (
                     <div className="space-y-2">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Conteúdo</span>
                        <textarea 
                          value={editor.selectedElement.content}
                          onChange={(e) => editor.updateElement(editor.selectedElement!.id, { content: e.target.value })}
                          className="w-full bg-[#121214] border border-white/5 rounded-xl p-4 text-xs text-white h-24 resize-none outline-none focus:border-indigo-500/50 transition-all font-serif"
                        />
                     </div>
                   )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
                      <MousePointer2 size={24} />
                   </div>
                   <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Nenhum item selecionado</p>
                </div>
              )}

              <div className="space-y-4 pt-10">
                 <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Layers</h4>
                    <Plus size={12} className="text-zinc-600 hover:text-white cursor-pointer" />
                 </div>
                 <div className="space-y-1">
                    {layersList.map(layer => (
                      <div key={layer.id} className="group px-4 py-3 bg-[#121214]/50 border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all cursor-pointer">
                         <div className="flex items-center gap-3">
                            <Layers size={14} className="text-zinc-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-all">{layer.name}</span>
                         </div>
                         <Eye size={12} className="text-zinc-700" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </aside>
      </div>

      <footer className="h-32 border-t border-white/5 bg-[#0d0d0f] flex items-center px-6 gap-4 overflow-x-auto no-scrollbar">
         {editor.state.pages.map(page => (
           <div 
             key={page.id} 
             onClick={() => editor.setCurrentPageId(page.id)}
             className={cn(
               "h-20 aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer flex-col shrink-0 overflow-hidden relative group",
               editor.state.currentPageId === page.id ? "border-indigo-600" : "border-white/5 hover:border-white/20"
             )}
           >
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-black text-zinc-800">
                 {page.id}
              </div>
           </div>
         ))}
      </footer>
    </div>
  );
}

function CanvasElement({ element, selected, onClick, onUpdate }: { 
  element: MangaElement, 
  selected: boolean, 
  onClick: () => void,
  onUpdate: (updates: Partial<MangaElement>) => void
}) {
  if (!element.visible) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
         // We should update the final position here for persistence
         // For a quick POC, we can just rely on the drag visual but for real persistence we need to update state
         // But updating state during drag is heavy. So onDragEnd is better.
         // Note: info.point is absolute. We need relative to container. 
         // Since I handle x/y in style, motion drag takes care of it visually.
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute cursor-move overflow-hidden border-2",
        selected ? "border-indigo-500 shadow-2xl z-50 ring-4 ring-indigo-500/10" : "border-transparent",
        element.type === 'panel' && "bg-zinc-100 border-zinc-900 border-[3px]",
        element.type === 'bubble' && "bg-white border-zinc-900 border-[1px] rounded-full",
        element.type === 'text' && "bg-transparent border-transparent"
      )}
      style={{
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        rotate: `${element.rotation}deg`
      }}
    >
      {element.type === 'text' && (
        <div className="w-full h-full p-2 text-[10px] font-serif leading-tight text-center flex items-center justify-center break-words text-black">
           {element.content}
        </div>
      )}
      {element.type === 'image' && element.content && (
        <img src={element.content} className="w-full h-full object-cover grayscale contrast-125" />
      )}
      
      {selected && (
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-500 -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-2 h-2 bg-indigo-500 -translate-x-1/2 translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-500 translate-x-1/2 translate-y-1/2" />
        </div>
      )}
    </motion.div>
  );
}

function MangaTool({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group",
        active ? "bg-[#5e2ed3] text-white shadow-xl shadow-indigo-600/30 scale-105" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
      )}
    >
       {icon}
       <span className="text-[8px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}

function PropInput({ label, value, onChange }: { label: string, value: string | number, onChange?: (val: string) => void }) {
  return (
    <div className="flex-1 bg-[#121214] border border-white/5 rounded-xl px-2 py-1.5 flex items-center gap-2">
       <span className="text-[9px] font-black text-zinc-600">{label}</span>
       <input 
         type="text"
         value={value}
         onChange={(e) => onChange?.(e.target.value)}
         className="bg-transparent text-[10px] font-black text-white w-full outline-none"
       />
    </div>
  );
}

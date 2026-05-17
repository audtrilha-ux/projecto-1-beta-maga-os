import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Highlighter,
  Heading1,
  Heading2,
  Type
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function TextToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttons = [
    { icon: <Bold size={16} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: <Italic size={16} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: <UnderlineIcon size={16} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), label: 'Underline' },
    { icon: <Highlighter size={16} />, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight'), label: 'Highlight' },
    { icon: <Heading1 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), label: 'H1' },
    { icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'H2' },
    { icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet List' },
    { icon: <ListOrdered size={16} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Ordered List' },
    { icon: <Quote size={16} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Quote' },
    { icon: <Code size={16} />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock'), label: 'Code Block' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl mb-4 self-start">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          className={cn(
            "p-2 rounded transition-all flex items-center justify-center",
            btn.active ? "bg-indigo-600 text-white shadow-inner" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          )}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      <button onClick={() => editor.chain().focus().undo().run()} className="p-2 text-zinc-500 hover:text-white"><Undo size={16}/></button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-2 text-zinc-500 hover:text-white"><Redo size={16}/></button>
    </div>
  );
}

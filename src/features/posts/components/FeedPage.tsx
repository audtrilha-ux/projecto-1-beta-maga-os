import { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  Music,
  MoreHorizontal,
  Send,
  Brain,
  TrendingUp,
  Book,
  Zap
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAuthStore } from '../../../stores/authStore';
import { useNavStore } from '../../../App';

const PostCard = ({ post, likePost }: { post: any, likePost: (id: string) => void }) => {
  const isVisual = post.category === 'manga' || post.category === 'webtoon';
  
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] overflow-hidden hover:bg-zinc-900/60 transition-all group",
        isVisual && "border-indigo-500/10 shadow-[0_20px_50px_rgba(99,102,241,0.05)]"
      )}
    >
       <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-800">
                   <img src={post.authorPhotoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} alt={post.authorName} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="font-bold text-white leading-none">{post.authorName}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{post.category || 'Creator'}</p>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <p className="text-[9px] font-medium text-zinc-600 italic">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Nexus active'}</p>
                   </div>
                </div>
             </div>
             <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                <MoreHorizontal size={20} />
             </button>
          </div>

          <div className="space-y-4">
             {post.title && (
               <h3 className={cn(
                 "text-2xl font-black tracking-tight leading-none italic",
                 post.category === 'novel' ? "font-serif text-white" : "font-sans text-indigo-100 uppercase"
               )}>
                 {post.title}
               </h3>
             )}
             
             {post.subCategory && (
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8px] font-black uppercase text-indigo-400 tracking-widest">
                     {post.subCategory}
                   </span>
                </div>
             )}

             <p className={cn(
               "text-zinc-300 leading-relaxed font-medium",
               post.category === 'novel' ? "text-lg italic" : "text-sm"
             )}>
                {post.content}
             </p>
             
             {post.mediaUrl && (
               <div className={cn(
                 "rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative",
                 isVisual ? "aspect-[4/5] md:aspect-video" : "aspect-video"
               )}>
                  <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                  {isVisual && <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">Neural Render</div>}
               </div>
             )}
          </div>

          <div className="flex items-center gap-6 pt-2">
             <button 
               onClick={() => likePost(post.id)}
               className="flex items-center gap-2 text-zinc-500 hover:text-pink-500 transition-colors group/btn"
             >
                <div className="p-2.5 rounded-xl group-hover/btn:bg-pink-500/10 transition-all">
                   <Heart size={20} className={cn(post.likeCount > 0 && "fill-pink-500 text-pink-500")} />
                </div>
                <span className="text-sm font-bold">{post.likeCount}</span>
             </button>
             <button className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors group/btn">
                <div className="p-2.5 rounded-xl group-hover/btn:bg-indigo-500/10 transition-all">
                   <MessageCircle size={20} />
                </div>
                <span className="text-sm font-bold">{post.commentCount}</span>
             </button>
             <button className="flex items-center gap-2 text-zinc-500 hover:text-green-400 transition-colors group/btn">
                <div className="p-2.5 rounded-xl group-hover/btn:bg-green-500/10 transition-all">
                   <Share2 size={20} />
                </div>
             </button>
          </div>
       </div>
    </motion.article>
  );
};

export function FeedPage() {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const { posts, loading, createPost, likePost } = usePosts(filterType);
  const { user } = useAuthStore();
  const { setNav } = useNavStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const categories = [
    { id: undefined, label: 'Tudo', icon: <TrendingUp size={14} /> },
    { id: 'novel', label: 'Novels', icon: <Book size={14} /> },
    { id: 'manga', label: 'Mangás', icon: <ImageIcon size={14} /> },
    { id: 'webtoon', label: 'Webtoons', icon: <Zap size={14} /> },
  ];

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      await createPost(newPostContent);
      setNewPostContent('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const creativeSeeds = [
    "No ano de 2099, a memória física tornou-se um item de luxo...",
    "Ela descobriu que sua sombra tinha vida própria e planos sombrios.",
    "O que acontece quando robôs começam a sonhar em cores?",
    "Em um mundo onde o som é proibido, eles criaram a rebelião rítmica.",
  ];

  const handleQuickProject = () => {
    setNav('dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-12">
      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
         {categories.map((cat) => (
           <button 
             key={cat.label}
             onClick={() => setFilterType(cat.id)}
             className={cn(
               "flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
               filterType === cat.id ? "bg-white text-black shadow-xl" : "bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800"
             )}
           >
             {cat.icon}
             {cat.label}
           </button>
         ))}
      </div>
      {/* Neural Starter */}
      <section className="relative p-1 bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-purple-500/20 rounded-[3rem] overflow-hidden">
        <div className="bg-zinc-950 rounded-[2.8rem] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-all duration-1000" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-3 text-indigo-400 mb-1">
                  <Brain size={14} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Neural Seed Loader</span>
               </div>
               <h2 className="text-2xl font-serif font-black text-white italic tracking-tight leading-none">Iniciar Narrativa</h2>
            </div>
            <button 
              onClick={handleQuickProject}
              className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 shrink-0"
            >
              <Plus size={14} /> Novo Projeto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {creativeSeeds.map((seed, i) => (
              <button 
                key={i} 
                className="bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-900 text-left hover:border-indigo-500/30 hover:bg-zinc-900 transition-all group"
                onClick={() => {
                  setNewPostContent(seed);
                }}
              >
                 <p className="text-[9px] text-zinc-500 font-medium italic leading-relaxed line-clamp-2 group-hover:text-zinc-300">"{seed}"</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Create Post Header */}
      <section className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800 shrink-0">
             <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <form onSubmit={handlePostSubmit} className="flex-1 space-y-3">
             <textarea 
               value={newPostContent}
               onChange={(e) => setNewPostContent(e.target.value)}
               placeholder="Que história você está criando hoje?" 
               className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 resize-none h-20 text-lg font-medium"
             />
             <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                <div className="flex gap-2">
                   <button type="button" className="p-2.5 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                      <ImageIcon size={20} />
                   </button>
                   <button type="button" className="p-2.5 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                      <Video size={20} />
                   </button>
                   <button type="button" className="p-2.5 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                      <Music size={20} />
                   </button>
                </div>
                <button 
                  type="submit"
                  disabled={isPosting || !newPostContent.trim()}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                   {isPosting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                   Publicar
                </button>
             </div>
          </form>
        </div>
      </section>

      {/* Feed */}
      <div className="space-y-6 pb-20">
         {loading ? (
           <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
           </div>
         ) : (
           <AnimatePresence>
             {posts.map((post) => (
               <PostCard key={post.id} post={post} likePost={likePost} />
             ))}
           </AnimatePresence>
         )}
      </div>
    </div>
  );
}

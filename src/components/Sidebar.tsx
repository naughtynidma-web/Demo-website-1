import React, { useState } from 'react';
import { Clock, TrendingUp, Mail, CheckCircle2, RotateCw } from 'lucide-react';
import { WPPost, WPAuthor, WPCategory } from '../types/wordpress';

interface SidebarProps {
  latestPosts: WPPost[];
  trendingPosts: WPPost[];
  opinionPosts: WPPost[];
  authors: WPAuthor[];
  categories: WPCategory[];
  onNavigate: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  latestPosts,
  trendingPosts,
  opinionPosts,
  authors,
  categories,
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <aside className="space-y-6 select-none">
      
      {/* Primary Latest News Box (Matching Professional Polish Theme) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-850">
          <h2 className="text-sm font-black uppercase tracking-tighter text-[#002244] dark:text-white flex justify-between items-center">
            <span>Latest News</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 lowercase font-normal flex items-center gap-1">
              <RotateCw className="w-2.5 h-2.5" />
              <span>live updates</span>
            </span>
          </h2>
        </div>

        <div className="px-4 divide-y divide-gray-100 dark:divide-slate-800">
          {latestPosts.slice(0, 5).map((post) => {
            const isUrdu = post.language === 'ur';
            return (
              <div 
                key={post.id} 
                onClick={() => onNavigate(`post:${post.slug}`)}
                className="py-3.5 group cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-[#c00] uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">
                    {new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 
                  className={`text-[13px] font-bold leading-snug text-[#1a1a1a] dark:text-slate-200 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
                    isUrdu ? 'font-urdu text-sm text-right' : ''
                  }`}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                >
                  {post.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Newsletter Section in Aside */}
        <div className="p-4 bg-gray-50 dark:bg-slate-850 border-t border-gray-100 dark:border-slate-800">
          <div className="bg-blue-900 p-4 rounded-md text-white text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-80 text-amber-300">Newsletter</p>
            <p className="text-xs font-serif italic mb-3 text-slate-100">Daily briefing in your inbox.</p>
            
            {subscribed ? (
              <div className="bg-emerald-800/80 text-emerald-100 text-[11px] p-2 rounded flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Subscribed! Check inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  className="w-full bg-white text-slate-800 h-8 rounded px-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="submit"
                  className="w-full bg-[#c00] hover:bg-red-700 text-white font-bold py-1.5 rounded text-[11px] uppercase tracking-wider transition"
                >
                  Join Daily Briefing
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Most Read Ranking List */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-gray-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5 mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#002244] dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#002244] dark:text-blue-400" />
            <span>Most Read</span>
          </h3>
          <span className="text-[10px] text-gray-400 font-medium">South Asia & Global</span>
        </div>

        <div className="space-y-3">
          {trendingPosts.slice(0, 4).map((post, idx) => (
            <div 
              key={post.id} 
              onClick={() => onNavigate(`post:${post.slug}`)}
              className="flex items-start space-x-3 cursor-pointer group py-1 transition"
            >
              <span className="text-lg font-black text-gray-300 dark:text-gray-600 group-hover:text-[#c00] transition w-5 shrink-0 text-center font-mono">
                {idx + 1}
              </span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-900 dark:group-hover:text-blue-400 leading-snug line-clamp-2">
                  {post.title}
                </h4>
                <span className="text-[9px] text-gray-400 mt-0.5 block">{post.views.toLocaleString()} readers</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Ad Slot */}
      <div className="w-full h-[220px] bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
        <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest text-[10px]">ADVERTISEMENT</span>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs">Partner with Dunya International to reach global business and diaspora audiences.</p>
        <button 
          onClick={() => onNavigate('page:advertise')}
          className="mt-3 text-[11px] text-[#002244] dark:text-amber-400 font-bold hover:underline"
        >
          Media Kit & Rates &rarr;
        </button>
      </div>

    </aside>
  );
};


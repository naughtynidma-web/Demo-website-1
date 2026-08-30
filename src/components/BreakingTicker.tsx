import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { WPPost } from '../types/wordpress';

interface NewsTickerProps {
  posts: WPPost[];
  onSelectPost: (post: WPPost) => void;
  speedMs?: number; // Slide interval speed in milliseconds (Default: 4000ms / 4s)
}

export const NewsTicker: React.FC<NewsTickerProps> = ({
  posts,
  onSelectPost,
  speedMs = 4000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Filter breaking news posts or fallback to top posts
  const tickerPosts = posts.filter(p => p.isBreaking || p.isFeatured).slice(0, 8);
  const activePosts = tickerPosts.length > 0 ? tickerPosts : posts.slice(0, 5);

  useEffect(() => {
    if (isPaused || activePosts.length === 0) return;

    const interval = setInterval(() => {
      // Smooth fade out effect
      setFadeState('out');

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activePosts.length);
        setFadeState('in');
      }, 300); // 300ms transition phase
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPaused, activePosts.length, speedMs]);

  if (activePosts.length === 0) return null;

  const currentPost = activePosts[currentIndex];

  const handlePrev = () => {
    setFadeState('out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? activePosts.length - 1 : prev - 1));
      setFadeState('in');
    }, 200);
  };

  const handleNext = () => {
    setFadeState('out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activePosts.length);
      setFadeState('in');
    }, 200);
  };

  return (
    <div className="bg-[#0b1320] text-white flex items-center justify-between px-3 md:px-6 py-2 text-xs border-b border-slate-800 select-none">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        {/* Red Breaking Badge */}
        <span className="bg-[#c00] text-white font-extrabold uppercase px-2.5 py-0.5 rounded-xs text-[10px] tracking-wider shrink-0 animate-pulse">
          BREAKING
        </span>

        {/* Sliding / Fading Text Container */}
        <div 
          className="overflow-hidden cursor-pointer flex-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => onSelectPost(currentPost)}
        >
          <div 
            className={`transition-all duration-300 transform ${
              fadeState === 'in' 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2'
            } font-medium text-slate-200 hover:text-white hover:underline truncate`}
          >
            {currentPost.title}
          </div>
        </div>
      </div>

      {/* Manual Slide Controls & Counter */}
      <div className="flex items-center gap-2 text-slate-400 shrink-0 ml-3 text-[11px]">
        <span>
          <strong className="text-white">{currentIndex + 1}</strong>/{activePosts.length}
        </span>
        
        <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
          <button 
            onClick={handlePrev}
            className="p-1 hover:text-white transition rounded hover:bg-slate-800"
            title="Previous Story"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-white transition rounded hover:bg-slate-800"
            title={isPaused ? "Play Auto-Slide" : "Pause Auto-Slide"}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-1 hover:text-white transition rounded hover:bg-slate-800"
            title="Next Story"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

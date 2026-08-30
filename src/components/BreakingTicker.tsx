import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play, Flame } from 'lucide-react';
import { WPPost } from '../types/wordpress';

interface BreakingTickerProps {
  posts: WPPost[];
  customText?: string;
  onNavigate: (route: string) => void;
  speed?: number;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  posts,
  customText,
  onNavigate,
  speed = 6
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If breaking posts are available, use their titles; otherwise fallback to customText or default breaking alerts
  const defaultAlerts = [
    'Pakistan Announces Strategic Economic Reforms Package and Digital Trade Framework',
    'Global Markets React to New International Trade and Energy Agreement',
    'Three Generations of Learning: The Gholam Mustafa–Mujtaba Family Legacy Featured Report'
  ];

  const items = posts.length > 0 
    ? posts.map(p => ({ id: p.id, title: p.title, slug: p.slug, category: p.category }))
    : customText 
      ? [{ id: 'custom-1', title: customText, slug: '', category: 'Breaking' }]
      : defaultAlerts.map((text, idx) => ({ id: `default-${idx}`, title: text, slug: idx === 2 ? 'three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy' : '', category: 'Breaking' }));

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [items.length, isPaused, speed]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div 
      className="bg-[#002244] text-white text-[11px] px-4 md:px-6 py-1.5 flex justify-between items-center border-b border-[#003366] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden flex-1">
        <span className="bg-[#c00] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs shrink-0 flex items-center gap-1">
          <Flame className="w-3 h-3 animate-pulse" />
          <span>Breaking</span>
        </span>

        <div className="overflow-hidden whitespace-nowrap italic opacity-95 flex-1 pr-4">
          {currentItem.slug ? (
            <button
              onClick={() => onNavigate(`post:${currentItem.slug}`)}
              className="text-white hover:text-amber-300 transition text-left truncate block w-full text-xs"
            >
              {currentItem.title}
            </button>
          ) : (
            <span className="text-white text-xs truncate block">
              {currentItem.title}
            </span>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex items-center gap-1 shrink-0 text-white/70">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="p-0.5 hover:text-white transition"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-0.5 hover:text-white transition"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3 h-3 text-amber-300" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-0.5 hover:text-white transition"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono pl-1 text-white/50 hidden sm:inline">
            {currentIndex + 1}/{items.length}
          </span>
        </div>
      )}
    </div>
  );
};


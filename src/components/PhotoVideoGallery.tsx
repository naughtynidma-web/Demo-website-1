import React, { useState } from 'react';
import { Play, Camera, Film, ChevronRight } from 'lucide-react';
import { WPPost } from '../types/wordpress';

interface PhotoVideoGalleryProps {
  posts: WPPost[];
  onNavigate: (route: string) => void;
}

export const PhotoVideoGallery: React.FC<PhotoVideoGalleryProps> = ({
  posts,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');

  const galleryItems = [
    {
      id: 'g-1',
      title: 'Preserving Three Generations of Scholarly Heritage in South Asia & Diaspora',
      category: 'Special Documentary',
      type: 'video',
      duration: '14:20',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      slug: 'three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy'
    },
    {
      id: 'g-2',
      title: 'In Pictures: Restored Mughal Architecture of Lahore Walled City',
      category: 'Photojournalism',
      type: 'photo',
      photoCount: 12,
      image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800',
      slug: 'lahore-walled-city-heritage-restoration-award'
    },
    {
      id: 'g-3',
      title: 'High-Performance Pace Bowling Biomechanics in Modern Cricket',
      category: 'Sports Spotlight',
      type: 'video',
      duration: '08:45',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
      slug: 'pakistan-cricket-fast-bowling-camp-world-fixtures'
    },
    {
      id: 'g-4',
      title: 'Global Chip Alliances and High-Density Compute Data Centers',
      category: 'Tech Feature',
      type: 'photo',
      photoCount: 8,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      slug: 'next-gen-ai-compute-alliances-redefine-data-centers'
    }
  ];

  const filtered = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(i => i.type === activeTab);

  return (
    <section className="py-8 bg-[#001829] text-white my-8 rounded-lg overflow-hidden border border-[#003366] select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-[#003366] pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-[#c00]" />
            <h2 className="font-serif text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              Visual Journalism & Multimedia
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded transition text-xs font-bold uppercase tracking-wider ${activeTab === 'all' ? 'bg-[#c00] text-white' : 'text-slate-300 hover:text-white bg-slate-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 rounded transition text-xs font-bold uppercase tracking-wider ${activeTab === 'video' ? 'bg-[#c00] text-white' : 'text-slate-300 hover:text-white bg-slate-800'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-3 py-1 rounded transition text-xs font-bold uppercase tracking-wider ${activeTab === 'photo' ? 'bg-[#c00] text-white' : 'text-slate-300 hover:text-white bg-slate-800'}`}
            >
              Photos
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => onNavigate(`post:${item.slug}`)}
              className="group cursor-pointer bg-[#002244] rounded-lg overflow-hidden border border-[#003366] hover:border-slate-400 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-black/70 text-amber-300 px-2 py-0.5 rounded-xs">
                      {item.category}
                    </span>
                    {item.type === 'video' ? (
                      <span className="flex items-center gap-1 text-[10px] bg-[#c00] text-white px-2 py-0.5 rounded-xs font-mono">
                        <Play className="w-2.5 h-2.5 fill-current" /> {item.duration}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded-xs font-mono">
                        <Camera className="w-2.5 h-2.5" /> {item.photoCount} Photos
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


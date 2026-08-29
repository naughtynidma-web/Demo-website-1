import React, { useState, useMemo } from 'react';
import { WPPost, WPCategory, WPAuthor } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Clock, Filter, Grid, List, Flame, Sparkles, Calendar, Layers, Search } from 'lucide-react';

interface LatestNewsViewProps {
  posts: WPPost[];
  categories: WPCategory[];
  authors: WPAuthor[];
  onNavigate: (route: string) => void;
}

export const LatestNewsView: React.FC<LatestNewsViewProps> = ({
  posts,
  categories,
  authors,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterQuery, setFilterQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(18);

  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const getCategory = (slug: string) => categories.find(c => c.slug === slug);

  // All published posts sorted strictly newest to oldest
  const allLatestSorted = useMemo(() => {
    return [...posts]
      .filter(p => p.status === 'publish')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  // Filtered by category and search query
  const filteredPosts = useMemo(() => {
    return allLatestSorted.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = !filterQuery.trim() || 
        post.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(filterQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(filterQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allLatestSorted, selectedCategory, filterQuery]);

  const visiblePosts = filteredPosts.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredPosts.length;

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setItemsToShow(18);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 font-sans">
      
      {/* Header Banner - High Impact Editorial Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#002244] via-[#003366] to-[#001830] text-white rounded-2xl p-6 md:p-10 mb-8 shadow-lg border border-[#003d7a]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                Real-Time Stream
              </span>
              <span className="text-xs text-slate-300 font-medium">
                • Chronological Live Wire (Newest First)
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black font-editorial-sans tracking-tight leading-tight text-white">
              Latest News Wire
            </h1>
            
            <p className="text-sm md:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
              Comprehensive real-time coverage across Pakistan, World affairs, Politics, Economy, Tech, Sports, and Bureau Special investigations.
            </p>
          </div>

          {/* Real-time Stats Badge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/15 self-start md:self-auto shrink-0">
            <div className="text-center pr-4 border-r border-white/20">
              <span className="text-2xl md:text-3xl font-black text-white font-cinzel">
                {allLatestSorted.length}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-300">
                Total Stories
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400 font-cinzel">
                {categories.length}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-300">
                Desks
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Filters inside Banner */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Desk:
          </span>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-[#002244] shadow-md font-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All Desks ({allLatestSorted.length})
          </button>
          {categories
            .filter(c => c.showOnHomepage !== false)
            .map(cat => {
              const count = allLatestSorted.filter(p => p.category === cat.slug).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Control Bar: Search & View Switches */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 mb-8 shadow-xs">
        
        {/* Quick Filter Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter latest stories by headline or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#002244]"
          />
          {filterQuery && (
            <button 
              onClick={() => setFilterQuery('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Info & Layout Toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{visiblePosts.length}</strong> of {filteredPosts.length} updates
          </span>

          <div className="h-4 w-px bg-gray-200 dark:border-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-[#002244] dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid Layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-[#002244] dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Editorial List Layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Articles Stream */}
      {visiblePosts.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visiblePosts.map((post) => (
                <div key={post.id} className="relative group flex flex-col">
                  <ArticleCard
                    post={post}
                    author={getAuthor(post.authorId)}
                    category={getCategory(post.category)}
                    variant="grid"
                    onNavigate={onNavigate}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visiblePosts.map((post) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  author={getAuthor(post.authorId)}
                  category={getCategory(post.category)}
                  variant="horizontal"
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setItemsToShow(prev => prev + 12)}
                className="px-8 py-3.5 bg-[#002244] hover:bg-[#b80000] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Load More Latest Stories ({filteredPosts.length - visiblePosts.length} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-16 text-center rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">No stories match your filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your keyword filter or select a different news desk to see more articles.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setFilterQuery(''); }}
            className="mt-6 px-5 py-2 bg-[#002244] text-white rounded-lg text-xs font-bold hover:bg-[#003366] transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { WPPost, WPCategory, WPAuthor } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Filter, Grid, List } from 'lucide-react';

interface CategoryArchiveViewProps {
  category: WPCategory;
  posts: WPPost[];
  authors: WPAuthor[];
  onNavigate: (route: string) => void;
}

export const CategoryArchiveView: React.FC<CategoryArchiveViewProps> = ({
  category,
  posts,
  authors,
  onNavigate
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const isUrdu = category.slug === 'urdu';

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') return b.views - a.views;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Category Header Banner */}
      <div 
        className="p-8 rounded-xl text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: category.color || '#002B49' }}
      >
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
            Category Archive
          </span>
          <h1 className={`font-extrabold text-3xl md:text-4xl mt-1 ${isUrdu ? 'font-urdu' : 'font-editorial-display'}`}>
            {category.name} {category.nameUrdu && <span className="font-urdu text-2xl font-normal ml-3">({category.nameUrdu})</span>}
          </h1>
          {category.description && (
            <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-3xl font-extrabold font-cinzel text-white">
            {posts.length}
          </span>
          <span className="block text-xs uppercase tracking-wider text-slate-300">
            Published Articles
          </span>
        </div>
      </div>

      {/* Filter & View Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Sort By:</span>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded transition ${sortBy === 'newest' ? 'bg-[#002B49] text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-2.5 py-1 rounded transition ${sortBy === 'popular' ? 'bg-[#002B49] text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Most Viewed
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-slate-200 dark:bg-slate-800 text-[#002B49] dark:text-white' : 'text-slate-400'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-slate-200 dark:bg-slate-800 text-[#002B49] dark:text-white' : 'text-slate-400'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Articles Grid or List */}
      {sortedPosts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map(post => (
              <ArticleCard
                key={post.id}
                post={post}
                author={getAuthor(post.authorId)}
                category={category}
                variant="grid"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map(post => (
              <ArticleCard
                key={post.id}
                post={post}
                author={getAuthor(post.authorId)}
                category={category}
                variant="horizontal"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-gray-200 dark:border-slate-800 text-slate-500">
          <p className="text-base font-semibold">No articles found in this category.</p>
          <p className="text-xs mt-1">Publish new stories via WordPress Admin &rarr; Posts &rarr; Add New.</p>
        </div>
      )}

    </div>
  );
};

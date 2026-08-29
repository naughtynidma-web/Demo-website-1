import React from 'react';
import { WPPost, WPCategory, WPAuthor } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Search } from 'lucide-react';

interface SearchResultsViewProps {
  query: string;
  posts: WPPost[];
  categories: WPCategory[];
  authors: WPAuthor[];
  onNavigate: (route: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  posts,
  categories,
  authors,
  onNavigate
}) => {
  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const getCategory = (slug: string) => categories.find(c => c.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Search className="w-6 h-6 text-[#002B49] dark:text-amber-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Search Results
          </span>
        </div>
        <h1 className="font-editorial-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          "{query}"
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Found <strong className="text-slate-900 dark:text-white">{posts.length}</strong> matching articles in Dunya International archives.
        </p>
      </div>

      {/* Results Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <ArticleCard
              key={post.id}
              post={post}
              author={getAuthor(post.authorId)}
              category={getCategory(post.category)}
              variant="grid"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border text-slate-500">
          <p className="text-base font-semibold">No stories matched your search term.</p>
          <p className="text-xs mt-1">Try broader keywords such as "Mustafa", "Pakistan", "Economy", or "Cricket".</p>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { WPPost, WPCategory, WPAuthor, WPTag } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Tag } from 'lucide-react';

interface TagArchiveViewProps {
  tag: WPTag;
  posts: WPPost[];
  categories: WPCategory[];
  authors: WPAuthor[];
  onNavigate: (route: string) => void;
}

export const TagArchiveView: React.FC<TagArchiveViewProps> = ({
  tag,
  posts,
  categories,
  authors,
  onNavigate
}) => {
  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const getCategory = (slug: string) => categories.find(c => c.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm mb-8 flex items-center space-x-4">
        <div className="p-3 bg-[#002B49] text-white rounded-lg">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Tag Topic
          </span>
          <h1 className="font-editorial-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            #{tag.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {posts.length} articles tagged under this topic.
          </p>
        </div>
      </div>

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
          No articles tagged with #{tag.name}.
        </div>
      )}

    </div>
  );
};

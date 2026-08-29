import React from 'react';
import { WPPost, WPCategory, WPAuthor } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  category: WPCategory;
  posts: WPPost[];
  authors: WPAuthor[];
  onNavigate: (route: string) => void;
  variant?: 'split' | 'grid-3' | 'urdu-special';
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  posts,
  authors,
  onNavigate,
  variant = 'grid-3'
}) => {
  if (!posts || posts.length === 0) return null;

  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const isUrdu = category.slug === 'urdu';

  return (
    <section className="py-6 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Category Header Bar (Matching Professional Polish title bar) */}
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <span 
              className="w-2.5 h-2.5 rounded-xs"
              style={{ backgroundColor: category.color || '#c00000' }}
            ></span>
            <h2 className={`font-black uppercase tracking-tight text-[#002244] dark:text-white ${
              isUrdu ? 'font-urdu text-2xl' : 'font-serif text-lg md:text-xl'
            }`}>
              {category.name} {category.nameUrdu && !isUrdu && <span className="font-urdu text-sm text-slate-500 font-normal ml-2">({category.nameUrdu})</span>}
            </h2>
          </div>

          <button
            onClick={() => onNavigate(`category:${category.slug}`)}
            className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#002244] dark:text-blue-400 hover:text-[#c00] transition"
          >
            <span>View All ({category.count})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Grid Layout */}
        {variant === 'split' && posts.length >= 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <ArticleCard
                post={posts[0]}
                author={getAuthor(posts[0].authorId)}
                category={category}
                variant="grid"
                onNavigate={onNavigate}
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              {posts.slice(1, 4).map((post) => (
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
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
        )}

      </div>
    </section>
  );
};


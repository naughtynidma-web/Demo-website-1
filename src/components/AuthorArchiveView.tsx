import React from 'react';
import { WPAuthor, WPPost, WPCategory } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Mail, Twitter, Linkedin, BookOpen } from 'lucide-react';

interface AuthorArchiveViewProps {
  author: WPAuthor;
  posts: WPPost[];
  categories: WPCategory[];
  onNavigate: (route: string) => void;
}

export const AuthorArchiveView: React.FC<AuthorArchiveViewProps> = ({
  author,
  posts,
  categories,
  onNavigate
}) => {
  const getCategory = (slug: string) => categories.find(c => c.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Author Bio Header Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
        />

        <div className="flex-1 text-center md:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-[#D32F2F]">
            Editorial Staff & Bureau
          </span>
          <h1 className="font-editorial-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {author.name}
          </h1>
          <p className="text-xs font-semibold text-[#002B49] dark:text-amber-400 mt-0.5">
            {author.role}
          </p>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-3xl">
            {author.bio}
          </p>

          <div className="flex items-center justify-center md:justify-start space-x-4 mt-4 text-xs text-slate-500">
            {author.twitter && (
              <a href={`https://twitter.com/${author.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-[#002B49] dark:hover:text-amber-400">
                <Twitter className="w-3.5 h-3.5" />
                <span>{author.twitter}</span>
              </a>
            )}
            <div className="flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{author.email}</span>
            </div>
            <div className="flex items-center space-x-1 font-bold text-slate-700 dark:text-slate-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{posts.length} Published Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Articles Grid */}
      <h2 className="font-editorial-sans text-lg font-bold uppercase text-[#002B49] dark:text-white border-b-2 border-[#002B49] pb-2 mb-6">
        Articles by {author.name}
      </h2>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <ArticleCard
              key={post.id}
              post={post}
              author={author}
              category={getCategory(post.category)}
              variant="grid"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-lg border text-slate-500 text-xs">
          No articles published yet by this author.
        </div>
      )}

    </div>
  );
};

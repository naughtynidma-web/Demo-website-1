import React from 'react';
import { Clock, Volume2, User } from 'lucide-react';
import { WPPost, WPAuthor, WPCategory } from '../types/wordpress';

interface ArticleCardProps {
  post: WPPost;
  author?: WPAuthor;
  category?: WPCategory;
  variant?: 'hero-lead' | 'hero-secondary' | 'grid' | 'horizontal' | 'opinion' | 'compact';
  onNavigate: (route: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  author,
  category,
  variant = 'grid',
  onNavigate
}) => {
  const isUrdu = post.language === 'ur';

  const formattedDate = new Date(post.date).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const categoryName = category?.name || post.category;
  const authorName = author?.name || 'Editor-in-Chief';

  if (variant === 'hero-lead') {
    return (
      <div 
        onClick={() => onNavigate(`post:${post.slug}`)}
        className="relative group cursor-pointer h-[380px] md:h-[420px] bg-black rounded-lg overflow-hidden shadow-xs select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10"></div>
        <div className="w-full h-full bg-[#111] flex items-center justify-center">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#c00] text-white text-[10px] font-bold uppercase px-2.5 py-1 tracking-widest rounded-xs">
              Headline Story
            </span>
            {category && (
              <span className="bg-[#002244]/80 text-white text-[10px] font-semibold uppercase px-2 py-1 rounded-xs">
                {categoryName}
              </span>
            )}
            {post.audioAvailable && (
              <span className="bg-black/60 text-amber-300 text-[10px] px-2 py-1 rounded-xs flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Audio</span>
              </span>
            )}
          </div>

          <h2 
            className={`text-white leading-tight font-bold mb-2.5 group-hover:underline ${
              isUrdu 
                ? 'font-urdu text-2xl md:text-3xl text-right leading-loose' 
                : 'text-2xl md:text-3xl lg:text-4xl font-serif'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.title}
          </h2>

          <p 
            className={`text-gray-200 text-sm line-clamp-2 max-w-2xl ${
              isUrdu ? 'font-urdu text-right text-base' : 'font-editorial-serif'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-4 text-[10px] text-white/75 font-semibold uppercase tracking-wider">
            <span>By {authorName}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} Min Read
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => onNavigate(`post:${post.slug}`)}
        className="group flex gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer select-none"
      >
        <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 shrink-0 rounded overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#c00] text-[9px] font-bold uppercase tracking-widest">
                {categoryName}
              </span>
              {post.isBreaking && (
                <span className="bg-[#c00] text-white px-1.5 py-0.2 rounded-xs text-[8px] font-bold uppercase">
                  Alert
                </span>
              )}
            </div>
            <h3 
              className={`font-serif font-bold text-sm sm:text-[15px] leading-tight line-clamp-2 text-[#1a1a1a] dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors ${
                isUrdu ? 'font-urdu text-base text-right' : ''
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{post.readingTimeMinutes}m</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'opinion') {
    return (
      <div 
        onClick={() => onNavigate(`post:${post.slug}`)}
        className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-md transition cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3 mb-2.5">
          {author?.avatar ? (
            <img src={author.avatar} alt={authorName} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#002244] text-white flex items-center justify-center font-bold text-xs">
              {authorName[0]}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {authorName}
            </h4>
            <p className="text-[10px] text-slate-500">{author?.role || 'Columnist'}</p>
          </div>
        </div>
        <h3 className="font-serif text-sm font-bold text-[#1a1a1a] dark:text-slate-200 hover:text-[#c00] leading-snug line-clamp-3">
          "{post.title}"
        </h3>
        <span className="block text-[10px] text-slate-400 mt-2">{formattedDate}</span>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div 
      onClick={() => onNavigate(`post:${post.slug}`)}
      className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 hover:shadow-md transition cursor-pointer flex flex-col justify-between select-none"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <span className="absolute top-2.5 left-2.5 bg-[#002244]/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs tracking-wider">
            {categoryName}
          </span>
        </div>

        <div className="p-4">
          <h3 
            className={`font-serif font-bold text-base text-[#1a1a1a] dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2 mb-2 ${
              isUrdu ? 'font-urdu text-lg leading-loose text-right' : ''
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.title}
          </h3>

          <p 
            className={`text-slate-600 dark:text-slate-300 text-xs line-clamp-2 ${
              isUrdu ? 'font-urdu text-right text-sm' : 'font-editorial-serif'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-gray-100 dark:border-slate-800/60">
        <span>{formattedDate}</span>
        <span className="flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3" />
          {post.readingTimeMinutes} min
        </span>
      </div>
    </div>
  );
};


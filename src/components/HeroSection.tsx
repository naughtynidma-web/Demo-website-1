import React from 'react';
import { WPPost, WPAuthor, WPCategory } from '../types/wordpress';
import { ArticleCard } from './ArticleCard';
import { Award, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  leadPost: WPPost;
  secondaryPosts: WPPost[];
  opinionPosts: WPPost[];
  authors: WPAuthor[];
  categories: WPCategory[];
  onNavigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadPost,
  secondaryPosts,
  opinionPosts,
  authors,
  categories,
  onNavigate
}) => {
  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const getCategory = (slug: string) => categories.find(c => c.slug === slug);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Lead Story Card with Dark Overlay */}
      {leadPost && (
        <ArticleCard
          post={leadPost}
          author={getAuthor(leadPost.authorId)}
          category={getCategory(leadPost.category)}
          variant="hero-lead"
          onNavigate={onNavigate}
        />
      )}

      {/* 2-Card Secondary Horizontal Stories Row */}
      {secondaryPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryPosts.slice(0, 2).map((post) => (
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

      {/* Additional 3rd & 4th Secondary Stories if available */}
      {secondaryPosts.length > 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryPosts.slice(2, 4).map((post) => (
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
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, User, Share2, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, MessageSquare, Send, Check,
  Twitter, Facebook, Linkedin, Link as LinkIcon, ThumbsUp, Bookmark
} from 'lucide-react';
import { WPPost, WPAuthor, WPCategory, WPComment } from '../types/wordpress';
import { wpStorage } from '../services/wpStorage';
import { ArticleCard } from './ArticleCard';

interface SingleArticleViewProps {
  post: WPPost;
  author?: WPAuthor;
  category?: WPCategory;
  relatedPosts: WPPost[];
  previousPost?: WPPost;
  nextPost?: WPPost;
  onNavigate: (route: string) => void;
  onOpenAdminEdit?: (postId: string) => void;
}

export const SingleArticleView: React.FC<SingleArticleViewProps> = ({
  post,
  author,
  category,
  relatedPosts,
  previousPost,
  nextPost,
  onNavigate,
  onOpenAdminEdit
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comments, setComments] = useState<WPComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const isUrdu = post.language === 'ur';

  // Increment view count on mount
  useEffect(() => {
    wpStorage.incrementViews(post.id);
    setComments(wpStorage.getComments(post.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [post.id]);

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAudioToggle = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio reader is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const cleanText = post.title + '. ' + post.content.replace(/<[^>]*>/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;

    const newComment = wpStorage.addComment(post.id, commentName, commentEmail, commentText);
    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  const formattedDate = new Date(post.date).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedModified = new Date(post.modifiedDate).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const fontSizeClass = fontSize === 'normal' 
    ? 'text-base md:text-lg' 
    : fontSize === 'large' 
      ? 'text-lg md:text-xl' 
      : 'text-xl md:text-2xl';

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 select-text">
      
      {/* Editorial Breadcrumbs */}
      <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:underline text-[#002B49] dark:text-slate-300 font-semibold">
          Home
        </button>
        <span>/</span>
        {category && (
          <>
            <button onClick={() => onNavigate(`category:${category.slug}`)} className="hover:underline text-[#002B49] dark:text-slate-300 font-semibold">
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-slate-400 truncate max-w-sm">{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Article Content Column (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          
          {/* Header Badges & Actions */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#002B49] text-white text-xs font-bold uppercase px-3 py-1 rounded tracking-wider">
                {category?.name || post.category}
              </span>
              {post.isBreaking && (
                <span className="bg-[#D32F2F] text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                  Breaking
                </span>
              )}
            </div>

            {onOpenAdminEdit && (
              <button
                onClick={() => onOpenAdminEdit(post.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                ✏️ Edit Post in WordPress Admin
              </button>
            )}
          </div>

          {/* H1 Headline */}
          <h1 
            className={`font-bold text-slate-900 dark:text-white mb-4 ${
              isUrdu 
                ? 'font-urdu text-3xl md:text-5xl text-right leading-[2.2]' 
                : 'font-editorial-display text-3xl md:text-5xl leading-tight'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.title}
          </h1>

          {/* Subtitle / Deck */}
          {post.excerpt && (
            <p 
              className={`text-slate-600 dark:text-slate-300 mb-6 italic ${
                isUrdu 
                  ? 'font-urdu text-xl text-right leading-loose' 
                  : 'font-editorial-serif text-lg md:text-xl border-l-4 border-[#002B49] pl-4 py-1'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-gray-200 dark:border-slate-800 py-4 my-6 text-xs text-slate-600 dark:text-slate-400 gap-4">
            <div className="flex items-center space-x-3">
              {author?.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-11 h-11 rounded-full object-cover border border-slate-300" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#002B49] text-white flex items-center justify-center font-bold">
                  {author?.name ? author.name[0] : 'D'}
                </div>
              )}
              <div>
                <button 
                  onClick={() => onNavigate(`author:${author?.slug || 'admin'}`)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#002B49] hover:underline block text-left"
                >
                  {author?.name || 'Dunya Desk'}
                </button>
                <span>{author?.role || 'Staff Reporter'}</span>
              </div>
            </div>

            <div className="space-y-0.5 text-right sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Last updated: {formattedModified} • {post.readingTimeMinutes} min read
              </div>
            </div>
          </div>

          {/* Social Share & Reading Utility Toolbar */}
          <div className="flex items-center justify-between py-2 mb-6 bg-slate-50 dark:bg-slate-850 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 dark:text-slate-400 mr-1">Share:</span>
              <button 
                onClick={() => handleShare('twitter')} 
                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-[#002B49] hover:text-white transition"
                title="Share on X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleShare('facebook')} 
                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-[#002B49] hover:text-white transition"
                title="Share on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleShare('linkedin')} 
                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-[#002B49] hover:text-white transition"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleShare('whatsapp')} 
                className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleShare('copy')} 
                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-[#002B49] hover:text-white transition flex items-center gap-1"
                title="Copy Article Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Link'}</span>
              </button>
            </div>

            {/* Font Size & Audio */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAudioToggle}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition ${
                  isPlayingAudio ? 'bg-[#D32F2F] text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                }`}
                title="Listen to this article via text-to-speech"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
              </button>

              <div className="flex items-center space-x-1 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5">
                <button onClick={() => setFontSize('normal')} className={`px-1 font-bold ${fontSize === 'normal' ? 'text-[#002B49] dark:text-amber-400' : 'text-slate-400'}`}>A</button>
                <button onClick={() => setFontSize('large')} className={`px-1 font-bold text-sm ${fontSize === 'large' ? 'text-[#002B49] dark:text-amber-400' : 'text-slate-400'}`}>A+</button>
                <button onClick={() => setFontSize('xlarge')} className={`px-1 font-bold text-base ${fontSize === 'xlarge' ? 'text-[#002B49] dark:text-amber-400' : 'text-slate-400'}`}>A++</button>
              </div>
            </div>
          </div>

          {/* Featured Image with Caption */}
          {post.featuredImage && (
            <figure className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                className="w-full h-auto rounded-lg shadow-sm max-h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              {post.featuredImageCaption && (
                <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic px-1">
                  Photo: {post.featuredImageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Rich Editorial Body */}
          <div
            className={`${fontSizeClass} ${
              isUrdu 
                ? 'font-urdu leading-[2.4] text-right space-y-6 text-slate-900 dark:text-slate-100' 
                : 'font-editorial-serif leading-relaxed space-y-6 text-slate-800 dark:text-slate-200'
            } article-rendered-preview`}
            dir={isUrdu ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mr-3">
                Related Topics:
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {post.tags.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate(`tag:${t.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-[#002B49] hover:text-white text-slate-700 dark:text-slate-300 text-xs px-3 py-1 rounded transition"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Author Box Card */}
          {author && (
            <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {author.name}
                  </h4>
                  <button
                    onClick={() => onNavigate(`author:${author.slug}`)}
                    className="text-xs text-[#002B49] dark:text-amber-400 font-bold hover:underline"
                  >
                    All Articles &rarr;
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          )}

          {/* Previous / Next Article Pagination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
            {previousPost ? (
              <div 
                onClick={() => onNavigate(`post:${previousPost.slug}`)}
                className="cursor-pointer group p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#002B49] transition"
              >
                <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 uppercase mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Article</span>
                </div>
                <h5 className="font-editorial-sans text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#002B49] dark:group-hover:text-amber-400 line-clamp-2">
                  {previousPost.title}
                </h5>
              </div>
            ) : <div />}

            {nextPost && (
              <div 
                onClick={() => onNavigate(`post:${nextPost.slug}`)}
                className="cursor-pointer group p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#002B49] transition text-right"
              >
                <div className="flex items-center justify-end space-x-1 text-[11px] font-bold text-slate-400 uppercase mb-1">
                  <span>Next Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <h5 className="font-editorial-sans text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#002B49] dark:group-hover:text-amber-400 line-clamp-2">
                  {nextPost.title}
                </h5>
              </div>
            )}
          </div>

          {/* Native Comments Section */}
          <section className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#002B49] dark:text-amber-400" />
                <h3 className="font-editorial-display text-xl font-bold text-slate-900 dark:text-white">
                  Reader Comments ({comments.length})
                </h3>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-slate-50 dark:bg-slate-850 p-5 rounded-lg border border-slate-200 dark:border-slate-800 mb-8 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Join the Discussion
              </h4>
              
              {commentSubmitted && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded text-xs">
                  Your comment has been published to this WordPress post!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-1 focus:ring-[#002B49]"
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-1 focus:ring-[#002B49]"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Write your respectful editorial comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-1 focus:ring-[#002B49]"
              />
              <button
                type="submit"
                className="bg-[#002B49] text-white px-5 py-2 rounded text-xs font-bold hover:bg-[#D32F2F] transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Comment</span>
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No comments yet. Be the first to share your perspective!</p>
            )}
          </section>

        </div>

        {/* Related Articles & Sticky Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Related Articles Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-editorial-sans text-sm font-extrabold uppercase tracking-wider text-[#002B49] dark:text-white border-b-2 border-[#D32F2F] pb-2 mb-4">
              Related Coverage
            </h3>
            <div className="space-y-4">
              {relatedPosts.map((rPost) => (
                <ArticleCard
                  key={rPost.id}
                  post={rPost}
                  variant="horizontal"
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>

          {/* Ad Space */}
          <div className="w-full h-[250px] bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
            <span className="font-bold text-slate-500 uppercase tracking-wider">ADVERTISEMENT</span>
            <span className="text-[10px] mt-1">Sidebar Responsive 300x250</span>
          </div>

        </aside>

      </div>
    </article>
  );
};

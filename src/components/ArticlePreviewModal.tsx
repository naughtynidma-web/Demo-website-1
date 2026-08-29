import React, { useState } from 'react';
import { 
  X, Eye, Calendar, User, Volume2, VolumeX, 
  Twitter, Facebook, Linkedin, Share2, Check, 
  Sparkles, ExternalLink, ArrowRight, BookOpen
} from 'lucide-react';
import { WPAuthor, WPCategory } from '../types/wordpress';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  post: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    authorId: string;
    featuredImage: string;
    featuredImageCaption?: string;
    isBreaking?: boolean;
    isHeroFeatured?: boolean;
    language: 'en' | 'ur';
    seoTitle?: string;
    seoDescription?: string;
  };
  authors: WPAuthor[];
  categories: WPCategory[];
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  post,
  authors,
  categories
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const isUrdu = post.language === 'ur';
  const author = authors.find(a => a.id === post.authorId) || authors[0];
  const category = categories.find(c => c.slug === post.category) || categories[0];
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const fontSizeClass = fontSize === 'normal' 
    ? 'text-base' 
    : fontSize === 'large' 
      ? 'text-lg' 
      : 'text-xl';

  const handleAudioToggle = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const cleanText = post.title + '. ' + post.content.replace(/<[^>]*>/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col overflow-hidden select-none">
      
      {/* Top Preview Bar */}
      <div className="h-12 bg-[#001830] border-b border-[#003366] px-4 md:px-6 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-amber-300">Live Website Preview Mode</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-300 hidden sm:inline">
            Dunya International Public Template &bull; {isUrdu ? 'Urdu Edition' : 'English Edition'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            &larr; Back to Editor
          </button>
          <button
            onClick={() => {
              onClose();
              onPublish();
            }}
            className="px-4 py-1.5 rounded text-xs font-bold bg-[#c00000] hover:bg-[#a00000] text-white shadow-xs transition flex items-center space-x-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Publish Article Live</span>
          </button>
        </div>
      </div>

      {/* Preview Scrollable Body */}
      <div className="flex-1 overflow-y-auto bg-[#f4f4f4] text-[#1a1a1a]">
        
        {/* Mock Top Dunya Header */}
        <div className="bg-[#002244] text-white border-b-2 border-[#c00000] px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-black tracking-wider text-white">DUNYA INTERNATIONAL</span>
            </div>
            <span className="text-[11px] bg-black/40 px-2.5 py-0.5 rounded text-slate-300 font-mono">
              PREVIEW DRAFT
            </span>
          </div>
        </div>

        {/* Main Article Container */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 bg-white my-6 rounded-lg shadow-sm border border-gray-200">
          
          {/* Category & Badges */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#002244] text-white text-xs font-bold uppercase px-3 py-1 rounded tracking-wider">
                {category?.name || post.category}
              </span>
              {post.isBreaking && (
                <span className="bg-[#c00000] text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                  Breaking
                </span>
              )}
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Permalink: /{post.slug || 'article-slug'}/
            </span>
          </div>

          {/* H1 Headline */}
          <h1 
            className={`font-bold text-slate-900 mb-4 ${
              isUrdu 
                ? 'font-urdu text-3xl md:text-5xl text-right leading-[2.2]' 
                : 'font-editorial-display text-3xl md:text-5xl leading-tight'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {post.title || 'Untitled Headline'}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p 
              className={`text-slate-600 mb-6 italic ${
                isUrdu 
                  ? 'font-urdu text-xl text-right leading-loose' 
                  : 'font-editorial-serif text-lg md:text-xl border-l-4 border-[#002244] pl-4 py-1'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-gray-200 py-4 my-6 text-xs text-slate-600 gap-4">
            <div className="flex items-center space-x-3">
              {author?.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-11 h-11 rounded-full object-cover border border-slate-300" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#002244] text-white flex items-center justify-center font-bold">
                  {author?.name ? author.name[0] : 'D'}
                </div>
              )}
              <div>
                <span className="font-bold text-sm text-slate-900 block text-left">
                  {author?.name || 'Dunya Desk'}
                </span>
                <span>{author?.role || 'Staff Reporter'}</span>
              </div>
            </div>

            <div className="space-y-0.5 text-right sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 font-medium text-slate-700">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Published &bull; 3 min read
              </div>
            </div>
          </div>

          {/* Social Share & Reading Utility Toolbar */}
          <div className="flex items-center justify-between py-2 mb-6 bg-slate-50 px-4 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 mr-1">Share:</span>
              <span className="p-1.5 bg-slate-200 text-slate-700 rounded"><Twitter className="w-3.5 h-3.5" /></span>
              <span className="p-1.5 bg-slate-200 text-slate-700 rounded"><Facebook className="w-3.5 h-3.5" /></span>
              <span className="p-1.5 bg-slate-200 text-slate-700 rounded"><Linkedin className="w-3.5 h-3.5" /></span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAudioToggle}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition ${
                  isPlayingAudio ? 'bg-[#c00000] text-white animate-pulse' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
              </button>

              <div className="flex items-center space-x-1 border border-slate-300 rounded px-1.5 py-0.5">
                <button onClick={() => setFontSize('normal')} className={`px-1 font-bold ${fontSize === 'normal' ? 'text-[#002244]' : 'text-slate-400'}`}>A</button>
                <button onClick={() => setFontSize('large')} className={`px-1 font-bold text-sm ${fontSize === 'large' ? 'text-[#002244]' : 'text-slate-400'}`}>A+</button>
                <button onClick={() => setFontSize('xlarge')} className={`px-1 font-bold text-base ${fontSize === 'xlarge' ? 'text-[#002244]' : 'text-slate-400'}`}>A++</button>
              </div>
            </div>
          </div>

          {/* Featured Image with Caption */}
          {post.featuredImage && (
            <figure className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-xs max-h-[480px] object-cover"
                referrerPolicy="no-referrer"
              />
              {post.featuredImageCaption && (
                <figcaption className="text-xs text-slate-500 mt-2 italic px-1 text-center">
                  Photo: {post.featuredImageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Rich Editorial Body */}
          <div
            className={`${fontSizeClass} ${
              isUrdu 
                ? 'font-urdu leading-[2.4] text-right space-y-6 text-slate-900' 
                : 'font-editorial-serif leading-relaxed space-y-6 text-slate-800'
            } article-rendered-preview`}
            dir={isUrdu ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: post.content || '<p>Article body will appear here.</p>' }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mr-3">
                Related Topics:
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-200 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

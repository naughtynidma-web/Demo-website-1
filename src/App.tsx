import React, { useState, useEffect } from 'react';
import { wpStorage } from './services/wpStorage';
import { WPPost, WPCategory, WPAuthor, WPTag, WPPage, WPSettings } from './types/wordpress';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { PhotoVideoGallery } from './components/PhotoVideoGallery';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { SingleArticleView } from './components/SingleArticleView';
import { CategoryArchiveView } from './components/CategoryArchiveView';
import { AuthorArchiveView } from './components/AuthorArchiveView';
import { TagArchiveView } from './components/TagArchiveView';
import { StaticPageView } from './components/StaticPageView';
import { SearchResultsView } from './components/SearchResultsView';
import { LatestNewsView } from './components/LatestNewsView';
import { WordPressAdminDashboard } from './components/WordPressAdminDashboard';
import { downloadThemeAndDataZip } from './utils/themeGenerator';
import { LayoutDashboard, Download, Globe, ArrowUp } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('dashboard');
  const [adminEditPostId, setAdminEditPostId] = useState<string | null>(null);

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [authors, setAuthors] = useState<WPAuthor[]>([]);
  const [tags, setTags] = useState<WPTag[]>([]);
  const [pages, setPages] = useState<WPPage[]>([]);
  const [settings, setSettings] = useState<WPSettings>(wpStorage.getSettings());

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  // Load WordPress database on startup
  const refreshData = () => {
    setPosts(wpStorage.getPosts());
    setCategories(wpStorage.getCategories());
    setAuthors(wpStorage.getAuthors());
    setTags(wpStorage.getTags());
    setPages(wpStorage.getPages());
    setSettings(wpStorage.getSettings());
  };

  useEffect(() => {
    refreshData();

    // Check URL Hash for initial route
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentRoute(hash);
    }
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = (tab = 'dashboard', postId: string | null = null) => {
    setAdminInitialTab(tab);
    setAdminEditPostId(postId);
    setAdminOpen(true);
  };

  const handleDownloadTheme = () => {
    downloadThemeAndDataZip(posts, categories, tags, authors, pages, settings);
  };

  const handleSearch = (query: string) => {
    handleNavigate(`search:${encodeURIComponent(query)}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    setLanguage(newLang);
  };

  // Filter posts for sections
  const publishedPosts = posts.filter(p => p.status === 'publish');
  const breakingPosts = publishedPosts.filter(p => p.isBreaking);
  const leadPost = publishedPosts.find(p => p.isHeroFeatured) || publishedPosts[0];
  const secondaryPosts = publishedPosts.filter(p => p.id !== leadPost?.id).slice(0, 4);
  const opinionPosts = publishedPosts.filter(p => p.category === 'opinion' || p.category === 'politics');
  const trendingPosts = [...publishedPosts].sort((a, b) => b.views - a.views);
  const latestPosts = [...publishedPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Category specific slices
  const pakistanPosts = publishedPosts.filter(p => p.category === 'pakistan');
  const worldPosts = publishedPosts.filter(p => p.category === 'world');
  const businessPosts = publishedPosts.filter(p => p.category === 'business');
  const sportsPosts = publishedPosts.filter(p => p.category === 'sports');
  const techPosts = publishedPosts.filter(p => p.category === 'technology');
  const urduPosts = publishedPosts.filter(p => p.category === 'urdu' || p.language === 'ur');

  // Route Dispatcher
  const renderRouteContent = () => {
    // 1. Single Post View (post:<slug>)
    if (currentRoute.startsWith('post:')) {
      const slug = currentRoute.replace('post:', '');
      const post = publishedPosts.find(p => p.slug === slug) || posts.find(p => p.slug === slug);
      if (!post) {
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold text-[#002B49] dark:text-white">404 - Article Not Found</h2>
            <p className="text-sm text-slate-500 mt-2">The article you requested could not be located in the WordPress database.</p>
            <button onClick={() => handleNavigate('home')} className="mt-6 bg-[#002B49] text-white px-6 py-2 rounded text-xs font-bold">
              Return to Homepage
            </button>
          </div>
        );
      }

      const author = authors.find(a => a.id === post.authorId);
      const category = categories.find(c => c.slug === post.category);
      const related = publishedPosts.filter(p => p.id !== post.id && (p.category === post.category || p.language === post.language)).slice(0, 3);
      const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
      const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : undefined;
      const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : undefined;

      return (
        <SingleArticleView
          post={post}
          author={author}
          category={category}
          relatedPosts={related}
          previousPost={prevPost}
          nextPost={nextPost}
          onNavigate={handleNavigate}
          onOpenAdminEdit={(id) => handleOpenAdmin('edit-post', id)}
        />
      );
    }

    // 2. Category Archive View (category:<slug>)
    if (currentRoute.startsWith('category:')) {
      const slug = currentRoute.replace('category:', '');
      const category = categories.find(c => c.slug === slug);
      const catPosts = publishedPosts.filter(p => p.category === slug || (slug === 'urdu' && p.language === 'ur'));

      if (!category) {
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-[#002B49]">Category Not Found</h2>
            <button onClick={() => handleNavigate('home')} className="mt-4 text-xs underline">Return Home</button>
          </div>
        );
      }

      return (
        <CategoryArchiveView
          category={category}
          posts={catPosts}
          authors={authors}
          onNavigate={handleNavigate}
        />
      );
    }

    // 3. Author Archive View (author:<slug>)
    if (currentRoute.startsWith('author:')) {
      const slug = currentRoute.replace('author:', '');
      const author = authors.find(a => a.slug === slug) || authors[0];
      const authorPosts = publishedPosts.filter(p => p.authorId === author.id);

      return (
        <AuthorArchiveView
          author={author}
          posts={authorPosts}
          categories={categories}
          onNavigate={handleNavigate}
        />
      );
    }

    // 4. Tag Archive View (tag:<slug>)
    if (currentRoute.startsWith('tag:')) {
      const slug = currentRoute.replace('tag:', '');
      const tag = tags.find(t => t.slug === slug) || { id: 'temp-tag', name: slug.replace(/-/g, ' '), slug };
      const tagPosts = publishedPosts.filter(p => p.tags.some(t => t.toLowerCase().replace(/\s+/g, '-') === slug));

      return (
        <TagArchiveView
          tag={tag}
          posts={tagPosts}
          categories={categories}
          authors={authors}
          onNavigate={handleNavigate}
        />
      );
    }

    // 5. Static Page View (page:<slug>)
    if (currentRoute.startsWith('page:')) {
      const slug = currentRoute.replace('page:', '');
      const page = pages.find(p => p.slug === slug);
      if (!page) {
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-[#002B49]">Page Not Found</h2>
            <button onClick={() => handleNavigate('home')} className="mt-4 text-xs underline">Return Home</button>
          </div>
        );
      }

      return (
        <StaticPageView
          page={page}
          onNavigate={handleNavigate}
        />
      );
    }

    // 6. Search Results View (search:<query>)
    if (currentRoute.startsWith('search:')) {
      const query = decodeURIComponent(currentRoute.replace('search:', ''));
      const searchResults = publishedPosts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

      return (
        <SearchResultsView
          query={query}
          posts={searchResults}
          categories={categories}
          authors={authors}
          onNavigate={handleNavigate}
        />
      );
    }

    // 7. Latest News Stream (latest-news)
    if (currentRoute === 'latest-news' || currentRoute === 'latest' || currentRoute === 'category:latest-news') {
      return (
        <LatestNewsView
          posts={publishedPosts}
          categories={categories}
          authors={authors}
          onNavigate={handleNavigate}
        />
      );
    }

    // 8. Homepage (Default)
    return (
      <main className="space-y-6">
        {/* Main Grid: 8 Columns Lead/Stories + 4 Columns Sidebar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Hero + Category Sections */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Dynamic Hero Grid */}
              {leadPost && (
                <HeroSection
                  leadPost={leadPost}
                  secondaryPosts={secondaryPosts}
                  opinionPosts={opinionPosts}
                  authors={authors}
                  categories={categories}
                  onNavigate={handleNavigate}
                />
              )}

              {/* Pakistan News Section */}
              {pakistanPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'pakistan') || categories[0]}
                  posts={pakistanPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="split"
                />
              )}

              {/* World & International Section */}
              {worldPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'world') || categories[1]}
                  posts={worldPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="grid-3"
                />
              )}

              {/* Urdu Desk Special Banner */}
              {urduPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'urdu') || categories[categories.length - 1]}
                  posts={urduPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="grid-3"
                />
              )}

              {/* Business & Economy Section */}
              {businessPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'business') || categories[3]}
                  posts={businessPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="grid-3"
                />
              )}

              {/* Technology & AI Section */}
              {techPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'technology') || categories[5]}
                  posts={techPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="grid-3"
                />
              )}

              {/* Sports Section */}
              {sportsPosts.length > 0 && (
                <CategorySection
                  category={categories.find(c => c.slug === 'sports') || categories[4]}
                  posts={sportsPosts}
                  authors={authors}
                  onNavigate={handleNavigate}
                  variant="grid-3"
                />
              )}

            </div>

            {/* Right 4 Cols: Live Sidebar */}
            <div className="lg:col-span-4">
              <Sidebar
                latestPosts={latestPosts}
                trendingPosts={trendingPosts}
                opinionPosts={opinionPosts}
                authors={authors}
                categories={categories}
                onNavigate={handleNavigate}
              />
            </div>

          </div>
        </div>

        {/* Visual Journalism & Photo/Video Gallery */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <PhotoVideoGallery
            posts={publishedPosts}
            onNavigate={handleNavigate}
          />
        </div>
      </main>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f4f4] text-[#1a1a1a]'} flex flex-col font-sans transition-colors duration-200`}>

      
      {/* Header */}
      <Header
        categories={categories}
        settings={settings}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
        onDownloadTheme={handleDownloadTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onSearch={handleSearch}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker
        posts={breakingPosts}
        customText={settings.breakingTickerCustomText}
        onNavigate={handleNavigate}
      />

      {/* Dynamic Content */}
      <div className="flex-1">
        {renderRouteContent()}
      </div>

      {/* Footer */}
      <Footer
        categories={categories}
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleOpenAdmin('dashboard')}
      />

      {/* Floating Quick Action Widget for WP Admin & Package Export */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 bg-slate-900/90 text-white p-1.5 rounded-full shadow-2xl backdrop-blur-xs border border-slate-700">
        <button
          onClick={() => handleOpenAdmin('dashboard')}
          className="flex items-center space-x-1 bg-[#002B49] hover:bg-[#D32F2F] text-white px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs"
          title="Open WordPress Admin"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WordPress Admin</span>
        </button>

        <button
          onClick={handleDownloadTheme}
          className="flex items-center space-x-1 bg-[#2271B1] hover:bg-[#135E96] text-white px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs"
          title="Download Hostinger WordPress Theme ZIP Package"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download WP Theme</span>
        </button>
      </div>

      {/* WordPress Admin Dashboard Modal / Overlay */}
      {adminOpen && (
        <WordPressAdminDashboard
          initialTab={adminInitialTab}
          initialEditPostId={adminEditPostId}
          onClose={() => setAdminOpen(false)}
          onNavigateToSite={(route) => {
            setAdminOpen(false);
            handleNavigate(route);
          }}
          onRefreshData={refreshData}
        />
      )}

      <SpeedInsights />
    </div>
  );
}

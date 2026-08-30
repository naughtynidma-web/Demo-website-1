import React, { useState, useEffect } from 'react';
import { 
  Search, Moon, Sun, Globe, Radio, Bookmark, Share2, 
  Menu, X, TrendingUp, ChevronDown, Download, Settings as SettingsIcon,
  PlusCircle, LayoutDashboard, Bell, Tv, Twitter, Facebook, Youtube, Instagram, Linkedin, Rss
} from 'lucide-react';
import { WPCategory, WPSettings } from '../types/wordpress';

interface HeaderProps {
  categories: WPCategory[];
  settings: WPSettings;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenAdmin: (tab?: string) => void;
  onDownloadTheme: () => void;
  language: 'en' | 'ur';
  onToggleLanguage: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  settings,
  currentRoute,
  onNavigate,
  onOpenAdmin,
  onDownloadTheme,
  language,
  onToggleLanguage,
  darkMode,
  onToggleDarkMode,
  onSearch
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const d = new Date();
    const formatted = d.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formatted);
  }, [language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchOpen(false);
    }
  };

  const EXCLUDED_CATEGORY_KEYS = ['education', 'lifestyle', 'opinion', 'urdu', 'urdu news'];
  const navCategories = categories.filter(c => 
    c.showOnHomepage !== false && 
    !EXCLUDED_CATEGORY_KEYS.includes(c.slug.toLowerCase()) &&
    !EXCLUDED_CATEGORY_KEYS.includes(c.name.toLowerCase())
  );

  return (
  <header className="w-full select-none font-sans">
    <div className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center text-xs text-gray-600">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-red-600 uppercase tracking-widest">BUREAU</span>
        <span className="hidden sm:inline">Islamabad • London • New York • Dubai</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>{currentDate}</span>
        <button onClick={onToggleLanguage} className="hover:text-black font-semibold cursor-pointer">
          {language === 'ur' ? 'English' : 'اردو'}
        </button>
      </div>
    </div>

      {/* Main Masthead with Centered DUNYA INTERNATIONAL Logo */}
      <div className="relative bg-white dark:bg-slate-900 px-4 md:px-6 py-4 border-b border-gray-200 dark:border-slate-800 shadow-xs transition-colors flex items-center justify-between min-h-[76px] md:min-h-[86px]">
        
        {/* Left Side: Mobile Menu Button & Social Channels */}
        <div className="flex items-center gap-2 sm:gap-3 z-20 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Social Icons (Desktop) */}
          <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DA1F2] transition"
              title="Twitter / X"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1877F2] transition"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#FF0000] transition"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a 
              href="#rss" 
              onClick={(e) => { e.preventDefault(); onDownloadTheme(); }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition"
              title="RSS News Feed"
            >
              <Rss className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="hidden xl:block h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>24/7 Verified Wire</span>
          </div>
        </div>

        {/* Center: DUNYA INTERNATIONAL Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center cursor-pointer group z-10 px-2 max-w-[65vw] sm:max-w-none"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black tracking-tight sm:tracking-tighter text-[#002244] dark:text-white leading-none group-hover:text-[#c00] transition-colors font-editorial-sans whitespace-nowrap">
            DUNYA INTERNATIONAL
          </h1>
          <p className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.22em] sm:tracking-[0.26em] font-bold text-[#c00] mt-1 whitespace-nowrap">
            {language === 'ur' ? 'عالمی خبریں • مقامی تناظر' : 'Global News • Local Perspective'}
          </p>
        </div>

        {/* Right Side: Quick Search Box & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 z-20 shrink-0">
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex bg-gray-100 dark:bg-slate-800 px-2.5 md:px-3 py-1.5 rounded-md items-center gap-2 border border-gray-200 dark:border-slate-700 transition focus-within:ring-1 focus-within:ring-[#002244]">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="text-xs text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none w-20 md:w-36 lg:w-44"
            />
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-1.5 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Toggle Tab */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase border-l border-gray-200 dark:border-slate-800 pl-3 md:pl-4">
            <button 
              onClick={() => language !== 'en' && onToggleLanguage()}
              className={`transition-colors ${language === 'en' ? 'text-[#002244] dark:text-blue-400 font-extrabold border-b-2 border-[#002244] dark:border-blue-400 pb-0.5' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              EN
            </button>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <button 
              onClick={() => language !== 'ur' && onToggleLanguage()}
              className={`transition-colors font-urdu text-[11px] ${language === 'ur' ? 'text-[#002244] dark:text-blue-400 font-extrabold border-b-2 border-[#002244] dark:border-blue-400 pb-0.5' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              اردو
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="sm:hidden bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, stories..."
              className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
              autoFocus
            />
            <button type="submit" className="text-xs font-bold text-[#002244] dark:text-blue-400">
              Go
            </button>
          </form>
        </div>
      )}

      {/* Category Navigation Bar Placed Underneath Dunya International */}
      <nav 
        id="main-nav-container" 
        className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 md:px-6 lg:px-8 py-2.5 sticky top-0 z-40 shadow-xs transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Desktop Categories List */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-bold uppercase tracking-wide text-[#333] dark:text-slate-200 overflow-x-auto no-scrollbar">
            <li 
              onClick={() => onNavigate('home')} 
              className={`cursor-pointer transition-colors whitespace-nowrap ${
                currentRoute === 'home' 
                  ? 'text-[#c00] font-black border-b-2 border-[#c00] pb-1' 
                  : 'hover:text-[#002244] dark:hover:text-blue-400'
              }`}
            >
              Home
            </li>
            <li 
              onClick={() => onNavigate('latest-news')} 
              className={`cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentRoute === 'latest-news' 
                  ? 'text-[#c00] font-black border-b-2 border-[#c00] pb-1' 
                  : 'hover:text-[#002244] dark:hover:text-blue-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              <span>Latest News</span>
            </li>
            {navCategories.map(cat => (
              <li
                key={cat.id}
                onClick={() => onNavigate(`category:${cat.slug}`)}
                className={`cursor-pointer transition-colors whitespace-nowrap ${
                  currentRoute === `category:${cat.slug}` 
                    ? 'text-[#c00] font-black border-b-2 border-[#c00] pb-1' 
                    : 'hover:text-[#002244] dark:hover:text-blue-400'
                } ${cat.slug === 'urdu' ? 'font-urdu lowercase' : ''}`}
              >
                {cat.name}
              </li>
            ))}
          </ul>

          {/* Right Live Pulse & Meta Links */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <div 
              onClick={() => onNavigate('latest-news')}
              className="flex items-center gap-2 cursor-pointer group"
              title="Live Wire Feed"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1a1a1a] dark:text-white group-hover:text-red-600 transition-colors">
                Live Feed
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 border-l border-gray-200 dark:border-slate-800 pl-3">
              <button onClick={() => onNavigate('page:about-us')} className="hover:text-blue-900 dark:hover:text-white transition">About</button>
              <button onClick={() => onNavigate('page:editorial-policy')} className="hover:text-blue-900 dark:hover:text-white transition">Editorial Policy</button>
            </div>
          </div>

          {/* Mobile Categories Quick Scroll Row */}
          <div className="lg:hidden flex items-center gap-4 overflow-x-auto no-scrollbar py-1 w-full text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            <span 
              onClick={() => onNavigate('home')}
              className={`whitespace-nowrap cursor-pointer ${currentRoute === 'home' ? 'text-[#c00]' : ''}`}
            >
              Home
            </span>
            <span 
              onClick={() => onNavigate('latest-news')}
              className={`whitespace-nowrap cursor-pointer flex items-center gap-1 ${currentRoute === 'latest-news' ? 'text-[#c00]' : ''}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              Latest News
            </span>
            {navCategories.slice(0, 5).map(cat => (
              <span
                key={cat.id}
                onClick={() => onNavigate(`category:${cat.slug}`)}
                className={`whitespace-nowrap cursor-pointer ${currentRoute === `category:${cat.slug}` ? 'text-[#c00]' : ''}`}
              >
                {cat.name}
              </span>
            ))}
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-4 space-y-2 shadow-lg z-50 animate-fadeIn">
            <div 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`py-2 text-sm font-bold uppercase border-b border-gray-100 dark:border-slate-800 cursor-pointer ${
                currentRoute === 'home' ? 'text-[#c00]' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              Home
            </div>
            <div 
              onClick={() => { onNavigate('latest-news'); setMobileMenuOpen(false); }}
              className={`py-2 text-sm font-bold uppercase border-b border-gray-100 dark:border-slate-800 cursor-pointer flex items-center justify-between ${
                currentRoute === 'latest-news' ? 'text-[#c00]' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              <span>Latest News</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-black uppercase">Live</span>
            </div>
            {navCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => { onNavigate(`category:${cat.slug}`); setMobileMenuOpen(false); }}
                className={`py-2 text-sm font-bold uppercase border-b border-gray-100 dark:border-slate-800 cursor-pointer hover:text-blue-900 ${
                  currentRoute === `category:${cat.slug}` ? 'text-[#c00]' : 'text-slate-800 dark:text-slate-100'
                } ${cat.slug === 'urdu' ? 'font-urdu' : ''}`}
              >
                {cat.name}
              </div>
            ))}
            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-500">
              <button onClick={() => { onNavigate('page:about-us'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-black dark:hover:text-white">About Us</button>
              <button onClick={() => { onNavigate('page:editorial-policy'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-black dark:hover:text-white">Editorial Policy</button>
              <button onClick={() => { onNavigate('page:contact-us'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-black dark:hover:text-white">Contact</button>
              <button onClick={() => { onOpenAdmin('dashboard'); setMobileMenuOpen(false); }} className="text-left py-1 text-blue-600 font-bold">WordPress Admin</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};




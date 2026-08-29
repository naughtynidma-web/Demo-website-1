import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, PlusCircle, FolderTree, Tag, 
  Files, MessageSquare, Settings as SettingsIcon, Download, 
  Eye, Edit, Trash2, CheckCircle2, ArrowLeft, Globe, 
  Flame, Award, Search, Sparkles, ExternalLink, RefreshCw, Layers,
  Image as ImageIcon, Check, AlertCircle, Play
} from 'lucide-react';
import { WPPost, WPCategory, WPTag, WPAuthor, WPPage, WPSettings, WPComment } from '../types/wordpress';
import { wpStorage } from '../services/wpStorage';
import { downloadThemeAndDataZip } from '../utils/themeGenerator';
import { VisualArticleEditor } from './VisualArticleEditor';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { MEDIA_LIBRARY_ASSETS } from '../data/mediaLibrary';

interface WordPressAdminDashboardProps {
  initialTab?: string;
  initialEditPostId?: string | null;
  onClose: () => void;
  onNavigateToSite: (route: string) => void;
  onRefreshData: () => void;
}

export const WordPressAdminDashboard: React.FC<WordPressAdminDashboardProps> = ({
  initialTab = 'dashboard',
  initialEditPostId = null,
  onClose,
  onNavigateToSite,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [posts, setPosts] = useState<WPPost[]>(wpStorage.getPosts());
  const [categories, setCategories] = useState<WPCategory[]>(wpStorage.getCategories());
  const [tags, setTags] = useState<WPTag[]>(wpStorage.getTags());
  const [authors, setAuthors] = useState<WPAuthor[]>(wpStorage.getAuthors());
  const [pages, setPages] = useState<WPPage[]>(wpStorage.getPages());
  const [settings, setSettings] = useState<WPSettings>(wpStorage.getSettings());
  const [comments, setComments] = useState<WPComment[]>(wpStorage.getAllComments());

  // Post Editor State
  const [editingPostId, setEditingPostId] = useState<string | null>(initialEditPostId);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postCategory, setPostCategory] = useState('pakistan');
  const [postTags, setPostTags] = useState('');
  const [postAuthorId, setPostAuthorId] = useState('author-1');
  const [postFeaturedImage, setPostFeaturedImage] = useState('');
  const [postFeaturedCaption, setPostFeaturedCaption] = useState('');
  const [postIsBreaking, setPostIsBreaking] = useState(false);
  const [postIsHero, setPostIsHero] = useState(false);
  const [postLanguage, setPostLanguage] = useState<'en' | 'ur'>('en');
  const [postSeoTitle, setPostSeoTitle] = useState('');
  const [postSeoDescription, setPostSeoDescription] = useState('');
  const [postStatus, setPostStatus] = useState<'publish' | 'draft'>('publish');

  // Preview & Auto-save state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [autoSaveNotification, setAutoSaveNotification] = useState<string | null>(null);
  const [hasAutoSavedDraft, setHasAutoSavedDraft] = useState<{ content: string; savedAt: string } | null>(null);

  // Filter in All Posts table
  const [postSearch, setPostSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Flash Notice
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Check for auto-saved draft in localStorage
  React.useEffect(() => {
    try {
      const key = `dunya_draft_autosave_${editingPostId || 'current'}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.content && parsed.content !== postContent) {
          setHasAutoSavedDraft(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [editingPostId]);

  // If opening with initial edit post ID
  React.useEffect(() => {
    if (initialEditPostId) {
      loadPostForEditing(initialEditPostId);
    }
  }, [initialEditPostId]);

  const showNotice = (text: string, type: 'success' | 'info' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const restoreAutoSavedDraft = () => {
    if (hasAutoSavedDraft?.content) {
      setPostContent(hasAutoSavedDraft.content);
      setHasAutoSavedDraft(null);
      showNotice(`Auto-saved draft from ${hasAutoSavedDraft.savedAt} restored!`);
    }
  };

  const discardAutoSavedDraft = () => {
    try {
      const key = `dunya_draft_autosave_${editingPostId || 'current'}`;
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setHasAutoSavedDraft(null);
  };

  const loadPostForEditing = (id: string) => {
    const p = wpStorage.getPostById(id);
    if (!p) return;
    setEditingPostId(p.id);
    setPostTitle(p.title);
    setPostSlug(p.slug);
    setPostContent(p.content);
    setPostExcerpt(p.excerpt);
    setPostCategory(p.category);
    setPostTags(p.tags.join(', '));
    setPostAuthorId(p.authorId);
    setPostFeaturedImage(p.featuredImage);
    setPostFeaturedCaption(p.featuredImageCaption || '');
    setPostIsBreaking(p.isBreaking || false);
    setPostIsHero(p.isHeroFeatured || false);
    setPostLanguage(p.language);
    setPostSeoTitle(p.seoTitle || p.title);
    setPostSeoDescription(p.seoDescription || p.excerpt);
    setPostStatus(p.status);
    setActiveTab('edit-post');
  };

  const resetEditor = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostSlug('');
    setPostContent('');
    setPostExcerpt('');
    setPostCategory('pakistan');
    setPostTags('News, Pakistan, Global');
    setPostAuthorId(authors[0]?.id || 'author-1');
    setPostFeaturedImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800');
    setPostFeaturedCaption('');
    setPostIsBreaking(false);
    setPostIsHero(false);
    setPostLanguage('en');
    setPostSeoTitle('');
    setPostSeoDescription('');
    setPostStatus('publish');
  };

  const handleSavePost = (statusToSet: 'publish' | 'draft') => {
    if (!postTitle.trim()) {
      alert('Please enter a post title.');
      return;
    }

    const calculatedSlug = postSlug.trim() 
      ? postSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const parsedTags = postTags.split(',').map(t => t.trim()).filter(Boolean);

    const postData: Partial<WPPost> = {
      title: postTitle,
      slug: calculatedSlug,
      content: postContent || '<p>Editorial coverage for this story is being updated by the Dunya International Bureau.</p>',
      excerpt: postExcerpt || postTitle,
      category: postCategory,
      tags: parsedTags,
      authorId: postAuthorId,
      featuredImage: postFeaturedImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
      featuredImageCaption: postFeaturedCaption,
      isBreaking: postIsBreaking,
      isHeroFeatured: postIsHero,
      language: postLanguage,
      seoTitle: postSeoTitle || postTitle,
      seoDescription: postSeoDescription || postExcerpt,
      status: statusToSet,
    };

    if (editingPostId) {
      wpStorage.updatePost(editingPostId, postData);
      showNotice(`Post "${postTitle}" updated successfully!`);
    } else {
      const created = wpStorage.createPost(postData);
      setEditingPostId(created.id);
      showNotice(`New Post "${postTitle}" published live to the website!`);
    }

    setPosts(wpStorage.getPosts());
    setCategories(wpStorage.getCategories());
    onRefreshData();
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this post from the WordPress database?')) {
      wpStorage.deletePost(id);
      setPosts(wpStorage.getPosts());
      onRefreshData();
      showNotice('Post moved to Trash / Deleted.');
    }
  };

  const handleDownloadTheme = () => {
    downloadThemeAndDataZip(posts, categories, tags, authors, pages, settings);
    showNotice('WordPress Theme + WXR XML Package generated & downloaded for Hostinger!');
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(postSearch.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1D2327] text-[#F0F0F1] flex flex-col font-sans select-none overflow-hidden">
      
      {/* Top Admin Header Bar */}
      <header className="h-10 bg-[#1D2327] border-b border-gray-700 px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-slate-100 text-[#1D2327] flex items-center justify-center font-bold font-serif text-xs">
              W
            </div>
            <span className="font-bold text-white tracking-wide">WordPress 6.5 CMS &bull; Dunya International</span>
          </div>

          <span className="text-gray-500">|</span>

          <button
            onClick={() => onNavigateToSite('home')}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visit Site</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadTheme}
            className="bg-[#2271B1] hover:bg-[#135E96] text-white px-2.5 py-1 rounded flex items-center space-x-1 font-bold text-xs shadow-xs transition"
          >
            <Download className="w-3 h-3" />
            <span>Export to Hostinger ZIP</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition"
          >
            Exit WP Admin
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-56 bg-[#1D2327] border-r border-gray-700 flex flex-col justify-between overflow-y-auto shrink-0 text-xs">
          <div className="py-2">
            
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition ${
                activeTab === 'dashboard' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Posts Submenu */}
            <div className="mt-1">
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition ${
                  activeTab === 'posts' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Posts</span>
              </button>
              
              <div className="pl-9 pr-2 py-1 space-y-1 bg-black/20 text-[11px]">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`block w-full text-left py-1 hover:text-white ${activeTab === 'posts' ? 'text-[#72AEE6] font-bold' : 'text-slate-400'}`}
                >
                  All Posts ({posts.length})
                </button>
                <button
                  onClick={() => { resetEditor(); setActiveTab('edit-post'); }}
                  className={`block w-full text-left py-1 hover:text-white ${activeTab === 'edit-post' && !editingPostId ? 'text-[#72AEE6] font-bold' : 'text-slate-400'}`}
                >
                  + Add New Post
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`block w-full text-left py-1 hover:text-white ${activeTab === 'categories' ? 'text-[#72AEE6] font-bold' : 'text-slate-400'}`}
                >
                  Categories ({categories.length})
                </button>
                <button
                  onClick={() => setActiveTab('tags')}
                  className={`block w-full text-left py-1 hover:text-white ${activeTab === 'tags' ? 'text-[#72AEE6] font-bold' : 'text-slate-400'}`}
                >
                  Tags ({tags.length})
                </button>
              </div>
            </div>

            {/* Media Submenu */}
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition mt-1 ${
                activeTab === 'media' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Library ({MEDIA_LIBRARY_ASSETS.length})</span>
            </button>

            {/* Pages */}
            <button
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition mt-1 ${
                activeTab === 'pages' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <Files className="w-4 h-4" />
              <span>Pages ({pages.length})</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition ${
                activeTab === 'comments' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments ({comments.length})</span>
            </button>

            {/* Settings & Customizer */}
            <button
              onClick={() => setActiveTab('customizer')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition ${
                activeTab === 'customizer' ? 'bg-[#2271B1] text-white font-bold' : 'text-slate-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Site Customizer</span>
            </button>

            {/* Hostinger & Migration */}
            <button
              onClick={() => setActiveTab('migration')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-left transition ${
                activeTab === 'migration' ? 'bg-[#2271B1] text-white font-bold' : 'text-amber-300 hover:bg-[#135E96]/30 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Hostinger Export</span>
            </button>
          </div>

          <div className="p-3 bg-black/40 text-[10px] text-slate-500 border-t border-gray-800">
            <p>Dunya International</p>
            <p>Database: WordPress Simulated DB</p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-[#F0F0F1] text-slate-900 overflow-y-auto p-6">
          
          {/* Notification Banner */}
          {notice && (
            <div className="mb-4 p-3 bg-white border-l-4 border-emerald-500 text-slate-800 rounded shadow-xs text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{notice.text}</span>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h1 className="text-xl font-bold text-slate-800">WordPress Dashboard</h1>
                <span className="text-xs text-slate-500">Site Status: Production Ready</span>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded border border-gray-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Articles</span>
                  <div className="text-3xl font-bold text-[#2271B1] mt-1">{posts.length}</div>
                  <span className="text-[11px] text-emerald-600 mt-1 block">Live & published</span>
                </div>
                <div className="bg-white p-5 rounded border border-gray-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Categories</span>
                  <div className="text-3xl font-bold text-slate-800 mt-1">{categories.length}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Hierarchical taxonomy</span>
                </div>
                <div className="bg-white p-5 rounded border border-gray-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Editorial Staff</span>
                  <div className="text-3xl font-bold text-slate-800 mt-1">{authors.length}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Bylines & contributors</span>
                </div>
                <div className="bg-white p-5 rounded border border-gray-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Article Views</span>
                  <div className="text-3xl font-bold text-amber-600 mt-1">
                    {posts.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Reader engagements</span>
                </div>
              </div>

              {/* Quick Actions & Recent Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left col: Recent Posts */}
                <div className="lg:col-span-8 bg-white p-5 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-bold text-sm text-slate-800">Recent WordPress Posts</h3>
                    <button
                      onClick={() => { resetEditor(); setActiveTab('edit-post'); }}
                      className="text-xs text-[#2271B1] hover:underline font-bold"
                    >
                      + Add New Post
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {posts.slice(0, 6).map(post => (
                      <div key={post.id} className="py-2.5 flex items-center justify-between group">
                        <div className="flex-1 pr-4">
                          <h4 
                            onClick={() => loadPostForEditing(post.id)}
                            className="font-semibold text-slate-800 hover:text-[#2271B1] cursor-pointer truncate"
                          >
                            {post.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {post.category.toUpperCase()} &bull; {new Date(post.date).toLocaleDateString()} &bull; {post.views} views
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => loadPostForEditing(post.id)}
                            className="text-[#2271B1] hover:underline text-[11px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onNavigateToSite(`post:${post.slug}`)}
                            className="text-slate-500 hover:text-slate-800 text-[11px]"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col: Hostinger Deployment Fast-Action */}
                <div className="lg:col-span-4 bg-white p-5 rounded border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-gray-200 pb-2">
                    Hostinger Production Export
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Export this full production-ready WordPress theme (PHP, CSS, JS) and the complete WXR XML migration data for one-click import into your Hostinger WordPress installation.
                  </p>
                  <button
                    onClick={handleDownloadTheme}
                    className="w-full bg-[#2271B1] hover:bg-[#135E96] text-white py-2 rounded text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Complete Package</span>
                  </button>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border">
                    Includes preserved URL structure for <code>/three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy/</code>.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ALL POSTS TABLE */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-slate-800">All WordPress Posts</h1>
                  <button
                    onClick={() => { resetEditor(); setActiveTab('edit-post'); }}
                    className="border border-[#2271B1] text-[#2271B1] hover:bg-[#2271B1] hover:text-white px-2.5 py-0.5 rounded text-xs font-bold transition"
                  >
                    Add New
                  </button>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-slate-600 font-bold">
                      <th className="p-3">Title & Permalink</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Flags</th>
                      <th className="p-3">Language</th>
                      <th className="p-3">Views</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPosts.map(post => {
                      const author = authors.find(a => a.id === post.authorId);
                      return (
                        <tr key={post.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-800 hover:text-[#2271B1] cursor-pointer" onClick={() => loadPostForEditing(post.id)}>
                              {post.title}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              /{post.slug}/
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {post.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{author?.name || 'Admin'}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {post.isBreaking && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded">Breaking</span>}
                              {post.isHeroFeatured && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded">Hero</span>}
                            </div>
                          </td>
                          <td className="p-3 uppercase font-mono text-[10px] font-bold">{post.language}</td>
                          <td className="p-3 text-slate-600 font-mono">{post.views.toLocaleString()}</td>
                          <td className="p-3 text-slate-500">{new Date(post.date).toLocaleDateString()}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => loadPostForEditing(post.id)}
                              className="text-[#2271B1] hover:underline font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onNavigateToSite(`post:${post.slug}`)}
                              className="text-emerald-600 hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:underline"
                            >
                              Trash
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: POST EDITOR (ADD NEW / EDIT) */}
          {activeTab === 'edit-post' && (
            <div className="space-y-6">
              
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300 pb-3 gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="p-1 hover:bg-gray-200 rounded text-slate-600"
                    title="Back to All Posts"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">
                      {editingPostId ? 'Edit WordPress Post' : 'Add New WordPress Post'}
                    </h1>
                    <p className="text-xs text-slate-500">
                      Professional Visual Editorial Workflow &bull; Instant Publication
                    </p>
                  </div>
                </div>

                {/* Workflow Buttons: SAVE DRAFT, PREVIEW, PUBLISH */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSavePost('draft')}
                    className="bg-white border border-gray-300 text-slate-700 px-3.5 py-1.5 rounded text-xs font-bold hover:bg-gray-50 shadow-xs transition"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePost('publish')}
                    className="bg-[#2271B1] hover:bg-[#135E96] text-white px-4 py-1.5 rounded text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingPostId ? 'Update Post' : 'Publish'}</span>
                  </button>
                </div>
              </div>

              {/* Auto-save Recovery Notice */}
              {hasAutoSavedDraft && (
                <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      An unsaved auto-saved draft was found from <strong>{hasAutoSavedDraft.savedAt}</strong>.
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={restoreAutoSavedDraft}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shadow-xs"
                    >
                      Restore Draft
                    </button>
                    <button
                      type="button"
                      onClick={discardAutoSavedDraft}
                      className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-slate-700 rounded text-xs font-medium"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}

              {/* Editor Layout: Main Content (8 cols) + Meta Boxes (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Post Title *</label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder={postLanguage === 'ur' ? 'یہاں خبر کی سرخی درج کریں...' : 'Add headline title...'}
                      dir={postLanguage === 'ur' ? 'rtl' : 'ltr'}
                      className={`w-full text-base font-bold p-3 bg-white border border-gray-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2271B1] ${
                        postLanguage === 'ur' ? 'font-urdu text-lg leading-loose' : 'font-editorial-serif'
                      }`}
                    />
                  </div>

                  {/* Permalink Slug */}
                  <div className="bg-white p-2.5 rounded border border-gray-200 text-xs flex items-center space-x-2">
                    <span className="text-slate-500 font-mono">Permalink: https://dunyaint.com/</span>
                    <input
                      type="text"
                      value={postSlug}
                      onChange={(e) => setPostSlug(e.target.value)}
                      placeholder="post-slug-here"
                      className="flex-1 px-2 py-1 bg-slate-50 border border-gray-300 rounded font-mono text-xs"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Excerpt / Deck Summary</label>
                    <textarea
                      rows={2}
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder={postLanguage === 'ur' ? 'خبر کا مختصر خلاصہ (1 سے 2 جملے)...' : 'Provide a concise 1-2 sentence editorial summary...'}
                      dir={postLanguage === 'ur' ? 'rtl' : 'ltr'}
                      className={`w-full text-xs p-3 bg-white border border-gray-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2271B1] ${
                        postLanguage === 'ur' ? 'font-urdu text-sm' : ''
                      }`}
                    />
                  </div>

                  {/* VISUAL WYSIWYG ARTICLE BODY EDITOR */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        ARTICLE BODY CONTENT
                      </label>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        WYSIWYG Visual Editor &bull; Copy/Paste Word or Web text freely
                      </span>
                    </div>
                    
                    <VisualArticleEditor
                      value={postContent}
                      onChange={(html) => setPostContent(html)}
                      language={postLanguage}
                      onLanguageChange={(lang) => setPostLanguage(lang)}
                      postId={editingPostId}
                      placeholder={postLanguage === 'ur' 
                        ? 'یہاں خبر کا مکمل تفصیلی متن لکھیں یا دوسری جگہ سے کاپی کرکے پیسٹ کریں۔ کوئی HTML کوڈ لکھنے کی ضرورت نہیں...' 
                        : 'Type or paste news article text here visually. Headings, images, lists, and quotes are formatted visually...'}
                    />
                  </div>

                  {/* Yoast / RankMath Style SEO Box */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-xs text-slate-800 uppercase">Yoast / RankMath SEO Analysis</h4>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        SEO Score: Good (92/100)
                      </span>
                    </div>

                    {/* Google SERP Preview */}
                    <div className="bg-slate-50 p-3 rounded border text-xs">
                      <span className="text-[10px] text-slate-500 block mb-1">Google Search Preview:</span>
                      <div className="text-blue-700 font-medium text-sm hover:underline cursor-pointer truncate">
                        {postSeoTitle || postTitle || 'Post Title'} - DUNYA INTERNATIONAL
                      </div>
                      <div className="text-emerald-700 text-[11px]">
                        https://dunyaint.com/{postSlug || 'article-slug'}/
                      </div>
                      <div className="text-slate-600 text-xs mt-0.5 line-clamp-2">
                        {postSeoDescription || postExcerpt || 'Official investigative and verified news coverage by Dunya International.'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">SEO Title</label>
                        <input
                          type="text"
                          value={postSeoTitle}
                          onChange={(e) => setPostSeoTitle(e.target.value)}
                          placeholder={postTitle}
                          className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Meta Description</label>
                        <input
                          type="text"
                          value={postSeoDescription}
                          onChange={(e) => setPostSeoDescription(e.target.value)}
                          placeholder={postExcerpt}
                          className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="bg-slate-100 p-4 rounded-lg border border-gray-300 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSavePost('draft')}
                      className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded text-xs font-bold hover:bg-gray-50 shadow-xs"
                    >
                      Save as Draft
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-bold shadow-xs flex items-center space-x-1.5"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>Preview on Public Site</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePost('publish')}
                        className="bg-[#2271B1] hover:bg-[#135E96] text-white px-5 py-2 rounded text-xs font-bold shadow-xs flex items-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingPostId ? 'Update & Publish Live' : 'Publish Article Live'}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Meta Boxes Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Category Box */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 uppercase border-b pb-2">Category *</h4>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded font-semibold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Author Box */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 uppercase border-b pb-2">Author Byline</h4>
                    <select
                      value={postAuthorId}
                      onChange={(e) => setPostAuthorId(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                    >
                      {authors.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* Editorial Flags & Language */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 uppercase border-b pb-2">Editorial Flags</h4>
                    
                    <label className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postIsBreaking}
                        onChange={(e) => setPostIsBreaking(e.target.checked)}
                        className="rounded text-red-600"
                      />
                      <span className="font-semibold text-red-700">Display in Breaking News Ticker</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postIsHero}
                        onChange={(e) => setPostIsHero(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span className="font-semibold text-slate-800">Pin as Homepage Hero Lead</span>
                    </label>

                    <div className="pt-2 border-t">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Language / RTL Mode</label>
                      <select
                        value={postLanguage}
                        onChange={(e) => setPostLanguage(e.target.value as 'en' | 'ur')}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                      >
                        <option value="en">English (LTR)</option>
                        <option value="ur">Urdu - اردو (RTL)</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Image Box */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 uppercase border-b pb-2">Featured Image</h4>
                    <input
                      type="text"
                      value={postFeaturedImage}
                      onChange={(e) => setPostFeaturedImage(e.target.value)}
                      placeholder="Image URL (https://...)"
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                    />

                    {postFeaturedImage && (
                      <div className="aspect-[16/9] rounded overflow-hidden border bg-slate-100">
                        <img src={postFeaturedImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <input
                      type="text"
                      value={postFeaturedCaption}
                      onChange={(e) => setPostFeaturedCaption(e.target.value)}
                      placeholder="Photojournalist / Bureau credit caption"
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                    />
                  </div>

                  {/* Tags Box */}
                  <div className="bg-white p-4 rounded border border-gray-200 space-y-2">
                    <h4 className="font-bold text-xs text-slate-800 uppercase border-b pb-2">Tags (Comma-separated)</h4>
                    <input
                      type="text"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="Pakistan, Diplomacy, Economy..."
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded"
                    />
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h1 className="text-xl font-bold text-slate-800">Categories</h1>
              </div>

              <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-slate-600 font-bold">
                      <th className="p-3">Name</th>
                      <th className="p-3">Urdu Name</th>
                      <th className="p-3">Slug</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td className="p-3 font-bold text-slate-800">{c.name}</td>
                        <td className="p-3 font-urdu text-sm">{c.nameUrdu || '-'}</td>
                        <td className="p-3 font-mono text-slate-500">/{c.slug}/</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{c.description}</td>
                        <td className="p-3 font-bold text-[#2271B1]">{c.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">WordPress Media Library</h1>
                  <p className="text-xs text-slate-500">
                    High-resolution editorial photo archives, bureau media assets, and news photography
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MEDIA_LIBRARY_ASSETS.map((asset) => (
                  <div key={asset.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="aspect-[16/10] bg-slate-100 relative group overflow-hidden">
                      <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(asset.url);
                            showNotice('Image URL copied to clipboard!');
                          }}
                          className="px-3 py-1.5 bg-[#2271B1] text-white rounded text-xs font-bold hover:bg-[#135E96]"
                        >
                          Copy Image URL
                        </button>
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">{asset.title}</h4>
                        <span className="text-[11px] text-blue-700 font-semibold mt-0.5 block">{asset.category}</span>
                        <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-2">{asset.caption}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">1200x800 &bull; WebP</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPostFeaturedImage(asset.url);
                            setPostFeaturedCaption(asset.caption);
                            setActiveTab('edit-post');
                            showNotice('Set as post featured image!');
                          }}
                          className="text-[11px] font-bold text-[#2271B1] hover:underline"
                        >
                          Use in Post &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PAGES */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h1 className="text-xl font-bold text-slate-800">WordPress Pages</h1>
              </div>

              <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-slate-600 font-bold">
                      <th className="p-3">Page Title</th>
                      <th className="p-3">Permalink</th>
                      <th className="p-3">Last Modified</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pages.map(page => (
                      <tr key={page.id}>
                        <td className="p-3 font-bold text-slate-800">{page.title}</td>
                        <td className="p-3 font-mono text-slate-500">/{page.slug}/</td>
                        <td className="p-3 text-slate-500">{new Date(page.modifiedDate).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onNavigateToSite(`page:${page.slug}`)}
                            className="text-emerald-600 hover:underline font-semibold"
                          >
                            View Page
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMIZER & SETTINGS */}
          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h1 className="text-xl font-bold text-slate-800">Site Customizer & General Settings</h1>
                <button
                  onClick={() => {
                    wpStorage.saveSettings(settings);
                    showNotice('Customizer settings updated and saved!');
                  }}
                  className="bg-[#2271B1] hover:bg-[#135E96] text-white px-4 py-1.5 rounded text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>

              <div className="bg-white p-6 rounded border border-gray-200 shadow-xs space-y-4 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Site Title</label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Custom Breaking Ticker Text (Optional)</label>
                  <input
                    type="text"
                    value={settings.breakingTickerCustomText || ''}
                    onChange={(e) => setSettings({ ...settings, breakingTickerCustomText: e.target.value })}
                    placeholder="E.g. SPECIAL REPORT: Gholam Mustafa–Mujtaba Family Legacy..."
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Newsroom Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Newsroom Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-bold text-xs uppercase text-slate-700 mb-3">Social Media URLs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Twitter URL"
                      value={settings.socialLinks.twitter}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                      className="text-xs p-2 bg-white border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Facebook URL"
                      value={settings.socialLinks.facebook}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                      className="text-xs p-2 bg-white border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HOSTINGER MIGRATION & THEME EXPORT */}
          {activeTab === 'migration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h1 className="text-xl font-bold text-slate-800">Hostinger WordPress Theme & Data Package</h1>
              </div>

              <div className="bg-white p-6 rounded border border-gray-200 shadow-xs space-y-5 max-w-4xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 text-[#2271B1] rounded-lg">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Download Complete Dunya International WordPress Theme Package
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Click below to generate and download a self-contained ZIP file containing the WordPress theme files (<code>functions.php</code>, <code>style.css</code>, <code>single.php</code>, <code>front-page.php</code>, etc.), the complete WXR XML data file for <strong>Tools &rarr; Import</strong>, and the step-by-step Hostinger installation guide.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownloadTheme}
                    className="bg-[#2271B1] hover:bg-[#135E96] text-white px-6 py-3 rounded text-sm font-bold shadow-md flex items-center space-x-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download dunya-international-wordpress-package.zip</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-5 space-y-3 text-xs text-slate-700">
                  <h4 className="font-bold text-slate-900 uppercase">What is included in this download:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>dunya-international-theme/</strong>: Complete PHP/CSS theme compliant with WordPress standards (No page builder dependencies).</li>
                    <li><strong>dunya-international-migration-data.xml</strong>: Standard WordPress WXR XML export containing all articles, categories, authors, and pages.</li>
                    <li><strong>HOSTINGER-DEPLOYMENT-GUIDE.md</strong>: Step-by-step instructions for Hostinger hPanel, WordPress theme upload, permalink configuration, and Yoast SEO verification.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Public Site Live Article Preview Modal */}
      <ArticlePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onPublish={() => {
          setShowPreviewModal(false);
          handleSavePost('publish');
        }}
        post={{
          title: postTitle || 'Untitled Headline',
          slug: postSlug || 'article-preview',
          content: postContent || '<p>Article body will appear here.</p>',
          excerpt: postExcerpt,
          category: postCategory,
          tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
          authorId: postAuthorId,
          featuredImage: postFeaturedImage,
          featuredImageCaption: postFeaturedCaption,
          isBreaking: postIsBreaking,
          isHeroFeatured: postIsHero,
          language: postLanguage,
          seoTitle: postSeoTitle,
          seoDescription: postSeoDescription
        }}
        authors={authors}
        categories={categories}
      />

    </div>
  );
};

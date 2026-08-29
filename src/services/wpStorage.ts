import { WPPost, WPCategory, WPTag, WPAuthor, WPPage, WPComment, WPSettings, WPRedirect } from '../types/wordpress';
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_TAGS, INITIAL_AUTHORS, INITIAL_PAGES, INITIAL_SETTINGS, INITIAL_REDIRECTS } from '../data/initialContent';

const STORAGE_KEYS = {
  POSTS: 'dunya_wp_posts',
  CATEGORIES: 'dunya_wp_categories',
  TAGS: 'dunya_wp_tags',
  AUTHORS: 'dunya_wp_authors',
  PAGES: 'dunya_wp_pages',
  COMMENTS: 'dunya_wp_comments',
  SETTINGS: 'dunya_wp_settings',
  REDIRECTS: 'dunya_wp_redirects'
};

class WPStorageService {
  private posts: WPPost[] = [];
  private categories: WPCategory[] = [];
  private tags: WPTag[] = [];
  private authors: WPAuthor[] = [];
  private pages: WPPage[] = [];
  private comments: WPComment[] = [];
  private settings: WPSettings = INITIAL_SETTINGS;
  private redirects: WPRedirect[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      this.posts = savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS;

      const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES;

      const savedTags = localStorage.getItem(STORAGE_KEYS.TAGS);
      this.tags = savedTags ? JSON.parse(savedTags) : INITIAL_TAGS;

      const savedAuthors = localStorage.getItem(STORAGE_KEYS.AUTHORS);
      this.authors = savedAuthors ? JSON.parse(savedAuthors) : INITIAL_AUTHORS;

      const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
      this.pages = savedPages ? JSON.parse(savedPages) : INITIAL_PAGES;

      const savedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      this.comments = savedComments ? JSON.parse(savedComments) : [];

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = savedSettings ? { ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) } : INITIAL_SETTINGS;

      const savedRedirects = localStorage.getItem(STORAGE_KEYS.REDIRECTS);
      this.redirects = savedRedirects ? JSON.parse(savedRedirects) : INITIAL_REDIRECTS;
    } catch {
      this.posts = INITIAL_POSTS;
      this.categories = INITIAL_CATEGORIES;
      this.tags = INITIAL_TAGS;
      this.authors = INITIAL_AUTHORS;
      this.pages = INITIAL_PAGES;
      this.comments = [];
      this.settings = INITIAL_SETTINGS;
      this.redirects = INITIAL_REDIRECTS;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private persist(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }

  // --- POSTS ---
  public getPosts(filter?: { category?: string; tag?: string; authorId?: string; language?: string; status?: string; search?: string }): WPPost[] {
    let result = [...this.posts];
    if (filter?.status) {
      result = result.filter(p => p.status === filter.status);
    } else {
      result = result.filter(p => p.status === 'publish');
    }

    if (filter?.category) {
      result = result.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
    }

    if (filter?.tag) {
      const tagSlug = filter.tag.toLowerCase();
      result = result.filter(p => p.tags.some(t => t.toLowerCase().replace(/\s+/g, '-') === tagSlug || t.toLowerCase() === tagSlug));
    }

    if (filter?.authorId) {
      result = result.filter(p => p.authorId === filter.authorId);
    }

    if (filter?.language) {
      result = result.filter(p => p.language === filter.language);
    }

    if (filter?.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort by date descending
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAllPostsAdmin(): WPPost[] {
    return [...this.posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getPostBySlug(slug: string): WPPost | undefined {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
    return this.posts.find(p => p.slug === cleanSlug || p.slug === slug);
  }

  public getPostById(id: string): WPPost | undefined {
    return this.posts.find(p => p.id === id);
  }

  public getBreakingNews(): WPPost[] {
    return this.posts.filter(p => p.status === 'publish' && p.isBreaking).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getHeroFeaturedPosts(): WPPost[] {
    const featured = this.posts.filter(p => p.status === 'publish' && p.isHeroFeatured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (featured.length > 0) return featured;
    return this.posts.filter(p => p.status === 'publish').slice(0, 5);
  }

  public getRelatedPosts(currentPost: WPPost, limit: number = 3): WPPost[] {
    return this.posts
      .filter(p => p.id !== currentPost.id && p.status === 'publish' && (p.category === currentPost.category || p.tags.some(t => currentPost.tags.includes(t))))
      .slice(0, limit);
  }

  public createPost(postData: Partial<WPPost>): WPPost {
    const slug = postData.slug
      ? postData.slug.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '')
      : (postData.title || 'untitled').toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');

    const words = (postData.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const newPost: WPPost = {
      id: `post-${Date.now()}`,
      title: postData.title || 'Untitled Article',
      slug: slug || `article-${Date.now()}`,
      content: postData.content || '',
      excerpt: postData.excerpt || (postData.content ? postData.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...' : ''),
      category: postData.category || 'pakistan',
      tags: postData.tags || [],
      authorId: postData.authorId || 'author-1',
      date: postData.date || new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      featuredImage: postData.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
      featuredImageCaption: postData.featuredImageCaption || '',
      featuredImageAlt: postData.featuredImageAlt || postData.title || '',
      status: postData.status || 'publish',
      isBreaking: !!postData.isBreaking,
      isHeroFeatured: !!postData.isHeroFeatured,
      language: postData.language || 'en',
      readingTimeMinutes: readingTime,
      views: 1,
      seoTitle: postData.seoTitle || `${postData.title} | DUNYA INTERNATIONAL`,
      seoDescription: postData.seoDescription || postData.excerpt || '',
      schemaType: postData.schemaType || 'NewsArticle',
      audioAvailable: !!postData.audioAvailable
    };

    this.posts.unshift(newPost);
    this.updateCategoryCounts();
    this.persist(STORAGE_KEYS.POSTS, this.posts);
    return newPost;
  }

  public updatePost(id: string, postData: Partial<WPPost>): WPPost | null {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.posts[index];
    const updated: WPPost = {
      ...existing,
      ...postData,
      id: existing.id,
      modifiedDate: new Date().toISOString()
    };

    if (postData.content) {
      const words = postData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      updated.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    }

    this.posts[index] = updated;
    this.updateCategoryCounts();
    this.persist(STORAGE_KEYS.POSTS, this.posts);
    return updated;
  }

  public deletePost(id: string): boolean {
    const initialLen = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== id);
    if (this.posts.length !== initialLen) {
      this.updateCategoryCounts();
      this.persist(STORAGE_KEYS.POSTS, this.posts);
      return true;
    }
    return false;
  }

  public incrementViews(id: string) {
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.persist(STORAGE_KEYS.POSTS, this.posts);
    }
  }

  // --- CATEGORIES ---
  public getCategories(): WPCategory[] {
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  public getCategoryBySlug(slug: string): WPCategory | undefined {
    return this.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  }

  public createCategory(cat: Omit<WPCategory, 'id' | 'count'>): WPCategory {
    const newCat: WPCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      count: 0,
      order: this.categories.length + 1
    };
    this.categories.push(newCat);
    this.updateCategoryCounts();
    this.persist(STORAGE_KEYS.CATEGORIES, this.categories);
    return newCat;
  }

  public updateCategory(id: string, catData: Partial<WPCategory>): WPCategory | null {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...catData };
    this.persist(STORAGE_KEYS.CATEGORIES, this.categories);
    return this.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    this.categories = this.categories.filter(c => c.id !== id);
    this.persist(STORAGE_KEYS.CATEGORIES, this.categories);
    return true;
  }

  private updateCategoryCounts() {
    this.categories.forEach(cat => {
      cat.count = this.posts.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase() && p.status === 'publish').length;
    });
    this.persist(STORAGE_KEYS.CATEGORIES, this.categories);
  }

  // --- TAGS ---
  public getTags(): WPTag[] {
    return [...this.tags];
  }

  public getTagBySlug(slug: string): WPTag | undefined {
    return this.tags.find(t => t.slug.toLowerCase() === slug.toLowerCase());
  }

  public createTag(name: string): WPTag {
    const slug = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
    const existing = this.tags.find(t => t.slug === slug);
    if (existing) return existing;

    const newTag: WPTag = {
      id: `tag-${Date.now()}`,
      name,
      slug,
      count: 1
    };
    this.tags.push(newTag);
    this.persist(STORAGE_KEYS.TAGS, this.tags);
    return newTag;
  }

  // --- AUTHORS ---
  public getAuthors(): WPAuthor[] {
    return [...this.authors];
  }

  public getAuthorBySlug(slug: string): WPAuthor | undefined {
    return this.authors.find(a => a.slug.toLowerCase() === slug.toLowerCase());
  }

  public getAuthorById(id: string): WPAuthor | undefined {
    return this.authors.find(a => a.id === id);
  }

  // --- PAGES ---
  public getPages(): WPPage[] {
    return [...this.pages];
  }

  public getPageBySlug(slug: string): WPPage | undefined {
    const clean = slug.replace(/^\/+|\/+$/g, '');
    return this.pages.find(p => p.slug === clean);
  }

  public updatePage(id: string, pageData: Partial<WPPage>): WPPage | null {
    const idx = this.pages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.pages[idx] = { ...this.pages[idx], ...pageData, modifiedDate: new Date().toISOString() };
    this.persist(STORAGE_KEYS.PAGES, this.pages);
    return this.pages[idx];
  }

  // --- COMMENTS ---
  public getComments(postId: string): WPComment[] {
    return this.comments.filter(c => c.postId === postId && c.status === 'approved').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAllComments(): WPComment[] {
    return [...this.comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public addComment(postId: string, authorName: string, authorEmail: string, content: string): WPComment {
    const newComment: WPComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorName: authorName.trim() || 'Anonymous Reader',
      authorEmail: authorEmail.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      status: 'approved'
    };
    this.comments.unshift(newComment);
    this.persist(STORAGE_KEYS.COMMENTS, this.comments);
    return newComment;
  }

  // --- SETTINGS ---
  public getSettings(): WPSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: WPSettings): WPSettings {
    this.settings = { ...newSettings };
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
    return this.settings;
  }

  public updateSettings(newSettings: Partial<WPSettings>): WPSettings {
    this.settings = { ...this.settings, ...newSettings };
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
    return this.settings;
  }

  // --- REDIRECTS ---
  public getRedirects(): WPRedirect[] {
    return [...this.redirects];
  }

  public checkRedirect(path: string): WPRedirect | undefined {
    const clean = path.toLowerCase().replace(/\/+$/, '');
    const found = this.redirects.find(r => r.oldUrl.toLowerCase().replace(/\/+$/, '') === clean);
    if (found) {
      found.hits = (found.hits || 0) + 1;
      this.persist(STORAGE_KEYS.REDIRECTS, this.redirects);
    }
    return found;
  }

  public addRedirect(oldUrl: string, newUrl: string, statusCode: 301 | 302 = 301): WPRedirect {
    const newRedir: WPRedirect = {
      id: `redir-${Date.now()}`,
      oldUrl,
      newUrl,
      statusCode,
      hits: 0
    };
    this.redirects.push(newRedir);
    this.persist(STORAGE_KEYS.REDIRECTS, this.redirects);
    return newRedir;
  }

  // --- RESET TO SEED MIGRATION DATA ---
  public resetToDefaultMigrationData() {
    this.posts = INITIAL_POSTS;
    this.categories = INITIAL_CATEGORIES;
    this.tags = INITIAL_TAGS;
    this.authors = INITIAL_AUTHORS;
    this.pages = INITIAL_PAGES;
    this.comments = [];
    this.settings = INITIAL_SETTINGS;
    this.redirects = INITIAL_REDIRECTS;

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(this.posts));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(this.tags));
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(this.authors));
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(this.pages));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(this.comments));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    localStorage.setItem(STORAGE_KEYS.REDIRECTS, JSON.stringify(this.redirects));
    this.notify();
  }
}

export const wpStorage = new WPStorageService();

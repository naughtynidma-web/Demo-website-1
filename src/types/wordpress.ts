export type Language = 'en' | 'ur';

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string; // Category slug
  tags: string[];
  authorId: string;
  date: string; // ISO date string
  modifiedDate: string;
  featuredImage: string;
  featuredImageCaption?: string;
  featuredImageAlt?: string;
  status: 'publish' | 'draft';
  isBreaking?: boolean;
  isHeroFeatured?: boolean;
  language: Language;
  readingTimeMinutes: number;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  schemaType?: 'NewsArticle' | 'Article' | 'OpinionNewsArticle';
  audioAvailable?: boolean;
}

export interface WPCategory {
  id: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  description: string;
  count: number;
  color?: string;
  order: number;
  showOnHomepage?: boolean;
}

export interface WPTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface WPAuthor {
  id: string;
  name: string;
  slug: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  social?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface WPPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'publish' | 'draft';
  modifiedDate: string;
}

export interface WPComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  date: string;
  status: 'approved' | 'pending';
}

export interface WPAdSlot {
  id: string;
  location: 'header' | 'home_top' | 'home_mid' | 'sidebar' | 'article_top' | 'article_mid' | 'article_bottom' | 'footer';
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  codeSnippet?: string;
  isActive: boolean;
}

export interface WPRedirect {
  id: string;
  oldUrl: string;
  newUrl: string;
  statusCode: 301 | 302;
  hits: number;
}

export interface WPSettings {
  siteTitle: string;
  tagline: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  breakingNewsActive: boolean;
  breakingNewsCustomText?: string;
  tickerSpeed: number; // in seconds
  adsEnabled: boolean;
  adSlots: WPAdSlot[];
  socialLinks: {
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
    whatsapp: string;
    linkedin: string;
  };
  urduEnabled: boolean;
  copyrightText: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  primaryColor: string;
  themeMode: 'light' | 'dark' | 'system';
}

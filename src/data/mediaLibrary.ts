/**
 * Curated Dunya International News Media Library
 * Provides stock news photos, bureau graphics, and editorial assets.
 */

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: string;
  caption: string;
  altText: string;
}

export const MEDIA_LIBRARY_ASSETS: MediaAsset[] = [
  {
    id: 'media-1',
    title: 'Gholam Mustafa & Dr. Gholam Mujtaba Academic Legacy',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    category: 'Education & Legacy',
    caption: 'تصویر: دنیا انٹرنیشنل تعلیمی آرکائیو — غلام مصطفیٰ و ڈاکٹر غلام مجتبیٰ خاندانی میراث',
    altText: 'Gholam Mustafa Calcutta University legacy and academic convocation'
  },
  {
    id: 'media-2',
    title: 'National Assembly of Pakistan & Diplomatic Enclave',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
    category: 'Pakistan Politics',
    caption: 'Photo: Dunya International Bureau, Islamabad — National Assembly & Policy Summit',
    altText: 'Parliament House and legislative governance in Islamabad'
  },
  {
    id: 'media-3',
    title: 'International Monetary Fund & Global Macroeconomics',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
    category: 'Economy & Business',
    caption: 'تصویر: عالمی مالیاتی فنڈ اور تجارتی منڈی کے اہم اشاریے',
    altText: 'Financial market exchange trends and economic indices'
  },
  {
    id: 'media-4',
    title: 'United Nations Security Council & Diplomatic Summit',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    category: 'World Affairs',
    caption: 'Photo: UN Headquarters, New York — International Strategic Dialogue',
    altText: 'United Nations General Assembly diplomatic conference'
  },
  {
    id: 'media-5',
    title: 'High-Tech Artificial Intelligence Compute & Cyber Security',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    category: 'Technology & AI',
    caption: 'تصویر: جدید مصنوعی ذہانت اور ڈیجیٹل کمپیوٹ انفراسٹرکچر',
    altText: 'Artificial Intelligence neural network and digital cloud architecture'
  },
  {
    id: 'media-6',
    title: 'Pakistan Cricket Team & International Stadium',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200',
    category: 'Sports & Cricket',
    caption: 'Photo: PCB Press Office — International Cricket Tournament Stadium',
    altText: 'Cricket match under floodlights with stadium crowd'
  },
  {
    id: 'media-7',
    title: 'Medical Breakthrough & Healthcare Research Lab',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    category: 'Health & Science',
    caption: 'تصویر: طبی تحقیق اور عوامی صحت کے لیے نئی لیبارٹری ایجادات',
    altText: 'Medical laboratory research and public health diagnostic testing'
  },
  {
    id: 'media-8',
    title: 'Dunya International Newsroom Studio & Broadcast Desk',
    url: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80&w=1200',
    category: 'Newsroom & Media',
    caption: 'Photo: Dunya International Central Newsroom & Broadcast Desk',
    altText: 'News journalists and broadcast monitors in central control room'
  }
];

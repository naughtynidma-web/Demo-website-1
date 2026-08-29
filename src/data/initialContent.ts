import { WPPost, WPCategory, WPTag, WPAuthor, WPPage, WPSettings, WPRedirect } from '../types/wordpress';

export const INITIAL_AUTHORS: WPAuthor[] = [
  {
    id: 'author-1',
    name: 'Dr. Gholam Mujtaba',
    slug: 'dr-gholam-mujtaba',
    role: 'Editorial Contributor & Senior Scholar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Gholam Mujtaba (MD, Ed.D.) is a renowned academician, physician, and public service leader. He continues the legacy of educational excellence and civic mentorship established by Calcutta University topper Gholam Mustafa.',
    email: 'editorial@dunyaint.com',
    social: {
      twitter: 'https://twitter.com/dunyaint',
      linkedin: 'https://linkedin.com/in/dunyaint',
      website: 'https://dunyaint.com'
    }
  },
  {
    id: 'author-2',
    name: 'Dunya International Editorial Board',
    slug: 'editorial-board',
    role: 'Staff Editorial & Analysis Desk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'The Dunya International Editorial Board provides institutional analysis, balanced investigative reporting, and global geopolitical perspectives.',
    email: 'desk@dunyaint.com',
    social: {
      twitter: 'https://twitter.com/dunyaint',
      facebook: 'https://facebook.com/dunyaint'
    }
  },
  {
    id: 'author-3',
    name: 'Syed Tariq Mahmood',
    slug: 'syed-tariq-mahmood',
    role: 'Senior Diplomatic & Political Correspondent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Veteran journalist covering South Asian geopolitics, US-Pakistan diplomatic relations, and constitutional governance for over two decades.',
    email: 'tariq.mahmood@dunyaint.com',
    social: {
      twitter: 'https://twitter.com/dunyaint'
    }
  },
  {
    id: 'author-4',
    name: 'Ayesha Siddiqui',
    slug: 'ayesha-siddiqui',
    role: 'Technology & Economic Affairs Editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Specialist in fintech, emerging artificial intelligence compute infrastructure, and regional macroeconomics across emerging markets.',
    email: 'ayesha.siddiqui@dunyaint.com',
    social: {
      linkedin: 'https://linkedin.com/in/dunyaint'
    }
  },
  {
    id: 'author-5',
    name: 'علامہ زبیر رحمانی',
    slug: 'zubair-rehmani',
    role: 'سینئر ایڈیٹر اردو سروس (Urdu Editor)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'دنیا انٹرنیشنل کے سینئر اردو ایڈیٹر، بین الاقوامی تعلقات اور سماجی موضوعات پر گذشتہ اٹھارہ سال سے لکھ رہے ہیں۔',
    email: 'urdu@dunyaint.com',
    social: {
      facebook: 'https://facebook.com/dunyaint'
    }
  }
];

export const INITIAL_CATEGORIES: WPCategory[] = [
  { id: 'cat-1', name: 'Pakistan', nameUrdu: 'پاکستان', slug: 'pakistan', description: 'Comprehensive reporting and in-depth analysis on national politics, economy, and social developments in Pakistan.', count: 6, color: '#006633', order: 1, showOnHomepage: true },
  { id: 'cat-2', name: 'World', nameUrdu: 'بین الاقوامی', slug: 'world', description: 'Global affairs, diplomatic summits, international relations, and major worldwide news.', count: 5, color: '#003366', order: 2, showOnHomepage: true },
  { id: 'cat-3', name: 'Politics', nameUrdu: 'سیاست', slug: 'politics', description: 'Political commentary, parliamentary developments, policy decisions, and elections.', count: 4, color: '#8b0000', order: 3, showOnHomepage: true },
  { id: 'cat-4', name: 'Business', nameUrdu: 'کاروبار و معیشت', slug: 'business', description: 'Market updates, financial analysis, investment flows, and macroeconomic trends.', count: 4, color: '#005f73', order: 4, showOnHomepage: true },
  { id: 'cat-5', name: 'Sports', nameUrdu: 'کھیل', slug: 'sports', description: 'Cricket tournaments, football leagues, athletics, and international sporting fixtures.', count: 3, color: '#2b9348', order: 5, showOnHomepage: true },
  { id: 'cat-6', name: 'Technology', nameUrdu: 'ٹیکنالوجی', slug: 'technology', description: 'Artificial intelligence breakthroughs, cyber systems, digital economy, and tech innovations.', count: 3, color: '#3a0ca3', order: 6, showOnHomepage: true },
  { id: 'cat-7', name: 'Entertainment', nameUrdu: 'شوبز و ثقافت', slug: 'entertainment', description: 'Cinema, cultural heritage, arts, literature, and diaspora festivals.', count: 2, color: '#9b5de5', order: 7, showOnHomepage: true },
  { id: 'cat-8', name: 'Health', nameUrdu: 'صحت و طب', slug: 'health', description: 'Medical research, public healthcare initiatives, wellness, and pandemic preparedness.', count: 2, color: '#007f5f', order: 8, showOnHomepage: true },
  { id: 'cat-9', name: 'Education', nameUrdu: 'تعلیم و تدریس', slug: 'education', description: 'Academic achievements, higher education policy, STEM initiatives, and inspiring family legacies.', count: 3, color: '#b56576', order: 9, showOnHomepage: false },
  { id: 'cat-10', name: 'Lifestyle', nameUrdu: 'طرز زندگی', slug: 'lifestyle', description: 'Architecture, culinary heritage, human interest stories, and travel features.', count: 2, color: '#e07a5f', order: 10, showOnHomepage: false },
  { id: 'cat-11', name: 'Opinion', nameUrdu: 'اداریہ و تجزیات', slug: 'opinion', description: 'Editorial commentary, guest columns, and thought leadership from renowned international experts.', count: 3, color: '#4a4e69', order: 11, showOnHomepage: false },
  { id: 'cat-12', name: 'Urdu News', nameUrdu: 'دنیا اردو', slug: 'urdu', description: 'دنیا انٹرنیشنل کی جامع اردو خبریں، تجزیات اور خصوصی مضامین۔', count: 3, color: '#1b4332', order: 12, showOnHomepage: false }
];

export const INITIAL_TAGS: WPTag[] = [
  { id: 'tag-1', name: 'Education Legacy', slug: 'education-legacy', count: 3 },
  { id: 'tag-2', name: 'Gholam Mustafa', slug: 'gholam-mustafa', count: 2 },
  { id: 'tag-3', name: 'Economic Reforms', slug: 'economic-reforms', count: 4 },
  { id: 'tag-4', name: 'Diplomacy', slug: 'diplomacy', count: 3 },
  { id: 'tag-5', name: 'Artificial Intelligence', slug: 'artificial-intelligence', count: 2 },
  { id: 'tag-6', name: 'Cricket', slug: 'cricket', count: 2 },
  { id: 'tag-7', name: 'Diaspora', slug: 'diaspora', count: 3 },
  { id: 'tag-8', name: 'USA', slug: 'usa', count: 4 },
  { id: 'tag-9', name: 'Islamabad', slug: 'islamabad', count: 3 }
];

export const INITIAL_POSTS: WPPost[] = [
  {
    id: 'post-1',
    title: 'Three Generations of Learning: The Gholam Mustafa–Mujtaba Family Legacy',
    slug: 'three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy',
    excerpt: 'An inspiring chronicle of how a commitment to academic distinction, integrity, and public service begun by Calcutta University topper Gholam Mustafa flourished across three generations in medicine, healthcare, and academia.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
The history of meaningful human progress is rarely measured in monuments of brick and stone; rather, it is recorded in the enduring values handed down from one generation to the next. The educational and civic journey of the Gholam Mustafa–Mujtaba family stands as a testament to the transformative power of scholarship, unyielding integrity, and dedication to public welfare.
</p>

<h3 class="text-2xl font-bold font-editorial-display mt-8 mb-4 text-slate-900">The Foundation: Gholam Mustafa (1918–1983)</h3>
<p>
The patriarch of this intellectual tradition, Gholam Mustafa, was born in 1918 in British India. Demonstrating exceptional intellectual prowess from an early age, he achieved historic distinction in 1938 by becoming the first Muslim scholar to top Calcutta University. A gifted orator and a committed community leader, he served as President of the Muslim Students Federation's Calcutta chapter during an era of profound historical transformation.
</p>
<p>
Following his migration to Lahore prior to independence, Gholam Mustafa dedicated his lifelong career to the civil administrative architecture of Pakistan. Serving with distinction as Deputy Comptroller in the Pakistan Audit & Accounts department, his professional life was anchored in absolute financial probity, profound faith, and an unwavering belief in education as the ultimate catalyst for human dignity.
</p>

<blockquote class="border-l-4 border-[#003366] pl-6 py-3 my-6 italic text-lg text-slate-700 bg-slate-50 rounded-r">
"Education is not merely an acquisition of technical credentials; it is a sacred trust and an obligation to illuminate the society that fostered you."
<footer class="text-sm font-semibold not-italic text-slate-500 mt-2">— Gholam Mustafa (1918–1983)</footer>
</blockquote>

<h3 class="text-2xl font-bold font-editorial-display mt-8 mb-4 text-slate-900">Continuing the Torch: Dr. Gholam Mujtaba</h3>
<p>
This profound ethos was carried forward by his son, Dr. Gholam Mujtaba. Embracing rigorous multidisciplinary scholarship, Dr. Mujtaba pursued comprehensive studies across pharmacy, medicine, and postgraduate education, earning dual doctorate degrees (an MD and an Ed.D.). As an educator, physician, and civic mentor, Dr. Mujtaba transformed his father's values into a vibrant platform for community uplift, mentoring countless scholars and professionals across Pakistan, the United States, and the United Kingdom.
</p>

<h3 class="text-2xl font-bold font-editorial-display mt-8 mb-4 text-slate-900">The Third Generation: Global Excellence in Medicine and Academia</h3>
<p>
Today, this living educational legacy has blossomed through six children—four sons and two daughters—who have distinguished themselves in higher education, specialized medical practice, clinical healthcare, university academia, international business, and real estate development. Educated at prestigious institutions in the United States and the United Kingdom, they continue to uphold the foundational tenets of honesty, academic excellence, and public service.
</p>
<p>
In an era characterized by transient trends, the Gholam Mustafa–Mujtaba chronicle serves as an inspiring blueprint: when a family anchors its ambition in knowledge, ethics, and service to humanity, its legacy transcends borders and illuminates generations.
</p>
`,
    category: 'education',
    tags: ['Education Legacy', 'Gholam Mustafa', 'Diaspora', 'USA'],
    authorId: 'author-1',
    date: '2026-08-25T10:00:00Z',
    modifiedDate: '2026-08-26T14:30:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'The enduring legacy of higher education, mentorship, and civic commitment across three generations.',
    featuredImageAlt: 'Three generations of educational legacy in higher academia',
    status: 'publish',
    isHeroFeatured: true,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 5,
    views: 4820,
    seoTitle: 'Three Generations of Learning: The Gholam Mustafa–Mujtaba Family Legacy | Dunya International',
    seoDescription: 'Discover the inspiring educational chronicle of Gholam Mustafa and Dr. Gholam Mujtaba, representing a three-generation commitment to scholarship, medicine, and public integrity.',
    schemaType: 'NewsArticle',
    audioAvailable: true
  },
  {
    id: 'post-2',
    title: 'Pakistan Announces Sweeping Energy & Export Reforms to Accelerate Economic Stabilization',
    slug: 'pakistan-announces-new-economic-reforms',
    excerpt: 'The Federal Cabinet approves a multi-phase structural reform package targeting power sector tariff rationalization, export competitiveness, and rapid digitalization of tax administration.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
ISLAMABAD — In a landmark policy shift aimed at solidifying fiscal stability, the Federal Government on Tuesday officially ratified a comprehensive economic reform agenda designed to overhaul the country's energy tariff matrix and stimulate private-sector export industries.
</p>
<p>
The policy, finalized after extensive consultations with domestic stakeholders, multilateral financial institutions, and regional trade chambers, focuses on three principal pillars:
</p>
<ul class="list-disc pl-6 space-y-2 my-4 text-slate-700">
  <li><strong>Tariff Rationalization:</strong> Reallocating industrial energy subsidies directly to export-oriented sectors to eliminate cross-subsidization bottlenecks.</li>
  <li><strong>Digital Tax Harmonization:</strong> Comprehensive nationwide rollout of digital invoicing and automated sales tax refunds to eliminate bureaucratic delays.</li>
  <li><strong>Sovereign Wealth Modernization:</strong> Phased privatization and restructuring of state-owned commercial entities under transparent international bidding standards.</li>
</ul>
<p>
Financial analysts at the Pakistan Stock Exchange responded favorably to the announcement, with the benchmark KSE-100 index rallying over 800 points within the morning trading session.
</p>
`,
    category: 'pakistan',
    tags: ['Economic Reforms', 'Islamabad', 'Business'],
    authorId: 'author-3',
    date: '2026-08-28T09:15:00Z',
    modifiedDate: '2026-08-28T11:45:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'Government ministries and trade councils finalize the new macroeconomic framework in Islamabad.',
    featuredImageAlt: 'Modern financial and government district',
    status: 'publish',
    isHeroFeatured: true,
    isBreaking: true,
    language: 'en',
    readingTimeMinutes: 4,
    views: 3150,
    seoTitle: 'Pakistan Announces Sweeping Energy & Export Reforms | Dunya International',
    seoDescription: 'Comprehensive breakdown of Pakistan new macroeconomic structural reforms, energy tariff rationalization, and export incentives.',
    schemaType: 'NewsArticle',
    audioAvailable: true
  },
  {
    id: 'post-3',
    title: 'Global Climate Summit Reaches Consensus on Dedicated Loss and Damage Capital Disbursal',
    slug: 'global-climate-summit-loss-and-damage-consensus',
    excerpt: 'Delegates from over 160 nations establish binding timelines for direct climate-resilient infrastructure funding to vulnerable frontline countries across Asia and Africa.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
GENEVA — In what international environmental observers are hailing as a pivotal breakthrough, global negotiators have finalized the operational framework for the United Nations Loss and Damage Capital Facility.
</p>
<p>
The agreement establishes direct non-debt grant windows for climate-vulnerable developing economies that have suffered catastrophic weather anomalies, including extreme monsoons and unprecedented glacier retreat across the Hindu Kush Himalayan region.
</p>
<p>
Pakistan's delegation played an instrumental role in advocating for simplified access modalities, ensuring that reconstruction funds can be deployed within 72 hours of major disaster declarations.
</p>
`,
    category: 'world',
    tags: ['Diplomacy', 'Global Climate', 'World'],
    authorId: 'author-2',
    date: '2026-08-27T14:20:00Z',
    modifiedDate: '2026-08-27T16:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'United Nations conference plenary hall following the unanimous ratification of the climate financing accord.',
    featuredImageAlt: 'International diplomatic conference hall',
    status: 'publish',
    isHeroFeatured: true,
    isBreaking: true,
    language: 'en',
    readingTimeMinutes: 4,
    views: 2680,
    seoTitle: 'Global Climate Summit Consensus on Loss & Damage | Dunya International',
    seoDescription: 'International consensus reached on climate grant disbursal mechanisms for vulnerable Asian and African nations.',
    schemaType: 'NewsArticle'
  },
  {
    id: 'post-4',
    title: 'PSX KSE-100 Crosses Historic Threshold as Foreign Remittances & IT Exports Climb 28%',
    slug: 'psx-kse-100-historic-high-it-exports-remittances',
    excerpt: 'Surging technology export receipts and stabilized foreign exchange reserves drive unprecedented institutional buying across blue-chip banking and energy equities.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
KARACHI — The Pakistan Stock Exchange witnessed historic trading volumes on Thursday as the benchmark KSE-100 index crossed another monumental barrier, propelled by robust macroeconomic indicators and sustained inflows of overseas worker remittances.
</p>
<p>
According to data released by the State Bank of Pakistan, national information technology services exports expanded by 28.4% year-on-year, driven by freelance software engineers, enterprise cloud migrations, and software houses expanding into Gulf and North American markets.
</p>
`,
    category: 'business',
    tags: ['Economic Reforms', 'Business', 'Technology'],
    authorId: 'author-4',
    date: '2026-08-26T08:30:00Z',
    modifiedDate: '2026-08-26T12:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'Trading floor activity at the Pakistan Stock Exchange in Karachi.',
    featuredImageAlt: 'Stock market chart and trading screens',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 3,
    views: 2140,
    seoTitle: 'PSX KSE-100 Breaks Historic Record on Tech Export Boom | Dunya International',
    seoDescription: 'In-depth market report on KSE-100 surge, IT export receipts expansion, and macroeconomic reserve improvements.',
    schemaType: 'NewsArticle'
  },
  {
    id: 'post-5',
    title: 'Next-Generation AI Compute Alliances Redefine High-Efficiency Global Data Centers',
    slug: 'next-gen-ai-compute-alliances-redefine-data-centers',
    excerpt: 'Silicon architecture breakthroughs and liquid cooling standards allow hyperscale cloud providers to deliver ten-fold compute density while cutting power draw by 40%.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
SAN JOSE / LONDON — A coalition of leading semiconductor manufacturers and hyperscale cloud providers has unveiled the next generation of modular neural processing architectures.
</p>
<p>
With electricity consumption emerging as the primary bottleneck for large-scale generative model training, new direct-to-chip microfluidic cooling and photonics interconnects are enabling data centers to operate at unprecedented energy efficiency levels.
</p>
`,
    category: 'technology',
    tags: ['Artificial Intelligence', 'Technology'],
    authorId: 'author-4',
    date: '2026-08-25T16:45:00Z',
    modifiedDate: '2026-08-25T18:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'Advanced high-density server rack infrastructure featuring photonics interconnects.',
    featuredImageAlt: 'Modern data center server rack with blue illumination',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 4,
    views: 1890,
    seoTitle: 'Next-Gen AI Compute Infrastructure Alliances | Dunya International',
    seoDescription: 'Silicon breakthroughs and photonics interconnects transform global enterprise AI compute efficiency.',
    schemaType: 'NewsArticle'
  },
  {
    id: 'post-6',
    title: 'خصوصی تحریر: تعلیم اور عوامی خدمت کا تابناک سفر — غلام مصطفیٰ اور ڈاکٹر غلام مجتبیٰ کی خاندانی روایات',
    slug: 'three-generations-of-learning-urdu-gholam-mustafa-mujtaba',
    excerpt: 'علم، دیانت، اور خدمتِ خلق کا ایک ایسا درخشاں باب جو کلکتہ یونیورسٹی کے اول پوزیشن ہولڈر غلام مصطفیٰ سے شروع ہو کر تین نسلوں تک طب، تعلیم اور سماجی فلاح کے میدانوں میں مسلسل روشن ہے۔',
    content: `
<div class="font-urdu text-xl leading-loose text-slate-800 text-right" dir="rtl">
<p class="lead font-bold text-2xl mb-6 text-slate-900">
انسانی تاریخ میں حقیقی عظمت عمارتوں یا مادی خزانوں سے نہیں بلکہ ان اعلیٰ اقدار اور تعلیمی روایات سے ناپی جاتی ہے جو نسل در نسل منتقل ہوتی ہیں۔ غلام مصطفیٰ اور ڈاکٹر غلام مجتبیٰ کے خاندان کی علمی و سماجی خدمات اس بات کا جیتا جاگتا ثبوت ہیں کہ تعلیم اور دیانت داری کس طرح پوری نسلوں کو سنوار سکتی ہے۔
</p>

<h3 class="text-2xl font-bold mt-8 mb-4 text-[#003366]">بنیادی ستون: غلام مصطفیٰ (1918 تا 1983)</h3>
<p>
اس علمی روایت کے بانی غلام مصطفیٰ 1918 میں برصغیر پاک و ہند میں پیدا ہوئے۔ انہوں نے 1938 میں کلکتہ یونیورسٹی سے اول پوزیشن حاصل کر کے تاریخ رقم کی، اور وہ یہ اعزاز حاصل کرنے والے پہلے مسلمان طالب علم تھے۔ وہ ایک نامور خطیب اور مسلم اسٹوڈنٹس فیڈریشن کلکتہ کے صدر بھی رہے۔
</p>
<p>
قیامِ پاکستان سے قبل لاہور تشریف لائے اور پاکستان آڈٹ اینڈ اکاؤنٹس سروس میں بطور ڈپٹی کمپٹرولر گراں قدر خدمات انجام دیں۔ ان کی زندگی دیانت داری، غیر متزلزل ایمان اور تعلیم کی ترویج کا روشن نمونہ تھی۔
</p>

<blockquote class="border-r-4 border-[#003366] pr-6 py-4 my-6 italic text-xl text-slate-800 bg-slate-100 rounded-l">
"تعلیم صرف ایک ڈگری کا نام نہیں بلکہ معاشرے کی اخلاقی اور سماجی آبیاری کی مقدس امانت ہے۔"
<footer class="text-base font-bold not-italic text-slate-600 mt-2">— غلام مصطفیٰ (1918–1983)</footer>
</blockquote>

<h3 class="text-2xl font-bold mt-8 mb-4 text-[#003366]">روایت کا تسلسل: ڈاکٹر غلام مجتبیٰ</h3>
<p>
ان کے فرزند ڈاکٹر غلام مجتبیٰ نے اس علمی میراث کو مزید بلندیوں تک پہنچایا۔ انہوں نے فارمیسی، طب (MD) اور اعلیٰ تعلیم (Ed.D) میں دوہری ڈاکٹریٹ کی ڈگریاں حاصل کیں۔ وہ نہ صرف ایک معالج اور استاد ہیں بلکہ پاک و ہند اور امریکہ و برطانیہ میں کمیونٹی کی راہنمائی کرنے والے سرپرست بھی ہیں۔
</p>

<h3 class="text-2xl font-bold mt-8 mb-4 text-[#003366]">تیسری نسل: عالمی سطح پر طب اور تعلیم میں نمایاں کارنامے</h3>
<p>
آج یہ سلسلہ ان کی اگلی نسل کے چھ بچوں (چار بیٹوں اور دو بیٹیوں) تک پھیل چکا ہے جنہوں نے امریکہ اور برطانیہ کی صفِ اول کی جامعات سے تعلیم حاصل کر کے طب، صحت، کاروبار اور درس و تدریس میں عالمی نام پیدا کیا ہے۔
</p>
</div>
`,
    category: 'urdu',
    tags: ['Education Legacy', 'Gholam Mustafa', 'Diaspora'],
    authorId: 'author-5',
    date: '2026-08-25T11:30:00Z',
    modifiedDate: '2026-08-26T15:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'علم و دیانت کا سفر: تین نسلوں پر محیط خاندانی خدمات کا جائزہ۔',
    featuredImageAlt: 'Urdu Educational Heritage and Books',
    status: 'publish',
    isHeroFeatured: true,
    isBreaking: false,
    language: 'ur',
    readingTimeMinutes: 5,
    views: 3890,
    seoTitle: 'خصوصی تحریر: تعلیم اور عوامی خدمت کا تابناک سفر — دنیا انٹرنیشنل',
    seoDescription: 'غلام مصطفیٰ اور ڈاکٹر غلام مجتبیٰ کے خاندان کا تین نسلوں پر محیط علمی اور طبی سفر۔',
    schemaType: 'NewsArticle',
    audioAvailable: true
  },
  {
    id: 'post-7',
    title: 'Pakistan National Cricket Team Launches High-Performance Fast Bowling Boot Camp Ahead of World Fixtures',
    slug: 'pakistan-cricket-fast-bowling-camp-world-fixtures',
    excerpt: 'State-of-the-art biomechanical video tracking and specialized stamina conditioning programs integrated at National Cricket Academy Lahore.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
LAHORE — The Pakistan Cricket Board has formally commenced an intensive four-week specialized fast-bowling camp at the National Cricket Academy in Lahore, aimed at fine-tuning seam presentation, reverse swing control, and biomechanical injury prevention.
</p>
<p>
Former international pace icons are overseeing the camp, which incorporates high-speed motion analysis cameras and individualized workload management software.
</p>
`,
    category: 'sports',
    tags: ['Cricket', 'Sports', 'Islamabad'],
    authorId: 'author-2',
    date: '2026-08-27T10:15:00Z',
    modifiedDate: '2026-08-27T10:15:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'Pace bowlers during conditioning drills at Gaddafi Stadium sports complex.',
    featuredImageAlt: 'Cricket pitch and stadium lights',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 3,
    views: 1720,
    seoTitle: 'Pakistan Fast Bowling Conditioning Camp | Dunya International Sports',
    seoDescription: 'National Cricket Academy deploys biomechanics and high-intensity workload regimens for pace squad.',
    schemaType: 'NewsArticle'
  },
  {
    id: 'post-8',
    title: 'Editorial: The Imperative of Educational Capital in Navigating Global Geopolitical Shifts',
    slug: 'editorial-educational-capital-geopolitical-shifts',
    excerpt: 'Sovereign nations that prioritize institutional learning, scientific research, and civic integrity remain resilient against global market turbulence.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
As the international order navigates unprecedented shifts in trade corridors, technological realignment, and demographic transformations, the traditional metrics of national power are being fundamentally redefined.
</p>
<p>
Natural resources and physical geography remain relevant, but the decisive differentiator for long-term civilizational stability has always been human capital. When societies cultivate a culture of academic rigor, ethical mentorship, and civic accountability, they build an enduring shield against socioeconomic instability.
</p>
`,
    category: 'opinion',
    tags: ['Education Legacy', 'Diplomacy'],
    authorId: 'author-1',
    date: '2026-08-24T18:00:00Z',
    modifiedDate: '2026-08-25T09:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'A thoughtful reflection on human capital, ethics, and national resilience.',
    featuredImageAlt: 'Library of scholarly books and reading desk',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 4,
    views: 2980,
    seoTitle: 'Editorial: The Imperative of Educational Capital | Dunya International',
    seoDescription: 'Dunya International editorial analysis on why human capital and intellectual heritage underpin national resilience.',
    schemaType: 'OpinionNewsArticle'
  },
  {
    id: 'post-9',
    title: 'Restoration of Lahore Historic Walled City Enclave Wins Global Heritage Architecture Prize',
    slug: 'lahore-walled-city-heritage-restoration-award',
    excerpt: 'The multi-year conservation of ancient havelis, frescoed gates, and community artisan bazaars recognized by international architectural conservation bodies.',
    content: `
<p class="lead text-lg font-editorial-serif leading-relaxed text-gray-800">
LAHORE — The monumental conservation initiative across the historic Walled City of Lahore has been awarded the prestigious International Heritage Conservation Award.
</p>
<p>
The project, which integrated master artisans with modern seismic stabilization and underground utility modernization, has revitalized centuries-old Mughal and Sikh era architectural landmarks while preserving local community livelihoods.
</p>
`,
    category: 'lifestyle',
    tags: ['Diaspora', 'Pakistan'],
    authorId: 'author-2',
    date: '2026-08-23T12:00:00Z',
    modifiedDate: '2026-08-23T14:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'Restored intricate facade and archways in the heart of old Lahore.',
    featuredImageAlt: 'Historic Mughal architecture facade with intricate tilework',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: false,
    language: 'en',
    readingTimeMinutes: 3,
    views: 1450,
    seoTitle: 'Lahore Walled City Restoration Wins International Architecture Prize | Dunya International',
    seoDescription: 'Historic conservation of Lahore heritage quarters recognized globally for master artisanal restoration.',
    schemaType: 'NewsArticle'
  },
  {
    id: 'post-10',
    title: 'وزیر اعظم کا انفارمیشن ٹیکنالوجی کے شعبے میں نوجوانوں کے لیے خصوصی مراعات کا اعلان',
    slug: 'pm-announces-youth-it-initiatives-urdu',
    excerpt: 'ملک بھر میں جدید سافٹ ویئر ٹیکنالوجی پارکس اور فری لانسرز کے لیے بلاسود مالیاتی سہولیات کا تفصیلی منصوبہ جاری۔',
    content: `
<div class="font-urdu text-xl leading-loose text-slate-800 text-right" dir="rtl">
<p class="lead font-bold text-2xl mb-6 text-slate-900">
اسلام آباد — حکومت نے ملکی برآمدات میں تیزی لانے اور نوجوانوں کو جدید ڈیجیٹل معیشت سے ہم آہنگ کرنے کے لیے ایک جامع آئی ٹی پیکج کا باقاعدہ افتتاح کر دیا ہے۔
</p>
<p>
اس منصوبے کے تحت ملک کے پسماندہ اضلاع میں بھی ہائی اسپیڈ انٹرنیٹ کوریڈورز اور جدید ٹریننگ سینٹرز قائم کیے جائیں گے تاکہ بین الاقوامی مارکیٹ میں پاکستانی سافٹ ویئر انجینئرز کی رسائی آسان بنائی جا سکے۔
</p>
</div>
`,
    category: 'urdu',
    tags: ['Economic Reforms', 'Artificial Intelligence'],
    authorId: 'author-5',
    date: '2026-08-27T17:00:00Z',
    modifiedDate: '2026-08-27T17:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    featuredImageCaption: 'ڈیجیٹل پاکستان اور فری لانسنگ معیشت کے فروغ کا نیا منصوبہ۔',
    featuredImageAlt: 'Tech students in classroom',
    status: 'publish',
    isHeroFeatured: false,
    isBreaking: true,
    language: 'ur',
    readingTimeMinutes: 3,
    views: 2450,
    seoTitle: 'آئی ٹی شعبے کے لیے خصوصی مراعات کا اعلان — دنیا انٹرنیشنل',
    seoDescription: 'حکومت کی جانب سے فری لانسرز اور سافٹ ویئر ایکسپورٹس کے لیے اہم سہولیات۔',
    schemaType: 'NewsArticle'
  }
];

export const INITIAL_PAGES: WPPage[] = [
  {
    id: 'page-about',
    title: 'About Us',
    slug: 'about-us',
    excerpt: 'Discover Dunya International: our journalistic mission, editorial values, history, and worldwide coverage.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-6">Who We Are</h2>
<p class="text-lg leading-relaxed mb-6">
<strong>DUNYA INTERNATIONAL</strong> (dunyaint.com) is an independent, dynamic international news organization committed to delivering authoritative, timely, and impartial journalism. From geopolitical analysis and economic transformations to inspiring cultural narratives and human interest stories, we bridge local insights with global relevance.
</p>

<h2 class="text-2xl font-editorial-display font-bold text-slate-900 mt-10 mb-4">Our Mission</h2>
<p class="leading-relaxed mb-4">
Our mission is to empower global citizens with verifiable facts, nuanced perspectives, and thoughtful analysis. In a world inundated with noise and hyper-polarization, Dunya International stands firm on the pillars of rigorous verification, editorial independence, and journalistic integrity.
</p>

<h2 class="text-2xl font-editorial-display font-bold text-slate-900 mt-10 mb-4">Our Vision & Core Principles</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
  <div class="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <h3 class="text-lg font-bold text-[#002B49] mb-2 font-editorial-sans">1. Uncompromising Accuracy</h3>
    <p class="text-sm text-slate-600">Every report undergoes multi-layered fact-checking before publication. We verify primary sources and confirm documentation.</p>
  </div>
  <div class="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <h3 class="text-lg font-bold text-[#002B49] mb-2 font-editorial-sans">2. Editorial Independence</h3>
    <p class="text-sm text-slate-600">Our editorial desk functions free from political alignments, commercial pressures, or partisan affiliations.</p>
  </div>
  <div class="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <h3 class="text-lg font-bold text-[#002B49] mb-2 font-editorial-sans">3. Global & Diaspora Reach</h3>
    <p class="text-sm text-slate-600">Deep coverage across South Asia, North America, the United Kingdom, Europe, and the Middle East in both English and Urdu.</p>
  </div>
  <div class="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <h3 class="text-lg font-bold text-[#002B49] mb-2 font-editorial-sans">4. Public Service & Learning</h3>
    <p class="text-sm text-slate-600">Highlighting stories that champion educational empowerment, ethical mentorship, and social progress.</p>
  </div>
</div>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-editorial-policy',
    title: 'Editorial Policy',
    slug: 'editorial-policy',
    excerpt: 'Our comprehensive guidelines on accuracy, verification, sources, corrections, transparency, and AI-assisted tools.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-6">Dunya International Editorial Guidelines</h2>
<p class="text-lg leading-relaxed mb-6">
This Editorial Policy governs all content published on Dunya International platforms, including web, mobile applications, social media channels, and multimedia productions.
</p>

<h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">1. Fact-Checking & Source Verification</h3>
<p>
We require journalists and contributors to verify all claims through verifiable primary documentation or minimum two independent credible sources. Anonymous sources are strictly reserved for situations involving whistleblowers where personal safety or severe retribution is at stake, and must be cleared by a senior editor.
</p>

<h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">2. Corrections and Updates Policy</h3>
<p>
When an error of fact occurs, Dunya International promptly corrects the story with clear transparency. A prominent correction note is appended to the bottom or top of the article detailing the date, nature of the revision, and exact factual amendment made.
</p>

<h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">3. Conflicts of Interest & Commercial Separation</h3>
<p>
Editorial decisions are kept strictly isolated from advertising, sponsorship, and commercial partnerships. Sponsored content or brand partnerships are always explicitly labeled with prominent tags such as "Sponsored Feature" or "Advertisement".
</p>

<h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">4. Artificial Intelligence & Assisted Tools</h3>
<p>
Dunya International strictly forbids the unverified automated publication of AI-generated reporting. Any computational data analysis or transcription assistance must be supervised, verified, and signed off by human editorial staff.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    slug: 'contact-us',
    excerpt: 'Reach out to the Dunya International newsroom, editorial desk, press inquiries, and advertising team.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Connect With Our Global Newsroom</h2>
<p class="text-lg leading-relaxed mb-8">
We welcome news tips, press releases, opinion submissions, feedback, and advertising inquiries from readers and organizations worldwide.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    excerpt: 'How Dunya International collects, uses, and safeguards user data and cookies.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Privacy Policy</h2>
<p class="mb-4">Last Updated: August 2026</p>
<p class="mb-4">
At Dunya International (dunyaint.com), we respect the privacy of our readers. This Privacy Policy outlines the types of information we collect, how it is utilized, and your rights regarding your personal information.
</p>
<h3 class="text-xl font-bold mt-6 mb-3">Data Collection & Cookies</h3>
<p class="mb-4">
We use standard industry web analytics cookies to measure readership trends, aggregate page performance, and deliver non-intrusive relevant advertising. We never sell your personal contact information to third parties.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    excerpt: 'Terms of service and legal agreement for accessing Dunya International content and services.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Terms and Conditions of Use</h2>
<p class="mb-4">
By accessing and reading Dunya International (dunyaint.com), you agree to comply with and be bound by the following terms and conditions of use.
</p>
<h3 class="text-xl font-bold mt-6 mb-3">Copyright & Content Syndication</h3>
<p class="mb-4">
All text, original photographs, infographics, and layout elements published on Dunya International are protected by international copyright laws. Reproduction without prior written authorization is prohibited.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-disclaimer',
    title: 'Disclaimer',
    slug: 'disclaimer',
    excerpt: 'Legal disclaimers regarding general news reporting, opinion columns, and external web links.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Legal Disclaimer</h2>
<p class="mb-4">
The views and opinions expressed in the Opinion and Editorial columns are those of the individual authors and do not necessarily reflect the official editorial stance of Dunya International.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-team',
    title: 'Our Team',
    slug: 'our-team',
    excerpt: 'Meet the journalists, editors, contributors, and technical team behind Dunya International.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">The Editorial & Bureau Leadership</h2>
<p class="mb-6">
Dunya International brings together experienced journalists, foreign correspondents, academic contributors, and multimedia editors based in Islamabad, Lahore, Karachi, London, New York, and Washington D.C.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-advertise',
    title: 'Advertise with Us',
    slug: 'advertise',
    excerpt: 'Reach a high-impact global audience across North America, the UK, Europe, and South Asia.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Partner with Dunya International</h2>
<p class="mb-4">
Dunya International offers premium brand visibility across digital desktop, mobile, video, and newsletter channels, connecting your brand with an influential readership of decision-makers, professionals, and the global diaspora.
</p>
<p class="font-bold text-slate-900">Contact our advertising team: ads@dunyaint.com</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  },
  {
    id: 'page-support',
    title: 'Support & Help Desk',
    slug: 'support',
    excerpt: 'Reader assistance, newsletter subscription help, and technical support.',
    content: `
<div class="prose max-w-none font-editorial-serif text-slate-800">
<h2 class="text-3xl font-editorial-display font-bold text-slate-900 mb-4">Reader Support & FAQ</h2>
<p class="mb-4">
Need help with newsletter deliveries, reporting a broken link, or submitting a technical correction? Reach out to support@dunyaint.com.
</p>
</div>
`,
    status: 'publish',
    modifiedDate: '2026-08-28T12:00:00Z'
  }
];

export const INITIAL_SETTINGS: WPSettings = {
  siteTitle: 'DUNYA INTERNATIONAL',
  tagline: 'Global News, Editorial Analysis & Breaking Updates',
  siteUrl: 'https://dunyaint.com',
  logoUrl: '',
  faviconUrl: '',
  breakingNewsActive: true,
  breakingNewsCustomText: 'BREAKING: Federal Cabinet ratifies comprehensive energy tariff reforms | Global Climate Accord reaches loss & damage disbursal consensus | KSE-100 touches historic highs',
  tickerSpeed: 8,
  adsEnabled: true,
  adSlots: [
    {
      id: 'ad-header',
      location: 'header',
      title: 'Top Leaderboard Banner',
      imageUrl: '',
      targetUrl: 'https://dunyaint.com/advertise',
      codeSnippet: '<!-- Google AdSense / Sponsor 728x90 -->',
      isActive: true
    },
    {
      id: 'ad-sidebar',
      location: 'sidebar',
      title: 'Sidebar Medium Rectangle',
      imageUrl: '',
      targetUrl: 'https://dunyaint.com/advertise',
      codeSnippet: '<!-- Google AdSense 300x250 -->',
      isActive: true
    },
    {
      id: 'ad-article-mid',
      location: 'article_mid',
      title: 'In-Article Responsive Slot',
      imageUrl: '',
      targetUrl: 'https://dunyaint.com/advertise',
      codeSnippet: '<!-- In-Article Ad Unit -->',
      isActive: true
    }
  ],
  socialLinks: {
    facebook: 'https://facebook.com/dunyaint',
    twitter: 'https://twitter.com/dunyaint',
    youtube: 'https://youtube.com/@dunyaint',
    instagram: 'https://instagram.com/dunyaint',
    whatsapp: 'https://whatsapp.com/channel/dunyaint',
    linkedin: 'https://linkedin.com/company/dunyaint'
  },
  urduEnabled: true,
  copyrightText: '© 2026 DUNYA INTERNATIONAL. All Rights Reserved. Powered by Dunya WordPress Publishing Engine.',
  contactEmail: 'editor@dunyaint.com',
  contactPhone: '+1 (212) 555-0199 / +92 51 5550199',
  officeAddress: 'Dunya International News Bureau: New York • London • Islamabad',
  primaryColor: '#002B49',
  themeMode: 'light'
};

export const INITIAL_REDIRECTS: WPRedirect[] = [
  {
    id: 'redir-1',
    oldUrl: '/three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy.html',
    newUrl: '/three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy/',
    statusCode: 301,
    hits: 428
  },
  {
    id: 'redir-2',
    oldUrl: '/post/legacy-gholam-mustafa',
    newUrl: '/three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy/',
    statusCode: 301,
    hits: 195
  },
  {
    id: 'redir-3',
    oldUrl: '/index.php/pakistan-economic-reforms',
    newUrl: '/pakistan-announces-new-economic-reforms/',
    statusCode: 301,
    hits: 112
  }
];

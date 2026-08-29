/**
 * Editor Sanitizer & Paste Cleaner for Dunya International WYSIWYG Editor
 * Cleans pasted content from MS Word, Google Docs, WhatsApp, and Web pages
 * while preserving semantic markup (paragraphs, headings, bold, italic, lists, quotes, links, images).
 */

export function cleanPastedHtml(html: string): string {
  if (!html) return '';

  let clean = html;

  // 1. Remove XML/HTML comments & Office namespaces
  clean = clean.replace(/<!--[\s\S]*?-->/gi, '');
  clean = clean.replace(/<xml[\s\S]*?<\/xml>/gi, '');
  clean = clean.replace(/<o:p[\s\S]*?<\/o:p>/gi, '');
  clean = clean.replace(/<\/?o:[^>]*>/gi, '');
  clean = clean.replace(/<\/?w:[^>]*>/gi, '');
  clean = clean.replace(/<\/?m:[^>]*>/gi, '');
  clean = clean.replace(/<\/?v:[^>]*>/gi, '');

  // 2. Remove script and style tags completely
  clean = clean.replace(/<style[\s\S]*?<\/style>/gi, '');
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<link[\s\S]*?>/gi, '');
  clean = clean.replace(/<meta[\s\S]*?>/gi, '');

  // 3. Convert Word Headings
  clean = clean.replace(/<p[^>]*class=["']?MsoHeading1["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h2>$1</h2>');
  clean = clean.replace(/<p[^>]*class=["']?MsoHeading2["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h3>$1</h3>');
  clean = clean.replace(/<p[^>]*class=["']?MsoHeading3["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h4>$1</h4>');

  // 4. Remove all class attributes except custom ones we support (e.g., figure / align)
  clean = clean.replace(/\sclass=(["'])(?!wp-|align|image|responsive-video)[^"']*\1/gi, '');

  // 5. Remove unwanted inline styles (mso-*, font-family, font-size, color, background-color, line-height)
  // while keeping text alignment if present
  clean = clean.replace(/\sstyle=(["'])(.*?)\1/gi, (_match, _quote, styleContent: string) => {
    const keptStyles: string[] = [];
    const alignMatch = styleContent.match(/text-align:\s*(left|right|center|justify)/i);
    if (alignMatch) {
      keptStyles.push(`text-align: ${alignMatch[1]}`);
    }
    const dirMatch = styleContent.match(/direction:\s*(rtl|ltr)/i);
    if (dirMatch) {
      keptStyles.push(`direction: ${dirMatch[1]}`);
    }
    return keptStyles.length > 0 ? ` style="${keptStyles.join('; ')}"` : '';
  });

  // 6. Remove tracking data attributes (data-*, id=*, lang=*)
  clean = clean.replace(/\sdata-[a-zA-Z0-9_-]+=(["'])[\s\S]*?\1/gi, '');
  clean = clean.replace(/\slang=(["'])[\s\S]*?\1/gi, '');

  // 7. Strip empty span tags and flatten them
  clean = clean.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');
  clean = clean.replace(/<span\s+style=["']\s*["']>([\s\S]*?)<\/span>/gi, '$1');

  // 8. Remove non-breaking spaces if repeated or trailing
  clean = clean.replace(/&nbsp;&nbsp;+/gi, ' ');

  // 9. Remove empty paragraphs and empty tags
  clean = clean.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '');
  clean = clean.replace(/<h[1-6]>\s*(?:&nbsp;|\s)*<\/h[1-6]>/gi, '');
  clean = clean.replace(/<div>\s*<\/div>/gi, '');

  return clean.trim();
}

/**
 * Converts raw plain text (e.g. from WhatsApp, Notepad, clipboard) into clean HTML paragraphs
 */
export function plainTextToHtml(text: string): string {
  if (!text) return '';

  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map(p => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '';

  return paragraphs
    .map(p => {
      const withLineBreaks = p.replace(/\r?\n/g, '<br />');
      return `<p>${withLineBreaks}</p>`;
    })
    .join('\n');
}

/**
 * Extracts YouTube video ID from any YouTube URL format
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Generates responsive YouTube embed HTML
 */
export function createYouTubeEmbedHtml(videoId: string, title: string = 'YouTube Video'): string {
  return `<div class="responsive-video my-6 rounded-lg overflow-hidden border border-slate-300 aspect-[16/9] w-full max-w-3xl mx-auto shadow-sm">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}?rel=0" 
    title="${title}" 
    class="w-full h-full border-0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</div>`;
}

/**
 * Generates structured responsive Figure & Caption image HTML
 */
export function createImageFigureHtml(options: {
  src: string;
  alt?: string;
  caption?: string;
  alignment?: 'center' | 'left' | 'right' | 'full';
}): string {
  const { src, alt = 'News Image', caption = '', alignment = 'center' } = options;

  let alignClasses = 'my-6 mx-auto max-w-3xl';
  let imgClasses = 'w-full h-auto rounded-lg shadow-xs';

  if (alignment === 'left') {
    alignClasses = 'my-4 md:float-left md:mr-6 max-w-sm clear-both';
  } else if (alignment === 'right') {
    alignClasses = 'my-4 md:float-right md:ml-6 max-w-sm clear-both';
  } else if (alignment === 'full') {
    alignClasses = 'my-8 w-full max-w-none';
  }

  const captionHtml = caption.trim() 
    ? `<figcaption class="text-xs text-slate-500 dark:text-slate-400 mt-2 italic text-center font-sans">${caption}</figcaption>`
    : '';

  return `<figure class="${alignClasses}">
  <img src="${src}" alt="${alt}" class="${imgClasses}" loading="lazy" referrerPolicy="no-referrer" />
  ${captionHtml}
</figure>`;
}

/**
 * Counts words accurately across English and Urdu unicode characters
 */
export function calculateWordCount(textOrHtml: string): number {
  if (!textOrHtml) return 0;
  // Strip html tags
  const clean = textOrHtml.replace(/<[^>]*>/g, ' ').trim();
  if (!clean) return 0;
  // Match word tokens (Urdu, English, alphanumeric)
  const words = clean.match(/[\p{L}\p{N}]+/gu);
  return words ? words.length : 0;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(textOrHtml: string): number {
  const words = calculateWordCount(textOrHtml);
  return Math.max(1, Math.ceil(words / 180));
}

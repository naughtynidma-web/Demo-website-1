import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3, Heading4, Pilcrow,
  List, ListOrdered, Quote, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Unlink, Image as ImageIcon, Video, 
  Minus, Undo, Redo, RemoveFormatting, Code, Eye, 
  Upload, Check, X, Film, FolderOpen, RefreshCw,
  Sparkles, AlignHorizontalJustifyCenter, AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd
} from 'lucide-react';
import { cleanPastedHtml, plainTextToHtml, extractYouTubeId, createYouTubeEmbedHtml, createImageFigureHtml, calculateWordCount, estimateReadingTime } from '../utils/editorSanitizer';
import { MEDIA_LIBRARY_ASSETS, MediaAsset } from '../data/mediaLibrary';

interface VisualArticleEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  language?: 'en' | 'ur';
  onLanguageChange?: (lang: 'en' | 'ur') => void;
  placeholder?: string;
  postId?: string | null;
  onAutoSaveStatus?: (timestamp: string) => void;
}

export const VisualArticleEditor: React.FC<VisualArticleEditorProps> = ({
  value,
  onChange,
  language = 'en',
  onLanguageChange,
  placeholder,
  postId = 'new',
  onAutoSaveStatus
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [activeFormats, setActiveFormats] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    heading: string;
    list: 'ul' | 'ol' | null;
    quote: boolean;
    align: 'left' | 'center' | 'right' | 'justify';
  }>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    heading: 'p',
    list: null,
    quote: false,
    align: language === 'ur' ? 'right' : 'left'
  });

  // Local direction override (or synchronized with language)
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(language === 'ur' ? 'rtl' : 'ltr');

  // Modals state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const savedSelectionRef = useRef<Range | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalTab, setImageModalTab] = useState<'library' | 'upload'>('library');
  const [selectedLibraryImage, setSelectedLibraryImage] = useState<MediaAsset | null>(MEDIA_LIBRARY_ASSETS[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState(language === 'ur' ? 'تصویر: DUNYA INTERNATIONAL' : 'Photo: DUNYA INTERNATIONAL');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState<'center' | 'left' | 'right' | 'full'>('center');

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // Auto-save state
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Sync language with direction
  useEffect(() => {
    setDirection(language === 'ur' ? 'rtl' : 'ltr');
    if (language === 'ur' && imageCaption === 'Photo: DUNYA INTERNATIONAL') {
      setImageCaption('تصویر: DUNYA INTERNATIONAL');
    }
  }, [language]);

  // Initial Content load into ContentEditable
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!value) {
        editorRef.current.innerHTML = '<p><br></p>';
      } else {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Auto-save periodic timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (value && value.trim()) {
        try {
          setIsAutoSaving(true);
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          localStorage.setItem(`dunya_draft_autosave_${postId || 'current'}`, JSON.stringify({
            content: value,
            savedAt: timeStr,
            language
          }));
          setLastSavedTime(timeStr);
          if (onAutoSaveStatus) onAutoSaveStatus(timeStr);
          setTimeout(() => setIsAutoSaving(false), 800);
        } catch {
          setIsAutoSaving(false);
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [value, postId, language, onAutoSaveStatus]);

  // Save current selection range before opening modal
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Update Toolbar formatting state based on cursor position
  const updateToolbarState = useCallback(() => {
    if (!editorRef.current) return;

    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isUnderline = document.queryCommandState('underline');
    const isStrike = document.queryCommandState('strikeThrough');
    const isUl = document.queryCommandState('insertUnorderedList');
    const isOl = document.queryCommandState('insertOrderedList');

    const sel = window.getSelection();
    let currentHeading = 'p';
    let isQuote = false;
    let align: 'left' | 'center' | 'right' | 'justify' = direction === 'rtl' ? 'right' : 'left';

    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tag = el.tagName.toLowerCase();
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            currentHeading = tag;
          }
          if (tag === 'blockquote') {
            isQuote = true;
          }
          if (el.style.textAlign) {
            align = el.style.textAlign as 'left' | 'center' | 'right' | 'justify';
          }
        }
        node = node.parentNode;
      }
    }

    setActiveFormats({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      strike: isStrike,
      heading: currentHeading,
      list: isUl ? 'ul' : isOl ? 'ol' : null,
      quote: isQuote,
      align
    });
  }, [direction]);

  // Execute formatting command on contenteditable
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode === 'code') return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
    updateToolbarState();
  };

  // Handle Block format change (Paragraph, Heading 1, Heading 2, Heading 3, Heading 4, Blockquote)
  const handleBlockFormatChange = (format: string) => {
    if (editorMode === 'code') return;
    editorRef.current?.focus();

    if (format === 'blockquote') {
      executeCommand('formatBlock', '<blockquote>');
    } else if (format.startsWith('h')) {
      executeCommand('formatBlock', `<${format}>`);
    } else {
      executeCommand('formatBlock', '<p>');
    }
  };

  // Sync content updates
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If empty or only br, normalize
      const cleanHtml = html === '<p><br></p>' || html === '<br>' || html === '' ? '' : html;
      onChange(cleanHtml);
      updateToolbarState();
    }
  };

  // Robust Smart Paste Sanitizer
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const pastedHtml = clipboardData.getData('text/html');
    const pastedText = clipboardData.getData('text/plain');

    let cleanContent = '';

    if (pastedHtml && pastedHtml.trim()) {
      // Clean HTML from MS Word / Google Docs / Web
      cleanContent = cleanPastedHtml(pastedHtml);
    } else if (pastedText && pastedText.trim()) {
      // Plain text (e.g. Urdu text from WhatsApp, Word, Notepad)
      cleanContent = plainTextToHtml(pastedText);
    }

    if (!cleanContent) return;

    // Insert clean content into current cursor position
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanContent;

      const frag = document.createDocumentFragment();
      let node: Node | null;
      let lastNode: Node | null = null;
      while ((node = tempDiv.firstChild)) {
        lastNode = frag.appendChild(node);
      }

      range.insertNode(frag);

      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      // Fallback
      document.execCommand('insertHTML', false, cleanContent);
    }

    handleEditorInput();
  };

  // Link Insertion
  const handleOpenLinkModal = () => {
    saveCurrentSelection();
    const sel = window.getSelection();
    setLinkText(sel ? sel.toString() : '');
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    editorRef.current?.focus();

    let targetUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('/') && !targetUrl.startsWith('#')) {
      targetUrl = `https://${targetUrl}`;
    }

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      document.execCommand('createLink', false, targetUrl);
    } else if (linkText.trim()) {
      const linkHtml = `<a href="${targetUrl}" ${linkNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-[#003366] hover:underline font-semibold">${linkText.trim()}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, targetUrl);
    }

    setShowLinkModal(false);
    handleEditorInput();
  };

  const handleRemoveLink = () => {
    executeCommand('unlink');
  };

  // Image Insertion Modal
  const handleOpenImageModal = () => {
    saveCurrentSelection();
    setImageModalTab('library');
    setShowImageModal(true);
  };

  const handleConfirmImage = () => {
    const finalUrl = imageModalTab === 'library' 
      ? selectedLibraryImage?.url || '' 
      : customImageUrl.trim();

    if (!finalUrl) {
      alert('Please select or enter an image URL.');
      return;
    }

    restoreSelection();
    editorRef.current?.focus();

    const figureHtml = createImageFigureHtml({
      src: finalUrl,
      alt: imageAlt.trim() || selectedLibraryImage?.altText || 'Dunya International News Photo',
      caption: imageCaption.trim() || selectedLibraryImage?.caption || '',
      alignment: imageAlignment
    });

    document.execCommand('insertHTML', false, `${figureHtml}<p><br></p>`);
    setShowImageModal(false);
    handleEditorInput();
  };

  // Handle local image file upload into Base64 / Media item
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      setCustomImageUrl(base64Url);
      setImageModalTab('upload');
      if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  // Video / YouTube Insertion
  const handleOpenVideoModal = () => {
    saveCurrentSelection();
    setVideoUrl('');
    setVideoTitle('');
    setShowVideoModal(true);
  };

  const handleConfirmVideo = () => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) {
      alert('Please provide a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
      return;
    }

    restoreSelection();
    editorRef.current?.focus();

    const videoHtml = createYouTubeEmbedHtml(videoId, videoTitle || 'Dunya International Video Report');
    document.execCommand('insertHTML', false, `${videoHtml}<p><br></p>`);
    setShowVideoModal(false);
    handleEditorInput();
  };

  // Toggle Direction (RTL / LTR)
  const toggleDirection = (newDir: 'rtl' | 'ltr') => {
    setDirection(newDir);
    if (onLanguageChange) {
      onLanguageChange(newDir === 'rtl' ? 'ur' : 'en');
    }
  };

  // Word & Character count calculation
  const wordCount = calculateWordCount(value || '');
  const charCount = (value || '').replace(/<[^>]*>/g, '').length;
  const readTime = estimateReadingTime(value || '');

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col select-none">
      
      {/* 1. TOP WORDPRESS-STYLE VISUAL TOOLBAR */}
      <div className="bg-[#F0F0F1] border-b border-gray-300 p-1.5 flex flex-wrap items-center gap-1 text-slate-700 text-xs">
        
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-r border-gray-300 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            title="Undo (Ctrl+Z)"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            title="Redo (Ctrl+Y)"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Headings & Block Dropdown */}
        <div className="border-r border-gray-300 pr-1.5 mr-0.5">
          <select
            value={activeFormats.heading !== 'p' ? activeFormats.heading : activeFormats.quote ? 'blockquote' : 'p'}
            onChange={(e) => handleBlockFormatChange(e.target.value)}
            className="bg-white border border-gray-300 text-slate-800 text-xs rounded px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#2271B1]"
            title="Format paragraph or heading"
          >
            <option value="p">Paragraph (Normal Text)</option>
            <option value="h1">Heading 1 (H1 - Main Title)</option>
            <option value="h2">Heading 2 (H2 - Major Section)</option>
            <option value="h3">Heading 3 (H3 - Sub Heading)</option>
            <option value="h4">Heading 4 (H4 - Minor Heading)</option>
            <option value="blockquote">Blockquote (Editorial Quote)</option>
          </select>
        </div>

        {/* Inline Formatting (Bold, Italic, Underline, Strike) */}
        <div className="flex items-center space-x-0.5 border-r border-gray-300 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold (Ctrl+B)"
            className={`p-1.5 rounded transition ${activeFormats.bold ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic (Ctrl+I)"
            className={`p-1.5 rounded transition ${activeFormats.italic ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline (Ctrl+U)"
            className={`p-1.5 rounded transition ${activeFormats.underline ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            title="Strikethrough"
            className={`p-1.5 rounded transition ${activeFormats.strike ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="Clear Formatting"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center space-x-0.5 border-r border-gray-300 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet List"
            className={`p-1.5 rounded transition ${activeFormats.list === 'ul' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            className={`p-1.5 rounded transition ${activeFormats.list === 'ol' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleBlockFormatChange(activeFormats.quote ? 'p' : 'blockquote')}
            title="Blockquote"
            className={`p-1.5 rounded transition ${activeFormats.quote ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignments */}
        <div className="flex items-center space-x-0.5 border-r border-gray-300 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            title="Align Left"
            className={`p-1.5 rounded transition ${activeFormats.align === 'left' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            title="Align Center"
            className={`p-1.5 rounded transition ${activeFormats.align === 'center' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            title="Align Right"
            className={`p-1.5 rounded transition ${activeFormats.align === 'right' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            title="Justify"
            className={`p-1.5 rounded transition ${activeFormats.align === 'justify' ? 'bg-[#2271B1] text-white' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Urdu RTL / English LTR Directional Switch */}
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-1.5 mr-0.5 bg-slate-200/80 p-0.5 rounded">
          <button
            type="button"
            onClick={() => toggleDirection('rtl')}
            className={`px-2 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
              direction === 'rtl' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
            title="Switch to Urdu RTL (Right-to-Left)"
          >
            <span className="font-urdu text-[11px] leading-none">اردو</span>
            <span>RTL</span>
          </button>
          <button
            type="button"
            onClick={() => toggleDirection('ltr')}
            className={`px-2 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
              direction === 'ltr' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
            title="Switch to English LTR (Left-to-Right)"
          >
            <span>EN</span>
            <span>LTR</span>
          </button>
        </div>

        {/* Links & Media Inserts */}
        <div className="flex items-center space-x-0.5 border-r border-gray-300 pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={handleOpenLinkModal}
            title="Insert / Edit Link"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-blue-600 transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRemoveLink}
            title="Remove Link"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-red-600 transition"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenImageModal}
            className="bg-[#2271B1] hover:bg-[#135E96] text-white px-2.5 py-1 rounded flex items-center space-x-1 text-xs font-bold shadow-xs transition"
            title="Insert News Image / Media Library"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Add Media</span>
          </button>
          <button
            type="button"
            onClick={handleOpenVideoModal}
            className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center space-x-1 text-xs font-bold shadow-xs transition"
            title="Embed YouTube Video"
          >
            <Film className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube</span>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            title="Insert Horizontal Divider Line"
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Visual vs Code View Tabs */}
        <div className="ml-auto flex items-center space-x-1 bg-slate-200 p-0.5 rounded text-xs">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`px-3 py-1 rounded font-bold transition flex items-center space-x-1 ${
              editorMode === 'visual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('code')}
            className={`px-3 py-1 rounded font-bold transition flex items-center space-x-1 ${
              editorMode === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-600" />
            <span>Text / HTML</span>
          </button>
        </div>

      </div>

      {/* 2. EDITABLE CANVAS OR CODE VIEW */}
      <div className="relative min-h-[360px] bg-white flex-1 flex flex-col">
        
        {editorMode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir={direction}
            onInput={handleEditorInput}
            onKeyUp={updateToolbarState}
            onMouseUp={updateToolbarState}
            onPaste={handlePaste}
            data-placeholder={placeholder || (direction === 'rtl' ? 'یہاں خبر کا تفصیلی متن لکھیں یا دوسری جگہ سے کاپی کرکے بغیر کسی رکاوٹ کے پیسٹ کریں...' : 'Type or paste your article text here visually...')}
            className={`flex-1 p-5 focus:outline-none overflow-y-auto leading-relaxed text-slate-900 ${
              direction === 'rtl' 
                ? 'font-urdu text-lg text-right leading-[2.4]' 
                : 'font-editorial-serif text-base text-left leading-relaxed'
            } visual-editor-content`}
            style={{
              minHeight: '360px',
              maxHeight: '600px'
            }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 focus:outline-none resize-y"
            rows={16}
            placeholder="Edit raw sanitized HTML markup..."
          />
        )}

      </div>

      {/* 3. BOTTOM STATS & AUTO-SAVE FOOTER */}
      <div className="bg-[#F8F9FA] border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-4 flex-wrap">
          <span className="font-semibold text-slate-700">
            <strong>{wordCount.toLocaleString()}</strong> words
          </span>
          <span>&bull;</span>
          <span>{charCount.toLocaleString()} characters</span>
          <span>&bull;</span>
          <span>~{readTime} min read</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline text-emerald-700 font-medium">
            Mode: {direction === 'rtl' ? 'اردو (Urdu RTL)' : 'English (LTR)'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          {isAutoSaving ? (
            <span className="flex items-center space-x-1 text-blue-600 font-semibold animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Auto-saving draft...</span>
            </span>
          ) : lastSavedTime ? (
            <span className="flex items-center space-x-1 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Draft auto-saved at {lastSavedTime}</span>
            </span>
          ) : (
            <span className="text-slate-400">Auto-save enabled (every 15s)</span>
          )}
        </div>
      </div>

      {/* --- MODAL 1: INSERT / EDIT LINK --- */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-gray-300 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-[#2271B1]" />
                <span>Insert / Edit Hyperlink</span>
              </h3>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination URL *</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/report"
                  className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#2271B1]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anchor Text (Optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here for full report"
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded text-[#2271B1]"
                />
                <span className="font-semibold text-slate-700">Open link in a new browser tab (`target="_blank"`)</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-slate-700 hover:bg-gray-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                className="px-4 py-1.5 bg-[#2271B1] hover:bg-[#135E96] text-white rounded text-xs font-bold shadow-xs"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INSERT IMAGE / MEDIA LIBRARY --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-5 border border-gray-300 text-slate-900 space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-[#2271B1]" />
                <h3 className="font-bold text-sm text-slate-800">Add Media to Article Body</h3>
              </div>
              <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab navigation: Media Library vs Upload / URL */}
            <div className="flex items-center space-x-2 border-b shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setImageModalTab('library')}
                className={`px-4 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 ${
                  imageModalTab === 'library' ? 'border-[#2271B1] text-[#2271B1]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Media Library ({MEDIA_LIBRARY_ASSETS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab('upload')}
                className={`px-4 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 ${
                  imageModalTab === 'upload' ? 'border-[#2271B1] text-[#2271B1]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload / Custom URL</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              
              {imageModalTab === 'library' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MEDIA_LIBRARY_ASSETS.map((asset) => {
                    const isSelected = selectedLibraryImage?.id === asset.id;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          setSelectedLibraryImage(asset);
                          if (!imageAlt) setImageAlt(asset.altText);
                          if (!imageCaption || imageCaption === 'Photo: DUNYA INTERNATIONAL') {
                            setImageCaption(asset.caption);
                          }
                        }}
                        className={`cursor-pointer rounded-lg border-2 overflow-hidden transition group relative flex flex-col ${
                          isSelected ? 'border-[#2271B1] ring-2 ring-[#2271B1]/30' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="aspect-[4/3] bg-slate-100 relative">
                          <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#2271B1] text-white p-1 rounded-full shadow-xs">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white flex-1">
                          <p className="font-bold text-[11px] text-slate-800 line-clamp-2">{asset.title}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{asset.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-xs">Click or drag image file here to upload</p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WebP (Max 5MB)</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Or Direct Image URL (HTTPS)</label>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full p-2 border border-gray-300 rounded text-xs"
                    />
                  </div>

                  {customImageUrl && (
                    <div className="aspect-[16/9] max-h-48 rounded overflow-hidden border bg-slate-100 mx-auto">
                      <img src={customImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Image Metadata Settings */}
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Photojournalist / Caption</label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="تصویر: دنیا انٹرنیشنل بیورو"
                      className="w-full p-2 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alt Text (Accessibility & SEO)</label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Descriptive image keywords"
                      className="w-full p-2 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image Alignment</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setImageAlignment('center')}
                      className={`px-3 py-1 rounded text-xs font-semibold border flex items-center space-x-1 ${
                        imageAlignment === 'center' ? 'bg-[#2271B1] text-white border-[#2271B1]' : 'bg-white text-slate-700 border-gray-300'
                      }`}
                    >
                      <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                      <span>Center (Default)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageAlignment('left')}
                      className={`px-3 py-1 rounded text-xs font-semibold border flex items-center space-x-1 ${
                        imageAlignment === 'left' ? 'bg-[#2271B1] text-white border-[#2271B1]' : 'bg-white text-slate-700 border-gray-300'
                      }`}
                    >
                      <AlignHorizontalJustifyStart className="w-3.5 h-3.5" />
                      <span>Float Left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageAlignment('right')}
                      className={`px-3 py-1 rounded text-xs font-semibold border flex items-center space-x-1 ${
                        imageAlignment === 'right' ? 'bg-[#2271B1] text-white border-[#2271B1]' : 'bg-white text-slate-700 border-gray-300'
                      }`}
                    >
                      <AlignHorizontalJustifyEnd className="w-3.5 h-3.5" />
                      <span>Float Right</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageAlignment('full')}
                      className={`px-3 py-1 rounded text-xs font-semibold border flex items-center space-x-1 ${
                        imageAlignment === 'full' ? 'bg-[#2271B1] text-white border-[#2271B1]' : 'bg-white text-slate-700 border-gray-300'
                      }`}
                    >
                      <span>Full Width</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t shrink-0">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-slate-700 hover:bg-gray-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImage}
                className="px-5 py-1.5 bg-[#2271B1] hover:bg-[#135E96] text-white rounded text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Insert into Article</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 3: YOUTUBE EMBED --- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-gray-300 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <Film className="w-4 h-4 text-red-600" />
                <span>Embed YouTube Video Report</span>
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">YouTube Video URL *</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#2271B1]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Video Title / Topic</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Special Bureau Video Coverage"
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                />
              </div>

              {extractYouTubeId(videoUrl) && (
                <div className="aspect-[16/9] rounded overflow-hidden border bg-slate-950">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                    title="YouTube Preview"
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-slate-700 hover:bg-gray-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVideo}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs"
              >
                Embed Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import JSZip from 'jszip';
import { WPPost, WPCategory, WPTag, WPAuthor, WPPage, WPSettings } from '../types/wordpress';

export function generateWordPressWXR(
  posts: WPPost[],
  categories: WPCategory[],
  tags: WPTag[],
  authors: WPAuthor[],
  pages: WPPage[],
  settings: WPSettings
): string {
  const pubDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!-- generator="WordPress/6.5.0" created="${new Date().toISOString()}" -->
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>${escapeXml(settings.siteTitle)}</title>
  <link>${escapeXml(settings.siteUrl)}</link>
  <description>${escapeXml(settings.tagline)}</description>
  <pubDate>${pubDate}</pubDate>
  <language>en-US</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>${escapeXml(settings.siteUrl)}</wp:base_site_url>
  <wp:base_blog_url>${escapeXml(settings.siteUrl)}</wp:base_blog_url>

  <!-- Authors -->
  ${authors.map(a => `
  <wp:author>
    <wp:author_id>${escapeXml(a.id)}</wp:author_id>
    <wp:author_login>${escapeXml(a.slug)}</wp:author_login>
    <wp:author_email>${escapeXml(a.email)}</wp:author_email>
    <wp:author_display_name><![CDATA[${a.name}]]></wp:author_display_name>
    <wp:author_first_name><![CDATA[${a.name.split(' ')[0] || ''}]]></wp:author_first_name>
    <wp:author_last_name><![CDATA[${a.name.split(' ').slice(1).join(' ') || ''}]]></wp:author_last_name>
  </wp:author>`).join('\n')}

  <!-- Categories -->
  ${categories.map(c => `
  <wp:category>
    <wp:term_id>${escapeXml(c.id)}</wp:term_id>
    <wp:category_nicename>${escapeXml(c.slug)}</wp:category_nicename>
    <wp:category_parent></wp:category_parent>
    <wp:cat_name><![CDATA[${c.name}]]></wp:cat_name>
    <wp:category_description><![CDATA[${c.description}]]></wp:category_description>
  </wp:category>`).join('\n')}

  <!-- Tags -->
  ${tags.map(t => `
  <wp:tag>
    <wp:term_id>${escapeXml(t.id)}</wp:term_id>
    <wp:tag_slug>${escapeXml(t.slug)}</wp:tag_slug>
    <wp:tag_name><![CDATA[${t.name}]]></wp:tag_name>
  </wp:tag>`).join('\n')}

  <!-- Posts -->
  ${posts.map(p => {
    const author = authors.find(a => a.id === p.authorId) || authors[0];
    const cat = categories.find(c => c.slug === p.category) || categories[0];
    return `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${escapeXml(settings.siteUrl)}/${escapeXml(p.slug)}/</link>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <dc:creator><![CDATA[${author.name}]]></dc:creator>
    <guid isPermaLink="false">${escapeXml(settings.siteUrl)}/?p=${escapeXml(p.id)}</guid>
    <description></description>
    <content:encoded><![CDATA[${p.content}]]></content:encoded>
    <excerpt:encoded><![CDATA[${p.excerpt}]]></excerpt:encoded>
    <wp:post_id>${escapeXml(p.id)}</wp:post_id>
    <wp:post_date><![CDATA[${p.date}]]></wp:post_date>
    <wp:post_date_gmt><![CDATA[${p.date}]]></wp:post_date_gmt>
    <wp:post_modified><![CDATA[${p.modifiedDate}]]></wp:post_modified>
    <wp:post_modified_gmt><![CDATA[${p.modifiedDate}]]></wp:post_modified_gmt>
    <wp:comment_status>open</wp:comment_status>
    <wp:ping_status>open</wp:ping_status>
    <wp:post_name>${escapeXml(p.slug)}</wp:post_name>
    <wp:status>${p.status}</wp:status>
    <wp:post_parent>0</wp:post_parent>
    <wp:menu_order>0</wp:menu_order>
    <wp:post_type>post</wp:post_type>
    <wp:post_password></wp:post_password>
    <wp:is_sticky>0</wp:is_sticky>
    <category domain="category" nicename="${escapeXml(cat.slug)}"><![CDATA[${cat.name}]]></category>
    ${p.tags.map(t => `<category domain="post_tag" nicename="${escapeXml(t.toLowerCase().replace(/\\s+/g, '-'))}"><![CDATA[${t}]]></category>`).join('\n')}
    <wp:postmeta>
      <wp:meta_key>_dunya_is_breaking</wp:meta_key>
      <wp:meta_value><![CDATA[${p.isBreaking ? '1' : '0'}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_dunya_is_hero</wp:meta_key>
      <wp:meta_value><![CDATA[${p.isHeroFeatured ? '1' : '0'}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_dunya_language</wp:meta_key>
      <wp:meta_value><![CDATA[${p.language}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_dunya_featured_image_url</wp:meta_key>
      <wp:meta_value><![CDATA[${p.featuredImage}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_dunya_featured_caption</wp:meta_key>
      <wp:meta_value><![CDATA[${p.featuredImageCaption || ''}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_yoast_wpseo_title</wp:meta_key>
      <wp:meta_value><![CDATA[${p.seoTitle || p.title}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key>_yoast_wpseo_metadesc</wp:meta_key>
      <wp:meta_value><![CDATA[${p.seoDescription || p.excerpt}]]></wp:meta_value>
    </wp:postmeta>
  </item>`;
  }).join('\n')}

  <!-- Pages -->
  ${pages.map(pg => `
  <item>
    <title><![CDATA[${pg.title}]]></title>
    <link>${escapeXml(settings.siteUrl)}/${escapeXml(pg.slug)}/</link>
    <pubDate>${new Date(pg.modifiedDate).toUTCString()}</pubDate>
    <dc:creator><![CDATA[Admin]]></dc:creator>
    <guid isPermaLink="false">${escapeXml(settings.siteUrl)}/?page_id=${escapeXml(pg.id)}</guid>
    <description></description>
    <content:encoded><![CDATA[${pg.content}]]></content:encoded>
    <excerpt:encoded><![CDATA[${pg.excerpt}]]></excerpt:encoded>
    <wp:post_id>${escapeXml(pg.id)}</wp:post_id>
    <wp:post_name>${escapeXml(pg.slug)}</wp:post_name>
    <wp:status>${pg.status}</wp:status>
    <wp:post_type>page</wp:post_type>
  </item>`).join('\n')}

</channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function getWordPressThemeFiles() {
  const styleCss = `/*
Theme Name: DUNYA INTERNATIONAL
Theme URI: https://dunyaint.com
Author: Dunya International Editorial & Engineering
Author URI: https://dunyaint.com/our-team/
Description: Next-Generation BBC/Dawn inspired high-performance editorial WordPress theme for Dunya International. Featuring responsive grid hierarchy, dynamic breaking news ticker, native Gutenberg blocks, customizer API, schema markup, Urdu & English bilingual RTL support, and full technical SEO optimization.
Version: 1.0.0
License: GNU General Public License v2 or later
Text Domain: dunya-international
Tags: news, editorial, blog, grid-layout, custom-menu, featured-images, rtl-language-support, translation-ready
*/

:root {
  --dunya-navy: #002B49;
  --dunya-red: #D32F2F;
  --dunya-gold: #C5A059;
  --dunya-slate: #1E293B;
  --dunya-light-bg: #F8F9FA;
  --dunya-border: #E2E8F0;
  --font-serif: 'Lora', Georgia, serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-urdu: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', Tahoma, serif;
}

body {
  font-family: var(--font-sans);
  background-color: var(--dunya-light-bg);
  color: #1A1A1A;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.dunya-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--dunya-navy);
  margin-top: 0;
}

.editorial-body {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: #2D3748;
}

.rtl, [dir="rtl"] {
  font-family: var(--font-urdu);
  direction: rtl;
  text-align: right;
  line-height: 2.2;
}

.breaking-ticker-bar {
  background: #002B49;
  color: white;
  padding: 8px 0;
  font-size: 0.875rem;
}

.breaking-badge {
  background: #D32F2F;
  color: white;
  font-weight: 700;
  padding: 4px 8px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
`;

  const functionsPhp = `<?php
/**
 * DUNYA INTERNATIONAL Theme Functions & Definitions
 *
 * @package Dunya_International
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function dunya_theme_setup() {
    load_theme_textdomain('dunya-international', get_template_directory() . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('automatic-feed-links');
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 360,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Register Navigation Menus
    register_nav_menus(array(
        'primary-menu'   => __('Primary Header Navigation', 'dunya-international'),
        'top-bar-menu'   => __('Top Bar Secondary Navigation', 'dunya-international'),
        'footer-company' => __('Footer Company Menu', 'dunya-international'),
        'footer-legal'   => __('Footer Legal Menu', 'dunya-international'),
    ));

    // Custom Image Sizes for News Editorial
    add_image_size('dunya-hero-large', 1200, 675, true);
    add_image_size('dunya-card-medium', 600, 375, true);
    add_image_size('dunya-thumbnail-small', 150, 150, true);
}
add_action('after_setup_theme', 'dunya_theme_setup');

// Enqueue Styles & Google Fonts
function dunya_enqueue_scripts() {
    wp_enqueue_style('dunya-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap', array(), null);
    wp_enqueue_style('dunya-main-style', get_stylesheet_uri(), array('dunya-fonts'), '1.0.0');
    wp_enqueue_script('dunya-main-js', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'dunya_enqueue_scripts');

// Register Sidebars & Widget Areas
function dunya_widgets_init() {
    register_sidebar(array(
        'name'          => __('Primary News Sidebar', 'dunya-international'),
        'id'            => 'sidebar-primary',
        'description'   => __('Main right sidebar for single posts and archive pages.', 'dunya-international'),
        'before_widget' => '<section id="%1$s" class="widget %2$s mb-8 pb-6 border-b border-gray-200">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title text-base uppercase font-bold text-[#002B49] border-l-4 border-[#D32F2F] pl-3 mb-4">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'dunya_widgets_init');

// Breaking News & Hero Meta Boxes
function dunya_add_post_meta_boxes() {
    add_meta_box(
        'dunya_post_flags',
        __('Dunya Editorial Flags', 'dunya-international'),
        'dunya_render_post_meta_box',
        'post',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'dunya_add_post_meta_boxes');

function dunya_render_post_meta_box($post) {
    wp_nonce_field('dunya_save_meta', 'dunya_meta_nonce');
    $is_breaking = get_post_meta($post->ID, '_dunya_is_breaking', true);
    $is_hero = get_post_meta($post->ID, '_dunya_is_hero', true);
    $lang = get_post_meta($post->ID, '_dunya_language', true) ?: 'en';
    ?>
    <p>
        <label><input type="checkbox" name="dunya_is_breaking" value="1" <?php checked($is_breaking, '1'); ?> /> <?php _e('Mark as Breaking News', 'dunya-international'); ?></label>
    </p>
    <p>
        <label><input type="checkbox" name="dunya_is_hero" value="1" <?php checked($is_hero, '1'); ?> /> <?php _e('Feature in Homepage Hero', 'dunya-international'); ?></label>
    </p>
    <p>
        <label><?php _e('Language / Direction:', 'dunya-international'); ?></label>
        <select name="dunya_language" style="width:100%;margin-top:4px;">
            <option value="en" <?php selected($lang, 'en'); ?>>English (LTR)</option>
            <option value="ur" <?php selected($lang, 'ur'); ?>>Urdu - اردو (RTL)</option>
        </select>
    </p>
    <?php
}

function dunya_save_post_meta($post_id) {
    if (!isset($_POST['dunya_meta_nonce']) || !wp_verify_nonce($_POST['dunya_meta_nonce'], 'dunya_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $is_breaking = isset($_POST['dunya_is_breaking']) ? '1' : '0';
    $is_hero = isset($_POST['dunya_is_hero']) ? '1' : '0';
    $lang = isset($_POST['dunya_language']) ? sanitize_text_field($_POST['dunya_language']) : 'en';

    update_post_meta($post_id, '_dunya_is_breaking', $is_breaking);
    update_post_meta($post_id, '_dunya_is_hero', $is_hero);
    update_post_meta($post_id, '_dunya_language', $lang);
}
add_action('save_post', 'dunya_save_post_meta');

// Include Helper Modules
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/seo-schema.php';
`;

  const headerPhp = `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-gray-50 text-gray-900 antialiased'); ?>>
<?php wp_body_open(); ?>

<!-- Top Utility Bar -->
<div class="bg-[#002B49] text-white text-xs py-2 border-b border-slate-700">
    <div class="dunya-container flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <span><?php echo date_i18n('l, j F Y'); ?></span>
            <span class="text-slate-400">|</span>
            <span>Edition: <strong>Global / International</strong></span>
        </div>
        <div class="flex items-center space-x-4">
            <a href="<?php echo esc_url(home_url('/category/urdu/')); ?>" class="font-urdu text-amber-400 hover:text-white text-sm">اردو ایڈیشن</a>
            <span class="text-slate-400">|</span>
            <a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="hover:underline">About</a>
            <a href="<?php echo esc_url(home_url('/contact-us/')); ?>" class="hover:underline">Contact</a>
        </div>
    </div>
</div>

<!-- Main Editorial Header -->
<header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="dunya-container py-4 flex items-center justify-between">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-3">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="flex flex-col">
                    <span class="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-[#002B49] leading-tight">DUNYA INTERNATIONAL</span>
                    <span class="text-[10px] tracking-[0.2em] text-[#D32F2F] font-bold uppercase">Truth • Independence • Global Reach</span>
                </a>
            <?php endif; ?>
        </div>

        <!-- Header Ad Slot -->
        <div class="hidden lg:block">
            <div class="w-[728px] h-[90px] bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                <span>ADVERTISEMENT — LEADERBOARD 728x90</span>
            </div>
        </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="bg-[#002B49] text-white border-t border-slate-700">
        <div class="dunya-container flex items-center justify-between overflow-x-auto py-1">
            <div class="flex space-x-6 text-sm font-semibold whitespace-nowrap">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="py-2 hover:text-[#D32F2F]">Home</a>
                <a href="<?php echo esc_url(home_url('/category/pakistan/')); ?>" class="py-2 hover:text-[#D32F2F]">Pakistan</a>
                <a href="<?php echo esc_url(home_url('/category/world/')); ?>" class="py-2 hover:text-[#D32F2F]">World</a>
                <a href="<?php echo esc_url(home_url('/category/politics/')); ?>" class="py-2 hover:text-[#D32F2F]">Politics</a>
                <a href="<?php echo esc_url(home_url('/category/business/')); ?>" class="py-2 hover:text-[#D32F2F]">Business</a>
                <a href="<?php echo esc_url(home_url('/category/sports/')); ?>" class="py-2 hover:text-[#D32F2F]">Sports</a>
                <a href="<?php echo esc_url(home_url('/category/technology/')); ?>" class="py-2 hover:text-[#D32F2F]">Technology</a>
                <a href="<?php echo esc_url(home_url('/category/education/')); ?>" class="py-2 hover:text-[#D32F2F]">Education</a>
                <a href="<?php echo esc_url(home_url('/category/opinion/')); ?>" class="py-2 hover:text-[#D32F2F]">Opinion</a>
                <a href="<?php echo esc_url(home_url('/category/urdu/')); ?>" class="py-2 font-urdu text-amber-400">دنیا اردو</a>
            </div>
        </div>
    </nav>
</header>
`;

  const footerPhp = `<!-- Site Footer -->
<footer class="bg-[#001829] text-slate-300 pt-12 pb-8 border-t-4 border-[#D32F2F] mt-16">
    <div class="dunya-container grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
            <h4 class="font-cinzel text-xl font-bold text-white mb-3">DUNYA INTERNATIONAL</h4>
            <p class="text-xs leading-relaxed text-slate-400 mb-4">
                Authoritative independent news portal providing verified reporting, comprehensive geopolitical analysis, and public service journalism.
            </p>
            <p class="text-xs text-slate-400">Official URL: <strong>https://dunyaint.com</strong></p>
        </div>
        <div>
            <h5 class="text-sm font-bold uppercase text-white tracking-wider mb-4 border-b border-slate-700 pb-2">Editorial Sections</h5>
            <ul class="space-y-2 text-xs">
                <li><a href="<?php echo esc_url(home_url('/category/pakistan/')); ?>" class="hover:text-white">Pakistan National</a></li>
                <li><a href="<?php echo esc_url(home_url('/category/world/')); ?>" class="hover:text-white">World & Diplomacy</a></li>
                <li><a href="<?php echo esc_url(home_url('/category/business/')); ?>" class="hover:text-white">Markets & Business</a></li>
                <li><a href="<?php echo esc_url(home_url('/category/technology/')); ?>" class="hover:text-white">Technology & AI</a></li>
                <li><a href="<?php echo esc_url(home_url('/category/education/')); ?>" class="hover:text-white">Education & Academia</a></li>
                <li><a href="<?php echo esc_url(home_url('/category/sports/')); ?>" class="hover:text-white">Sports & Cricket</a></li>
            </ul>
        </div>
        <div>
            <h5 class="text-sm font-bold uppercase text-white tracking-wider mb-4 border-b border-slate-700 pb-2">Institutional</h5>
            <ul class="space-y-2 text-xs">
                <li><a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="hover:text-white">About Dunya International</a></li>
                <li><a href="<?php echo esc_url(home_url('/editorial-policy/')); ?>" class="hover:text-white">Editorial Guidelines & Ethics</a></li>
                <li><a href="<?php echo esc_url(home_url('/our-team/')); ?>" class="hover:text-white">Our Bureau & Authors</a></li>
                <li><a href="<?php echo esc_url(home_url('/contact-us/')); ?>" class="hover:text-white">Contact & Newsroom Tips</a></li>
                <li><a href="<?php echo esc_url(home_url('/advertise/')); ?>" class="hover:text-white">Advertise With Us</a></li>
            </ul>
        </div>
        <div>
            <h5 class="text-sm font-bold uppercase text-white tracking-wider mb-4 border-b border-slate-700 pb-2">Legal & Compliance</h5>
            <ul class="space-y-2 text-xs">
                <li><a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>" class="hover:text-white">Privacy Policy</a></li>
                <li><a href="<?php echo esc_url(home_url('/terms-conditions/')); ?>" class="hover:text-white">Terms & Conditions</a></li>
                <li><a href="<?php echo esc_url(home_url('/disclaimer/')); ?>" class="hover:text-white">Legal Disclaimer</a></li>
                <li><a href="<?php echo esc_url(home_url('/support/')); ?>" class="hover:text-white">Help & Support</a></li>
            </ul>
        </div>
    </div>
    <div class="dunya-container border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        <p>&copy; <?php echo date('Y'); ?> DUNYA INTERNATIONAL. All rights reserved. Powered by Dynamic WordPress CMS.</p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
`;

  const singlePhp = `<?php
/**
 * Template for displaying all single posts
 *
 * @package Dunya_International
 */
get_header(); ?>

<main class="dunya-container py-8">
    <?php while (have_posts()) : the_post();
        $is_urdu = get_post_meta(get_the_ID(), '_dunya_language', true) === 'ur';
        $categories = get_the_category();
        $author_id = get_the_author_meta('ID');
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('grid grid-cols-1 lg:grid-cols-12 gap-8'); ?>>
        
        <!-- Main Article Column -->
        <div class="lg:col-span-8 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
            
            <!-- Breadcrumbs -->
            <div class="text-xs text-gray-500 mb-4 flex items-center space-x-2">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:underline">Home</a>
                <span>/</span>
                <?php if (!empty($categories)): ?>
                    <a href="<?php echo esc_url(get_category_link($categories[0]->term_id)); ?>" class="text-[#002B49] font-semibold hover:underline">
                        <?php echo esc_html($categories[0]->name); ?>
                    </a>
                    <span>/</span>
                <?php endif; ?>
                <span class="text-gray-400 truncate max-w-xs"><?php the_title(); ?></span>
            </div>

            <!-- Category Pill -->
            <?php if (!empty($categories)): ?>
                <span class="inline-block bg-[#002B49] text-white text-xs font-bold uppercase px-3 py-1 rounded tracking-wider mb-3">
                    <?php echo esc_html($categories[0]->name); ?>
                </span>
            <?php endif; ?>

            <!-- H1 Headline -->
            <h1 class="<?php echo $is_urdu ? 'font-urdu text-3xl md:text-4xl text-right leading-loose' : 'font-editorial-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight'; ?> mb-4">
                <?php the_title(); ?>
            </h1>

            <!-- Subtitle / Excerpt -->
            <?php if (has_excerpt()): ?>
                <div class="<?php echo $is_urdu ? 'font-urdu text-lg text-gray-700 text-right mb-6' : 'font-editorial-serif text-lg text-gray-600 italic mb-6 border-l-2 border-[#D32F2F] pl-4'; ?>">
                    <?php the_excerpt(); ?>
                </div>
            <?php endif; ?>

            <!-- Byline Metadata -->
            <div class="flex items-center justify-between border-y border-gray-200 py-3 mb-6 text-xs text-gray-600">
                <div class="flex items-center space-x-3">
                    <?php echo get_avatar($author_id, 40, '', '', array('class' => 'rounded-full')); ?>
                    <div>
                        <a href="<?php echo esc_url(get_author_posts_url($author_id)); ?>" class="font-bold text-[#002B49] hover:underline">
                            <?php the_author(); ?>
                        </a>
                        <div class="text-gray-400">
                            Published: <?php echo get_the_date(); ?> | Updated: <?php echo get_the_modified_date(); ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Featured Image with Caption -->
            <?php if (has_post_thumbnail()): ?>
                <div class="mb-8">
                    <?php the_post_thumbnail('dunya-hero-large', array('class' => 'w-full h-auto rounded-md shadow-sm')); ?>
                    <?php if (get_the_post_thumbnail_caption()): ?>
                        <p class="text-xs text-gray-500 mt-2 italic"><?php echo esc_html(get_the_post_thumbnail_caption()); ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Formatted Editorial Article Body -->
            <div class="<?php echo $is_urdu ? 'font-urdu text-xl leading-loose text-right' : 'editorial-body text-gray-800 space-y-6'; ?>" <?php echo $is_urdu ? 'dir="rtl"' : ''; ?>>
                <?php the_content(); ?>
            </div>

            <!-- Tags -->
            <div class="mt-8 pt-6 border-t border-gray-200">
                <span class="text-xs font-bold text-gray-500 uppercase mr-2">Tags:</span>
                <?php the_tags('<span class="inline-flex gap-2">', '', '</span>'); ?>
            </div>

            <!-- Comments Section -->
            <?php if (comments_open() || get_comments_number()) :
                comments_template();
            endif; ?>

        </div>

        <!-- Sidebar Column -->
        <aside class="lg:col-span-4 space-y-8">
            <?php get_sidebar(); ?>
        </aside>

    </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
`;

  const frontPagePhp = `<?php
/**
 * The template for displaying Dunya International dynamic front page
 *
 * @package Dunya_International
 */
get_header(); ?>

<main class="dunya-container py-6">

    <!-- Breaking News Ticker -->
    <?php
    $breaking_query = new WP_Query(array(
        'posts_per_page' => 5,
        'meta_key'       => '_dunya_is_breaking',
        'meta_value'     => '1',
    ));
    if ($breaking_query->have_posts()) : ?>
    <div class="breaking-ticker-bar flex items-center px-4 mb-6 rounded">
        <span class="breaking-badge mr-4">BREAKING NEWS</span>
        <div class="overflow-hidden whitespace-nowrap text-sm">
            <?php while ($breaking_query->have_posts()) : $breaking_query->the_post(); ?>
                <a href="<?php the_permalink(); ?>" class="hover:underline mr-8 font-medium">
                    &bull; <?php the_title(); ?>
                </a>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </div>
    <?php endif; ?>

    <!-- Editorial Hero Grid -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <?php
        $hero_query = new WP_Query(array(
            'posts_per_page' => 1,
            'meta_key'       => '_dunya_is_hero',
            'meta_value'     => '1',
        ));
        if ($hero_query->have_posts()) : while ($hero_query->have_posts()) : $hero_query->the_post();
        ?>
        <div class="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <a href="<?php the_permalink(); ?>" class="block mb-4 overflow-hidden rounded">
                <?php if (has_post_thumbnail()) : the_post_thumbnail('dunya-hero-large', array('class' => 'w-full h-80 object-cover hover:scale-105 transition duration-300')); endif; ?>
            </a>
            <span class="bg-[#D32F2F] text-white text-xs font-bold uppercase px-2.5 py-1 rounded tracking-wide">LEAD STORY</span>
            <h2 class="font-editorial-display text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-3 hover:text-[#002B49]">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h2>
            <p class="font-editorial-serif text-gray-600 text-sm leading-relaxed mb-4"><?php echo wp_trim_words(get_the_excerpt(), 30); ?></p>
            <div class="text-xs text-gray-400"><?php echo get_the_date(); ?> | By <?php the_author(); ?></div>
        </div>
        <?php endwhile; wp_reset_postdata(); endif; ?>

        <!-- Secondary Stories Column -->
        <div class="lg:col-span-4 space-y-4">
            <h3 class="font-bold text-sm uppercase text-[#002B49] border-l-4 border-[#002B49] pl-3">Top Highlights</h3>
            <?php
            $secondary_query = new WP_Query(array(
                'posts_per_page' => 3,
                'offset'         => 1,
            ));
            while ($secondary_query->have_posts()) : $secondary_query->the_post(); ?>
            <div class="bg-white p-4 rounded border border-gray-200 flex space-x-3">
                <?php if (has_post_thumbnail()) : ?>
                    <a href="<?php the_permalink(); ?>" class="flex-shrink-0 w-24 h-20 overflow-hidden rounded">
                        <?php the_post_thumbnail('thumbnail', array('class' => 'w-full h-full object-cover')); ?>
                    </a>
                <?php endif; ?>
                <div>
                    <h4 class="text-sm font-bold leading-snug hover:text-[#D32F2F]">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h4>
                    <span class="text-[11px] text-gray-400"><?php echo get_the_date(); ?></span>
                </div>
            </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </section>

</main>

<?php get_footer(); ?>
`;

  return {
    'style.css': styleCss,
    'functions.php': functionsPhp,
    'header.php': headerPhp,
    'footer.php': footerPhp,
    'single.php': singlePhp,
    'front-page.php': frontPagePhp,
    'index.php': frontPagePhp,
    'archive.php': singlePhp,
    'category.php': singlePhp,
    'tag.php': singlePhp,
    'author.php': singlePhp,
    'search.php': singlePhp,
    'page.php': singlePhp,
    '404.php': `<?php get_header(); ?><div class="dunya-container py-20 text-center"><h1 class="text-6xl font-bold text-[#002B49]">404</h1><p class="text-xl mt-4">Page Not Found</p><a href="<?php echo home_url('/'); ?>" class="inline-block mt-6 bg-[#002B49] text-white px-6 py-2 rounded">Return Home</a></div><?php get_footer(); ?>`,
    'sidebar.php': `<?php if (is_active_sidebar('sidebar-primary')) : dynamic_sidebar('sidebar-primary'); endif; ?>`,
    'comments.php': `<?php if (comments_open()) : ?><div id="comments" class="mt-8 pt-8 border-t border-gray-200"><?php comment_form(); ?></div><?php endif; ?>`,
    'inc/customizer.php': `<?php function dunya_customize_register($wp_customize) { /* Customizer settings */ } add_action('customize_register', 'dunya_customize_register'); ?>`,
    'inc/seo-schema.php': `<?php function dunya_output_schema() { /* Schema Generator */ } add_action('wp_head', 'dunya_output_schema'); ?>`
  };
}

export async function downloadThemeAndDataZip(
  posts: WPPost[],
  categories: WPCategory[],
  tags: WPTag[],
  authors: WPAuthor[],
  pages: WPPage[],
  settings: WPSettings
) {
  const zip = new JSZip();
  const themeFolder = zip.folder('dunya-international-theme');

  // Add theme PHP/CSS files
  const themeFiles = getWordPressThemeFiles();
  Object.entries(themeFiles).forEach(([filename, content]) => {
    themeFolder?.file(filename, content);
  });

  // Add WXR XML Data File for Tools -> Import
  const wxrXml = generateWordPressWXR(posts, categories, tags, authors, pages, settings);
  zip.file('dunya-international-migration-data.xml', wxrXml);

  // Add Hostinger Deployment Documentation
  const deploymentDoc = `# DUNYA INTERNATIONAL — Hostinger WordPress Deployment & Migration Guide

## 1. Prerequisites on Hostinger
1. Access your **Hostinger hPanel** -> WordPress Dashboard.
2. Install a fresh WordPress instance for \`dunyaint.com\` (or target domain).
3. Ensure PHP version is set to **8.1 or 8.2** in hPanel -> PHP Configuration.

## 2. Installing the Dunya International Theme
1. Unzip this package and locate the \`dunya-international-theme/\` folder.
2. Option A (via WordPress Dashboard):
   - Compress \`dunya-international-theme/\` as a ZIP file.
   - Go to **WordPress Admin -> Appearance -> Themes -> Add New -> Upload Theme**.
   - Choose the ZIP and click **Install Now**, then **Activate**.
3. Option B (via Hostinger File Manager / FTP):
   - Upload the \`dunya-international-theme\` folder into \`public_html/wp-content/themes/\`.
   - Activate via **Appearance -> Themes**.

## 3. Importing the Dunya International Migration Content
1. In your WordPress Admin, go to **Tools -> Import**.
2. Install and run the **WordPress Importer**.
3. Select the included \`dunya-international-migration-data.xml\` file.
4. Check **"Download and import file attachments"** and map authors.
5. Click **Submit**. All articles (including "Three Generations of Learning: The Gholam Mustafa-Mujtaba Family Legacy", Urdu reports, Pakistan/World sections, and Pages) are instantly imported!

## 4. Configuring Permalinks for SEO URL Preservation
1. Go to **Settings -> Permalinks**.
2. Select **Post name** (\`/%postname%/\`).
3. Click **Save Changes**. This preserves clean URLs like \`/three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy/\`.

## 5. Verifying Technical SEO & Submitting Sitemap
1. Install **Yoast SEO** or **Rank Math**.
2. Submit your XML sitemap (\`https://dunyaint.com/sitemap_index.xml\`) to **Google Search Console**.
3. Enjoy your next-generation high-performance news portal!
`;

  zip.file('HOSTINGER-DEPLOYMENT-GUIDE.md', deploymentDoc);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dunya-international-wordpress-package.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* BestShopio Admin · Online store / Theme editor — data layer.
   Ported from the Cursor canvas package (reference/canvases-share 2):
     - theme-editor.canvas.tsx   -> editor model (3-snapshot state, section/block tree, catalog)
     - theme-settings.canvas.tsx -> the 8 global setting groups (keys/defaults/options verbatim)
     - <section>.canvas.tsx       -> per-section schema + renderer (live in js/sections/<kind>.js)
   This file holds only DECLARATIVE data; the engine lives in app.js, section defs in sections/*.js.
   Page seeds are "thin" ({id,kind[,settings overrides][,blocks]}) — app.js materialises full
   settings from each section's defaults() at editor start, so defaults have a single source. */
(function () {
  // Prototype-only stand-ins. Sleek Wildpeak assets live under online-store/assets/wildpeak/.
  // Apparel set (p1-p6) + home/collection/testimonial tiles are downloaded from the
  // sleek-wildpeak demo. Wellness / default accessory SKUs (p7+) stay on Voltix CDN.
  // Not for commercial use. Frame ratios: hero ~2:1, iwt/blog ~4:3, cat ~3:4,
  // p* product shots ~3:4, ug* lifestyle tiles square.
  const shot = (file, v, w) =>
    'https://cdn.shopify.com/s/files/1/0824/4861/3621/files/' + file + '?v=' + v + '&width=' + w;
  const wp = (file) => 'online-store/assets/wildpeak/' + file;
  const IMG = {
    // Wildpeak home slideshow + theme cover.
    hero1: wp('slideshow_1.jpg'),
    hero2: wp('slideshow_2.jpg'),
    hero3: wp('slideshow_3.jpg'),
    cover: wp('cover_preview.jpg'),
    iwt: wp('iwt_1.jpg'),
    iwt2: wp('iwt_2.jpg'),
    cat1: wp('cat_1.jpg'),
    cat2: wp('cat_2.jpg'),
    cat3: wp('cat_3.jpg'),
    cat4: wp('cat_4.jpg'),
    cat5: wp('cat_5.jpg'),
    cat6: wp('cat_6.jpg'),
    // Apparel PDP hero: Ingrid Merino short sleeve (Wildpeak).
    p1: wp('black_01.webp'),
    p1b: wp('black_02.webp'),
    p1c: wp('black_03.webp'),
    p1d: wp('black_04.webp'),
    p1e: wp('black_05.webp'),
    p1f: wp('black_06.webp'),
    p1grn: wp('green_01.webp'),
    p1grn2: wp('green_02.webp'),
    p1brg: wp('burgundy_01.webp'),
    p1brg2: wp('burgundy_02.webp'),
    p1sand: wp('black_01.webp'),
    p1blk: wp('black_01.webp'),
    // Apparel related set — Wildpeak products paired to p2-p6.
    p2: wp('p2_01.webp'),
    p2b: wp('p2_02.webp'),
    p2c: wp('p2_03.webp'),
    p2ivr: wp('p2_ivr.webp'),
    p3: wp('p3_01.webp'),
    p3b: wp('p3_02.webp'),
    p3c: wp('p3_03.webp'),
    p4: wp('p4_01.webp'),
    p4b: wp('p4_02.webp'),
    p4c: wp('p4_03.webp'),
    p4brown: wp('p4_brown.jpg'),
    p5: wp('p5_ls_01.webp'),
    p5b: wp('p5_ls_02.webp'),
    p5c: wp('p5_03.webp'),
    // PDP gallery aliases — Ingrid black set for apparel compare.
    look1: wp('black_01.webp'),
    look2: wp('black_02.webp'),
    look3: wp('black_03.webp'),
    look4: wp('black_04.webp'),
    look5: wp('black_05.webp'),
    look6: wp('black_06.webp'),
    p6: wp('p6_01.webp'),
    p6b: wp('p6_02.webp'),
    p6c: wp('p6_03.webp'),
    shorts1: wp('shorts_ing_01.webp'),
    shorts2: wp('shorts_ing_02.webp'),
    p7: shot('Rectangle_151119.png', '1791451213', 900),
    p8: shot('Rectangle_151005.png', '1791450400', 900),
    p9: shot('Rectangle_151252.png', '1791454769', 900),
    p10: shot('Rectangle_151003.png', '1791374129', 900),
    p11: shot('Rectangle150927.png', '1791369170', 900),
    p12: shot('Rectangle150926.png', '1791368357', 900),
    p13: shot('Rectangle_151245.png', '1791452346', 900),
    p14: shot('Rectangle_151266.png', '1791452637', 900),
    p15: shot('Rectangle_151090_1.png', '1791453293', 900),
    p16: shot('Rectangle_151035.png', '1791373850', 900),
    p17: shot('Rectangle_151001.png', '1791373168', 900),
    p18: shot('Rectangle150951.png', '1791438084', 900),
    p19: shot('Rectangle151090.png', '1791438852', 900),
    p20: shot('MinimalBeigeTailoredWoolOvercoat_05de1806-9b05-4715-8687-899f5978254c.png', '1791783634', 900),
    av1: wp('av_1.webp'),
    av2: wp('av_2.webp'),
    av3: wp('av_3.webp'),
    blog1: wp('testi_1.jpg'),
    blog2: wp('testi_2.jpg'),
    ug1: wp('ug_1.jpg'),
    ug2: wp('ug_2.jpg'),
    ug3: wp('ug_3.jpg'),
    ug4: wp('ug_4.webp'),
    ug5: wp('ug_5.webp'),
    ug6: wp('ug_6.webp'),
    testi1: wp('testi_1.jpg'),
    testi2: wp('testi_2.jpg'),
    testi3: wp('testi_3.jpg'),
    svcShip: shot('delivery_1_4.svg', '1790770946', 250),
    svcVip: shot('secured-payment_1_2.svg', '1790760271', 250),
  };

  // ---------- theme list ("My theme" tab) ----------
  const THEMES = [
    {
      id: 1, handle: 'aura', title: 'Aura',
      pc_image: IMG.cover, h5_image: IMG.hero2,
      created_time: '2026-05-06 04:13:15', updated_time: '2026-06-12 17:42:08',
    },
  ];

  // ---------- page-type templates (theme-editor PAGE_OPTIONS) ----------
  // `multi:true` => this page type can hold several named templates (Shopify shows a
  // submenu + "Assigned to N …" + Create template). Single types keep exactly one
  // template and are picked directly (no submenu). `noun` labels the assignment count.
  const PAGE_OPTIONS = [
    { value: 'home',        label: 'Home page' },
    { value: 'product',     label: 'Products',        multi: true, noun: 'products' },
    { value: 'collection',  label: 'Collections',     multi: true, noun: 'collections' },
    { value: 'collections', label: 'Collections list' },
  ];

  // ---------- Add-Section catalog (Shopify-style popover; 5 groups) ----------
  // kind === null  => "coming soon" stub (kept so coverage count reads true to the PRD).
  const CATALOG = [
    { id: 'product-page', label: 'Product page', entries: [
      { kind: 'breadcrumbs', name: 'Breadcrumbs', desc: 'Store path; current page name off on desktop, on on mobile by default', pages: ['product'] },
      { kind: 'product-main', name: 'Product information', desc: 'Gallery, buy box and purchase blocks for this product', pages: ['product'] },
      { kind: 'related-products', name: 'Related products', desc: 'Rule-based or hand-picked product recommendations', pages: ['product'] },
      { kind: 'product-reviews', name: 'Product reviews', desc: 'This product’s own review list and score summary', pages: ['product'] },
      { kind: 'vendor-reviews', name: 'Vendor reviews', desc: 'Reviews across every product from the same vendor', pages: ['product'] },
    ] },
    { id: 'collection', label: 'Collection', entries: [
      { kind: 'collection-banner', name: 'Collection banner', desc: 'Hero image + copy at the top of a collection' },
      { kind: 'collection-list', name: 'Collection list', desc: 'Sub-category cards / collection navigation strip' },
      { kind: 'collection-page', name: 'Collection page', desc: 'Product feed — filters, sort, grid or list' },
      { kind: 'list-collections', name: 'List collections', desc: 'All-collections grid for the /collections page' },
    ] },
    { id: 'hero', label: 'Hero & banners', entries: [
      { kind: 'slideshow', name: 'Slideshow', desc: 'Full-width rotating banners with CTAs' },
    ] },
    { id: 'products', label: 'Products & collections', entries: [
      { kind: 'image-link-blocks', name: 'Image link blocks', desc: 'Tappable collection / category tiles' },
      { kind: 'featured-collection', name: 'Featured collection', desc: 'Tabbed product grid from a collection' },
      { kind: 'featured-product', name: 'Featured product', desc: 'In-page buy box for one product' },
    ] },
    { id: 'content', label: 'Content & media', entries: [
      { kind: 'media-with-text', name: 'Media with text', desc: 'Image / video beside copy, alternating' },
      { kind: 'text-with-icon', name: 'Text with icon', desc: 'Row of icon + text trust badges' },
      { kind: 'video-feed', name: 'Video feed', desc: 'Vertical video column carousel (2–6 per screen)' },
      { kind: 'before-after-image', name: 'Before / after image', desc: 'Draggable comparison slider' },
      { kind: 'blog-posts', name: 'Blog posts', desc: 'Latest articles from a blog' },
      { kind: 'media-grid', name: 'Media grid', desc: 'Image / video cards with captions' },
      { kind: 'feature-cards', name: 'Feature cards', desc: 'Icon + title + text benefit cards' },
    ] },
    { id: 'social', label: 'Social proof', entries: [
      { kind: 'testimonial', name: 'Testimonial', desc: 'Customer review cards' },
      { kind: 'ugc-gallery', name: 'UGC gallery', desc: 'User photo wall' },
      { kind: 'as-seen-in', name: 'As seen in', desc: 'Press / media logo strip' },
    ] },
    { id: 'engagement', label: 'Engagement & utility', entries: [
      { kind: 'faq', name: 'FAQ', desc: 'Accordion questions with optional support copy' },
      { kind: 'newsletter', name: 'Newsletter', desc: 'Email capture block' },
      { kind: 'custom-html', name: 'Custom HTML', desc: 'Raw HTML embed' },
    ] },
  ];

  // ---------- Theme settings · 8 groups (verbatim from theme-settings.canvas.tsx) ----------
  // Row kinds: {sub} = subheading, {info} = helper line, otherwise a field descriptor.
  // Fraunces matches Sleek Wildpeak headings; DM Sans matches its body.
  const FONT_HEAD = ['Montserrat', 'Fraunces', 'DM Sans', 'Playfair Display', 'DM Serif Display', 'Manrope', 'Inter', 'Georgia'].map((v) => ({ value: v, label: v }));
  const FONT_BODY = ['Montserrat', 'DM Sans', 'Inter', 'Manrope', 'Lato', 'Source Sans 3', 'system-ui'].map((v) => ({ value: v, label: v }));
  const WEIGHT_OPTS = [
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semibold' },
    { value: '700', label: 'Bold' },
  ];
  const FONT_ROLE = [
    { value: 'body', label: 'Body font' },
    { value: 'heading', label: 'Headings font' },
  ];
  const TEXT_CASE = [
    { value: 'none', label: 'None' },
    { value: 'capitalize', label: 'Title Case' },
    { value: 'uppercase', label: 'UPPERCASE' },
    { value: 'lowercase', label: 'lowercase' },
  ];
  // Theme tokens tuned to Sleek Wildpeak (black/white + Fraunces/DM Sans).
  const SETTINGS_GROUPS = [
    { key: 'colors', name: 'Colors', desc: 'Brand, surface and status colors', open: true, fields: [
      { sub: 'Brand' },
      { key: 'primary_color', label: 'Primary color', control: 'color', default: '#000000', info: 'Brand color. Drives the announcement bar background in the preview.' },
      { key: 'secondary_color', label: 'Secondary color', control: 'color', default: '#666666', info: 'Used by secondary nav links and product vendor labels.' },
      { sub: 'Surface' },
      { key: 'page_background', label: 'Page background', control: 'color', default: '#FFFFFF' },
      { key: 'text_color', label: 'Body text', control: 'color', default: '#000000' },
      { key: 'heading_color', label: 'Heading text', control: 'color', default: '#000000' },
      { key: 'link_color', label: 'Link text', control: 'color', default: '#000000' },
      { key: 'border_color', label: 'Border', control: 'color', default: '#E5E5E5' },
      { key: 'footer_background', label: 'Footer background', control: 'color', default: '#000000', info: 'Background of the footer block. Pick a dark brand color for best contrast with white text.' },
      { sub: 'Status' },
      { key: 'sale_price_color', label: 'Sale price', control: 'color', default: '#D63A2F', info: 'Used on sale badges and crossed-out prices.' },
      { key: 'error_color', label: 'Error / destructive', control: 'color', default: '#D63A2F' },
      { key: 'success_color', label: 'Success', control: 'color', default: '#12B76A' },
    ] },
    { key: 'typography', name: 'Typography', desc: 'Storefront type, matched to the current theme', open: true, fields: [
      { sub: 'Body' },
      { key: 'body_font', label: 'Font', control: 'select', options: FONT_BODY, default: 'DM Sans' },
      { key: 'body_bold_weight', label: 'Bolder font weight', control: 'select', options: WEIGHT_OPTS, default: '500', info: 'Used to highlight certain titles and labels.' },
      { key: 'base_font_size', label: 'Base size', control: 'range', min: 12, max: 22, step: 1, unit: 'px', default: 16 },
      { sub: 'Headings' },
      { key: 'heading_font', label: 'Font', control: 'select', options: FONT_HEAD, default: 'Fraunces' },
      { key: 'heading_scale', label: 'Font size scale', control: 'range', min: 100, max: 150, step: 1, unit: '%', default: 100 },
      { key: 'heading_scale_mobile', label: 'Mobile font size scale', control: 'range', min: 50, max: 150, step: 1, unit: '%', default: 80 },
      { key: 'heading_letter_spacing', label: 'Letter spacing', control: 'range', min: -10, max: 10, step: 1, unit: '%', default: 0 },
      { key: 'heading_uppercase', label: 'Uppercase headings', control: 'toggle', default: false },
      { sub: 'Display headings' },
      { key: 'display_headings', label: 'Use for display headings', control: 'toggle', default: false },
      { key: 'display_base_size', label: 'Base size', control: 'range', min: 20, max: 100, step: 1, unit: 'px', default: 56 },
      { key: 'display_uppercase', label: 'Uppercase display headings', control: 'toggle', default: false },
      { sub: 'Subheadings' },
      { key: 'subheading_scale', label: 'Font size scale', control: 'range', min: 75, max: 150, step: 1, unit: '%', default: 112 },
      { key: 'subheading_family', label: 'Font family', control: 'select', options: FONT_ROLE, default: 'body' },
      { key: 'subheading_weight', label: 'Font weight', control: 'select', options: WEIGHT_OPTS, default: '500' },
      { key: 'subheading_letter_spacing', label: 'Letter spacing', control: 'range', min: -10, max: 10, step: 1, unit: '%', default: 0 },
      { key: 'subheading_transform', label: 'Text transform', control: 'select', options: TEXT_CASE, default: 'none' },
      { sub: 'Product cards title' },
      { key: 'card_title_scale', label: 'Font size scale', control: 'range', min: 75, max: 150, step: 1, unit: '%', default: 100 },
      { key: 'card_title_family', label: 'Font family', control: 'select', options: FONT_ROLE, default: 'heading' },
      { key: 'card_title_weight', label: 'Font weight', control: 'select', options: WEIGHT_OPTS, default: '400' },
      { key: 'card_title_uppercase', label: 'Uppercase product title', control: 'toggle', default: false },
      { sub: 'Navigation' },
      { key: 'nav_family', label: 'Font family', control: 'select', options: FONT_ROLE, default: 'body' },
      { key: 'nav_weight', label: 'Font weight', control: 'select', options: WEIGHT_OPTS, default: '500' },
      { key: 'nav_uppercase', label: 'Uppercase navigation', control: 'toggle', default: true },
      { sub: 'Buttons' },
      { key: 'button_font_family', label: 'Font family', control: 'select', options: FONT_ROLE, default: 'body' },
      { key: 'button_font_weight', label: 'Font weight', control: 'select', options: WEIGHT_OPTS, default: '500' },
      { key: 'button_letter_spacing', label: 'Letter spacing', control: 'range', min: -10, max: 10, step: 1, unit: '%', default: 5 },
      { key: 'button_text_transform', label: 'Text transform', control: 'select', options: TEXT_CASE, default: 'uppercase' },
    ] },
    { key: 'buttons', name: 'Buttons', desc: 'Primary, secondary and shape', fields: [
      { sub: 'Primary button' },
      { key: 'primary_button_background', label: 'Background', control: 'color', default: '#000000' },
      { key: 'primary_button_text', label: 'Text', control: 'color', default: '#FFFFFF' },
      { sub: 'Secondary button' },
      { key: 'secondary_button_background', label: 'Background', control: 'color', default: 'transparent', allowTransparent: true },
      { key: 'secondary_button_text', label: 'Text', control: 'color', default: '#000000' },
      { sub: 'Shape' },
      { key: 'button_border_color', label: 'Border color', control: 'color', default: '#000000' },
      { key: 'button_border_width', label: 'Border width', control: 'range', min: 0, max: 4, step: 1, unit: 'px', default: 1 },
      { key: 'button_border_radius', label: 'Corner radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 5, info: 'Capped at 40px — once radius ≥ height ÷ 2 the corners are fully pilled.' },
      { key: 'button_height', label: 'Height', control: 'range', min: 32, max: 64, step: 1, unit: 'px', default: 48 },
      { key: 'button_horizontal_padding', label: 'Horizontal padding', control: 'range', min: 8, max: 48, step: 1, unit: 'px', default: 24 },
    ] },
    { key: 'layout', name: 'Layout', desc: 'Page width, spacing and radius', fields: [
      { sub: 'Container' },
      { key: 'page_width', label: 'Max page width', control: 'range', min: 960, max: 2400, step: 10, unit: 'px', default: 1440, info: 'Shopify Horizon Default uses Narrow (90rem / 1440px). Side gutters grow outside this content width.' },
      { sub: 'Section spacing' },
      { key: 'section_spacing_desktop', label: 'Vertical gap · Desktop', control: 'range', min: 16, max: 160, step: 4, unit: 'px', default: 64 },
      { key: 'section_spacing_mobile', label: 'Vertical gap · Mobile', control: 'range', min: 8, max: 100, step: 2, unit: 'px', default: 40 },
      { sub: 'Grid gap' },
      { key: 'grid_gap_desktop', label: 'Column gap · Desktop', control: 'range', min: 8, max: 64, step: 2, unit: 'px', default: 24 },
      { key: 'grid_gap_mobile', label: 'Column gap · Mobile', control: 'range', min: 4, max: 40, step: 2, unit: 'px', default: 16 },
      { sub: 'Page padding' },
      { key: 'page_horizontal_padding_desktop', label: 'Horizontal padding · Desktop', control: 'range', min: 8, max: 80, step: 2, unit: 'px', default: 40 },
      { key: 'page_horizontal_padding_mobile', label: 'Horizontal padding · Mobile', control: 'range', min: 4, max: 40, step: 2, unit: 'px', default: 16 },
      { sub: 'Radius' },
      { key: 'image_border_radius', label: 'Image radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 0 },
      { key: 'card_border_radius', label: 'Card radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 0 },
    ] },
    { key: 'product_cards', name: 'Product cards', desc: 'Default product card visuals', fields: [
      { sub: 'Image' },
      { key: 'product_image_ratio', label: 'Image ratio', control: 'select', default: 'portrait', options: [
        { value: 'portrait', label: 'Portrait (3:4)' }, { value: 'square', label: 'Square (1:1)' }, { value: 'landscape', label: 'Landscape (4:3)' } ] },
      { key: 'product_image_fit', label: 'Image fit', control: 'select', default: 'cover', options: [
        { value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' } ] },
      { sub: 'Text' },
      { key: 'product_card_text_alignment', label: 'Text alignment', control: 'select', default: 'center', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' } ] },
      { sub: 'Defaults' },
      { info: 'These defaults apply to every Featured collection or product grid. Individual sections can override each toggle.' },
      { key: 'show_vendor_by_default', label: 'Show vendor', control: 'toggle', default: false },
      { key: 'show_rating_by_default', label: 'Show rating', control: 'toggle', default: true },
      { key: 'show_sale_badge_by_default', label: 'Show sale badge', control: 'toggle', default: true },
      { key: 'sale_badge_style', label: 'Sale badge style', control: 'select', default: 'solid', options: [
        { value: 'solid', label: 'Solid' }, { value: 'outline', label: 'Outline' } ] },
      { key: 'show_color_swatches_by_default', label: 'Show color swatches', control: 'toggle', default: true },
      { key: 'show_quick_add_by_default', label: 'Show quick-add button', control: 'toggle', default: false },
    ] },
    { key: 'forms', name: 'Forms', desc: 'Inputs across the storefront', fields: [
      { info: 'Click into either preview input to type — input_text, placeholder_color and the focus border react live.' },
      { sub: 'Color' },
      { key: 'input_background', label: 'Background', control: 'color', default: '#FFFFFF' },
      { key: 'input_text', label: 'Text', control: 'color', default: '#1A1A1A' },
      { key: 'placeholder_color', label: 'Placeholder', control: 'color', default: '#999999' },
      { key: 'input_border_color', label: 'Border (default)', control: 'color', default: '#E5E5E5' },
      { key: 'focus_border_color', label: 'Border (focused)', control: 'color', default: '#000000' },
      { sub: 'Shape' },
      { key: 'input_border_radius', label: 'Corner radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 5 },
      { key: 'input_height', label: 'Height', control: 'range', min: 32, max: 64, step: 1, unit: 'px', default: 48 },
      { key: 'input_horizontal_padding', label: 'Horizontal padding', control: 'range', min: 8, max: 32, step: 1, unit: 'px', default: 16 },
    ] },
    { key: 'social_media', name: 'Social media', desc: 'URLs surfaced in Footer / Header', fields: [
      { info: 'Leave a field blank to hide that channel everywhere.' },
      { key: 'facebook_url', label: 'Facebook URL', control: 'url', default: '', placeholder: 'https://facebook.com/your-shop' },
      { key: 'instagram_url', label: 'Instagram URL', control: 'url', default: 'https://instagram.com/example', placeholder: 'https://instagram.com/your-shop' },
      { key: 'tiktok_url', label: 'TikTok URL', control: 'url', default: 'https://tiktok.com/@example', placeholder: 'https://tiktok.com/@your-shop' },
      { key: 'youtube_url', label: 'YouTube URL', control: 'url', default: '', placeholder: 'https://youtube.com/@your-shop' },
      { key: 'pinterest_url', label: 'Pinterest URL', control: 'url', default: '', placeholder: 'https://pinterest.com/your-shop' },
      { key: 'twitter_url', label: 'X / Twitter URL', control: 'url', default: 'https://twitter.com/example', placeholder: 'https://twitter.com/your-shop' },
    ] },
    { key: 'favicon', name: 'Favicon', desc: 'Browser tab icon', fields: [
      { key: 'favicon_image', label: 'Favicon image', control: 'image', default: '', info: 'Recommended 32×32 PNG. The storefront falls back to a generic dot if unset.' },
    ] },
  ];

  // Product metafield definitions available as dynamic sources in the theme editor.
  // Keep aligned with products/js SHOP_PRODUCT_DEFS + GOOGLE_PRODUCT_DEFS (merchant product admin).
  const PRODUCT_METAFIELD_DEFS = [
    { namespace: 'custom', key: 'fabric_weight', name: 'Fabric weight', type: 'single_line_text' },
    { namespace: 'custom', key: 'fit_guide', name: 'Fit guide', type: 'single_line_text' },
    { namespace: 'custom', key: 'care_instructions', name: 'Care instructions', type: 'multi_line_text' },
    { namespace: 'custom', key: 'material', name: 'Material', type: 'single_line_text' },
    { namespace: 'custom', key: 'launch_date', name: 'Launch date', type: 'date' },
    { namespace: 'custom', key: 'is_bestseller', name: 'Bestseller', type: 'boolean' },
    { namespace: 'google', key: 'gender', name: 'Gender', type: 'single_line_text' },
    { namespace: 'google', key: 'age_group', name: 'Age group', type: 'single_line_text' },
    { namespace: 'google', key: 'condition', name: 'Condition', type: 'single_line_text' },
  ];

  // ---------- sample platform resources (drive product/collection/menu/blog/page pickers) ----------
  // Chantilly / Symmetry swim PDP reference set.
  const SWIM_IMG = {
    hero: 'online-store/assets/chantilly-swim/aruba_dark_sage_1.webp',
    detail: 'online-store/assets/chantilly-swim/aruba_dark_sage_2.webp',
    side: 'online-store/assets/chantilly-swim/aruba_dark_sage_3.webp',
    back: 'online-store/assets/chantilly-swim/aruba_dark_sage_4.jpg',
    angle: 'online-store/assets/chantilly-swim/aruba_dark_sage_5.jpg',
    video: 'online-store/assets/chantilly-swim/aruba_sage_video.mp4',
    videoPoster: 'online-store/assets/chantilly-swim/aruba_sage_video_poster.webp',
    santorini: 'online-store/assets/chantilly-swim/aruba_santorini.webp',
    fire: 'online-store/assets/chantilly-swim/aruba_fire.webp',
  };
  const SAMPLE = {
    products: [
      { id: 'p1', handle: 'ingrid-merino-short-sleeve-black', title: 'Ingrid merino short sleeve black', vendor: 'Sleek Wildpeak', category: 'Tops', sku: 'WP-INGRID-BLK-S', inventory: 10, price: 99.0, compareAt: 0, rating: 5.0, reviews: 3, image: IMG.p1, images: [IMG.p1, IMG.p1b, IMG.p1c, IMG.p1d, IMG.p1e, IMG.p1f, IMG.p1grn, IMG.p1brg], swatches: ['#1a1a1a', '#2f5a3c', '#6b2d3c'], tags: ['tag__hot_Best Seller'], description: '<p>Elevate your wardrobe with this short sleeve. Crafted from premium Merino wool, this versatile top offers a perfect blend of comfort and sophistication. The natural fibers provide exceptional softness, breathability, and temperature regulation, making it an ideal choice for any season.</p><p><strong>Best For:</strong></p><ul><li>Layering under shells</li><li>Cool-weather travel</li><li>Everyday base layers</li></ul><p>True to size with a clean short-sleeve cut. Pair with merino shorts or tailored bottoms.</p>', metafields: { 'custom.fabric_weight': '180 gsm', 'custom.fit_guide': 'True to size', 'custom.care_instructions': 'Machine wash cold. Lay flat to dry.', 'custom.material': 'Merino wool', 'google.gender': 'unisex', 'google.age_group': 'adult' }, variants: [
        { id: 'p1-blk-s', title: 'Black / S', color: 'Black', size: 'S', sku: 'WP-INGRID-BLK-S', price: 99.0, compareAt: 0, inventory: 10, image: IMG.p1, available: true },
        { id: 'p1-blk-m', title: 'Black / M', color: 'Black', size: 'M', sku: 'WP-INGRID-BLK-M', price: 99.0, compareAt: 0, inventory: 10, image: IMG.p1, available: true },
        { id: 'p1-blk-l', title: 'Black / L', color: 'Black', size: 'L', sku: 'WP-INGRID-BLK-L', price: 99.0, compareAt: 0, inventory: 8, image: IMG.p1, available: true },
        { id: 'p1-blk-xl', title: 'Black / XL', color: 'Black', size: 'XL', sku: 'WP-INGRID-BLK-XL', price: 99.0, compareAt: 0, inventory: 6, image: IMG.p1, available: true },
        { id: 'p1-grn-s', title: 'Green / S', color: 'Green', size: 'S', sku: 'WP-INGRID-GRN-S', price: 99.0, compareAt: 0, inventory: 10, image: IMG.p1grn, available: true },
        { id: 'p1-grn-m', title: 'Green / M', color: 'Green', size: 'M', sku: 'WP-INGRID-GRN-M', price: 99.0, compareAt: 0, inventory: 10, image: IMG.p1grn, available: true },
        { id: 'p1-grn-l', title: 'Green / L', color: 'Green', size: 'L', sku: 'WP-INGRID-GRN-L', price: 99.0, compareAt: 0, inventory: 7, image: IMG.p1grn, available: true },
        { id: 'p1-grn-xl', title: 'Green / XL', color: 'Green', size: 'XL', sku: 'WP-INGRID-GRN-XL', price: 99.0, compareAt: 0, inventory: 5, image: IMG.p1grn, available: true },
        { id: 'p1-brg-s', title: 'Burgundy / S', color: 'Burgundy', size: 'S', sku: 'WP-INGRID-BRG-S', price: 99.0, compareAt: 0, inventory: 10, image: IMG.p1brg, available: true },
        { id: 'p1-brg-m', title: 'Burgundy / M', color: 'Burgundy', size: 'M', sku: 'WP-INGRID-BRG-M', price: 99.0, compareAt: 0, inventory: 9, image: IMG.p1brg, available: true },
        { id: 'p1-brg-l', title: 'Burgundy / L', color: 'Burgundy', size: 'L', sku: 'WP-INGRID-BRG-L', price: 99.0, compareAt: 0, inventory: 4, image: IMG.p1brg, available: true },
        { id: 'p1-brg-xl', title: 'Burgundy / XL', color: 'Burgundy', size: 'XL', sku: 'WP-INGRID-BRG-XL', price: 99.0, compareAt: 0, inventory: 0, image: IMG.p1brg, available: false },
      ] },
      // Badge matrix for apparel PDP QA (switch preview product while editing Badges and tags):
      // p1 hot only · p2 new only · p3 hot+new · p4 sale/saving · p5 sold out · p6 multi + sale
      { id: 'p2', handle: 'ingrid-merino-singlet-black', title: 'Ingrid merino singlet black', status: 'active', vendor: 'Sleek Wildpeak', category: 'Tops', sku: 'WP-SINGLET-BLK-S', inventory: 24, price: 79.0, compareAt: 0, rating: 4.6, reviews: 98, image: IMG.p2, images: [IMG.p2, IMG.p2b, IMG.p2c, IMG.p2ivr], swatches: ['#1a1a1a', '#eae3d6'], tags: ['tag__new_New Arrival'], description: '<p>A fine merino singlet with a clean neckline and soft hand. Breathable enough for warm days, warm enough under a shell.</p><p><strong>Best For:</strong></p><ul><li>Layering under jackets</li><li>Travel packing lists</li><li>Everyday base layers</li></ul>', variants: [
        { id: 'p2-blk-s', title: 'Black / S', color: 'Black', size: 'S', sku: 'WP-SINGLET-BLK-S', price: 79.0, compareAt: 0, inventory: 12, image: IMG.p2, available: true },
        { id: 'p2-ivr-m', title: 'Ivory / M', color: 'Ivory', size: 'M', sku: 'WP-SINGLET-IVR-M', price: 79.0, compareAt: 0, inventory: 12, image: IMG.p2ivr, available: true },
      ] },
      { id: 'p3', handle: 'emma-3l-shell-jacket-green', title: 'Emma 3L shell jacket green', vendor: 'Sleek Wildpeak', category: 'Outerwear', price: 248.0, compareAt: 0, rating: 4.9, reviews: 176, image: IMG.p3, images: [IMG.p3, IMG.p3b, IMG.p3c], swatches: ['#2f5a3c', '#1a1a1a'], tags: ['tag__hot_Trail Ready', 'tag__new_Season Drop'], description: '<p>A lightweight 3-layer shell with taped seams and a quiet outdoor cut. Packs small, blocks wind, and layers clean over merino.</p><p><strong>Best For:</strong></p><ul><li>Trail days</li><li>Travel packing</li><li>Unpredictable weather</li></ul>', metafields: { 'custom.fabric_weight': '3L shell', 'custom.fit_guide': 'Regular fit', 'custom.care_instructions': 'Wipe clean. Hang dry.', 'custom.material': '3-layer waterproof shell', 'google.gender': 'unisex', 'google.age_group': 'adult' },
        variants: [
          { id: 'p3-grn-s', title: 'Green / S', color: 'Green', size: 'S', price: 248.0, compareAt: 0, inventory: 6, image: IMG.p3, available: true },
          { id: 'p3-grn-m', title: 'Green / M', color: 'Green', size: 'M', price: 248.0, compareAt: 0, inventory: 8, image: IMG.p3, available: true },
          { id: 'p3-grn-l', title: 'Green / L', color: 'Green', size: 'L', price: 248.0, compareAt: 0, inventory: 4, image: IMG.p3, available: true },
          { id: 'p3-blk-m', title: 'Black / M', color: 'Black', size: 'M', price: 248.0, compareAt: 0, inventory: 5, image: IMG.p3b, available: true },
        ] },
      { id: 'p4', handle: 'minna-wool-fleece-jacket-black', title: 'Minna wool fleece jacket black', status: 'active', vendor: 'Sleek Wildpeak', category: 'Outerwear', price: 198.0, compareAt: 248.0, rating: 4.7, reviews: 132, image: IMG.p4, images: [IMG.p4, IMG.p4b, IMG.p4c, IMG.p4brown], swatches: ['#1a1a1a', '#6b4a32'], tags: ['tag__hot_Limited Drop'], description: '<p>A minimal wool-fleece jacket with a soft hand and structured collar. Warm enough for cool evenings without bulk.</p><p><strong>Best For:</strong></p><ul><li>Cool evenings</li><li>Layering over base layers</li><li>Weekend trails</li></ul>', metafields: { 'custom.fabric_weight': '320 gsm', 'custom.fit_guide': 'Relaxed fit', 'custom.care_instructions': 'Dry clean or wash cold. Lay flat to dry.', 'custom.material': 'Wool fleece', 'google.gender': 'unisex', 'google.age_group': 'adult' },
        variants: [
          { id: 'p4-blk-m', title: 'Black / M', color: 'Black', size: 'M', price: 198.0, compareAt: 248.0, inventory: 9, image: IMG.p4, available: true },
          { id: 'p4-blk-l', title: 'Black / L', color: 'Black', size: 'L', price: 198.0, compareAt: 248.0, inventory: 5, image: IMG.p4, available: true },
          { id: 'p4-brn-m', title: 'Brown / M', color: 'Brown', size: 'M', price: 198.0, compareAt: 248.0, inventory: 3, image: IMG.p4brown, available: true },
        ] },
      { id: 'p5', handle: 'ingrid-merino-long-sleeve-black', title: 'Ingrid merino long sleeve black', vendor: 'Sleek Wildpeak', category: 'Tops', inventory: 0, price: 119.0, compareAt: 0, rating: 4.5, reviews: 64, image: IMG.p5, images: [IMG.p5, IMG.p5b, IMG.p5c], swatches: ['#1a1a1a', '#6b2d3c'], tags: ['tag__hot_Core Layer'], description: '<p>Long-sleeve merino with a clean crew neck and temperature-regulating hand feel. Soft enough for daily wear, tough enough for travel.</p><p><strong>Best For:</strong></p><ul><li>Cooler mornings</li><li>Layering season</li><li>Travel neutrals</li></ul>', metafields: { 'custom.fabric_weight': '180 gsm', 'custom.fit_guide': 'True to size', 'custom.care_instructions': 'Machine wash cold. Lay flat to dry.', 'custom.material': 'Merino wool', 'google.gender': 'unisex', 'google.age_group': 'adult' },
        variants: [
          { id: 'p5-blk-s', title: 'Black / S', color: 'Black', size: 'S', price: 119.0, compareAt: 0, inventory: 0, image: IMG.p5, available: false },
          { id: 'p5-blk-m', title: 'Black / M', color: 'Black', size: 'M', price: 119.0, compareAt: 0, inventory: 0, image: IMG.p5, available: false },
          { id: 'p5-brg-m', title: 'Burgundy / M', color: 'Burgundy', size: 'M', price: 119.0, compareAt: 0, inventory: 0, image: IMG.p5b, available: false },
        ] },
      { id: 'p6', handle: 'ester-outdoor-shorts-black', title: 'Ester outdoor shorts black', status: 'active', vendor: 'Sleek Wildpeak', category: 'Bottoms', inventory: 14, price: 98.0, compareAt: 128.0, rating: 4.4, reviews: 51, image: IMG.p6, images: [IMG.p6, IMG.p6b, IMG.p6c], swatches: ['#1a1a1a', '#b08968'], tags: ['tag__hot_Best Seller', 'tag__new_Summer Edit'], description: '<p>Outdoor shorts with a soft swing and secure waist. Enough movement for hiking, clean enough for town.</p><p><strong>Best For:</strong></p><ul><li>Warm trail days</li><li>Travel packing</li><li>Pairing with merino tops</li></ul>', metafields: { 'custom.fabric_weight': '140 gsm', 'custom.fit_guide': 'True to size', 'custom.care_instructions': 'Machine wash cold. Hang dry.', 'custom.material': 'Softshell blend', 'google.gender': 'unisex', 'google.age_group': 'adult' },
        variants: [
          { id: 'p6-blk-s', title: 'Black / S', color: 'Black', size: 'S', price: 98.0, compareAt: 128.0, inventory: 7, image: IMG.p6, available: true },
          { id: 'p6-blk-m', title: 'Black / M', color: 'Black', size: 'M', price: 98.0, compareAt: 128.0, inventory: 5, image: IMG.p6, available: true },
          { id: 'p6-tan-m', title: 'Tan / M', color: 'Tan', size: 'M', price: 98.0, compareAt: 128.0, inventory: 2, image: IMG.p6b, available: true },
          { id: 'p6-tan-l', title: 'Tan / L', color: 'Tan', size: 'L', price: 98.0, compareAt: 128.0, inventory: 0, image: IMG.p6b, available: false },
        ] },
      { id: 'swim-aruba', handle: 'b-swim-benga-u76-aruba-top', title: 'Aruba Top', vendor: 'B Swim', category: 'Swim Tops', sku: 'BSWIM-ARUBA-U76', inventory: 0, preorder: true, price: 112.0, compareAt: 127.27, rating: 4.0, reviews: 4, image: SWIM_IMG.hero, images: [SWIM_IMG.hero, SWIM_IMG.detail, SWIM_IMG.side, SWIM_IMG.back, SWIM_IMG.angle], media: [
        { type: 'image', src: SWIM_IMG.hero },
        { type: 'video', poster: SWIM_IMG.videoPoster, video: SWIM_IMG.video },
        { type: 'image', src: SWIM_IMG.detail },
        { type: 'image', src: SWIM_IMG.side },
        { type: 'image', src: SWIM_IMG.back },
        { type: 'image', src: SWIM_IMG.angle },
      ], swatches: ['#5b8e90', '#f5dfb4', '#f3a0a2', '#775246', '#1c3935', '#f3bd3d', '#56b7c6', '#ef784f', '#111111'], tags: [], summary: 'Soft Aruba swim top with adjustable coverage. Pre-order now and we ship as soon as it is back in stock.', highlights: ['Mix-and-match with any B Swim bottom', 'Soft recycled swim fabric', 'Adjustable straps for a custom fit'], description: '<p>Pre-order now to make sure you do not miss out! As soon as it is in stock, we will ship it to you.</p>', metafields: { 'custom.fit_guide': 'Runs small · true to size · runs large', 'custom.care_instructions': 'Rinse in cold water after each wear. Lay flat to dry.', 'custom.material': 'Recycled swim fabric', 'custom.swim_note': 'Tops and bottoms sold separately.', 'custom.fabric_weight': '190 gsm', 'google.gender': 'female', 'google.age_group': 'adult', 'google.condition': 'new', 'custom.is_bestseller': 'true' }, variants: [
        { id: 'swim-aruba-sage-xs', title: 'Dark Sage / XS', color: 'Dark Sage', size: 'XS', sku: 'BSWIM-ARUBA-SAGE-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sage-s', title: 'Dark Sage / S', color: 'Dark Sage', size: 'S', sku: 'BSWIM-ARUBA-SAGE-S', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sage-m', title: 'Dark Sage / M', color: 'Dark Sage', size: 'M', sku: 'BSWIM-ARUBA-SAGE-M', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sage-l', title: 'Dark Sage / L', color: 'Dark Sage', size: 'L', sku: 'BSWIM-ARUBA-SAGE-L', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sage-d', title: 'Dark Sage / D', color: 'Dark Sage', size: 'D', sku: 'BSWIM-ARUBA-SAGE-D', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sage-dd', title: 'Dark Sage / DD', color: 'Dark Sage', size: 'DD', sku: 'BSWIM-ARUBA-SAGE-DD', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-santorini-xs', title: 'Santorini / XS', color: 'Santorini', size: 'XS', sku: 'BSWIM-ARUBA-SANTORINI-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.santorini },
        { id: 'swim-aruba-fire-xs', title: 'Fire / XS', color: 'Fire', size: 'XS', sku: 'BSWIM-ARUBA-FIRE-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.fire },
        { id: 'swim-aruba-bengal-xs', title: 'Bengal / XS', color: 'Bengal', size: 'XS', sku: 'BSWIM-ARUBA-BENGAL-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-palma-xs', title: 'Palma / XS', color: 'Palma', size: 'XS', sku: 'BSWIM-ARUBA-PALMA-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-sunglow-xs', title: 'Sun Glow / XS', color: 'Sun Glow', size: 'XS', sku: 'BSWIM-ARUBA-SUNGLOW-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-lagoon-xs', title: 'Lagoon / XS', color: 'Lagoon', size: 'XS', sku: 'BSWIM-ARUBA-LAGOON-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-burum-xs', title: 'Burum / XS', color: 'Burum', size: 'XS', sku: 'BSWIM-ARUBA-BURUM-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
        { id: 'swim-aruba-raven-xs', title: 'Raven / XS', color: 'Raven', size: 'XS', sku: 'BSWIM-ARUBA-RAVEN-XS', price: 112.0, compareAt: 127.27, inventory: 0, available: true, preorder: true, image: SWIM_IMG.hero },
      ] },
      { id: 'swim-cecilia', handle: 'b-swim-cecilia-1pc', title: 'Cecilia 1pc', vendor: 'B Swim', category: 'One Pieces', sku: 'BSWIM-CECILIA', inventory: 12, preorder: true, price: 186.0, compareAt: 0, rating: 4.0, reviews: 4, image: SWIM_IMG.santorini, images: [SWIM_IMG.santorini, SWIM_IMG.detail, SWIM_IMG.side], swatches: ['#f5dfb4', '#5b8e90', '#111111'], tags: ['tag__new_New arrival'], description: '<p>A sculpted one-piece with clean lines and soft support. Pair with a cover-up for beach-to-brunch days.</p>', variants: [
        { id: 'swim-cecilia-s', title: 'Santorini / S', color: 'Santorini', size: 'S', price: 186.0, inventory: 6, available: true, preorder: true, image: SWIM_IMG.santorini },
        { id: 'swim-cecilia-m', title: 'Santorini / M', color: 'Santorini', size: 'M', price: 186.0, inventory: 6, available: true, preorder: true, image: SWIM_IMG.santorini },
      ] },
      { id: 'swim-belize', handle: 'b-swim-belize-bralette', title: 'Belize Bralette', vendor: 'B Swim', category: 'Swim Tops', sku: 'BSWIM-BELIZE', inventory: 18, price: 108.0, compareAt: 121.0, rating: 4.0, reviews: 4, image: SWIM_IMG.fire, images: [SWIM_IMG.fire, SWIM_IMG.angle, SWIM_IMG.back], swatches: ['#f3a0a2', '#ef784f', '#111111', '#5b8e90'], tags: [], description: '<p>A soft bralette top with adjustable straps. Mix with any B Swim bottom.</p>', variants: [
        { id: 'swim-belize-s', title: 'Fire / S', color: 'Fire', size: 'S', price: 108.0, compareAt: 121.0, inventory: 9, available: true, image: SWIM_IMG.fire },
        { id: 'swim-belize-m', title: 'Fire / M', color: 'Fire', size: 'M', price: 108.0, compareAt: 121.0, inventory: 9, available: true, image: SWIM_IMG.fire },
      ] },
      { id: 'swim-forever', handle: 'b-swim-forever-tankini', title: 'Forever Tankini', vendor: 'B Swim', category: 'Swim Tops', sku: 'BSWIM-FOREVER', inventory: 20, price: 115.0, compareAt: 0, rating: 4.2, reviews: 4, image: SWIM_IMG.detail, images: [SWIM_IMG.detail, SWIM_IMG.hero, SWIM_IMG.side], swatches: ['#5b8e90', '#1c3935', '#f3bd3d'], tags: [], description: '<p>A tankini top with easy coverage and beach-day comfort.</p>', variants: [
        { id: 'swim-forever-m', title: 'Dark Sage / M', color: 'Dark Sage', size: 'M', price: 115.0, inventory: 10, available: true, image: SWIM_IMG.detail },
        { id: 'swim-forever-l', title: 'Dark Sage / L', color: 'Dark Sage', size: 'L', price: 115.0, inventory: 10, available: true, image: SWIM_IMG.detail },
      ] },
      { id: 'swim-muse', handle: 'b-swim-muse-halter', title: 'Muse Halter', vendor: 'B Swim', category: 'Swim Tops', sku: 'BSWIM-MUSE', inventory: 14, price: 98.0, compareAt: 0, rating: 4.1, reviews: 3, image: SWIM_IMG.side, images: [SWIM_IMG.side, SWIM_IMG.back], swatches: ['#56b7c6', '#f5dfb4'], tags: [], description: '<p>A halter swim top with a clean neckline and soft support.</p>', variants: [
        { id: 'swim-muse-s', title: 'Lagoon / S', color: 'Lagoon', size: 'S', price: 98.0, inventory: 7, available: true, image: SWIM_IMG.side },
        { id: 'swim-muse-m', title: 'Lagoon / M', color: 'Lagoon', size: 'M', price: 98.0, inventory: 7, available: true, image: SWIM_IMG.side },
      ] },
      { id: 'p7', title: 'Canvas weekender tote', vendor: 'Aura Studio', price: 29.0, compareAt: 39.0, rating: 4.7, reviews: 83, image: IMG.p7, swatches: ['#b08968', '#2b2f36'], description: '<p>A sturdy canvas weekender tote with interior pockets and a reinforced base. Room for a change of clothes, laptop sleeve, and weekend extras without losing shape.</p><p><strong>Best For:</strong></p><ul><li>Overnight trips</li><li>Gym-to-office days</li><li>Market runs</li></ul>' },
      { id: 'p8', handle: 'everyday-rib-socks-3-pack', title: 'Everyday rib socks · 3 pack', status: 'deactivated', vendor: 'Aura Studio', sku: 'AUR-RIB-SOCKS-SAND-S', inventory: 3, price: 16.0, compareAt: 24.0, rating: 4.6, reviews: 119, image: IMG.p1, images: [IMG.p1, IMG.p1b, IMG.p1c, IMG.p1d, IMG.p1sand, IMG.p1blk], swatches: ['#c8b6a6', '#2b2f36', '#e8e1d6'], tags: ['tag__hot_Best seller', 'tag__new_Black Friday Sale'], description: '<p>Soft rib cotton socks with reinforced heel and toe. Pack of three everyday neutrals that stay put without digging in.</p><p><strong>Best For:</strong></p><ul><li>Daily rotation</li><li>Sneakers and loafers</li><li>Gifting sets</li></ul><p>Machine wash cold with like colors. Hang dry to keep the rib elastic.</p>', metafields: { 'custom.fabric_weight': '160 gsm', 'custom.fit_guide': 'True to size', 'custom.care_instructions': 'Machine wash cold with like colors. Hang dry.', 'custom.material': 'Cotton rib', 'google.gender': 'unisex', 'google.age_group': 'adult' }, variants: [
        { id: 'p8-sand-s', title: 'Sand / S', color: 'Sand', size: 'S', sku: 'AUR-RIB-SOCKS-SAND-S', price: 16.0, compareAt: 24.0, inventory: 3, image: IMG.p1, available: true },
        { id: 'p8-black-m', title: 'Black / M', color: 'Black', size: 'M', sku: 'AUR-RIB-SOCKS-BLACK-M', price: 16.0, compareAt: 24.0, inventory: 0, image: IMG.p1blk, available: false },
        { id: 'p8-cream-l', title: 'Cream / L', color: 'Cream', size: 'L', sku: 'AUR-RIB-SOCKS-CREAM-L', price: 16.0, compareAt: 24.0, inventory: 18, image: IMG.p1c, available: true },
        { id: 'p8-sand-m', title: 'Sand / M', color: 'Sand', size: 'M', sku: 'AUR-RIB-SOCKS-SAND-M', price: 16.0, compareAt: 24.0, inventory: 2, image: IMG.p1sand, available: true },
      ] },
      { id: 'p9', title: 'Mini canvas pouch', vendor: 'Aura Studio', price: 14.0, compareAt: 19.0, rating: 4.5, reviews: 72, image: IMG.p9, swatches: ['#c8b6a6', '#2b2f36'], description: '<p>A mini canvas pouch for cards, keys, and lip balm. Zip top with a wipe-clean lining and a small exterior slip pocket.</p><p><strong>Best For:</strong></p><ul><li>Crossbody organization</li><li>Travel day pouches</li><li>Gift with purchase sets</li></ul>' },
      { id: 'p10', title: 'Travel care kit', vendor: 'Aura Studio', price: 12.0, compareAt: 18.0, rating: 4.6, reviews: 91, image: IMG.p10, swatches: ['#d9d2c5'], description: '<p>A compact travel care kit with TSA-friendly bottles, a folding brush, and a soft zip case. Keeps bathroom counters calm on the road.</p><p><strong>Best For:</strong></p><ul><li>Carry-on packing</li><li>Gym lockers</li><li>Weekend guests</li></ul>' },
      { id: 'p11', title: 'Essential hair scarf', vendor: 'Aura Studio', price: 18.0, compareAt: 25.0, rating: 4.4, reviews: 54, image: IMG.p11, swatches: ['#1b1f24', '#d8c3a5'], description: '<p>A lightweight hair scarf with rolled edges and a soft hand. Wear as a headband, neck tie, or bag accent.</p><p><strong>Best For:</strong></p><ul><li>Windy days</li><li>Travel hair control</li><li>Outfit finishing</li></ul>' },
      { id: 'p12', title: 'Cotton sleep mask', vendor: 'Aura Studio', price: 9.5, compareAt: 14.0, rating: 4.7, reviews: 108, image: IMG.p12, swatches: ['#33415c', '#eae3d6'], description: '<p>A cotton sleep mask with gently contoured padding and an adjustable strap. Blocks light without pressing on the eyes.</p><p><strong>Best For:</strong></p><ul><li>Flights and hotels</li><li>Shared rooms</li><li>Afternoon resets</li></ul>' },
      { id: 'p13', title: 'Everyday claw clip set', vendor: 'Aura Studio', price: 15.0, compareAt: 21.0, rating: 4.6, reviews: 137, image: IMG.p13, swatches: ['#6b705c', '#cb997e'], description: '<p>A set of everyday claw clips in matte finishes. Strong grip for medium to thick hair without leaving a crease.</p><p><strong>Best For:</strong></p><ul><li>Quick updos</li><li>Workout hair</li><li>Desk drawers</li></ul>' },
      { id: 'p14', title: 'Compact jewelry case', vendor: 'Aura Studio', price: 20.0, compareAt: 28.0, rating: 4.8, reviews: 66, image: IMG.p14, swatches: ['#b08968', '#1b1f24'], description: '<p>A compact jewelry case with ring rolls, earring slots, and a zip pocket for chains. Soft lining keeps pieces from tangling in a bag.</p><p><strong>Best For:</strong></p><ul><li>Weekend trips</li><li>Wedding weekends</li><li>Daily dresser storage</li></ul>' },
      { id: 'p15', title: 'Soft-touch headband', vendor: 'Aura Studio', price: 11.0, compareAt: 16.0, rating: 4.5, reviews: 84, image: IMG.p15, swatches: ['#d8c3a5', '#1b1f24'], description: '<p>A soft-touch headband with gentle stretch and a no-slip inner band. Wide enough to hold hair back without leaving a dent.</p><p><strong>Best For:</strong></p><ul><li>Skincare routines</li><li>Workouts</li><li>Windy commutes</li></ul>' },
      { id: 'p16', title: 'Linen scrunchie set', vendor: 'Aura Studio', price: 13.0, compareAt: 18.0, rating: 4.6, reviews: 102, image: IMG.p16, swatches: ['#c8b6a6', '#9fb0a0'], description: '<p>A linen scrunchie set in three everyday neutrals. Soft on the wrist and kinder to hair than elastic-only bands.</p><p><strong>Best For:</strong></p><ul><li>Low ponytails</li><li>Wrist stacking</li><li>Gifting</li></ul>' },
      { id: 'p17', title: 'Pocket mirror', vendor: 'Aura Studio', price: 8.0, compareAt: 12.0, rating: 4.4, reviews: 47, image: IMG.p17, swatches: ['#2b2f36'], description: '<p>A slim pocket mirror with a clear glass face and protective cover. Fits in a mini pouch or jean pocket.</p><p><strong>Best For:</strong></p><ul><li>On-the-go touch-ups</li><li>Travel kits</li><li>Desk drawers</li></ul>' },
      { id: 'p18', title: 'Mini travel comb', vendor: 'Aura Studio', price: 7.5, compareAt: 11.0, rating: 4.5, reviews: 59, image: IMG.p18, swatches: ['#eae3d6'], description: '<p>A mini travel comb with rounded teeth and a compact handle. Detangles without snagging and tucks into any pouch.</p><p><strong>Best For:</strong></p><ul><li>Carry-on bags</li><li>Gym lockers</li><li>Quick touch-ups</li></ul>' },
      { id: 'p19', title: 'Reusable garment bag', vendor: 'Aura Studio', price: 17.0, compareAt: 24.0, rating: 4.7, reviews: 73, image: IMG.p19, swatches: ['#3a3f4a'], description: '<p>A reusable garment bag with a full-length zip and hanging loop. Keeps dresses and jackets dust-free between wears and on the road.</p><p><strong>Best For:</strong></p><ul><li>Closet storage</li><li>Flight hanging bags</li><li>Seasonal packing</li></ul>' },
      { id: 'p20', title: 'Delicate wash bag set', vendor: 'Aura Studio', price: 10.0, compareAt: 15.0, rating: 4.6, reviews: 96, image: IMG.p20, swatches: ['#eae3d6', '#33415c'], description: '<p>A delicate wash bag set for knits, lingerie, and scarves. Mesh panels let water through while protecting seams and straps.</p><p><strong>Best For:</strong></p><ul><li>Machine wash day</li><li>Travel laundry</li><li>Protecting fine knits</li></ul>' },
    ],
    // Service / membership products bound by the Shipping Insurance & VIP Club components.
    // They carry their own price and show up in the Order Summary like a normal line item.
    services: [
      { id: 'svc-ship', title: 'Shipping Protection', vendor: 'Service', price: 3.95, compareAt: 0, image: IMG.svcShip },
      { id: 'svc-vip', title: 'VIP Club Membership', vendor: 'Membership', price: 29.99, compareAt: 0, image: IMG.svcVip },
    ],
    collections: [
      { id: 'best-sellers', title: 'Best sellers', image: IMG.cat1, count: 48, productIds: ['p1', 'p3', 'p5', 'p8', 'p13', 'p16'] },
      { id: 'new-arrivals', title: 'New arrivals', image: IMG.cat2, count: 32, productIds: ['p2', 'p7', 'p9', 'p10', 'p11', 'p17'] },
      { id: 'dresses', title: 'Dresses', image: IMG.cat3, count: 27, productIds: ['p3', 'p6', 'p11', 'p19'] },
      { id: 'tops', title: 'Tops', image: IMG.cat4, count: 41, productIds: ['p2', 'p5', 'p15', 'p16'] },
      { id: 'bottoms', title: 'Bottoms', image: IMG.cat5, count: 36, productIds: ['p1', 'p6', 'p4', 'p19'] },
      { id: 'sale', title: 'Sale', image: IMG.cat6, count: 19, productIds: ['p1', 'p2', 'p3', 'p4', 'p7', 'p8'] },
    ],
    menus: [
      { id: 'menu-main', name: 'Main menu', items: [
        { id: 'm-home', title: 'Home', url: '/' },
        { id: 'm-shop', title: 'Shop Now', url: '/collections/all', children: [
          { id: 'm-shop-best', title: 'Best sellers', url: '/collections/best-sellers' },
          { id: 'm-shop-new', title: 'New arrivals', url: '/collections/new-arrivals' },
          { id: 'm-shop-sale', title: 'Sale', url: '/collections/sale' },
        ] },
        { id: 'm-women', title: 'Women', url: '/collections/women', children: [
          { id: 'm-w-dress', title: 'Dresses', url: '/collections/dresses' },
          { id: 'm-w-top', title: 'Tops', url: '/collections/tops' },
          { id: 'm-w-bottom', title: 'Bottoms', url: '/collections/bottoms' },
        ] },
        { id: 'm-blog', title: 'Journal', url: '/blogs/journal' },
      ] },
      { id: 'menu-footer-shop', name: 'Footer · Shop', items: [
        { id: 'f-best', title: 'Best sellers', url: '/collections/best-sellers' },
        { id: 'f-new', title: 'New arrivals', url: '/collections/new-arrivals' },
        { id: 'f-sale', title: 'Sale', url: '/collections/sale' },
      ] },
      { id: 'menu-footer-help', name: 'Footer · Help', items: [
        { id: 'h-track', title: 'Track order', url: '/account/orders' },
        { id: 'h-ship', title: 'Shipping', url: '/pages/shipping' },
        { id: 'h-returns', title: 'Returns', url: '/pages/returns' },
        { id: 'h-contact', title: 'Contact us', url: '/pages/contact' },
      ] },
    ],
    pages: [
      { id: 'pg-privacy', title: 'Privacy Policy', url: '/pages/privacy', content:
        '<p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our store.</p>' +
        '<p><strong>Information we collect.</strong> When you place an order we collect your name, billing and shipping address, payment details, email address, and phone number so we can fulfil your order and keep you updated.</p>' +
        '<p><strong>How we use it.</strong> We use the information to process payments, arrange shipping, and provide order confirmations. We may also use it to communicate with you and to screen for potential risk or fraud.</p>' +
        '<p>You can contact us at any time to review, update, or delete the personal information we hold about you.</p>' },
      { id: 'pg-refund', title: 'Refund Policy', url: '/pages/refund', content:
        '<p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>' +
        '<p><strong>Eligibility.</strong> To be eligible for a return, your item must be in the same condition that you received it — unworn or unused, with tags, and in its original packaging. You will also need the receipt or proof of purchase.</p>' +
        '<p><strong>Refunds.</strong> Once we have received and inspected your return, we will notify you of the approval. If approved, you will be automatically refunded to your original payment method within 10 business days.</p>' },
      { id: 'pg-terms', title: 'Terms of Service', url: '/pages/terms', content:
        '<p>By accessing this site and placing an order you agree to the following terms and conditions.</p>' +
        '<p><strong>Products & pricing.</strong> We reserve the right to modify prices and product availability at any time. All prices are shown in the store currency and include applicable taxes where required.</p>' +
        '<p><strong>Orders.</strong> We reserve the right to refuse or cancel any order. If we cancel an order after payment, you will receive a full refund.</p>' +
        '<p>These terms are governed by the laws of the jurisdiction in which the store operates.</p>' },
      { id: 'pg-shipping', title: 'Shipping Policy', url: '/pages/shipping', content:
        '<p>We aim to process and dispatch all orders within 1–2 business days.</p>' +
        '<p><strong>Delivery times.</strong> Standard shipping typically arrives within 3–7 business days. Express options are available at checkout for faster delivery.</p>' +
        '<p><strong>Tracking.</strong> Once your order ships you will receive a confirmation email with a tracking number so you can follow its progress.</p>' +
        '<p>Shipping fees are calculated at checkout based on destination and the options you select.</p>' },
      { id: 'pg-about', title: 'About Us', url: '/pages/about', content:
        '<p>We are a small team passionate about creating thoughtful, high-quality products that last.</p>' +
        '<p>Every item in our collection is designed with care and made to be worn and loved for years. We believe in fair pricing, transparent sourcing, and treating our customers the way we would want to be treated.</p>' +
        '<p>Thank you for supporting our store — we are glad you are here.</p>' },
      { id: 'pg-contact', title: 'Contact Us', url: '/pages/contact', content:
        '<p>Have a question about your order or one of our products? We would love to hear from you.</p>' +
        '<p><strong>Email.</strong> support@example.com — we reply to every message within one business day.</p>' +
        '<p><strong>Hours.</strong> Monday to Friday, 9am–5pm. Messages sent over the weekend are answered the next business day.</p>' },
      { id: 'pg-size-chart', title: 'Size chart', url: '/pages/size-chart', content:
        '<p>Wildpeak apparel uses a true-to-size outdoor cut. Measure against the chart below before you order.</p>' +
        '<p><strong>Tops (cm).</strong> S 86–91 · M 91–96 · L 96–101 · XL 101–109</p>' +
        '<p><strong>Bottoms (cm).</strong> S 71–76 · M 76–81 · L 81–86 · XL 86–94</p>' +
        '<p>Between sizes? Size up for layering under shells. Size down for a closer base-layer fit.</p>' },
      { id: 'pg-swim-size-chart', title: 'Swim size guide', url: '/pages/swim-size-guide', content:
        '<p><strong>Fit guide</strong></p><p>Runs small <span style="display:inline-block;width:180px;border-top:1px solid #999;vertical-align:middle"></span> True to size <span style="display:inline-block;width:180px;border-top:1px solid #999;vertical-align:middle"></span> Runs large</p>' +
        '<p>Aruba tops are sold separately from bottoms. If you prefer more coverage, size up in the cup or band.</p>' },
    ],
    blogs: [
      { id: 'blog-journal', title: 'Journal', posts: [
        { id: 'a1', title: 'Five ways to style linen this spring', excerpt: 'Lightweight layers for warmer days, from desk to dinner.', author: 'Mia Carter', date: 'Mar 3, 2026', category: 'Outfit Ideas', image: IMG.blog1 },
        { id: 'a2', title: 'The fabric guide: what to know before you buy', excerpt: 'A quick primer on the materials we love and why they last.', author: 'Jules N.', date: 'Mar 4, 2026', category: 'Guides', image: IMG.blog2 },
        { id: 'a3', title: 'Behind the seams: our spring capsule', excerpt: 'How the new collection came together, piece by piece.', author: 'Mia Carter', date: 'Mar 6, 2026', category: 'Studio', image: IMG.iwt },
      ] },
    ],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD'],
    languages: ['English', '中文', '日本語', 'Français', 'Español', 'Deutsch'],
    IMG,
  };

  // ---------- DEFAULT THEME (thin seeds; settings filled from section defaults at start) ----------
  // Globals (announcement/header/footer) and template sections reference a section `kind`; the
  // engine materialises each instance's settings from OS_SECTIONS[kind].defaults(), applying any
  // `settings` override here. Blocks likewise: {kind} -> blockDef.defaults().
  const DEFAULT_THEME = {
    name: 'Symmetry Swim · Draft',
    announcement: { hidden: false, kind: 'announcement-bar', settings: { background: '#222222', text: '#FFFFFF', text_size: 'small' }, blocks: [
      { kind: 'message', settings: { text: 'Free shipping on orders over $50', link: '' } },
    ] },
    header: { hidden: false, kind: 'header', settings: { logo_text: 'SYMMETRY', layout: 'logoTopCenter', background: '#FFFFFF', text_color: '#222222', border_bottom: true } },
    footer: { hidden: false, kind: 'footer', settings: {} },
    // Multi-template shape: each page type holds a `list` of named templates. `id:'default'`
    // is the built-in fallback (can't be deleted). `assigned` is a mock count shown in the
    // selector submenu ("Assigned to N collections"). Single types (home / collections) simply
    // keep a one-item list. Extra collection templates seed the multi-template UX.
    templates: {
      home: { list: [
        { id: 'default', name: 'Home page', assigned: '—', sections: [
          { id: 'sec-home-slideshow', kind: 'slideshow' },
          { id: 'sec-home-iwt', kind: 'media-with-text' },
          { id: 'sec-home-fc', kind: 'featured-collection' },
          { id: 'sec-home-testi', kind: 'testimonial' },
          { id: 'sec-home-faq', kind: 'faq' },
          { id: 'sec-home-news', kind: 'newsletter' },
        ] },
      ] },
      product: { list: [
        { id: 'default', name: 'Default product', isDefault: true, assigned: 8, assignedResourceIds: ['p8', 'p11', 'p13', 'p15', 'p16', 'p18', 'p19', 'p20'], sections: [
          // OOB PDP section list (PRD 3.3.2): Breadcrumbs · Product information · Media with text · Testimonial · FAQ
          { id: 'sec-pdp-bc', kind: 'breadcrumbs', hidden: true },
          { id: 'sec-pdp-main', kind: 'product-main', blocks: [
            { kind: 'badges', settings: { show_sold_out: false, show_saving: false, badge_position: 'left', badge_icon: 'none', badge_gap: 8 } },
            { kind: 'title', settings: { title_size: 30 } },
            { kind: 'price', settings: { show_taxes: false, show_saving: true, saving_type: 'percentage', saving_style: 'filled', saving_position: 'right' } },
            { kind: 'rating', settings: { layout: 'default', star_style: 'boxed', style: 'stars-rating-custom', custom_text: 'Trusted by 2000+', underline_text: false, size: 14, color: '#0f3636', text_color: '' } },
            { kind: 'inventory', settings: { show_status: true, show_count: true, low_stock_threshold: 5, status_style: 'dot', in_stock_color: '#10a443', status_color: '#f59e0b' } },
            { kind: 'variant', settings: { hide_sold_out: false, picker_type: 'buttons', swatch_style: 'color', shape: 'normal', show_group_title: true } },
            { kind: 'buy', settings: { show_quantity: true, show_add: true, atc_layout: 'with-quantity', atc_icon: 'bag-plus', atc_background: '#FFC439', atc_text_color: '#FFFFFF', atc_shape: 'pill', atc_custom_radius: 8, show_dynamic: true, channels: ['buy_now', 'paypal'], buy_now_text: 'Buy now', buy_now_background: '#000000', buy_now_text_color: '#FFFFFF', dyn_shape: 'pill', dyn_custom_radius: 8, show_payment_options: true, channel_logo: true, show_safe_checkout: true, safe_checkout_align: 'center', safe_checkout_label: 'GUARANTEED SAFE CHECKOUT', trust_logos: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay'], trust_logo_size: 24 } },
            { kind: 'icon_text', settings: { layout: 'horizontal', item_layout: 'icon-left', alignment: 'left', font: 'body', size: 15, icon_size: 20, item_gap: 24, icon_text_gap: 8, background: false, background_color: '#f6f6f6', corner_radius: 10, text_color: '', icon_color: '', card_style: 'none', icon_1: 'box', image_1: '', first_heading: 'Orders over $50 ship free', first_content: '', icon_2: 'return', image_2: '', second_heading: '30 day returns', second_content: '', icon_3: 'star', image_3: '', third_heading: '', third_content: '' } },
            { kind: 'collapsible', settings: { heading: 'Overview', icon: 'none', open: false } },
            { kind: 'collapsible', settings: { heading: 'Details', icon: 'none', open: false } },
            { kind: 'recommendations', settings: { heading: 'You Might Also Like', per_row: 2, mobile_count: 2, empty_behavior: 'hide', dedupe_current: true } },
            { kind: 'sticky', settings: { show_image: true, show_title: true, show_price: true, show_quantity: true, appear_at: 'scroll', mobile_visible: true } },
          ] },
          { id: 'sec-pdp-iwt', kind: 'media-with-text' },
          { id: 'sec-pdp-reviews', kind: 'testimonial' },
          { id: 'sec-pdp-faq', kind: 'faq' },
        ] },
        { id: 'pdp-wellness', name: 'Wellness product', assigned: 6, assignedResourceIds: ['p7', 'p9', 'p10', 'p12', 'p14', 'p17'], sections: [
          { id: 'sec-well-bc', kind: 'breadcrumbs', hidden: false },
          { id: 'sec-well-main', kind: 'product-main', blocks: [
            { kind: 'badges', settings: { show_sold_out: false, show_saving: true, saving_type: 'percentage', badge_position: 'left', badge_icon: 'leaf', custom_tag_style: 'filled', hot_badge_bg: '#1f6b4a', hot_badge_text_color: '#ffffff', new_badge_bg: '#FFC439', new_badge_text_color: '#ffffff', badge_gap: 8 } },
            { kind: 'title', settings: { title_size: 28 } },
            { kind: 'price', settings: { show_taxes: false, show_saving: true, saving_type: 'percentage', saving_style: 'filled', saving_position: 'right' } },
            { kind: 'rating', settings: { layout: 'default', star_style: 'regular', style: 'stars-rating-custom', size: 14, color: '#f5b301', custom_text: 'Trusted by 2000+' } },
            { kind: 'inventory', settings: { show_status: true, show_count: true, low_stock_threshold: 8, status_style: 'dot', in_stock_color: '#10a443', status_color: '#f59e0b' } },
            { kind: 'variant', settings: { hide_sold_out: false, picker_type: 'buttons', swatch_style: 'text', shape: 'normal', show_group_title: true } },
            { kind: 'buy', settings: { show_quantity: true, show_add: true, atc_layout: 'with-quantity', atc_icon: 'bag-plus', show_dynamic: true, show_payment_options: true, atc_shape: 'pill', dyn_shape: 'pill', channels: ['paypal', 'apple_pay', 'google_pay'], channel_logo: true, show_safe_checkout: true, safe_checkout_label: 'GUARANTEED SAFE CHECKOUT', trust_logos: ['norton', 'paypal', 'visa', 'mastercard', 'mcafee', 'money_back', 'amex', 'discover', 'apple_pay', 'google_pay'], trust_logo_size: 24 } },
            { kind: 'icon_text', settings: { layout: 'horizontal', item_layout: 'icon-left', alignment: 'left', font: 'body', size: 15, icon_size: 20, item_gap: 24, icon_text_gap: 8, background: true, background_color: '#f6f6f6', corner_radius: 10, text_color: '', icon_color: '', card_style: 'outline', icon_1: 'truck', image_1: '', first_heading: 'Express shipping', first_content: '', icon_2: 'shield', image_2: '', second_heading: '90-day money-back', second_content: '', icon_3: 'leaf', image_3: '', third_heading: 'Clean ingredients', third_content: '' } },
            { kind: 'shipping', settings: { delivery_text: 'Estimated delivery:', days: 5, date_format: '%b %d', timezone: 'store' } },
            { kind: 'featured_reviews', settings: { heading: 'What Our Customers Are Saying', layout: 'trust', data_source: 'auto', auto_count: 3, reviews: [], show_image: true, show_avatar: true, round_avatar: true, star_color: '#16a34a', show_verified: true, verified_text: 'Verified Customer', verified_subtext: 'Real customer · Verified order · Real buyer', scroll: true, nav_style: 'auto', auto_play: false, cards_per_row: 1 } },
            { kind: 'video_column', settings: { heading: '', heading_color: '', per_row: 4, mobile_count: 2, gap: 10, corner_radius: 12, video_border: 'transparent', show_play_button: true } },
            { kind: 'collapsible', settings: { heading: 'Supplement facts', icon: 'clipboard', open: true, accordion_mode: true, icon_position: 'right' } },
            { kind: 'collapsible', settings: { heading: 'How to use', icon: 'stopwatch', open: false, accordion_mode: true, icon_position: 'right' } },
            { kind: 'collapsible', settings: { heading: 'Ingredients', icon: 'leaf', open: false, accordion_mode: true, icon_position: 'right' } },
            { kind: 'recommendations', settings: { heading: 'You Might Also Like', per_row: 2, mobile_count: 2, empty_behavior: 'hide', dedupe_current: true } },
            { kind: 'sticky', settings: { show_image: true, show_title: true, show_price: true, show_quantity: true, appear_at: 'scroll', mobile_visible: true, button_text: 'Add to cart' } },
          ] },
          { id: 'sec-well-story', kind: 'media-with-text' },
          { id: 'sec-well-reviews', kind: 'testimonial', settings: { heading: 'What Our Customers Are Saying' } },
          { id: 'sec-well-faq', kind: 'faq' },
          { id: 'sec-well-video', kind: 'video-feed', settings: { heading: '', video_card_style: 'simple', desktop_videos: 4, layout_style: 'carousel' } },
          { id: 'sec-well-related', kind: 'related-products' },
        ] },
        { id: 'pdp-apparel', name: 'Swim product', assigned: 1, assignedResourceIds: ['swim-aruba'], sections: [
          { id: 'sec-app-bc', kind: 'breadcrumbs', hidden: false },
          { id: 'sec-app-main', kind: 'product-main', settings: {
            desktop_media_size: 'medium',
            desktop_media_layout: 'collage-2',
            mobile_thumbnails: true,
            enable_zoom: true,
            padding_top: 0,
            padding_bottom: 72,
            size_style: 'outline',
            swatch_ring: true,
          }, blocks: [
            { kind: 'title', settings: { title_size: 34, title_weight: '200', title_letter_spacing: -0.04, title_margin_bottom: 17, title_font_family: 'Montserrat', description: '', description_color: '#666666', description_size: 14, description_top: 6, description_bottom: 0 } },
            { kind: 'price', settings: { show_taxes: false, show_saving: true, saving_type: 'percentage', saving_style: 'outline', saving_position: 'right', size: 24, weight: '300' } },
            { kind: 'rating', settings: { layout: 'default', star_style: 'regular', style: 'stars-and-count', size: 13, color: '#232323', review_label: 'reviews', underline_text: false } },
            { kind: 'description', settings: { text: '', width: 'fill', alignment: 'left', background: true, background_color: '#ececec', corner_radius: 0, padding_top: 15, padding_bottom: 14, padding_left: 17, padding_right: 17 } },
            { kind: 'variant', settings: { hide_sold_out: false, picker_type: 'buttons', swatch_style: 'color', shape: 'normal', show_group_title: true } },
            { kind: 'popup', settings: { label: 'Size guide', page: 'pg-swim-size-chart', popup_width: 560, popup_height: 420 } },
            { kind: 'buy', settings: { show_quantity: true, show_add: true, atc_layout: 'full-width', atc_icon: 'none', atc_background: '#232323', atc_text_color: '#ffffff', atc_shape: 'square', atc_custom_radius: 0, show_dynamic: false, channels: [], buy_now_text: 'Buy it now', buy_now_background: '#232323', buy_now_text_color: '#ffffff', dyn_shape: 'square', dyn_custom_radius: 0, show_payment_options: false, channel_logo: false, show_safe_checkout: false } },
            { kind: 'icon_text', settings: { layout: 'horizontal', item_layout: 'icon-top', alignment: 'center', font: 'body', size: 12, icon_size: 24, item_gap: 30, icon_text_gap: 8, background: false, background_color: '#f6f6f6', corner_radius: 0, text_color: '#232323', icon_color: '#232323', card_style: 'none', icon_1: 'world', image_1: '', first_heading: '<strong>Free shipping</strong>', first_content: 'Worldwide', icon_2: 'beach', image_2: '', second_heading: '<strong>Beach Ready</strong>', second_content: 'Styles for all', icon_3: 'leaf', image_3: '', third_heading: '<strong>Eco Swimwear</strong>', third_content: 'Sustainable' } },
            { kind: 'collapsible', settings: { heading: 'Description', icon: 'eye', icon_position: 'right', open: false, accordion_mode: true, content: '<p>This bombshell bra will flatter any shape and provide just the right amount of support. Adjustable straps and underwire make this top as comfortable as it is cute and classy. Bottom sold separately.</p>' } },
            { kind: 'collapsible', settings: { heading: 'Shipping & Returns', icon: 'box', icon_position: 'right', open: false, accordion_mode: true, content: '<p>Free 2 Day Shipping on Orders $50+. Returns must be postmarked within 15 days of delivery for a refund and within 30 days for a store credit or exchange. Read our full returns policy in our FAQ page.</p>' } },
            { kind: 'collapsible', settings: { heading: 'Tops and bottoms sold separately', icon: 'price-tag', icon_position: 'right', open: false, accordion_mode: true, content: '<p>All suits are sold as separates. Tops and bottoms are paired together in pictures, so check the product title to confirm which piece you are purchasing.</p>' } },
            { kind: 'recommendations', settings: { subheading: '', heading: 'Related products', content: '', products: ['swim-cecilia', 'swim-belize'], per_row: 2, mobile_count: 2, image_ratio: 'portrait', empty_behavior: 'hide', exclude_soldout: false, dedupe_current: true } },
            { kind: 'sticky', settings: { show_image: true, show_title: true, show_price: true, show_quantity: true, appear_at: 'scroll', mobile_visible: true, width_mode: 'container', desktop_button_width: 320, button_text: 'Add to cart' } },
          ] },
          // OOB PDP page sections after Product information
          { id: 'sec-app-iwt', kind: 'media-with-text', settings: { section_heading: 'Beach Ready', section_subheading: '', heading_alignment: 'center' }, blocks: [
            { kind: 'image', settings: { image: SWIM_IMG.detail, image_width: 50, image_position: 'left', subheading: 'B Swim', heading: 'Made for sunny days', content: 'Supportive swim separates designed to flatter every shape. Pair this top with your favorite B Swim bottom.', button_text: 'Shop swim bottoms', button_url: '#', button_style: 'text' } },
            { kind: 'image', settings: { image: SWIM_IMG.santorini, image_width: 50, image_position: 'right', subheading: 'Eco Swimwear', heading: 'A better beach wardrobe', content: 'Recycled swim fabric, adjustable support, and colors made to mix across the collection.', button_text: 'Explore the collection', button_url: '#', button_style: 'underline' } },
          ] },
          { id: 'sec-app-testi', kind: 'testimonial', settings: { heading: 'Customer favorites' } },
          { id: 'sec-app-faq', kind: 'faq', settings: {
            layout_style: 'and-text',
            heading: 'Pre-order FAQs',
            content: 'Questions about pre-orders? Open the answers below or email <a href="mailto:hello@aura.shop">hello@aura.shop</a>.',
            support_hours: '',
            answer_time: '',
            text_position: 'left',
            accordion_background: '#f6f6f6',
          }, blocks: [
            { kind: 'item', settings: { question: 'What is a pre-order?', answer: '<p>A pre-order reserves a product before its scheduled release. It ships as soon as it is back in stock.</p>' } },
            { kind: 'item', settings: { question: 'How do I place a pre-order?', answer: '<p>Select your color and size, then click Pre-order. Your order confirmation will include the reservation details.</p>' } },
            { kind: 'item', settings: { question: 'When will I be charged?', answer: '<p>Your payment method is validated when you order and charged when the product is ready to ship.</p>' } },
            { kind: 'item', settings: { question: 'When will I receive my pre-order?', answer: '<p>We send an email before the release date and ship as soon as inventory arrives. Delivery timing can vary by destination.</p>' } },
          ] },
        ] }
      ] },
      collection: { list: [
        { id: 'default', name: 'Default collection', assigned: '100+', assignedResourceIds: ['best-sellers', 'new-arrivals', 'dresses', 'tops', 'bottoms', 'sale'], sections: [
          { id: 'sec-col-banner', kind: 'collection-banner' },
          { id: 'sec-col-list', kind: 'collection-list' },
          { id: 'sec-col-page', kind: 'collection-page' },
        ] },
        { id: 'sale-2026', name: 'sale-2026', basedOn: 'default', assigned: 3, assignedResourceIds: ['sale', 'best-sellers', 'new-arrivals'], sections: [
          { kind: 'collection-banner' }, { kind: 'collection-page' },
        ] },
      ] },
      collections: { list: [
        { id: 'default', name: 'Collections list', assigned: '—', sections: [
          { id: 'sec-cols-list', kind: 'list-collections' },
        ] },
      ] },
    },
  };

  // ==========================================================================
  //  CHECKOUT THEME (V Theme-Checkout PRD) — separate editor surface
  //  Fixed transaction skeleton + configurable styles. Distinct from the
  //  Home/Collection/PDP theme settings above. (PRD §3, §5, §6)
  // ==========================================================================

  // Checkout editor page selector — both transaction pages share one theme (Thank you PRD §23.1).
  // Checkout theme is its own editing environment with FOUR multi-template page types
  // (PRD §3.2/§5.2).
  const CHECKOUT_PAGES = [
    { value: 'checkout', label: 'Checkout',  multi: true },
    { value: 'upsell',   label: 'Upsell',    multi: true },
    { value: 'downsell', label: 'Downsell',  multi: true },
    { value: 'thankyou', label: 'Thank you', multi: true },
  ];

  // Seed template lists per checkout page type (PRD §6.3/§6.4). `isDefault` marks the
  // built-in fallback.
  // Upsell/Downsell share one post-purchase offer builder; Funnel/Offer services provide
  // products, prices, routing and payment capability while Theme owns presentation only.
  const CHECKOUT_TEMPLATE_SETS = {
    checkout: [
      // Keep the established ids for backward-compatible saved themes and preview URLs.
      { id: 'standard', name: 'Checkout - New customer offer', isDefault: true },
      { id: 'conversion', name: 'Checkout - Returning customer cross-sell' },
      { id: 'trust-led', name: 'Checkout - Trust-led' },
      { id: 'concise', name: 'Checkout - Concise' },
      { id: 'social-proof', name: 'Checkout - Social Proof', status: 'draft' },
    ],
    upsell: [
      { id: 'one-click-upsell', name: 'Upsell - New customer offer', isDefault: true },
      { id: 'subscription-upsell', name: 'Upsell - Returning customer cross-sell' },
      { id: 'residual-offer', name: 'Upsell - Shared residual offer' },
      { id: 'limited-proof', name: 'Upsell - Limited-time Proof', status: 'draft' },
    ],
    downsell: [
      { id: 'standard-downsell', name: 'Downsell - New customer offer', isDefault: true },
      { id: 'save-offer', name: 'Downsell - Returning customer cross-sell' },
      { id: 'residual-save', name: 'Downsell - Shared residual save' },
      { id: 'gentle-last-chance', name: 'Downsell - Gentle Last Chance', status: 'draft' },
    ],
    thankyou: [
      { id: 'standard', name: 'Default thank you', isDefault: true, previewOrderScenario: 'standard' },
      { id: 'base-order', name: 'Base order', basedOn: 'standard', previewOrderScenario: 'base' },
      { id: 'survey-thankyou', name: 'Base order + Late Upsell order', previewOrderScenario: 'dual' },
      { id: 'brand-celebration', name: 'Thank you - Brand Celebration', status: 'draft', previewOrderScenario: 'standard' },
    ],
  };

  const CHECKOUT_HEADING_FONTS = [
    { value: 'Default', label: 'Default' },
    { value: "Georgia, 'Times New Roman', serif", label: 'Georgia' },
    { value: "'Avenir Next', 'Segoe UI', sans-serif", label: 'Avenir Next' },
    { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet' },
    { value: "'Courier New', monospace", label: 'Courier' },
    { value: "'Playfair Display', Georgia, serif", label: 'Playfair Display' },
    { value: 'Marcellus, Georgia, serif', label: 'Marcellus' },
    { value: "'Cormorant Garamond', Georgia, serif", label: 'Cormorant Garamond' },
  ];
  const CHECKOUT_BODY_FONTS = [
    { value: 'Default', label: 'Default' },
    { value: "Georgia, 'Times New Roman', serif", label: 'Georgia' },
    { value: "'Avenir Next', 'Segoe UI', sans-serif", label: 'Avenir Next' },
    { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet' },
    { value: "'Courier New', monospace", label: 'Courier' },
    { value: 'Inter, Arial, sans-serif', label: 'Inter' },
    { value: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif", label: 'SF Pro' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  ];

  // Checkout Theme settings — 6 groups / 20 fields (Theme settings normalization PRD §3).
  // `pages` on a group / field lists where the setting has a consuming element; the editor
  // hides everything else on the current page (PRD §6). Omitted = all four pages.
  // Removed fields (text / muted / divider, Header group, summary text colors, button height,
  // font sizes & weights, section spacing, mobile padding) are frozen constants in
  // checkoutVars(); text colors now auto-switch by background luminance (PRD §4.1).
  const CK_SUMMARY_PAGES = ['checkout', 'thankyou'];
  const CHECKOUT_SETTINGS_GROUPS = [
    { key: 'main', name: 'Main', desc: 'Page surface', open: true, fields: [
      { key: 'page_background', label: 'Page background', control: 'color', default: '#FFFFFF', info: 'Text color adjusts automatically for readability.' },
    ] },
    { key: 'order_summary', name: 'Order summary', desc: 'Right-hand summary surface', pages: CK_SUMMARY_PAGES, fields: [
      { key: 'summary_background', label: 'Background', control: 'color', default: '#F5F5F5', info: 'Text color adjusts automatically for readability. Applies to the desktop summary, the mobile summary bar and the Thank you summary.' },
    ] },
    { key: 'accent', name: 'Accent and buttons', desc: 'Links, selected states & primary buttons', fields: [
      { key: 'accent_color', label: 'Accent color', control: 'color', default: '#121212', info: 'Links, selected state, radio, checkbox, focus ring and success icon.' },
      { key: 'button_background', label: 'Button background', control: 'color', default: '#121212', info: 'Pay now, Apply, Continue shopping and Add to my order.' },
      { key: 'button_text_color', label: 'Button text color', control: 'color', default: '#FFFFFF' },
      { key: 'button_hover_background', label: 'Button hover background', control: 'color', default: '#000000' },
      { key: 'button_border_radius', label: 'Button border radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 6 },
    ] },
    { key: 'input', name: 'Input fields', desc: 'Contact, Delivery, Billing, Payment & Discount code', pages: ['checkout'], fields: [
      { key: 'input_background', label: 'Input background', control: 'color', default: '#FFFFFF' },
      { key: 'input_text_color', label: 'Input text color', control: 'color', default: '#1F1F1F' },
      { key: 'placeholder_color', label: 'Placeholder color', control: 'color', default: '#B5B5B5' },
      { key: 'input_border_color', label: 'Input border color', control: 'color', default: '#D9D9D9' },
      { key: 'input_focus_border_color', label: 'Input focus border color', control: 'color', default: '', info: 'Uses the Accent color when empty.' },
      { key: 'input_error_color', label: 'Input error color', control: 'color', default: '#D72C2C' },
      { key: 'input_border_radius', label: 'Input border radius', control: 'range', min: 0, max: 24, step: 1, unit: 'px', default: 12 },
      { key: 'input_height', label: 'Input height', control: 'range', min: 40, max: 64, step: 1, unit: 'px', default: 40 },
      { key: 'transparent_input', label: 'Transparent input', control: 'toggle', default: false },
      { info: 'Fields rendered by payment providers keep their own styling.' },
    ] },
    { key: 'typography', name: 'Typography', desc: 'Heading & body fonts', fields: [
      { key: 'heading_font', label: 'Heading font', control: 'select', options: CHECKOUT_HEADING_FONTS, default: 'Default', info: 'Store name, section titles and the Thank you title.' },
      { key: 'body_font', label: 'Body font', control: 'select', options: CHECKOUT_BODY_FONTS, default: 'Default', info: 'Everything else, including totals and amounts.' },
    ] },
    { key: 'layout', name: 'Layout', desc: 'Width and columns', fields: [
      { key: 'page_max_width_pc', label: 'Page max width PC', control: 'range', min: 900, max: 1280, step: 1, unit: 'px', default: 980 },
      { key: 'column_gap', label: 'Column gap', control: 'range', min: 16, max: 80, step: 1, unit: 'px', default: 40, pages: CK_SUMMARY_PAGES },
    ] },
  ];
  // Theme fields removed in settingsVersion 2 — stripped from older snapshots on load.
  const CHECKOUT_SETTINGS_REMOVED = {
    main: ['text_color', 'muted_text_color', 'divider_color'],
    header: null, // whole group; header_height_pc / header_height_mobile migrate into the Header component
    order_summary: ['summary_text', 'summary_muted_text'],
    accent: ['button_height'],
    typography: ['base_font_size', 'heading_font_size', 'font_weight_heading', 'font_weight_body'],
    layout: ['section_spacing', 'mobile_page_padding'],
  };

  // Checkout commerce components (Commerce PRD §14.1) — the addable "transaction
  // enhancement" group. Unlike the required skeleton, these can be added / hidden /
  // deleted / reordered in the editor.
  const CHECKOUT_COMMERCE = [
    { kind: 'checkout-product-upsell', name: 'Product upsell', desc: 'Recommend extra products with one-tap add' },
    { kind: 'checkout-shipping-insurance', name: 'Shipping Insurance', desc: 'Tickable delivery-protection service' },
    { kind: 'checkout-vip-club', name: 'VIP Club', desc: 'Tickable membership add-on' },
  ];

  // Allowed insertion zones for commerce components. Each zone sits right after an anchor
  // (required) component. To keep merchant configuration simple, every commerce component
  // may live in any of the five zones (no per-component matrix). `col` decides the render
  // column: 'main' = left form column, 'summary' = under the Order Summary (right column on
  // PC, after the bottom Order Summary on mobile).
  const CK_COMMERCE_KINDS = ['checkout-product-upsell', 'checkout-shipping-insurance', 'checkout-vip-club'];

  // Checkout content & trust components (Content PRD §2) — the third, "content & trust
  // enhancement" group. Static-only: never touches order / amount / shipping / tax /
  // payment data. Addable / hideable / deletable / draggable like the commerce group,
  // but most are Section + Block components with their own block lists.
  const CHECKOUT_CONTENT = [
    { kind: 'announcement-bar', name: 'Announcement Bar', desc: 'Top promo / free-shipping bar (reused from Online Store)' },
    { kind: 'checkout-countdown', name: 'Countdown', desc: 'Static urgency / reservation timer' },
    { kind: 'checkout-payment-icons', name: 'Payment Icons', desc: 'Accepted-payment brand badges' },
    { kind: 'checkout-trust-badges', name: 'Trust badges', desc: 'Guarantee / security / shipping badges' },
    { kind: 'checkout-trustpilot', name: 'Trustpilot Review', desc: 'Trustpilot-style rating & reviews (static)' },
    { kind: 'checkout-review-card', name: 'Review card', desc: 'Expert / media endorsement cards' },
    { kind: 'checkout-testimonials', name: 'Testimonials', desc: 'Customer reviews (bottom area only)' },
    { kind: 'checkout-fb-comments', name: 'Facebook-style Comments', desc: 'Social-proof comment thread' },
    { kind: 'checkout-static-content', name: 'Static content', desc: 'Notice / card / rich-text block' },
    { kind: 'checkout-footer', name: 'Footer', desc: 'Checkout footer (bottom of page only)' },
  ];
  // The 7 content components that may live in any of the standard insertion zones
  // (Header / Contact / Shipping / Payment / CTA / Order Summary), per PRD §5.1.
  const CK_CONTENT_FLEX = ['checkout-countdown', 'checkout-trust-badges', 'checkout-static-content',
    'checkout-payment-icons', 'checkout-trustpilot', 'checkout-review-card', 'checkout-fb-comments'];
  const CK_FLEX = CK_COMMERCE_KINDS.concat(CK_CONTENT_FLEX);

  // Insertion zones. `col` decides the render region: 'announce' = full-bleed top (above
  // header), 'main' = left form column, 'summary' = under the Order Summary, 'bottom' =
  // full-bleed bottom band (Testimonials → Footer). Announcement Bar is locked to the
  // top; Testimonials/Footer to the bottom (PRD §5.3).
  const CHECKOUT_ZONES = [
    { id: 'announce', label: 'Above header', after: null, col: 'announce', allow: ['announcement-bar'] },
    { id: 'header', label: 'Below header', after: 'checkout-header', col: 'main', allow: CK_CONTENT_FLEX.slice() },
    { id: 'contact', label: 'Below Contact information', after: 'checkout-contact', col: 'main', allow: CK_FLEX.slice() },
    { id: 'shipping', label: 'Below Shipping method', after: 'checkout-shipping-method', col: 'main', allow: CK_FLEX.slice() },
    { id: 'payment', label: 'Below Payment method', after: 'checkout-payment', col: 'main', allow: CK_FLEX.slice() },
    { id: 'cta', label: 'Below CTA', after: 'checkout-cta', col: 'main', allow: CK_FLEX.slice() },
    { id: 'summary', label: 'Below Order Summary', after: 'checkout-order-summary', col: 'summary', allow: CK_FLEX.slice() },
    { id: 'bottom', label: 'Page bottom', after: 'checkout-policy-links', col: 'bottom', allow: ['checkout-testimonials', 'checkout-footer'] },
  ];

  const checkoutSummaryBlocks = (prefix) => [
    { id: prefix + '-blk-lines', kind: 'cart-lines' },
    { id: prefix + '-blk-coupon', kind: 'coupon' },
    { id: prefix + '-blk-subtotal', kind: 'subtotal' },
    { id: prefix + '-blk-discount', kind: 'discount' },
    { id: prefix + '-blk-shipping', kind: 'shipping' },
    { id: prefix + '-blk-tax', kind: 'tax' },
    { id: prefix + '-blk-total', kind: 'total' },
  ];
  const checkoutPolicy = () => ({
    refund_policy_page: 'pg-refund', privacy_policy_page: 'pg-privacy',
    terms_of_service_page: 'pg-terms',
  });
  // Shared records from the production default-template export. The prototype keeps
  // Header / Policy Links as section instances, so the adapter injects these global
  // records into each imported first template without changing the remaining presets.
  const productionHeaderSettings = () => ({
    logo_image: '', logo_width: 128, logo_width_mobile: 128, logo_position: 'center',
    show_trust_text: true, trust_text: '', show_secure_badge: false, secure_text: '',
    show_contact_info: false, contact_title: '', contact_email: '', contact_phone: '',
    show_cart_icon: true, background_color: '', text_color: '', accent_color: '',
    height_pc: 80, height_mobile: 44,
    show_divider: true, custom_css: '',
  });
  const productionPolicySettings = () => ({
    refund_policy_page: '', privacy_policy_page: '', terms_of_service_page: '',
    shipping_policy_page: '', contact_page: '', link_color: '',
    text_size: 'medium', text_alignment: 'left',
  });
  const checkoutTrustBadges = (prefix, opts) => ({
    id: prefix + '-trust', kind: 'checkout-trust-badges', zone: (opts && opts.zone) || 'summary', settings: {
      heading: (opts && opts.heading) || 'Shop with confidence', layout: (opts && opts.layout) || 'grid',
      per_row_desktop: (opts && opts.per_row_desktop) || 2, per_row_mobile: (opts && opts.per_row_mobile) || 1,
      icon_size: (opts && opts.icon_size) || 40,
    }, blocks: [
      { id: prefix + '-trust-payment', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'lock', title: 'Secure payment',
        description: 'Your payment information is encrypted and protected.',
      } },
      { id: prefix + '-trust-confirmation', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'check', title: 'Email confirmation',
        description: 'We will email your order details after payment.',
      } },
      { id: prefix + '-trust-status', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'truck', title: 'Track order status',
        description: 'Follow fulfillment updates from your order confirmation.',
      } },
      { id: prefix + '-trust-privacy', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'shield', title: 'Privacy protected',
        description: 'Your personal details are handled securely throughout checkout.',
      } },
    ],
  });

  // Showcase (Draft) helpers — richer decoration samples. Sample reviews / endorsements
  // are layout-only; these templates stay off preset Flows until a merchant replaces them.
  const showcaseAnnouncement = (prefix, messages) => ({
    id: prefix + '-announce', kind: 'announcement-bar', zone: 'announce',
    settings: { navigation: 'arrows', auto_rotate: true, rotate_seconds: 5, text_size: 'medium' },
    blocks: messages.map((text, i) => ({
      id: prefix + '-ann-' + (i + 1), kind: 'message', settings: { text },
    })),
  });
  const showcasePayIcons = (prefix, zone, heading) => ({
    id: prefix + '-payicons', kind: 'checkout-payment-icons', zone: zone,
    settings: { heading: heading || 'We accept', layout: 'inline', alignment: 'left', icon_size: 42 },
    blocks: ['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'shoppay'].map((brand) => ({
      id: prefix + '-pi-' + brand, kind: 'payicon', settings: { icon_source: 'builtin', built_in: brand },
    })),
  });
  const showcaseCountdown = (prefix, zone, opts) => ({
    id: prefix + '-countdown', kind: 'checkout-countdown', zone: zone,
    settings: Object.assign({
      style: 'alert', icon: 'clock', prefix_text: 'We will reserve your order for',
      duration: 12, time_format: 'mmss', expired_behavior: 'stop',
      text_alignment: 'left', background_color: '#FFF8EB', text_color: '#7A4A00',
      border_color: '#F5D9A8', border_radius: 8,
    }, opts || {}),
  });
  const showcaseReviewCard = (prefix, zone, cards) => ({
    id: prefix + '-review', kind: 'checkout-review-card', zone: zone,
    settings: { layout: 'carousel', card_background: '#FFFFFF', border_color: '#E5E5E5', border_radius: 10 },
    blocks: cards.map((card, i) => ({
      id: prefix + '-rc-' + (i + 1), kind: 'card', hidden: false,
      settings: Object.assign({ image: IMG.av2, badge_image: '', image_position: 'left' }, card),
    })),
  });
  const showcaseTrustpilot = (prefix, zone, reviews) => ({
    id: prefix + '-tp', kind: 'checkout-trustpilot', zone: zone,
    settings: { rating_label: 'Excellent', overall_rating: 4.8, show_trustpilot: true, trustpilot_text: 'Trustpilot' },
    blocks: reviews.map((review, i) => ({
      id: prefix + '-tp-' + (i + 1), kind: 'review', hidden: false,
      settings: Object.assign({ star_rating: 5, verified_text: 'Verified customer' }, review),
    })),
  });
  const showcaseTestimonials = (prefix, opts) => ({
    id: prefix + '-tm', kind: 'checkout-testimonials', zone: 'policytop',
    settings: Object.assign({
      subheading: 'Loved by shoppers', heading: 'What our customers say',
      desktop_columns: 3, mobile_columns: 1,
    }, opts || {}),
    blocks: [
      { id: prefix + '-tm-1', kind: 'review', settings: {
        avatar: IMG.av1, round_avatar: true, show_rating: true, rating: 5, author: 'Sarah M.',
        show_verified: true, heading: 'Pure quality',
        content: 'The fit is perfect and the fabric feels amazing. I\u2019ve already ordered two more.',
      } },
      { id: prefix + '-tm-2', kind: 'review', settings: {
        avatar: IMG.av2, round_avatar: true, show_rating: true, rating: 4.5, author: 'James L.',
        show_verified: true, heading: 'Great value',
        content: 'Shipping was fast and the product exceeded my expectations for the price.',
      } },
      { id: prefix + '-tm-3', kind: 'review', settings: {
        avatar: IMG.av3, round_avatar: true, show_rating: true, rating: 5, author: 'Mei K.',
        show_verified: true, heading: 'Obsessed',
        content: 'My new favourite. Comfortable enough to wear every single day.',
      } },
    ],
  });
  const showcaseFooter = (prefix, brand) => ({
    id: prefix + '-footer', kind: 'checkout-footer', zone: 'bottom',
    settings: {
      brand_name: brand || 'AURA',
      disclaimer: '<p>Replace sample reviews and endorsements with your own verified content before you publish.</p>',
      show_policy_links: true, show_contact_info: true,
      contact_email: 'hello@aura.example', copyright_text: 'Copyright {{ year }} · AURA',
      show_payment_icons: true, background_color: '#083B1F', text_color: '#FFFFFF',
      link_color: '#FFFFFF', text_alignment: 'center', padding_top: 40, padding_bottom: 40,
    },
    blocks: [
      { id: prefix + '-ft-p1', kind: 'policy', settings: { link_text: 'Privacy Policy', open_new_tab: true } },
      { id: prefix + '-ft-p2', kind: 'policy', settings: { link_text: 'Refund Policy', open_new_tab: true } },
      { id: prefix + '-ft-p3', kind: 'policy', settings: { link_text: 'Terms of Service', open_new_tab: true } },
      { id: prefix + '-ft-s1', kind: 'social', settings: { platform: 'instagram', open_new_tab: true } },
      { id: prefix + '-ft-s2', kind: 'social', settings: { platform: 'tiktok', open_new_tab: true } },
      { id: prefix + '-ft-s3', kind: 'social', settings: { platform: 'facebook', open_new_tab: true } },
      { id: prefix + '-ft-pay1', kind: 'payment', settings: { icon_source: 'builtin', built_in: 'visa' } },
      { id: prefix + '-ft-pay2', kind: 'payment', settings: { icon_source: 'builtin', built_in: 'mastercard' } },
      { id: prefix + '-ft-pay3', kind: 'payment', settings: { icon_source: 'builtin', built_in: 'amex' } },
      { id: prefix + '-ft-pay4', kind: 'payment', settings: { icon_source: 'builtin', built_in: 'paypal' } },
      { id: prefix + '-ft-pay5', kind: 'payment', settings: { icon_source: 'builtin', built_in: 'applepay' } },
    ],
  });
  const checkoutCoreSections = (prefix, headerSettings, additions) => {
    const extras = additions || [];
    const inZone = (zone) => extras.filter((section) => section.zone === zone);
    const knownZones = ['announce', 'header', 'contact', 'shipping', 'payment', 'cta', 'summary', 'bottom'];
    const unzoned = extras.filter((section) => !section.zone || knownZones.indexOf(section.zone) < 0);
    const core = [
      ...inZone('announce'),
      { id: prefix + '-header', kind: 'checkout-header', settings: headerSettings || {} },
      { id: prefix + '-summary-bar', kind: 'checkout-order-summary-bar' },
      ...inZone('header'),
      { id: prefix + '-express', kind: 'checkout-express' },
      { id: prefix + '-contact', kind: 'checkout-contact' },
      ...inZone('contact'),
      { id: prefix + '-shipinfo', kind: 'checkout-shipping-info' },
      { id: prefix + '-shipmethod', kind: 'checkout-shipping-method' },
      ...inZone('shipping'),
      { id: prefix + '-payment', kind: 'checkout-payment' },
      ...inZone('payment'),
    ];
    core.push(
      { id: prefix + '-cta', kind: 'checkout-cta', settings: { button_text: 'Pay now' } },
      ...inZone('cta'),
      { id: prefix + '-summary', kind: 'checkout-order-summary', blocks: checkoutSummaryBlocks(prefix) },
      ...inZone('summary'),
      { id: prefix + '-policy', kind: 'checkout-policy-links', settings: checkoutPolicy() },
      ...unzoned,
      ...inZone('bottom'),
    );
    return core;
  };

  // First Checkout preset mirrors defaulttemplates/checkout.json. Disabled addable
  // sections stay in the tree so merchants can opt in without recreating their content.
  const FIRST_PURCHASE_CHECKOUT_TEMPLATE = {
    sections: [
      { id: 'nco-ck-header', kind: 'checkout-header', settings: productionHeaderSettings() },
      { id: 'nco-ck-summary-bar', kind: 'checkout-order-summary-bar', settings: {
        heading: 'Order summary', mobile_default: 'expanded',
      } },
      { id: 'nco-ck-static-content-1', kind: 'checkout-static-content', zone: 'header', hidden: true, settings: {
        content_style: 'notice', icon: 'check', icon_image: '',
        heading: 'Your payment is protected',
        content: '<p>Card details stay encrypted. We email your confirmation immediately and send tracking as soon as the order ships. Your personal information is not shared.</p>',
        link_text: '', link_url: '', open_new_tab: true, text_alignment: 'left',
        background_color: '#F0F9EB', text_color: '#1F1F1F',
        border_color: '#CDEBC8', border_radius: 4, custom_css: '',
      } },
      { id: 'nco-ck-express', kind: 'checkout-express', settings: {
        heading: 'Express checkout',
      } },
      { id: 'nco-ck-contact', kind: 'checkout-contact', settings: {
        heading: 'Contact', email_placeholder: 'Email or mobile phone number',
        show_sign_in_link: true, sign_in_text: 'Sign in',
      } },
      { id: 'nco-ck-shipinfo', kind: 'checkout-shipping-info', settings: {
        heading: 'Delivery', country_label: 'Country/Region',
        first_name_placeholder: 'First name', last_name_placeholder: 'Last name',
        address_placeholder: 'Address', apartment_placeholder: 'Apt, suite, unit, etc (optional)',
        city_placeholder: 'City', state_placeholder: 'State/province',
        zip_placeholder: 'ZIP code', phone_placeholder: 'Phone number',
      } },
      { id: 'nco-ck-shipmethod', kind: 'checkout-shipping-method', settings: {
        heading: 'Shipping method',
        empty_state_text: 'Enter your shipping address to view available shipping methods.',
        selected_border_color: '',
      } },
      { id: 'nco-ck-payment', kind: 'checkout-payment', settings: {
        heading: 'Payment', description: 'All transactions are secure and encrypted.',
      } },
      { id: 'nco-ck-cta', kind: 'checkout-cta', settings: {
        button_text: 'Pay now', button_full_width: true, loading_text: 'Processing...',
        button_background: '', button_text_color: '', button_border_radius: '',
      } },
      { id: 'nco-ck-trust-badges-2', kind: 'checkout-trust-badges', zone: 'cta', hidden: true, settings: {
        content_mode: 'structured', heading: 'Protected at every step', full_image: '',
        layout: 'grid', per_row_desktop: 2, per_row_mobile: 2, icon_size: 28,
        background_color: '#ffffff', text_color: '#333', border_color: 'transparent',
        border_radius: 4, custom_css: '',
      }, blocks: [
        { id: 'nco-ck-trust-badge-4', kind: 'badge', settings: {
          icon_source: 'builtin', built_in: 'lock', custom_image: '',
          title: 'Secure payment', description: 'Your payment information is encrypted and protected.',
        } },
        { id: 'nco-ck-trust-badge-5', kind: 'badge', settings: {
          icon_source: 'builtin', built_in: 'check', custom_image: '',
          title: 'Email confirmation', description: 'We will email your order details after payment.',
        } },
        { id: 'nco-ck-trust-badge-6', kind: 'badge', settings: {
          icon_source: 'builtin', built_in: 'truck', custom_image: '',
          title: 'Track order status', description: 'Follow fulfillment updates from your order confirmation.',
        } },
        { id: 'nco-ck-trust-badge-7', kind: 'badge', settings: {
          icon_source: 'builtin', built_in: 'shield', custom_image: '',
          title: 'Privacy protected', description: 'Your personal details are handled securely throughout checkout.',
        } },
      ] },
      { id: 'nco-ck-summary', kind: 'checkout-order-summary', settings: {
        heading: 'Order summary', show_heading_pc: true, show_heading_mobile: true,
        mobile_default: 'collapsed',
      }, blocks: [
        { id: 'nco-ck-blk-lines', kind: 'cart-lines' },
        { id: 'nco-ck-blk-coupon', kind: 'coupon', settings: {
          show_coupon: true, placeholder: 'Discount code',
        } },
        { id: 'nco-ck-blk-subtotal', kind: 'subtotal', settings: { label: 'Subtotal' } },
        { id: 'nco-ck-blk-discount', kind: 'discount' },
        { id: 'nco-ck-blk-shipping', kind: 'shipping', settings: {
          label: 'Shipping', zero_value: 'free',
        } },
        { id: 'nco-ck-blk-total', kind: 'total', settings: { label: 'Total' } },
      ] },
      { id: 'nco-ck-policy', kind: 'checkout-policy-links', settings: productionPolicySettings() },
    ],
  };

  // Returning-customer checkout: keep the signed-in journey fast and concise. The Flow
  // supplies identity; Theme only presents the saved-address-aware checkout structure.
  const RETURNING_CUSTOMER_CHECKOUT_TEMPLATE = {
    sections: checkoutCoreSections('rcc-ck', {
      show_trust_text: true, trust_text: 'Secure checkout',
      show_secure_badge: false, show_contact_info: false, show_cart_icon: true,
    }, [
      { id: 'rcc-ck-guidance', kind: 'checkout-static-content', zone: 'header', settings: {
        content_style: 'notice', icon: 'check', heading: 'Ready when you are',
        content: '<p>Review your delivery and payment details, then place your order when you\u2019re ready. We\u2019ll keep you updated by email.</p>',
        text_alignment: 'left',
      } },
      checkoutTrustBadges('rcc-ck'),
    ]),
  };

  // Residual A/B Variant A: identity-neutral security layer.
  // Header / Footer are shared, so this variant does not customize them.
  // Announcement bar and payment icons are intentionally omitted — the split
  // uses page-only trust components around the payment decision.
  const TRUST_LED_CHECKOUT_TEMPLATE = {
    sections: checkoutCoreSections('ab-trust', {
      show_trust_text: true, trust_text: 'Secure checkout',
      show_secure_badge: false, show_contact_info: false, show_cart_icon: true,
    }, [
      { id: 'ab-trust-intro', kind: 'checkout-static-content', zone: 'header', settings: {
        content_style: 'notice', icon: 'shield', heading: 'Your payment is protected',
        content: '<p>Card details stay encrypted in transit. We email confirmation as soon as you pay and send tracking when the order ships. Your personal information is not shared.</p>',
        text_alignment: 'left',
      } },
      checkoutTrustBadges('ab-trust', {
        zone: 'payment', heading: 'Protected at every step', per_row_desktop: 2, per_row_mobile: 1,
      }),
      showcaseReviewCard('ab-trust', 'summary', [
        { image: IMG.av2, title: 'Checkout you can trust',
          content: '\u201cThe payment step felt considered \u2014 encrypted, quiet, and I had confirmation in my inbox before I closed the tab.\u201d',
          author_name: 'Jordan Hale', author_subtitle: 'Verified buyer' },
        { image: IMG.av1, title: 'Privacy first',
          content: '\u201cI only needed the details required to ship. No extra account, no surprises after I paid.\u201d',
          author_name: 'Mina Cho', author_subtitle: 'Verified buyer' },
      ]),
      showcaseTrustpilot('ab-trust', 'summary', [
        { review_title: 'Paid without a hitch', review_content: 'Checkout was short and the confirmation email arrived immediately. Tracking showed up as soon as it shipped.', reviewer_name: 'Hannah W.', review_date: 'May 18, 2026' },
        { review_title: 'Felt secure', review_content: 'Card form looked standard and protected. I never felt like I was leaving extra data behind.', reviewer_name: 'Marco D.', review_date: 'May 9, 2026' },
      ]),
    ]),
  };

  // Residual A/B Variant B: transaction skeleton only. No notice card, badges,
  // payment icons, countdown or commerce boosters.
  const CONCISE_CHECKOUT_TEMPLATE = {
    sections: checkoutCoreSections('ab-concise', {
      show_trust_text: true, trust_text: 'Secure checkout',
      show_secure_badge: false, show_contact_info: false, show_cart_icon: true,
    }),
  };

  // Backward-compatible fallback for code paths that still expect one Checkout seed.
  const CHECKOUT_TEMPLATE = FIRST_PURCHASE_CHECKOUT_TEMPLATE;

  // Mock order used for the checkout preview (PRD §14.2). Amounts are illustrative;
  // in production the order calculation service is the source of truth.
  const CHECKOUT_MOCK = {
    storeName: 'AURA',
    country: 'United States',
    currency: 'USD',
    countries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Japan'],
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Georgia'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Seattle', 'Boston', 'Atlanta', 'Miami'],
    phoneCodes: ['+1', '+44', '+61', '+49', '+81', '+86', '+33'],
    cart: [
      { id: 'l1', title: 'Linen-feel wide pants', variant: 'Sand / M', qty: 1, price: 32.99, compareAt: 45.0, deal: 'EXTRA SALE', image: IMG.p1 },
      { id: 'l2', title: 'Soft rib tee', variant: 'Forest / S', qty: 2, price: 18.99, compareAt: 26.0, deal: 'BUY 2 SAVE 30%', image: IMG.p2 },
      { id: 'l3', title: 'Pleated midi skirt', variant: 'Black / M', qty: 1, price: 38.0, compareAt: 49.0, deal: 'CLEARANCE', image: IMG.p6 },
      // Subscription lines — the line price already reflects the subscription saving
      // (compareAt − save = price); the cadence tag is informational (Item 3).
      { id: 'l4', title: '04 Normal product - single variant', variant: '', qty: 1, price: 10.39, compareAt: 12.99, image: IMG.p4,
        subscription: { label: 'Delivery every 1 month', save: 2.6 } },
      { id: 'l5', title: '05 Normal product - multiple variants', variant: 'Citrus, 24 Pack', qty: 1, price: 15.19, compareAt: 18.99, image: IMG.p5,
        subscription: { label: 'Delivery every 2 months', save: 3.8 } },
      // Bundle parent — black "Bundle" badge instead of a thumb, BUNDLE-discount deal
      // tag (compareAt − price), followed by indented "Included" children (no own price).
      { id: 'l6', title: '03 Bundle product - one-time purchase', variant: '', qty: 1, price: 42.0, compareAt: 49.98, deal: 'BUNDLE discount', image: IMG.p3,
        bundle: true, bundleItems: [
          { title: 'Bundle item A - Focus Gum', variant: '12 Pack', qty: 1, image: IMG.p1 },
          { title: 'Bundle item B - Refill Pack', variant: 'Mint, 24 Pack', qty: 1, image: IMG.p2 },
        ] },
    ],
    shippingMethods: [
      { id: 'standard', name: 'Standard Shipping', eta: '', desc: '4–7 business days', price: 8.99 },
      { id: 'vip', name: 'VIP Shipping', eta: '', desc: '1–2 business days · priority handling', price: 12.99 },
    ],
    selectedShipping: 'standard',
    coupon: { code: 'WELCOME10', amount: 10.99 },
    // Valid demo discount codes (case-insensitive). Shopify itemises discounts into
    // three types (Item 2): product / order / shipping. Each entry is an object with
    // any of {product, order, shipping}; a plain number is treated as a product
    // discount (backward-compat). The applied coupon carries this breakdown so the
    // Order Summary can render a separate row per non-zero discount type.
    coupons: {
      WELCOME10: { product: 10.99 },       // product (line-item) discount
      WELCOME5: { order: 5.0 },            // seeded Checkout order discount
      SAVE10: { order: 10.0 },             // order discount (matches reference)
      SHIP5: { shipping: 5.0 },            // shipping discount (negative shipping line)
      BUNDLE15: { product: 5.0, order: 7.0, shipping: 3.0 }, // demos all three at once
      THANKS: { order: 7.0 },               // seeded by default — order discount
      FREESHIP: { shipping: 8.99 },         // seeded by default — makes Standard Shipping free
    },
    tax: 7.34,
    // Signed-in demo account (Item 1). The signed-in flag itself is a runtime toggle
    // shared by Contact + Delivery (OS.ckState['ck-account']), default signed OUT.
    // Multiple saved addresses power the Delivery "Ship to" radio list; the one with
    // default:true is pre-selected. line1 = street, line2 = "city/region zip, country".
    account: {
      email: 'cxc8697@gmail.com',
      addresses: [
        { id: 'a1', name: 'Xican Chen', line1: '31972 NW Pacific Coast Hwy', line2: 'Waldport OR 97394, US', phone: '4153334567', default: true },
        { id: 'a2', name: 'Xican Chen', line1: '10th arrondissement of Paris', line2: '75010 Paris, FR', phone: '100000000' },
        { id: 'a3', name: 'Xican Chen', line1: 'dfdfdf Benar Road Shankar Vihar Extension Rani Bagh', line2: '302012 Jaipur RJ, IN', phone: '4153334567' },
        { id: 'a4', name: 'Xican Chen', line1: '670 North Commercial St', line2: 'Manchester NH 03101, US', phone: '4153334567' },
        { id: 'a5', name: 'HK', line1: '', line2: '' },
      ],
      shippingSummary: 'Estimated Delivery Time: 4-8 Business Days · FREE',
    },
  };

  // Add-component catalog for the Checkout editor, grouped into MECE categories by
  // function / use-case. Powers the "Add component" modal (same UX as the Online Store
  // "Add section" modal). Every addable checkout component belongs to exactly one group,
  // and together the groups cover all addable components (mutually exclusive + exhaustive).
  const CHECKOUT_CATALOG = [
    { label: 'Commerce boosters', entries: [
      { kind: 'checkout-product-upsell', name: 'Product upsell', desc: 'Recommend extra products with one-tap add' },
      { kind: 'checkout-shipping-insurance', name: 'Shipping Insurance', desc: 'Tickable delivery-protection service' },
      { kind: 'checkout-vip-club', name: 'VIP Club', desc: 'Tickable membership add-on' },
    ] },
    { label: 'Reviews & social proof', entries: [
      { kind: 'checkout-trustpilot', name: 'Trustpilot Review', desc: 'Trustpilot-style rating & reviews (static)' },
      { kind: 'checkout-review-card', name: 'Review card', desc: 'Expert / media endorsement cards' },
      { kind: 'checkout-testimonials', name: 'Testimonials', desc: 'Customer reviews (bottom area only)' },
      { kind: 'checkout-fb-comments', name: 'Facebook-style Comments', desc: 'Social-proof comment thread' },
    ] },
    { label: 'Trust & security', entries: [
      { kind: 'checkout-trust-badges', name: 'Trust badges', desc: 'Guarantee / security / shipping badges' },
      { kind: 'checkout-payment-icons', name: 'Payment Icons', desc: 'Accepted-payment brand badges' },
    ] },
    { label: 'Promotion & urgency', entries: [
      { kind: 'announcement-bar', name: 'Announcement Bar', desc: 'Top promo / free-shipping bar' },
      { kind: 'checkout-countdown', name: 'Countdown', desc: 'Static urgency / reservation timer' },
    ] },
    { label: 'Content & structure', entries: [
      { kind: 'checkout-static-content', name: 'Static content', desc: 'Notice / rich-text content block' },
      { kind: 'checkout-footer', name: 'Footer', desc: 'Checkout footer (bottom of page only)' },
    ] },
  ];

  // ==========================================================================
  //  POST-PURCHASE OFFER PAGES — Upsell + Downsell
  //  Both pages reuse one locked transaction-safe skeleton. Existing Checkout
  //  content/trust components remain addable; cart-mutating commerce boosters are
  //  intentionally excluded because the original Checkout has already completed.
  // ==========================================================================
  const OFFER_FLEX = ['checkout-countdown', 'checkout-trust-badges', 'checkout-static-content',
    'checkout-payment-icons', 'checkout-trustpilot', 'checkout-review-card', 'checkout-fb-comments'];
  const OFFER_ZONES = [
    { id: 'announce', label: 'Above header', after: null, col: 'announce', allow: ['announcement-bar'] },
    { id: 'header', label: 'Below order confirmation', after: 'checkout-offer-header', col: 'main', allow: OFFER_FLEX.slice() },
    { id: 'progress', label: 'Below progress', after: 'checkout-offer-progress', col: 'main', allow: OFFER_FLEX.slice() },
    { id: 'offer', label: 'Below offer', after: 'checkout-offer-product', col: 'main', allow: OFFER_FLEX.slice() },
    { id: 'policytop', label: 'Below Policy Links', after: 'checkout-policy-links', col: 'bottom', allow: ['checkout-testimonials'] },
    { id: 'bottom', label: 'Page bottom', after: 'checkout-policy-links', col: 'bottom', allow: ['checkout-footer'] },
  ];
  const OFFER_CATALOG = CHECKOUT_CATALOG
    .filter((g) => g.label !== 'Commerce boosters')
    .map((g) => ({ label: g.label, entries: g.entries.map((e) => Object.assign({}, e, {
      defaultZone: e.kind === 'announcement-bar' ? 'announce'
        : e.kind === 'checkout-testimonials' ? 'policytop'
        : e.kind === 'checkout-footer' ? 'bottom'
        : e.kind === 'checkout-countdown' || e.kind === 'checkout-static-content' ? 'progress'
        : 'offer',
    })) }));

  // The recommendation preview resolves product + variant references from this catalog. It intentionally
  // carries product availability alongside Offer quote fields so the editor can demonstrate
  // filtering without pretending to own the production inventory/Market checks.
  const offerCatalog = () => SAMPLE.products.map((product, index) => {
    const price = +product.price;
    const compareAt = +(product.compareAt || product.price).toFixed(2);
    const variants = (product.variants || []).map((variant) => {
      const variantPrice = +variant.price;
      const variantCompare = +(variant.compareAt || variant.price).toFixed(2);
      return {
        id: variant.id, title: variant.title, price: variantPrice, compareAt: variantCompare,
        total: variantPrice, savings: 'Save ' + Math.max(0, Math.round((1 - variantPrice / variantCompare) * 100)) + '%',
        available: variant.available !== false,
      };
    });
    return {
      id: product.id, title: product.title, image: product.image, status: product.status, bestSellerRank: index + 1,
      published: product.published !== false, marketSupported: product.marketSupported !== false,
      available: product.available !== false, inventory: product.inventory == null ? 20 : product.inventory,
      price, compareAt, total: price,
      savings: 'Save ' + Math.max(0, Math.round((1 - price / compareAt) * 100)) + '%',
      rating: product.rating, reviewCount: product.reviews,
      description: 'Add ' + product.title.toLowerCase() + ' to the order you just completed at an exclusive post-purchase price.',
      variantLabel: variants.length ? 'Color / size' : '', variants,
      selectedVariantId: variants.length ? variants[0].id : '',
      quantity: 1, quantityOptions: [1, 2, 3], shippingLabel: 'Free',
    };
  });
  const OFFER_MOCKS = {
    upsell: {
      storeName: 'AURA', confirmationNumber: 'NWRGFFKTF', orderNumber: '#1001', currency: 'USD',
      catalog: offerCatalog(),
      mockOrderProducts: [
        { productId: 'p1', variantId: '', quantity: 1, paidAmount: 32.99 },
        { productId: 'p2', variantId: '', quantity: 2, paidAmount: 37.98 },
        { productId: 'p5', variantId: '', quantity: 1, paidAmount: 44.00 },
      ],
      previouslyDisplayedProductIds: [],
      acceptedProductIds: [],
      products: [
        {
          id: 'creatine-3', title: 'Creatine (3 Extra)', image: IMG.p3, compareAt: 49.99, price: 35.00, total: 104.98,
          savings: 'Save 30%', rating: 4.9, reviewCount: 125,
          description: 'Don\u2019t miss out on this offer. It expires after you leave this page.',
          variantLabel: 'Flavor / pack', selectedVariantId: 'berry-3',
          variants: [
            { id: 'berry-3', title: 'Berry · 3 tubs', price: 35, compareAt: 49.99, total: 104.98, savings: 'Save 30%' },
            { id: 'lemon-3', title: 'Lemon · 3 tubs', price: 36, compareAt: 49.99, total: 107.98, savings: 'Save 28%' },
            { id: 'unflavored-3', title: 'Unflavored · 3 tubs', price: 32, compareAt: 47.99, total: 95.98, savings: 'Save 33%' },
          ],
          quantity: 3, quantityOptions: [1, 2, 3], shippingLabel: 'Free',
        },
        {
          id: 'hydration-pack', title: 'Daily Hydration Pack', image: IMG.p4, compareAt: 42.00, price: 28.00, total: 28.00,
          savings: 'Save 33%', rating: 4.8, reviewCount: 88,
          description: 'Add an easy daily hydration boost to the order you just completed.',
          variantLabel: 'Flavor', selectedVariantId: 'citrus',
          variants: [
            { id: 'citrus', title: 'Citrus', price: 28, compareAt: 42, total: 28, savings: 'Save 33%' },
            { id: 'berry', title: 'Mixed berry', price: 28, compareAt: 42, total: 28, savings: 'Save 33%' },
          ],
          quantity: 1, quantityOptions: [1, 2], shippingLabel: 'Free',
        },
        {
          id: 'recovery-bundle', title: 'Recovery Essentials Bundle', image: IMG.p5, compareAt: 74.00, price: 49.00, total: 49.00,
          savings: 'Save 34%', rating: 4.7, reviewCount: 64,
          description: 'Complete your routine with a one-time recovery bundle at a post-purchase price.',
          variantLabel: 'Bundle', selectedVariantId: 'standard',
          variants: [
            { id: 'standard', title: 'Standard bundle', price: 49, compareAt: 74, total: 49, savings: 'Save 34%' },
            { id: 'plus', title: 'Plus bundle', price: 62, compareAt: 89, total: 62, savings: 'Save 30%' },
          ],
          quantity: 1, quantityOptions: [1], shippingLabel: 'Free',
        },
        {
          id: 'travel-shaker', title: 'Travel Shaker Set', image: IMG.p6, compareAt: 24.00, price: 16.00, total: 16.00,
          savings: 'Save 33%', rating: 4.6, reviewCount: 51,
          description: 'A compact shaker set ready for training days and travel.',
          quantity: 1, quantityOptions: [1, 2, 3], shippingLabel: 'Free',
        },
      ],
    },
    downsell: {
      storeName: 'AURA', confirmationNumber: 'NWRGFFKTF', orderNumber: '#1001', currency: 'USD',
      catalog: offerCatalog(),
      mockOrderProducts: [
        { productId: 'p1', variantId: '', quantity: 1, paidAmount: 32.99 },
        { productId: 'p2', variantId: '', quantity: 2, paidAmount: 37.98 },
        { productId: 'p5', variantId: '', quantity: 1, paidAmount: 44.00 },
      ],
      precedingUpsellOfferProducts: [
        { productId: 'p3', effectivePrice: 37.35 },
        { productId: 'p6', effectivePrice: 34.20 },
        { productId: 'p7', effectivePrice: 26.10 },
        { productId: 'p8', effectivePrice: 14.40 },
      ],
      previouslyDisplayedProductIds: ['p3', 'p6', 'p7', 'p8'],
      acceptedProductIds: [],
      products: [
        {
          id: 'creatine-1', title: 'Creatine (1 Extra)', image: IMG.p3, compareAt: 29.99, price: 19.99, total: 19.99,
          savings: 'Save 33%', rating: 4.9, reviewCount: 125,
          description: 'Try one extra tub at our lowest one-time price. This offer disappears when you leave.',
          variantLabel: 'Flavor', selectedVariantId: 'berry-1',
          variants: [
            { id: 'berry-1', title: 'Berry', price: 19.99, compareAt: 29.99, total: 19.99, savings: 'Save 33%' },
            { id: 'lemon-1', title: 'Lemon', price: 20.99, compareAt: 29.99, total: 20.99, savings: 'Save 30%' },
            { id: 'unflavored-1', title: 'Unflavored', price: 18.99, compareAt: 28.99, total: 18.99, savings: 'Save 34%' },
          ],
          quantity: 1, quantityOptions: [1], shippingLabel: 'Free',
        },
        {
          id: 'hydration-sample', title: 'Hydration Sample Pack', image: IMG.p4, compareAt: 18.00, price: 12.00, total: 12.00,
          savings: 'Save 33%', rating: 4.8, reviewCount: 88,
          description: 'Try a smaller hydration pack without re-entering your payment details.',
          quantity: 1, quantityOptions: [1, 2], shippingLabel: 'Free',
        },
        {
          id: 'recovery-mini', title: 'Mini Recovery Kit', image: IMG.p5, compareAt: 32.00, price: 22.00, total: 22.00,
          savings: 'Save 31%', rating: 4.7, reviewCount: 64,
          description: 'A compact recovery kit at a final one-time price.',
          quantity: 1, quantityOptions: [1], shippingLabel: 'Free',
        },
        {
          id: 'single-shaker', title: 'Classic Shaker', image: IMG.p6, compareAt: 16.00, price: 10.00, total: 10.00,
          savings: 'Save 38%', rating: 4.6, reviewCount: 51,
          description: 'Add one classic shaker before completing your order.',
          quantity: 1, quantityOptions: [1, 2], shippingLabel: 'Free',
        },
      ],
    },
  };

  const offerPolicy = () => ({
    refund_policy_page: 'pg-refund', privacy_policy_page: 'pg-privacy',
    terms_of_service_page: 'pg-terms', contact_page: 'pg-contact',
  });
  const offerSections = (prefix, config, additions) => {
    const extras = additions || [];
    const inZone = (zone) => extras.filter((section) => section.zone === zone);
    return [
      ...inZone('announce'),
      { id: prefix + '-header', kind: 'checkout-offer-header', settings: {
        confirmation_label: 'Confirmation', paid_message: 'You\u2019ve paid for your order.',
        show_order_link: true, order_link_text: 'View order confirmation',
      } },
      ...inZone('header'),
      { id: prefix + '-progress', kind: 'checkout-offer-progress', settings: {
        order_label: 'Order confirmed', offer_label: config.progressLabel,
        complete_label: 'Complete', show_labels: true,
      } },
      { id: prefix + '-intro', kind: 'checkout-static-content', zone: 'progress', settings: {
        content_style: 'plain', icon: 'none', text_alignment: 'center',
        background_color: 'transparent', border_color: 'transparent',
        heading: config.heading, content: '<p>' + config.body + '</p>',
      } },
      ...inZone('progress'),
      { id: prefix + '-product', kind: 'checkout-offer-product', settings: {
        recommendation_rule: 'best_sellers',
        fill_default_products: true,
        maximum_products: config.maximumProducts,
        discount_type: 'percentage',
        discount_value: config.discount,
        multiple_layout: config.multipleLayout,
        layout: 'image_left',
        image_ratio: 'square',
        show_compare_price: true,
        show_savings: true,
        show_rating: true,
        show_description: true,
        show_variant: true,
        show_quantity: config.showQuantity,
        show_shipping: true,
        accept_text: config.acceptText,
        decline_text: config.declineText,
        show_payment_note: true,
        payment_note: 'Uses the payment method from your completed checkout',
      } },
      ...inZone('offer'),
      { id: prefix + '-policy', kind: 'checkout-policy-links', settings: offerPolicy() },
      ...inZone('policytop'),
      ...inZone('bottom'),
    ];
  };

  const productionOfferSections = (prefix, config) => [
    { id: prefix + '-header', kind: 'checkout-offer-header', settings: {
      logo_image: '', logo_text: '', logo_position: 'left',
      confirmation_label: 'Confirmation #', paid_message: 'You\u2019ve paid for your order.',
      show_order_link: true, order_link_text: 'View order confirmation',
      background_color: '#FFFFFF', text_color: '#000000', accent_color: '',
      custom_css: '',
    } },
    { id: prefix + '-progress', kind: 'checkout-offer-progress', settings: {
      order_label: 'Order confirmed', offer_label: 'Special offer', complete_label: 'Complete',
      active_color: '', text_color: '#121927',
      background_color: '#FFFFFF', custom_css: '',
    } },
    { id: prefix + '-intro', kind: 'checkout-static-content', zone: 'progress', settings: {
      content_style: 'plainText', icon: 'none', icon_image: '',
      heading: config.heading, content: '<p>' + config.body + '</p>',
      link_text: '', link_url: '', open_new_tab: true, text_alignment: 'center',
      background_color: '#ffffff', text_color: '#433134',
      border_color: '#ffffff', border_radius: 0, custom_css: '',
    } },
    { id: prefix + '-product', kind: 'checkout-offer-product', settings: {
      recommendation_rule: 'best_sellers', specific_products: [], default_products: [],
      product_mappings: [], fill_default_products: config.fillDefaultProducts,
      maximum_products: 1, discount_type: 'percentage', discount_value: config.discount,
      multiple_layout: 'stacked', layout: 'image_left', image_ratio: 'square',
      show_compare_price: true, show_savings: true, show_rating: true,
      show_variant: true, show_quantity: true,
      quantity_label: 'Quantity', show_shipping: true,
      accept_text: config.acceptText, decline_text: config.declineText,
      show_payment_note: true,
      payment_note: 'Uses the payment method from your completed checkout',
      card_background: '#FFFFFF', border_radius: 0, text_color: '#433134',
      savings_color: '#121927', button_background: '', button_text_color: '',
    } },
    { id: prefix + '-policy', kind: 'checkout-policy-links', settings: productionPolicySettings() },
  ];

  const NEW_CUSTOMER_UPSELL_TEMPLATE = { sections: productionOfferSections('nco-up', {
    heading: 'A little something for your first order',
    body: 'Your order is confirmed. Add a customer favorite now without entering your payment details again.',
    fillDefaultProducts: true, discount: 15,
    acceptText: 'Add to my order · {amount}', declineText: 'No thanks, continue',
  }) };
  const NEW_CUSTOMER_DOWNSELL_TEMPLATE = { sections: productionOfferSections('nco-dn', {
    heading: 'Prefer something smaller?',
    body: 'Here is one lower-priced customer favorite you can add before we complete your order.',
    fillDefaultProducts: false, discount: 20,
    acceptText: 'Add this offer · {amount}', declineText: 'No thanks, complete my order',
  }) };
  const RETURNING_CUSTOMER_UPSELL_TEMPLATE = { sections: offerSections('rcc-up', {
    progressLabel: 'Recommended for you',
    heading: 'Add more to your order',
    body: 'Choose any popular additions below. Your payment details are already confirmed.',
    maximumProducts: 4, discount: 10, multipleLayout: 'grid', showQuantity: true,
    acceptText: 'Add to my order · {amount}', declineText: 'No thanks, continue',
  }) };
  const RETURNING_CUSTOMER_DOWNSELL_TEMPLATE = { sections: offerSections('rcc-dn', {
    progressLabel: 'Value picks',
    heading: 'A few lower-priced picks',
    body: 'These popular additions are priced below the offer you just passed on.',
    maximumProducts: 2, discount: 15, multipleLayout: 'grid', showQuantity: true,
    acceptText: 'Add this offer · {amount}', declineText: 'No thanks, complete my order',
  }) };
  const RESIDUAL_UPSELL_TEMPLATE = { sections: offerSections('ab-up', {
    progressLabel: 'Special offer',
    heading: 'Add a popular extra',
    body: 'Your order is confirmed. Add a customer favorite now without entering your payment details again.',
    maximumProducts: 2, discount: 15, multipleLayout: 'stacked', showQuantity: true,
    acceptText: 'Add to my order · {amount}', declineText: 'No thanks, continue',
  }) };
  const RESIDUAL_DOWNSELL_TEMPLATE = { sections: offerSections('ab-dn', {
    progressLabel: 'Smaller offer',
    heading: 'Prefer a smaller add-on?',
    body: 'Here is one lower-priced customer favorite you can add before we complete your order.',
    maximumProducts: 1, discount: 20, multipleLayout: 'stacked', showQuantity: false,
    acceptText: 'Add this offer · {amount}', declineText: 'No thanks, complete my order',
  }) };

  // Showcase drafts — richer decoration to demonstrate Theme capability. Not bound
  // to New / Returning / Residual preset Flows. Sample social proof is layout-only.
  const SOCIAL_PROOF_CHECKOUT_TEMPLATE = {
    sections: checkoutCoreSections('sp-ck', {
      show_trust_text: true, trust_text: 'Rated 4.8 by shoppers',
      show_secure_badge: true, secure_text: 'SSL secure',
      show_contact_info: false, show_cart_icon: true,
    }, [
      showcaseAnnouncement('sp-ck', [
        'Loved by 12,000+ shoppers this season',
        'Free shipping on orders over $79',
        'Easy 30-day returns · hassle-free',
      ]),
      { id: 'sp-ck-intro', kind: 'checkout-static-content', zone: 'header', settings: {
        content_style: 'notice', icon: 'check', heading: 'Join thousands of happy orders',
        content: '<p>Checkout is encrypted. Your confirmation arrives instantly, and shoppers rate this store Excellent on Trustpilot.</p>',
        text_alignment: 'left',
      } },
      showcaseCountdown('sp-ck', 'header', {
        prefix_text: 'Your cart is reserved for', duration: 10,
      }),
      { id: 'sp-ck-grab', kind: 'checkout-product-upsell', zone: 'contact', settings: {
        heading: 'Customers also grabbed', product_source: 'manual',
        products: ['p3', 'p4', 'p5'], products_limit: 3,
        layout_desktop: 'slider', layout_mobile: 'slider',
      } },
      showcasePayIcons('sp-ck', 'payment'),
      showcaseReviewCard('sp-ck', 'summary', [
        { image: IMG.av2, title: 'Dermatologist Recommended',
          content: '\u201cIn my practice I look for formulas that are gentle yet effective \u2014 this is one I happily recommend to my own patients.\u201d',
          author_name: 'Dr. Elena Ross', author_subtitle: 'Board-certified Dermatologist' },
        { image: IMG.av1, title: 'As seen in Vogue',
          content: '\u201cA quiet luxury staple that actually earns its keep \u2014 polished enough for evening, easy enough for every day.\u201d',
          author_name: 'Editorial desk', author_subtitle: 'Vogue Shopping' },
      ]),
      showcaseTrustpilot('sp-ck', 'summary', [
        { review_title: 'Exactly as described', review_content: 'Ordering was effortless and the quality blew me away. Shipping was quick too \u2014 will definitely buy again.', reviewer_name: 'Hannah W.', review_date: 'May 18, 2026' },
        { review_title: 'Great experience', review_content: 'Customer service answered all my questions fast and the product is fantastic value.', reviewer_name: 'Marco D.', review_date: 'May 9, 2026' },
        { review_title: 'Will buy again', review_content: 'Fit is true to size and the fabric feels expensive. Already telling friends.', reviewer_name: 'Priya S.', review_date: 'Apr 28, 2026', star_rating: 4 },
      ]),
      checkoutTrustBadges('sp-ck', { heading: 'Shop with confidence' }),
      showcaseTestimonials('sp-ck'),
      showcaseFooter('sp-ck'),
    ]),
  };
  const LIMITED_PROOF_UPSELL_TEMPLATE = { sections: offerSections('lp-up', {
    progressLabel: 'Limited offer',
    heading: 'A time-sensitive extra',
    body: 'Add a customer favorite with the payment method you just used. Sample reviews are for layout only \u2014 replace them before you publish.',
    maximumProducts: 2, discount: 18, multipleLayout: 'stacked', showQuantity: true,
    acceptText: 'Add this offer · {amount}', declineText: 'No thanks, continue',
  }, [
    showcaseAnnouncement('lp-up', [
      'This offer is only available on this page',
      'No payment details needed \u2014 one tap to add',
    ]),
    showcaseCountdown('lp-up', 'progress', {
      style: 'alert', icon: 'fire', prefix_text: 'This page-only offer expires in',
      duration: 8, background_color: '#FFF2F2', text_color: '#B42318', border_color: '#F5C2C2',
    }),
    showcaseReviewCard('lp-up', 'offer', [
      { image: IMG.av2, title: 'Most shoppers add this',
        content: '\u201cI almost skipped the extra \u2014 glad I didn\u2019t. It completed the set and arrived with my original order.\u201d',
        author_name: 'Alex P.', author_subtitle: 'Verified buyer' },
    ]),
    showcaseTestimonials('lp-up', { subheading: 'Post-purchase picks', heading: 'Shoppers who added this extra' }),
    showcaseFooter('lp-up'),
  ]) };
  const GENTLE_LAST_CHANCE_DOWNSELL_TEMPLATE = { sections: offerSections('gl-dn', {
    progressLabel: 'A smaller option',
    heading: 'A gentler last look',
    body: 'If the last offer was more than you wanted, here is one smaller favorite before we complete your order.',
    maximumProducts: 1, discount: 22, multipleLayout: 'stacked', showQuantity: false,
    acceptText: 'Add this smaller offer · {amount}', declineText: 'No thanks, complete my order',
  }, [
    showcaseAnnouncement('gl-dn', [
      'One last smaller option before we finish',
    ]),
    showcaseCountdown('gl-dn', 'progress', {
      style: 'inline', icon: 'clock', prefix_text: 'This smaller option stays available for',
      duration: 6, text_alignment: 'center',
      background_color: '#F4F7F5', text_color: '#1F3D2C', border_color: '#D5E3DA',
    }),
    { id: 'gl-dn-trust', kind: 'checkout-trust-badges', zone: 'offer', settings: {
      heading: 'Still covered', layout: 'grid', per_row_desktop: 2, per_row_mobile: 1, icon_size: 36,
    }, blocks: [
      { id: 'gl-dn-trust-pay', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'lock', title: 'Same secure payment',
        description: 'Uses the card you just paid with. No new details needed.',
      } },
      { id: 'gl-dn-trust-ship', kind: 'badge', settings: {
        icon_source: 'builtin', built_in: 'truck', title: 'Ships with your order',
        description: 'This add-on leaves with the order you already placed.',
      } },
    ] },
    showcaseFooter('gl-dn'),
  ]) };

  const thankyouCoreSections = (prefix, additions) => {
    const extras = additions || [];
    const inZone = (zone) => extras.filter((section) => section.zone === zone);
    return [
      ...inZone('announce'),
      { id: prefix + '-header', kind: 'checkout-header', settings: {
        show_trust_text: true, trust_text: 'Order confirmed',
        show_secure_badge: false, show_cart_icon: true,
      } },
      ...inZone('header'),
      { id: prefix + '-status', kind: 'thankyou-order-status' },
      ...inZone('status'),
      { id: prefix + '-details', kind: 'thankyou-order-details' },
      ...inZone('details'),
      { id: prefix + '-continue', kind: 'thankyou-continue-shopping' },
      { id: prefix + '-contact', kind: 'thankyou-contact-us' },
      ...inZone('continue'),
      { id: prefix + '-summary', kind: 'checkout-order-summary', settings: { mobile_default: 'expanded' }, blocks: [
        { id: prefix + '-blk-lines', kind: 'cart-lines' },
        { id: prefix + '-blk-subtotal', kind: 'subtotal' },
        { id: prefix + '-blk-discount', kind: 'discount' },
        { id: prefix + '-blk-shipping', kind: 'shipping' },
        { id: prefix + '-blk-total', kind: 'total' },
      ] },
      ...inZone('summary'),
      { id: prefix + '-policy', kind: 'checkout-policy-links', settings: {
        refund_policy_page: 'pg-refund', privacy_policy_page: 'pg-privacy',
        terms_of_service_page: 'pg-terms', contact_page: 'pg-contact',
      } },
      ...inZone('policytop'),
      ...inZone('bottom'),
    ];
  };
  const BRAND_CELEBRATION_THANKYOU_TEMPLATE = {
    sections: thankyouCoreSections('bc-ty', [
      showcaseAnnouncement('bc-ty', [
        'You\u2019re in. Welcome to the AURA community',
        'Tracking details will land in your inbox',
      ]),
      { id: 'bc-ty-thanks', kind: 'checkout-static-content', zone: 'header', settings: {
        content_style: 'notice', icon: 'gift', heading: 'Thank you for choosing AURA',
        content: '<p>Your order is confirmed. We\u2019re packing it with care and will email tracking as soon as it ships.</p>',
        background_color: '#F4F7F5', border_color: '#D5E3DA', text_alignment: 'left',
      } },
      { id: 'bc-ty-next', kind: 'checkout-static-content', zone: 'status', settings: {
        content_style: 'plain', icon: 'none', heading: 'What happens next',
        content: '<p>We\u2019ll send a confirmation now, a shipping update when it leaves, and a note if anything needs your attention.</p>',
        text_alignment: 'left', background_color: 'transparent', border_color: 'transparent',
      } },
      showcaseReviewCard('bc-ty', 'details', [
        { image: IMG.av1, title: 'A brand people come back to',
          content: '\u201cThe unboxing felt considered \u2014 not loud, just quietly well made. I\u2019ve already planned my next order.\u201d',
          author_name: 'Camille R.', author_subtitle: 'Repeat customer' },
      ]),
      { id: 'bc-ty-fb', kind: 'checkout-fb-comments', zone: 'continue', settings: { heading: 'From the community' } },
      showcasePayIcons('bc-ty', 'summary', 'Paid securely with'),
      checkoutTrustBadges('bc-ty', { heading: 'You\u2019re in good hands' }),
      showcaseTestimonials('bc-ty', { subheading: 'The community', heading: 'You\u2019re in good company' }),
      showcaseFooter('bc-ty'),
    ]),
  };

  function productionThankyouTemplate() {
    return {
      sections: [
        { id: 'ty-header', kind: 'checkout-header', settings: productionHeaderSettings() },
        { id: 'ty-status', kind: 'thankyou-order-status', settings: {
          email_message: "You'll receive a confirmation email soon",
          thankyou_text: 'Thank you, {{customer_name}}',
          success_message: 'Your order is confirmed',
          success_icon_color: '', show_confirmation_number: true,
        } },
        { id: 'ty-details', kind: 'thankyou-order-details', settings: {
          heading: 'Order details', card_radius: 4, card_background: '#FFFFFF',
          card_border_color: '#E0E1E3', show_payment_method: true,
          show_billing_address: true, show_shipping_method: true,
          show_shipping_address: true, show_contact_information: true,
        } },
        { id: 'ty-continue', kind: 'thankyou-continue-shopping', settings: {
          link_url: '', button_text: 'Continue shopping',
          show_button: true, button_style: 'primary',
        } },
        { id: 'ty-contact', kind: 'thankyou-contact-us', settings: {
          help_text: 'Need help?', link_text: 'Contact us',
          contact_link: '', show_contact_us: false,
        } },
        { id: 'ty-summary', kind: 'checkout-order-summary', settings: {
          heading: 'Order summary', custom_css: '', mobile_default: 'expanded',
          show_heading_pc: true, show_heading_mobile: true,
        }, blocks: [
          { id: 'ty-blk-lines', kind: 'cart-lines' },
          { id: 'ty-blk-subtotal', kind: 'subtotal', settings: { label: 'Subtotal' } },
          { id: 'ty-blk-discount', kind: 'discount' },
          { id: 'ty-blk-shipping', kind: 'shipping', settings: {
            label: 'Shipping', zero_value: 'free',
          } },
          { id: 'ty-blk-total', kind: 'total', settings: { label: 'Total' } },
        ] },
        { id: 'ty-policy', kind: 'checkout-policy-links', settings: productionPolicySettings() },
      ],
    };
  }
  function legacyThankyouTemplate() {
    return {
      sections: [
        { id: 'ty-header', kind: 'checkout-header' },
        { id: 'ty-status', kind: 'thankyou-order-status' },
        { id: 'ty-details', kind: 'thankyou-order-details' },
        { id: 'ty-continue', kind: 'thankyou-continue-shopping' },
        { id: 'ty-contact', kind: 'thankyou-contact-us' },
        { id: 'ty-summary', kind: 'checkout-order-summary', settings: { mobile_default: 'expanded' }, blocks: [
          { id: 'ty-blk-lines', kind: 'cart-lines' },
          { id: 'ty-blk-subtotal', kind: 'subtotal' },
          { id: 'ty-blk-discount', kind: 'discount' },
          { id: 'ty-blk-shipping', kind: 'shipping' },
          { id: 'ty-blk-total', kind: 'total' },
        ] },
        { id: 'ty-policy', kind: 'checkout-policy-links', settings: {
          refund_policy_page: 'pg-refund', privacy_policy_page: 'pg-privacy',
          terms_of_service_page: 'pg-terms', contact_page: 'pg-contact',
        } },
      ],
    };
  }

  // Legacy ids are retained in CHECKOUT_TEMPLATE_SETS. Residual A/B adds a
  // Trust-led / Concise checkout pair plus one shared Upsell/Downsell set.
  // Showcase drafts live in the same lists but stay off preset Flows.
  const CHECKOUT_TEMPLATE_SEEDS = {
    checkout: {
      standard: FIRST_PURCHASE_CHECKOUT_TEMPLATE,
      conversion: RETURNING_CUSTOMER_CHECKOUT_TEMPLATE,
      'trust-led': TRUST_LED_CHECKOUT_TEMPLATE,
      concise: CONCISE_CHECKOUT_TEMPLATE,
      'social-proof': SOCIAL_PROOF_CHECKOUT_TEMPLATE,
    },
    upsell: {
      'one-click-upsell': NEW_CUSTOMER_UPSELL_TEMPLATE,
      'subscription-upsell': RETURNING_CUSTOMER_UPSELL_TEMPLATE,
      'residual-offer': RESIDUAL_UPSELL_TEMPLATE,
      'limited-proof': LIMITED_PROOF_UPSELL_TEMPLATE,
    },
    downsell: {
      'standard-downsell': NEW_CUSTOMER_DOWNSELL_TEMPLATE,
      'save-offer': RETURNING_CUSTOMER_DOWNSELL_TEMPLATE,
      'residual-save': RESIDUAL_DOWNSELL_TEMPLATE,
      'gentle-last-chance': GENTLE_LAST_CHANCE_DOWNSELL_TEMPLATE,
    },
    thankyou: {
      standard: productionThankyouTemplate(),
      'base-order': legacyThankyouTemplate(),
      'survey-thankyou': legacyThankyouTemplate(),
      'brand-celebration': BRAND_CELEBRATION_THANKYOU_TEMPLATE,
    },
  };

  const UPSELL_TEMPLATE = NEW_CUSTOMER_UPSELL_TEMPLATE;
  const DOWNSELL_TEMPLATE = NEW_CUSTOMER_DOWNSELL_TEMPLATE;

  // ==========================================================================
  //  THANK YOU PAGE (Thank you PRD) — second transaction page, shares the
  //  Checkout theme settings. Final Funnel order confirmation, not the raw
  //  checkout cart. Required components + a limited set of reusable content &
  //  trust enhancement components, in their own insertion zones. (PRD §3, §9)
  // ==========================================================================

  // Thank-you insertion zones (PRD §9.2). No commerce here — order is already
  // placed. `col` mirrors the checkout render regions: 'announce' full-bleed top,
  // 'main' left column, 'summary' the right Order Summary column, 'bottom' the
  // full-bleed band (policy links → footer). Order status stays pinned to the top;
  // nothing can be inserted above it (PRD §9.3, §9.4).
  // The six content & trust components that may live in the Order details / Contact us /
  // Order summary zones (PRD §9.2). Header / Order status only allow Static content;
  // Policy Links only Testimonials; Page bottom only Footer.
  const TY_LEFT_CONTENT = ['checkout-static-content', 'checkout-countdown'];
  const TY_FLEX = ['checkout-countdown', 'checkout-trust-badges', 'checkout-static-content', 'checkout-payment-icons',
    'checkout-trustpilot', 'checkout-review-card', 'checkout-fb-comments'];
  const THANKYOU_ZONES = [
    { id: 'announce', label: 'Above header', after: null, col: 'announce', allow: ['announcement-bar'] },
    { id: 'header', label: 'Below header', after: 'checkout-header', col: 'main', allow: TY_LEFT_CONTENT.slice() },
    { id: 'status', label: 'Below Order status', after: 'thankyou-order-status', col: 'main', allow: TY_LEFT_CONTENT.slice() },
    { id: 'details', label: 'Below Order details', after: 'thankyou-order-details', col: 'main', allow: TY_FLEX.slice() },
    { id: 'continue', label: 'Below Contact us', after: 'thankyou-contact-us', col: 'main', allow: TY_FLEX.slice() },
    { id: 'summary', label: 'Below Order Summary', after: 'checkout-order-summary', col: 'summary', allow: TY_FLEX.slice() },
    // policytop is listed before 'bottom' so drag-onto-policy-links resolves here first.
    { id: 'policytop', label: 'Below Policy Links', after: 'checkout-policy-links', col: 'bottom', allow: ['checkout-testimonials'] },
    { id: 'bottom', label: 'Page bottom', after: 'checkout-policy-links', col: 'bottom', allow: ['checkout-footer'] },
  ];

  // Thank-you skeleton (PRD §3.1, §23.2). Required components are locked; reused
  // Checkout components (header, mobile summary bar, order summary, policy links,
  // footer) carry the same behaviour they have on Checkout.
  const THANKYOU_TEMPLATE = productionThankyouTemplate();

  // Add-component catalog for the Thank-you editor (PRD §7, §9.2). Only reusable
  // content & trust enhancement components — NO commerce boosters (PRD §8).
  // Each entry carries an optional `defaultZone` — the Thank-you page's own default
  // add position (PRD §9.5). This is page-scoped (looked up by addCheckoutComponent
  // in the active page's catalog) so it never disturbs the Checkout page's defaults,
  // which come from each section's shared `def.defaultZone`.
  const THANKYOU_CATALOG = [
    { label: 'Reviews & social proof', entries: [
      { kind: 'checkout-trustpilot', name: 'Trustpilot Review', desc: 'Trustpilot-style rating & reviews (static)', defaultZone: 'summary' },
      { kind: 'checkout-review-card', name: 'Review card', desc: 'Expert / media endorsement cards', defaultZone: 'summary' },
      { kind: 'checkout-testimonials', name: 'Testimonials', desc: 'Customer reviews (bottom area only)', defaultZone: 'policytop' },
      { kind: 'checkout-fb-comments', name: 'Facebook-style Comments', desc: 'Social-proof comment thread', defaultZone: 'summary' },
    ] },
    { label: 'Trust & security', entries: [
      { kind: 'checkout-trust-badges', name: 'Trust badges', desc: 'Guarantee / security / shipping badges', defaultZone: 'summary' },
      { kind: 'checkout-payment-icons', name: 'Payment Icons', desc: 'Accepted-payment brand badges', defaultZone: 'summary' },
    ] },
    { label: 'Promotion & urgency', entries: [
      { kind: 'announcement-bar', name: 'Announcement Bar', desc: 'Post-purchase notice / next-order offer (above header)', defaultZone: 'announce' },
      { kind: 'checkout-countdown', name: 'Countdown', desc: 'Static urgency / reservation timer', defaultZone: 'header' },
    ] },
    { label: 'Content & structure', entries: [
      { kind: 'checkout-static-content', name: 'Static content', desc: 'Order-processing / shipping / support notice', defaultZone: 'header' },
      { kind: 'checkout-footer', name: 'Footer', desc: 'Thank-you footer (bottom of page only)', defaultZone: 'bottom' },
    ] },
  ];

  // Final Order Snapshot — V1.146.2 keeps Base and Late Upsell as independent orders.
  // `line_source` remains explicit so Thank you can show Upsell / Downsell badges, while
  // buyer Account pages deliberately hide those marketing-origin labels.
  const PP_ORDER_MOCK = window.POST_PURCHASE_ORDER_MOCK;
  // Thank-you-only fixture lines demonstrate the same product discount, subscription,
  // and bundle Cart Line types as Checkout. They are appended to the Base Order snapshot
  // only, so the shared admin/buyer order mock and MINI11490 remain unchanged.
  const thankyouFixtureLines = [CHECKOUT_MOCK.cart[0], CHECKOUT_MOCK.cart[3], CHECKOUT_MOCK.cart[5]]
    .filter(Boolean)
    .map((line, index) => ({
      ...line,
      id: 'ty_fixture_' + (index + 1),
      fixtureType: ['product-discount', 'subscription', 'bundle'][index],
      lineSource: 'CHECKOUT',
      subscription: line.subscription ? { ...line.subscription } : undefined,
      bundleItems: line.bundleItems ? line.bundleItems.map((item) => ({ ...item })) : undefined,
    }));
  const snapshotOrders = PP_ORDER_MOCK ? PP_ORDER_MOCK.orders.map((order) => {
    const mappedLines = order.lines.filter((line) => line.line_id !== 'line_base_1').map((line) => ({
      id: line.line_id,
      title: line.title,
      variant: line.variant,
      qty: line.qty,
      price: line.unit_price,
      compareAt: line.offer_base_price != null ? line.offer_base_price : line.compare_at_price,
      image: line.image,
      lineSource: line.line_source,
      upsell: line.line_source === 'UPSELL',
      downsell: line.line_source === 'DOWNSELL',
    }));
    const lines = order.order_sn === 'MINI11489'
      ? mappedLines.concat(thankyouFixtureLines.map((line) => ({
          ...line,
          subscription: line.subscription ? { ...line.subscription } : undefined,
          bundleItems: line.bundleItems ? line.bundleItems.map((item) => ({ ...item })) : undefined,
        })))
      : mappedLines;
    const discounts = (order.discounts || []).map((item) => ({
      code: item.code,
      product: +item.product || 0,
      order: item.order != null ? (+item.order || 0) : (+item.amount || 0),
      shipping: +item.shipping || 0,
    }));
    const shipping = +order.shipping_fee || 0;
    if (order.order_sn === 'MINI11489' && shipping > 0) {
      discounts.push({ code: 'FREESHIP', product: 0, order: 0, shipping });
    }
    const subtotal = lines.reduce((sum, line) => sum + (+line.price || 0) * (+line.qty || 1), 0);
    const discount = discounts.reduce((sum, item) =>
      sum + (+item.product || 0) + (+item.order || 0) + (+item.shipping || 0), 0);
    const tax = +order.tax || 0;
    const total = subtotal - discount + shipping + tax;
    return {
      orderId: order.order_id,
      orderNumber: '#' + order.order_sn,
      orderRole: order.order_role,
      sourceOrderId: order.source_order_id,
      sourceOrderNumber: order.source_order_sn ? '#' + order.source_order_sn : '',
      status: order.status,
      currency: order.currency,
      lines,
      subtotal,
      discounts,
      shipping,
      tax,
      total,
      paid: total,
    };
  }) : [];
  const snapshotLines = snapshotOrders.length
    ? snapshotOrders.reduce((all, order) => all.concat(order.lines), [])
    : CHECKOUT_MOCK.cart.slice(0, 3);
  const THANKYOU_SNAPSHOT = {
    storeName: 'AURA',
    currency: 'USD',
    confirmationNumber: 'ABC123EXAMPLE',
    orderNumber: snapshotOrders[0] ? snapshotOrders[0].orderNumber : '#1001',
    orderStatus: 'confirmed',
    customer: { name: 'Alanna', fullName: 'Alanna Bogan', email: 'alanna.bogan@example.com', phone: '+1 (202) 456-1414' },
    shippingAddress: {
      name: 'Alanna Bogan', line1: '1600 Pennsylvania Avenue NW', city: 'Washington', state: 'DC',
      zip: '20500-0005', country: 'United States', phone: '+1 (202) 456-1414',
    },
    shippingMethod: 'Standard (Example)',
    payment: { brand: 'Visa', last4: '4242', label: 'Credit card' },
    billingSameAsShipping: true,
    orders: snapshotOrders,
    totalPaid: snapshotOrders.reduce((sum, order) => sum + (+order.paid || 0), 0),
    lines: snapshotLines,
    subtotal: snapshotOrders.reduce((sum, order) => sum + (+order.subtotal || 0), 0),
    discount: snapshotOrders.reduce((sum, order) =>
      sum + (order.discounts || []).reduce((d, item) =>
        d + (+item.product || 0) + (+item.order || 0) + (+item.shipping || 0), 0), 0),
    discounts: snapshotOrders[0] ? snapshotOrders[0].discounts : [],
    shipping: snapshotOrders.reduce((sum, order) => sum + (+order.shipping || 0), 0),
    tax: snapshotOrders.reduce((sum, order) => sum + (+order.tax || 0), 0),
    total: snapshotOrders.reduce((sum, order) => sum + (+order.total || 0), 0),
  };

  window.OS_DATA = {
    THEMES, PAGE_OPTIONS, CATALOG, SETTINGS_GROUPS, SAMPLE, PRODUCT_METAFIELD_DEFS, DEFAULT_THEME,
    CHECKOUT_PAGES, CHECKOUT_TEMPLATE_SETS, CHECKOUT_TEMPLATE_SEEDS, CHECKOUT_SETTINGS_GROUPS, CHECKOUT_SETTINGS_REMOVED, CHECKOUT_TEMPLATE, CHECKOUT_MOCK, CHECKOUT_COMMERCE, CHECKOUT_CONTENT, CHECKOUT_ZONES, CHECKOUT_CATALOG,
    UPSELL_TEMPLATE, DOWNSELL_TEMPLATE, OFFER_ZONES, OFFER_CATALOG, OFFER_MOCKS,
    THANKYOU_TEMPLATE, THANKYOU_ZONES, THANKYOU_CATALOG, THANKYOU_SNAPSHOT,
  };
})();

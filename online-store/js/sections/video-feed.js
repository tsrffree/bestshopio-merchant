/* Video feed (视频列) — shoppable short-video carousel. Homogeneous Video item blocks (max 20).
   Cover + play overlay in the rail; click opens a vertical lightbox player (Close top-right).
   Carousel uses a horizontal scroll-snap rail; item width = container / videos-per-view.
   When items exceed per-view, left/right arrows slide one card at a time (same pattern as Testimonial). */
(function () {
  const OS = window.OS;
  const CHEV = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  const ARROW_L = CHEV('m15 6-6 6 6 6');
  const ARROW_R = CHEV('m9 6 6 6-6 6');
  // Short public sample for the prototype lightbox when a block has no video_url yet.
  const SAMPLE_CLIP = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  OS.css('video-feed', [
    '.vfx{box-sizing:border-box}.vfx *{box-sizing:border-box}',
    '.vfx .vf-head{margin-bottom:18px}',
    '.vfx .vf-sub{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.6;margin-bottom:6px}',
    '.vfx h2{margin:0 0 8px;line-height:1.12}',
    '.vfx .vf-desc{font-size:14px;line-height:1.6;opacity:.8;max-width:640px}',
    '.vfx .vf-head.c{text-align:center}.vfx .vf-head.c .vf-desc{margin-left:auto;margin-right:auto}',
    '.vfx .vf-carousel-wrap{position:relative}',
    '.vfx .vf-carousel-wrap.has-nav{padding:0 8px}',
    '.vfx .vf-rail{display:flex;align-items:stretch;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}',
    '.vfx .vf-rail::-webkit-scrollbar{display:none;width:0;height:0}',
    '.vfx .vf-grid{display:grid}',
    '.vfx .vf-card{min-width:0;scroll-snap-align:start;flex:none;display:flex;flex-direction:column}',
    '.vfx .vf-media{position:relative;display:block;width:100%;padding:0;border:0;overflow:hidden;background:#ddd;cursor:pointer}',
    '.vfx .vf-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}',
    '.vfx .vf-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%);pointer-events:none}',
    '.vfx .vf-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;display:grid;place-items:center;backdrop-filter:blur(2px);pointer-events:none}',
    '.vfx .vf-play svg{width:22px;height:22px;margin-left:3px}',
    '.vfx .vf-tag{position:absolute;top:10px;left:10px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 7px;border-radius:6px;background:rgba(0,0,0,.55);color:#fff;backdrop-filter:blur(2px);pointer-events:none}',
    '.vfx .vf-over{position:absolute;left:12px;right:12px;bottom:12px;color:#fff;z-index:2;pointer-events:none}',
    '.vfx .vf-user{font-size:13px;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.4);display:flex;align-items:center;gap:6px}',
    '.vfx .vf-cap{font-size:12px;line-height:1.4;margin-top:3px;opacity:.95;text-shadow:0 1px 4px rgba(0,0,0,.4);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.vfx .vf-foot{padding:10px 2px 0}',
    '.vfx .vf-foot .vf-fuser{font-size:13px;font-weight:600}.vfx .vf-foot .vf-fcap{font-size:12px;opacity:.7;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.vfx .vf-prod{display:flex;align-items:center;gap:9px;margin-top:10px;padding:8px;border:1px solid rgba(0,0,0,.08);border-radius:10px}',
    '.vfx .vf-prod-img{width:40px;height:40px;border-radius:7px;background-size:cover;background-position:center;flex:none}',
    '.vfx .vf-prod-info{min-width:0}',
    '.vfx .vf-prod-t{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.vfx .vf-prod-p{font-size:12px;margin-top:1px}',
    '.vfx .vf-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,.08);background:#fff;color:#1a1a1a;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.14);z-index:2;padding:0}',
    '.vfx .vf-prev{left:-4px}.vfx .vf-next{right:-4px}',
    '.vfx .vf-nav:hover{background:#1a1a1a;color:#fff}',
    '.vfx .vf-nav:disabled{opacity:.3;cursor:default;background:#fff;color:#1a1a1a;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
    '.vfx .vf-empty{opacity:.5;font-size:13px;padding:24px;text-align:center}',
    /* Lightbox — fixed to the viewport so it stays centered while the canvas scrolls */
    '.vf-lightbox{position:fixed;inset:0;z-index:12000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:rgba(80,80,80,.72);padding:24px 16px 28px;box-sizing:border-box}',
    '.vf-lightbox .vf-lb-close{position:absolute;top:16px;right:18px;z-index:2;height:36px;padding:0 14px;border:0;border-radius:8px;background:transparent;color:#fff;font:600 15px/36px system-ui,sans-serif;cursor:pointer;text-shadow:0 1px 2px rgba(0,0,0,.35)}',
    '.vf-lightbox .vf-lb-close:hover{opacity:.85}',
    '.vf-lightbox .vf-lb-player{position:relative;width:min(360px,72vw);aspect-ratio:9/16;max-height:min(78vh,720px);background:#111;border-radius:10px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35)}',
    '.vf-lightbox .vf-lb-player video,.vf-lightbox .vf-lb-player img{display:block;width:100%;height:100%;object-fit:cover;background:#111}',
    /* Same control pattern as product-main image zoom: previous / close / next */
    '.vf-lightbox .vf-lb-controls{position:relative;z-index:2;display:flex;align-items:center;gap:12px}',
    '.vf-lightbox .vf-lb-controls button{width:36px;height:36px;border:0;border-radius:50%;background:#fff;color:#222;font-size:22px;line-height:36px;cursor:pointer;padding:0}',
    '.vf-lightbox .vf-lb-controls button:hover{background:#f3f3f3}',
    '.vf-lightbox .vf-lb-controls button:disabled{opacity:.4;cursor:default}',
  ].join(''));

  const ASPECT = { '9/16': 9 / 16, '4/5': 4 / 5, '1/1': 1, '16/9': 16 / 9 };
  const PLAT = {
    tiktok: { label: 'TikTok', color: '#000' },
    instagram: { label: 'Instagram', color: '#C13584' },
    youtube: { label: 'YouTube', color: '#FF0000' },
  };

  let lbItems = [];
  let lbIndex = 0;
  let lbLayer = null;

  function closeLightbox() {
    document.querySelectorAll('.vf-lightbox').forEach((n) => {
      const v = n.querySelector('video');
      if (v) { try { v.pause(); } catch (_) {} }
      n.remove();
    });
    lbLayer = null;
    lbItems = [];
    lbIndex = 0;
    document.removeEventListener('keydown', onLbKey);
  }

  function normalizePlaylist(coverOrItems, videoOrIndex) {
    // openLightbox([{ cover, video }, ...], startIndex)
    if (Array.isArray(coverOrItems)) {
      const items = coverOrItems.map((it) => ({
        cover: String((it && (it.cover || it.cover_image)) || ''),
        video: String((it && (it.video || it.video_url || it.videoUrl)) || ''),
      })).filter((it) => it.cover || it.video);
      const idx = Math.max(0, Math.min(items.length - 1, Number(videoOrIndex) || 0));
      return { items: items.length ? items : [{ cover: '', video: '' }], index: items.length ? idx : 0 };
    }
    // openLightbox(cover, videoUrl) — single clip (legacy)
    return {
      items: [{ cover: String(coverOrItems || ''), video: String(videoOrIndex || '') }],
      index: 0,
    };
  }

  function renderLbMedia() {
    if (!lbLayer || !lbItems.length) return;
    const item = lbItems[lbIndex] || lbItems[0];
    const src = item.video || SAMPLE_CLIP;
    const player = lbLayer.querySelector('.vf-lb-player');
    if (!player) return;
    const prev = player.querySelector('video');
    if (prev) { try { prev.pause(); } catch (_) {} }
    player.innerHTML = '<video controls playsinline autoplay poster="' + OS.esc(item.cover || '') + '" src="' + OS.esc(src) + '"></video>';
    const multi = lbItems.length > 1;
    lbLayer.querySelectorAll('[data-vf-lb-step]').forEach((btn) => {
      btn.disabled = !multi;
    });
  }

  function stepLightbox(dir) {
    if (lbItems.length < 2) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    renderLbMedia();
  }

  function onLbKey(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepLightbox(1);
    }
  }

  function openLightbox(coverOrItems, videoOrIndex) {
    closeLightbox();
    const normalized = normalizePlaylist(coverOrItems, videoOrIndex);
    lbItems = normalized.items;
    lbIndex = normalized.index;
    const multi = lbItems.length > 1;
    const layer = document.createElement('div');
    layer.className = 'vf-lightbox';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', 'Video');
    layer.innerHTML =
      '<button type="button" class="vf-lb-close" data-vf-lb-close>Close</button>' +
      '<div class="vf-lb-player"></div>' +
      '<div class="vf-lb-controls">' +
        '<button type="button" data-vf-lb-step="-1" aria-label="Previous video"' + (multi ? '' : ' disabled') + '>&#8249;</button>' +
        '<button type="button" data-vf-lb-close aria-label="Close video">&#215;</button>' +
        '<button type="button" data-vf-lb-step="1" aria-label="Next video"' + (multi ? '' : ' disabled') + '>&#8250;</button>' +
      '</div>';
    document.body.appendChild(layer);
    lbLayer = layer;
    renderLbMedia();
    const close = () => closeLightbox();
    layer.querySelectorAll('[data-vf-lb-close]').forEach((btn) => {
      btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); close(); };
    });
    layer.querySelectorAll('[data-vf-lb-step]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        stepLightbox(Number(btn.getAttribute('data-vf-lb-step') || 0));
      };
    });
    layer.addEventListener('click', (e) => {
      if (e.target === layer) close();
    });
    document.addEventListener('keydown', onLbKey);
  }

  // Shared by product-main › Video column block.
  // Signature: openVideoLightbox(cover, videoUrl) or openVideoLightbox([{cover,video},...], index)
  OS.openVideoLightbox = openLightbox;
  OS.closeVideoLightbox = closeLightbox;
  OS.sampleVideoClip = SAMPLE_CLIP;

  OS.register('video-feed', {
    name: 'Video feed', group: 'content', icon: 'play',
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'subheading', control: 'text', label: 'Subheading', default: '' },
      // Videos-only by default — heading / captions are optional overlays on top of the cover rail.
      { key: 'heading', control: 'text', label: 'Heading', default: '' },
      { key: 'description', control: 'richtext', label: 'Description', default: '' },
      { key: 'heading_alignment', control: 'segmented', label: 'Heading alignment', default: 'left', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
      { key: 'layout_style', control: 'select', label: 'Layout', default: 'carousel', options: [{ value: 'carousel', label: 'Carousel' }, { value: 'grid', label: 'Grid' }] },
      { key: 'video_card_style', control: 'select', label: 'Video card style', default: 'simple', options: [{ value: 'simple', label: 'Simple' }, { value: 'social', label: 'Social' }, { value: 'product', label: 'Product' }] },
      { key: 'desktop_videos', control: 'range', label: 'Videos per row · Desktop', min: 2, max: 6, step: 1, default: 4 },
      { key: 'mobile_videos', control: 'range', label: 'Videos per row · Mobile', min: 1, max: 2, step: 1, default: 1 },
      { key: 'gap', control: 'range', label: 'Gap', min: 8, max: 40, step: 1, unit: 'px', default: 16 },
      { key: 'video_aspect_ratio', control: 'select', label: 'Video aspect ratio', default: '9/16', options: [{ value: '9/16', label: '9:16 (vertical)' }, { value: '4/5', label: '4:5' }, { value: '1/1', label: '1:1' }, { value: '16/9', label: '16:9' }] },
      { key: 'border_radius', control: 'range', label: 'Corner radius', min: 0, max: 24, step: 1, unit: 'px', default: 12 },
      { key: 'show_play_button', control: 'toggle', label: 'Show play button', default: true },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'card_background', control: 'color', label: 'Card background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#1a1a1a') },
    ],
    blocks: {
      name: 'Video item', kind: 'item', max: 20,
      fields: [
        { key: 'cover_image', control: 'image', label: 'Cover image', default: '', required: true },
        { key: 'video_url', control: 'url', label: 'Video URL', default: '', placeholder: 'Paste a link', info: 'Use a YouTube or Vimeo URL' },
        { key: 'username', control: 'text', label: 'Username', default: '' },
        { key: 'title', control: 'text', label: 'Title', default: '' },
        { key: 'platform', control: 'select', label: 'Platform', default: 'none', options: [{ value: 'none', label: 'None' }, { value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }] },
        { key: 'associated_product', control: 'product', label: 'Associated product', default: '' },
      ],
      defaults: () => ({ cover_image: OS.sample.IMG.ug1 || OS.sample.IMG.p3, video_url: '', username: '', title: '', platform: 'none', associated_product: '' }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug1 || OS.sample.IMG.p3, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug2 || OS.sample.IMG.p4, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug3 || OS.sample.IMG.p5, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug4 || OS.sample.IMG.p1, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug5 || OS.sample.IMG.p2, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
      { id: OS.uid('vid'), kind: 'item', hidden: false, settings: { cover_image: OS.sample.IMG.ug6 || OS.sample.IMG.p6, video_url: '', username: '', title: '', platform: 'none', associated_product: '' } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob;
      const text = OS.col(s.text, (t.colors && t.colors.text_color) || '#1a1a1a');
      const headColor = OS.col(s.text, (t.colors && t.colors.heading_color) || '#1a1a1a');
      const bg = OS.bgOrTransparent(s.background), cardBg = OS.bgOrTransparent(s.card_background);
      const padV = OS.secSpace(t, mob), padH = OS.pagePad(t, mob);
      const maxW = s.full_width ? '100%' : OS.pageWidth(t) + 'px';
      const gap = OS.clamp(s.gap, 8, 40, 16);
      const rad = OS.clamp(s.border_radius, 0, 24, 12);
      const style = s.video_card_style || 'simple';
      const ratio = ASPECT[s.video_aspect_ratio] ? s.video_aspect_ratio : '9/16';
      const isGrid = s.layout_style === 'grid';
      const perView = mob ? OS.clamp(s.mobile_videos, 1, 2, 1) : OS.clamp(s.desktop_videos, 2, 6, 4);
      const align = mob ? 'left' : (s.heading_alignment || 'left');
      const muted = (t.colors && t.colors.secondary_color) || '#777';
      const saleColor = (t.colors && t.colors.sale_price_color) || '#d92d20';
      const items = (blocks || []).filter((b) => !b.hidden && b.settings.cover_image);
      const multi = !isGrid && items.length > perView;

      const hasHead = !!(s.subheading || s.heading || s.description);
      const head = hasHead
        ? '<div class="vf-head' + (align === 'center' ? ' c' : '') + '">' +
            (s.subheading ? '<div class="vf-sub">' + OS.esc(s.subheading) + '</div>' : '') +
            (s.heading ? '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 24 : 32) + 'px;color:' + headColor + '">' + OS.esc(s.heading) + '</h2>' : '') +
            (s.description ? '<div class="vf-desc">' + s.description + '</div>' : '') +
          '</div>'
        : '';

      if (!items.length) {
        return '<div class="vfx" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padH + 'px">' +
          '<div style="max-width:' + maxW + ';margin:0 auto">' + head +
          '<div class="vf-empty">Add a Video item from the structure tree.</div></div></div>';
      }

      const itemW = isGrid ? 'auto' : 'calc((100% - ' + gap + 'px * ' + (perView - 1) + ') / ' + perView + ')';

      const cards = items.map((b0) => {
        const b = b0.settings;
        const plat = b.platform && PLAT[b.platform] ? PLAT[b.platform] : null;
        const prod = b.associated_product ? OS.sample.products.find((p) => p.id === b.associated_product) : null;
        const playBtn = s.show_play_button !== false ? '<div class="vf-play">' + OS.icon('play') + '</div>' : '';
        const platTag = (style !== 'product' && plat) ? '<span class="vf-tag" style="background:' + plat.color + '">' + OS.esc(plat.label) + '</span>' : '';
        const overlay = style === 'social'
          ? '<div class="vf-grad"></div><div class="vf-over">' +
              (b.username ? '<div class="vf-user">' + OS.esc(b.username) + (plat ? '<span style="font-weight:500;opacity:.85;font-size:11px">· ' + OS.esc(plat.label) + '</span>' : '') + '</div>' : '') +
              (b.title ? '<div class="vf-cap">' + OS.esc(b.title) + '</div>' : '') +
            '</div>'
          : '';
        const media = '<button type="button" class="vf-media" data-vf-open data-cover="' + OS.esc(b.cover_image) + '" data-video="' + OS.esc(b.video_url || '') + '" aria-label="Play video" style="aspect-ratio:' + ratio + ';border-radius:' + rad + 'px">' +
          '<img src="' + OS.esc(b.cover_image) + '" alt="' + OS.esc(b.title || b.username || 'Video') + '" loading="lazy">' +
          overlay + platTag + playBtn + '</button>';
        let foot = '';
        if (style === 'simple') {
          foot = (b.username || b.title) ? '<div class="vf-foot">' +
            (b.username ? '<div class="vf-fuser">' + OS.esc(b.username) + '</div>' : '') +
            (b.title ? '<div class="vf-fcap">' + OS.esc(b.title) + '</div>' : '') + '</div>' : '';
        } else if (style === 'product') {
          foot = prod
            ? '<div class="vf-prod"><div class="vf-prod-img" style="background-image:url(' + OS.esc(prod.image) + ')"></div>' +
                '<div class="vf-prod-info"><div class="vf-prod-t">' + OS.esc(prod.title) + '</div>' +
                '<div class="vf-prod-p" style="color:' + saleColor + '">' + OS.money(prod.price) + '</div></div></div>'
            : (b.title ? '<div class="vf-foot"><div class="vf-fcap" style="color:' + muted + '">' + OS.esc(b.title) + '</div></div>' : '');
        }
        return '<div class="vf-card" data-block-id="' + OS.esc(b0.id) + '" style="background:' + cardBg + ';color:' + text + ';width:' + itemW + ';border-radius:' + rad + 'px;' +
          'padding:' + (cardBg === 'transparent' ? '0' : '8px') + ';' +
          (style === 'product' && cardBg !== 'transparent' ? 'padding-bottom:8px;' : '') + '">' +
          media + foot + '</div>';
      }).join('');

      let container;
      if (isGrid) {
        container = '<div class="vf-grid" style="grid-template-columns:repeat(' + perView + ',1fr);gap:' + gap + 'px">' + cards + '</div>';
      } else if (multi) {
        container = '<div class="vf-carousel-wrap has-nav">' +
          '<div class="vf-rail" style="gap:' + gap + 'px">' + cards + '</div>' +
          '<button class="vf-nav vf-prev" type="button" aria-label="Previous">' + ARROW_L + '</button>' +
          '<button class="vf-nav vf-next" type="button" aria-label="Next">' + ARROW_R + '</button>' +
          '</div>';
      } else {
        container = '<div class="vf-rail" style="gap:' + gap + 'px">' + cards + '</div>';
      }

      return '<div class="vfx" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padH + 'px">' +
        '<div style="max-width:' + maxW + ';margin:0 auto">' + head + container + '</div></div>';
    },
    hydrate: function (el) {
      const openBtns = Array.from(el.querySelectorAll('[data-vf-open]'));
      const playlist = openBtns.map((btn) => ({
        cover: btn.getAttribute('data-cover') || '',
        video: btn.getAttribute('data-video') || '',
      }));
      openBtns.forEach((btn, i) => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(playlist.length ? playlist : [{
            cover: btn.getAttribute('data-cover') || '',
            video: btn.getAttribute('data-video') || '',
          }], i);
        };
      });

      const wrap = el.querySelector('.vf-carousel-wrap.has-nav');
      if (!wrap) return;
      const track = wrap.querySelector('.vf-rail');
      const prev = wrap.querySelector('.vf-prev');
      const next = wrap.querySelector('.vf-next');
      if (!track || !prev || !next) return;
      const step = () => {
        const card = track.querySelector('.vf-card');
        if (!card) return track.clientWidth;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return card.getBoundingClientRect().width + gap;
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= max;
      };
      prev.onclick = (e) => { e.preventDefault(); e.stopPropagation(); track.scrollBy({ left: -step(), behavior: 'smooth' }); };
      next.onclick = (e) => { e.preventDefault(); e.stopPropagation(); track.scrollBy({ left: step(), behavior: 'smooth' }); };
      track.addEventListener('scroll', update, { passive: true });
      setTimeout(update, 0);
    },
  });
})();

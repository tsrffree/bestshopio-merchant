/* Testimonial — customer review cards. Ported from testimonial.canvas.tsx.
   Homogeneous Testimonial blocks (max 20). Shows `columns` at a time; when there are
   more cards, arrow buttons slide the row (same pattern as checkout Review card). */
(function () {
  const OS = window.OS;
  const CHEV = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  const ARROW_L = CHEV('m15 6-6 6 6 6');
  const ARROW_R = CHEV('m9 6 6 6-6 6');

  OS.css('testimonial', [
    '.tmx{box-sizing:border-box}.tmx *{box-sizing:border-box}',
    '.tmx .tm-head{text-align:center;margin-bottom:22px}',
    '.tmx .tm-sub{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.6;margin-bottom:6px}',
    '.tmx h2{margin:0;line-height:1.12}',
    '.tmx .tm-grid{display:grid;align-items:stretch}',
    '.tmx .tm-carousel-wrap{position:relative}',
    '.tmx .tm-carousel{display:flex;align-items:stretch;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none}',
    '.tmx .tm-carousel::-webkit-scrollbar{display:none;width:0;height:0}',
    '.tmx .tm-carousel .tm-card{flex:0 0 auto;scroll-snap-align:start;min-width:0}',
    '.tmx .tm-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,.08);background:#fff;color:#1a1a1a;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.14);z-index:2;padding:0}',
    '.tmx .tm-prev{left:0}.tmx .tm-next{right:0}',
    '.tmx .tm-carousel-wrap.has-nav{padding:0 8px}',
    '.tmx .tm-carousel-wrap.has-nav .tm-prev{left:-4px}.tmx .tm-carousel-wrap.has-nav .tm-next{right:-4px}',
    '.tmx .tm-nav:hover{background:#1a1a1a;color:#fff}',
    '.tmx .tm-nav:disabled{opacity:.3;cursor:default;background:#fff;color:#1a1a1a;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
    '.tmx .tm-card{border-radius:14px;padding:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(0,0,0,.08);box-shadow:0 1px 3px rgba(0,0,0,.06)}',
    '.tmx .tm-media{position:relative;display:block;width:100%;aspect-ratio:1/1;overflow:hidden;background:#e7e9ee;text-decoration:none;color:inherit}',
    '.tmx .tm-media-img{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat}',
    '.tmx .tm-body{padding:16px 16px 12px;display:flex;flex-direction:column;gap:8px;flex:1}',
    '.tmx .tm-stars{display:flex;gap:2px}.tmx .tm-stars svg{width:16px;height:16px}',
    '.tmx .tm-q{font-size:14px;line-height:1.6}',
    '.tmx .tm-q p{margin:0 0 6px}.tmx .tm-q p:last-child{margin-bottom:0}',
    '.tmx .tm-h{font-weight:700;font-size:15px;line-height:1.3}',
    /* Inset divider — same idea as the old in-card prod row, not full-bleed across the card */
    '.tmx .tm-foot{display:flex;align-items:center;gap:10px;margin:0 16px 16px;padding:12px 0 0;border-top:1px solid rgba(0,0,0,.08)}',
    '.tmx .tm-av{width:38px;height:38px;background-size:cover;background-position:center;background-color:#e7e9ee;flex:none}',
    '.tmx .tm-av.round{border-radius:50%}',
    '.tmx .tm-meta{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px}',
    '.tmx .tm-name{font-size:13px;font-weight:600;line-height:1.2}',
    '.tmx .tm-verified{font-size:11px;font-weight:700;display:flex;align-items:center;gap:3px;line-height:1.2}',
  ].join(''));

  const stars = (n, color) => { let h = ''; for (let i = 1; i <= 5; i++) { const fill = n >= i ? color : '#d8dce3'; h += '<span style="color:' + fill + '">' + OS.icon('star') + '</span>'; } return '<div class="tm-stars">' + h + '</div>'; };

  OS.register('testimonial', {
    name: 'Testimonial', group: 'social', icon: 'layers',
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'subheading', control: 'text', label: 'Subheading', default: '' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'What our customers say' },
      { key: 'desktop_columns', control: 'range', label: 'Desktop columns', min: 1, max: 6, step: 1, default: 4 },
      { key: 'mobile_columns', control: 'range', label: 'Mobile columns', min: 1, max: 2, step: 1, default: 1 },
      { key: 'content_alignment', control: 'segmented', label: 'Content alignment', default: 'left', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'card_background', control: 'color', label: 'Card background', default: '#FFFFFF', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true },
      { key: 'star_color', control: 'color', label: 'Star color', default: '#F5B301' },
      /* Shopify Polaris green — same family as admin / many Shopify review apps */
      { key: 'verified_color', control: 'color', label: 'Verified badge', default: '#008060' },
    ],
    blocks: {
      name: 'Testimonial', kind: 'review', max: 20,
      fields: [
        { key: 'avatar', control: 'image', label: 'Avatar', default: '' },
        { key: 'round_avatar', control: 'toggle', label: 'Round avatar', default: true },
        { key: 'show_rating', control: 'toggle', label: 'Show rating', default: true },
        { key: 'rating', control: 'range', label: 'Rating', min: 1, max: 5, step: 0.5, default: 5, visibleWhen: (s) => s.show_rating },
        { key: 'author', control: 'text', label: 'Author', default: '' },
        { key: 'show_verified', control: 'toggle', label: 'Show verified buyer', default: false },
        { key: 'heading', control: 'text', label: 'Heading', default: '' },
        { key: 'content', control: 'richtext', label: 'Content', default: '', required: true },
        { key: 'associated_product', control: 'product', label: 'Associated product', default: '' },
      ],
      defaults: () => ({ round_avatar: true, show_rating: true, rating: 5, content: 'Absolutely love it — exactly as described and great quality.' }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av1, round_avatar: true, show_rating: true, rating: 5, author: 'Sarah M.', show_verified: true, heading: 'Pure quality', content: 'The fit is perfect and the fabric feels amazing. I’ve already ordered two more.', associated_product: 'p1' } },
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av2, round_avatar: true, show_rating: true, rating: 4.5, author: 'James L.', show_verified: true, heading: 'Great value', content: 'Shipping was fast and the product exceeded my expectations for the price.', associated_product: 'p3' } },
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av3, round_avatar: true, show_rating: true, rating: 5, author: 'Mei K.', show_verified: false, heading: 'Obsessed', content: 'My new favourite. Comfortable enough to wear every single day.', associated_product: 'p2' } },
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av1, round_avatar: true, show_rating: true, rating: 4.5, author: 'Dana P.', show_verified: true, heading: 'Will buy again', content: 'Soft, well made and true to size. Highly recommend.', associated_product: 'p4' } },
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av2, round_avatar: true, show_rating: true, rating: 5, author: 'Chris N.', show_verified: true, heading: 'Everyday staple', content: 'Wore it three times this week. Holds its shape and washes well.', associated_product: 'p5' } },
      { id: OS.uid('tm'), kind: 'review', hidden: false, settings: { avatar: OS.sample.IMG.av3, round_avatar: true, show_rating: true, rating: 4.5, author: 'Alicia R.', show_verified: true, heading: 'Better than expected', content: 'Color matches the photos and the cut is flattering. Already planning a second order.', associated_product: 'p1' } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob;
      const text = OS.col(s.text, (t.colors && t.colors.text_color) || '#1a1a1a');
      const titleColor = OS.col(s.text, (t.colors && t.colors.heading_color) || '#103635');
      const bg = OS.bgOrTransparent(s.background), cardBg = OS.bgOrTransparent(s.card_background) || '#FFFFFF';
      const padV = OS.secSpace(t, mob), padX = OS.pageGutter(t, mob, { fullWidth: !!s.full_width }), gap = OS.gridGap(t, mob);
      const cols = mob ? OS.clamp(s.mobile_columns, 1, 2, 1) : OS.clamp(s.desktop_columns, 1, 6, 4);
      const align = s.content_alignment || 'left';
      const starColor = s.star_color || '#F5B301';
      const rawVerified = s.verified_color || '#008060';
      const verifiedColor = (/^#22c55e$/i.test(rawVerified) ? '#008060' : rawVerified);
      const items = (blocks || []).filter((b) => !b.hidden && b.settings.content);
      const multi = items.length > cols;
      const cardBasis = multi
        ? 'calc((100% - ' + (gap * (cols - 1)) + 'px) / ' + cols + ')'
        : '';
      const cards = items.map((b0) => {
        const b = b0.settings;
        const prod = b.associated_product ? OS.sample.products.find((p) => p.id === b.associated_product) : null;
        const media = prod
          ? '<a class="tm-media" href="/products/' + OS.esc(prod.handle || prod.id) + '" aria-label="' + OS.esc(prod.title) + '">' +
              '<div class="tm-media-img" style="background-image:url(' + OS.esc(prod.image) + ')"></div>' +
            '</a>'
          : '';
        const foot = '<div class="tm-foot">' +
          (b.avatar ? '<div class="tm-av' + (b.round_avatar !== false ? ' round' : '') + '" style="background-image:url(' + OS.esc(b.avatar) + ')"></div>' : '') +
          '<div class="tm-meta"><div class="tm-name">' + OS.esc(b.author || 'Verified buyer') + '</div>' +
          (b.show_verified ? '<div class="tm-verified" style="color:' + verifiedColor + '">✓ Verified buyer</div>' : '') +
          '</div></div>';
        return '<div class="tm-card" data-block-id="' + OS.esc(b0.id) + '" style="background:' + cardBg + ';color:' + text + ';text-align:' + align + (cardBasis ? ';flex-basis:' + cardBasis + ';width:' + cardBasis + ';max-width:' + cardBasis : '') + '">' +
          media +
          '<div class="tm-body">' +
            (b.show_rating !== false ? stars(b.rating, starColor) : '') +
            (b.heading ? '<div class="tm-h" style="color:' + titleColor + '">' + OS.esc(b.heading) + '</div>' : '') +
            '<div class="tm-q">' + (b.content || '') + '</div>' +
          '</div>' +
          foot +
          '</div>';
      }).join('');
      const head = '<div class="tm-head">' + (s.subheading ? '<div class="tm-sub">' + OS.esc(s.subheading) + '</div>' : '') +
        (s.heading ? '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 24 : 32) + 'px;color:' + titleColor + '">' + OS.esc(s.heading) + '</h2>' : '') + '</div>';
      let body;
      if (!items.length) {
        body = '<div style="opacity:.5;font-size:13px;padding:20px">Add a testimonial.</div>';
      } else if (multi) {
        body = '<div class="tm-carousel-wrap has-nav">' +
          '<div class="tm-carousel" style="gap:' + gap + 'px">' + cards + '</div>' +
          '<button class="tm-nav tm-prev" type="button" aria-label="Previous">' + ARROW_L + '</button>' +
          '<button class="tm-nav tm-next" type="button" aria-label="Next">' + ARROW_R + '</button>' +
          '</div>';
      } else {
        body = '<div class="tm-grid" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:' + gap + 'px">' + cards + '</div>';
      }
      return '<div class="tmx" style="background:' + bg + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padX + '">' +
        '<div style="max-width:100%;margin:0 auto">' + head + body + '</div></div>';
    },
    hydrate: function (el) {
      const wrap = el.querySelector('.tm-carousel-wrap.has-nav');
      if (!wrap) return;
      const track = wrap.querySelector('.tm-carousel');
      const prev = wrap.querySelector('.tm-prev');
      const next = wrap.querySelector('.tm-next');
      if (!track || !prev || !next) return;
      const step = () => {
        const card = track.querySelector('.tm-card');
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

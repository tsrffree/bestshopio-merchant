/* Product information — the required PDP buy box.
   Settings follow the Theme PDP research: breadcrumb, desktop media layout / size,
   mobile expanded vs contained, zoom, video chrome, purchase-area colors, trust badge,
   and padding. ATC adds the selected variant with a fly-to-cart effect (no popup). */
(function () {
  const OS = window.OS;

  // Shared catalog for Featured reviews · Auto pull + Manual "select existing".
  // Review image + avatar are real mock media URLs so the editor image picker and media library match the canvas.
  OS.featuredReviewCatalog = function () {
    const IMG = (OS.sample && OS.sample.IMG) || {};
    const gallery = (a, b, c) => [a, b, c].filter(Boolean);
    // Wildpeak apparel social proof — hike / fit / fabric copy with real product + lifestyle media.
    return [
      { id: 'rv-debi', author: 'Debi T.', rating: 5, text: 'Very comfortable and great fit. Want to buy more. Wore them on a ten hour hike. Held up great.', image: IMG.testi1 || IMG.ug1 || IMG.p1 || '', images: gallery(IMG.testi1, IMG.p1, IMG.p1b), avatar: IMG.av1 || '', item_type: 'Black / M' },
      { id: 'rv-maya', author: 'Maya L.', rating: 5, text: 'Worth every penny. Soft, breathable, and looks exactly like the photos.', image: IMG.testi2 || IMG.p1grn || IMG.p1 || '', images: gallery(IMG.testi2, IMG.p1grn, IMG.p1), avatar: IMG.av2 || '', item_type: 'Green / S' },
      { id: 'rv-jonah', author: 'Jonah P.', rating: 5, text: 'True to size and arrived faster than expected. Layers clean under a shell.', image: IMG.ug4 || IMG.p4 || '', images: gallery(IMG.ug4, IMG.p4, IMG.p4b), avatar: IMG.av3 || '', item_type: 'Black / L' },
      { id: 'rv-alicia', author: 'Alicia R.', rating: 5, text: 'Color matches the gallery and the cut is flattering. Already planning a second order.', image: IMG.testi3 || IMG.p1brg || '', images: gallery(IMG.testi3, IMG.p1brg, IMG.p1), avatar: IMG.av1 || '', item_type: 'Burgundy / M' },
      { id: 'rv-chris', author: 'Chris N.', rating: 5, text: 'Wore it three days on the trail. Holds shape, dries fast, no itch.', image: IMG.ug2 || IMG.p3 || '', images: gallery(IMG.ug2, IMG.p3, IMG.p3b), avatar: IMG.av2 || '', item_type: 'Green / M' },
      { id: 'rv-dana', author: 'Dana P.', rating: 4, text: 'Soft hand feel and a clean outdoor cut. Highly recommend for travel packing.', image: IMG.ug5 || IMG.p6 || '', images: gallery(IMG.ug5, IMG.p6, IMG.shorts1), avatar: IMG.av3 || '', item_type: 'Black / S' },
    ];
  };
  OS.featuredReviewItemFromCatalog = function (base) {
    const hit = base || (OS.featuredReviewCatalog() || [])[0] || { author: 'Debi T.', rating: 5, text: '', image: '', avatar: '' };
    const images = Array.isArray(hit.images) ? hit.images.filter(Boolean) : [];
    return {
      id: OS.uid('ri'),
      entry_type: 'custom',
      review_id: hit.id || 'rv-debi',
      author: hit.author || 'Debi T.',
      rating: Number(hit.rating) || 5,
      text: hit.text || 'Very comfortable and great fit. Want to buy more. Wore them on a ten hour hike. Held up great.',
      image: hit.image || images[0] || '',
      images: images.length ? images : (hit.image ? [hit.image] : []),
      avatar: hit.avatar || '',
      item_type: hit.item_type || '',
    };
  };
  OS.defaultFeaturedReviewItem = function () {
    return OS.featuredReviewItemFromCatalog((OS.featuredReviewCatalog() || [])[0]);
  };
  // Prefer the next unused catalog entry so carousel slides are visibly different.
  OS.nextFeaturedReviewItem = function (existing) {
    const catalog = OS.featuredReviewCatalog() || [];
    const usedIds = new Set((existing || []).map((row) => String((row && row.review_id) || '')));
    const usedAuthors = new Set((existing || []).map((row) => String((row && row.author) || '').toLowerCase()));
    const unused = catalog.find((row) => !usedIds.has(String(row.id || '')) && !usedAuthors.has(String(row.author || '').toLowerCase()));
    const fallback = catalog[(existing || []).length % Math.max(catalog.length, 1)] || catalog[0];
    return OS.featuredReviewItemFromCatalog(unused || fallback);
  };
  OS.resolveFeaturedReviewItems = function (settings, product) {
    const b = settings || {};
    const catalog = OS.featuredReviewCatalog() || [];
    const byId = (id) => catalog.find((r) => r.id === id) || null;
    const withProductImage = (r) => {
      const imgs = Array.isArray(r.images) ? r.images.filter(Boolean) : [];
      const image = r.image || imgs[0] || (product && product.image) || '';
      const images = imgs.length ? imgs : (image ? [image] : []);
      return Object.assign({}, r, {
        image: image,
        images: images,
        avatar: r.avatar || (product && product.image) || '',
        item_type: r.item_type || '',
      });
    };
    if (b.data_source === 'auto') {
      const n = Math.max(1, Math.min(8, Number(b.auto_count) || 3));
      return catalog.slice(0, n).map(withProductImage);
    }
    const rows = Array.isArray(b.reviews) ? b.reviews : [];
    if (!rows.length && (b.manual_author || b.manual_text)) {
      // Legacy single-manual fields → one custom card.
      return [withProductImage({
        author: b.manual_author || 'Debi T.',
        rating: Number(b.manual_rating) || 5,
        text: b.manual_text || '',
        image: b.manual_image || '',
        images: b.manual_image ? [b.manual_image] : [],
        avatar: '',
        item_type: '',
      })];
    }
    return rows.map((row) => {
      if (!row) return null;
      if (row.entry_type === 'library') {
        const hit = byId(row.review_id) || catalog[0];
        return hit ? withProductImage(hit) : null;
      }
      if (!(row.text || '').trim() && !(row.author || '').trim()) return null;
      const imgs = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
      return withProductImage({
        author: row.author || 'Customer',
        rating: Number(row.rating) || 5,
        text: row.text || '',
        image: row.image || imgs[0] || '',
        images: imgs.length ? imgs : (row.image ? [row.image] : []),
        avatar: row.avatar || '',
        item_type: row.item_type || '',
      });
    }).filter(Boolean);
  };

  OS.css('product-main', [
    '.pdpx{box-sizing:border-box;position:relative}.pdpx *{box-sizing:border-box}',
    '.pdpx .pdp-crumbs{font-size:12px;letter-spacing:.04em;text-transform:uppercase;margin:0 0 16px;opacity:.7}',
    '.pdpx .pdp-crumbs a{color:inherit;text-decoration:none}',
    '.pdpx .pdp-grid{display:grid;gap:30px;align-items:start}',
    '.pdpx.mob .pdp-grid{grid-template-columns:1fr!important;gap:30px}',
    '.pdpx .pdp-media{min-width:0}',
    '.pdpx .pdp-media.expanded{margin-left:-16px;margin-right:-16px}',
    '.pdpx .pdp-stage{position:relative;overflow:hidden;background:#efefef}',
    '.pdpx .pdp-nav{position:absolute;top:50%;z-index:4;display:grid;place-items:center;width:44px;height:44px;margin:0;padding:0;border:1px solid rgba(34,34,34,.16);border-radius:50%;background:#fff;color:#222;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .28s ease,background .2s ease,color .2s ease,border-color .2s ease,transform .28s ease}',
    '.pdpx .pdp-nav svg{width:16px;height:16px;display:block;transition:transform .22s ease}',
    '.pdpx .pdp-nav.prev{left:14px;transform:translate(-10px,-50%)}',
    '.pdpx .pdp-nav.next{right:14px;transform:translate(10px,-50%)}',
    '.pdpx .pdp-stage:hover .pdp-nav,.pdpx .pdp-stage:focus-within .pdp-nav{opacity:1;pointer-events:auto}',
    '.pdpx .pdp-stage:hover .pdp-nav.prev,.pdpx .pdp-stage:focus-within .pdp-nav.prev{transform:translate(0,-50%)}',
    '.pdpx .pdp-stage:hover .pdp-nav.next,.pdpx .pdp-stage:focus-within .pdp-nav.next{transform:translate(0,-50%)}',
    '.pdpx .pdp-nav:hover,.pdpx .pdp-nav:focus-visible{background:#111;color:#fff;border-color:#111}',
    '.pdpx .pdp-nav.prev:hover svg,.pdpx .pdp-nav.prev:focus-visible svg{transform:translateX(-3px)}',
    '.pdpx .pdp-nav.next:hover svg,.pdpx .pdp-nav.next:focus-visible svg{transform:translateX(3px)}',
    '.pdpx.mob .pdp-nav{opacity:1;pointer-events:auto}',
    '.pdpx.mob .pdp-nav.prev,.pdpx.mob .pdp-nav.next{transform:translate(0,-50%)}',
    '.pdpx .pdp-slide{position:absolute;inset:0;z-index:2;background-color:#efefef;background-position:center;background-size:cover;background-repeat:no-repeat;background-blend-mode:darken;pointer-events:none;will-change:transform}',
    '.pdpx .pdp-slide.from-right{animation:pdp-slide-in-right .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.from-left{animation:pdp-slide-in-left .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.to-left{animation:pdp-slide-out-left .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.to-right{animation:pdp-slide-out-right .42s cubic-bezier(.22,.61,.36,1) both}',
    '@keyframes pdp-slide-in-right{from{transform:translateX(100%)}to{transform:translateX(0)}}',
    '@keyframes pdp-slide-in-left{from{transform:translateX(-100%)}to{transform:translateX(0)}}',
    '@keyframes pdp-slide-out-left{from{transform:translateX(0)}to{transform:translateX(-100%)}}',
    '@keyframes pdp-slide-out-right{from{transform:translateX(0)}to{transform:translateX(100%)}}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-nav,.pdpx .pdp-nav svg{transition:none}.pdpx .pdp-nav.prev,.pdpx .pdp-nav.next{transform:translate(0,-50%)}.pdpx .pdp-slide{animation:none!important}}',
    '.pdpx .pdp-cell{position:relative;display:block;width:100%;border:0;padding:0;background:#efefef;cursor:pointer;overflow:hidden}',
    '.pdpx .pdp-cell > img,.pdpx .pdp-cell > video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;border:0;pointer-events:none}',
    '.pdpx .pdp-cell > img{mix-blend-mode:darken}',
    '.pdpx .pdp-cell > video{background:#111;mix-blend-mode:normal}',
    '.pdpx .pdp-thumb.is-video{position:relative}',
    '.pdpx .pdp-thumb-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:10px;line-height:22px;text-align:center;pointer-events:none}',
    '.pdpx .pdp-cell.zoomable{cursor:zoom-in}',
    '.pdpx .pdp-grid-1{display:grid;grid-template-columns:1fr;gap:8px}',
    '.pdpx .pdp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.pdpx .pdp-highlight{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:1fr 1fr;gap:8px}',
    '.pdpx .pdp-highlight .pdp-cell:first-child{grid-row:1/span 2;min-height:420px}',
    '.pdpx .pdp-collage{display:flex;flex-direction:column;gap:8px}',
    '.pdpx .pdp-collage-row{display:grid;gap:8px;width:100%}',
    '.pdpx .pdp-collage-row.full{grid-template-columns:1fr}',
    '.pdpx .pdp-collage-row.pair{grid-template-columns:1fr 1fr}',
    '.pdpx .pdp-collage-row.pair .pdp-cell:only-child{max-width:100%}',
    '.pdpx .pdp-carousel{display:grid;gap:8px}',
    '.pdpx .pdp-carousel.left{grid-template-columns:var(--pdp-thumb,72px) 1fr}',
    '.pdpx .pdp-thumbs{display:flex;gap:var(--pdp-thumb-gap,8px);padding-bottom:8px}',
    '.pdpx .pdp-carousel.left .pdp-thumbs{flex-direction:column;row-gap:calc(var(--pdp-thumb-gap,8px) + 6px)}',
    '.pdpx .pdp-thumb{position:relative;width:var(--pdp-thumb,64px);height:var(--pdp-thumb,64px);flex:0 0 auto;border:0;border-radius:0;outline:0;background-color:#efefef;background-position:center;background-size:cover;background-repeat:no-repeat;background-blend-mode:darken;padding:0;cursor:pointer;box-sizing:border-box;box-shadow:none}',
    '.pdpx .pdp-thumb:focus,.pdpx .pdp-thumb:focus-visible{outline:0;box-shadow:none}',
    '.pdpx .pdp-carousel:not(.left) .pdp-thumb{flex:1 1 0;width:auto;height:auto;min-width:0;aspect-ratio:1/1}',
    '.pdpx .pdp-carousel.left .pdp-thumb{width:100%;height:auto;aspect-ratio:1/1}',
    '.pdpx[data-media-size="small"]{--pdp-thumb:56px;--pdp-thumb-gap:6px}',
    '.pdpx[data-media-size="medium"]{--pdp-thumb:72px;--pdp-thumb-gap:8px}',
    '.pdpx[data-media-size="large"]{--pdp-thumb:96px;--pdp-thumb-gap:10px}',
    '.pdpx .pdp-thumb.on::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:3px;background:#111;pointer-events:none}',
    '.pdpx .pdp-dots{display:flex;justify-content:center;gap:6px;margin-top:10px}',
    '.pdpx .pdp-dot{width:7px;height:7px;border-radius:50%;border:0;background:rgba(0,0,0,.2);padding:0;cursor:pointer}',
    '.pdpx .pdp-dot.on{background:currentColor}',
    '.pdpx .pdp-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:18px;box-shadow:0 8px 20px rgba(0,0,0,.18)}',
    '.pdpx .pdp-play i{margin-left:3px}',
    '.pdpx .pdp-video-ui{position:absolute;left:10px;right:10px;bottom:10px;display:flex;align-items:center;gap:8px}',
    '.pdpx .pdp-chip{height:28px;min-width:28px;border-radius:999px;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:700}',
    '.pdpx .pdp-time{flex:1;height:3px;border-radius:99px;background:rgba(255,255,255,.45);position:relative}',
    '.pdpx .pdp-time i{position:absolute;left:0;top:0;bottom:0;width:35%;background:#fff;border-radius:99px}',
    '.pdpx .pdp-badge{position:absolute;z-index:2;display:grid;place-items:center;background:#fff;color:#111;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:50%;box-shadow:0 6px 16px rgba(0,0,0,.12);text-align:center;line-height:1.15;padding:8px}',
    '.pdpx .pdp-badge.img{background:center/contain no-repeat;border-radius:0;box-shadow:none;padding:0}',
    '.pdpx .pdp-badge.tl{top:12px;left:12px}.pdpx .pdp-badge.tr{top:12px;right:12px}',
    '.pdpx .pdp-badge.bl{bottom:12px;left:12px}.pdpx .pdp-badge.br{bottom:12px;right:12px}',
    '.pdpx .pdp-buy{display:flex;flex-direction:column;gap:0;border-radius:0}',
    '.pdpx .pdp-row{margin:0}',
    '.pdpx .pdp-row+.pdp-row{margin-top:24px}',
    '.pdpx .pdp-kind-badges+.pdp-kind-title{margin-top:20px}',
    '.pdpx .pdp-row+.pdp-kind-price,.pdpx .pdp-row+.pdp-kind-description,.pdpx .pdp-row+.pdp-kind-inventory{margin-top:16px}',
    '.pdpx .pdp-kind-shipping+.pdp-kind-icon_text,.pdpx .pdp-kind-icon_text+.pdp-kind-icon_text,.pdpx .pdp-kind-icon_text+.pdp-kind-shipping{margin-top:12px}',
    '.pdpx .pdp-row+.pdp-kind-actions{margin-top:11px}',
    '.pdpx .pdp-row+.pdp-kind-buy,.pdpx .pdp-kind-buy+.pdp-row{margin-top:32px}',
    // Icon with text + collapsible stack matches Symmetry my-7 (~28px) rhythm.
    '.pdpx .pdp-kind-buy+.pdp-kind-icon_text,.pdpx .pdp-kind-icon_text+.pdp-kind-collapsible{margin-top:28px}',
    '.pdpx .pdp-kind-recommendations+.pdp-kind-collapsible{margin-top:12px}',
    '.pdpx .pdp-kind-collapsible+.pdp-kind-collapsible{margin-top:0}',
    '.pdpx.mob .pdp-row+.pdp-row{margin-top:20px}',
    '.pdpx.mob .pdp-kind-badges+.pdp-kind-title{margin-top:16px}',
    '.pdpx.mob .pdp-row+.pdp-kind-price,.pdpx.mob .pdp-row+.pdp-kind-description,.pdpx.mob .pdp-row+.pdp-kind-inventory{margin-top:12px}',
    '.pdpx.mob .pdp-kind-shipping+.pdp-kind-icon_text,.pdpx.mob .pdp-kind-icon_text+.pdp-kind-icon_text,.pdpx.mob .pdp-kind-icon_text+.pdp-kind-shipping{margin-top:8px}',
    '.pdpx.mob .pdp-row+.pdp-kind-actions{margin-top:7px}',
    '.pdpx.mob .pdp-row+.pdp-kind-buy,.pdpx.mob .pdp-kind-buy+.pdp-row{margin-top:24px}',
    '.pdpx.mob .pdp-kind-recommendations+.pdp-kind-collapsible{margin-top:8px}',
    '.pdpx.mob .pdp-kind-collapsible+.pdp-kind-collapsible{margin-top:0}',
    '.pdpx .pdp-row[data-block-id]{scroll-margin:80px}',
    '.pdpx .pdp-title{margin:0 0 17px;line-height:1.2;font-weight:200;letter-spacing:-0.04em}',
    '.pdpx .pdp-title-desc{font-size:14px;line-height:1.55}',
    '.pdpx .pdp-title-desc img{display:block;max-width:100%;margin-top:8px;border-radius:8px}',
    '.pdpx .pdp-desc{box-sizing:border-box;color:inherit;opacity:.92}',
    '.pdpx .pdp-desc.has-bg{background:var(--pdp-desc-bg,#f6f6f6);border-radius:var(--pdp-desc-radius,0px)}',
    '.pdpx .pdp-desc ul,.pdpx .pdp-desc ol{padding-left:1.2em;margin:.4em 0}',
    '.pdpx .pdp-desc p{margin:.4em 0}',
    '.pdpx .pdp-desc img{display:block;max-width:100%;margin-top:8px;border-radius:8px}',
    '.pdpx .pdp-vendor{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.65}',
    '.pdpx{position:relative}',
    '.pdpx .pdp-tags{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-start}',
    '.pdpx .pdp-tags[data-badge-position="right"]{justify-content:flex-end}',
    '.pdpx .pdp-tag{display:inline-flex;align-items:center;gap:4px;box-sizing:border-box;height:24px;min-height:24px;max-height:24px;padding:2px 8px;border-radius:5px;background:#5b3f94;color:#fff;font-size:14.4px;font-weight:700;line-height:18px;letter-spacing:normal;border:0;box-shadow:none}',
    '.pdpx .pdp-tag svg,.pdpx .pdp-tag img{width:12px;height:12px;flex:none;object-fit:contain}',
    '.pdpx .pdp-tag.tag-new{background:#ffc439;color:#fff}',
    '.pdpx .pdp-tag.sale{background:#d63a2f}.pdpx .pdp-tag.sold{background:#4b5563}.pdpx .pdp-tag.preorder{background:#5b3f94;color:#fff}',
    /* Outline must share the exact 24px filled box — never grow via border/shadow. */
    '.pdpx .pdp-tag.outline{background:#f9fafb;border:0!important;outline:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);font-weight:700;letter-spacing:normal;height:24px;min-height:24px;max-height:24px;padding:2px 8px}',
    '.pdpx .pdp-rate{display:flex;align-items:center;gap:6px;font-size:13px;line-height:1}',
    '.pdpx .pdp-rate-stars{display:inline-flex;align-items:center;gap:2px;flex:none}',
    '.pdpx .pdp-rate-icon,.pdpx .pdp-rate-single-star{display:inline-grid;place-items:center;width:1.15em;height:1.15em;flex:none}',
    '.pdpx .pdp-rate-icon svg,.pdpx .pdp-rate-single-star svg{display:block;width:100%;height:100%}',
    '.pdpx .pdp-rate-st{display:inline-grid;place-items:center;width:1.15em;height:1.15em;border-radius:2px;flex:none}',
    '.pdpx .pdp-rate-st svg{display:block;width:72%;height:72%}',
    '.pdpx .pdp-rate > span:not(.pdp-rate-stars):not(.pdp-rate-st){display:inline-flex;align-items:center;line-height:1}',
    '.pdpx .pdp-price-wrap{display:flex;flex-direction:column;align-items:flex-start;gap:4px;width:100%}',
    '.pdpx .pdp-price{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.pdpx .pdp-price .now,.os-frame.os-store .pdpx .pdp-price .now{font-size:var(--pdp-price-size,14px);font-weight:var(--pdp-price-weight,300);line-height:1.6}',
    '.pdpx .pdp-price s{font-size:var(--pdp-price-size,14px);font-weight:400;line-height:1.6;color:#666;opacity:1;text-decoration-thickness:1px}',
    '.pdpx .pdp-price .save{display:inline-flex;align-items:center;gap:4px;box-sizing:border-box;min-height:24px;padding:2px 8px;border-radius:5px;background:#d63a2f;color:#fff;font-size:14.4px;font-weight:700;line-height:18px;border:0;box-shadow:none}',
    '.pdpx .pdp-price .save.outline{background:#f9fafb;border:0!important;outline:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);font-weight:700;letter-spacing:normal}',
    '.pdpx .pdp-price .save svg{width:12px;height:12px;flex:none}',
    '.pdpx .pdp-taxes{margin:0;font-size:12px;line-height:1.45;color:rgba(0,0,0,.55)}',
    '.pdpx .pdp-taxes a{color:inherit;text-decoration:underline;text-underline-offset:2px}',
    '.pdpx .pdp-taxes a:hover{opacity:.75}',
    /* Safe strip — Wildpeak-adjacent: muted divider label + bordered payment chips. */
    '.pdpx .pdp-safe{margin:0;width:100%;text-align:center}',
    /* Divider label always stays centered; Layout only moves the logo row */
    '.pdpx .pdp-safe-label{display:flex;align-items:center;gap:12px;justify-content:center;width:100%;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#999999;opacity:1}',
    '.pdpx .pdp-safe-label:before,.pdpx .pdp-safe-label:after{content:"";flex:1 1 0;min-width:16px;height:1px;background:#E5E5E5}',
    '.pdpx .pdp-safe-logos{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;margin-top:12px;width:100%}',
    '.pdpx .pdp-safe.align-left .pdp-safe-logos{justify-content:flex-start}',
    '.pdpx .pdp-safe.align-right .pdp-safe-logos{justify-content:flex-end}',
    '.pdpx .pdp-safe-logo{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:calc(var(--pdp-safe-h,24px) + 12px);min-width:calc(var(--pdp-safe-h,24px) * 1.7);padding:6px 8px;border:1px solid #E5E5E5;border-radius:4px;background:#fff;font-size:10px;font-weight:700;letter-spacing:.02em;color:#222}',
    '.pdpx .pdp-safe-logo.is-img{min-width:calc(var(--pdp-safe-h,24px) * 1.7);padding:6px 8px;border:1px solid #E5E5E5;background:#fff;border-radius:4px}',
    '.pdpx .pdp-safe-logo img{display:block;height:var(--pdp-safe-h,24px);width:auto;max-width:calc(var(--pdp-safe-h,24px) * 2.2);object-fit:contain}',
    '.pdpx .pdp-safe-logo.norton{color:#1a7a3c}.pdpx .pdp-safe-logo.mcafee{color:#c01818}.pdpx .pdp-safe-logo.mb{color:#b45309;min-width:calc(var(--pdp-safe-h,24px) * 2.4)}',
    '.pdpx .pdp-fr{position:relative;padding:4px 0 8px}',
    '.pdpx .pdp-fr-h{font-size:15px;font-weight:700;margin:0 0 10px}',
    '.pdpx .pdp-fr-rail{display:grid;gap:10px}',
    '.pdpx .pdp-fr-rail.is-carousel{display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x}',
    '.pdpx .pdp-fr-rail.is-carousel::-webkit-scrollbar{display:none;width:0;height:0}',
    '.pdpx .pdp-fr-rail.is-carousel .pdp-fr-card{flex:0 0 100%;width:100%;max-width:100%;scroll-snap-align:start;scroll-snap-stop:always}',
    '.pdpx .pdp-fr-rail.is-stack{grid-template-columns:1fr}',
    '.pdpx .pdp-fr-card{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid rgba(0,0,0,.08);border-radius:12px;background:#fafafa;min-width:0;color:inherit;cursor:pointer}',
    '.pdpx .pdp-fr-card:hover{border-color:rgba(0,0,0,.16)}',
    '.pdpx .pdp-fr-pop{position:absolute;inset:0;z-index:8;background:rgba(17,24,39,.5);display:none;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box}',
    '.pdpx .pdp-fr-pop.on{display:flex;animation:pdp-pop-scrim .22s ease}',
    '.pdpx .pdp-fr-pop-card{position:relative;width:min(560px,100%);height:420px;max-height:min(72vh,640px);background:#fff;color:#1a1a1a;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.22);display:flex;overflow:hidden;box-sizing:border-box}',
    '.pdpx .pdp-fr-pop.on .pdp-fr-pop-card{animation:pdp-pop-card-in .34s cubic-bezier(.2,.8,.2,1)}',
    '.pdpx .pdp-fr-pop-card.no-media{height:auto;min-height:200px;max-height:min(72vh,640px)}',
    '.pdpx .pdp-fr-pop-x-alt{display:none;position:absolute;top:12px;right:12px;z-index:2;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:#111;font-size:22px;line-height:1;cursor:pointer;align-items:center;justify-content:center}',
    '.pdpx .pdp-fr-pop-card.no-media .pdp-fr-pop-x-alt{display:inline-flex}',
    '.pdpx .pdp-fr-pop-x-alt:hover{background:rgba(0,0,0,.06)}',
    '.pdpx .pdp-fr-pop-media{position:relative;flex:0 0 50%;min-width:0;background:#111;color:#fff}',
    '.pdpx .pdp-fr-pop-stage{position:absolute;inset:0;background:#1a1a1a center/cover no-repeat}',
    '.pdpx .pdp-fr-pop-x{position:absolute;top:12px;left:12px;z-index:2;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-fr-pop-x:hover{background:rgba(0,0,0,.62)}',
    '.pdpx .pdp-fr-pop-nav{position:absolute;top:50%;z-index:2;transform:translateY(-50%);width:32px;height:32px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;font-size:18px;line-height:1;cursor:pointer;display:none;align-items:center;justify-content:center}',
    '.pdpx .pdp-fr-pop-nav.prev{left:10px}',
    '.pdpx .pdp-fr-pop-nav.next{right:10px}',
    '.pdpx .pdp-fr-pop-nav.on{display:inline-flex}',
    '.pdpx .pdp-fr-pop-nav:hover{background:rgba(0,0,0,.58)}',
    '.pdpx .pdp-fr-pop-thumbs{position:absolute;left:0;right:0;bottom:12px;z-index:2;display:none;justify-content:center;gap:8px;padding:0 12px;pointer-events:none}',
    '.pdpx .pdp-fr-pop-thumbs.on{display:flex}',
    '.pdpx .pdp-fr-pop-thumb{pointer-events:auto;width:44px;height:44px;padding:0;border:2px solid transparent;border-radius:6px;background:#333 center/cover no-repeat;cursor:pointer;opacity:.85}',
    '.pdpx .pdp-fr-pop-thumb.on{border-color:#fff;opacity:1}',
    '.pdpx .pdp-fr-pop-body{flex:1;min-width:0;padding:22px 22px 20px;display:flex;flex-direction:column;gap:10px;overflow:auto;box-sizing:border-box}',
    '.pdpx .pdp-fr-pop-card.no-media .pdp-fr-pop-body{padding:24px 28px}',
    '.pdpx .pdp-fr-pop-top{display:flex;align-items:center;gap:8px;min-width:0}',
    '.pdpx .pdp-fr-pop-name{font-size:16px;font-weight:700;line-height:1.2;min-width:0}',
    '.pdpx .pdp-fr-pop-verified{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:650;color:#16a34a;flex:none}',
    '.pdpx .pdp-fr-pop-verified i{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#16a34a;color:#fff}',
    '.pdpx .pdp-fr-pop-verified svg{display:block;width:10px;height:10px}',
    '.pdpx .pdp-fr-pop-info{margin-left:auto;width:18px;height:18px;padding:0;border:1px solid rgba(0,0,0,.28);border-radius:50%;background:transparent;color:#666;font-size:11px;font-weight:700;font-style:italic;line-height:1;cursor:default;display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.pdpx .pdp-fr-pop-stars{letter-spacing:2px;font-size:16px;line-height:1;color:#16a34a}',
    '.pdpx .pdp-fr-pop-text{margin:2px 0 0;font-size:14px;line-height:1.55;color:#222}',
    '.pdpx .pdp-fr-pop-meta{margin-top:auto;padding-top:12px}',
    '.pdpx .pdp-fr-pop-meta-label{display:block;font-size:12px;color:#888;margin-bottom:2px}',
    '.pdpx .pdp-fr-pop-meta-value{display:block;font-size:14px;font-weight:700;color:#111}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-fr-pop.on,.pdpx .pdp-fr-pop.on .pdp-fr-pop-card{animation:none}}',
    '.pdpx.mob .pdp-fr-pop-card{flex-direction:column;height:auto;max-height:min(84vh,640px)}',
    '.pdpx.mob .pdp-fr-pop-media{flex:none;height:220px}',
    '.pdpx.mob .pdp-fr-pop-body{flex:1}',
    '.pdpx .pdp-fr-av{width:44px;height:44px;border-radius:10px;object-fit:cover;flex:none;background:#e5e7eb}',
    '.pdpx .pdp-fr-av.round{border-radius:50%}',
    '.pdpx .pdp-fr-body{min-width:0;flex:1}',
    '.pdpx .pdp-fr-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}',
    '.pdpx .pdp-fr-stars{letter-spacing:1px;font-size:12px;line-height:1}',
    '.pdpx .pdp-fr-stars.boxed{letter-spacing:2px;font-size:11px}',
    '.pdpx .pdp-fr-text{font-size:13px;line-height:1.5;opacity:.88}',
    '.pdpx .pdp-fr-text.italic{font-style:italic;font-size:14px;line-height:1.55;opacity:1}',
    /* Fixed box + contain — keep aspect ratio inside the card slot (no stretch). */
    '.pdpx .pdp-fr-img{display:block;width:100%;height:140px;object-fit:contain;object-position:center;background:#f1f1f1;border-radius:8px;margin-top:8px}',
    '.pdpx .pdp-fr-side{flex:none;width:88px;height:88px;border-radius:10px;object-fit:cover;background:#e5e7eb}',
    '.pdpx .pdp-fr-check{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#3b82f6;color:#fff;flex:none}',
    '.pdpx .pdp-fr-check svg{display:block;width:10px;height:10px}',
    '.pdpx .pdp-fr-foot{display:flex;flex-direction:column;gap:2px;margin-top:10px}',
    '.pdpx .pdp-fr-author{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;font-weight:650}',
    '.pdpx .pdp-fr-verified{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#2563eb}',
    '.pdpx .pdp-fr-verified svg{display:block;width:14px;height:14px;flex:none}',
    '.pdpx .pdp-fr-sub{font-size:11px;opacity:.55;line-height:1.35}',
    /* Media: text card + small avatar under text | side review image */
    '.pdpx .pdp-fr-card.layout-media{align-items:center;gap:14px;background:#f7f7f8}',
    '.pdpx .pdp-fr-card.layout-media .pdp-fr-person{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}',
    '.pdpx .pdp-fr-card.layout-media .pdp-fr-av{width:32px;height:32px}',
    '.pdpx .pdp-fr-card.layout-media .pdp-fr-side{width:100px;height:100px;border-radius:12px}',
    /* Quote: large avatar + stacked stars / author check — no review image */
    '.pdpx .pdp-fr-card.layout-quote{align-items:flex-start;gap:14px;background:#fff}',
    '.pdpx .pdp-fr-card.layout-quote .pdp-fr-av{width:56px;height:56px}',
    '.pdpx .pdp-fr-card.layout-quote .pdp-fr-text{margin-bottom:6px}',
    /* Trust: avatar + shield verified + optional side image — no stars */
    '.pdpx .pdp-fr-card.layout-trust{align-items:center;gap:14px;background:#fff}',
    '.pdpx .pdp-fr-card.layout-trust .pdp-fr-av{width:56px;height:56px}',
    '.pdpx .pdp-fr-card.layout-trust .pdp-fr-text{font-size:15px;line-height:1.45}',
    '.pdpx .pdp-fr-card.layout-trust .pdp-fr-side{width:96px;height:96px;border-radius:12px}',
    /* Navigation: name-first + boxed stars; optional image under text */
    '.pdpx .pdp-fr-card.layout-nav{align-items:flex-start;gap:12px;background:#fafafa}',
    '.pdpx .pdp-fr-card.layout-nav .pdp-fr-av{width:48px;height:48px}',
    '.pdpx .pdp-fr-card.layout-nav .pdp-fr-img{margin-top:10px;height:160px;border-radius:10px}',
    /* Split: avatar | divider | quote row — no review image */
    '.pdpx .pdp-fr-card.layout-split{align-items:stretch;gap:0;padding:16px;background:#f3f4f6;border-color:transparent}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-av{width:72px;height:72px;align-self:center;margin-right:14px}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-av.is-empty{display:inline-block;background:#e5e7eb}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-body{padding-left:16px;border-left:1px solid rgba(0,0,0,.12);display:flex;flex-direction:column;justify-content:center;gap:10px}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-text{font-size:14px;line-height:1.5}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-stars{font-size:13px;letter-spacing:1px}',
    '.pdpx .pdp-fr-card.layout-split .pdp-fr-author{font-size:13px;font-weight:600}',
    '.pdpx .pdp-fr-av.is-empty{display:inline-block;background:#e5e7eb}',
    '.pdpx .pdp-fr-nav{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:#fff;cursor:pointer;z-index:2;display:inline-flex;align-items:center;justify-content:center;padding:0;font-size:16px;line-height:1;color:#222}',
    '.pdpx .pdp-fr-nav.prev{left:0}.pdpx .pdp-fr-nav.next{right:0}',
    '.pdpx .pdp-fr.has-arrows{padding-left:18px;padding-right:18px}',
    '.pdpx .pdp-fr-dots{display:flex;justify-content:center;gap:6px;margin-top:10px}',
    '.pdpx .pdp-fr-dot{width:7px;height:7px;border-radius:50%;border:0;padding:0;background:rgba(0,0,0,.2);cursor:pointer}',
    '.pdpx .pdp-fr-dot.on{background:#222}',
    '.pdpx .pdp-acc-ic{display:inline-flex;flex:none;line-height:0;width:16px;height:16px}',
    '.pdpx .pdp-acc-ic svg{display:block;width:16px;height:16px}',
    '.pdpx .pdp-line{border:0;border-top:1px solid rgba(0,0,0,.12);margin:2px 0}',
    '.pdpx .pdp-label{font-size:12px;font-weight:650;letter-spacing:.02em;margin-bottom:12px;opacity:.75;line-height:26px}',
    '.pdpx .pdp-options{display:flex;flex-direction:column}',
    '.pdpx .pdp-option+.pdp-option{margin-top:20px}',
    '.pdpx .pdp-option .pdp-label{display:flex;align-items:center;gap:4px;margin-bottom:12px;font-size:14px;font-weight:600;line-height:1.4;letter-spacing:0;opacity:1;color:#232323}',
    '.pdpx .pdp-option .pdp-label.pdp-size-head{justify-content:space-between;width:100%}',
    '.pdpx .pdp-size-guide-slot{margin-left:auto;flex:none}',
    '.pdpx .pdp-size-guide-slot .pdp-popup-link{color:#bf570a;font-size:14px;font-weight:300;padding:0;text-decoration:none}',
    '.pdpx .pdp-size-guide-slot .pdp-popup-link::after{display:none}',
    '.pdpx .pdp-opt-val{font-weight:400}',
    /* gap instead of negative margin so swatch/size left edge matches ATC / dyn buttons */
    '.pdpx .pdp-swatches{display:flex;flex-wrap:wrap;gap:10px;margin:0}',
    '.pdpx .pdp-sw{width:40px;height:40px;margin:0;border:0;border-radius:50%;padding:0;cursor:pointer;background-position:center;background-size:cover;background-repeat:no-repeat;box-shadow:0 0 0 1px rgba(34,34,34,.1);transition:box-shadow .25s ease,transform .25s ease}',
    '.pdpx .pdp-sw.pdp-sw-img{border-radius:8px}',
    '.pdpx .pdp-sw:hover{box-shadow:0 0 0 1px #222,0 8px 20px rgba(34,34,34,.2),inset 0 0 0 4px #fff;transform:scale(1.1)}',
    '.pdpx .pdp-sw.on{box-shadow:0 0 0 1px #222,inset 0 0 0 4px #fff}',
    '.pdpx .pdp-sw.shape-circle,.pdpx .pdp-size.shape-circle{border-radius:50%}',
    '.pdpx .pdp-sw.shape-square,.pdpx .pdp-size.shape-square{border-radius:0}',
    '.pdpx .pdp-sw.sold,.pdpx .pdp-size.sold{position:relative;opacity:.4}',
    '.pdpx .pdp-sw.sold:before,.pdpx .pdp-size.sold:before{content:"";position:absolute;inset:0;background:linear-gradient(to bottom right,transparent calc(50% - 1px),#eee 50%,transparent calc(50% + 1px));z-index:1}',
    '.pdpx .pdp-sw.sold:before{border-radius:50%}',
    '.pdpx .pdp-sizes{display:flex;flex-wrap:wrap;gap:10px;margin:0}',
    '.pdpx .pdp-size{min-width:45px;margin:0;padding:10px;border:1px solid #eee;border-radius:5px;background:transparent;cursor:pointer;font:400 16px/1.3 inherit;color:#222;text-transform:capitalize;transition:.25s;box-sizing:border-box}',
    '.pdpx .pdp-size:hover{border-color:#222}',
    '.pdpx .pdp-size.on{background:#222;border-color:#222;color:#fff}',
    /* Symmetry / Chantilly size pills — opt in via data-pdp-size-style=outline on .pdpx */
    '.pdpx[data-pdp-size-style="outline"] .pdp-size{min-width:63px;padding:11px 15px;border:1px solid #c8c8c8;border-radius:0;background:#fff;font:300 14px/1.3 inherit;color:#232323}',
    '.pdpx[data-pdp-size-style="outline"] .pdp-size:hover{border-color:#232323}',
    '.pdpx[data-pdp-size-style="outline"] .pdp-size.on{background:#fff;border-color:#232323;color:#232323}',
    '.pdpx .pdp-qty-wrap{display:flex;flex-direction:column;align-items:flex-start;gap:8px;width:100%}',
    '.pdpx .pdp-qty-label{font-size:14px;font-weight:600;line-height:1.4;color:inherit}',
    '.pdpx .pdp-buy-row.is-qty-only{justify-content:flex-start}',
    '.pdpx .pdp-buy-row.is-qty-only .pdp-qty{flex:none;width:116px;max-width:100%;height:46px;min-height:46px;border-radius:0;border-color:#c8c8c8}',
    '.pdpx .pdp-atc.full{font-size:14px;font-weight:300;letter-spacing:.08em;text-transform:uppercase}',
    '.pdpx[data-pdp-swatch-style="ring"] .pdp-sw.on{box-shadow:0 0 0 .5px #232323}',
    '.pdpx .pdp-dd{position:relative;width:100%}',
    '.pdpx .pdp-dd-btn{display:flex;align-items:center;width:100%;max-width:100%;min-height:48px;height:48px;margin:0;padding:0 40px 0 14px;border:1px solid rgba(0,0,0,.2);border-radius:8px;background:#fff url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1.5l5 5 5-5%27 fill=%27none%27 stroke=%27%23222%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E") no-repeat right 14px center;background-size:12px 8px;font:400 16px/1.3 inherit;color:#222;text-align:left;cursor:pointer;box-sizing:border-box}',
    '.pdpx .pdp-dd-btn:hover{border-color:#222}',
    '.pdpx .pdp-dd.open .pdp-dd-btn,.pdpx .pdp-dd-btn:focus{outline:none;border-color:#222;box-shadow:0 0 0 1px #222}',
    '.pdpx .pdp-dd-btn span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pdpx .pdp-dd-menu{display:none;position:fixed;z-index:80;max-height:240px;overflow:auto;margin:0;padding:6px 0;border:1px solid rgba(0,0,0,.16);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(0,0,0,.14);box-sizing:border-box}',
    '.pdpx .pdp-dd.open .pdp-dd-menu{display:block}',
    '.pdpx .pdp-dd-opt{display:block;width:100%;margin:0;padding:10px 14px;border:0;background:transparent;color:#222;font:400 15px/1.35 inherit;text-align:left;cursor:pointer;box-sizing:border-box}',
    '.pdpx .pdp-dd-opt:hover,.pdpx .pdp-dd-opt:focus{background:#f3f4f6;outline:none}',
    '.pdpx .pdp-dd-opt.on{font-weight:650}',
    '.pdpx .pdp-dd-opt[disabled]{opacity:.4;cursor:default}',
    '.pdpx .pdp-dd-opt.sold{color:#6b7280}',
    // Qty box stays left of the column; value is centered between - / +.
    '.pdpx .pdp-qty{display:inline-flex;align-items:center;justify-content:space-between;width:116px;min-height:var(--pdp-btn-h,48px);height:var(--pdp-btn-h,48px);border:1px solid #c8c8c8;border-radius:var(--pdp-atc-radius,8px);overflow:hidden;box-sizing:border-box;color:#232323}',
    '.pdpx .pdp-qty button{flex:none;width:36px;height:100%;border:0;background:transparent;cursor:pointer;padding:0;font-size:18px;line-height:1;color:inherit;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-qty span{flex:1;min-width:0;text-align:center;font-weight:400;font-size:14px;line-height:1;color:inherit}',
    // Match Silix .product__inventory: #10a443, DM Sans 16/400/26, 10px pulse dot
    '.pdpx .pdp-stock{--status-color:#10a443;--pdp-stock-fs:14px;display:flex;align-items:center;gap:0 8px;margin:0;font-family:inherit;font-size:var(--pdp-stock-fs);font-weight:400;line-height:1.625;letter-spacing:normal;color:#10a443;color:var(--status-color)}',
    '.pdpx .pdp-stock > span{font:inherit;font-size:inherit;font-weight:400;line-height:inherit;letter-spacing:normal;color:inherit}',
    '.pdpx .pdp-stock i{position:relative;width:10px;height:10px;margin:0 4px;border-radius:50%;background:var(--status-color);display:block;flex:none}',
    '.pdpx .pdp-stock i::before,.pdpx .pdp-stock i::after{position:absolute;left:0;top:0;width:100%;height:100%;content:"";background:var(--status-color);border-radius:50%;animation:pdp-inventory-pulse 2s linear infinite}',
    '.pdpx .pdp-stock i::after{animation-delay:1s}',
    '.pdpx .pdp-stock.sold{--status-color:#9ca3af}',
    '.pdpx .pdp-stock.sold i::before,.pdpx .pdp-stock.sold i::after{animation:none}',
    '.pdpx .pdp-stock.low{--status-color:#f59e0b}',
    '.pdpx .pdp-stock.low i::before,.pdpx .pdp-stock.low i::after{animation:none}',
    '.pdpx .pdp-stock.style-badge{display:inline-flex;padding:4px 10px;border-radius:999px;background:color-mix(in srgb, var(--status-color) 14%, #fff);}',
    '.pdpx .pdp-stock.style-text i{display:none}',
    '@keyframes pdp-inventory-pulse{0%{opacity:.6}100%{transform:scale(2.5);opacity:0}}',
    '.pdpx .pdp-sku{font-size:13px;opacity:.72}',
    /* One stack — qty/ATC/dyn/safe share column width; 12px matches Wildpeak buy-stack air */
    '.pdpx .pdp-actions{display:flex;flex-direction:column;gap:12px;width:100%;--pdp-atc-radius:8px;--pdp-dyn-radius:8px}',
    '.pdpx .pdp-buy-row{display:flex;align-items:stretch;gap:10px;width:100%}',
    // Direct qty sibling of ATC (with-quantity). Do not target .pdp-qty-wrap .pdp-qty — align-self:center would center it in the column wrap.
    '.pdpx .pdp-buy-row > .pdp-qty{flex:none;align-self:center;height:var(--pdp-btn-h,48px);min-height:var(--pdp-btn-h,48px)}',
    '.pdpx .pdp-qty-wrap .pdp-qty{align-self:flex-start}',
    '.pdpx .pdp-atc{flex:1;width:auto;min-height:var(--pdp-btn-h,48px);height:var(--pdp-btn-h,48px);position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:var(--pdp-atc-radius,8px);box-sizing:border-box;transition:transform .18s ease,opacity .18s ease}',
    '.pdpx .pdp-atc.full{display:inline-flex;align-items:center;justify-content:center;width:100%;flex:none}',
    '.pdpx .pdp-atc-ic{display:inline-flex;align-items:center;justify-content:center;flex:none;line-height:0}',
    '.pdpx .pdp-atc-ic svg{display:block;width:20px;height:20px}',
    '.pdpx .pdp-atc-label{line-height:1;font:inherit;font-size:inherit;font-weight:inherit}',
    '.pdpx .pdp-atc.is-adding{pointer-events:none;opacity:.88}',
    '.pdpx .pdp-atc.is-added{transform:scale(.98)}',
    '.pdpx .pdp-atc-spin{display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,.35);border-top-color:currentColor;border-radius:50%;animation:pdp-atc-spin .6s linear infinite;vertical-align:-3px}',
    '@keyframes pdp-atc-spin{to{transform:rotate(360deg)}}',
    '.pdpx .pdp-paypal,.pdpx .pdp-chan{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:var(--pdp-btn-h,48px);height:var(--pdp-btn-h,48px);border:0;border-radius:var(--pdp-dyn-radius,8px);cursor:pointer;padding:0 16px;font:inherit;font-weight:650;box-sizing:border-box}',
    '.pdpx .pdp-paypal{background:#ffc439}',
    '.pdpx .pdp-paypal:hover{background:#f2bb31}',
    '.pdpx .pdp-paypal svg,.pdpx .pdp-chan svg{display:block;height:22px;width:auto}',
    '.pdpx .pdp-chan.apple{background:#111;color:#fff}',
    '.pdpx .pdp-chan.google{background:#fff;color:#202124;border:1px solid #dadce0}',
    '.pdpx .pdp-buynow{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:var(--pdp-btn-h,48px);height:var(--pdp-btn-h,48px);border:0;border-radius:var(--pdp-dyn-radius,8px);background:#fff;color:inherit;cursor:pointer;padding:0 16px;box-sizing:border-box}',
    '.pdpx .pdp-dyn{display:flex;flex-direction:column;gap:12px;align-items:stretch;width:100%}',
    /* Wildpeak more-options: 12px / ls .5px / underline. pdp-dyn gap 12 + mt 4 ≈ 16 above; mb 10 below. Color inherits theme text. */
    '.pdpx .pdp-pay-more{align-self:center;margin:4px 0 10px;padding:0;border:0;background:none;color:inherit;font:inherit;font-size:12px;font-weight:400;line-height:1.5;letter-spacing:.5px;text-decoration:underline;text-underline-offset:2px;cursor:pointer}',
    '.pdpx .pdp-safe-logo.venmo{color:#008cff}.pdpx .pdp-safe-logo.bancontact{color:#005498}.pdpx .pdp-safe-logo.giropay{color:#000}',
    '.pdpx .pdp-icons{display:flex;flex-wrap:nowrap;align-items:flex-start;gap:var(--pdp-item-gap-y,8px) var(--pdp-item-gap-x,24px);width:100%;color:var(--pdp-icons-text,inherit)}',
    '.pdpx .pdp-icons.vertical{flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:var(--pdp-item-gap-y,8px)}',
    '.pdpx .pdp-icons.align-center{justify-content:center}.pdpx .pdp-icons.vertical.align-center{align-items:center}',
    '.pdpx .pdp-icons.align-right{justify-content:flex-end}.pdpx .pdp-icons.vertical.align-right{align-items:flex-end}',
    '.pdpx .pdp-icons.has-bg{padding:12px 14px;background:var(--pdp-icons-bg,#f6f6f6);border-radius:var(--pdp-icons-radius,10px)}',
    /* Horizontal: equal columns; long title/content wrap inside each cell. */
    '.pdpx .pdp-icons:not(.vertical)>.pdp-icon-item{flex:1 1 0;min-width:0;max-width:100%}',
    '.pdpx .pdp-icons.vertical>.pdp-icon-item{flex:none;max-width:100%}',
    /* Vertical left keeps full row; center/right shrink so container align-items can place the item. */
    '.pdpx .pdp-icons.vertical.align-left>.pdp-icon-item{width:100%}',
    '.pdpx .pdp-icons.vertical.align-center>.pdp-icon-item,.pdpx .pdp-icons.vertical.align-right>.pdp-icon-item{width:auto}',
    /* Icon-left: icon vertically centers against the whole text block (heading only, or heading+content). */
    '.pdpx .pdp-icon-item{display:flex;align-items:center;height:auto;gap:var(--pdp-icon-text-gap,8px);line-height:1.35;font-weight:400;color:inherit;text-decoration:none;min-width:0;box-sizing:border-box}',
    /* Alignment must also apply inside each cell — flex:1 equal columns make justify-content on the row a no-op for a single full-width item. */
    '.pdpx .pdp-icons.align-left .pdp-icon-item{justify-content:flex-start;text-align:left}',
    '.pdpx .pdp-icons.align-center .pdp-icon-item{justify-content:center;text-align:center}',
    '.pdpx .pdp-icons.align-right .pdp-icon-item{justify-content:flex-end;text-align:right}',
    '.pdpx .pdp-icon-item.top{flex-direction:column}',
    '.pdpx .pdp-icons.align-left .pdp-icon-item.top{align-items:flex-start}',
    '.pdpx .pdp-icons.align-center .pdp-icon-item.top{align-items:center}',
    '.pdpx .pdp-icons.align-right .pdp-icon-item.top{align-items:flex-end}',
    '.pdpx .pdp-icon-item.top .pdp-icon-mark,.pdpx .pdp-icon-item.top .pdp-icon-img{margin-bottom:2px}',
    '.pdpx .pdp-icon-item.card-outline{padding:10px 12px;border:1px solid rgba(0,0,0,.12);border-radius:8px}',
    '.pdpx .pdp-icon-item.card-filled{padding:10px 12px;background:#fff;border-radius:8px;box-shadow:0 1px 2px rgba(0,0,0,.06)}',
    '.pdpx .pdp-icon-mark{display:grid;place-items:center;width:var(--pdp-icon-size,20px);height:var(--pdp-icon-size,20px);flex:none;color:var(--pdp-icons-icon,currentColor)}',
    '.pdpx .pdp-icon-mark svg{display:block;width:100%;height:100%}',
    '.pdpx .pdp-icon-img{width:var(--pdp-icon-size,20px);height:var(--pdp-icon-size,20px);flex:none;object-fit:contain;max-width:100%}',
    '.pdpx .pdp-icon-img.logo{width:auto;max-width:min(100%,var(--pdp-logo-width,88px));height:var(--pdp-logo-height,28px)}',
    '.pdpx .pdp-icon-body{min-width:0;display:flex;flex-direction:column;gap:2px}',
    /* Left + icon-left: body fills leftover space. Center/right: shrink-wrap so the icon+text cluster can sit in the middle/end. */
    '.pdpx .pdp-icons.align-left .pdp-icon-item:not(.top) .pdp-icon-body{flex:1 1 auto;width:100%}',
    '.pdpx .pdp-icons.align-center .pdp-icon-item:not(.top) .pdp-icon-body,.pdpx .pdp-icons.align-right .pdp-icon-item:not(.top) .pdp-icon-body{flex:0 1 auto;width:auto;max-width:100%}',
    '.pdpx .pdp-icon-item.top .pdp-icon-body{flex:none;width:100%}',
    '.pdpx .pdp-icon-body .pdp-icon-h,.pdpx .pdp-icon-body .pdp-icon-c{max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal}',
    '.pdpx .pdp-icon-body .pdp-icon-h{font-family:var(--pdp-title-font,inherit);font-size:var(--pdp-title-size,1em);font-weight:var(--pdp-title-weight,400);letter-spacing:var(--pdp-title-tracking,normal);text-transform:var(--pdp-title-transform,none);line-height:1.6}',
    '.pdpx .pdp-icon-body .pdp-icon-c{font-family:var(--pdp-content-font,inherit);font-size:var(--pdp-content-size,1em);font-weight:var(--pdp-content-weight,300);letter-spacing:normal;text-transform:none;line-height:1.6;opacity:1}',
    '.pdpx .pdp-icon-body .pdp-icon-h p,.pdpx .pdp-icon-body .pdp-icon-c p{margin:0;overflow-wrap:anywhere;word-break:break-word}',
    '.pdpx .pdp-icon-body .pdp-icon-h strong{font-weight:700}',
    '.pdpx .pdp-icon-body .pdp-icon-c a{color:inherit}',
    // Icon-top trust row: tighter icon→title, subtitle sits flush under title (Symmetry).
    '.pdpx .pdp-icon-item.top .pdp-icon-body{gap:0}',
    '.pdpx .pdp-icon-item.top .pdp-icon-mark,.pdpx .pdp-icon-item.top .pdp-icon-img{margin-bottom:0}',
    '.pdpx .pdp-custom-text{font-size:14px;line-height:1.6}',
    '.pdpx .pdp-property{display:grid;gap:6px}.pdpx .pdp-property input{height:40px;padding:0 10px;border:1px solid rgba(0,0,0,.2);border-radius:7px;font:inherit}',
    '.pdpx .pdp-link-actions{display:flex;align-items:center;flex-wrap:wrap;gap:0 24px;min-height:48px}',
    '.pdpx .pdp-link-actions button{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:none;color:inherit;font:inherit;font-size:16px;font-weight:500;line-height:30px;text-decoration:none;cursor:pointer}',
    '.pdpx .pdp-link-actions button svg{display:block;width:20px;height:20px;flex:none}',
    '.pdpx .pdp-share-tile{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.pdpx .pdp-share-tile a,.pdpx .pdp-share-tile button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(0,0,0,.12);border-radius:8px;background:#fff;color:inherit;padding:0;cursor:pointer;text-decoration:none}',
    '.pdpx .pdp-share-tile.mono a,.pdpx .pdp-share-tile.mono button{color:#111}',
    '.pdpx .pdp-share-tile.brand a[data-net=facebook]{color:#1877f2}',
    '.pdpx .pdp-share-tile.brand a[data-net=x]{color:#111}',
    '.pdpx .pdp-share-tile.brand a[data-net=pinterest]{color:#e60023}',
    '.pdpx .pdp-share-inline{display:flex;flex-wrap:wrap;gap:16px;align-items:center}',
    '.pdpx .pdp-share-inline a,.pdpx .pdp-share-inline button{display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:inherit;font:inherit;font-size:14px;font-weight:550;cursor:pointer;text-decoration:none;padding:0}',
    '.pdpx .pdp-share-dd{position:relative;display:inline-flex}',
    '.pdpx .pdp-popup-link{position:relative;display:inline-block;padding:0 0 3px;border:0;background:none;color:inherit;font:inherit;font-size:13px;font-weight:650;line-height:1.3;text-decoration:none;cursor:pointer}',
    /* Underline is the ::after bar — idle full width; click replays left→right draw. */
    '.pdpx .pdp-popup-link::after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background:currentColor;transform:scaleX(1);transform-origin:left center;pointer-events:none}',
    '.pdpx .pdp-popup-link.is-anim::after{animation:pdp-popup-uline .34s ease}',
    '@keyframes pdp-popup-uline{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-popup-link.is-anim::after{animation:none;transform:scaleX(1)}}',
    '.pdpx .pdp-page-pop{position:absolute;inset:0;z-index:7;background:rgba(17,24,39,.45);display:none;align-items:center;justify-content:center;padding:24px 16px}',
    '.pdpx .pdp-page-pop.on{display:flex;animation:pdp-pop-scrim .22s ease}',
    '.pdpx .pdp-page-pop-card{position:relative;width:min(560px,100%);min-height:120px;max-height:min(72vh,640px);background:#fff;color:#1a1a1a;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box}',
    '.pdpx .pdp-page-pop.on .pdp-page-pop-card{animation:pdp-pop-card-in .34s cubic-bezier(.2,.8,.2,1)}',
    '.pdpx .pdp-page-pop-x{position:absolute;top:12px;right:12px;z-index:1;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:#111;font-size:22px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-page-pop-x:hover{background:rgba(0,0,0,.06)}',
    '.pdpx .pdp-page-pop-body{flex:1;min-height:0;overflow:auto;padding:28px 36px 28px 28px;font-size:14px;line-height:1.6}',
    '.pdpx .pdp-page-pop-body.is-empty{min-height:120px;padding:36px 28px}',
    '.pdpx .pdp-page-pop-body h3{margin:0 0 12px;font-size:20px;font-weight:700;line-height:1.3}',
    '.pdpx .pdp-page-pop-body p{margin:0 0 12px}',
    '.pdpx .pdp-page-pop-body p:last-child{margin-bottom:0}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-page-pop.on,.pdpx .pdp-page-pop.on .pdp-page-pop-card{animation:none}}',
    '.pdpx .pdp-ship{font-size:13px;line-height:1.55;color:#303030}',
    '.pdpx .pdp-ship>.pdp-ship-title{display:block;margin:0 0 10px;font-size:13px;font-weight:650;line-height:1.3}',
    '.pdpx .pdp-ship--timeline{width:calc(100% - 24px);max-width:100%;margin-left:auto;margin-right:auto;box-sizing:border-box;padding:16px;border-radius:10px;background:#fff}',
    '.pdpx .pdp-ship--timeline>.pdp-ship-title{margin-bottom:14px}',
    '.pdpx .pdp-ship-track{display:flex;align-items:flex-start;justify-content:space-between;width:100%;min-width:0}',
    '.pdpx .pdp-ship-step{position:relative;display:flex;min-width:20px;flex-direction:column}',
    '.pdpx .pdp-ship-step.is-start{align-items:flex-start}',
    '.pdpx .pdp-ship-step.is-mid{align-items:center}',
    '.pdpx .pdp-ship-step.is-end{align-items:flex-end}',
    '.pdpx .pdp-ship-step.is-start .pdp-ship-meta{align-items:flex-start}',
    '.pdpx .pdp-ship-step.is-mid .pdp-ship-meta{align-items:center}',
    '.pdpx .pdp-ship-step.is-end .pdp-ship-meta{align-items:flex-end}',
    '.pdpx .pdp-ship-icon{display:block;width:25px;height:25px;flex:none;color:#303030}',
    '.pdpx .pdp-ship-icon svg{display:block;width:25px;height:25px}',
    '.pdpx .pdp-ship-meta{display:flex;max-width:25px;flex-direction:column}',
    '.pdpx .pdp-ship-date{margin-top:5px;font-size:11px;font-weight:650;line-height:11px;color:#303030;white-space:nowrap}',
    '.pdpx .pdp-ship-label{margin-top:5px;font-size:12px;font-weight:400;line-height:12px;color:#303030;white-space:nowrap}',
    '.pdpx .pdp-ship-line{display:block;flex:1 1 auto;min-width:12px;margin-top:9.5px;height:6px}',
    '.pdpx .pdp-ship-line i{display:flex;align-items:center;height:6px;margin:0 10px}',
    '.pdpx .pdp-ship-line i:before,.pdpx .pdp-ship-line i:after{content:"";display:block;min-width:6px;min-height:6px;border-radius:50%;background:#303030;flex:none}',
    '.pdpx .pdp-ship-line i span{display:block;height:2.25px;max-height:2.25px;margin:0 -2px;width:100%;background:#303030}',
    '@media(max-width:600px){.pdpx .pdp-ship--timeline{padding:12px}.pdpx .pdp-ship-line i{margin:0 6px}.pdpx .pdp-ship-date{font-size:10px;line-height:10px}.pdpx .pdp-ship-label{font-size:11px;line-height:11px}}',
    /* Collapsible row — Symmetry disclosure: 16px heading icon, 11px CSS plus. */
    '.pdpx .pdp-acc{border-bottom:1px solid rgba(35,35,35,.15)}',
    '.pdpx .pdp-acc button{position:relative;width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;background:transparent;padding:15px 30px 15px 0;font:inherit;font-size:14px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer;color:inherit}',
    '.pdpx .pdp-acc.icon-left button{flex-direction:row-reverse;justify-content:flex-end;padding:15px 0 15px 30px}',
    '.pdpx .pdp-acc.icon-left button .pdp-acc-mark{order:-1;right:auto;left:0}',
    '.pdpx .pdp-acc-title{display:inline-flex;align-items:center;gap:12px;min-width:0}',
    '.pdpx .pdp-acc-mark{position:absolute;right:0;top:50%;display:block;flex:none;width:11px;height:11px;margin-top:-5.5px;line-height:0}',
    '.pdpx .pdp-acc-plus{position:relative;display:block;width:11px;height:11px}',
    '.pdpx .pdp-acc-plus .pdp-acc-h,.pdpx .pdp-acc-plus .pdp-acc-v{position:absolute;left:0;top:5px;width:11px;height:1px;background:currentColor}',
    '.pdpx .pdp-acc-plus .pdp-acc-v{transform-origin:center;transform:rotate(90deg);transition:transform .5s cubic-bezier(.3,1,.3,1)}',
    '.pdpx .pdp-acc.open .pdp-acc-plus .pdp-acc-v{transform:rotate(0deg)}',
    '.pdpx .pdp-acc .body{overflow:hidden;height:0;opacity:0;padding:0;font-size:14px;font-weight:300;line-height:1.6;transform:translateY(10px)}',
    '.pdpx .pdp-acc.open .body{height:auto;opacity:.85;padding:0 0 15px;transform:none}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-acc-plus .pdp-acc-v{transition:none}.pdpx .pdp-acc .body{transform:none}}',
    '.pdpx .pdp-rec-head{margin:0 0 10px}',
    '.pdpx .pdp-rec-h{font-size:14px;font-weight:600;margin:0}',
    '.pdpx .pdp-rec-sub{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin:0 0 4px}',
    '.pdpx .pdp-rec-copy{font-size:13px;line-height:1.5;opacity:.75;margin:6px 0 0}',
    '.pdpx .pdp-rec-copy p{margin:0 0 .4em}.pdpx .pdp-rec-copy p:last-child{margin:0}',
    // Horizontal slider: peek next card + side arrows (desktop); swipe on mobile. No scrollbar chrome.
    '.pdpx .pdp-rec-wrap{position:relative}',
    '.pdpx .pdp-rec-row{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0;cursor:grab}',
    '.pdpx .pdp-rec-row.is-dragging{cursor:grabbing;scroll-snap-type:none;scroll-behavior:auto}',
    '.pdpx .pdp-rec-row::-webkit-scrollbar{display:none;width:0;height:0}',
    '.pdpx .pdp-rec-card{flex:none;min-width:0;scroll-snap-align:start;text-align:left;font-size:12px;user-select:none}',
    '.pdpx .pdp-rec-card .im{aspect-ratio:3/4;background:#f1f2f4 center/cover no-repeat;border-radius:8px;margin-bottom:6px}',
    '.pdpx .pdp-rec-card b{display:block;font-weight:650;line-height:1.3}',
    '.pdpx .pdp-rec-nav{position:absolute;top:42%;z-index:2;transform:translateY(-50%);width:32px;height:32px;margin:0;padding:0;border:1px solid rgba(0,0,0,.12);border-radius:999px;background:#fff;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.08);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-rec-nav svg{display:block;width:14px;height:14px}',
    '.pdpx .pdp-rec-nav.prev{left:-6px}',
    '.pdpx .pdp-rec-nav.next{right:-6px}',
    '.pdpx .pdp-rec-nav:hover{border-color:#111;background:#111;color:#fff}',
    '.pdpx .pdp-rec-nav:disabled{opacity:.28;cursor:default;pointer-events:none;background:#fff;color:#222;border-color:rgba(0,0,0,.12)}',
    // Mobile: swipe + peek only — arrows clutter small buy columns.
    '.pdpx.mob .pdp-rec-nav{display:none}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-rec-row{scroll-behavior:auto}}',
    /* Video column — vertical UGC rail inside the buy column (same UX as Video feed section). */
    '.pdpx .pdp-vc{min-width:0}',
    '.pdpx .pdp-vc-head{margin:0 0 10px}',
    '.pdpx .pdp-vc-h{margin:0;font-size:15px;font-weight:650;line-height:1.25}',
    '.pdpx .pdp-vc-wrap{position:relative}',
    '.pdpx .pdp-vc-rail{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
    '.pdpx .pdp-vc-rail::-webkit-scrollbar{display:none;width:0;height:0}',
    '.pdpx .pdp-vc-card{flex:none;min-width:0;scroll-snap-align:start}',
    '.pdpx .pdp-vc-media{position:relative;display:block;width:100%;padding:0;border:0;overflow:hidden;background:#ddd;cursor:pointer;aspect-ratio:9/16;box-sizing:border-box}',
    '.pdpx .pdp-vc-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}',
    '.pdpx .pdp-vc-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;display:grid;place-items:center;pointer-events:none}',
    '.pdpx .pdp-vc-play svg{width:18px;height:18px;margin-left:2px}',
    '.pdpx .pdp-vc-nav{position:absolute;top:50%;z-index:2;transform:translateY(-50%);width:32px;height:32px;margin:0;padding:0;border:1px solid rgba(0,0,0,.12);border-radius:999px;background:#fff;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.08);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-vc-nav svg{display:block;width:14px;height:14px}',
    '.pdpx .pdp-vc-nav.prev{left:-6px}',
    '.pdpx .pdp-vc-nav.next{right:-6px}',
    '.pdpx .pdp-vc-nav:hover{border-color:#111;background:#111;color:#fff}',
    '.pdpx .pdp-vc-nav:disabled{opacity:.28;cursor:default;pointer-events:none;background:#fff;color:#222;border-color:rgba(0,0,0,.12)}',
    '.pdpx.mob .pdp-vc-nav{display:none}',
    '.pdpx .pdp-progress{height:3px;border-radius:99px;background:rgba(0,0,0,.08);margin-top:10px;overflow:hidden}',
    '.pdpx .pdp-progress i{display:block;height:100%;width:40%;background:currentColor;opacity:.7}',
    '.pdpx .pdp-sticky{--pdp-sticky-gap:12px;display:flex;align-items:center;gap:var(--pdp-sticky-gap);margin-top:18px;padding:10px 12px;border:1px solid rgba(0,0,0,.08);border-radius:12px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:40;box-sizing:border-box}',
    '.pdpx .pdp-sticky.bottom{position:sticky;bottom:8px}',
    '.pdpx .pdp-sticky.after-scroll{opacity:0;visibility:hidden;pointer-events:none;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease}',
    '.pdpx .pdp-sticky.after-scroll.on{opacity:1;visibility:visible;pointer-events:auto;transform:none}',
    '.pdpx .pdp-sticky.always{opacity:1;visibility:visible}',
    '.pdpx .pdp-sticky.bottom.on,.pdpx .pdp-sticky.bottom.always{position:fixed;bottom:8px;margin-top:0}',
    '.os-frame .pdp-sticky.bottom.on[data-block-id][data-blabel],.os-frame .pdp-sticky.bottom.always[data-block-id][data-blabel]{position:fixed}',
    '.pdpx.mob .pdp-sticky.hide-mob{display:none}',
    '.pdpx .pdp-sticky img{width:46px;height:46px;object-fit:cover;border-radius:8px}',
    '.pdpx .pdp-sticky .meta{flex:1;min-width:0}',
    '.pdpx .pdp-sticky .meta b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pdpx .pdp-sticky .sticky-qty{flex:none}',
    '.pdpx .pdp-sticky .pdp-atc{flex:0 0 var(--pdp-sticky-button-width,320px);width:var(--pdp-sticky-button-width,320px)}',
    '.pdpx.mob .pdp-sticky{padding:10px var(--pdp-sticky-gap);border:0;border-radius:0}',
    '.pdpx.mob .pdp-sticky>img,.pdpx.mob .pdp-sticky>.meta{display:none}',
    '.pdpx.mob .pdp-sticky .pdp-atc{flex:1;min-width:0;width:auto}',
    '.pdpx .pdp-sticky.is-full-width{border-radius:0}',
    '.pdpx .pdp-pop,.pdpx .pdp-zoom{position:absolute;inset:0;z-index:6;background:rgba(17,24,39,.45);display:none;align-items:flex-start;justify-content:center;padding:28px 16px}',
    '.pdpx .pdp-pop.on,.pdpx .pdp-zoom.on{display:flex}',
    '.pdpx .pdp-pop.on[data-pdp-pop]{animation:pdp-pop-scrim .22s ease}',
    '.pdpx .pdp-pop-card{width:min(420px,100%);background:#fff;color:#1a1a1a;border-radius:12px;padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.2)}',
    '.pdpx .pdp-pop.on[data-pdp-pop] .pdp-pop-card{animation:pdp-pop-card-in .34s cubic-bezier(.2,.8,.2,1)}',
    '@keyframes pdp-pop-scrim{from{opacity:0}to{opacity:1}}',
    '@keyframes pdp-pop-card-in{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-atc-spin{animation:none}.pdpx .pdp-pop.on[data-pdp-pop],.pdpx .pdp-pop.on[data-pdp-pop] .pdp-pop-card{animation:none}}',
    '.pdpx .pdp-pop-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:16px}',
    '.pdpx .pdp-pop-head strong{font-size:16px;font-weight:650}',
    '.pdpx .pdp-pop-x{width:28px;height:28px;padding:0;border:1px solid rgba(0,0,0,.18);border-radius:6px;background:#fff;color:#111;font-size:18px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-pop-item{display:flex;gap:12px;align-items:center}',
    '.pdpx .pdp-pop-item img{width:72px;height:90px;object-fit:cover;border-radius:8px;background:#f3f4f6}',
    '.pdpx .pdp-pop-item .nm{font-weight:700}',
    '.pdpx .pdp-pop-item .sub{font-size:12px;opacity:.65;margin-top:2px}',
    '.pdpx .pdp-pop-actions{display:flex;flex-direction:column;gap:8px;margin-top:14px}',
    '.pdpx .pdp-pop-recs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}',
    '.pdpx .pdp-zoom{position:fixed;z-index:100;align-items:center;background:#000;padding:0 0 64px;box-sizing:border-box}',
    '.pdpx .pdp-zoom img{max-width:100%;max-height:100%;object-fit:contain}',
    '.pdpx .pdp-zoom-controls{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px}',
    '.pdpx .pdp-zoom-controls button{width:36px;height:36px;border:0;border-radius:50%;background:#fff;color:#222;font-size:22px;cursor:pointer}',
    '.pdpx .pdp-zoom-controls button:disabled{opacity:.4;cursor:default}',
    '.pdpx .pdp-pop[data-pdp-share-pop]{background:rgba(0,0,0,.5);padding:16px;align-items:center;justify-content:center}',
    '.pdpx .pdp-pop[data-pdp-share-pop] .pdp-pop-card{position:relative;left:auto;top:auto;width:min(420px,100%);padding:20px 20px 18px;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.22)}',
    '.pdpx .pdp-share-x{-webkit-appearance:none;appearance:none;width:24px;height:24px;padding:0;margin:0;border:0;outline:0;box-shadow:none;border-radius:0;background:transparent;color:#111;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.pdpx .pdp-share-x svg{display:block;width:18px;height:18px;transition:transform .28s ease}',
    '.pdpx .pdp-share-x:hover svg,.pdpx .pdp-share-x:focus-visible svg{transform:rotate(90deg)}',
    '.pdpx .pdp-share-x:focus{outline:0}',
    '.pdpx .pdp-share-row{display:flex;align-items:stretch;width:100%;border:1px solid rgba(0,0,0,.16);border-radius:999px;overflow:hidden;background:#fff}',
    '.pdpx .pdp-share-row input{flex:1;min-width:0;height:44px;border:0;padding:0 16px;background:transparent;color:#111;font:inherit;font-size:14px;outline:none;text-overflow:ellipsis}',
    '.pdpx .pdp-share-row button{flex:none;height:44px;min-width:84px;border:0;border-left:1px solid rgba(0,0,0,.12);background:#111;color:#fff;padding:0 18px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .18s ease,color .18s ease}',
    '.pdpx .pdp-share-row button:hover,.pdpx .pdp-share-row button:focus-visible{background:#333}',
    '.pdpx .pdp-share-row button.is-copied{background:#111;min-width:92px}',
    '.pdpx .pdp-share-row button.is-copied:hover{background:#222}',
    '.pdpx .pdp-share-socials{display:flex;align-items:center;gap:18px;margin-top:18px}',
    '.pdpx .pdp-share-socials a{display:inline-flex;color:#111;line-height:0;transition:opacity .18s ease,transform .18s ease}',
    '.pdpx .pdp-share-socials a:hover,.pdpx .pdp-share-socials a:focus-visible{opacity:.55;transform:translateY(-1px)}',
    '.pdpx .pdp-share-socials svg{display:block;width:24px;height:24px}',
  ].join(''));

  const LAYOUTS = [
    { value: 'thumbs-bottom', label: 'Horizontal thumbnail carousel' },
    { value: 'thumbs-left', label: 'Vertical thumbnail carousel' },
    { value: 'grid-1', label: 'Grid (1x1)' },
    { value: 'grid-2', label: 'Grid (2x2)' },
    { value: 'collage-1', label: 'Collage - style 1' },
    { value: 'collage-2', label: 'Collage - style 2' },
  ];
  const POS = [
    { value: 'tr', label: 'Top right' }, { value: 'tl', label: 'Top left' },
    { value: 'br', label: 'Bottom right' }, { value: 'bl', label: 'Bottom left' },
  ];
  const SCHEMES = [
    { value: 'accent-1', label: 'Accent 1' }, { value: 'accent-2', label: 'Accent 2' },
    { value: 'text', label: 'Text' }, { value: 'inverse', label: 'Inverse' },
  ];
  const PAYS = [['visa', 'Visa'], ['mastercard', 'Mastercard'], ['amex', 'Amex'], ['paypal', 'PayPal'], ['apple', 'Apple Pay']];
  const PAY_ICON_BASE = 'settings/assets/payments/';
  const TRUST_LOGO_SRC = {
    visa: PAY_ICON_BASE + 'visa.svg',
    mastercard: PAY_ICON_BASE + 'mastercard.svg',
    amex: PAY_ICON_BASE + 'amex.svg',
    discover: PAY_ICON_BASE + 'discover.svg',
    diners: PAY_ICON_BASE + 'diners.svg',
    paypal: PAY_ICON_BASE + 'paypal-logo.svg',
    apple_pay: PAY_ICON_BASE + 'applepay.svg',
    google_pay: PAY_ICON_BASE + 'googlepay.svg',
    amazon: PAY_ICON_BASE + 'amazonpay.svg',
  };
  const TRUST_LOGO_META = {
    norton: { label: 'Norton', cls: 'norton' },
    mcafee: { label: 'McAfee', cls: 'mcafee' },
    money_back: { label: '100% Money Back', cls: 'mb' },
    visa: { label: 'Visa', cls: 'visa' },
    mastercard: { label: 'Mastercard', cls: 'mc' },
    amex: { label: 'Amex', cls: 'amex' },
    discover: { label: 'Discover', cls: 'discover' },
    diners: { label: 'Diners Club', cls: 'diners' },
    amazon: { label: 'Amazon', cls: 'amazon' },
    paypal: { label: 'PayPal', cls: 'paypal' },
    apple_pay: { label: 'Apple Pay', cls: 'apple' },
    google_pay: { label: 'Google Pay', cls: 'google' },
    venmo: { label: 'Venmo', cls: 'venmo' },
    bancontact: { label: 'Bancontact', cls: 'bancontact' },
    giropay: { label: 'Giropay', cls: 'giropay' },
  };
  const TRUST_LOGO_OPTIONS = [
    { value: 'norton', label: 'Norton' }, { value: 'mcafee', label: 'McAfee' }, { value: 'money_back', label: 'Money back' },
    { value: 'visa', label: 'Visa' }, { value: 'mastercard', label: 'Mastercard' }, { value: 'amex', label: 'Amex' },
    { value: 'discover', label: 'Discover' }, { value: 'diners', label: 'Diners Club' }, { value: 'amazon', label: 'Amazon' },
    { value: 'paypal', label: 'PayPal' }, { value: 'apple_pay', label: 'Apple Pay' },
    { value: 'google_pay', label: 'Google Pay' }, { value: 'venmo', label: 'Venmo' }, { value: 'bancontact', label: 'Bancontact' }, { value: 'giropay', label: 'Giropay' },
  ];
  function normalizeBuyChannels(list) {
    // Dynamic checkout channels. Shop removed; buy_now lives here under show_dynamic.
    const allowed = ['buy_now', 'paypal', 'apple_pay', 'google_pay'];
    const src = Array.isArray(list) ? list : [];
    const out = [];
    src.forEach((id) => {
      if (id === 'shop') return;
      if (allowed.indexOf(id) >= 0 && out.indexOf(id) < 0) out.push(id);
    });
    return out;
  }
  function resolveBuyChannels(b) {
    let raw = Array.isArray(b.channels) ? b.channels.slice() : null;
    if (raw == null) raw = ['buy_now', 'paypal'];
    // Legacy: standalone show_buy_now merges into channels once.
    if (b.show_buy_now && raw.indexOf('buy_now') < 0) raw = ['buy_now'].concat(raw);
    return normalizeBuyChannels(raw);
  }
  function buyButtonRadius(shape, custom, themeRadius) {
    // Legacy shared button_shape / custom_radius still accepted as fallback.
    // normal → Theme settings › Buttons › Corner radius.
    if (shape === 'pill') return 999;
    if (shape === 'square') return 0;
    if (shape === 'custom') return Number(custom == null ? 8 : custom);
    const tr = Number(themeRadius);
    return isFinite(tr) ? tr : 8;
  }
  function themeButtonHeight(t) {
    const h = Number(((t && t.buttons) || {}).button_height);
    return Math.max(32, Math.min(64, isFinite(h) ? h : 48));
  }
  function themeButtonRadius(t) {
    const r = Number(((t && t.buttons) || {}).button_border_radius);
    return isFinite(r) ? r : 8;
  }
  function atcIconHtml(name) {
    if (!name || name === 'none') return '';
    const svg = (window.OS_THEME_ICONS && window.OS_THEME_ICONS.svg(name, 20)) || '';
    return svg ? '<span class="pdp-atc-ic" aria-hidden="true">' + svg + '</span>' : '';
  }
  function atcButtonInner(icon, label) {
    return atcIconHtml(icon) + '<span class="pdp-atc-label">' + OS.esc(label) + '</span>';
  }
  function trustLogoHtml(id) {
    if (id === 'shop') return '';
    const meta = TRUST_LOGO_META[id] || { label: id, cls: 'card' };
    const src = TRUST_LOGO_SRC[id];
    if (src) {
      return '<span class="pdp-safe-logo is-img ' + meta.cls + '" title="' + OS.esc(meta.label) + '"><img src="' + OS.esc(src) + '" alt="' + OS.esc(meta.label) + '"></span>';
    }
    return '<span class="pdp-safe-logo ' + meta.cls + '">' + OS.esc(meta.label) + '</span>';
  }

  function scheme(value, t) {
    const c = (t && t.colors) || {};
    if (value === 'inverse') return '#ffffff';
    if (value === 'text') return c.text_color || '#1a1a1a';
    if (value === 'accent-2') return c.secondary_color || '#666666';
    return c.primary_color || '#103635';
  }
  function productOf(ctx) {
    if (ctx && ctx.resource && ctx.resource.title) return ctx.resource;
    return ((OS.sample && OS.sample.products) || [])[0] || { id: 'p1', title: 'Product', price: 0, image: '', swatches: ['#222'] };
  }
  function resolveProductMetafield(product, path) {
    if (!product || !path) return '';
    const key = String(path).replace(/^resource\./, '');
    if (key === 'description') return product.description || '';
    if (key === 'title' || key === 'name') return product.title || product.name || '';
    if (key === 'summary') return product.summary || '';
    if (key === 'vendor') return product.vendor || '';
    if (key === 'highlights') {
      const hl = product.highlights;
      if (Array.isArray(hl)) {
        const items = hl.map((x) => String(x || '').trim()).filter(Boolean);
        if (!items.length) return '';
        return '<ul>' + items.map((x) => '<li>' + OS.esc(x) + '</li>').join('') + '</ul>';
      }
      return hl ? String(hl) : '';
    }
    const mf = product.metafields || {};
    if (mf[path] != null && mf[path] !== '') return String(mf[path]);
    const parts = String(path).split('.');
    if (parts.length === 2) {
      const ns = parts[0];
      const mk = parts[1];
      const nested = mf[ns];
      if (nested && typeof nested === 'object') {
        if (nested[ns + ':' + mk] != null && nested[ns + ':' + mk] !== '') return String(nested[ns + ':' + mk]);
        if (nested[mk] != null && nested[mk] !== '') return String(nested[mk]);
      }
    }
    return '';
  }
  // Replace inline metafield variable chips with live product values for storefront preview.
  function resolveMetafieldChips(html, product) {
    if (!html || String(html).indexOf('data-mf-path') < 0) return html || '';
    const box = document.createElement('div');
    box.innerHTML = html;
    box.querySelectorAll('[data-mf-path]').forEach((chip) => {
      const path = chip.getAttribute('data-mf-path') || '';
      const val = resolveProductMetafield(product, path);
      if (/<[a-z][\s\S]*>/i.test(val)) {
        const holder = document.createElement('span');
        holder.innerHTML = val;
        chip.replaceWith.apply(chip, Array.prototype.slice.call(holder.childNodes));
      } else {
        chip.replaceWith(document.createTextNode(val || ''));
      }
    });
    return box.innerHTML;
  }
  // PRD 3.1 — sellable = tracked inventory and inventory > 0 (prototype: inventory field + available).
  function isSellableVariant(v) {
    if (!v) return false;
    if (v.available === false) return false;
    return Number(v.inventory || 0) > 0;
  }
  function readUrlVariantId() {
    try { return new URL(location.href).searchParams.get('variant') || ''; } catch (e) { return ''; }
  }
  // replaceState only; keep every non-variant query param (utm etc.) and the SPA hash.
  function replaceUrlVariant(variantId) {
    try {
      const url = new URL(location.href);
      if (variantId) url.searchParams.set('variant', String(variantId));
      else url.searchParams.delete('variant');
      const next = url.pathname + url.search + url.hash;
      const cur = location.pathname + location.search + location.hash;
      if (next !== cur) history.replaceState(history.state, '', next);
    } catch (e) { /* ignore */ }
  }
  // Resolve selected SKU from ?variant= per PRD access rules.
  // urlState: valid | invalid | absent
  function resolveSelectedVariant(p) {
    const variants = Array.isArray(p && p.variants) ? p.variants : [];
    if (!variants.length) return { variant: p, urlState: 'absent' };
    const urlId = readUrlVariantId();
    if (urlId) {
      const hit = variants.find((v) => String(v.id) === String(urlId));
      if (hit) return { variant: hit, urlState: 'valid' };
      return { variant: variants.find(isSellableVariant) || variants[0], urlState: 'invalid' };
    }
    return { variant: variants.find(isSellableVariant) || variants[0], urlState: 'absent' };
  }
  function storefrontProductUrl(handle, variantId) {
    const path = '/products/' + encodeURIComponent(handle || 'product');
    return variantId ? (path + '?variant=' + encodeURIComponent(variantId)) : path;
  }
  function others(current, n) {
    return ((OS.sample && OS.sample.products) || []).filter((p) => p.id !== current.id).slice(0, n);
  }
  function byIds(ids) {
    const all = (OS.sample && OS.sample.products) || [];
    return (ids || []).map((id) => all.find((p) => p.id === id)).filter(Boolean);
  }
  function byCollection(collectionId, n) {
    const cols = (OS.sample && OS.sample.collections) || [];
    const col = cols.find((c) => c.id === collectionId);
    if (!col) return [];
    const all = (OS.sample && OS.sample.products) || [];
    let base = byIds(Array.isArray(col.productIds) ? col.productIds : []);
    if (!base.length) base = all.slice();
    // Prototype: collections advertise large counts but only seed a few ids —
    // cycle the seed (then catalog) so the slider has enough cards to scroll.
    const want = Math.max(1, Math.min(
      n != null ? n : (Number(col.count) || base.length || 8),
      16
    ));
    if (base.length >= want) return base.slice(0, want);
    const pool = base.length ? base : all;
    if (!pool.length) return [];
    const out = [];
    for (let i = 0; i < want; i++) out.push(pool[i % pool.length]);
    return out;
  }
  function slides(p) {
    if (Array.isArray(p.media) && p.media.length) {
      return p.media.map((m) => {
        if (!m) return null;
        if (typeof m === 'string') return { type: 'image', src: m };
        if (m.type === 'video') {
          const poster = m.poster || m.src || '';
          const video = m.video || m.src || '';
          if (!video && !poster) return null;
          return { type: 'video', src: poster || video, poster: poster, video: video };
        }
        const src = m.src || m.image || '';
        return src ? { type: 'image', src: src } : null;
      }).filter(Boolean);
    }
    const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
    return images.filter(Boolean).map((src) => ({ type: 'image', src: src }));
  }
  function badge(s) {
    if (!s.show_trust_badge) return '';
    const size = { small: 64, medium: 84, large: 112 }[s.trust_badge_size] || 84;
    const pos = s.trust_badge_position || 'tr';
    if (s.trust_badge_image) {
      return '<span class="pdp-badge img ' + pos + '" style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + OS.esc(s.trust_badge_image) + ')"></span>';
    }
    return '<span class="pdp-badge ' + pos + '" style="width:' + size + 'px;height:' + size + 'px">Trusted<br>quality</span>';
  }
  function videoChrome(s, t) {
    // Gallery videos autoplay muted/loop like GIFs — no play overlay unless click-to-play.
    const play = scheme(s.play_button_scheme, t);
    const sound = scheme(s.sound_button_scheme, t);
    const auto = s.video_player !== 'click-to-play';
    let html = '';
    if (!auto) html += '<span class="pdp-play" style="background:' + play + '"><i>▶</i></span>';
    const chips = [];
    if (auto && s.video_pause) chips.push('<span class="pdp-chip">II</span>');
    if (s.video_sound) chips.push('<span class="pdp-chip" style="background:' + sound + ';color:' + (s.sound_button_scheme === 'inverse' ? '#111' : '#fff') + '">♪</span>');
    if (s.video_timeline) chips.push('<span class="pdp-time"><i style="background:' + play + '"></i></span>');
    if (chips.length) html += '<span class="pdp-video-ui">' + chips.join('') + '</span>';
    return html;
  }
  function navArrows() {
    const icon = (d) => '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' + d + '" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<button type="button" class="pdp-nav prev" data-pdp-nav="-1" aria-label="Previous image">' + icon('M10 3.5 5.5 8 10 12.5') + '</button>' +
      '<button type="button" class="pdp-nav next" data-pdp-nav="1" aria-label="Next image">' + icon('M6 3.5 10.5 8 6 12.5') + '</button>';
  }
  function stage(main, count) {
    if (count < 2) return main;
    return '<div class="pdp-stage">' + main + navArrows() + '</div>';
  }
  function cell(item, i, s, t, style) {
    const isVideo = item.type === 'video';
    const poster = item.poster || item.src || '';
    const videoSrc = item.video || '';
    const zoom = s.enable_zoom && !isVideo ? ' zoomable' : '';
    const media = isVideo
      ? '<video src="' + OS.esc(videoSrc) + '" poster="' + OS.esc(poster) + '" muted loop playsinline autoplay preload="metadata"></video>'
      : '<img alt="" src="' + OS.esc(item.src) + '" loading="' + (i ? 'lazy' : 'eager') + '" decoding="async">';
    return '<button type="button" class="pdp-cell' + (i === 0 ? ' on' : '') + (isVideo ? ' is-video is-playing' : '') + zoom + '" data-pdp-media="' + i + '" data-src="' + OS.esc(poster || item.src || '') + '" data-video="' + OS.esc(videoSrc) + '" style="' + style + '">' +
      media + (i === 0 ? badge(s) : '') + (isVideo ? videoChrome(s, t) : '') + '</button>';
  }

  const STAR_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" stroke="none" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
  const ICO_PKG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 7.7L12 12.5l8.7-4.8M12 22V12.5"/></svg>';
  const ICO_RET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>';
  const BLOCKS = {
    // unique follows PRD 「限一条」. Multi (否): rating, icon_text, collapsible, text, liquid, popup, divider.
    badges: { name: 'Badges and tags', icon: 'label', unique: true, preview:
      '<span class="pdp-tag" style="background:#103635">Best seller</span>' +
      '<span class="pdp-tag" style="background:#ffc439;color:#fff">Black Friday Sale</span>' +
      '<span class="pdp-tag sale outline" style="color:#d63a2f;background:#f9fafb;border:0;box-shadow:inset 0 0 0 1px rgba(214,58,47,.22);border-radius:5px;font-weight:700;height:24px;padding:2px 8px">Sale</span>',
      fields: [
      { sub: 'Valid custom tags' },
      { info: 'Use tag__hot_[DISPLAY_TEXT] or tag__new_[DISPLAY_TEXT]. Example: tag__hot_HOT, tag__new_NEW ARRIVAL' },
      { key: 'custom_tag_style', control: 'segmented', label: 'Tag style', default: 'filled', options: [
        { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' },
      ] },
      { key: 'hot_badge_bg', control: 'color', label: 'Hot tag background', default: '', allowTransparent: true, blankValue: () => OS.themeColor('primary_color', '#000000'), info: 'Blank inherits the theme primary color. Applies to tag__hot_*. T = transparent.' },
      { key: 'hot_badge_text_color', control: 'color', label: 'Hot tag text', default: '#ffffff', allowTransparent: true, blankValue: () => '#ffffff', visibleWhen: (v) => v.custom_tag_style !== 'outline' },
      { key: 'new_badge_bg', control: 'color', label: 'New tag background', default: '#FFC439', allowTransparent: true, blankValue: () => '#FFC439', info: 'Applies to tag__new_*. T = transparent.' },
      { key: 'new_badge_text_color', control: 'color', label: 'New tag text', default: '#ffffff', allowTransparent: true, blankValue: () => '#ffffff', visibleWhen: (v) => v.custom_tag_style !== 'outline' },
      { key: 'badge_icon', control: 'select', label: 'Badge icon', default: 'none', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'heart', label: 'Heart' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }]) },
      { key: 'badge_icon_image', control: 'image', label: 'Custom badge icon', default: '', info: 'Custom image replaces the built-in icon when set.' },
      { sub: 'Product badges' },
      { key: 'show_sold_out', control: 'toggle', label: 'Show sold out badge', default: false },
      ...savingFields({ show_saving: false, saving_position: 'right' }),
      { key: 'badge_position', control: 'segmented', label: 'Badge position', default: 'left', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ] },
      { key: 'badge_gap', control: 'range', label: 'Badge gap', min: 0, max: 24, step: 1, unit: 'px', default: 8 },
    ] },
    title: { name: 'Title', icon: 'heading', unique: true, preview: '<div class="os-blkprev-title">Knitted Santa Wine Bottle Cover</div>', fields: [
      { key: 'title_size', control: 'range', label: 'Title font size', min: 10, max: 50, step: 1, unit: 'px', default: 30 },
      // Title description is freeform or metafield-backed — never product.description.
      { key: 'description', control: 'richtext', label: 'Description', default: '', maxlength: 1000, placeholder: 'Add description...', autoHeight: true, dynamicSource: { mode: 'metafields', includeProductFields: true } },
      { key: 'description_color', control: 'color', label: 'Description color', default: '#000000', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000'), info: 'Blank inherits the theme text color. T = transparent.' },
      { key: 'description_size', control: 'range', label: 'Description font size', min: 10, max: 50, step: 1, unit: 'px', default: 14 },
      { key: 'description_top', control: 'range', label: 'Description top padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'description_bottom', control: 'range', label: 'Description bottom padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
    ] },
    price: { name: 'Price', icon: 'priceTag', unique: true, preview: '<div class="os-blkprev-price"><span>$24.00</span><s>$32.00</s><span class="save">-25%</span></div>', fields: [
      { key: 'size', control: 'range', label: 'Size', min: 10, max: 120, step: 1, unit: 'px', default: 24 },
      { key: 'show_taxes', control: 'toggle', label: 'Show tax status and shipping policy link', default: false },
      ...savingFields({ saving_position: 'right' }),
    ] },
    rating: { name: 'Rating', icon: 'starLine', preview:
      '<div class="os-blkprev-rate">' +
        '<span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span>' +
      '</div>',
      fields: [
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'default', options: [
        { value: 'default', label: 'Default' },
        { value: 'single-icon', label: 'Single icon' },
      ] },
      { key: 'star_style', control: 'select', label: 'Star style', default: 'boxed', options: [
        { value: 'regular', label: 'Regular' },
        { value: 'boxed', label: 'Boxed' },
      ], visibleWhen: (v) => (v.layout || 'default') === 'default' },
      { key: 'style', control: 'select', label: 'Content', default: 'stars-rating-custom', options: (v) => {
        const opts = [
          { value: 'stars-and-reviews', label: 'Stars + rating + reviews' },
          { value: 'stars-rating-custom', label: 'Stars + rating + custom text' },
          { value: 'stars-custom', label: 'Stars + custom text' },
        ];
        if ((v.layout || 'default') === 'default') {
          opts.unshift({ value: 'stars-and-count', label: 'Stars + review count' });
        }
        return opts;
      } },
      { key: 'custom_text', control: 'text', label: 'Custom text', default: 'Trusted by 2000+', placeholder: 'e.g. Trusted by 2000+', reinjectWhenVisible: true, visibleWhen: (v) => v.style === 'stars-rating-custom' || v.style === 'stars-custom' },
      { key: 'underline_text', control: 'toggle', label: 'Underline text', default: false, visibleWhen: (v) => v.style === 'stars-rating-custom' || v.style === 'stars-custom' },
      { key: 'review_label', control: 'text', label: 'Review label', default: 'reviews', reinjectWhenVisible: true, visibleWhen: (v) => v.style === 'stars-and-count' || v.style === 'stars-and-reviews' },
      { key: 'size', control: 'range', label: 'Size', min: 8, max: 48, step: 1, unit: 'px', default: 14 },
      { key: 'color', control: 'color', label: 'Star color', default: '#0f3636', allowTransparent: true, blankValue: () => '#0f3636', info: 'Defaults to brand teal. T = transparent.' },
      { key: 'text_color', control: 'color', label: 'Text color', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000'), info: 'Blank inherits the theme text color. T = transparent.' },
    ] },
    description: { name: 'Description', icon: 'text', unique: true, preview: '<div class="os-blkprev-copy">Soft knit bottle cover with festive trim. Perfect for holiday gifting.</div>', fields: [
      { key: 'text', control: 'richtext', label: 'Text', default: '', placeholder: 'Add product description...', dynamicSource: { label: 'Description', path: 'resource.description', defaultConnected: true } },
      { sub: 'Layout' },
      { key: 'width', control: 'segmented', label: 'Width', default: 'fit', options: [
        { value: 'fit', label: 'Fit' }, { value: 'fill', label: 'Fill' },
      ] },
      { key: 'alignment', control: 'segmented', label: 'Alignment', default: 'left', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
      ], visibleWhen: (v) => v.width === 'fill' },
      { sub: 'Appearance' },
      { key: 'background', control: 'toggle', label: 'Background', default: false },
      { key: 'background_color', control: 'color', label: 'Background color', default: '#FFFFFF', allowTransparent: true, blankValue: () => '#FFFFFF', visibleWhen: (v) => !!v.background },
      { key: 'corner_radius', control: 'range', label: 'Corner radius', min: 0, max: 40, step: 1, unit: 'px', default: 0, visibleWhen: (v) => !!v.background },
      { sub: 'Padding' },
      { key: 'padding_top', control: 'range', label: 'Top', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_bottom', control: 'range', label: 'Bottom', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_left', control: 'range', label: 'Left', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_right', control: 'range', label: 'Right', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
    ] },
    inventory: { name: 'Inventory', unique: true, preview: '<div class="os-blkprev-stock"><i></i><span>In stock · 24 left</span></div>', fields: [
      { key: 'show_status', control: 'toggle', label: 'Show inventory status', default: true },
      { key: 'show_count', control: 'toggle', label: 'Show inventory count', default: true },
      { key: 'custom_text', control: 'text', label: 'Custom text', default: '', placeholder: '' },
      { key: 'low_stock_threshold', control: 'number', label: 'Low stock threshold', default: 5, min: 0, max: 999 },
      { key: 'low_stock_text', control: 'text', label: 'Low stock text', default: 'Low stock - {n} items left', info: 'Use {n} for the remaining count.' },
      { key: 'sold_out_text', control: 'text', label: 'Sold out text', default: 'Sold out' },
      { key: 'status_style', control: 'segmented', label: 'Status style', default: 'dot', options: [
        { value: 'dot', label: 'Dot' }, { value: 'badge', label: 'Badge' }, { value: 'text-only', label: 'Text only' },
      ] },
      { key: 'in_stock_color', control: 'color', label: 'In stock color', default: '#10a443', allowTransparent: true, blankValue: () => '#10a443', info: 'Shown when inventory is above the low stock threshold. T = transparent.' },
      { key: 'status_color', control: 'color', label: 'Low stock color', default: '#f59e0b', allowTransparent: true, blankValue: () => '#f59e0b', info: 'Shown when inventory is at or below the low stock threshold. T = transparent.' },
      { key: 'font_size', control: 'range', label: 'Font size', min: 10, max: 50, step: 1, unit: 'px', default: 14 },
    ] },
    variant: { name: 'Variant picker', icon: 'variant', unique: true, preview:
      '<div class="os-blkprev-var">' +
        '<div class="os-blkprev-sw"><span style="background:#c4a484;box-shadow:0 0 0 1px #111,inset 0 0 0 3px #fff"></span><span style="background:#6b7280;box-shadow:0 0 0 1px rgba(0,0,0,.12)"></span><span style="background:#1f2937;box-shadow:0 0 0 1px rgba(0,0,0,.12)"></span></div>' +
        '<div class="os-blkprev-sz"><span class="on">S</span><span>M</span><span>L</span></div>' +
      '</div>',
      fields: [
      { key: 'hide_sold_out', control: 'toggle', label: 'Hide sold out variants', default: false },
      { key: 'picker_type', control: 'segmented', label: 'Selector style', default: 'buttons', options: [
        { value: 'dropdown', label: 'Dropdown' }, { value: 'buttons', label: 'Buttons' },
      ] },
      { key: 'swatch_style', control: 'select', label: 'Style', default: 'color', options: [
        { value: 'color', label: 'Color swatches' },
        { value: 'image', label: 'Variant image' },
        { value: 'text', label: 'Text' },
      ], visibleWhen: (v) => v.picker_type === 'buttons' },
      { key: 'shape', control: 'segmented', label: 'Shape', default: 'normal', options: [
        { value: 'normal', label: 'Normal' }, { value: 'circle', label: 'Circle' }, { value: 'square', label: 'Square' },
      ], visibleWhen: (v) => v.picker_type === 'buttons' && !v.nested_dropdown },
      { key: 'nested_dropdown', control: 'toggle', label: 'Nested dropdown', default: false, info: 'Show one dropdown with combined option values.' },
      { key: 'show_group_title', control: 'toggle', label: 'Show group title', default: true, info: 'Shows Color / Size labels with the selected option name, and updates the name when the shopper switches variants.' },
      { key: 'sku_display_name', control: 'text', label: 'SKU display name', default: '', placeholder: 'Empty = original SKU', visibleWhen: (v) => !!v.show_sku_in_option },
      { key: 'show_sku_in_option', control: 'toggle', label: 'Show SKU in option', default: false },
    ] },
    buy: { name: 'Buy buttons', icon: 'cart', unique: true, preview: '<div class="os-blkprev-btns"><div class="b b1">Add to cart</div><div class="b b2">Buy with PayPal</div></div>', fields: [
      { sub: 'Add to cart' },
      { key: 'show_quantity', control: 'toggle', label: 'Show quantity selector', default: true },
      { key: 'show_add', control: 'toggle', label: 'Show Add-to-cart button', default: true },
      { key: 'atc_layout', control: 'segmented', label: 'Add to cart style', default: 'with-quantity', options: [
        { value: 'with-quantity', label: 'With quantity' }, { value: 'full-width', label: 'Full width' },
      ], visibleWhen: (v) => !!v.show_add },
      { key: 'atc_icon', control: 'select', label: 'Add to cart icon', default: 'bag-plus', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'bag-plus', label: 'Bag plus' }, { value: 'gift', label: 'Gift' }, { value: 'heart', label: 'Heart' }, { value: 'star', label: 'Star' }]), visibleWhen: (v) => !!v.show_add, info: 'Default is shopping bag with plus. Pick None to hide, or any icon from the theme library.' },
      { key: 'atc_background', control: 'color', label: 'Add to cart background', default: '#FFC439', allowTransparent: true, blankValue: () => '#FFC439', info: 'Defaults to PayPal yellow. T = transparent.', visibleWhen: (v) => !!v.show_add },
      { key: 'atc_text_color', control: 'color', label: 'Add to cart text', default: '#FFFFFF', allowTransparent: true, blankValue: () => '#FFFFFF', info: 'Defaults to white. T = transparent.', visibleWhen: (v) => !!v.show_add },
      { key: 'atc_shape', control: 'segmented', label: 'Button shape', default: 'pill', options: [
        { value: 'normal', label: 'Normal' }, { value: 'pill', label: 'Pill' }, { value: 'square', label: 'Square' }, { value: 'custom', label: 'Custom' },
      ] },
      { key: 'atc_custom_radius', control: 'range', label: 'Custom radius', min: 0, max: 40, step: 1, unit: 'px', default: 8, visibleWhen: (v) => (v.atc_shape || v.button_shape) === 'custom' },
      { sub: 'Dynamic checkout' },
      { key: 'show_dynamic', control: 'toggle', label: 'Show dynamic checkout buttons', default: true },
      // Buy now + wallets under show_dynamic. Only selected channels render. Card brands → Trust logos.
      { key: 'channels', control: 'multiselect', label: 'Channels', default: ['buy_now', 'paypal'], options: [
        { value: 'buy_now', label: 'Buy now' }, { value: 'paypal', label: 'PayPal' }, { value: 'apple_pay', label: 'Apple Pay' }, { value: 'google_pay', label: 'Google Pay' },
      ], visibleWhen: (v) => !!v.show_dynamic },
      { key: 'buy_now_text', control: 'text', label: 'Buy now label', default: 'Buy now', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'buy_now_background', control: 'color', label: 'Buy now background', default: '#000000', allowTransparent: true, blankValue: () => '#000000', info: 'Defaults to black. T = transparent.', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'buy_now_text_color', control: 'color', label: 'Buy now text', default: '#FFFFFF', allowTransparent: true, blankValue: () => '#FFFFFF', info: 'Defaults to white. T = transparent.', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'dyn_shape', control: 'segmented', label: 'Button shape', default: 'pill', options: [
        { value: 'normal', label: 'Normal' }, { value: 'pill', label: 'Pill' }, { value: 'square', label: 'Square' }, { value: 'custom', label: 'Custom' },
      ], visibleWhen: (v) => !!v.show_dynamic },
      { key: 'dyn_custom_radius', control: 'range', label: 'Custom radius', min: 0, max: 40, step: 1, unit: 'px', default: 8, visibleWhen: (v) => !!v.show_dynamic && (v.dyn_shape || v.button_shape) === 'custom' },
      { key: 'show_payment_options', control: 'toggle', label: 'Show more payment options', default: true, visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.length > 0 },
      { key: 'channel_logo', control: 'toggle', label: 'Show channel logo', default: true, visibleWhen: (v) => !!v.show_dynamic },
      { key: 'show_safe_checkout', control: 'toggle', label: 'Show safe checkout strip', default: true, visibleWhen: (v) => !!v.show_dynamic },
      { key: 'safe_checkout_align', control: 'segmented', label: 'Layout', default: 'center', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
      ], visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
      { key: 'safe_checkout_label', control: 'text', label: 'Safe checkout label', default: 'GUARANTEED SAFE CHECKOUT', visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
      { key: 'trust_logos', control: 'multiselect', label: 'Trust logos', default: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay'], options: TRUST_LOGO_OPTIONS, visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
      { key: 'trust_logo_size', control: 'range', label: 'Logo size', min: 20, max: 56, step: 1, unit: 'px', default: 28, visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
    ] },
    icon_text: { name: 'Icon with text', preview:
      '<div class="os-blkprev-icons">' +
        '<div class="cell"><span class="ico">' + ICO_PKG + '</span><span>Orders over $50 ship free</span></div>' +
        '<div class="cell"><span class="ico">' + ICO_RET + '</span><span>30 day returns</span></div>' +
      '</div>',
      fields: [
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'horizontal', options: [
        { value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' },
      ], info: 'How the three items are arranged as a group.' },
      { key: 'item_layout', control: 'segmented', label: 'Item layout', default: 'icon-left', options: [
        { value: 'icon-left', label: 'Icon left' }, { value: 'icon-top', label: 'Icon top' },
      ] },
      { key: 'alignment', control: 'segmented', label: 'Alignment', default: 'left', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
      ] },
      { key: 'font', control: 'select', label: 'Title font family', default: 'body', options: [
        { value: 'body', label: 'Body font' }, { value: 'heading', label: 'Heading font' },
      ] },
      { key: 'size', control: 'range', label: 'Title size', min: 10, max: 48, step: 1, unit: 'px', default: 16, info: 'Defaults to the theme body base size (Typography → Base size).' },
      { key: 'icon_size', control: 'range', label: 'Icon size', min: 16, max: 96, step: 1, unit: 'px', default: 20 },
      { key: 'item_gap', control: 'range', label: 'Item gap', min: 4, max: 48, step: 1, unit: 'px', default: 24 },
      { key: 'icon_text_gap', control: 'range', label: 'Icon / text gap', min: 0, max: 32, step: 1, unit: 'px', default: 8 },
      { key: 'background', control: 'toggle', label: 'Show background', default: false },
      { key: 'background_color', control: 'color', label: 'Background color', default: '#f6f6f6', allowTransparent: true, blankValue: () => '#f6f6f6', visibleWhen: (v) => !!v.background },
      { key: 'corner_radius', control: 'range', label: 'Corner radius', min: 0, max: 40, step: 1, unit: 'px', default: 10, visibleWhen: (v) => !!v.background },
      { key: 'text_color', control: 'color', label: 'Text color', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000'), info: 'Blank inherits the theme text color. T = transparent.' },
      { key: 'icon_color', control: 'color', label: 'Icon color', default: '', allowTransparent: true, blankValue: () => OS.themeColor('primary_color', '#000000'), info: 'Blank inherits the theme primary color. T = transparent.' },
      { key: 'card_style', control: 'segmented', label: 'Card style', default: 'none', options: [
        { value: 'none', label: 'None' }, { value: 'outline', label: 'Outline' }, { value: 'filled', label: 'Filled' },
      ] },
      { sub: 'Content' },
      { tip: 'Choose an icon or add an image for each column or row.' },
      { key: 'icon_1', control: 'select', label: 'First icon', default: 'box', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'heart', label: 'Heart' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }]) },
      { key: 'image_1', control: 'image', label: 'First image / logo', default: '', info: 'Custom image replaces the built-in icon. Use for trust logos such as BBC / Forbes.' },
      { key: 'first_heading', control: 'richtext', label: 'First heading', default: 'Orders over $50 ship free', autoHeight: true, info: 'Leave the heading label blank to hide the icon column.' },
      { key: 'first_content', control: 'richtext', label: 'First content', default: '', autoHeight: true, placeholder: 'Add description...' },
      { key: 'icon_2', control: 'select', label: 'Second icon', default: 'return', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'heart', label: 'Heart' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }]) },
      { key: 'image_2', control: 'image', label: 'Second image / logo', default: '' },
      { key: 'second_heading', control: 'richtext', label: 'Second heading', default: '30 day returns', autoHeight: true, info: 'Leave the heading label blank to hide the icon column.' },
      { key: 'second_content', control: 'richtext', label: 'Second content', default: '', autoHeight: true, placeholder: 'Add description...' },
      { key: 'icon_3', control: 'select', label: 'Third icon', default: 'star', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'heart', label: 'Heart' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }]) },
      { key: 'image_3', control: 'image', label: 'Third image / logo', default: '' },
      { key: 'third_heading', control: 'richtext', label: 'Third heading', default: '', autoHeight: true, info: 'Leave the heading label blank to hide the icon column.' },
      { key: 'third_content', control: 'richtext', label: 'Third content', default: '', autoHeight: true, placeholder: 'Add description...' },
    ] },
    sku: { name: 'SKU', unique: true, preview: '<div class="os-blkprev-sku">SKU: AURA-KNIT-01</div>', fields: [
      { key: 'text_style', control: 'select', label: 'Text style', default: 'body', options: [
        { value: 'body', label: 'Body' }, { value: 'subtitle', label: 'Subtitle' }, { value: 'uppercase', label: 'Uppercase' },
      ] },
    ] },
    text: { name: 'Text', icon: 'text', preview: '<div class="os-blkprev-copy">Add supporting product information.</div>', fields: [
      { key: 'text', control: 'richtext', label: 'Text', default: 'Add supporting product information.', dynamicSource: { label: 'Text', path: 'resource.text' } },
      { key: 'text_style', control: 'select', label: 'Text style', default: 'body', options: [
        { value: 'body', label: 'Body' }, { value: 'subtitle', label: 'Subtitle' }, { value: 'uppercase', label: 'Uppercase' },
      ] },
    ] },
    // Custom Liquid has empty default code — preview stays blank.
    liquid: { name: 'Custom Liquid', icon: 'code', fields: [
      { key: 'code', control: 'textarea', label: 'Liquid code', default: '', placeholder: '{{ product.title }}' },
    ] },
    collapsible: { name: 'Collapsible row', preview: '<div class="os-blkprev-row"><span>Overview</span><span>+</span></div>', fields: [
      { key: 'heading', control: 'text', label: 'Heading', default: 'Overview' },
      { key: 'icon', control: 'select', label: 'Icon', default: 'none', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'heart', label: 'Heart' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }]) },
      { key: 'content', control: 'richtext', label: 'Row content', default: 'Add product details such as fit, materials, care, or shipping notes.', autoHeight: true, dynamicSource: { mode: 'metafields', includeProductFields: true } },
      { key: 'custom_liquid', control: 'textarea', label: 'Custom liquid', default: '' },
      { key: 'open', control: 'toggle', label: 'Open by default', default: false },
      { key: 'accordion_mode', control: 'toggle', label: 'Accordion mode', default: false, info: 'When on, only one row stays open at a time.' },
      { key: 'icon_position', control: 'segmented', label: 'Icon position', default: 'right', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ] },
      { info: 'Mobile order reuses the desktop block order.' },
    ] },
    popup: { name: 'Pop-up', preview: '<button type="button" style="padding:0;border:0;background:none;color:#111;font:inherit;font-size:13px;font-weight:650;line-height:1.3;text-decoration:underline;text-underline-offset:3px;cursor:default">Pop-up link text</button>', fields: [
      { key: 'label', control: 'text', label: 'Link label', default: 'Pop-up link text' },
      { key: 'page', control: 'page', label: 'Page', default: '' },
      { key: 'popup_width', control: 'range', label: 'Popup width', min: 280, max: 900, step: 10, unit: 'px', default: 560 },
      { key: 'popup_height', control: 'range', label: 'Popup height', min: 200, max: 800, step: 10, unit: 'px', default: 420 },
    ] },
    shipping: { name: 'Shipping', icon: 'doc', unique: true, preview: '<div class="os-blkprev-ship"><strong style="display:block;margin-bottom:4px;color:#111">Estimated delivery:</strong>Arrives by Oct 30</div>', fields: [
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'timeline', options: [
        { value: 'text', label: 'Text' }, { value: 'timeline', label: 'Timeline' },
      ] },
      { key: 'delivery_text', control: 'text', label: 'Delivery text', default: 'Estimated delivery:', placeholder: 'Leave empty to hide title' },
      { key: 'days', control: 'number', label: 'Deliver in', min: 1, max: 60, default: 7 },
      { key: 'date_format', control: 'text', label: 'Date format', default: '%b %d' },
      { key: 'timezone', control: 'select', label: 'Timezone', default: 'store', options: [
        { value: 'store', label: 'Store' }, { value: 'utc', label: 'UTC' },
      ] },
      { key: 'fallback_text', control: 'text', label: 'Fallback text', default: '', placeholder: 'Shown when delivery date is unavailable' },
      { info: 'Holiday skipping is out of scope for this pass.' },
    ] },
    // Not in PRD Product information catalog — keep render support, hide from Add block.
    line_property: { name: 'Line item property', picker: false, preview:
      '<div class="os-blkprev-field"><div class="lb">Your label</div><div class="inp">Your placeholder</div></div>',
      fields: [
      { key: 'type', control: 'select', label: 'Type', default: 'text', options: [{ value: 'text', label: 'Text' }, { value: 'number', label: 'Number' }] },
      { key: 'label', control: 'text', label: 'Label', default: 'Your label' },
      { key: 'placeholder', control: 'text', label: 'Placeholder', default: 'Your placeholder' },
      { key: 'required', control: 'toggle', label: 'Required', default: false },
    ] },
    actions: { name: 'Sharing buttons', unique: true, preview: '<div class="os-blkprev-share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>Share</div>', fields: [
      { key: 'show_share', control: 'toggle', label: 'Show social sharing', default: true },
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'tile', options: [
        { value: 'tile', label: 'Tile' }, { value: 'inline', label: 'Inline' }, { value: 'dropdown', label: 'Dropdown' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'icon_style', control: 'segmented', label: 'Icon style', default: 'brand', options: [
        { value: 'brand', label: 'Brand' }, { value: 'mono', label: 'Mono' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'platforms', control: 'multiselect', label: 'Platforms', default: ['facebook', 'x', 'pinterest'], options: [
        { value: 'facebook', label: 'Facebook' }, { value: 'x', label: 'X' }, { value: 'pinterest', label: 'Pinterest' },
        { value: 'instagram', label: 'Instagram' }, { value: 'whatsapp', label: 'WhatsApp' }, { value: 'telegram', label: 'Telegram' }, { value: 'email', label: 'Email' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'show_copy', control: 'toggle', label: 'Show copy link', default: true, visibleWhen: (v) => v.show_share !== false },
    ] },
    // Products default to [] — empty uses collection source or automatic fallback.
    recommendations: { name: 'Inline recommendations', unique: true, fields: [
      { key: 'subheading', control: 'text', label: 'Subheading', default: '', dynamicSource: { label: 'Subheading' } },
      { key: 'heading', control: 'text', label: 'Heading', default: 'You Might Also Like', dynamicSource: { label: 'Heading' } },
      { key: 'content', control: 'richtext', label: 'Content', default: '', dynamicSource: { label: 'Content' } },
      { key: 'products', control: 'ordered_products', label: 'Select products', default: [], max: 8,
        info: 'If left empty, automatic recommendations will be shown.',
        dynamicSource: { mode: 'collections', label: 'Products' } },
      { key: 'per_row', control: 'range', label: 'Row Count/Desktop', min: 2, max: 6, step: 1, default: 2 },
      { key: 'mobile_count', control: 'range', label: 'Row Count/Mobile', min: 1, max: 2, step: 1, default: 2 },
      { key: 'image_ratio', control: 'select', label: 'Image aspect ratio', default: 'adapt', options: [
        { value: 'adapt', label: 'Adapt to image' }, { value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' },
      ] },
      { key: 'empty_behavior', control: 'select', label: 'Empty behavior', default: 'hide', options: [
        { value: 'hide', label: 'Hide block' },
      ] },
      { key: 'exclude_soldout', control: 'toggle', label: 'Exclude sold out', default: false },
      { key: 'dedupe_current', control: 'toggle', label: 'Hide current product', default: true },
    ] },
    featured_reviews: { name: 'Featured reviews', preview: () => {
      const IMG = (OS.sample && OS.sample.IMG) || {};
      const av = IMG.av1 || '';
      const img = IMG.p1blk || IMG.p1 || '';
      const avHtml = av
        ? '<img class="os-blkprev-fr-av" alt="" src="' + OS.esc(av) + '">'
        : '<span class="os-blkprev-fr-av is-empty" aria-hidden="true"></span>';
      const sideHtml = img
        ? '<img class="os-blkprev-fr-side" alt="" src="' + OS.esc(img) + '">'
        : '';
      const shield = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5z"/><path fill="#fff" d="m10.2 12.8-2-2-1.1 1.1 3.1 3.1 5.2-5.2-1.1-1.1z"/></svg>';
      // Matches Trust card: square avatar | italic quote + shield verified | side review image.
      return '<div class="os-blkprev-fr">' +
        '<div class="os-blkprev-fr-h">What Our Customers Are Saying</div>' +
        '<div class="os-blkprev-fr-card">' +
          avHtml +
          '<div class="os-blkprev-fr-body">' +
            '<div class="os-blkprev-fr-text">Very comfortable and great fit. Want to buy more. Wore them on a ten hour hike. Held up great.</div>' +
            '<div class="os-blkprev-fr-author">— Debi T.<span class="os-blkprev-fr-verified">' + shield + 'Verified Customer</span></div>' +
            '<div class="os-blkprev-fr-sub">Real customer · Verified order · Real buyer</div>' +
          '</div>' +
          sideHtml +
        '</div>' +
      '</div>';
    },
      defaults: () => ({
        heading: 'What Our Customers Are Saying',
        data_source: 'manual',
        auto_count: 3,
        reviews: [OS.defaultFeaturedReviewItem()],
        layout: 'nav',
        show_image: true,
        show_avatar: true,
        round_avatar: false,
        star_color: '#16a34a',
        show_verified: true,
        verified_text: 'Verified Customer',
        verified_subtext: 'Real customer · Verified order · Real buyer',
        scroll: true,
        nav_style: 'auto',
        auto_play: false,
        cards_per_row: 1,
      }),
      fields: [
      { sub: 'Style' },
      { key: 'layout', control: 'select', label: 'Layout', default: 'nav', options: [
        { value: 'media', label: 'Media (side image + dots)' },
        { value: 'quote', label: 'Quote (check + dots)' },
        { value: 'nav', label: 'Navigation (arrows + image)' },
        { value: 'trust', label: 'Trust (shield + side image)' },
        { value: 'split', label: 'Split (avatar + divider)' },
      ], info: 'Media / Navigation / Trust can show a review image. Quote and Split do not.' },
      { key: 'show_image', control: 'toggle', label: 'Show review image', default: true, info: 'Media: image on the right. Navigation: image under the text. Trust: image on the right.', visibleWhen: (v) => v.layout === 'media' || v.layout === 'nav' || v.layout === 'trust' || !v.layout },
      { key: 'show_avatar', control: 'toggle', label: 'Show avatar', default: true },
      { key: 'round_avatar', control: 'toggle', label: 'Round avatar', default: true, info: 'Navigation layout often uses a rounded square; turn off for that look.' },
      { key: 'star_color', control: 'color', label: 'Star color', default: '#16a34a', allowTransparent: true, blankValue: () => '#16a34a', info: 'Used by Media, Quote, Navigation, and Split. Trust has no stars. T = transparent.' },
      { key: 'show_verified', control: 'toggle', label: 'Show verified badge', default: true, info: 'Quote / Split use a checkmark. Trust uses shield + subtitle. Media and Navigation have no badge.', visibleWhen: (v) => v.layout === 'quote' || v.layout === 'trust' || v.layout === 'split' },
      { key: 'verified_text', control: 'text', label: 'Verified text', default: 'Verified Customer', visibleWhen: (v) => (v.layout === 'quote' || v.layout === 'trust' || v.layout === 'split') && v.show_verified !== false },
      { key: 'verified_subtext', control: 'text', label: 'Verified subtitle', default: 'Real customer · Verified order · Real buyer', visibleWhen: (v) => v.layout === 'trust' && v.show_verified !== false },
      { key: 'scroll', control: 'toggle', label: 'Scroll / carousel', default: true },
      { key: 'nav_style', control: 'segmented', label: 'Navigation', default: 'auto', options: [
        { value: 'auto', label: 'Auto' }, { value: 'arrows', label: 'Arrows' }, { value: 'dots', label: 'Dots' }, { value: 'none', label: 'None' },
      ], visibleWhen: (v) => !!v.scroll },
      { key: 'auto_play', control: 'toggle', label: 'Auto play', default: false, visibleWhen: (v) => !!v.scroll },
      { key: 'cards_per_row', control: 'range', label: 'Cards per row', min: 1, max: 3, step: 1, default: 1, visibleWhen: (v) => !v.scroll },
      { sub: 'Content' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'What Our Customers Are Saying' },
      { key: 'data_source', control: 'select', label: 'Data source', default: 'manual', options: [
        { value: 'manual', label: 'Manual (add one by one)' },
        { value: 'auto', label: 'Auto (pull product reviews)' },
      ], info: 'Manual: add entries and either pick an existing review or edit by hand. Auto: pull the latest product reviews.' },
      { key: 'auto_count', control: 'range', label: 'Reviews to show', min: 1, max: 8, step: 1, default: 3, visibleWhen: (v) => v.data_source === 'auto' },
      { key: 'reviews', control: 'review_items', label: 'Reviews', default: [], max: 10, visibleWhen: (v) => v.data_source !== 'auto', info: 'Each row can select an existing review or use manual edit. Default is one manual entry.' },
    ] },
    sticky: { name: 'Sticky cart', unique: true, preview: '<div class="os-blkprev-btns"><div class="b b1">Add to cart</div></div>', fields: [
      { key: 'show_image', control: 'toggle', label: 'Show image', default: true },
      { key: 'show_title', control: 'toggle', label: 'Show title', default: true },
      { key: 'show_price', control: 'toggle', label: 'Show price', default: true },
      { key: 'show_quantity', control: 'toggle', label: 'Show quantity', default: true },
      { key: 'appear_at', control: 'segmented', label: 'Appear at', default: 'scroll', options: [
        { value: 'top', label: 'Top' }, { value: 'scroll', label: 'After scroll' },
      ] },
      { key: 'mobile_visible', control: 'toggle', label: 'Show on mobile', default: true },
      { key: 'width_mode', control: 'segmented', label: 'Bar width', default: 'container', options: [
        { value: 'container', label: 'Follow container' }, { value: 'full', label: 'Full width' },
      ], info: 'Follow container keeps the sticky bar aligned with the preview container. Full width spans the page viewport.' },
      { key: 'desktop_button_width', control: 'range', label: 'Button width · desktop', min: 240, max: 560, step: 10, unit: 'px', default: 320, info: 'Mobile uses the automatic width formula.' },
      { key: 'button_text', control: 'text', label: 'Button text', default: 'Add to cart' },
    ] },
    divider: { name: 'Separator', preview: '<div class="os-blkprev-line"></div>', fields: [
      { key: 'color', control: 'color', label: 'Color', default: '#E5E5E5', allowTransparent: true, blankValue: () => OS.themeColor('border_color', '#E5E5E5'), info: 'Blank inherits Theme › Colors › Border. T = transparent.' },
      { key: 'thickness', control: 'range', label: 'Thickness', min: 1, max: 6, step: 1, unit: 'px', default: 1 },
      { key: 'padding_top', control: 'range', label: 'Padding Top', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_bottom', control: 'range', label: 'Padding Bottom', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
    ] },
    // Vertical video rail inside the buy column — click opens the shared lightbox player.
    video_column: { name: 'Video column', icon: 'play', preview: (() => {
      const IMG = (OS.sample && OS.sample.IMG) || {};
      const a = IMG.ug1 || IMG.p3 || '';
      const b = IMG.ug2 || IMG.p4 || '';
      const c = IMG.ug3 || IMG.p5 || '';
      const cell = (src) => '<span class="os-blkprev-vc-cell"' + (src ? ' style="background-image:url(' + OS.esc(src) + ')"' : '') + '></span>';
      return '<div class="os-blkprev-vc">' + cell(a) + cell(b) + cell(c) + '</div>';
    })(),
      defaults: () => {
        const IMG = (OS.sample && OS.sample.IMG) || {};
        const covers = [IMG.ug1, IMG.ug2, IMG.ug3, IMG.ug4, IMG.ug5, IMG.ug6].filter(Boolean);
        return {
          heading: '',
          heading_color: '',
          per_row: 4,
          mobile_count: 2,
          gap: 10,
          corner_radius: 12,
          video_border: 'transparent',
          show_play_button: true,
          videos: covers.map((cover, i) => ({ id: 'vi-seed-' + i, cover_image: cover, video_url: '', accessible_label: '' })),
        };
      },
      fields: [
      { key: 'heading', control: 'text', label: 'Heading', default: '' },
      { key: 'heading_color', control: 'color', label: 'Heading color', default: '', allowTransparent: true, blankValue: () => OS.themeColor('heading_color', '#1a1a1a'), info: 'Blank inherits the theme heading color. T = transparent.' },
      { key: 'per_row', control: 'range', label: 'Videos per row · Desktop', min: 2, max: 6, step: 1, default: 4 },
      { key: 'mobile_count', control: 'range', label: 'Videos per row · Mobile', min: 1, max: 2, step: 1, default: 2 },
      { key: 'gap', control: 'range', label: 'Gap', min: 4, max: 24, step: 1, unit: 'px', default: 10 },
      { key: 'corner_radius', control: 'range', label: 'Corner radius', min: 0, max: 24, step: 1, unit: 'px', default: 12 },
      { key: 'video_border', control: 'color', label: 'Video border', default: 'transparent', allowTransparent: true, blankValue: () => '#222222', info: 'T = no border. Turn T off to restore a dark border.' },
      { key: 'show_play_button', control: 'toggle', label: 'Show play button', default: true },
      { key: 'videos', control: 'video_items', label: 'Videos', default: [], max: 12, info: 'Click a cover in the preview to open the enlarged player.' },
    ] },
  };

  // Regular = filled star glyphs. Boxed = Trustpilot / Loox square tiles with a white star.
  function ratingStars(rating, opts) {
    const o = opts || {};
    const count = o.count == null ? 5 : o.count;
    const boxed = o.style === 'boxed';
    const color = o.color || (boxed ? '#0f3636' : '#f5b301');
    const starPath = '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>';
    const starSvg = (fill) => '<svg viewBox="0 0 24 24" fill="' + OS.esc(fill) + '" stroke="none" aria-hidden="true">' + starPath + '</svg>';
    let html = '';
    for (let i = 1; i <= count; i++) {
      const on = rating >= i - 0.25;
      if (boxed) {
        html += '<span class="pdp-rate-st" style="background:' + (on ? OS.esc(color) : '#dcdce6') + '">' + starSvg('#fff') + '</span>';
      } else {
        html += '<span class="pdp-rate-icon">' + starSvg(on ? color : '#d8dce3') + '</span>';
      }
    }
    return '<span class="pdp-rate-stars">' + html + '</span>';
  }

  function savingFields(defaults) {
    const d = defaults || {};
    return [
      { key: 'show_saving', control: 'toggle', label: 'Show saving amount', default: d.show_saving == null ? true : d.show_saving, info: 'Only shows when the product has a compare-at price higher than the selling price.' },
      { key: 'saving_type', control: 'select', label: 'Type', default: d.saving_type || 'percentage', options: [
        { value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed amount' },
        { value: 'text', label: 'Sale' }, { value: 'label', label: 'Saving text' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_label', control: 'text', label: 'Saving text', default: d.saving_label || '', placeholder: 'e.g. Price after 34% Off', visibleWhen: (v) => !!v.show_saving && v.saving_type === 'label' },
      { key: 'saving_style', control: 'segmented', label: 'Saving style', default: d.saving_style || 'filled', options: [
        { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_position', control: 'segmented', label: 'Saving position', default: d.saving_position || 'right', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_bg', control: 'color', label: 'Saving background', default: d.saving_bg || '', allowTransparent: true, blankValue: () => OS.themeColor('sale_price_color', '#D92D20'), info: 'Blank inherits the theme sale price color. Outline style uses this as border/text tint. T = transparent.', visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_text_color', control: 'color', label: 'Saving text color', default: d.saving_text_color || '#ffffff', allowTransparent: true, blankValue: () => '#ffffff', visibleWhen: (v) => !!v.show_saving && v.saving_style !== 'outline' },
      { key: 'saving_icon', control: 'toggle', label: 'Show saving icon', default: d.saving_icon == null ? false : d.saving_icon, visibleWhen: (v) => !!v.show_saving },
    ];
  }

  function savingLabel(b, price, compareAt) {
    if (b.saving_type === 'label') return String(b.saving_label || '').trim() || 'Save';
    if (b.saving_type === 'text') return 'Sale';
    if (b.saving_type === 'fixed') return 'Save ' + OS.money(compareAt - price);
    return 'Save ' + Math.round((1 - price / compareAt) * 100) + '%';
  }

  function savingIcon(enabled) {
    return enabled
      ? ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.svg('price-tag', 12)) || '')
      : '';
  }

  function colorLuma(hex) {
    const h = String(hex || '').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    if (isNaN(n) || full.length !== 6) return 0;
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  function outlineTagStyle(accent, textColor) {
    // Draw stroke inside the box. Never use border — it used to make Outline taller than Filled.
    // Badge chips lock height via .pdp-tag CSS; price saves keep flexible height from font-size.
    const text = textColor || accent;
    const stroke = OS.hexAlpha(accent, 0.22);
    return 'background:#f9fafb;color:' + OS.esc(text) + ';border:0;outline:0;box-shadow:inset 0 0 0 1px ' + stroke + ';border-radius:5px;font-weight:700;letter-spacing:normal;box-sizing:border-box;';
  }
  function savingStyle(b, saleColor) {
    const saveBg = b.saving_bg || saleColor;
    const outline = b.saving_style === 'outline';
    const saveText = outline ? saveBg : (b.saving_text_color || '#ffffff');
    const style = outline
      ? outlineTagStyle(saveBg, saveText)
      : 'background:' + OS.esc(saveBg) + ';color:' + OS.esc(saveText) + ';';
    return { outline: outline, style: style };
  }
  function customTagStyle(kind, b, c) {
    const isNew = kind === 'new';
    const rawBg = isNew
      ? (b.new_badge_bg || '#FFC439')
      : (b.hot_badge_bg || b.badge_bg || c.primary_color || '#000000');
    const rawText = isNew
      ? (b.new_badge_text_color || '#ffffff')
      : (b.hot_badge_text_color || b.badge_text_color || '#ffffff');
    const fillBg = OS.bgOrTransparent(rawBg) || 'transparent';
    const fillText = OS.bgOrTransparent(rawText) || 'transparent';
    const outline = b.custom_tag_style === 'outline';
    if (outline) {
      // Bright accents (e.g. yellow) need dark text; light configured text falls back to accent.
      const accent = fillBg === 'transparent' ? (c.primary_color || '#000000') : fillBg;
      const textBase = fillText === 'transparent' ? accent : fillText;
      const text = colorLuma(textBase) > 0.72
        ? (colorLuma(accent) > 0.72 ? '#111111' : accent)
        : textBase;
      const strokeBase = colorLuma(accent) > 0.72 ? text : accent;
      return { outline: true, style: outlineTagStyle(strokeBase, text) };
    }
    return { outline: false, style: 'background:' + OS.esc(fillBg) + ';color:' + OS.esc(fillText) + ';' };
  }

  function badgesPositionOf(block) {
    const raw = ((block && block.settings) || {}).badge_position || 'left';
    // Migrate removed media placements to buy-column Left / Right alignment.
    if (raw === 'top-right' || raw === 'right') return 'right';
    return 'left';
  }

  function rowHtml(block, p, s, t, ctx, selectedOverride, bare) {
    const b = block.settings || {};
    const c = t.colors || {};
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const selected = selectedOverride || resolveSelectedVariant(p).variant || p;
    const price = selected.price == null ? p.price : selected.price;
    const compareAt = selected.compareAt == null ? p.compareAt : selected.compareAt;
    const inventory = selected.inventory == null ? (p.inventory == null ? 12 : p.inventory) : selected.inventory;
      const sale = compareAt && compareAt > price;
      const preorder = !!(selected.preorder || p.preorder);
      const saleColor = c.sale_price_color || '#d63a2f';
    const mob = ctx.mob;
    let body = '';
    if (block.kind === 'badges') {
      const badgeGap = Number(b.badge_gap == null ? 8 : b.badge_gap);
      const position = badgesPositionOf(block);
      const iconHtml = b.badge_icon_image
        ? '<img alt="" src="' + OS.esc(b.badge_icon_image) + '">'
        : ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.svg(b.badge_icon, 14)) || '');
      const wrapCustom = (kind, label) => {
        const st = customTagStyle(kind, b, c);
        return '<span class="pdp-tag tag-' + kind + (st.outline ? ' outline' : '') + '" style="' + st.style + '">' + iconHtml + OS.esc(label) + '</span>';
      };
      const tags = (p.tags || []).map((tag) => {
        const m = String(tag).match(/^tag__(hot|new)_(.+)$/i);
        if (!m) return '';
        return wrapCustom(m[1].toLowerCase(), m[2]);
      }).filter(Boolean);
      // Always mount sold badge when enabled so variant switches can toggle it live.
      if (b.show_sold_out) {
        tags.push('<span class="pdp-tag sold" data-pdp-sold-badge' + (inventory <= 0 && !preorder ? '' : ' hidden') + '>' + OS.esc('Sold out') + '</span>');
      }
      if (preorder && b.show_preorder !== false) {
        tags.push('<span class="pdp-tag preorder" data-pdp-preorder-badge>Pre-order</span>');
      }
      if (b.show_saving && sale) {
        const save = savingStyle(b, saleColor);
        const icon = savingIcon(b.saving_icon);
        const label = savingLabel(b, price, compareAt);
        const saveTag = '<span class="pdp-tag sale' + (save.outline ? ' outline' : '') + '" data-pdp-sale-badge style="' + save.style + '">' + icon + OS.esc(label) + '</span>';
        // Left / right relative to the whole tag row (custom tags + sold out + save).
        if (b.saving_position === 'left') tags.unshift(saveTag);
        else tags.push(saveTag);
      }
      const badgesHidden = b.show_sold_out && inventory > 0 && tags.length === 1;
      body = tags.length
        ? '<div class="pdp-tags" data-pdp-badges data-badge-position="' + OS.esc(position) + '" style="gap:' + badgeGap + 'px"' + (badgesHidden ? ' hidden' : '') + '>' + tags.join('') + '</div>'
        : '';
    } else if (block.kind === 'title') {
      const px = Number(b.title_size || 30);
      const titleWeight = b.title_weight != null ? String(b.title_weight) : '';
      const titleTracking = b.title_letter_spacing != null ? Number(b.title_letter_spacing) : null;
      const titleMb = b.title_margin_bottom != null ? Number(b.title_margin_bottom) : null;
      const titleFont = b.title_font_family
        ? OS.fontStack(String(b.title_font_family))
        : (b.title_font === 'body' ? OS.bodyFamily(t) : OS.headingFamily(t));
      // Title size is an absolute px control (same as Price size), not theme heading scale.
      const titlePx = mob ? Math.max(10, Math.round(px * 0.88)) : px;
      body = '<h1 class="pdp-title" style="font-family:' + titleFont +
        ';font-size:' + titlePx + 'px' +
        ';color:' + OS.col(s.text, c.heading_color || '#1a1a1a') +
        (titleWeight ? ';font-weight:' + OS.esc(titleWeight) : '') +
        (titleTracking != null && isFinite(titleTracking) ? ';letter-spacing:' + titleTracking + 'em' : '') +
        (titleMb != null && isFinite(titleMb) ? ';margin-bottom:' + titleMb + 'px' : '') +
        '">' + OS.esc(p.title) + '</h1>';
      const titleDescSrc = b.description_dynamic_source;
      let titleDescHtml = '';
      if (typeof titleDescSrc === 'string' && titleDescSrc && titleDescSrc !== 'true' && titleDescSrc !== 'false'
          && String(b.description || '').indexOf('data-mf-path') < 0) {
        const mfVal = resolveProductMetafield(p, titleDescSrc);
        titleDescHtml = mfVal ? (/<[a-z][\s\S]*>/i.test(mfVal) ? mfVal : OS.esc(mfVal)) : '';
      } else if (!titleDescSrc || titleDescSrc === false) {
        titleDescHtml = resolveMetafieldChips(String(b.description || '').trim(), p);
      } else {
        titleDescHtml = resolveMetafieldChips(String(b.description || '').trim(), p);
      }
      if (titleDescHtml) {
        body += '<div class="pdp-title-desc" style="color:' + OS.esc(b.description_color || '#000000') + ';font-size:' + (b.description_size || 14) + 'px;padding-top:' + (b.description_top || 0) + 'px;padding-bottom:' + (b.description_bottom || 0) + 'px">' +
          titleDescHtml + '</div>';
      }
    } else if (block.kind === 'rating') {
      if (!p.rating) return '';
      const ratingLayout = b.layout || 'default';
      let ratingStyle = b.style || 'stars-rating-custom';
      // Single icon drops "Stars + review count" — fall back so the score stays visible.
      if (ratingLayout === 'single-icon' && ratingStyle === 'stars-and-count') ratingStyle = 'stars-and-reviews';
      const starStyle = (ratingLayout === 'single-icon') ? 'regular' : (b.star_style || 'boxed');
      const rating = Number(p.rating).toFixed(1);
      const reviews = Number(p.reviews || 0).toLocaleString();
      const starColor = (!b.color || b.color === '') ? (starStyle === 'boxed' ? '#0f3636' : '#f5b301') : b.color;
      const reviewLabel = OS.esc(String(b.review_label || 'reviews'));
      const customText = OS.esc(String(b.custom_text || ''));
      // Blank inherits Theme › Colors › Body text (same as blankValue on the Text color control).
      const textColor = (!b.text_color || b.text_color === '')
        ? (((t.colors && t.colors.text_color) || '#000000'))
        : b.text_color;
      const textStyle = 'color:' + OS.esc(textColor) + ';' + (b.underline_text ? 'text-decoration:underline;text-underline-offset:3px;' : '');
      const starCount = ratingLayout === 'single-icon' ? 1 : 5;
      const starRow = ratingStars(p.rating, { style: starStyle, color: starColor, count: starCount });
      let textHtml = '';
      if (ratingStyle === 'stars-and-count') textHtml = reviews + ' ' + reviewLabel;
      else if (ratingStyle === 'stars-and-reviews') textHtml = rating + ' (' + reviews + ' ' + reviewLabel + ')';
      else if (ratingStyle === 'stars-rating-custom') textHtml = rating + '/5 ' + customText;
      else if (ratingStyle === 'stars-custom') textHtml = customText;
      body = '<div class="pdp-rate" style="font-size:' + (b.size || 14) + 'px">' + starRow +
        (textHtml ? '<span style="' + textStyle + '">' + textHtml + '</span>' : '') + '</div>';
    } else if (block.kind === 'price') {
      const saving = savingLabel(b, price, compareAt);
      const save = savingStyle(b, saleColor);
      const saveOrder = b.saving_position === 'left' ? 'order:-1;' : '';
      const priceSize = Math.max(10, Math.min(120, Number(b.size == null ? 14 : b.size)));
      const priceWeight = b.weight != null ? String(b.weight) : '300';
      // Compare-at matches sale price size (Chantilly / theme editor Size setting).
      const compareSize = priceSize;
      const saveSize = Math.max(10, Math.round(priceSize * (14.4 / 14)));
      const nowStyle = 'font-size:' + priceSize + 'px;font-weight:' + OS.esc(priceWeight) + ';line-height:' + Math.round(priceSize * 1.6) + 'px;' + (sale ? 'color:' + saleColor + ';' : '');
      const compareStyle = 'font-size:' + compareSize + 'px;line-height:' + Math.round(compareSize * 1.6) + 'px;';
      const saveStyle = save.style + saveOrder + 'font-size:' + saveSize + 'px;line-height:' + Math.round(saveSize * 1.25) + 'px;';
      const nowHtml = '<span class="now" data-pdp-now style="' + nowStyle + '">' + OS.money(price) + '</span>';
      const compareHtml = sale
        ? '<s data-pdp-compare style="' + compareStyle + '">' + OS.money(compareAt) + '</s>'
        : '<s data-pdp-compare hidden style="' + compareStyle + '"></s>';
      const taxesHtml = b.show_taxes
        ? '<div class="pdp-taxes">Tax included. <a href="#shipping-policy">Shipping</a> calculated at checkout.</div>'
        : '';
      body = '<div class="pdp-price-wrap">' +
        '<div class="pdp-price" style="--pdp-price-size:' + priceSize + 'px;--pdp-price-weight:' + OS.esc(priceWeight) + '">' + nowHtml + compareHtml +
        (b.show_saving && sale
          ? '<span class="save' + (save.outline ? ' outline' : '') + '" data-pdp-save data-save-type="' + OS.esc(b.saving_type || 'percentage') + '" data-save-label="' + OS.esc(String(b.saving_label || '').trim()) + '" data-save-icon="' + (b.saving_icon ? '1' : '0') + '" style="' + saveStyle + '">' + savingIcon(b.saving_icon) + OS.esc(saving) + '</span>'
          : '') + '</div>' +
        taxesHtml +
        '</div>';
    } else if (block.kind === 'divider') {
      body = '<div style="padding:' + (b.padding_top || 0) + 'px 0 ' + (b.padding_bottom || 0) + 'px"><hr class="pdp-line" style="border-top-width:' + (b.thickness || 1) + 'px;border-top-color:' + OS.esc(b.color || '#E5E5E5') + '"></div>';
    } else if (block.kind === 'variant') {
      const vis = b.hide_sold_out
        ? variants.filter((v) => Number(v.inventory || 0) > 0 && v.available !== false)
        : variants;
      const inStock = (v) => (Number(v.inventory || 0) > 0 && v.available !== false) || !!v.preorder;
      const colors = Array.from(new Set(vis.map((v) => v.color).filter(Boolean)));
      const sizes = Array.from(new Set(vis.map((v) => v.size).filter(Boolean)));
      const selectedColor = selected.color || colors[0] || 'Default';
      const selectedSize = selected.size || sizes[0] || 'Default';
      const colorMap = {};
      colors.forEach((color, i) => { colorMap[color] = (p.swatches || [])[i] || ['#222222', '#c8b6a6', '#94a3b8'][i % 3]; });
      const shape = b.shape === 'circle' ? ' shape-circle' : (b.shape === 'square' ? ' shape-square' : '');
      const isDropdown = b.picker_type === 'dropdown' || !!b.nested_dropdown;
      const showTitle = !!b.show_group_title;
      const skuLabel = (v) => {
        if (!b.show_sku_in_option) return '';
        const name = String(b.sku_display_name || '').trim() || v.sku || '';
        return name ? ' · ' + name : '';
      };
      const optionLabel = (kind, item) => {
        const match = vis.find((v) => v[kind] === item) || {};
        return item + skuLabel(match);
      };
      const ddHtml = (kind, label, items, selectedValue) => {
        const opts = items.map((item) => {
          const sold = !vis.some((v) => v[kind] === item && inStock(v));
          return '<button type="button" class="pdp-dd-opt' + (item === selectedValue ? ' on' : '') + (sold ? ' sold' : '') + '" role="option" data-pdp-dd-opt data-value="' + OS.esc(item) + '" aria-selected="' + (item === selectedValue ? 'true' : 'false') + '">' + OS.esc(optionLabel(kind, item)) + (sold ? ' — Sold out' : '') + '</button>';
        }).join('');
        const selectedSold = !vis.some((v) => v[kind] === selectedValue && inStock(v));
        return '<div class="pdp-dd" data-pdp-' + kind + '-dd>' +
          '<button type="button" class="pdp-dd-btn" data-pdp-dd-btn aria-haspopup="listbox" aria-expanded="false" aria-label="' + OS.esc(label) + '"><span data-pdp-dd-val>' + OS.esc(optionLabel(kind, selectedValue)) + (selectedSold ? ' — Sold out' : '') + '</span></button>' +
          '<div class="pdp-dd-menu" data-pdp-dd-menu hidden role="listbox" aria-label="' + OS.esc(label) + '">' + opts + '</div></div>';
      };
      const imageForColor = (color) => {
        const match = vis.find((v) => v.color === color && v.image) || vis.find((v) => v.color === color);
        return (match && match.image) || (p.images && p.images[0]) || p.image || '';
      };
      // Keep every SKU in the data node so deep links to sold-out variants still resolve (PRD).
      // No variants array → one default SKU from the product (single-SKU / no-picker case).
      const dataSource = variants.length ? variants : [{
        id: p.id || p.handle || 'default',
        color: '',
        size: '',
        price: p.price,
        compareAt: p.compareAt,
        inventory: p.inventory == null ? 99 : p.inventory,
        image: p.image,
        sku: p.sku || '',
      }];
      const data = dataSource.map((v) => '<i data-pdp-variant data-id="' + OS.esc(v.id || '') + '" data-color="' + OS.esc(v.color || '') + '" data-size="' + OS.esc(v.size || '') + '" data-price="' + Number(v.price || 0) + '" data-compare="' + Number(v.compareAt || 0) + '" data-inventory="' + Number(v.inventory == null ? 99 : v.inventory) + '" data-preorder="' + (v.preorder ? '1' : '0') + '" data-available="' + (v.available === false ? '0' : '1') + '" data-image="' + OS.esc(v.image || p.image || '') + '" data-sku="' + OS.esc(v.sku || '') + '"></i>').join('');
      if (b.nested_dropdown) {
        const selectedId = selected.id || '';
        const selectedCombo = [selectedSize, selectedColor].filter(Boolean).join(' / ') || 'Variant';
        const opts = vis.map((v) => {
          const combo = [v.size, v.color].filter(Boolean).join(' / ') || (v.title || 'Variant');
          const sold = !inStock(v);
          const label = combo + skuLabel(v);
          return '<button type="button" class="pdp-dd-opt' + (v.id === selectedId ? ' on' : '') + (sold ? ' sold' : '') + '" role="option" data-pdp-dd-opt data-pdp-variant-id="' + OS.esc(v.id || '') + '" data-value="' + OS.esc(combo) + '" data-pdp-color="' + OS.esc(v.color || '') + '" data-pdp-size="' + OS.esc(v.size || '') + '" aria-selected="' + (v.id === selectedId ? 'true' : 'false') + '">' + OS.esc(label) + (sold ? ' — Sold out' : '') + '</button>';
        }).join('');
        const selectedSold = !inStock(selected);
        const nestedDd = '<div class="pdp-dd" data-pdp-nested-dd>' +
          '<button type="button" class="pdp-dd-btn" data-pdp-dd-btn aria-haspopup="listbox" aria-expanded="false" aria-label="Variant"><span data-pdp-dd-val>' + OS.esc(selectedCombo + skuLabel(selected)) + (selectedSold ? ' — Sold out' : '') + '</span></button>' +
          '<div class="pdp-dd-menu" data-pdp-dd-menu hidden role="listbox" aria-label="Variant">' + opts + '</div></div>';
        body = '<div class="pdp-options"><div class="pdp-option">' +
          (showTitle ? '<div class="pdp-label">Variant: <span class="pdp-opt-val" data-pdp-nested-label>' + OS.esc(selectedCombo) + '</span></div>' : '<span hidden data-pdp-nested-label>' + OS.esc(selectedCombo) + '</span>') +
          nestedDd + '</div></div><span hidden data-pdp-variant-data>' + data + '</span>';
      } else {
        const colorHtml = isDropdown
          ? ddHtml('color', 'Color', colors, selectedColor)
          : '<div class="pdp-swatches">' + colors.map((color) => {
            const textStyle = b.swatch_style === 'text';
            const imageStyle = b.swatch_style === 'image';
            const sold = !vis.some((v) => v.color === color && inStock(v));
            const img = imageStyle ? imageForColor(color) : '';
            const bg = textStyle ? '' : (imageStyle
              ? (img ? 'background-image:url(' + OS.esc(img) + ')' : 'background:' + colorMap[color])
              : 'background:' + colorMap[color]);
            const match = vis.find((v) => v.color === color) || {};
            return '<button type="button" class="' + (textStyle ? 'pdp-size' : 'pdp-sw') + (imageStyle ? ' pdp-sw-img' : '') + shape + (color === selectedColor ? ' on' : '') + (sold ? ' sold' : '') + '" data-pdp-color="' + OS.esc(color) + '"' +
              (textStyle ? '' : ' aria-label="' + OS.esc(color) + '" style="' + bg + '"') + '>' + (textStyle ? OS.esc(color + skuLabel(match)) : '') + '</button>';
          }).join('') + '</div>';
        const sizeHtml = isDropdown
          ? ddHtml('size', 'Size', sizes, selectedSize)
          : '<div class="pdp-sizes">' + sizes.map((z) => {
            const sold = !vis.some((v) => v.size === z && inStock(v));
            const match = vis.find((v) => v.size === z) || {};
            return '<button type="button" class="pdp-size' + shape + (z === selectedSize ? ' on' : '') + (sold ? ' sold' : '') + '" data-pdp-size="' + OS.esc(z) + '">' + OS.esc(z + skuLabel(match)) + '</button>';
          }).join('') + '</div>';
        const sizeGuideHtml = b._size_guide_html ? ('<span class="pdp-size-guide-slot">' + b._size_guide_html + '</span>') : '';
        body = '<div class="pdp-options"><div class="pdp-option">' +
          (showTitle ? '<div class="pdp-label">Color: <span class="pdp-opt-val" data-pdp-color-label>' + OS.esc(selectedColor) + '</span></div>' : '<span hidden data-pdp-color-label>' + OS.esc(selectedColor) + '</span>') +
          colorHtml + '</div><div class="pdp-option">' +
          (showTitle
            ? '<div class="pdp-label pdp-size-head"><span>Size: <span class="pdp-opt-val" data-pdp-size-label>' + OS.esc(selectedSize) + '</span></span>' + sizeGuideHtml + '</div>'
            : '<span hidden data-pdp-size-label>' + OS.esc(selectedSize) + '</span>' + sizeGuideHtml) +
          sizeHtml + '</div></div><span hidden data-pdp-variant-data>' + data + '</span>';
      }
    } else if (block.kind === 'description') {
      const src = b.text_dynamic_source;
      const customText = String(b.text || '').trim();
      const productDesc = String(p.description || '').trim();
      let descHtml = '';
      if (src === false) {
        descHtml = customText || productDesc || 'Product description will appear here.';
      } else if (typeof src === 'string' && src && src !== 'true' && src !== 'false') {
        const mfVal = resolveProductMetafield(p, src);
        descHtml = mfVal
          ? (/<[a-z][\s\S]*>/i.test(mfVal) ? mfVal : OS.esc(mfVal))
          : (productDesc || 'Product description will appear here.');
      } else {
        // null / true / defaultConnected → product description (Shopify resource.description).
        descHtml = productDesc || 'Product description will appear here.';
      }
      const pad = [b.padding_top, b.padding_right, b.padding_bottom, b.padding_left]
        .map((n) => (n == null ? 0 : Number(n)) + 'px').join(' ');
      const isFit = b.width === 'fit';
      const align = (!isFit && (b.alignment === 'center' || b.alignment === 'right')) ? b.alignment : 'left';
      const widthStyle = isFit
        ? 'width:fit-content;max-width:100%;'
        : 'width:100%;max-width:100%;text-align:' + align + ';';
      let bgStyle = '';
      if (b.background) {
        const bgColor = OS.bgOrTransparent(b.background_color) || '#FFFFFF';
        const radius = (b.corner_radius == null ? 0 : Number(b.corner_radius)) + 'px';
        bgStyle = 'background:' + bgColor + ';border-radius:' + radius + ';--pdp-desc-bg:' + bgColor + ';--pdp-desc-radius:' + radius + ';';
      }
      body = '<div class="pdp-desc' + (b.background ? ' has-bg' : '') + '" style="' + widthStyle + 'font-size:14px;font-weight:300;line-height:1.4;' + bgStyle + 'padding:' + pad + '">' + descHtml + '</div>';
    } else if (block.kind === 'inventory') {
      if (b.show_status === false) return '';
      const showCount = b.show_count !== false;
      const customText = String(b.custom_text || '');
      const threshold = Number(b.low_stock_threshold == null ? 5 : b.low_stock_threshold);
      const lowTextTpl = String(b.low_stock_text || 'Low stock - {n} items left');
      const soldText = String(b.sold_out_text || 'Sold out');
      const style = b.status_style || 'dot';
      const inStockColor = b.in_stock_color || '#10a443';
      const lowStockColor = b.status_color || '#f59e0b';
      const fontSize = Math.max(10, Math.min(50, b.font_size == null ? 14 : Number(b.font_size)));
      const isLow = inventory > 0 && inventory <= threshold;
      const statusText = preorder
        ? 'Pre-order now · ships as soon as it is in stock.'
        : (inventory <= 0
          ? soldText
          : (isLow
          ? lowTextTpl.replace(/\{n\}/g, String(inventory)) + customText
          : ((showCount ? inventory + ' in stock' : 'In stock') + customText)));
      
      const styleClass = style === 'badge' ? ' style-badge' : (style === 'text-only' ? ' style-text' : '');
      const activeColor = preorder ? '#222222' : (inventory <= 0 ? '#9ca3af' : (isLow ? lowStockColor : inStockColor));
      body = '<div class="pdp-stock' + (preorder ? ' preorder' : (inventory <= 0 ? ' sold' : (isLow ? ' low' : ''))) + styleClass + '" data-pdp-stock data-show-count="' + (showCount ? '1' : '0') + '" data-custom-text="' + OS.esc(customText) + '" data-low-threshold="' + threshold + '" data-low-text="' + OS.esc(lowTextTpl) + '" data-sold-text="' + OS.esc(soldText) + '" data-in-stock-color="' + OS.esc(inStockColor) + '" data-low-stock-color="' + OS.esc(lowStockColor) + '" style="--status-color:' + OS.esc(activeColor) + ';--pdp-stock-fs:' + fontSize + 'px"><i></i><span>' +
        OS.esc(statusText) + '</span></div>';
    } else if (block.kind === 'buy') {
      const showDyn = !!b.show_dynamic;
      const channels = resolveBuyChannels(b);
      const showPayMore = showDyn && channels.length > 0 && b.show_payment_options !== false;
      // Keep ATC + dynamic shapes in the same family by default (dyn falls back to atc).
      // Height / typography → Theme settings › Buttons; shape/color → Buy block.
      const themeRad = themeButtonRadius(t);
      const btnH = themeButtonHeight(t);
      const atcShape = b.atc_shape || b.button_shape || 'pill';
      const dynShape = b.dyn_shape || b.atc_shape || b.button_shape || 'pill';
      const atcRadius = buyButtonRadius(atcShape, b.atc_custom_radius != null ? b.atc_custom_radius : b.custom_radius, themeRad);
      const dynRadius = buyButtonRadius(dynShape, b.dyn_custom_radius != null ? b.dyn_custom_radius : b.custom_radius, themeRad);
      const atcRadiusStyle = 'border-radius:' + atcRadius + 'px';
      const dynRadiusStyle = 'border-radius:' + dynRadius + 'px';
      const actionsVarStyle = '--pdp-atc-radius:' + atcRadius + 'px;--pdp-dyn-radius:' + dynRadius + 'px;--pdp-btn-h:' + btnH + 'px';
      const atcFull = b.atc_layout === 'full-width';
      const useLogo = !!b.channel_logo;
      const buyNowLabel = b.buy_now_text || 'Buy now';
      // Drop theme button border — filled ATC looks harsh with a contrasting outline.
      // Keep btnStyle height / font / letter-spacing / transform; only paint from Buy block.
      const atcColorStyle = (b.atc_background ? ';background:' + b.atc_background : '') + (b.atc_text_color ? ';color:' + b.atc_text_color : '') + ';border:0';
      const buyNowColorStyle = ';background:' + (b.buy_now_background || '#fff') + ';color:' + (b.buy_now_text_color || 'inherit') + ';border:0';
      const paypalLogo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="38 6 86 24" height="22" aria-hidden="true" focusable="false">' +
        '<path fill="#253B80" d="M46.211 6.749h-6.839c-.468 0-.866.34-.939.802l-2.766 17.537c-.055.346.213.658.564.658h3.265c.468 0 .866-.34.939-.803l.746-4.73c.072-.463.471-.803.938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415C50.224 7.353 48.5 6.749 46.211 6.749zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583c.043-.277.283-.481.563-.481h.473c1.235 0 2.4 0 3.002.704.361.41.471 1.034.332 1.906z"/>' +
        '<path fill="#253B80" d="M66.654 13.075h-3.275c-.279 0-.52.204-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.562.66h2.95c.469 0 .865-.34.939-.803l1.77-11.209c.055-.347-.212-.66-.562-.66zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.489.577.687 1.399.554 2.317z"/>' +
        '<path fill="#253B80" d="M84.096 13.075h-3.291c-.314 0-.609.156-.787.417l-4.539 6.686-1.924-6.425c-.121-.402-.492-.678-.912-.678h-3.234c-.393 0-.666.384-.541.754l3.625 10.638-3.408 4.811c-.268.379.002.9.465.9h3.287c.312 0 .604-.152.781-.408L84.564 13.97c.262-.378-.007-.895-.468-.895z"/>' +
        '<path fill="#179BD7" d="M94.992 6.749h-6.84c-.467 0-.865.34-.938.802l-2.766 17.537c-.055.346.213.658.562.658h3.51c.326 0 .605-.238.656-.562l.785-4.971c.072-.463.471-.803.938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415C99.004 7.353 97.281 6.749 94.992 6.749zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583c.043-.277.281-.481.562-.481h.473c1.234 0 2.4 0 3.002.704.36.41.469 1.034.331 1.906z"/>' +
        '<path fill="#179BD7" d="M115.434 13.075h-3.273c-.281 0-.52.204-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.564.66h2.949c.467 0 .865-.34.938-.803l1.771-11.209c.055-.347-.213-.66-.564-.66zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.491.577.689 1.399.554 2.317z"/>' +
        '<path fill="#179BD7" d="M119.295 7.23l-2.807 17.858c-.055.346.213.658.562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536c.055-.346-.213-.659-.562-.659h-3.16c-.279 0-.519.204-.562.482z"/>' +
      '</svg>';
      const channelBtn = (id) => {
        // Wallets keep brand paint in CSS; height comes from --pdp-btn-h. Buy now uses Theme › Buttons type + block colors.
        const style = ' style="' + dynRadiusStyle + '"';
        if (id === 'buy_now') {
          return '<button type="button" class="pdp-buynow" data-pdp-buynow style="' + OS.btnStyle(t) + ';' + dynRadiusStyle + buyNowColorStyle + '"' + (inventory <= 0 ? ' disabled' : '') + '>' + OS.esc(buyNowLabel) + '</button>';
        }
        if (id === 'paypal') {
          return '<button type="button" class="pdp-paypal" data-pdp-paypal aria-label="PayPal"' + style + '>' + (useLogo ? paypalLogo : 'PayPal') + '</button>';
        }
        const map = {
          apple_pay: { cls: 'apple', label: 'Apple Pay', logo: 'Apple Pay' },
          google_pay: { cls: 'google', label: 'Google Pay', logo: 'G Pay' },
        };
        const m = map[id];
        if (!m) return '';
        return '<button type="button" class="pdp-chan ' + m.cls + '" aria-label="' + OS.esc(m.label) + '"' + style + '>' + OS.esc(useLogo ? m.logo : m.label) + '</button>';
      };
      // Only selected channels; empty = none (no fallback to all wallets).
      const channelHtml = showDyn ? channels.map(channelBtn).join('') : '';
      const dyn = (channelHtml || showPayMore) ? '<div class="pdp-dyn">' + channelHtml +
        (showPayMore ? '<button type="button" class="pdp-pay-more" data-pdp-pay-more>More payment options</button>' : '') +
      '</div>' : '';
      const trustList = (Array.isArray(b.trust_logos) && b.trust_logos.length ? b.trust_logos : ['norton', 'paypal', 'visa', 'mastercard', 'mcafee', 'money_back'])
        .filter((id) => id && id !== 'shop');
      const logoSize = Math.max(20, Math.min(56, Number(b.trust_logo_size == null ? 28 : b.trust_logo_size)));
      const safeAlign = ({ left: 'left', right: 'right' }[b.safe_checkout_align] || 'center');
      const safe = (showDyn && b.show_safe_checkout)
        ? '<div class="pdp-safe align-' + safeAlign + '" style="--pdp-safe-h:' + logoSize + 'px">' +
            '<div class="pdp-safe-label">' + OS.esc(b.safe_checkout_label || 'GUARANTEED SAFE CHECKOUT') + '</div>' +
            '<div class="pdp-safe-logos">' + trustList.map(trustLogoHtml).join('') + '</div></div>'
        : '';
      const qtyInner = b.show_quantity
        ? '<div class="pdp-qty" style="' + atcRadiusStyle + '"><button type="button" data-pdp-q="-">-</button><span data-pdp-qty>1</span><button type="button" data-pdp-q="+">+</button></div>'
        : '';
      const qtyHtml = qtyInner
        ? (atcFull
          ? '<div class="pdp-qty-wrap"><div class="pdp-qty-label">Quantity</div>' + qtyInner + '</div>'
          : qtyInner)
        : '';
      const atcIcon = b.atc_icon == null ? 'bag-plus' : b.atc_icon;
      const atcType = atcFull ? ';font-size:14px;font-weight:300;letter-spacing:0.08em;text-transform:uppercase;height:47px;min-height:47px' : '';
      const atcHtml = b.show_add
        ? '<button type="button" class="pdp-atc' + (atcFull ? ' full' : '') + '" data-pdp-atc data-atc-icon="' + OS.esc(atcIcon) + '" style="' + OS.btnStyle(t) + ';' + atcRadiusStyle + atcColorStyle + atcType + '"' + (inventory <= 0 && !preorder ? ' disabled' : '') + '>' +
          (inventory <= 0 && !preorder ? atcButtonInner(atcIcon, 'Sold out') : atcButtonInner(atcIcon, 'Add to cart')) + '</button>'
        : '';
      let buyPrimary = '';
      if (qtyHtml || atcHtml) {
        if (atcFull) {
          buyPrimary = (qtyHtml ? '<div class="pdp-buy-row is-qty-only">' + qtyHtml + '</div>' : '') + atcHtml;
        } else {
          buyPrimary = '<div class="pdp-buy-row">' + qtyHtml + atcHtml + '</div>';
        }
      }
      body = '<div class="pdp-actions" style="' + actionsVarStyle + '">' + buyPrimary + dyn + safe + '</div>';
    } else if (block.kind === 'icon_text') {
      const mark = (name, px) => (window.OS_THEME_ICONS && window.OS_THEME_ICONS.svg(name || 'box', px)) || '';
      const pickCopy = (primary, legacy) => {
        if (primary != null && String(primary).trim() !== '') return primary;
        if (legacy != null && String(legacy).trim() !== '') return legacy;
        return primary != null ? primary : (legacy || '');
      };
      // Whitespace / empty richtext tags do not count as content. Icon or image alone is hidden.
      const hasCopy = (html) => {
        const text = String(html || '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/gi, ' ')
          .replace(/\u00a0/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
        return text.length > 0;
      };
      // Prefer first_heading / first_content; fall back to legacy first / second / third.
      const items = [
        { icon: b.icon_1 || 'box', image: b.image_1, heading: pickCopy(b.first_heading, b.first), content: b.first_content || '' },
        { icon: b.icon_2 || 'return', image: b.image_2, heading: pickCopy(b.second_heading, b.second), content: b.second_content || '' },
        { icon: b.icon_3 || 'star', image: b.image_3, heading: pickCopy(b.third_heading, b.third), content: b.third_content || '' },
      ].filter((item) => hasCopy(item.heading) || hasCopy(item.content));
      // Title font family picks the theme Body or Heading type token set.
      const ty = (t && t.typography) || {};
      const themeBase = Number(ty.base_font_size || 16);
      // Title size is a px drag. OOB / blank / legacy tokens fall back to theme base size.
      const sizeLegacy = ({ small: 14, base: themeBase, large: 18 })[b.size];
      const sizePx = sizeLegacy != null
        ? sizeLegacy
        : Math.max(10, Math.min(48, Number(b.size == null || b.size === '' ? themeBase : b.size) || themeBase));
      const useHeading = b.font === 'heading';
      const titleFamily = useHeading ? OS.headingFamily(t) : OS.bodyFamily(t);
      const titlePx = useHeading ? OS.headingSize(t, sizePx, mob) : sizePx;
      const boldW = (() => { const n = Number(ty.body_bold_weight); return n >= 100 && n <= 900 ? n : 500; })();
      const titleWeight = useHeading ? boldW : 400;
      const titleTracking = useHeading
        ? ((isFinite(Number(ty.heading_letter_spacing)) ? Number(ty.heading_letter_spacing) : -4) / 100) + 'em'
        : 'normal';
      const titleTransform = (useHeading && ty.heading_uppercase) ? 'uppercase' : 'none';
      // Content stays on Body type at the same optical size as the heading line.
      const contentFamily = OS.bodyFamily(t);
      const contentPx = Math.max(10, titlePx);
      const contentWeight = 300;
      const iconPx = Math.max(16, Math.min(96, Number(b.icon_size == null ? Math.round(titlePx * 1.25) : b.icon_size) || 20));
      const linePx = Math.max(iconPx, Math.round(titlePx * 1.6));
      const itemGap = Math.max(4, Math.min(48, Number(b.item_gap == null ? 24 : b.item_gap) || 24));
      const iconTextGap = Math.max(0, Math.min(32, Number(b.icon_text_gap == null ? 8 : b.icon_text_gap) || 8));
      const itemLayout = b.item_layout === 'icon-top' ? 'top' : 'left';
      const align = (b.alignment === 'center' || b.alignment === 'right') ? b.alignment : 'left';
      const cardClass = b.card_style === 'outline' ? ' card-outline' : (b.card_style === 'filled' ? ' card-filled' : '');
      const textColor = OS.col(b.text_color, (t.colors && t.colors.text_color) || '#1A1A1A');
      const iconColor = OS.col(b.icon_color, (t.colors && t.colors.primary_color) || '#103635');
      const logoW = Math.max(40, Math.min(240, Math.round(iconPx * 2.2)));
      const logoH = Math.max(20, Math.min(96, Math.round(iconPx * 1.1)));
      let bgStyle = '';
      if (b.background) {
        const bgColor = OS.bgOrTransparent(b.background_color) || '#f6f6f6';
        const radius = Math.max(0, Number(b.corner_radius == null ? 10 : b.corner_radius)) + 'px';
        bgStyle = '--pdp-icons-bg:' + bgColor + ';--pdp-icons-radius:' + radius + ';';
      }
      const gapY = b.layout === 'vertical' ? itemGap : Math.max(8, Math.round(itemGap * 0.4));
      const styleVars = [
        'font-family:' + titleFamily,
        'font-size:' + titlePx + 'px',
        '--pdp-title-font:' + titleFamily,
        '--pdp-title-size:' + titlePx + 'px',
        '--pdp-title-weight:' + titleWeight,
        '--pdp-title-tracking:' + titleTracking,
        '--pdp-title-transform:' + titleTransform,
        '--pdp-content-font:' + contentFamily,
        '--pdp-content-size:' + contentPx + 'px',
        '--pdp-content-weight:' + contentWeight,
        '--pdp-icon-size:' + iconPx + 'px',
        '--pdp-icon-line:' + linePx + 'px',
        '--pdp-item-gap-x:' + itemGap + 'px',
        '--pdp-item-gap-y:' + gapY + 'px',
        '--pdp-icon-text-gap:' + iconTextGap + 'px',
        '--pdp-logo-width:' + logoW + 'px',
        '--pdp-logo-height:' + logoH + 'px',
        '--pdp-icons-text:' + textColor,
        '--pdp-icons-icon:' + iconColor,
        bgStyle,
      ].join(';');
      body = items.length ? '<div class="pdp-icons' + (b.layout === 'vertical' ? ' vertical' : '') + ' align-' + align + (b.background ? ' has-bg' : '') + '" style="' + styleVars + '">' +
        items.map((item) => {
          const hasText = String(item.heading || '').trim() || String(item.content || '').trim();
          const media = item.image
            ? '<img class="pdp-icon-img' + (hasText ? '' : ' logo') + '" alt="" src="' + OS.esc(item.image) + '">'
            : (item.icon && item.icon !== 'none' ? '<span class="pdp-icon-mark">' + mark(item.icon, iconPx) + '</span>' : '');
          const bodyHtml = hasText
            ? '<div class="pdp-icon-body">' +
              (String(item.heading || '').trim() ? '<div class="pdp-icon-h">' + item.heading + '</div>' : '') +
              (String(item.content || '').trim() ? '<div class="pdp-icon-c">' + item.content + '</div>' : '') +
              '</div>'
            : '';
          return '<div class="pdp-icon-item ' + itemLayout + cardClass + '">' + media + bodyHtml + '</div>';
        }).join('') + '</div>' : '';
    } else if (block.kind === 'sku') {
      body = '<div class="pdp-sku" style="' + (b.text_style === 'uppercase' ? 'text-transform:uppercase;letter-spacing:.06em' : '') + '">SKU: <span data-pdp-sku>' + OS.esc(selected.sku || p.sku || 'AUR-PRODUCT') + '</span></div>';
    } else if (block.kind === 'text') {
      body = '<div class="pdp-custom-text" style="' + (b.text_style === 'uppercase' ? 'text-transform:uppercase;letter-spacing:.08em;font-size:12px' : '') + '">' + (b.text || '') + '</div>';
    } else if (block.kind === 'liquid') {
      body = b.code ? '<div class="pdp-custom-text" style="font-family:ui-monospace,monospace">' + OS.esc(b.code) + '</div>' : '';
    } else if (block.kind === 'shipping') {
      const days = Math.max(1, Number(b.days || 7));
      const titleText = String(b.delivery_text == null ? 'Estimated delivery:' : b.delivery_text).trim();
      const titleHtml = titleText ? '<div class="pdp-ship-title">' + OS.esc(titleText) + '</div>' : '';
      let dateLabel = '';
      let purchasedLabel = '';
      let processingLabel = '';
      let deliveredLabel = '';
      try {
        const now = Date.now();
        const dayMs = 86400000;
        const formatDate = (ms) => {
          const date = new Date(ms);
          const timeZone = b.timezone === 'utc' ? 'UTC' : undefined;
          const parts = new Intl.DateTimeFormat('en-US', {
            month: 'short', day: '2-digit', year: 'numeric', timeZone,
          }).formatToParts(date).reduce((out, part) => { out[part.type] = part.value; return out; }, {});
          const format = String(b.date_format || '%b %d');
          return format
            .replace(/%B/g, parts.month)
            .replace(/%b/g, parts.month)
            .replace(/%d/g, parts.day)
            .replace(/%m/g, String(date.getMonth() + 1).padStart(2, '0'))
            .replace(/%Y/g, parts.year);
        };
        const atDay = (n) => formatDate(now + n * dayMs);
        const procStart = Math.max(1, Math.round(days * 0.35));
        const procEnd = Math.max(procStart + 1, Math.round(days * 0.5));
        const delStart = Math.max(procEnd + 1, days);
        const delEnd = delStart + Math.max(3, Math.round(days * 0.45));
        purchasedLabel = atDay(0);
        processingLabel = atDay(procStart) + ' - ' + atDay(procEnd);
        deliveredLabel = atDay(delStart) + ' - ' + atDay(delEnd);
        dateLabel = atDay(days);
      } catch (err) {
        dateLabel = '';
      }
      const shipLine = dateLabel
        ? (dateLabel + ' (+/- 2 days)')
        : String(b.fallback_text || '');
      const fallback = OS.esc(String(b.fallback_text || 'Delivery date unavailable'));
      if (b.layout === 'timeline' && purchasedLabel) {
        const icon = (name) => {
          const paths = {
            bag: '<path d="M29 30c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1L5 8c0-.55.45-1 1-1h20c.55 0 1 .45 1 1L29 30z"/><path d="M10 11V7c0-3.31 2.69-6 6-6s6 2.69 6 6v4"/><circle cx="10" cy="11.5" r=".5"/><circle cx="22" cy="11.5" r=".5"/>',
            truck: '<circle cx="25" cy="27" r="3"/><circle cx="8" cy="27" r="3"/><path d="M5 27H4c-1.66 0-3-1.34-3-3V8c0-1.66 1.34-3 3-3h12c1.66 0 3 1.34 3 3v19h-8"/><path d="M19 27V13h7l5 6.17V24c0 1.66-1.34 3-3 3"/><path d="M31 19H19"/>',
            pin: '<path d="M27 12c0 9.17-11 18-11 18S5 21.13 5 12C5 5.93 9.93 1 16 1s11 4.93 11 11z"/><circle cx="16" cy="12" r="5"/>',
          };
          return '<span class="pdp-ship-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">' + paths[name] + '</svg></span>';
        };
        const step = (align, iconName, date, label) =>
          '<div class="pdp-ship-step ' + align + '">' + icon(iconName) +
          '<div class="pdp-ship-meta"><span class="pdp-ship-date">' + OS.esc(date) + '</span><span class="pdp-ship-label">' + OS.esc(label) + '</span></div></div>';
        const line = '<div class="pdp-ship-line" aria-hidden="true"><i><span></span></i></div>';
        body = '<div class="pdp-ship pdp-ship--timeline" data-ship-tz="' + OS.esc(b.timezone || 'store') + '">' + titleHtml +
          '<div class="pdp-ship-track">' +
          step('is-start', 'bag', purchasedLabel, 'Purchased') + line +
          step('is-mid', 'truck', processingLabel, 'Processing') + line +
          step('is-end', 'pin', deliveredLabel, 'Delivered') +
          '</div></div>';
      } else {
        body = '<div class="pdp-ship" data-ship-tz="' + OS.esc(b.timezone || 'store') + '">' + titleHtml + '<div>' + OS.esc(shipLine || fallback) + '</div></div>';
      }
    } else if (block.kind === 'collapsible') {
      const isOpen = !!b.open;
      const iconLeft = b.icon_position === 'left';
      const headingIcon = (b.icon && b.icon !== 'none' && window.OS_THEME_ICONS) ? ('<span class="pdp-acc-ic">' + window.OS_THEME_ICONS.svg(b.icon, 16) + '</span>') : '';
      const src = b.content_dynamic_source;
      const paths = Array.isArray(src)
        ? src.map(String).filter(Boolean)
        : (typeof src === 'string' && src && src !== 'true' && src !== 'false' ? [src] : []);
      let contentHtml = resolveMetafieldChips(b.content || '', p);
      // Legacy whole-field / multi-path bind (no inline chips in content).
      if (paths.length && String(b.content || '').indexOf('data-mf-path') < 0) {
        contentHtml = paths.map((path) => {
          const v = resolveProductMetafield(p, path);
          if (!v) return '';
          return /<[a-z][\s\S]*>/i.test(v) ? v : ('<p>' + OS.esc(v) + '</p>');
        }).filter(Boolean).join('');
      }
      // Symmetry disclosure plus: two 11×1px bars; vertical arm rotates flat when open.
      const plusSvg = '<span class="pdp-acc-plus" aria-hidden="true"><i class="pdp-acc-h"></i><i class="pdp-acc-v"></i></span>';
      body = '<div class="pdp-acc' + (isOpen ? ' open' : '') + (iconLeft ? ' icon-left' : '') + '" data-pdp-acc data-accordion="' + (b.accordion_mode ? '1' : '0') + '"><button type="button" aria-expanded="' + (isOpen ? 'true' : 'false') + '"><span class="pdp-acc-title">' + headingIcon + OS.esc(b.heading || 'Details') + '</span><span class="pdp-acc-mark">' + plusSvg + '</span></button><div class="body">' + contentHtml + (b.custom_liquid ? '<pre>' + OS.esc(b.custom_liquid) + '</pre>' : '') + '</div></div>';
    } else if (block.kind === 'popup') {
      const pages = ((ctx.sample && ctx.sample.pages) || (OS.sample && OS.sample.pages) || []);
      const page = pages.find((x) => x.id === b.page);
      const pageHtml = page ? String(page.content || '').trim() : '';
      // Buyer / published preview hides empty page popups; editor keeps the link for setup.
      if (ctx.previewOnly && !pageHtml) {
        body = '';
      } else {
        const w = Number(b.popup_width == null ? 560 : b.popup_width);
        const h = Number(b.popup_height == null ? 420 : b.popup_height);
        body = '<button type="button" class="pdp-popup-link" data-pdp-popup-link data-popup-page="' + OS.esc(b.page || '') + '" data-popup-w="' + w + '" data-popup-h="' + h + '">' + OS.esc(b.label || 'Pop-up link text') + '</button>';
      }
    } else if (block.kind === 'line_property') {
      body = '<label class="pdp-property"><span class="pdp-label">' + OS.esc(b.label || 'Your label') + (b.required ? ' *' : '') + '</span><input type="' + (b.type === 'number' ? 'number' : 'text') + '" placeholder="' + OS.esc(b.placeholder || '') + '"' + (b.required ? ' required' : '') + '></label>';
    } else if (block.kind === 'actions') {
      if (b.show_share === false) {
        body = '';
      } else {
        const layout = b.layout || 'tile';
        const style = b.icon_style || 'brand';
        const platforms = Array.isArray(b.platforms) && b.platforms.length
          ? b.platforms
          : ['facebook', 'x', 'pinterest'];
        const showCopy = b.show_copy !== false;
        const icons = {
          facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
          x: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h4.2l4 5.6L16.8 4H20l-6.2 7.2L20 20h-4.2l-4.3-6L7.2 20H4l6.4-7.5L4 4z"/></svg>',
          pinterest: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.8 0-2.6l1.2-5s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-1 3.1-.3.9.4 1.7 1.3 1.7 1.6 0 2.7-2 2.7-4.4 0-1.8-1.2-3.2-3.4-3.2-2.5 0-4 1.7-4 3.6 0 .7.2 1.2.5 1.6l.1.2c-.1.3-.2.9-.2 1l-.3 1.2c0 .2-.2.3-.4.2-1.5-.6-2.2-2.3-2.2-4.2 0-3.1 2.6-6.8 7.7-6.8 4.1 0 6.8 3 6.8 6.2 0 4.2-2.3 7.3-5.8 7.3-1.2 0-2.3-.6-2.6-1.4l-.7 2.7c-.3 1-1 2.1-1.5 2.8A9 9 0 1 0 12 3z"/></svg>',
          instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zm6.2-.9a1 1 0 1 0-1 1 1 1 0 0 0 1-1z"/></svg>',
          whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.9 12.8c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.1-1.8-.1a14 14 0 0 1-6-4.3 6.8 6.8 0 0 1-1.4-3.5c0-.9.5-1.8 1.2-2 .3-.1.7-.1 1 .1l1.3 1.6c.2.2.2.5.1.8l-.4.8c-.1.2-.1.4.1.6a9.3 9.3 0 0 0 2.7 2.5c.2.1.4.1.6 0l.8-.5c.2-.1.5-.1.7.1l1.7 1.3c.3.2.4.6.2 1z"/></svg>',
          telegram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 4.5 3.8 11.2c-1.2.5-1.2 1.2-.2 1.5l4.3 1.3 1.7 5.1c.2.6.1.8.8.8.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.6 5.7c.3-1.2-.4-1.7-1.6-1.2z"/></svg>',
          email: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5H4zm0 2.2V16h16V10.2l-8 5-8-5z"/></svg>',
        };
        const labels = { facebook: 'Facebook', x: 'X', pinterest: 'Pinterest', instagram: 'Instagram', whatsapp: 'WhatsApp', telegram: 'Telegram', email: 'Email' };
        const platHtml = platforms.map((id) => '<a href="#" data-pdp-share-net="' + OS.esc(id) + '" data-net="' + OS.esc(id) + '" aria-label="' + OS.esc(labels[id] || id) + '">' + (icons[id] || '') + (layout === 'inline' ? '<span>' + OS.esc(labels[id] || id) + '</span>' : '') + '</a>').join('');
        const copyBtn = showCopy ? '<button type="button" data-pdp-share-copy aria-label="Copy link">' + (layout === 'inline' ? 'Copy' : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 7h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm2 2v9h9V9H10zM6 5h9v2H6a2 2 0 0 0-2 2v9h2V9a2 2 0 0 1 2-2z"/></svg>') + '</button>' : '';
        if (layout === 'dropdown') {
          const shareIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.4168 15.525C3.70274 14.1555 7.07852 11.25 11.8754 11.25V15L18.1254 8.75L11.8754 2.5V6.25C7.7504 6.25 2.46212 10.1914 1.8754 15.2766C1.86728 15.3424 1.88032 15.4091 1.91265 15.4671C1.94498 15.525 1.99491 15.5712 2.05522 15.5988C2.11552 15.6265 2.18307 15.6343 2.24807 15.621C2.31308 15.6077 2.37218 15.5741 2.4168 15.525Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          body = '<div class="pdp-link-actions pdp-share-dd"><button type="button" data-pdp-share>' + shareIcon + '<span>Share</span></button></div>';
        } else if (layout === 'inline') {
          body = '<div class="pdp-share-inline ' + OS.esc(style) + '" data-pdp-share-bar>' + platHtml + copyBtn + '</div>';
        } else {
          body = '<div class="pdp-share-tile ' + OS.esc(style) + '" data-pdp-share-bar>' + platHtml + copyBtn + '</div>';
        }
      }
    } else if (block.kind === 'recommendations') {
      // Priority: hand-picked products → connected collection → automatic sample fallback.
      let list = byIds(b.products);
      const src = b.products_dynamic_source;
      if (!list.length && src && src !== true && src !== false) list = byCollection(src, 12);
      if (!list.length) list = others(p, 8);
      if (b.dedupe_current !== false) list = list.filter((item) => item.id !== p.id && item.handle !== p.handle);
      if (b.exclude_soldout) list = list.filter((item) => Number(item.inventory == null ? 1 : item.inventory) > 0);
      if (!list.length && (b.empty_behavior || 'hide') === 'hide') {
        body = '';
      } else {
        const gap = 10;
        const cols = mob
          ? Math.max(1, Math.min(2, Number(b.mobile_count) || 2))
          : Math.max(2, Math.min(6, Number(b.per_row) || 2));
        // Peek the next card when there is overflow so sliding is obvious.
        const perView = list.length > cols ? (cols + 0.25) : cols;
        const cardW = 'calc((100% - ' + gap + 'px * ' + (perView - 1) + ') / ' + perView + ')';
        const cards = list.map((item) =>
          '<div class="pdp-rec-card" style="width:' + cardW + '">' +
            '<div class="im" style="background-image:url(' + OS.esc(item.image) + ')"></div>' +
            '<b>' + OS.esc(item.title) + '</b><div>' + OS.money(item.price) + '</div>' +
          '</div>'
        ).join('');
        const sub = String(b.subheading || '').trim();
        const head = String(b.heading || '').trim();
        const copy = String(b.content || '').trim();
        const headHtml = (sub || head || copy)
          ? '<div class="pdp-rec-head">' +
              (sub ? '<div class="pdp-rec-sub">' + OS.esc(sub) + '</div>' : '') +
              (head ? '<h3 class="pdp-rec-h">' + OS.esc(head) + '</h3>' : '') +
              (copy ? '<div class="pdp-rec-copy">' + copy + '</div>' : '') +
            '</div>'
          : '';
        const rail = '<div class="pdp-rec-row" data-pdp-rec style="gap:' + gap + 'px">' + cards + '</div>';
        // Side arrows only when cards overflow one viewport (peek / slide).
        if (list.length > cols) {
          const chev = (d) => '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' +
            (d < 0 ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5') +
            '" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          body = headHtml +
            '<div class="pdp-rec-wrap" data-pdp-rec-wrap>' +
              '<button type="button" class="pdp-rec-nav prev" data-pdp-rec-nav="-1" aria-label="Previous" disabled>' + chev(-1) + '</button>' +
              rail +
              '<button type="button" class="pdp-rec-nav next" data-pdp-rec-nav="1" aria-label="Next">' + chev(1) + '</button>' +
            '</div>';
        } else {
          body = headHtml + rail;
        }
      }
    } else if (block.kind === 'video_column') {
      const list = (Array.isArray(b.videos) ? b.videos : []).filter((v) => v && v.cover_image);
      if (!list.length) {
        body = '';
      } else {
        const gap = Math.max(4, Math.min(24, Number(b.gap) || 10));
        const rad = Math.max(0, Math.min(24, Number(b.corner_radius) || 12));
        const headColor = OS.col(b.heading_color, c.heading_color || '#1a1a1a');
        const borderRaw = b.video_border;
        const borderColor = (borderRaw && borderRaw !== 'transparent') ? borderRaw : '';
        const borderCss = borderColor ? 'border:1px solid ' + OS.esc(borderColor) + ';' : 'border:0;';
        const cols = mob
          ? Math.max(1, Math.min(2, Number(b.mobile_count) || 2))
          : Math.max(2, Math.min(6, Number(b.per_row) || 4));
        const perView = list.length > cols ? (cols + 0.2) : cols;
        const cardW = 'calc((100% - ' + gap + 'px * ' + (perView - 1) + ') / ' + perView + ')';
        const playBtn = b.show_play_button !== false
          ? '<span class="pdp-vc-play" aria-hidden="true">' + OS.icon('play') + '</span>'
          : '';
        const cards = list.map((v) => {
          const label = String(v.accessible_label || '').trim() || 'Play video';
          return '<div class="pdp-vc-card" style="width:' + cardW + '">' +
            '<button type="button" class="pdp-vc-media" data-pdp-vc-open data-cover="' + OS.esc(v.cover_image || '') + '" data-video="' + OS.esc(v.video_url || '') + '" aria-label="' + OS.esc(label) + '" style="border-radius:' + rad + 'px;' + borderCss + '">' +
              '<img src="' + OS.esc(v.cover_image) + '" alt="' + OS.esc(label) + '" loading="lazy">' +
              playBtn +
            '</button>' +
          '</div>';
        }).join('');
        const head = String(b.heading || '').trim();
        const headHtml = head
          ? '<div class="pdp-vc-head"><h3 class="pdp-vc-h" style="color:' + OS.esc(headColor) + '">' + OS.esc(head) + '</h3></div>'
          : '';
        const rail = '<div class="pdp-vc-rail" data-pdp-vc style="gap:' + gap + 'px">' + cards + '</div>';
        if (list.length > cols) {
          const chev = (d) => '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' +
            (d < 0 ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5') +
            '" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          body = '<div class="pdp-vc">' + headHtml +
            '<div class="pdp-vc-wrap" data-pdp-vc-wrap>' +
              '<button type="button" class="pdp-vc-nav prev" data-pdp-vc-nav="-1" aria-label="Previous" disabled>' + chev(-1) + '</button>' +
              rail +
              '<button type="button" class="pdp-vc-nav next" data-pdp-vc-nav="1" aria-label="Next">' + chev(1) + '</button>' +
            '</div></div>';
        } else {
          body = '<div class="pdp-vc">' + headHtml + rail + '</div>';
        }
      }
    }
    if (block.kind === 'featured_reviews') {
      const layout = b.layout || 'nav';
      const list = OS.resolveFeaturedReviewItems(b, p);
      const cols = Math.max(1, Math.min(3, Number(b.cards_per_row || 1)));
      const carousel = b.scroll !== false && list.length > 1;
      let navMode = b.nav_style || 'auto';
      if (navMode === 'auto') navMode = (layout === 'nav') ? 'arrows' : 'dots';
      if (!carousel) navMode = 'none';
      const starColor = (b.star_color && b.star_color !== 'transparent') ? b.star_color : '#16a34a';
      const avRound = b.round_avatar !== false;
      const showVerified = b.show_verified !== false;
      // Trust chip / subtitle: empty or missing settings hide the block (no silent default fill).
      // Schema defaults still seed new blocks via matBlock; clearing the input stores ''.
      const verifiedLabel = String(b.verified_text || '').trim();
      const verifiedSub = String(b.verified_subtext || '').trim();
      const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
      const shieldSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5z"/><path fill="#fff" d="m10.2 12.8-2-2-1.1 1.1 3.1 3.1 5.2-5.2-1.1-1.1z"/></svg>';
      const starsHtml = (n, boxed) => '<span class="pdp-fr-stars' + (boxed ? ' boxed' : '') + '" style="color:' + OS.esc(starColor) + '">' +
        '★'.repeat(Math.max(1, Math.min(5, Number(n) || 5))) + '</span>';
      // Avatar never reuses review image — those are separate slots on image layouts.
      const avHtml = (r) => {
        if (b.show_avatar === false) return '';
        const src = r.avatar || '';
        const cls = 'pdp-fr-av' + (avRound ? ' round' : '') + (src ? '' : ' is-empty');
        return src
          ? '<img class="' + cls + '" alt="" src="' + OS.esc(src) + '">'
          : '<span class="' + cls + '" aria-hidden="true"></span>';
      };
      const checkHtml = (showVerified
        ? '<span class="pdp-fr-check"' + (verifiedLabel ? ' title="' + OS.esc(verifiedLabel) + '"' : '') + '>' + checkSvg + '</span>'
        : '');
      const layoutSupportsImage = layout === 'media' || layout === 'nav' || layout === 'trust';
      const cards = list.map((r, i) => {
        const img = (layoutSupportsImage && b.show_image !== false && r.image) ? r.image : '';
        const payload = {
          author: r.author || '',
          rating: Number(r.rating) || 5,
          text: r.text || '',
          image: r.image || '',
          images: Array.isArray(r.images) ? r.images.filter(Boolean) : (r.image ? [r.image] : []),
          avatar: r.avatar || '',
          item_type: r.item_type || '',
          star_color: starColor,
          show_verified: showVerified,
          verified_text: verifiedLabel || 'Verified',
        };
        let inner = '';
        if (layout === 'media') {
          // Text + small avatar/name | side review image (image is the signature).
          inner =
            '<div class="pdp-fr-body">' +
              '<div class="pdp-fr-text">' + OS.esc(r.text) + '</div>' +
              '<div class="pdp-fr-person">' + avHtml(r) +
                '<div><div class="pdp-fr-meta" style="margin:0"><b>' + OS.esc(r.author) + '</b></div>' + starsHtml(r.rating, false) + '</div>' +
              '</div>' +
            '</div>' +
            (img ? '<img class="pdp-fr-side" alt="" src="' + OS.esc(img) + '">' : '');
        } else if (layout === 'quote') {
          // No review image — stacked stars then author check.
          inner =
            avHtml(r) +
            '<div class="pdp-fr-body">' +
              '<div class="pdp-fr-text italic">' + OS.esc(r.text) + '</div>' +
              starsHtml(r.rating, false) +
              '<div class="pdp-fr-author" style="margin-top:8px">— ' + OS.esc(r.author) + checkHtml + '</div>' +
            '</div>';
        } else if (layout === 'trust') {
          const verifiedChip = (showVerified && verifiedLabel)
            ? '<span class="pdp-fr-verified">' + shieldSvg + OS.esc(verifiedLabel) + '</span>'
            : '';
          const verifiedSubHtml = (showVerified && verifiedSub)
            ? '<div class="pdp-fr-sub">' + OS.esc(verifiedSub) + '</div>'
            : '';
          // No stars — shield verified + optional side image.
          inner =
            avHtml(r) +
            '<div class="pdp-fr-body">' +
              '<div class="pdp-fr-text italic">' + OS.esc(r.text) + '</div>' +
              '<div class="pdp-fr-foot">' +
                '<div class="pdp-fr-author">— ' + OS.esc(r.author) + verifiedChip + '</div>' +
                verifiedSubHtml +
              '</div>' +
            '</div>' +
            (img ? '<img class="pdp-fr-side" alt="" src="' + OS.esc(img) + '">' : '');
        } else if (layout === 'split') {
          // No review image — avatar | divider | stars — author ✓ on one row.
          inner =
            avHtml(r) +
            '<div class="pdp-fr-body">' +
              '<div class="pdp-fr-text italic">' + OS.esc(r.text) + '</div>' +
              '<div class="pdp-fr-row">' +
                starsHtml(r.rating, false) +
                '<span class="pdp-fr-author">— ' + OS.esc(r.author) + '</span>' +
                checkHtml +
              '</div>' +
            '</div>';
        } else {
          // nav — name-first + boxed stars; optional image under the copy.
          inner =
            avHtml(r) +
            '<div class="pdp-fr-body">' +
              '<div class="pdp-fr-meta"><b>' + OS.esc(r.author) + '</b>' + starsHtml(r.rating, true) + '</div>' +
              '<div class="pdp-fr-text">' + OS.esc(r.text) + '</div>' +
              (img ? '<img class="pdp-fr-img" alt="" src="' + OS.esc(img) + '">' : '') +
            '</div>';
        }
        return '<div class="pdp-fr-card layout-' + OS.esc(layout) + '" data-fr-idx="' + i + '" data-fr-review="' + OS.esc(JSON.stringify(payload)) + '" role="button" tabindex="0">' + inner + '</div>';
      }).join('');
      const arrows = navMode === 'arrows'
        ? '<button type="button" class="pdp-fr-nav prev" data-pdp-fr-prev aria-label="Previous">‹</button><button type="button" class="pdp-fr-nav next" data-pdp-fr-next aria-label="Next">›</button>'
        : '';
      const dots = navMode === 'dots'
        ? '<div class="pdp-fr-dots" data-pdp-fr-dots>' + list.map((_, i) =>
            '<button type="button" class="pdp-fr-dot' + (i === 0 ? ' on' : '') + '" data-pdp-fr-dot="' + i + '" aria-label="Review ' + (i + 1) + '"></button>'
          ).join('') + '</div>'
        : '';
      const railClass = carousel ? 'is-carousel' : 'is-stack';
      const railStyle = (!carousel && cols > 1)
        ? 'style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))"'
        : '';
      const content = list.length
        ? ('<div class="pdp-fr-rail ' + railClass + '" ' + railStyle + '>' + cards + '</div>' + arrows + dots)
        : ('<div style="opacity:.55;font-size:13px;padding:8px 0">' +
            (b.data_source === 'auto' ? 'No reviews to pull yet.' : 'Add a review in the block settings.') +
          '</div>');
      body = '<div class="pdp-fr' + (navMode === 'arrows' ? ' has-arrows' : '') + '" data-pdp-fr data-autoplay="' + (b.auto_play && carousel ? '1' : '0') + '" data-carousel="' + (carousel ? '1' : '0') + '">' +
        (b.heading ? '<div class="pdp-fr-h">' + OS.esc(b.heading) + '</div>' : '') +
        content + '</div>';
    }
    if (block.kind === 'sticky') body = '';
    if (!body) return '';
    if (bare) return body;
    return '<div class="pdp-row pdp-kind-' + OS.esc(block.kind) + '" data-block-id="' + OS.esc(block.id) + '">' + body + '</div>';
  }

  function thumbButton(item, i) {
    const poster = item.poster || item.src || '';
    const isVideo = item.type === 'video';
    return '<button type="button" class="pdp-thumb' + (i === 0 ? ' on' : '') + (isVideo ? ' is-video' : '') + '" data-pdp-thumb="' + i + '" data-src="' + OS.esc(poster) + '" data-video="' + OS.esc(item.video || '') + '" style="background-image:url(' + OS.esc(poster) + ')">' +
      (isVideo ? '<span class="pdp-thumb-play" aria-hidden="true">▶</span>' : '') +
      '</button>';
  }
  function collageHtml(items, s, t, ratio, mode) {
    const n = items.length;
    if (!n) return '<div class="pdp-media pdp-collage"></div>';
    const full = (item, i) => '<div class="pdp-collage-row full">' + cell(item, i, s, t, ratio) + '</div>';
    const pair = (a, ai, b, bi) => {
      let html = '<div class="pdp-collage-row pair">' + cell(a, ai, s, t, ratio);
      if (b) html += cell(b, bi, s, t, ratio);
      return html + '</div>';
    };
    const rows = [];
    if (mode === 'collage-1') {
      // First + last full width; everything between is 2-column pairs.
      rows.push(full(items[0], 0));
      if (n === 1) return '<div class="pdp-media pdp-collage">' + rows.join('') + '</div>';
      if (n === 2) {
        rows.push(full(items[1], 1));
        return '<div class="pdp-media pdp-collage">' + rows.join('') + '</div>';
      }
      let i = 1;
      const last = n - 1;
      while (i < last) {
        if (i + 1 < last) {
          rows.push(pair(items[i], i, items[i + 1], i + 1));
          i += 2;
        } else {
          rows.push(pair(items[i], i, null, -1));
          i += 1;
        }
      }
      rows.push(full(items[last], last));
    } else {
      // Alternate one full-width image with a 2-column pair until media runs out.
      let i = 0;
      while (i < n) {
        rows.push(full(items[i], i));
        i += 1;
        if (i >= n) break;
        if (i + 1 < n) {
          rows.push(pair(items[i], i, items[i + 1], i + 1));
          i += 2;
        } else {
          rows.push(pair(items[i], i, null, -1));
          i += 1;
        }
      }
    }
    return '<div class="pdp-media pdp-collage">' + rows.join('') + '</div>';
  }
  function mediaHtml(items, s, t, mob) {
    // Chantilly / swim media is 2:3 (1200x1800). 3:4 + cover crops the bottom.
    const ratio = 'aspect-ratio:2/3;';
    const layout = s.desktop_media_layout || 'thumbs-bottom';
    if (mob) {
      return '<div class="pdp-media">' +
        stage(cell(items[0], 0, s, t, ratio), items.length) +
        (s.mobile_thumbnails !== false
          ? '<div class="pdp-thumbs" style="margin-top:9px;overflow:auto">' + items.map((item, i) => thumbButton(item, i)).join('') + '</div>'
          : '<div class="pdp-dots">' + items.map((item, i) => '<button type="button" class="pdp-dot' + (i === 0 ? ' on' : '') + '" data-pdp-dot="' + i + '" data-src="' + OS.esc(item.poster || item.src || '') + '"></button>').join('') + '</div>') + '</div>';
    }
    if (layout === 'grid-1') return '<div class="pdp-media pdp-grid-1">' + items.map((item, i) => cell(item, i, s, t, ratio)).join('') + '</div>';
    if (layout === 'grid-2') return '<div class="pdp-media pdp-grid-2">' + items.map((item, i) => cell(item, i, s, t, ratio)).join('') + '</div>';
    if (layout === 'grid-highlight') return '<div class="pdp-media pdp-highlight">' + items.map((item, i) => cell(item, i, s, t, i === 0 ? '' : ratio)).join('') + '</div>';
    if (layout === 'collage-1' || layout === 'collage-2') return collageHtml(items, s, t, ratio, layout);
    const left = layout === 'thumbs-left';
    const main = stage(cell(items[0], 0, s, t, ratio + (left ? 'min-height:460px;' : '')), items.length);
    const thumbs = '<div class="pdp-thumbs">' + items.map((item, i) => thumbButton(item, i)).join('') + '</div>';
    return '<div class="pdp-media pdp-carousel' + (left ? ' left' : '') + '">' + (left ? thumbs + main : main + thumbs) + '</div>';
  }

  function stickyHtml(block, p, t, buyBlock) {
    if (!block || block.hidden) return '';
    const b = block.settings || {};
    const buy = (buyBlock && buyBlock.settings) || {};
    const appear = b.appear_at === 'top' ? ' always' : ' after-scroll';
    const mobHide = b.mobile_visible === false ? ' hide-mob' : '';
    // Match Buy buttons ATC: Theme › Buttons height/type + Buy block paint/radius/icon.
    const atcShape = buy.atc_shape || buy.button_shape || 'pill';
    const atcRadius = buyButtonRadius(atcShape, buy.atc_custom_radius != null ? buy.atc_custom_radius : buy.custom_radius, themeButtonRadius(t));
    const atcBg = buy.atc_background || '#FFC439';
    const atcFg = buy.atc_text_color || '#FFFFFF';
    const atcIcon = buy.atc_icon == null ? 'bag-plus' : buy.atc_icon;
    const label = b.button_text || 'Add to cart';
    const btnH = themeButtonHeight(t);
    const atcStyle = OS.btnStyle(t) + ';border-radius:' + atcRadius + 'px;background:' + atcBg + ';color:' + atcFg + ';border:0';
    const widthMode = b.width_mode === 'full' ? ' is-full-width' : '';
    const desktopButtonWidth = Math.max(240, Number(b.desktop_button_width) || 320);
    const qtyWidth = b.show_quantity !== false ? 125 : 0;
    const stickyStyle = '--pdp-sticky-button-width:' + desktopButtonWidth + 'px;--pdp-sticky-qty-width:' + qtyWidth + 'px;--pdp-btn-h:' + btnH + 'px;--pdp-atc-radius:' + atcRadius + 'px';
    return '<div class="pdp-sticky bottom' + appear + mobHide + widthMode + '" data-block-id="' + OS.esc(block.id) + '" data-pdp-sticky data-pdp-width-mode="' + OS.esc(b.width_mode || 'container') + '" style="' + stickyStyle + '">' +
      (b.show_image !== false ? '<img alt="" src="' + OS.esc(p.image) + '">' : '') +
      '<div class="meta">' + (b.show_title !== false ? '<b>' + OS.esc(p.title) + '</b>' : '') + (b.show_price !== false ? '<span data-pdp-sticky-price>' + OS.money(p.price) + '</span>' : '') + '</div>' +
      (b.show_quantity !== false ? '<div class="pdp-qty sticky-qty"><button type="button" data-pdp-q="-">-</button><span data-pdp-qty>1</span><button type="button" data-pdp-q="+">+</button></div>' : '') +
      '<button type="button" class="pdp-atc" data-pdp-atc data-atc-icon="' + OS.esc(atcIcon) + '" style="' + atcStyle + '">' + atcButtonInner(atcIcon, label) + '</button></div>';
  }

  function popupHtml(s, p, t) {
    return '<div class="pdp-zoom" data-pdp-zoom role="dialog" aria-modal="true" aria-label="Product images"><img alt="" data-pdp-zoom-img><div class="pdp-zoom-controls"><button type="button" data-zoom-step="-1" aria-label="Previous enlarged image">&#8249;</button><button type="button" data-zoom-close aria-label="Close enlarged image">&#215;</button><button type="button" data-zoom-step="1" aria-label="Next enlarged image">&#8250;</button></div></div>' +
      '<div class="pdp-page-pop" data-pdp-page-pop role="dialog" aria-modal="true">' +
        '<div class="pdp-page-pop-card">' +
          '<button type="button" class="pdp-page-pop-x" data-pdp-page-pop-close aria-label="Close">×</button>' +
          '<div class="pdp-page-pop-body is-empty" data-pdp-page-pop-body></div>' +
        '</div>' +
      '</div>' +
      '<div class="pdp-fr-pop" data-pdp-fr-pop role="dialog" aria-modal="true" aria-label="Review">' +
        '<div class="pdp-fr-pop-card" data-pdp-fr-pop-card>' +
          '<div class="pdp-fr-pop-media" data-pdp-fr-pop-media>' +
            '<div class="pdp-fr-pop-stage" data-pdp-fr-pop-stage></div>' +
            '<button type="button" class="pdp-fr-pop-x" data-pdp-fr-pop-close aria-label="Close">×</button>' +
            '<button type="button" class="pdp-fr-pop-nav prev" data-pdp-fr-pop-prev aria-label="Previous image">‹</button>' +
            '<button type="button" class="pdp-fr-pop-nav next" data-pdp-fr-pop-next aria-label="Next image">›</button>' +
            '<div class="pdp-fr-pop-thumbs" data-pdp-fr-pop-thumbs></div>' +
          '</div>' +
          '<div class="pdp-fr-pop-body" data-pdp-fr-pop-body></div>' +
          '<button type="button" class="pdp-fr-pop-x-alt" data-pdp-fr-pop-close aria-label="Close">×</button>' +
        '</div>' +
      '</div>' +
      '<div class="pdp-pop" data-pdp-share-pop><div class="pdp-pop-card" data-pdp-share-card>' +
        '<div class="pdp-pop-head"><strong>Share this product</strong><button type="button" class="pdp-share-x" data-pdp-share-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M18.75 5.13496L5.25 18.8544" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.75 18.8544L5.25 5.13496" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>' +
        '<div class="pdp-share-row"><input data-pdp-share-url readonly value=""><button type="button" data-pdp-share-copy>Copy</button></div>' +
        '<div class="pdp-share-socials">' +
          '<a href="#" data-pdp-share-net="facebook" target="_blank" rel="noopener" aria-label="Share on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 12.4972C4 16.6986 7.06844 20.1919 11.081 20.9L11.1284 20.8621C11.1126 20.8591 11.0968 20.856 11.081 20.8528V14.8575H8.9567V12.4972H11.081V10.6089C11.081 8.48464 12.45 7.30447 14.3855 7.30447C14.9992 7.30447 15.6601 7.39888 16.2737 7.4933V9.6648H15.188C14.1494 9.6648 13.9134 10.1841 13.9134 10.845V12.4972H16.1793L15.8017 14.8575H13.9134V20.8528C13.8976 20.856 13.8818 20.8591 13.866 20.8621L13.9134 20.9C17.926 20.1919 20.9944 16.6986 20.9944 12.4972C20.9944 7.82374 17.1707 4 12.4972 4C7.82374 4 4 7.82374 4 12.4972Z" fill="currentColor"/></svg></a>' +
          '<a href="#" data-pdp-share-net="x" target="_blank" rel="noopener" aria-label="Share on X"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.04221 4L9.72655 12.9408L3 20.21H4.51388L10.403 13.8457L15.1612 20.21H20.313L13.2525 10.7663L19.5135 4H17.9997L12.5761 9.86141L8.19399 4H3.04221ZM5.26848 5.11552H7.63522L18.0863 19.0943H15.7196L5.26848 5.11552Z" fill="currentColor"/></svg></a>' +
          '<a href="#" data-pdp-share-net="pinterest" target="_blank" rel="noopener" aria-label="Pin on Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.6611 3.07934C10.6273 2.79957 8.56095 3.26511 6.84363 4.38998C5.12631 5.51485 3.87398 7.22309 3.31788 9.19927C2.76179 11.1754 2.93948 13.2861 3.81815 15.1415C4.69683 16.9969 6.21713 18.4717 8.09835 19.2936C8.04748 18.6406 8.09417 17.9838 8.2369 17.3446C8.39415 16.6315 9.33848 12.7011 9.33848 12.7011C9.15043 12.2796 9.05646 11.8222 9.06308 11.3607C9.06308 10.0985 9.79152 9.15671 10.6976 9.15671C10.8604 9.15434 11.0218 9.18705 11.1708 9.25261C11.3198 9.31818 11.4529 9.41506 11.5611 9.53667C11.6694 9.65828 11.7501 9.80177 11.7979 9.95739C11.8458 10.113 11.8595 10.2771 11.8383 10.4385C11.8383 11.2035 11.347 12.3611 11.0903 13.4474C11.0396 13.6466 11.0363 13.855 11.0809 14.0557C11.1254 14.2564 11.2165 14.4438 11.3468 14.6028C11.477 14.7619 11.6428 14.8881 11.8308 14.9713C12.0188 15.0545 12.2237 15.0924 12.429 15.0819C14.0423 15.0819 15.1235 13.0156 15.1235 10.5762C15.1235 8.70622 13.885 7.30545 11.602 7.30545C11.0558 7.28423 10.5109 7.37423 10.0006 7.57001C9.49018 7.76579 9.02493 8.06325 8.63303 8.44433C8.24114 8.82542 7.93078 9.28217 7.72081 9.78687C7.51084 10.2916 7.40563 10.8337 7.41157 11.3803C7.38723 11.9866 7.58284 12.5813 7.96235 13.0547C8.03327 13.1077 8.08505 13.1822 8.10989 13.2672C8.13473 13.3521 8.13127 13.4428 8.10005 13.5256C8.06095 13.682 7.96235 14.0552 7.92326 14.192C7.91512 14.2384 7.8962 14.2823 7.86803 14.32C7.83985 14.3578 7.80319 14.3884 7.76102 14.4094C7.71885 14.4304 7.67233 14.4412 7.62521 14.441C7.5781 14.4407 7.5317 14.4294 7.48976 14.4079C6.31339 13.937 5.7592 12.6425 5.7592 11.1644C5.7592 8.74447 7.78556 5.84773 11.84 5.84773C15.0665 5.84773 17.2119 8.20813 17.2119 10.7326C17.2119 14.0552 15.3614 16.5533 12.6271 16.5533C12.2184 16.5663 11.813 16.4761 11.4484 16.291C11.0838 16.1059 10.7718 15.8318 10.5412 15.4942C10.5412 15.4942 10.0499 17.4627 9.95301 17.835C9.75521 18.4782 9.46334 19.0886 9.08688 19.6463C9.87141 19.8843 10.6865 20.0033 11.5059 19.9999C12.6224 20.0008 13.7282 19.7815 14.7598 19.3544C15.7914 18.9274 16.7287 18.3011 17.5179 17.5113C18.3071 16.7215 18.9328 15.7838 19.3591 14.7519C19.7854 13.72 20.004 12.6141 20.0023 11.4976C20.0013 9.44485 19.2576 7.46184 17.9085 5.91469C16.5595 4.36754 14.6962 3.36074 12.6628 3.08019L12.6611 3.07934Z" fill="currentColor"/></svg></a>' +
        '</div></div></div>';
  }

  OS.register('product-main', {
    name: 'Product information', group: 'product-page', icon: 'cart', singleton: true, required: true, pages: ['product'],
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { sub: 'Media' },
      { tip: 'Learn more about media types.', tipLink: { text: 'media types', href: 'https://help.shopify.com/manual/online-store/themes/theme-structure/theme-settings#media' } },
      { key: 'desktop_media_size', control: 'select', inline: true, label: 'Desktop media width', default: 'medium', options: [
        { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' },
      ], info: 'Media is automatically optimized for mobile.' },
      { key: 'desktop_media_layout', control: 'select', inline: true, label: 'Desktop layout', default: 'thumbs-bottom', options: LAYOUTS },
      { key: 'mobile_thumbnails', control: 'toggle', label: 'Show mobile thumbnails', default: true },
      { key: 'enable_zoom', control: 'toggle', label: 'Enable image zoom', default: true },
      { sub: 'Section padding' },
      { key: 'padding_top', control: 'range', inline: true, label: 'Top padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_bottom', control: 'range', inline: true, label: 'Bottom padding', min: 0, max: 100, step: 1, unit: 'px', default: 100 },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.pdpx { }', info: 'Applies to this section on this page only.' },
    ],
    blocks: { kinds: BLOCKS, max: 24 },
    defaultBlocks: () => ([
      ['badges', { custom_tag_style: 'filled', hot_badge_bg: '', hot_badge_text_color: '#ffffff', new_badge_bg: '#FFC439', new_badge_text_color: '#ffffff', badge_icon: 'none', badge_icon_image: '', show_sold_out: false, show_saving: false, saving_type: 'percentage', saving_style: 'filled', saving_position: 'right', saving_label: '', saving_bg: '', saving_text_color: '#ffffff', saving_icon: false, badge_position: 'left', badge_gap: 8 }],
      ['title', { title_size: 30, description: '', description_color: '#000000', description_size: 14, description_top: 0, description_bottom: 0 }],
      ['price', { size: 24, show_taxes: false, show_saving: true, saving_type: 'percentage', saving_style: 'filled', saving_position: 'right', saving_label: '', saving_bg: '', saving_text_color: '#ffffff', saving_icon: false }],
      ['rating', { layout: 'default', star_style: 'boxed', style: 'stars-rating-custom', custom_text: 'Trusted by 2000+', underline_text: false, review_label: 'reviews', size: 14, color: '#0f3636', text_color: '' }],
      ['inventory', { show_status: true, show_count: true, custom_text: '', low_stock_threshold: 5, low_stock_text: 'Low stock - {n} items left', sold_out_text: 'Sold out', status_style: 'dot', in_stock_color: '#10a443', status_color: '#f59e0b', font_size: 14 }],
      ['variant', { hide_sold_out: false, picker_type: 'buttons', swatch_style: 'color', shape: 'normal', nested_dropdown: false, show_group_title: true, sku_display_name: '', show_sku_in_option: false }],
      ['buy', { show_quantity: true, show_add: true, atc_layout: 'with-quantity', atc_icon: 'bag-plus', atc_background: '#FFC439', atc_text_color: '#FFFFFF', atc_shape: 'pill', atc_custom_radius: 8, show_dynamic: true, channels: ['buy_now', 'paypal'], buy_now_text: 'Buy now', buy_now_background: '#000000', buy_now_text_color: '#FFFFFF', dyn_shape: 'pill', dyn_custom_radius: 8, show_payment_options: true, channel_logo: true, show_safe_checkout: true, safe_checkout_align: 'center', safe_checkout_label: 'GUARANTEED SAFE CHECKOUT', trust_logos: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay'], trust_logo_size: 24 }],
      ['icon_text', { layout: 'horizontal', item_layout: 'icon-left', alignment: 'left', font: 'body', size: 15, icon_size: 20, item_gap: 24, icon_text_gap: 8, background: false, background_color: '#f6f6f6', corner_radius: 10, text_color: '', icon_color: '', card_style: 'none', icon_1: 'box', image_1: '', first_heading: 'Orders over $50 ship free', first_content: '', icon_2: 'return', image_2: '', second_heading: '30 day returns', second_content: '', icon_3: 'star', image_3: '', third_heading: '', third_content: '' }],
      ['collapsible', { heading: 'Overview', icon: 'none', content: 'A clinically proven, non-sticky, vegan lip treatment that delivers the intense hydration of a lip mask with a sweet sheer tint using food-grade, non-artificial flavor. Designed for sensitive, irritated lips, this cushiony treatment delivers instant comfort to rescue dry, chapped lips.', custom_liquid: '', open: false }],
      ['collapsible', { heading: 'How to use', icon: 'none', content: 'Apply generously to lips for hydration and comfort. Use at night for an overnight mask.', custom_liquid: '', open: false }],
      ['collapsible', { heading: 'Ingredients', icon: 'none', content: '<ul><li>Dulce De Leche</li><li>Ube vanilla</li><li>Watermelon kiwi</li><li>Blood orange vanilla</li></ul>', custom_liquid: '', open: false }],
      ['featured_reviews', {
        heading: 'What Our Customers Are Saying', layout: 'nav', data_source: 'manual', auto_count: 3,
        reviews: [OS.defaultFeaturedReviewItem()],
        show_image: true, show_avatar: true, round_avatar: false, star_color: '#16a34a',
        show_verified: true, verified_text: 'Verified Customer', verified_subtext: 'Real customer · Verified order · Real buyer',
        scroll: true, nav_style: 'auto', auto_play: false, cards_per_row: 1,
      }],
      ['actions', { show_share: true, layout: 'tile', icon_style: 'brand', platforms: ['facebook', 'x', 'pinterest'], show_copy: true }],
      ['sticky', { show_image: true, show_title: true, show_price: true, show_quantity: true, appear_at: 'scroll', mobile_visible: true, button_text: 'Add to cart' }],
    ]).map((pair) => ({ kind: pair[0], hidden: false, settings: pair[1] })),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens || {};
      const mob = !!ctx.mob;
      const p = productOf(ctx);
      const resolved = resolveSelectedVariant(p);
      const selected = resolved.variant || p;
      const c = t.colors || {};
      const text = c.text_color || '#1a1a1a';
      const bg = 'transparent';
      // Shopify Horizon page-width gutter — shared with header/footer via OS.pageGutter.
      const padX = OS.pageGutter(t, mob, { fullWidth: !!s.full_width });
      const mediaSize = s.desktop_media_size || 'medium';
      const size = mob ? 100 : ({ small: 45, medium: 55, large: 65 }[mediaSize] || 55);
      const items = slides(p);
      const visible = (blocks || []).filter((b) => !b.hidden);
      const customCss = s.custom_css ? '<style>' + String(s.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      const padTop = Math.max(0, Math.min(100, s.padding_top == null ? 0 : Number(s.padding_top)));
      const padBot = Math.max(0, Math.min(100, s.padding_bottom == null ? 100 : Number(s.padding_bottom)));
      const selInv = selected.inventory == null ? (p.inventory == null ? 99 : p.inventory) : selected.inventory;
      // Shell always carries a default SKU so ATC works even when Variant block is hidden / empty.
      const shellData = '<span hidden data-pdp-variant-data data-pdp-shell-data>' +
        '<i data-pdp-variant data-id="' + OS.esc(selected.id || p.id || p.handle || 'default') + '" data-color="' + OS.esc(selected.color || '') + '" data-size="' + OS.esc(selected.size || '') + '" data-price="' + Number(selected.price == null ? p.price : selected.price) + '" data-compare="' + Number(selected.compareAt == null ? p.compareAt || 0 : selected.compareAt) + '" data-inventory="' + Number(selInv) + '" data-preorder="' + (selected.preorder || p.preorder ? '1' : '0') + '" data-available="' + (selected.available === false ? '0' : '1') + '" data-image="' + OS.esc(selected.image || p.image || '') + '" data-sku="' + OS.esc(selected.sku || p.sku || '') + '"></i></span>';
      const sizeStyle = s.size_style === 'outline' ? 'outline' : '';
      const swatchStyle = s.swatch_ring ? 'ring' : '';
      return '<div class="pdpx' + (mob ? ' mob' : '') + '" data-media-size="' + OS.esc(mediaSize) + '"' +
        (sizeStyle ? ' data-pdp-size-style="' + OS.esc(sizeStyle) + '"' : '') +
        (swatchStyle ? ' data-pdp-swatch-style="' + OS.esc(swatchStyle) + '"' : '') +
        ' data-pdp-handle="' + OS.esc(p.handle || p.id || '') + '" data-pdp-url-state="' + OS.esc(resolved.urlState) + '" data-pdp-variant="' + OS.esc(selected.id || p.id || '') + '" data-pdp-price="' + Number(selected.price == null ? p.price : selected.price) + '" data-pdp-image="' + OS.esc(selected.image || p.image || '') + '" data-pdp-inventory="' + Number(selInv) + '" style="color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padTop + 'px ' + padX + ' ' + padBot + 'px">' +
        '<div style="max-width:100%;width:100%;margin:0 auto">' +
        '<div class="pdp-grid" style="grid-template-columns:' + size + '% minmax(0,1fr)">' +
          mediaHtml(items, s, t, mob) +
          '<div class="pdp-buy" style="background:' + bg + ';color:' + text + ';padding:' + (bg && bg !== 'transparent' ? '16px' : '0') + '">' +
            (function () {
              const rows = visible.filter((b) => b.kind !== 'sticky');
              const out = [];
              for (let i = 0; i < rows.length; i++) {
                const b = rows[i];
                const next = rows[i + 1];
                // Size guide pop-up sits on the Size label row (Symmetry).
                if (b.kind === 'variant' && next && next.kind === 'popup') {
                  const guideHtml = rowHtml(next, p, s, t, ctx, selected, true);
                  const merged = Object.assign({}, b, { settings: Object.assign({}, b.settings || {}, { _size_guide_html: guideHtml }) });
                  out.push(rowHtml(merged, p, s, t, ctx, selected));
                  i++;
                  continue;
                }
                out.push(rowHtml(b, p, s, t, ctx, selected));
              }
              return out.join('');
            })() +
          '</div></div></div>' +
          stickyHtml(visible.find((b) => b.kind === 'sticky'), p, t, visible.find((b) => b.kind === 'buy')) +
          shellData + popupHtml(s, p, t) + customCss + '</div>';
    },
    hydrate: function (root, settings) {
      const zoom = root.querySelector('[data-pdp-zoom]');
      let slideBusy = false;
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function currentIndex() {
        const on = root.querySelector('[data-pdp-thumb].on,[data-pdp-dot].on');
        return on ? Number(on.getAttribute('data-pdp-thumb') || on.getAttribute('data-pdp-dot')) : 0;
      }
      function heroCell() {
        return root.querySelector('.pdp-stage > .pdp-cell, .pdp-carousel > .pdp-cell, .pdp-media > .pdp-cell');
      }
      function setHeroMedia(hero, poster, videoUrl) {
        if (!hero) return;
        const existingVideo = hero.querySelector('video');
        const existingImg = hero.querySelector('img');
        if (videoUrl) {
          hero.classList.add('is-video', 'is-playing');
          hero.classList.remove('zoomable');
          hero.setAttribute('data-src', poster || '');
          hero.setAttribute('data-video', videoUrl);
          if (existingImg) existingImg.remove();
          let video = existingVideo;
          if (!video) {
            video = document.createElement('video');
            video.setAttribute('muted', '');
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.preload = 'metadata';
            hero.insertBefore(video, hero.firstChild);
          }
          if (poster) video.setAttribute('poster', poster);
          if (video.getAttribute('src') !== videoUrl) video.src = videoUrl;
          video.play().catch(() => {});
        } else {
          hero.classList.remove('is-video', 'is-playing');
          if (settings.enable_zoom) hero.classList.add('zoomable');
          hero.setAttribute('data-src', poster || '');
          hero.setAttribute('data-video', '');
          if (existingVideo) {
            existingVideo.pause();
            existingVideo.remove();
          }
          let img = existingImg;
          if (!img) {
            img = document.createElement('img');
            img.alt = '';
            img.decoding = 'async';
            hero.insertBefore(img, hero.firstChild);
          }
          if (poster && img.getAttribute('src') !== poster) img.src = poster;
        }
      }
      function slideHero(hero, poster, videoUrl, dir) {
        if (!hero || !(poster || videoUrl)) return;
        if (!dir || reduceMotion || slideBusy) {
          setHeroMedia(hero, poster, videoUrl);
          return;
        }
        const stage = hero.closest('.pdp-stage') || hero.parentElement;
        if (!stage) { setHeroMedia(hero, poster, videoUrl); return; }
        slideBusy = true;
        const curPoster = hero.getAttribute('data-src') || '';
        const out = document.createElement('div');
        out.className = 'pdp-slide ' + (dir > 0 ? 'to-left' : 'to-right');
        out.style.backgroundImage = curPoster ? 'url("' + curPoster + '")' : '';
        const inn = document.createElement('div');
        inn.className = 'pdp-slide ' + (dir > 0 ? 'from-right' : 'from-left');
        inn.style.backgroundImage = poster ? 'url("' + poster + '")' : '';
        stage.appendChild(out);
        stage.appendChild(inn);
        setHeroMedia(hero, poster, videoUrl);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          out.remove();
          inn.remove();
          slideBusy = false;
        };
        inn.addEventListener('animationend', finish, { once: true });
        window.setTimeout(finish, 500);
      }
      function activate(i, src, dir, videoUrl) {
        root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]').forEach((el) => {
          const on = Number(el.getAttribute('data-pdp-thumb') || el.getAttribute('data-pdp-dot')) === i;
          el.classList.toggle('on', on);
        });
        const srcEl = root.querySelector('[data-pdp-thumb][data-pdp-thumb="' + i + '"],[data-pdp-media="' + i + '"]') ||
          root.querySelector('[data-pdp-thumb="' + i + '"]');
        const poster = src || (srcEl && srcEl.getAttribute('data-src')) || '';
        const video = videoUrl != null ? videoUrl : (srcEl && srcEl.getAttribute('data-video')) || '';
        const hero = heroCell();
        if ((poster || video) && hero) slideHero(hero, poster, video, dir || 0);
      }
      root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (slideBusy) return;
        const next = Number(el.getAttribute('data-pdp-thumb') || el.getAttribute('data-pdp-dot'));
        const cur = currentIndex();
        if (next === cur) return;
        activate(next, el.getAttribute('data-src'), next > cur ? 1 : -1, el.getAttribute('data-video') || '');
      }));
      root.querySelectorAll('[data-pdp-nav]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (slideBusy) return;
        const marks = Array.from(root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]'));
        if (!marks.length) return;
        const cur = currentIndex();
        const dir = Number(el.getAttribute('data-pdp-nav')) || 1;
        const next = (cur + dir + marks.length) % marks.length;
        activate(next, marks[next].getAttribute('data-src'), dir, marks[next].getAttribute('data-video') || '');
      }));
      let zoomIndex = 0;
      let zoomTrigger = null;
      const zoomSources = Array.from(root.querySelectorAll('[data-pdp-thumb][data-src]')).filter((el) => !el.getAttribute('data-video'));
      const zoomImages = (zoomSources.length ? zoomSources : Array.from(root.querySelectorAll('[data-pdp-media]:not(.is-video)'))).map(el => el.getAttribute('data-src')).filter(Boolean);
      function showZoomImage() {
        zoom.querySelector('img').src = zoomImages[zoomIndex] || '';
        zoom.querySelector('img').alt = 'Product image ' + (zoomIndex + 1);
      }
      function closeZoom() {
        zoom.classList.remove('on');
        if (zoomTrigger) zoomTrigger.focus();
      }
      root.querySelectorAll('[data-pdp-media]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.classList.contains('is-video')) {
          const video = el.querySelector('video');
          if (video) {
            if (video.paused) { video.play().catch(() => {}); el.classList.add('is-playing'); }
            else { video.pause(); el.classList.remove('is-playing'); }
          } else {
            el.classList.toggle('is-playing');
          }
          return;
        }
        if (!settings.enable_zoom || !zoom) return;
        zoomTrigger = el;
        zoomIndex = zoomSources.length ? currentIndex() : Math.max(0, zoomImages.indexOf(el.getAttribute('data-src')));
        showZoomImage();
        const host = root.closest('.os-frame') || root;
        const r = host.getBoundingClientRect();
        const sc = document.getElementById('os-cscroll');
        const viewport = sc ? sc.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
        zoom.style.left = r.left + 'px';
        zoom.style.top = Math.max(0, viewport.top) + 'px';
        zoom.style.width = r.width + 'px';
        zoom.style.height = (Math.min(window.innerHeight, viewport.bottom) - Math.max(0, viewport.top)) + 'px';
        zoom.style.right = 'auto';
        zoom.style.bottom = 'auto';
        zoom.classList.add('on');
        zoom.querySelector('[data-zoom-close]').focus();
      }));
      if (zoom) {
        zoom.querySelectorAll('[data-zoom-step]').forEach(button => {
          button.disabled = zoomImages.length < 2;
          button.addEventListener('click', () => {
            zoomIndex = (zoomIndex + Number(button.dataset.zoomStep) + zoomImages.length) % zoomImages.length;
            showZoomImage();
          });
        });
        zoom.addEventListener('click', e => {
          e.stopPropagation();
          if (e.target === zoom || e.target.closest('[data-zoom-close]')) closeZoom();
        });
        zoom.addEventListener('keydown', e => {
          if (e.key === 'Escape') { e.preventDefault(); closeZoom(); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            zoom.querySelector('[data-zoom-step="' + (e.key === 'ArrowLeft' ? '-1' : '1') + '"]').click();
          }
        });
      }
      // Inline recommendations: side arrows + peek + pointer-drag / touch swipe (scrollbar hidden).
      root.querySelectorAll('[data-pdp-rec]').forEach((rail) => {
        let drag = null;
        let suppressClick = false;
        const wrap = rail.closest('[data-pdp-rec-wrap]');
        const prevBtn = wrap ? wrap.querySelector('[data-pdp-rec-nav="-1"]') : null;
        const nextBtn = wrap ? wrap.querySelector('[data-pdp-rec-nav="1"]') : null;
        function syncNav() {
          if (!prevBtn && !nextBtn) return;
          const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
          const left = rail.scrollLeft;
          if (prevBtn) prevBtn.disabled = left <= 2;
          if (nextBtn) nextBtn.disabled = left >= max - 2;
        }
        function step(dir) {
          const card = rail.querySelector('.pdp-rec-card');
          const gap = parseFloat(getComputedStyle(rail).gap) || 10;
          const stepPx = card ? (card.getBoundingClientRect().width + gap) : Math.max(120, rail.clientWidth * 0.8);
          rail.scrollBy({ left: dir * stepPx, behavior: 'smooth' });
        }
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); step(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); step(1); });
        rail.addEventListener('scroll', syncNav, { passive: true });
        syncNav();
        rail.addEventListener('pointerdown', (e) => {
          if (e.button != null && e.button !== 0) return;
          if (e.target && e.target.closest && e.target.closest('[data-pdp-rec-nav]')) return;
          drag = { id: e.pointerId, x: e.clientX, left: rail.scrollLeft, moved: false };
          try { rail.setPointerCapture(e.pointerId); } catch (_) {}
        });
        rail.addEventListener('pointermove', (e) => {
          if (!drag || e.pointerId !== drag.id) return;
          const dx = e.clientX - drag.x;
          if (!drag.moved && Math.abs(dx) < 4) return;
          if (!drag.moved) { drag.moved = true; rail.classList.add('is-dragging'); }
          rail.scrollLeft = drag.left - dx;
          e.preventDefault();
        });
        const endDrag = (e) => {
          if (!drag || (e && e.pointerId !== drag.id)) return;
          if (drag.moved) {
            rail.classList.remove('is-dragging');
            suppressClick = true;
            syncNav();
          }
          drag = null;
        };
        rail.addEventListener('pointerup', endDrag);
        rail.addEventListener('pointercancel', endDrag);
        rail.addEventListener('click', (e) => {
          if (!suppressClick) return;
          suppressClick = false;
          e.preventDefault();
          e.stopPropagation();
        }, true);
      });
      // Video column — carousel arrows + click-to-enlarge with playlist prev/next (shared lightbox).
      root.querySelectorAll('[data-pdp-vc]').forEach((rail) => {
        const openBtns = Array.from(rail.querySelectorAll('[data-pdp-vc-open]'));
        const playlist = openBtns.map((btn) => ({
          cover: btn.getAttribute('data-cover') || '',
          video: btn.getAttribute('data-video') || '',
        }));
        openBtns.forEach((btn, i) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof OS.openVideoLightbox === 'function') {
              OS.openVideoLightbox(playlist.length ? playlist : [{
                cover: btn.getAttribute('data-cover') || '',
                video: btn.getAttribute('data-video') || '',
              }], i);
            }
          });
        });
        const wrap = rail.closest('[data-pdp-vc-wrap]');
        const prevBtn = wrap ? wrap.querySelector('[data-pdp-vc-nav="-1"]') : null;
        const nextBtn = wrap ? wrap.querySelector('[data-pdp-vc-nav="1"]') : null;
        function syncNav() {
          if (!prevBtn && !nextBtn) return;
          const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
          const left = rail.scrollLeft;
          if (prevBtn) prevBtn.disabled = left <= 2;
          if (nextBtn) nextBtn.disabled = left >= max - 2;
        }
        function step(dir) {
          const card = rail.querySelector('.pdp-vc-card');
          const gap = parseFloat(getComputedStyle(rail).gap) || 10;
          const stepPx = card ? (card.getBoundingClientRect().width + gap) : Math.max(100, rail.clientWidth * 0.8);
          rail.scrollBy({ left: dir * stepPx, behavior: 'smooth' });
        }
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); step(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); step(1); });
        rail.addEventListener('scroll', syncNav, { passive: true });
        syncNav();
      });
      const qtyEl = root.querySelector('[data-pdp-qty]');
      let qty = 1;
      let currentMatch = null;
      let atcBusy = false;
      // Prefer Variant-block rows; fall back to shell default SKU (single-SKU / no picker).
      const variantEls = (() => {
        const fromBlock = Array.from(root.querySelectorAll('[data-pdp-variant-data]:not([data-pdp-shell-data]) [data-id]'));
        if (fromBlock.length) return fromBlock;
        return Array.from(root.querySelectorAll('[data-pdp-variant-data] [data-id]'));
      })();
      const shellEl = root.querySelector('.pdpx') || root;
      const productHandle = shellEl.getAttribute('data-pdp-handle') || root.getAttribute('data-pdp-handle') || '';
      function productFallbackMatch() {
        return {
          id: shellEl.getAttribute('data-pdp-variant') || productHandle || 'default',
          color: currentColor || '',
          size: currentSize || '',
          price: Number(shellEl.getAttribute('data-pdp-price') || 0),
          compareAt: 0,
          inventory: Number(shellEl.getAttribute('data-pdp-inventory') || 99),
          image: shellEl.getAttribute('data-pdp-image') || '',
          sku: '',
        };
      }
      let currentColor = (root.querySelector('[data-pdp-color].on') || {}).dataset ? root.querySelector('[data-pdp-color].on').dataset.pdpColor : '';
      let currentSize = (root.querySelector('[data-pdp-size].on') || {}).dataset ? root.querySelector('[data-pdp-size].on').dataset.pdpSize : '';
      const colorDd = root.querySelector('[data-pdp-color-dd]');
      const sizeDd = root.querySelector('[data-pdp-size-dd]');
      const nestedDd = root.querySelector('[data-pdp-nested-dd]');
      if (!currentColor && colorDd) {
        const on = colorDd.querySelector('.pdp-dd-opt.on');
        currentColor = on ? on.getAttribute('data-value') : '';
      }
      if (!currentSize && sizeDd) {
        const on = sizeDd.querySelector('.pdp-dd-opt.on');
        currentSize = on ? on.getAttribute('data-value') : '';
      }
      if ((!currentColor || !currentSize) && nestedDd) {
        const on = nestedDd.querySelector('.pdp-dd-opt.on');
        if (on) {
          currentColor = currentColor || on.getAttribute('data-pdp-color') || '';
          currentSize = currentSize || on.getAttribute('data-pdp-size') || '';
        }
      }
      function variantData(el) {
        return {
          id: el.dataset.id,
          color: el.dataset.color,
          size: el.dataset.size,
          price: Number(el.dataset.price || 0),
          compareAt: Number(el.dataset.compare || 0),
          inventory: Number(el.dataset.inventory || 0),
          preorder: el.dataset.preorder === '1',
          available: el.dataset.available !== '0',
          image: el.dataset.image,
          sku: el.dataset.sku,
        };
      }
      function closeAllDd() {
        root.querySelectorAll('.pdp-dd.open').forEach((dd) => {
          dd.classList.remove('open');
          const btn = dd.querySelector('[data-pdp-dd-btn]');
          const menu = dd.querySelector('[data-pdp-dd-menu]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (menu) {
            menu.hidden = true;
            menu.style.left = '';
            menu.style.top = '';
            menu.style.width = '';
          }
        });
      }
      function placeDdMenu(dd) {
        const btn = dd.querySelector('[data-pdp-dd-btn]');
        const menu = dd.querySelector('[data-pdp-dd-menu]');
        if (!btn || !menu) return;
        const r = btn.getBoundingClientRect();
        const maxH = Math.min(240, Math.max(120, window.innerHeight - r.bottom - 12));
        const openUp = r.bottom + Math.min(maxH, menu.scrollHeight || maxH) > window.innerHeight - 8 && r.top > maxH;
        menu.hidden = false;
        menu.style.left = Math.round(r.left) + 'px';
        menu.style.width = Math.round(r.width) + 'px';
        menu.style.maxHeight = maxH + 'px';
        if (openUp) {
          menu.style.top = 'auto';
          menu.style.bottom = Math.round(window.innerHeight - r.top + 4) + 'px';
        } else {
          menu.style.bottom = 'auto';
          menu.style.top = Math.round(r.bottom + 4) + 'px';
        }
      }
      function syncDd(dd, value, all, kind) {
        if (!dd) return;
        const label = dd.querySelector('[data-pdp-dd-val]');
        let selectedSold = false;
        dd.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
          const v = opt.getAttribute('data-value') || '';
          const on = v === value;
          const exists = kind === 'size'
            ? all.some((row) => (!currentColor || row.color === currentColor) && row.size === v)
            : true;
          const sold = kind === 'size'
            ? !all.some((row) => (!currentColor || row.color === currentColor) && row.size === v && Number(row.inventory || 0) > 0)
            : !all.some((row) => row.color === v && Number(row.inventory || 0) > 0);
          opt.classList.toggle('on', on);
          opt.setAttribute('aria-selected', on ? 'true' : 'false');
          opt.disabled = kind === 'size' ? !exists : false;
          opt.textContent = v + (exists && sold ? ' — Sold out' : '');
          if (on) selectedSold = !!sold && exists;
        });
        if (label) label.textContent = value + (selectedSold ? ' — Sold out' : '');
      }
      function syncVariant(prefer, opts) {
        const writeUrl = !!(opts && opts.writeUrl);
        const all = variantEls.map(variantData);
        let match = all.find((v) => (!currentColor || v.color === currentColor) && (!currentSize || v.size === currentSize));
        if (!match && prefer === 'color') match = all.find((v) => !currentColor || v.color === currentColor);
        if (!match && prefer === 'size') match = all.find((v) => !currentSize || v.size === currentSize);
        if (!match) match = all[0];
        if (!match) match = productFallbackMatch();
        if (!match) return;
        currentMatch = match;
        currentColor = match.color || currentColor;
        currentSize = match.size || currentSize;
        root.querySelectorAll('button[data-pdp-color]').forEach((el) => el.classList.toggle('on', el.dataset.pdpColor === currentColor));
        root.querySelectorAll('button[data-pdp-size]').forEach((el) => {
          const exists = all.some((v) => (!currentColor || v.color === currentColor) && v.size === el.dataset.pdpSize);
          el.disabled = !exists;
          el.classList.toggle('on', el.dataset.pdpSize === currentSize);
        });
        const colorLabel = root.querySelector('[data-pdp-color-label]');
        const sizeLabel = root.querySelector('[data-pdp-size-label]');
        const nestedLabel = root.querySelector('[data-pdp-nested-label]');
        if (colorLabel && currentColor) colorLabel.textContent = currentColor;
        if (sizeLabel && currentSize) sizeLabel.textContent = currentSize;
        if (nestedLabel) nestedLabel.textContent = [currentSize, currentColor].filter(Boolean).join(' / ') || 'Variant';
        syncDd(colorDd, currentColor, all, 'color');
        syncDd(sizeDd, currentSize, all, 'size');
        if (nestedDd) {
          const label = nestedDd.querySelector('[data-pdp-dd-val]');
          nestedDd.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
            const on = (opt.getAttribute('data-pdp-color') || '') === (currentColor || '')
              && (opt.getAttribute('data-pdp-size') || '') === (currentSize || '');
            opt.classList.toggle('on', on);
            opt.setAttribute('aria-selected', on ? 'true' : 'false');
            if (on && label) label.textContent = opt.textContent || '';
          });
        }
        const now = root.querySelector('[data-pdp-now]');
        const compare = root.querySelector('[data-pdp-compare]');
        const save = root.querySelector('[data-pdp-save]');
        const stock = root.querySelector('[data-pdp-stock]');
        const sku = root.querySelector('[data-pdp-sku]');
        if (now) now.textContent = OS.money(match.price);
        if (compare) {
          compare.hidden = !(match.compareAt > match.price);
          compare.textContent = match.compareAt > match.price ? OS.money(match.compareAt) : '';
        }
        if (save && match.compareAt > match.price) {
          const saveType = save.dataset.saveType || 'percentage';
          const customLabel = String(save.dataset.saveLabel || '').trim();
          const label = saveType === 'label' ? (customLabel || 'Save')
            : (saveType === 'text' ? 'Sale'
              : (saveType === 'fixed'
                ? 'Save ' + OS.money(match.compareAt - match.price)
                : 'Save ' + Math.round((1 - match.price / match.compareAt) * 100) + '%'));
          const iconHtml = save.dataset.saveIcon === '1' ? savingIcon(true) : '';
          save.innerHTML = iconHtml + label;
        }
        if (stock) {
          const threshold = Number(stock.getAttribute('data-low-threshold') || 5);
          const isLow = match.inventory > 0 && match.inventory <= threshold;
          const isPreorder = !!match.preorder;
          stock.classList.toggle('preorder', isPreorder);
          stock.classList.toggle('sold', match.inventory <= 0 && !isPreorder);
          stock.classList.toggle('low', isLow);
          const inStockColor = stock.getAttribute('data-in-stock-color') || '#10a443';
          const lowStockColor = stock.getAttribute('data-low-stock-color') || '#f59e0b';
          stock.style.setProperty('--status-color', isPreorder ? '#222222' : (match.inventory <= 0 ? '#9ca3af' : (isLow ? lowStockColor : inStockColor)));
          const text = stock.querySelector('span');
          const showCount = stock.getAttribute('data-show-count') !== '0';
          const customText = stock.getAttribute('data-custom-text') || '';
          const lowTextTpl = stock.getAttribute('data-low-text') || 'Low stock - {n} items left';
          const soldText = stock.getAttribute('data-sold-text') || 'Sold out';
          if (text) {
            text.textContent = isPreorder
              ? 'Pre-order now · ships as soon as it is in stock.'
              : (match.inventory <= 0
                ? soldText
                : (isLow
                ? lowTextTpl.replace(/\{n\}/g, String(match.inventory)) + customText
                : ((showCount ? match.inventory + ' in stock' : 'In stock') + customText)));
          }
        }
        const soldBadge = root.querySelector('[data-pdp-sold-badge]');
        if (soldBadge) {
          soldBadge.hidden = match.inventory > 0 || !!match.preorder;
          const preorderBadge = root.querySelector('[data-pdp-preorder-badge]');
          if (preorderBadge) preorderBadge.hidden = !match.preorder;
          const badges = soldBadge.closest('[data-pdp-badges]');
          if (badges) {
            const anyVisible = [...badges.querySelectorAll('.pdp-tag')].some((el) => !el.hidden);
            badges.hidden = !anyVisible;
          }
        }
        if (sku) sku.textContent = match.sku || '';
        if (match.image) {
          const hero = root.querySelector('.pdp-stage > .pdp-cell, .pdp-carousel > .pdp-cell, .pdp-media > .pdp-cell');
          if (hero) {
            const img = hero.querySelector('img');
            if (img) img.src = match.image;
            else hero.style.backgroundImage = 'url("' + match.image + '")';
            hero.setAttribute('data-src', match.image);
          }
        }
        if (qty > Math.max(1, match.inventory)) {
          qty = Math.max(1, match.inventory);
          if (qtyEl) qtyEl.textContent = String(qty);
        }
        root.querySelectorAll('[data-pdp-atc]').forEach((button) => {
          button.disabled = match.inventory <= 0 && !match.preorder;
          const icon = button.getAttribute('data-atc-icon') || 'bag-plus';
          button.innerHTML = atcButtonInner(icon, match.inventory <= 0 && !match.preorder ? 'Sold out' : 'Add to cart');
        });
        // render() puts data-pdp-variant on .pdpx; hydrate root is .os-sec — keep the shell in sync.
        shellEl.setAttribute('data-pdp-variant', match.id || '');
        // User switch: update ?variant= via replaceState; keep utm and other params (PRD 3.1).
        if (writeUrl && match.id) replaceUrlVariant(match.id);
      }
      root.querySelectorAll('button[data-pdp-color]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        currentColor = el.dataset.pdpColor;
        syncVariant('color', { writeUrl: true });
      }));
      root.querySelectorAll('button[data-pdp-size]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.disabled) return;
        currentSize = el.dataset.pdpSize;
        syncVariant('size', { writeUrl: true });
      }));
      root.querySelectorAll('.pdp-dd').forEach((dd) => {
        const kind = dd.hasAttribute('data-pdp-nested-dd') ? 'nested'
          : (dd.hasAttribute('data-pdp-color-dd') ? 'color' : 'size');
        const btn = dd.querySelector('[data-pdp-dd-btn]');
        const menu = dd.querySelector('[data-pdp-dd-menu]');
        if (!btn || !menu) return;
        const stop = (e) => { e.stopPropagation(); };
        dd.addEventListener('mousedown', stop);
        dd.addEventListener('click', stop);
        menu.addEventListener('mousedown', stop);
        menu.addEventListener('click', stop);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const willOpen = !dd.classList.contains('open');
          closeAllDd();
          if (!willOpen) return;
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          placeDdMenu(dd);
        });
        menu.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
          opt.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (opt.disabled) return;
            if (kind === 'nested') {
              currentColor = opt.getAttribute('data-pdp-color') || '';
              currentSize = opt.getAttribute('data-pdp-size') || '';
              closeAllDd();
              syncVariant('nested', { writeUrl: true });
              return;
            }
            const value = opt.getAttribute('data-value') || '';
            if (kind === 'color') currentColor = value;
            else currentSize = value;
            closeAllDd();
            syncVariant(kind, { writeUrl: true });
          });
        });
      });
      const onDdOutside = (e) => {
        if (e.target.closest && e.target.closest('.pdp-dd, .pdp-dd-menu')) return;
        closeAllDd();
      };
      const onDdReposition = () => {
        const open = root.querySelector('.pdp-dd.open');
        if (open) placeDdMenu(open);
        else closeAllDd();
      };
      if (OS._pdpDdAbort) { try { OS._pdpDdAbort.abort(); } catch (err) { /* noop */ } }
      OS._pdpDdAbort = new AbortController();
      const ddSignal = { signal: OS._pdpDdAbort.signal };
      document.addEventListener('mousedown', onDdOutside, ddSignal);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllDd(); }, ddSignal);
      const sc = document.getElementById('os-cscroll') || document.querySelector('.os-canvas-scroll');
      if (sc) sc.addEventListener('scroll', onDdReposition, Object.assign({ passive: true }, ddSignal));
      window.addEventListener('resize', onDdReposition, ddSignal);
      root.querySelectorAll('[data-pdp-q]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        qty = Math.max(1, qty + (el.getAttribute('data-pdp-q') === '+' ? 1 : -1));
        if (qtyEl) qtyEl.textContent = String(qty);
      }));
      // Init from ?variant=: valid keeps link; invalid strips param; absent does not auto-add variant.
      const allInit = variantEls.map(variantData);
      const urlId = readUrlVariantId();
      const urlState = shellEl.getAttribute('data-pdp-url-state') || 'absent';
      if (urlState === 'invalid' || (urlId && !allInit.some((v) => String(v.id) === String(urlId)))) {
        replaceUrlVariant('');
      }
      let init = urlId ? allInit.find((v) => String(v.id) === String(urlId)) : null;
      if (!init) init = allInit.find((v) => v.inventory > 0) || allInit[0];
      if (init) {
        currentColor = init.color || currentColor;
        currentSize = init.size || currentSize;
      }
      syncVariant();
      const accordions = [...root.querySelectorAll('[data-pdp-acc]')];
      const reduceAccMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Wildpeak AccordionDetails: height 250ms ease + content fade/slide; plus vertical arm rotates 270deg via CSS.
      const setAcc = (box, open, opts) => {
        opts = opts || {};
        const body = box.querySelector(':scope > .body');
        const btn = box.querySelector(':scope > button');
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!body) { box.classList.toggle('open', open); return Promise.resolve(); }
        if (box._accAnims) {
          box._accAnims.forEach((a) => { try { a.cancel(); } catch (err) {} });
          box._accAnims = null;
        }
        const instant = !!opts.instant || reduceAccMotion() || typeof body.animate !== 'function';
        if (instant) {
          box.classList.toggle('open', open);
          body.style.height = '';
          body.style.opacity = '';
          body.style.transform = '';
          body.style.paddingBottom = '';
          return Promise.resolve();
        }
        if (open) {
          box.classList.add('open');
          body.style.height = '0px';
          body.style.opacity = '0';
          body.style.transform = 'translateY(10px)';
          body.style.paddingBottom = '0px';
          const target = body.scrollHeight;
          const anim = body.animate(
            [
              { height: '0px', opacity: 0, transform: 'translateY(10px)', paddingBottom: '0px' },
              { height: target + 'px', opacity: 0.85, transform: 'translateY(0)', paddingBottom: '12px' },
            ],
            { duration: 250, easing: 'ease', fill: 'forwards' }
          );
          box._accAnims = [anim];
          return anim.finished.then(() => {
            body.style.height = '';
            body.style.opacity = '';
            body.style.transform = '';
            body.style.paddingBottom = '';
            box._accAnims = null;
          }).catch(() => { box._accAnims = null; });
        }
        const start = body.scrollHeight || body.offsetHeight;
        body.style.height = start + 'px';
        body.style.opacity = '0.85';
        body.style.transform = 'translateY(0)';
        body.style.paddingBottom = '12px';
        const anim = body.animate(
          [
            { height: start + 'px', opacity: 0.85, transform: 'translateY(0)', paddingBottom: '12px' },
            { height: '0px', opacity: 0, transform: 'translateY(10px)', paddingBottom: '0px' },
          ],
          { duration: 250, easing: 'ease', fill: 'forwards' }
        );
        box._accAnims = [anim];
        return anim.finished.then(() => {
          box.classList.remove('open');
          body.style.height = '';
          body.style.opacity = '';
          body.style.transform = '';
          body.style.paddingBottom = '';
          box._accAnims = null;
        }).catch(() => {
          box.classList.remove('open');
          box._accAnims = null;
        });
      };
      const isAccordion = (box) => box.getAttribute('data-accordion') === '1';
      let keptAcc = false;
      accordions.forEach((box) => {
        if (!box.classList.contains('open')) return;
        if (isAccordion(box) && keptAcc) setAcc(box, false, { instant: true });
        else if (isAccordion(box)) keptAcc = true;
      });
      accordions.forEach((box) => {
        const btn = box.querySelector(':scope > button');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = !box.classList.contains('open');
          if (isAccordion(box) && open) {
            accordions.forEach((other) => { if (other !== box && isAccordion(other) && other.classList.contains('open')) setAcc(other, false); });
          }
          setAcc(box, open);
        });
      });
      function variantLabel(match) {
        const parts = [];
        if (match && match.color) parts.push(match.color);
        if (match && match.size) parts.push(match.size);
        return parts.join(' / ') || 'Default';
      }
      function productTitle() {
        const el = root.querySelector('.pdp-title, h1.pdp-title, [data-pdp-title], h1');
        return (el && el.textContent.trim()) || 'Product';
      }
      function playAtcButton(btn) {
        if (!btn) return;
        const icon = btn.getAttribute('data-atc-icon') || 'bag-plus';
        const prev = btn.getAttribute('data-prev-label') || 'Add to cart';
        btn.setAttribute('data-prev-label', prev);
        btn.classList.add('is-adding');
        btn.classList.remove('is-added');
        btn.disabled = true;
        btn.innerHTML = '<span class="pdp-atc-spin" aria-hidden="true"></span>';
        setTimeout(() => {
          btn.classList.remove('is-adding');
          btn.classList.add('is-added');
          btn.innerHTML = atcButtonInner(icon, 'Added');
          setTimeout(() => {
            btn.classList.remove('is-added');
            const sold = currentMatch && currentMatch.inventory <= 0;
            btn.disabled = !!sold;
            btn.innerHTML = atcButtonInner(icon, sold ? 'Sold out' : (btn.getAttribute('data-prev-label') || 'Add to cart'));
            atcBusy = false;
          }, 850);
        }, 360);
      }
      function addCurrentVariant(fromBtn) {
        if (atcBusy) return;
        const match = currentMatch || productFallbackMatch();
        if (!match || (match.inventory <= 0 && !match.preorder)) return;
        currentMatch = match;
        atcBusy = true;
        const line = {
          productId: productHandle,
          variantId: match.id,
          title: productTitle(),
          image: match.image || '',
          price: match.price,
          options: variantLabel(match),
          qty: qty,
        };
        if (OS.cart && typeof OS.cart.add === 'function') OS.cart.add(line);
        const flyFrom = fromBtn || root.querySelector('.pdp-buy [data-pdp-atc], .pdp-buy .pdp-atc') || root.querySelector('[data-pdp-atc]');
        if (OS.cart && typeof OS.cart.flyToCart === 'function') {
          OS.cart.flyToCart({ image: line.image, fromEl: flyFrom });
        }
        playAtcButton(fromBtn);
      }
      root.querySelectorAll('[data-pdp-atc]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.disabled) return;
        addCurrentVariant(el);
      }));
      root.querySelectorAll('[data-pdp-paypal]').forEach((el) => el.addEventListener('click', (e) => e.stopPropagation()));
      root.querySelectorAll('[data-pdp-pay-more]').forEach((el) => el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof OS.goCheckout === 'function') OS.goCheckout();
      }));
      const pagePop = root.querySelector('[data-pdp-page-pop]');
      const pagePopBody = pagePop && pagePop.querySelector('[data-pdp-page-pop-body]');
      function resolvePopupPage(pageId) {
        const pages = (OS.sample && OS.sample.pages) || [];
        return pages.find((x) => x.id === pageId) || null;
      }
      function closePagePop() {
        if (!pagePop) return;
        pagePop.classList.remove('on');
      }
      function openPagePop(pageId, size) {
        if (!pagePop || !pagePopBody) return;
        const page = resolvePopupPage(pageId);
        const html = page ? String(page.content || '').trim() : '';
        const title = page && page.title ? String(page.title) : '';
        const card = pagePop.querySelector('.pdp-page-pop-card');
        const w = Number(size && size.w);
        const h = Number(size && size.h);
        if (card) {
          card.style.width = (w > 0 ? Math.min(w, 900) : 560) + 'px';
          card.style.maxWidth = '100%';
          if (html && h > 0) {
            card.style.height = Math.min(h, 800) + 'px';
            card.style.minHeight = '';
          } else {
            card.style.height = '';
            card.style.minHeight = html ? '' : '120px';
          }
        }
        if (html) {
          pagePopBody.classList.remove('is-empty');
          pagePopBody.innerHTML = (title ? '<h3>' + OS.esc(title) + '</h3>' : '') + html;
        } else {
          pagePopBody.classList.add('is-empty');
          pagePopBody.innerHTML = '';
        }
        pagePop.classList.remove('on');
        void pagePop.offsetWidth;
        pagePop.classList.add('on');
      }
      root.querySelectorAll('[data-pdp-popup-link]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        el.classList.remove('is-anim');
        void el.offsetWidth;
        el.classList.add('is-anim');
        const onEnd = () => { el.classList.remove('is-anim'); el.removeEventListener('animationend', onEnd); };
        el.addEventListener('animationend', onEnd);
        openPagePop(el.getAttribute('data-popup-page') || '', {
          w: el.getAttribute('data-popup-w'),
          h: el.getAttribute('data-popup-h'),
        });
      }));
      if (pagePop) {
        pagePop.addEventListener('click', (e) => {
          e.stopPropagation();
          if (e.target === pagePop) closePagePop();
        });
        pagePop.querySelectorAll('[data-pdp-page-pop-close]').forEach((el) => {
          el.addEventListener('click', (e) => { e.stopPropagation(); closePagePop(); });
        });
      }
      const sharePop = root.querySelector('[data-pdp-share-pop]');
      let shareCopyTimer = 0;
      function shareUrl() {
        const input = sharePop && sharePop.querySelector('[data-pdp-share-url]');
        return (input && input.value) || location.href;
      }
      function resetShareCopy() {
        const copy = sharePop && sharePop.querySelector('[data-pdp-share-copy]');
        if (!copy) return;
        copy.textContent = 'Copy';
        copy.classList.remove('is-copied');
      }
      function setShareUrl(url) {
        const input = sharePop && sharePop.querySelector('[data-pdp-share-url]');
        if (input) input.value = url;
        if (!sharePop) return;
        const enc = encodeURIComponent(url);
        const title = encodeURIComponent(document.title || 'Product');
        const map = {
          facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc,
          x: 'https://twitter.com/intent/tweet?url=' + enc + '&text=' + title,
          pinterest: 'https://pinterest.com/pin/create/button/?url=' + enc + '&description=' + title,
        };
        sharePop.querySelectorAll('[data-pdp-share-net]').forEach((a) => {
          const href = map[a.getAttribute('data-pdp-share-net')];
          if (href) a.setAttribute('href', href);
        });
      }
      function pinSharePop() {
        const stage = document.getElementById('os-cscroll')
          || document.querySelector('.os-canvas-scroll')
          || document.querySelector('.os-preview-stage')
          || document.getElementById('os-frame')
          || root;
        const r = stage.getBoundingClientRect();
        sharePop.style.position = 'fixed';
        sharePop.style.inset = 'auto';
        sharePop.style.left = Math.round(r.left) + 'px';
        sharePop.style.top = Math.round(r.top) + 'px';
        sharePop.style.right = 'auto';
        sharePop.style.bottom = 'auto';
        sharePop.style.width = Math.round(r.width) + 'px';
        sharePop.style.height = Math.round(r.height) + 'px';
        sharePop.style.zIndex = '40';
      }
      function unpinSharePop() {
        ['position', 'inset', 'left', 'top', 'right', 'bottom', 'width', 'height', 'zIndex'].forEach((k) => {
          sharePop.style[k] = '';
        });
      }
      function openShare() {
        if (!sharePop) return;
        const card = sharePop.querySelector('[data-pdp-share-card]');
        if (card) { card.style.left = ''; card.style.top = ''; card.style.width = ''; }
        pinSharePop();
        sharePop.classList.add('on');
      }
      function closeShare() {
        if (!sharePop) return;
        sharePop.classList.remove('on');
        unpinSharePop();
        if (shareCopyTimer) clearTimeout(shareCopyTimer);
        resetShareCopy();
      }
      root.querySelectorAll('[data-pdp-share]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sharePop && sharePop.classList.contains('on')) { closeShare(); return; }
        // Share uses storefront-shaped URL /products/{handle}?variant= (PRD 3.1); live page keeps SPA path.
        const vid = shellEl.getAttribute('data-pdp-variant') || readUrlVariantId();
        setShareUrl(location.origin + storefrontProductUrl(productHandle, vid || ''));
        resetShareCopy();
        openShare();
      }));
      if (sharePop) {
        sharePop.addEventListener('click', (e) => {
          e.stopPropagation();
          if (e.target === sharePop) closeShare();
        });
        sharePop.querySelectorAll('[data-pdp-share-close]').forEach((el) => el.addEventListener('click', (e) => { e.stopPropagation(); closeShare(); }));
        sharePop.querySelectorAll('[data-pdp-share-net]').forEach((a) => a.addEventListener('click', (e) => e.stopPropagation()));
        const copy = sharePop.querySelector('[data-pdp-share-copy]');
        if (copy) copy.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = shareUrl();
          if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
          copy.textContent = 'Copied';
          copy.classList.add('is-copied');
          if (shareCopyTimer) clearTimeout(shareCopyTimer);
          shareCopyTimer = setTimeout(resetShareCopy, 1800);
        });
      }
      const frPop = root.querySelector('[data-pdp-fr-pop]');
      const frPopCard = frPop && frPop.querySelector('[data-pdp-fr-pop-card]');
      const frPopMedia = frPop && frPop.querySelector('[data-pdp-fr-pop-media]');
      const frPopStage = frPop && frPop.querySelector('[data-pdp-fr-pop-stage]');
      const frPopThumbs = frPop && frPop.querySelector('[data-pdp-fr-pop-thumbs]');
      const frPopPrev = frPop && frPop.querySelector('[data-pdp-fr-pop-prev]');
      const frPopNext = frPop && frPop.querySelector('[data-pdp-fr-pop-next]');
      const frPopBody = frPop && frPop.querySelector('[data-pdp-fr-pop-body]');
      let frPopImages = [];
      let frPopImgIdx = 0;
      const syncFrPopNav = () => {
        const multi = frPopImages.length > 1;
        if (frPopPrev) frPopPrev.classList.toggle('on', multi);
        if (frPopNext) frPopNext.classList.toggle('on', multi);
      };
      function pinFrPop() {
        if (!frPop) return;
        const stage = document.getElementById('os-cscroll')
          || document.querySelector('.os-canvas-scroll')
          || document.querySelector('.os-preview-stage')
          || document.getElementById('os-frame')
          || root;
        const r = stage.getBoundingClientRect();
        frPop.style.position = 'fixed';
        frPop.style.inset = 'auto';
        frPop.style.left = Math.round(r.left) + 'px';
        frPop.style.top = Math.round(r.top) + 'px';
        frPop.style.right = 'auto';
        frPop.style.bottom = 'auto';
        frPop.style.width = Math.round(r.width) + 'px';
        frPop.style.height = Math.round(r.height) + 'px';
        frPop.style.zIndex = '40';
      }
      function unpinFrPop() {
        if (!frPop) return;
        ['position', 'inset', 'left', 'top', 'right', 'bottom', 'width', 'height', 'zIndex'].forEach((k) => {
          frPop.style[k] = '';
        });
      }
      function setFrPopImage(n) {
        if (!frPopStage || !frPopImages.length) return;
        frPopImgIdx = ((n % frPopImages.length) + frPopImages.length) % frPopImages.length;
        frPopStage.style.backgroundImage = 'url(' + frPopImages[frPopImgIdx] + ')';
        if (frPopThumbs) {
          frPopThumbs.querySelectorAll('.pdp-fr-pop-thumb').forEach((t, i) => t.classList.toggle('on', i === frPopImgIdx));
        }
      }
      function closeFrPop() {
        if (!frPop) return;
        frPop.classList.remove('on');
        unpinFrPop();
      }
      function openFrPop(data) {
        if (!frPop || !frPopCard || !frPopBody || !data) return;
        const images = (Array.isArray(data.images) ? data.images : []).map(String).filter(Boolean);
        if (!images.length && data.image) images.push(String(data.image));
        frPopImages = images;
        frPopImgIdx = 0;
        const hasMedia = images.length > 0;
        frPopCard.classList.toggle('no-media', !hasMedia);
        if (frPopMedia) frPopMedia.style.display = hasMedia ? '' : 'none';
        if (hasMedia) {
          setFrPopImage(0);
          syncFrPopNav();
          if (frPopThumbs) {
            frPopThumbs.classList.toggle('on', images.length > 1);
            frPopThumbs.innerHTML = images.length > 1
              ? images.map((src, i) => '<button type="button" class="pdp-fr-pop-thumb' + (i === 0 ? ' on' : '') + '" data-pdp-fr-pop-thumb="' + i + '" style="background-image:url(' + OS.esc(src) + ')" aria-label="Image ' + (i + 1) + '"></button>').join('')
              : '';
          }
        } else if (frPopThumbs) {
          frPopThumbs.classList.remove('on');
          frPopThumbs.innerHTML = '';
          syncFrPopNav();
        }
        const starColor = (data.star_color && data.star_color !== 'transparent') ? data.star_color : '#16a34a';
        const rating = Math.max(1, Math.min(5, Number(data.rating) || 5));
        const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
        const verified = data.show_verified !== false
          ? ('<span class="pdp-fr-pop-verified"><i>' + checkSvg + '</i>' + OS.esc(data.verified_text || 'Verified') + '</span>')
          : '';
        const itemType = String(data.item_type || '').trim();
        frPopBody.innerHTML =
          '<div class="pdp-fr-pop-top">' +
            '<span class="pdp-fr-pop-name">' + OS.esc(data.author || 'Customer') + '</span>' +
            verified +
            '<button type="button" class="pdp-fr-pop-info" title="Verified purchase" aria-label="Info">i</button>' +
          '</div>' +
          '<div class="pdp-fr-pop-stars" style="color:' + OS.esc(starColor) + '">' + '\u2605'.repeat(rating) + '</div>' +
          '<div class="pdp-fr-pop-text">' + OS.esc(data.text || '') + '</div>' +
          (itemType
            ? ('<div class="pdp-fr-pop-meta"><span class="pdp-fr-pop-meta-label">Item type:</span><span class="pdp-fr-pop-meta-value">' + OS.esc(itemType) + '</span></div>')
            : '');
        pinFrPop();
        frPop.classList.remove('on');
        void frPop.offsetWidth;
        frPop.classList.add('on');
      }
      if (frPop) {
        frPop.addEventListener('click', (e) => {
          e.stopPropagation();
          if (e.target === frPop) closeFrPop();
        });
        frPop.addEventListener('click', (e) => {
          const closeBtn = e.target.closest('[data-pdp-fr-pop-close]');
          if (closeBtn) { e.preventDefault(); closeFrPop(); return; }
          const thumb = e.target.closest('[data-pdp-fr-pop-thumb]');
          if (thumb) {
            e.preventDefault();
            setFrPopImage(Number(thumb.getAttribute('data-pdp-fr-pop-thumb')) || 0);
            return;
          }
          if (e.target.closest('[data-pdp-fr-pop-prev]')) {
            e.preventDefault();
            setFrPopImage(frPopImgIdx - 1);
            return;
          }
          if (e.target.closest('[data-pdp-fr-pop-next]')) {
            e.preventDefault();
            setFrPopImage(frPopImgIdx + 1);
          }
        });
      }

      root.querySelectorAll('[data-pdp-fr]').forEach((fr) => {
        const cards = Array.from(fr.querySelectorAll('.pdp-fr-card'));
        if (!cards.length) return;
        const carousel = fr.getAttribute('data-carousel') === '1';
        const rail = fr.querySelector('.pdp-fr-rail');
        const dots = Array.from(fr.querySelectorAll('[data-pdp-fr-dot]'));
        let idx = 0;
        let autoTimer = 0;
        const syncDots = () => { dots.forEach((d, i) => d.classList.toggle('on', i === idx)); };
        const readIdx = () => {
          if (!carousel || !rail || !cards.length) return 0;
          const origin = rail.getBoundingClientRect().left;
          let best = 0;
          let bestDist = Infinity;
          cards.forEach((card, i) => {
            const dist = Math.abs(card.getBoundingClientRect().left - origin);
            if (dist < bestDist) { bestDist = dist; best = i; }
          });
          return best;
        };
        const cardLeft = (card) =>
          card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
        const show = (n, smooth) => {
          if (!carousel || !rail || !cards.length) return;
          idx = ((n % cards.length) + cards.length) % cards.length;
          const left = Math.max(0, cardLeft(cards[idx]));
          if (typeof rail.scrollTo === 'function') {
            rail.scrollTo({ left: left, behavior: smooth === false ? 'auto' : 'smooth' });
          } else {
            rail.scrollLeft = left;
          }
          syncDots();
        };
        show(0, false);
        const prev = fr.querySelector('[data-pdp-fr-prev]');
        const next = fr.querySelector('[data-pdp-fr-next]');
        if (prev) prev.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); show(idx - 1); });
        if (next) next.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); show(idx + 1); });
        dots.forEach((d) => d.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          show(Number(d.getAttribute('data-pdp-fr-dot')) || 0);
        }));
        cards.forEach((card) => {
          const open = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let data = null;
            try { data = JSON.parse(card.getAttribute('data-fr-review') || ''); } catch (err) { data = null; }
            if (data) openFrPop(data);
          };
          card.addEventListener('click', open);
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') open(e);
          });
        });
        if (carousel && rail) {
          let scrollTick = 0;
          rail.addEventListener('scroll', () => {
            if (scrollTick) cancelAnimationFrame(scrollTick);
            scrollTick = requestAnimationFrame(() => {
              idx = readIdx();
              syncDots();
            });
          }, { passive: true });
        }
        if (carousel && fr.getAttribute('data-autoplay') === '1') {
          autoTimer = setInterval(() => show(idx + 1), 4200);
          fr.addEventListener('pointerenter', () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = 0; } });
        }
      });

      const sticky = root.querySelector('[data-pdp-sticky], .pdp-sticky');
      if (sticky) {
        const sc = document.getElementById('os-cscroll') || document.querySelector('.os-canvas-scroll') || window;
        const buyBtn = root.querySelector('.pdp-buy [data-pdp-atc], .pdp-buy .pdp-atc') || root.querySelector('[data-pdp-atc], .pdp-atc');
        const pinToCanvas = () => {
          const host = (sc && sc.getBoundingClientRect) ? sc : null;
          if (!host) return;
          const frame = root.closest('.os-frame') || host;
          const r = frame.getBoundingClientRect();
          const pad = 12;
          const fullWidth = sticky.getAttribute('data-pdp-width-mode') === 'full';
          const mobile = !!root.querySelector('.pdpx.mob') || root.classList.contains('mob');
          const container = root.querySelector('.pdp-grid');
          const bounds = !mobile && !fullWidth && container ? container.getBoundingClientRect() : r;
          sticky.style.left = Math.round(bounds.left) + 'px';
          sticky.style.width = Math.max(0, Math.round(bounds.width)) + 'px';
          sticky.style.right = 'auto';
          sticky.style.bottom = Math.max(8, Math.round(window.innerHeight - host.getBoundingClientRect().bottom + 8)) + 'px';
        };
        const clearPin = () => {
          sticky.style.left = '';
          sticky.style.width = '';
          sticky.style.right = '';
          sticky.style.bottom = '';
        };
        const onScroll = () => {
          const afterScroll = sticky.classList.contains('after-scroll');
          let show = !afterScroll;
          if (afterScroll) {
            const anchor = buyBtn || root.querySelector('.pdp-buy') || root;
            const bottom = anchor.getBoundingClientRect ? anchor.getBoundingClientRect().bottom : 0;
            show = bottom < 100;
          }
          sticky.classList.toggle('on', show);
          if (show) pinToCanvas();
          else clearPin();
        };
        onScroll();
        sc.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
      }
    },
  });
})();

/* Vendor reviews — every review for products sold by the current vendor. */
(function () {
  const OS = window.OS;
  OS.css('vendor-reviews', [
    '.vrvx{box-sizing:border-box}.vrvx *{box-sizing:border-box}',
    '.vrvx h2{margin:0 0 6px;line-height:1.15}',
    '.vrvx .vrv-note{font-size:13px;opacity:.7;margin-bottom:8px}',
    '.vrvx .vrv-item{padding:14px 0;border-top:1px solid rgba(0,0,0,.08)}',
    '.vrvx .vrv-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px}',
    '.vrvx .vrv-name{font-weight:700}',
    '.vrvx .vrv-prod{font-size:12px;opacity:.6}',
    '.vrvx .vrv-item h3{margin:6px 0 4px;font-size:15px}',
    '.vrvx .vrv-item p{margin:0;font-size:14px;line-height:1.55;opacity:.85}',
    '.vrvx .vrv-stars svg{width:14px;height:14px;color:#f5b301}',
  ].join(''));

  function productOf(ctx) {
    if (ctx && ctx.resource && ctx.resource.title) return ctx.resource;
    return ((OS.sample && OS.sample.products) || [])[0] || { title: 'Product', vendor: 'Aura Studio' };
  }
  function stars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) html += '<span style="color:' + (rating >= i ? '#f5b301' : '#d8dce3') + '">' + OS.icon('star') + '</span>';
    return html;
  }
  function vendorReviews(vendor, limit) {
    const products = ((OS.sample && OS.sample.products) || []).filter((p) => (p.vendor || 'Aura Studio') === vendor);
    const lines = ['Loved the fabric.', 'Color matched the photos.', 'Shipping was quick.', 'True to the size chart.', 'Would reorder.'];
    const names = ['Maya L.', 'Jonah P.', 'Alicia R.', 'Chris N.', 'Elena V.', 'Sam K.'];
    const out = [];
    products.forEach((p, i) => {
      if (out.length >= limit) return;
      out.push({
        name: names[i % names.length],
        rating: p.rating ? Math.round(p.rating) : 5,
        title: p.title,
        body: lines[i % lines.length],
        product: p.title,
      });
    });
    return out.slice(0, limit);
  }

  OS.register('vendor-reviews', {
    name: 'Vendor reviews', group: 'product-page', icon: 'star', singleton: true, pages: ['product'],
    schema: [
      { info: 'Lists reviews from every product sold by this product’s vendor. Still the store’s own review data.' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'Reviews for this brand' },
      { key: 'count', control: 'range', label: 'Reviews to show', min: 2, max: 8, step: 1, default: 4 },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: '#F7F7F5' },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000') },
      { key: 'padding_top', control: 'range', label: 'Top padding', min: 0, max: 120, step: 4, unit: 'px', default: 36 },
      { key: 'padding_bottom', control: 'range', label: 'Bottom padding', min: 0, max: 120, step: 4, unit: 'px', default: 36 },
    ],
    render: function (s, blocks, ctx) {
      const t = ctx.tokens || {};
      const p = productOf(ctx);
      const vendor = p.vendor || 'Aura Studio';
      const text = OS.col(s.text, (t.colors || {}).text_color || '#1a1a1a');
      const list = vendorReviews(vendor, s.count || 4);
      const items = list.map((r) => '<article class="vrv-item"><div class="vrv-top"><span class="vrv-stars">' + stars(r.rating) + '</span><span class="vrv-name">' + OS.esc(r.name) + '</span><span class="vrv-prod">' + OS.esc(r.product) + '</span></div><h3>' + OS.esc(r.title) + '</h3><p>' + OS.esc(r.body) + '</p></article>').join('');
      return '<div class="vrvx" style="background:' + OS.bgOrTransparent(s.background) + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + (s.padding_top == null ? 36 : s.padding_top) + 'px ' + OS.pagePad(t, ctx.mob) + 'px ' + (s.padding_bottom == null ? 36 : s.padding_bottom) + 'px">' +
        '<div style="max-width:' + OS.pageWidth(t) + 'px;margin:0 auto">' +
          '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, ctx.mob ? 26 : 32) + 'px">' + OS.esc(s.heading || 'Reviews for this brand') + '</h2>' +
          '<div class="vrv-note">Every review on products from ' + OS.esc(vendor) + '.</div>' + items +
        '</div></div>';
    },
  });
})();

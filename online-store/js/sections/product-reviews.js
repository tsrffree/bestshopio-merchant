/* Product reviews — this product’s own reviews, not an app embed. */
(function () {
  const OS = window.OS;
  OS.css('product-reviews', [
    '.prvx{box-sizing:border-box}.prvx *{box-sizing:border-box}',
    '.prvx h2{margin:0 0 8px;line-height:1.15}',
    '.prvx .prv-sub{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:6px}',
    '.prvx .prv-sum{display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin:16px 0 8px}',
    '.prvx .prv-score{font-size:42px;font-weight:700;line-height:1}',
    '.prvx .prv-stars svg{width:16px;height:16px;color:#f5b301}',
    '.prvx .prv-bar{display:grid;grid-template-columns:18px 1fr 28px;gap:8px;align-items:center;font-size:12px;margin-top:4px}',
    '.prvx .prv-bar i{display:block;height:6px;border-radius:99px;background:rgba(0,0,0,.08);overflow:hidden}',
    '.prvx .prv-bar i b{display:block;height:100%;background:#f5b301}',
    '.prvx .prv-list{margin-top:8px}',
    '.prvx .prv-item{padding:14px 0;border-top:1px solid rgba(0,0,0,.08)}',
    '.prvx .prv-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px}',
    '.prvx .prv-name{font-weight:700}',
    '.prvx .prv-ok{font-size:11px;font-weight:700;color:#127a45}',
    '.prvx .prv-item h3{margin:6px 0 4px;font-size:15px}',
    '.prvx .prv-item p{margin:0;font-size:14px;line-height:1.55;opacity:.85}',
  ].join(''));

  function productOf(ctx) {
    if (ctx && ctx.resource && ctx.resource.title) return ctx.resource;
    return ((OS.sample && OS.sample.products) || [])[0] || { title: 'Product', rating: 4.8, reviews: 12 };
  }
  function stars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) html += '<span style="color:' + (rating >= i - 0.25 ? '#f5b301' : '#d8dce3') + '">' + OS.icon('star') + '</span>';
    return html;
  }
  function reviewsFor(p, limit) {
    const samples = [
      ['Maya L.', 5, 'Worth it', 'The ' + p.title + ' looks like the photos, and the fabric feels substantial.'],
      ['Jonah P.', 4, 'True to size', 'Ordered my usual size. It arrived faster than the estimate.'],
      ['Alicia R.', 5, 'Would buy again', 'Wore it twice already. The color matches the gallery.'],
      ['Chris N.', 4, 'Nice weight', 'Not see-through, and it kept its shape after a wash.'],
      ['Elena V.', 3, 'Runs slightly long', 'Beautiful make, but I would size down next time.'],
    ];
    return samples.slice(0, limit).map((row, i) => ({
      name: row[0], rating: row[1], title: row[2], body: row[3], date: ['Mar 12, 2026', 'Feb 18, 2026', 'Jan 29, 2026', 'Jan 9, 2026', 'Dec 2, 2025'][i],
    }));
  }
  function bars(rating) {
    const weights = [0.62, 0.22, 0.09, 0.05, 0.02];
    if (rating < 4.5) weights.splice(0, 5, 0.48, 0.28, 0.14, 0.07, 0.03);
    return [5, 4, 3, 2, 1].map((star, i) => '<div class="prv-bar"><span>' + star + '</span><i><b style="width:' + Math.round(weights[i] * 100) + '%"></b></i><span>' + Math.round(weights[i] * 100) + '</span></div>').join('');
  }

  OS.register('product-reviews', {
    name: 'Product reviews', group: 'product-page', icon: 'star', singleton: true, pages: ['product'],
    schema: [
      { info: 'Reads this product’s reviews from the store. It is not a reviews app embed.' },
      { key: 'subheading', control: 'text', label: 'Subheading', default: 'Customers' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'Reviews' },
      { key: 'show_summary', control: 'toggle', label: 'Show score summary', default: true },
      { key: 'show_verified', control: 'toggle', label: 'Show verified badge', default: true },
      { key: 'count', control: 'range', label: 'Reviews to show', min: 1, max: 5, step: 1, default: 3 },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true },
      { key: 'padding_top', control: 'range', label: 'Top padding', min: 0, max: 120, step: 4, unit: 'px', default: 28 },
      { key: 'padding_bottom', control: 'range', label: 'Bottom padding', min: 0, max: 120, step: 4, unit: 'px', default: 28 },
    ],
    render: function (s, blocks, ctx) {
      const t = ctx.tokens || {};
      const p = productOf(ctx);
      const c = t.colors || {};
      const text = OS.col(s.text, c.text_color || '#1a1a1a');
      const list = reviewsFor(p, s.count || 3);
      const summary = s.show_summary ? '<div class="prv-sum"><div><div class="prv-score">' + (p.rating || 4.8) + '</div><div class="prv-stars">' + stars(p.rating || 4.8) + '</div><div style="font-size:13px;opacity:.7;margin-top:4px">' + (p.reviews || list.length) + ' reviews</div></div><div style="min-width:180px;flex:1">' + bars(p.rating || 4.8) + '</div></div>' : '';
      const items = list.map((r) => '<article class="prv-item"><div class="prv-top"><span class="prv-stars">' + stars(r.rating) + '</span><span class="prv-name">' + OS.esc(r.name) + '</span>' + (s.show_verified ? '<span class="prv-ok">Verified</span>' : '') + '<span style="margin-left:auto;opacity:.55">' + r.date + '</span></div><h3>' + OS.esc(r.title) + '</h3><p>' + OS.esc(r.body) + '</p></article>').join('');
      return '<div class="prvx" style="background:' + OS.bgOrTransparent(s.background) + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + (s.padding_top == null ? 28 : s.padding_top) + 'px ' + OS.pagePad(t, ctx.mob) + 'px ' + (s.padding_bottom == null ? 28 : s.padding_bottom) + 'px">' +
        '<div style="max-width:' + OS.pageWidth(t) + 'px;margin:0 auto">' +
          (s.subheading ? '<div class="prv-sub">' + OS.esc(s.subheading) + '</div>' : '') +
          '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, ctx.mob ? 26 : 32) + 'px">' + OS.esc(s.heading || 'Reviews') + '</h2>' +
          summary + '<div class="prv-list">' + items + '</div></div></div>';
    },
  });
})();

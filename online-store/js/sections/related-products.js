/* Related products — rule-based recommendations, or a hand-picked list that replaces them. */
(function () {
  const OS = window.OS;
  OS.css('related-products', [
    '.relx{box-sizing:border-box}.relx *{box-sizing:border-box}',
    '.relx h2{margin:0 0 8px;line-height:1.15}',
    '.relx .rel-sub{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.65;margin-bottom:6px}',
    '.relx .rel-copy{font-size:14px;line-height:1.55;opacity:.8;margin-bottom:16px}',
    '.relx .rel-grid{display:grid;gap:16px}',
    '.relx .rel-item{position:relative}',
    '.relx .rel-wish{position:absolute;top:8px;right:8px;z-index:2;width:32px;height:32px;border-radius:50%;border:0;background:#fff;cursor:pointer;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,.08)}',
    '.relx .rel-wish.on{color:#d92d20}',
  ].join(''));

  function productOf(ctx) {
    if (ctx && ctx.resource && ctx.resource.title) return ctx.resource;
    return ((OS.sample && OS.sample.products) || [])[0] || null;
  }
  function byIds(ids) {
    const all = (OS.sample && OS.sample.products) || [];
    return (ids || []).map((id) => all.find((p) => p.id === id)).filter(Boolean);
  }
  function autoList(current, n) {
    return ((OS.sample && OS.sample.products) || []).filter((p) => !current || p.id !== current.id).slice(0, n);
  }

  OS.register('related-products', {
    name: 'Related products', group: 'product-page', icon: 'grid', singleton: true, pages: ['product'],
    schema: [
      { info: 'With manual selection off, the row is filled by the store’s recommendation rule. Turning manual selection on replaces that row.' },
      { key: 'manual', control: 'toggle', label: 'Manual recommendations', default: false },
      { key: 'products', control: 'ordered_products', label: 'Choose products', default: [], max: 12, visibleWhen: (v) => !!v.manual },
      { key: 'dynamic_count', control: 'range', label: 'Dynamic recommendations count', min: 2, max: 12, step: 1, default: 4, visibleWhen: (v) => !v.manual, info: 'How many rule-based products to show when none are picked by hand.' },
      { key: 'stack_mobile', control: 'toggle', label: 'Stack products on mobile', default: false },
      { key: 'show_wishlist', control: 'toggle', label: 'Show wishlist', default: true },
      { key: 'columns_mobile', control: 'range', label: 'Products per row · mobile', min: 1, max: 3, step: 1, default: 2, visibleWhen: (v) => !v.stack_mobile },
      { key: 'columns_desktop', control: 'range', label: 'Products per row · desktop', min: 2, max: 5, step: 1, default: 4 },
      { sub: 'Content' },
      { key: 'subheading', control: 'text', label: 'Subheading', default: 'Keep browsing' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'Related products' },
      { key: 'content', control: 'richtext', label: 'Content', default: '' },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'background_end', control: 'color', label: 'Background gradient', default: '', allowTransparent: true, info: 'Set a second color to fade the background from top to bottom.' },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true },
      { key: 'heading_color', control: 'color', label: 'Heading', default: '', allowTransparent: true },
      { key: 'card_background', control: 'color', label: 'Product card background', default: 'transparent', allowTransparent: true },
      { key: 'padding_top', control: 'range', label: 'Top padding', min: 0, max: 120, step: 4, unit: 'px', default: 36 },
      { key: 'padding_bottom', control: 'range', label: 'Bottom padding', min: 0, max: 120, step: 4, unit: 'px', default: 48 },
    ],
    render: function (s, blocks, ctx) {
      const t = ctx.tokens || {};
      const current = productOf(ctx);
      const picked = s.manual ? byIds(s.products) : [];
      const list = picked.length ? picked : autoList(current, s.dynamic_count || 4);
      const cols = ctx.mob ? (s.stack_mobile ? 1 : (s.columns_mobile || 2)) : (s.columns_desktop || 4);
      const bg = (s.background_end && s.background_end !== 'transparent')
        ? 'linear-gradient(180deg,' + (s.background || '#fff') + ',' + s.background_end + ')'
        : OS.bgOrTransparent(s.background);
      const text = OS.col(s.text, (t.colors || {}).text_color || '#1a1a1a');
      const head = OS.col(s.heading_color, (t.colors || {}).heading_color || text);
      const cards = list.map((p) => {
        const card = OS.productCard(p, t, { showQuickAdd: false });
        const wish = s.show_wishlist ? '<button type="button" class="rel-wish" data-rel-wish aria-label="Save">♡</button>' : '';
        return '<div class="rel-item" style="background:' + OS.bgOrTransparent(s.card_background) + ';border-radius:' + OS.layoutRadius(t, 'card') + 'px">' + wish + card + '</div>';
      }).join('');
      return '<div class="relx" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + (s.padding_top == null ? 36 : s.padding_top) + 'px ' + OS.pagePad(t, ctx.mob) + 'px ' + (s.padding_bottom == null ? 48 : s.padding_bottom) + 'px">' +
        '<div style="max-width:' + OS.pageWidth(t) + 'px;margin:0 auto">' +
          (s.subheading ? '<div class="rel-sub">' + OS.esc(s.subheading) + '</div>' : '') +
          '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, ctx.mob ? 26 : 32) + 'px;color:' + head + '">' + OS.esc(s.heading || 'Related products') + '</h2>' +
          (s.content ? '<div class="rel-copy">' + s.content + '</div>' : '') +
          '<div class="rel-grid" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:' + OS.gridGap(t, ctx.mob) + 'px">' + cards + '</div>' +
        '</div></div>';
    },
    hydrate: function (root) {
      root.querySelectorAll('[data-rel-wish]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const on = el.classList.toggle('on');
        el.textContent = on ? '♥' : '♡';
      }));
    },
  });
})();

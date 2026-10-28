/* Text with icon — row of icon + text trust badges. Homogeneous Item blocks
   (icon / image / heading / content / link, max 8). Capability matches PDP Icon with text. */
(function () {
  const OS = window.OS;
  const TI = () => window.OS_THEME_ICONS || (OS && OS.themeIcons) || null;
  const glyph = (name) => {
    const api = TI();
    if (api && api.svg) return api.svg(name, 30);
    return '';
  };
  const iconOptions = () => (TI() && TI().options) ? TI().options(true) : [
    { value: 'none', label: 'None' }, { value: 'box', label: 'Box' }, { value: 'truck', label: 'Truck' },
    { value: 'shield', label: 'Shield' }, { value: 'lock', label: 'Lock' }, { value: 'return', label: 'Return' },
    { value: 'support', label: 'Support' }, { value: 'gift', label: 'Gift' }, { value: 'star', label: 'Star' }, { value: 'heart', label: 'Heart' },
  ];

  OS.css('text-with-icon', [
    '.twix{box-sizing:border-box}.twix *{box-sizing:border-box}',
    '.twix h2{margin:0 0 22px;line-height:1.15}',
    '.twix .twi-grid{display:grid}',
    '.twix .twi-item{display:flex}',
    '.twix .twi-item.top{flex-direction:column;align-items:center;text-align:center}',
    '.twix .twi-item.left{flex-direction:row;align-items:flex-start;gap:14px;text-align:left}',
    '.twix .twi-ic{flex:none;display:inline-flex;align-items:center;justify-content:center}',
    '.twix .twi-ic svg{display:block;width:100%;height:100%}',
    '.twix .twi-ic img{display:block;width:100%;height:100%;object-fit:contain}',
    '.twix .twi-item.top .twi-ic{margin-bottom:12px}',
    '.twix .twi-item.card-outline{padding:14px;border:1px solid rgba(0,0,0,.12);border-radius:10px}',
    '.twix .twi-item.card-filled{padding:14px;background:rgba(0,0,0,.04);border-radius:10px}',
    '.twix .twi-body{min-width:0}',
    '.twix .twi-h{font-weight:700;font-size:15px;line-height:1.3;margin:0 0 4px}',
    '.twix .twi-rich{font-size:13px;line-height:1.55;opacity:.8}.twix .twi-rich a{color:inherit}',
    '.twix .twi-empty{grid-column:1/-1;text-align:center;opacity:.5;font-size:13px;padding:20px}',
    '.twix a.twi-item{color:inherit;text-decoration:none}',
  ].join(''));

  OS.register('text-with-icon', {
    name: 'Text with icon', group: 'content', icon: 'layers',
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'heading', control: 'text', label: 'Heading', default: '' },
      { key: 'heading_alignment', control: 'segmented', label: 'Heading alignment', default: 'center', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
      { key: 'desktop_grid', control: 'range', label: 'Desktop columns', min: 1, max: 6, step: 1, default: 4 },
      { key: 'mobile_grid', control: 'range', label: 'Mobile columns', min: 1, max: 3, step: 1, default: 2 },
      { key: 'item_layout', control: 'segmented', label: 'Item layout', default: 'icon-top', options: [{ value: 'icon-top', label: 'Icon top' }, { value: 'icon-left', label: 'Icon left' }] },
      { key: 'card_style', control: 'segmented', label: 'Card style', default: 'none', options: [
        { value: 'none', label: 'None' }, { value: 'outline', label: 'Outline' }, { value: 'filled', label: 'Filled' },
      ] },
      { key: 'gap', control: 'range', label: 'Gap', min: 8, max: 48, step: 1, unit: 'px', default: 24 },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true },
      { key: 'icon_color', control: 'color', label: 'Icon', default: '', allowTransparent: true, info: 'Blank inherits the theme primary color.' },
    ],
    blocks: {
      name: 'Item', kind: 'item', max: 8,
      fields: [
        { key: 'icon', control: 'select', label: 'Icon', default: 'box', options: iconOptions() },
        { key: 'image', control: 'image', label: 'Image / logo', default: '', info: 'Custom image replaces the built-in icon when set.' },
        { key: 'heading', control: 'text', label: 'Heading', default: '' },
        { key: 'content', control: 'richtext', label: 'Content', default: '' },
        { key: 'link', control: 'text', label: 'Link', default: '', placeholder: 'https://' },
      ],
      defaults: () => ({ icon: 'box', image: '', heading: 'Benefit', content: 'Short supporting line.', link: '' }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('twi'), kind: 'item', hidden: false, settings: { icon: 'truck', image: '', heading: 'Free shipping', content: 'On orders over $50', link: '' } },
      { id: OS.uid('twi'), kind: 'item', hidden: false, settings: { icon: 'support', image: '', heading: '24/7 support', content: 'We are here to help', link: '' } },
      { id: OS.uid('twi'), kind: 'item', hidden: false, settings: { icon: 'shield', image: '', heading: '30-day guarantee', content: 'No-questions returns', link: '' } },
      { id: OS.uid('twi'), kind: 'item', hidden: false, settings: { icon: 'lock', image: '', heading: 'Secure payments', content: 'SSL encrypted checkout', link: '' } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob;
      const text = OS.col(s.text, (t.colors && t.colors.text_color) || '#1a1a1a');
      const head = OS.col(s.text, (t.colors && t.colors.heading_color) || '#1a1a1a');
      const icColor = OS.col(s.icon_color, (t.colors && t.colors.primary_color) || '#1a1a1a');
      const bg = OS.bgOrTransparent(s.background);
      const padV = OS.secSpace(t, mob), padH = OS.pagePad(t, mob);
      const maxW = s.full_width ? '100%' : OS.pageWidth(t) + 'px';
      const cols = mob ? OS.clamp(s.mobile_grid, 1, 3, 2) : OS.clamp(s.desktop_grid, 1, 6, 4);
      const gap = OS.clamp(s.gap, 8, 48, 24);
      const layout = s.item_layout === 'icon-left' ? 'left' : 'top';
      const cardClass = s.card_style === 'outline' ? ' card-outline' : (s.card_style === 'filled' ? ' card-filled' : '');
      const icSize = mob ? 28 : 30;
      const items = (blocks || []).filter((b) => !b.hidden);

      const cards = items.map((b0) => {
        const b = b0.settings;
        const ic = b.image
          ? '<span class="twi-ic" style="width:' + icSize + 'px;height:' + icSize + 'px"><img alt="" src="' + OS.esc(b.image) + '"></span>'
          : (b.icon && b.icon !== 'none'
            ? '<span class="twi-ic" style="width:' + icSize + 'px;height:' + icSize + 'px;color:' + icColor + '">' + glyph(b.icon) + '</span>'
            : '');
        const body = '<div class="twi-body">' +
          (b.heading ? '<div class="twi-h" style="font-family:' + OS.headingFamily(t) + '">' + OS.esc(b.heading) + '</div>' : '') +
          (b.content ? '<div class="twi-rich">' + b.content + '</div>' : '') + '</div>';
        const tag = b.link ? 'a' : 'div';
        const href = b.link ? ' href="' + OS.esc(b.link) + '" target="_blank" rel="noopener"' : '';
        return '<' + tag + ' class="twi-item ' + layout + cardClass + '" data-block-id="' + OS.esc(b0.id) + '"' + href + '>' + ic + body + '</' + tag + '>';
      }).join('');

      const heading = s.heading
        ? '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 24 : 30) + 'px;color:' + head + ';text-align:' + (mob ? 'center' : s.heading_alignment) + '">' + OS.esc(s.heading) + '</h2>'
        : '';

      return '<div class="twix" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padH + 'px">' +
        '<div style="max-width:' + maxW + ';margin:0 auto">' + heading +
        '<div class="twi-grid" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:' + gap + 'px">' +
        (items.length ? cards : '<div class="twi-empty">Add an item to get started.</div>') +
        '</div></div></div>';
    },
  });
})();

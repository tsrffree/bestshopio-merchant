/* Media with text — image/video beside copy, blocks auto-alternate. Ported from media-with-text.canvas.tsx.
   Homogeneous Image - Heading blocks (max 10). Section + block fields aligned to live Media With Text.
   Prototype norms: Heading/Content stack, Image position segmented, Button URL paste+validate. */
(function () {
  const OS = window.OS;
  OS.css('media-with-text', [
    '.mwtx{box-sizing:border-box}.mwtx *{box-sizing:border-box}',
    '.mwtx .mwt-shead{text-align:center;margin-bottom:8px}',
    '.mwtx .mwt-ssub{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.6;text-align:center;margin-bottom:6px}',
    '.mwtx h2{margin:0;line-height:1.12}',
    '.mwtx .mwt-row{display:grid;align-items:stretch}',
    '.mwtx .mwt-media{position:relative;background-size:cover;background-position:center;aspect-ratio:4/3;overflow:hidden}',
    '.mwtx .mwt-media video{display:block;width:100%;height:100%;object-fit:cover}',
    '.mwtx .mwt-copy{display:flex;flex-direction:column;min-width:0;min-height:100%}',
    '.mwtx .mwt-num{font-size:13px;font-weight:700;opacity:.4;margin-bottom:8px}',
    '.mwtx .mwt-bh{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:8px}',
    '.mwtx .mwt-bhead{margin:0 0 12px;line-height:1.15}.mwtx .mwt-bhead p{margin:0}',
    '.mwtx .mwt-rich{font-size:15px;line-height:1.65;opacity:.9}.mwtx .mwt-rich a{color:inherit}',
    '.mwtx .mwt-btn{display:inline-flex;align-items:center;gap:6px;text-decoration:none;margin-top:16px;cursor:pointer;border:0}',
    '.mwtx.mob .mwt-row{grid-template-columns:1fr!important;gap:18px!important}',
  ].join(''));

  const SP = { none: 0, small: 40, medium: 72, large: 110 };
  const BTN_SIZE = {
    small: { pad: '8px 12px', fs: 12 },
    medium: { pad: '10px 16px', fs: 14 },
    large: { pad: '12px 22px', fs: 16 },
  };
  const CONTENT_POS = [
    { value: 'top-left', label: 'Top left' }, { value: 'top-center', label: 'Top center' }, { value: 'top-right', label: 'Top right' },
    { value: 'middle-left', label: 'Middle left' }, { value: 'middle-center', label: 'Middle center' }, { value: 'middle-right', label: 'Middle right' },
    { value: 'bottom-left', label: 'Bottom left' }, { value: 'bottom-center', label: 'Bottom center' }, { value: 'bottom-right', label: 'Bottom right' },
  ];
  function posStyle(pos) {
    const p = String(pos || 'top-left').split('-');
    const v = p[0], hz = p[1];
    const justify = v === 'top' ? 'flex-start' : v === 'bottom' ? 'flex-end' : 'center';
    const align = hz === 'left' ? 'flex-start' : hz === 'right' ? 'flex-end' : 'center';
    const ta = hz === 'center' ? 'center' : (hz || 'left');
    return 'justify-content:' + justify + ';align-items:' + align + ';text-align:' + ta;
  }
  function richOrText(v) {
    const s = String(v || '');
    if (!s.trim()) return '';
    if (/<[a-z]/i.test(s)) return s;
    return OS.esc(s);
  }

  OS.register('media-with-text', {
    name: 'Media with text', group: 'content', icon: 'image',
    schema: [
      { sub: 'Content' },
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'section_heading', control: 'text', label: 'Heading', default: '' },
      { key: 'section_subheading', control: 'text', label: 'Subheading', default: '' },
      { key: 'heading_alignment', control: 'segmented', label: 'Heading alignment', default: 'center', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
      { key: 'spacing', control: 'select', label: 'Spacing', default: 'small', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }] },
      { key: 'content_gap', control: 'range', label: 'Content gap', min: 0, max: 80, step: 1, unit: 'px', default: 40 },
      { key: 'show_block_numbers', control: 'toggle', label: 'Show block numbers', default: false },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000'), info: 'Blank inherits the theme body text color.' },
      { sub: 'Advanced' },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.mwtx { }', info: 'Applies to this section on this page only.' },
    ],
    blocks: {
      name: 'Image - Heading', kind: 'image', max: 10,
      fields: [
        { key: 'image', control: 'image', label: 'Image', default: '' },
        { key: 'video', control: 'video', label: 'Video', default: '' },
        { key: 'image_width', control: 'range', label: 'Image width', min: 30, max: 60, step: 1, unit: '%', default: 45 },
        { key: 'image_position', control: 'segmented', label: 'Image position', default: 'left', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] },
        { key: 'content_position', control: 'select', label: 'Content position', default: 'top-left', options: CONTENT_POS },
        { key: 'subheading', control: 'text', label: 'Subheading', default: '' },
        { key: 'heading', control: 'richtext', label: 'Heading', default: '' },
        { key: 'content', control: 'richtext', label: 'Content', default: '' },
        { key: 'button_text', control: 'text', label: 'Button text', default: '' },
        { key: 'button_url', control: 'url', label: 'Button URL', default: '' },
        { key: 'button_style', control: 'select', label: 'Button style', default: 'text', options: [{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'text', label: 'Text link' }, { value: 'underline', label: 'Underline link' }] },
        { key: 'button_size', control: 'select', label: 'Button size', default: 'medium', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }] },
        { sub: 'Colors' },
        { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
        { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000') },
        { key: 'button_background', control: 'color', label: 'Button background', default: '', allowTransparent: true, blankValue: () => OS.themeColor('primary_color', '#103635') },
        { key: 'button_text_color', control: 'color', label: 'Button text', default: '', allowTransparent: true, blankValue: () => '#FFFFFF' },
        { key: 'media_border_radius', control: 'range', label: 'Media border radius', min: 0, max: 40, step: 1, unit: 'px', default: 0 },
        { key: 'open_new_tab', control: 'toggle', label: 'Open link in new tab', default: false },
      ],
      defaults: () => ({
        image: OS.sample.IMG.iwt, video: '', image_width: 45, image_position: 'left', content_position: 'top-left',
        heading: 'A heading for this block', content: 'Add a paragraph of supporting copy to describe this feature or product story.',
        button_text: 'Learn more', button_url: '#', button_style: 'text', button_size: 'medium',
        background: 'transparent', text: '', button_background: '', button_text_color: '', media_border_radius: 0, open_new_tab: false,
      }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('mwt'), kind: 'image', hidden: false, settings: { image: OS.sample.IMG.iwt, image_width: 45, image_position: 'left', content_position: 'top-left', subheading: 'The science of comfort', heading: 'Engineered for your body', content: 'Our linen-feel fabric is breathable, lightweight and designed to move with you all day long.', button_text: 'Explore the technology', button_url: '#', button_style: 'text', button_size: 'medium', media_border_radius: 0 } },
      { id: OS.uid('mwt'), kind: 'image', hidden: false, settings: { image: OS.sample.IMG.iwt2, image_width: 45, image_position: 'right', content_position: 'top-left', subheading: 'Made to last', heading: 'Considered, not disposable', content: 'Every piece is built from durable materials and finished by hand, so it stays with you season after season.', button_text: 'Our story', button_url: '#', button_style: 'underline', button_size: 'medium', media_border_radius: 0 } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob;
      const text = OS.col(s.text, (t.colors && t.colors.text_color) || '#1a1a1a');
      const bg = OS.bgOrTransparent(s.background);
      const padV = OS.secSpace(t, mob), padX = OS.pageGutter(t, mob, { fullWidth: !!s.full_width });
      const gap = SP[s.spacing] != null ? SP[s.spacing] : 40;
      const contentGap = OS.clamp(s.content_gap, 0, 80, 40);
      const themeRad = OS.layoutRadius(t, 'image');
      const list = (blocks || []).filter((b) => !b.hidden);
      const customCss = s.custom_css ? '<style>' + String(s.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      const heading = s.section_heading
        ? '<div class="mwt-shead" style="text-align:' + (mob ? 'center' : s.heading_alignment) + '">' +
          (s.section_subheading ? '<div class="mwt-ssub" style="text-align:inherit">' + OS.esc(s.section_subheading) + '</div>' : '') +
          '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 26 : 34) + 'px">' + OS.esc(s.section_heading) + '</h2></div>'
        : '';
      const btnHtml = (b, blockText) => {
        if (!b.button_text) return '';
        const url = OS.esc(b.button_url || '#');
        const tab = b.open_new_tab ? ' target="_blank" rel="noopener"' : '';
        const size = BTN_SIZE[b.button_size] || BTN_SIZE.medium;
        const sizeCss = 'padding:' + size.pad + ';font-size:' + size.fs + 'px;';
        const btnBg = b.button_background != null && String(b.button_background).trim() !== ''
          ? OS.col(b.button_background, (t.colors && t.colors.primary_color) || '#103635')
          : '';
        const btnFg = b.button_text_color != null && String(b.button_text_color).trim() !== ''
          ? OS.col(b.button_text_color, '#FFFFFF')
          : '';
        if (b.button_style === 'primary') {
          const base = OS.btnStyle(t);
          const over = (btnBg ? 'background:' + btnBg + ';' : '') + (btnFg ? 'color:' + btnFg + ';' : '') + sizeCss;
          return '<a class="mwt-btn" href="' + url + '"' + tab + ' style="' + base + over + '">' + OS.esc(b.button_text) + '</a>';
        }
        if (b.button_style === 'secondary') {
          const base = OS.btnStyle(t, { variant: 'secondary' });
          const over = (btnBg ? 'background:' + btnBg + ';' : '') + (btnFg ? 'color:' + btnFg + ';' : '') + sizeCss;
          return '<a class="mwt-btn" href="' + url + '"' + tab + ' style="' + base + over + '">' + OS.esc(b.button_text) + '</a>';
        }
        const dec = b.button_style === 'underline' ? 'underline' : 'none';
        const linkColor = btnFg || ((t.colors && t.colors.link_color) || blockText);
        const chip = btnBg ? ('background:' + btnBg + ';border-radius:8px;') : '';
        return '<a class="mwt-btn" href="' + url + '"' + tab + ' style="color:' + linkColor + ';font-weight:600;text-decoration:' + dec + ';' + sizeCss + chip + '">' + OS.esc(b.button_text) + (b.button_style === 'text' ? ' →' : '') + '</a>';
      };
      const rows = list.map((b0, i) => {
        const b = b0.settings; const iw = OS.clamp(b.image_width, 30, 60, 45);
        const mediaRad = b.media_border_radius == null ? themeRad : OS.clamp(b.media_border_radius, 0, 40, 0);
        const blockText = OS.col(b.text, text);
        const blockBg = OS.bgOrTransparent(b.background);
        const poster = b.image || OS.sample.IMG.iwt;
        const media = (b.video && String(b.video).trim())
          ? '<div class="mwt-media" style="border-radius:' + mediaRad + 'px"><video src="' + OS.esc(b.video) + '" poster="' + OS.esc(poster) + '" playsinline muted loop autoplay></video></div>'
          : '<div class="mwt-media" style="background-image:url(' + OS.esc(poster) + ');border-radius:' + mediaRad + 'px"></div>';
        const headHtml = richOrText(b.heading);
        const txt = '<div class="mwt-copy" style="' + posStyle(b.content_position) + ';color:' + blockText + (blockBg && blockBg !== 'transparent' ? ';background:' + blockBg + ';padding:16px;border-radius:8px' : '') + '">' +
          (s.show_block_numbers ? '<div class="mwt-num">' + String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0') + '</div>' : '') +
          (b.subheading ? '<div class="mwt-bh">' + OS.esc(b.subheading) + '</div>' : '') +
          (headHtml ? '<div class="mwt-bhead" style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 22 : 28) + 'px">' + headHtml + '</div>' : '') +
          (b.content ? '<div class="mwt-rich">' + b.content + '</div>' : '') + btnHtml(b, blockText) + '</div>';
        const cols = b.image_position === 'right' ? ('1fr ' + iw + '%') : (iw + '% 1fr');
        const inner = b.image_position === 'right' ? txt + media : media + txt;
        return '<div class="mwt-row" data-block-id="' + OS.esc(b0.id) + '" style="grid-template-columns:' + cols + ';gap:' + contentGap + 'px;margin-bottom:' + gap + 'px">' + inner + '</div>';
      }).join('');
      return customCss + '<div class="mwtx' + (mob ? ' mob' : '') + '" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padX + '">' +
        '<div style="max-width:100%;margin:0 auto">' + heading + (list.length ? rows : '<div style="text-align:center;opacity:.5;font-size:13px;padding:24px">Add an image block.</div>') + '</div></div>';
    },
  });
})();

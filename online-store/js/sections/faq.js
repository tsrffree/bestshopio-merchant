/* FAQ — accordion questions + support panel. Ported from faq.canvas.tsx.
   Homogeneous Item blocks (question / answer, max 20). Two layouts: FAQ-and-text / FAQ-and-media.
   Section fields aligned to live FAQ: team avatar, CTA button, text/accordion/button colors, Custom CSS. */
(function () {
  const OS = window.OS;
  OS.css('faq', [
    '.faqx{box-sizing:border-box}',
    '.faqx *{box-sizing:border-box}',
    '.faqx .faq-sub{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:8px}',
    '.faqx h2{margin:0 0 12px;line-height:1.15}',
    '.faqx .faq-rich{font-size:14px;line-height:1.6;opacity:.85}.faqx .faq-rich a{color:inherit}',
    '.faqx .faq-acc{margin-top:18px;border-radius:12px;overflow:hidden}',
    '.faqx .faq-item{border-bottom:1px solid rgba(0,0,0,.08)}',
    '.faqx .faq-q{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;text-align:left;border:0;background:none;cursor:pointer;padding:16px 14px;font-size:15px;font-weight:600;color:inherit;font-family:inherit}',
    '.faqx .faq-chev{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.06);transition:transform .2s}',
    '.faqx .faq-item.open .faq-chev{transform:rotate(180deg)}',
    '.faqx .faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .22s ease}',
    '.faqx .faq-item.open .faq-a{grid-template-rows:1fr}',
    '.faqx .faq-a-in{overflow:hidden}.faqx .faq-a-in .pad{padding:0 14px 16px;font-size:14px;line-height:1.6;opacity:.85}',
    '.faqx .faq-support{margin-top:18px;font-size:13px;opacity:.8;line-height:1.7}',
    '.faqx .faq-avatar{display:block;border-radius:50%;object-fit:cover;margin:0 0 14px}',
    '.faqx .faq-btn{display:inline-flex;align-items:center;justify-content:center;margin-top:14px;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;line-height:1.2;cursor:pointer}',
    '.faqx .faq-media{border-radius:14px;overflow:hidden;background-size:cover;background-position:center;min-height:280px}',
    '.faqx .faq-grid{display:grid;gap:48px;align-items:start}',
    '.faqx .faq-empty{padding:24px;text-align:center;opacity:.6;font-size:13px}',
  ].join(''));

  OS.register('faq', {
    name: 'FAQ', group: 'engagement', icon: 'layers',
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'layout_style', control: 'select', label: 'Layout style', default: 'and-text', options: [{ value: 'and-text', label: 'FAQ and text' }, { value: 'and-media', label: 'FAQ and media' }] },
      { key: 'subheading', control: 'text', label: 'Subheading', default: '' },
      { key: 'heading', control: 'text', label: 'Heading', default: 'FAQ' },
      { key: 'content', control: 'richtext', label: 'Content', default: '' },
      { key: 'team_avatar', control: 'image', label: 'Team avatar', default: '', visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'team_avatar_width', control: 'range', label: 'Team avatar width', min: 48, max: 240, step: 1, unit: 'px', default: 160, visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'support_hours', control: 'text', label: 'Support operating hours', default: '', visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'answer_time', control: 'text', label: 'Average answer time', default: '', visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'button_text', control: 'text', label: 'Button text', default: '', visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'text_position', control: 'segmented', label: 'Text position', default: 'left', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }], visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'media_image', control: 'image', label: 'Media image', default: '', visibleWhen: (s) => s.layout_style === 'and-media' },
      { key: 'media_position', control: 'segmented', label: 'Media position', default: 'right', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }], visibleWhen: (s) => s.layout_style === 'and-media' },
      { key: 'media_width', control: 'range', label: 'Media width', min: 30, max: 60, step: 1, unit: '%', default: 50, visibleWhen: (s) => s.layout_style === 'and-media' },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000'), info: 'Blank inherits the theme body text color.' },
      { key: 'heading_color', control: 'color', label: 'Heading color', default: '', allowTransparent: true, blankValue: () => OS.themeColor('heading_color', '#000000'), info: 'Blank inherits the theme heading color.' },
      { key: 'button_background', control: 'color', label: 'Button background', default: '', allowTransparent: true, blankValue: () => OS.themeColor('primary_color', '#103635'), visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'button_text_color', control: 'color', label: 'Button text', default: '', allowTransparent: true, blankValue: () => '#FFFFFF', visibleWhen: (s) => s.layout_style === 'and-text' },
      { key: 'accordion_background', control: 'color', label: 'Accordion background', default: '#F4F4F4', allowTransparent: true },
      { key: 'accordion_text', control: 'color', label: 'Accordion text', default: '', allowTransparent: true, blankValue: () => OS.themeColor('text_color', '#000000') },
      { sub: 'Advanced' },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.faqx { }', info: 'Applies to this section on this page only.' },
    ],
    blocks: {
      name: 'Item - Question', kind: 'item', max: 20,
      fields: [
        { key: 'question', control: 'text', label: 'Question', default: '', required: true },
        { key: 'answer', control: 'richtext', label: 'Answer', default: '', required: true },
      ],
      defaults: () => ({ question: 'New question', answer: 'Answer text goes here.' }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('faq'), kind: 'item', hidden: false, settings: { question: 'Do you ship overseas?', answer: 'Yes — we ship worldwide. Shipping is calculated at checkout based on your destination.' } },
      { id: OS.uid('faq'), kind: 'item', hidden: false, settings: { question: 'How long does delivery take?', answer: 'Standard delivery is 5–8 business days. Express options are available at checkout.' } },
      { id: OS.uid('faq'), kind: 'item', hidden: false, settings: { question: 'What is your return policy?', answer: 'Returns are free within 30 days of delivery. Items must be unworn with tags attached.' } },
      { id: OS.uid('faq'), kind: 'item', hidden: false, settings: { question: 'Need help with your order?', answer: 'Reach our team any time — we usually reply within a day.' } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob;
      const text = OS.col(s.text, (t.colors && t.colors.text_color) || '#1a1a1a');
      const head = OS.col(s.heading_color, (t.colors && t.colors.heading_color) || '#1a1a1a');
      const accText = OS.col(s.accordion_text, text);
      const bg = OS.bgOrTransparent(s.background);
      const padV = OS.secSpace(t, mob), padX = OS.pageGutter(t, mob, { fullWidth: !!s.full_width });
      const items = (blocks || []).filter((b) => !b.hidden && b.settings.question);
      const accBg = OS.bgOrTransparent(s.accordion_background);
      const customCss = s.custom_css ? '<style>' + String(s.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      const acc = items.length
        ? '<div class="faq-acc" style="background:' + accBg + ';color:' + accText + '">' + items.map((b) =>
            '<div class="faq-item" data-block-id="' + OS.esc(b.id) + '"><button class="faq-q" style="color:' + accText + '">' + OS.esc(b.settings.question) +
            '<span class="faq-chev">' + OS.icon('chev') + '</span></button>' +
            '<div class="faq-a"><div class="faq-a-in"><div class="pad faq-rich" style="color:' + accText + '">' + (b.settings.answer || '') + '</div></div></div></div>').join('') + '</div>'
        : '<div class="faq-empty">Add an FAQ item to get started.</div>';
      const headerBlk = (align) =>
        (s.subheading ? '<div class="faq-sub">' + OS.esc(s.subheading) + '</div>' : '') +
        '<h2 style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? 26 : 34) + 'px;color:' + head + ';text-align:' + align + '">' + OS.esc(s.heading || 'FAQ') + '</h2>' +
        (s.content ? '<div class="faq-rich" style="text-align:' + align + '">' + s.content + '</div>' : '');

      const avatarW = OS.clamp(s.team_avatar_width, 48, 240, 160);
      const avatar = (s.team_avatar && String(s.team_avatar).trim())
        ? '<img class="faq-avatar" src="' + OS.esc(s.team_avatar) + '" alt="" width="' + avatarW + '" height="' + avatarW + '" style="width:' + avatarW + 'px;height:' + avatarW + 'px">'
        : '';
      const btnBg = OS.col(s.button_background, (t.colors && t.colors.primary_color) || '#103635');
      const btnFg = OS.col(s.button_text_color, '#FFFFFF');
      const btn = (s.button_text && String(s.button_text).trim())
        ? '<a class="faq-btn" href="#" style="background:' + btnBg + ';color:' + btnFg + '">' + OS.esc(s.button_text) + '</a>'
        : '';
      const supportBits = avatar +
        ((s.support_hours || s.answer_time)
          ? '<div class="faq-support">' + OS.esc(s.support_hours || '') + (s.answer_time ? (s.support_hours ? '<br>' : '') + OS.esc(s.answer_time) : '') + '</div>'
          : '') +
        btn;
      const support = supportBits ? '<div class="faq-support-wrap">' + supportBits + '</div>' : '';

      let inner;
      if (s.layout_style === 'and-media' && !mob) {
        const mw = OS.clamp(s.media_width, 30, 60, 50);
        const media = '<div class="faq-media" style="background-image:url(' + OS.esc(s.media_image || OS.sample.IMG.iwt) + ')"></div>';
        const copy = '<div>' + headerBlk('left') + acc + '</div>';
        const cols = s.media_position === 'left' ? (mw + '% 1fr') : ('1fr ' + mw + '%');
        inner = '<div class="faq-grid" style="grid-template-columns:' + cols + '">' + (s.media_position === 'left' ? media + copy : copy + media) + '</div>';
      } else if (s.layout_style === 'and-text' && !mob && s.text_position !== 'center') {
        const copy = '<div>' + headerBlk('left') + support + '</div>';
        inner = '<div class="faq-grid" style="grid-template-columns:4fr 6fr">' + (s.text_position === 'right' ? acc + copy : copy + acc) + '</div>';
      } else {
        inner = '<div style="max-width:760px;margin:0 auto;text-align:' + (mob ? 'center' : (s.text_position || 'left')) + '">' + headerBlk(mob ? 'center' : (s.text_position || 'left')) + acc + support + '</div>';
      }
      return customCss + '<div class="faqx" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padX + '">' +
        '<div style="max-width:100%;margin:0 auto">' + inner + '</div></div>';
    },
    hydrate: function (root) {
      const items = [...root.querySelectorAll('.faq-item')];
      let kept = false;
      items.forEach((item) => {
        if (!item.classList.contains('open')) return;
        if (kept) item.classList.remove('open');
        else kept = true;
      });
      root.querySelectorAll('.faq-q').forEach((q) => q.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = q.closest('.faq-item');
        const open = !item.classList.contains('open');
        items.forEach((other) => other.classList.remove('open'));
        if (open) item.classList.add('open');
      }));
    },
  });
})();

(function () {
  const OS = window.OS;

  OS.css('feature-text', [
    '.pdp-feature-text{box-sizing:border-box;width:100%}',
    '.pdp-feature-text *{box-sizing:border-box}',
    '.pdp-feature-text-inner{display:flex;flex-direction:column;gap:9px}',
    '.pdp-feature-text-inner.center{align-items:center;text-align:center}',
    '.pdp-feature-text-inner h2{margin:0;font-size:28px;line-height:1.15}',
    '.pdp-feature-text-inner p{max-width:720px;margin:0;color:inherit;font-size:15px;line-height:1.7;opacity:.78}',
  ].join(''));

  OS.register('feature-text', {
    name: 'Feature text',
    group: 'product-page',
    icon: 'layers',
    pages: ['product'],
    schema: [
      { key: 'heading', control: 'text', label: 'Heading', default: 'Made for everyday movement', maxlength: 100 },
      { key: 'content', control: 'richtext', label: 'Text', default: 'Breathable comfort, thoughtful construction, and an easy shape designed to move with you.', maxlength: 1000 },
      { key: 'container_type', control: 'segmented', label: 'Container type', default: 'default', options: [
        { value: 'default', label: 'Default' },
        { value: 'full', label: 'Full width' },
      ] },
      { key: 'alignment', control: 'segmented', label: 'Text alignment', default: 'left', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ] },
      { key: 'padding_top', control: 'range', label: 'Top padding', min: 0, max: 100, step: 4, unit: 'px', default: 40 },
      { key: 'padding_bottom', control: 'range', label: 'Bottom padding', min: 0, max: 100, step: 4, unit: 'px', default: 40 },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.pdp-feature-text { }' },
    ],
    render: function (settings, blocks, ctx) {
      if (!String(settings.heading || '').trim() && !String(settings.content || '').trim()) return '';
      const theme = ctx.tokens || {};
      const max = settings.container_type === 'full' ? 'none' : OS.pageWidth(theme) + 'px';
      const pad = OS.pagePad(theme, !!ctx.mob);
      const css = settings.custom_css ? '<style>' + String(settings.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      return '<section class="pdp-feature-text" style="padding:' + (settings.padding_top || 0) + 'px ' + pad + 'px ' + (settings.padding_bottom || 0) + 'px">' +
        '<div class="pdp-feature-text-inner ' + (settings.alignment === 'center' ? 'center' : '') + '" style="max-width:' + max + ';margin:0 auto">' +
          (settings.heading ? '<h2 style="font-family:' + OS.headingFamily(theme) + '">' + OS.esc(settings.heading) + '</h2>' : '') +
          (settings.content ? '<p>' + settings.content + '</p>' : '') +
        '</div>' + css + '</section>';
    },
  });
})();

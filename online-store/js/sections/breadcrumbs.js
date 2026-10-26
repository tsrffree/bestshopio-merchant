(function () {
  const OS = window.OS;

  OS.css('breadcrumbs', [
    '.pdp-breadcrumbs{box-sizing:border-box;width:100%}',
    '.pdp-breadcrumbs *{box-sizing:border-box}',
    '.pdp-breadcrumbs-inner{display:flex;align-items:center;gap:8px;min-height:42px;font-size:12px;line-height:1.4}',
    '.pdp-breadcrumbs-inner.center{justify-content:center;text-align:center}',
    '.pdp-breadcrumbs a{color:inherit;text-decoration:none;opacity:.72}',
    '.pdp-breadcrumbs a:hover{text-decoration:underline;text-underline-offset:3px}',
    '.pdp-breadcrumbs .sep{opacity:.36}',
    '.pdp-breadcrumbs .current{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
  ].join(''));

  OS.register('breadcrumbs', {
    name: 'Breadcrumbs',
    group: 'product-page',
    icon: 'link',
    singleton: true,
    pages: ['product'],
    schema: [
      { key: 'container_type', control: 'segmented', label: 'Container type', default: 'default', options: [
        { value: 'default', label: 'Default' },
        { value: 'full', label: 'Full width' },
      ] },
      { key: 'alignment', control: 'segmented', label: 'Text alignment', default: 'left', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ] },
      // PRD: 当前商品名桌面默认关、移动默认开; 关闭后不展示当前商品名.
      { key: 'show_current_desktop', control: 'toggle', label: 'Show current page on desktop', default: false },
      { key: 'show_current_mobile', control: 'toggle', label: 'Show current page on mobile', default: true },
      { key: 'hide_mobile', control: 'toggle', label: 'Hide on mobile', default: false },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.pdp-breadcrumbs { }', info: 'Applies to this section on this page only.' },
    ],
    render: function (settings, blocks, ctx) {
      if (ctx.mob && settings.hide_mobile) return '';
      const product = ctx.resource || {};
      const theme = ctx.tokens || {};
      const max = settings.container_type === 'full' ? 'none' : OS.pageWidth(theme) + 'px';
      const pad = OS.pagePad(theme, !!ctx.mob);
      const mob = !!ctx.mob;
      let showCurrent;
      if (Object.prototype.hasOwnProperty.call(settings, 'show_current_desktop')
        || Object.prototype.hasOwnProperty.call(settings, 'show_current_mobile')) {
        showCurrent = mob ? settings.show_current_mobile !== false : !!settings.show_current_desktop;
      } else {
        // Legacy single toggle: hide_current defaulted to true.
        showCurrent = settings.hide_current === false;
      }
      const current = showCurrent
        ? '<span class="sep">/</span><span class="current">' + OS.esc(product.title || 'Product') + '</span>'
        : '';
      const css = settings.custom_css ? '<style>' + String(settings.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      return '<nav class="pdp-breadcrumbs" aria-label="Breadcrumb" style="padding:0 ' + pad + 'px">' +
        '<div class="pdp-breadcrumbs-inner ' + (settings.alignment === 'center' ? 'center' : '') + '" style="max-width:' + max + ';margin:0 auto">' +
          '<a href="/">Home</a><span class="sep">/</span><a href="/collections">' + OS.esc(product.category || 'Shop') + '</a>' + current +
        '</div>' + css + '</nav>';
    },
  });
})();

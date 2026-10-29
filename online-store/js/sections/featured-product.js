/* Featured product — full in-page buy box for one product. Ported from featured-product.canvas.tsx.
   Bound to a single Product; content is composed from ordered heterogeneous block rows
   (Tag / Title / Price / Rating / Variant picker / Quantity / Buy buttons / Description / Share). */
(function () {
  const OS = window.OS;
  OS.css('featured-product', [
    '.fpx{box-sizing:border-box}.fpx *{box-sizing:border-box}',
    '.fpx .fp-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:start}',
    '.fpx.mob .fp-grid{grid-template-columns:1fr;gap:22px}',
    '.fpx .fp-gallery{display:flex;flex-direction:column;gap:10px}',
    '.fpx .fp-main{aspect-ratio:3/4;background-size:cover;background-position:center;background-color:#f1f2f4}',
    '.fpx .fp-thumbs{display:flex;gap:8px}',
    '.fpx .fp-thumb{width:64px;height:64px;background-size:cover;background-position:center;border-radius:6px;cursor:pointer;border:2px solid transparent}',
    '.fpx .fp-thumb.on{border-color:currentColor}',
    '.fpx .fp-info{display:flex;flex-direction:column;gap:14px}',
    '.fpx .fp-row[data-block-id]{scroll-margin:80px}',
    '.fpx .fp-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:999px}',
    '.fpx .fp-title{margin:0;line-height:1.12}',
    '.fpx .fp-rate{display:flex;align-items:center;gap:6px;font-size:13px}.fpx .fp-rate svg{width:15px;height:15px;color:#f5b301}',
    '.fpx .fp-price{display:flex;align-items:baseline;gap:10px}.fpx .fp-price .now{font-size:24px;font-weight:700}.fpx .fp-price s{opacity:.5;font-size:16px}.fpx .fp-price .save{font-size:12px;font-weight:700;padding:2px 7px;border-radius:4px;color:#fff}',
    '.fpx .fp-vlabel{font-size:12px;font-weight:600;letter-spacing:.02em;margin-bottom:7px;opacity:.75}',
    '.fpx .fp-swatches{display:flex;gap:8px}.fpx .fp-sw{width:30px;height:30px;border-radius:50%;border:1px solid rgba(0,0,0,.15);cursor:pointer;box-shadow:0 0 0 2px transparent}.fpx .fp-sw.on{box-shadow:0 0 0 2px currentColor}',
    '.fpx .fp-sizes{display:flex;gap:8px;flex-wrap:wrap}.fpx .fp-size{min-width:46px;height:38px;padding:0 10px;border:1px solid rgba(0,0,0,.2);border-radius:6px;background:none;cursor:pointer;font-size:13px;font-family:inherit}.fpx .fp-size.on{border-color:currentColor;background:rgba(0,0,0,.04);font-weight:600}',
    '.fpx .fp-qty{display:inline-flex;align-items:center;border:1px solid rgba(0,0,0,.2);border-radius:8px;overflow:hidden}.fpx .fp-qty button{width:38px;height:42px;border:0;background:none;cursor:pointer;font-size:16px}.fpx .fp-qty span{min-width:40px;text-align:center;font-weight:600}',
    '.fpx .fp-buy{display:flex;flex-direction:column;gap:10px;margin-top:4px}',
    '.fpx .fp-buy-row{display:flex;align-items:center;gap:12px;width:100%}',
    '.fpx .fp-add.full{width:100%;flex:none}',
    '.fpx .fp-add{flex:1;width:100%;min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-weight:700}',
    '.fpx .fp-atc-ic{display:inline-flex;align-items:center;justify-content:center;flex:none;line-height:0}',
    '.fpx .fp-atc-ic svg{display:block;width:20px;height:20px}',
    '.fpx .fp-atc-label{line-height:1;font:inherit;font-size:inherit;font-weight:inherit}',
    '.fpx .fp-buynow{width:100%;min-height:46px;border:1px solid rgba(0,0,0,.2);background:#fff;cursor:pointer;font:inherit;font-weight:700}',
    '.fpx .fp-dyn{display:flex;flex-direction:column;gap:8px;align-items:center;width:100%}',
    '.fpx .fp-paypal,.fpx .fp-chan{display:inline-flex;align-items:center;justify-content:center;width:100%;height:46px;border:0;cursor:pointer;padding:0 16px;font:inherit;font-weight:650}',
    '.fpx .fp-paypal{background:#ffc439;color:#003087}',
    '.fpx .fp-chan.apple{background:#111;color:#fff}',
    '.fpx .fp-chan.google{background:#fff;color:#202124;border:1px solid #dadce0}',
    '.fpx .fp-pay-more{padding:0;border:0;background:none;color:inherit;font:inherit;font-size:13px;text-decoration:underline;cursor:pointer}',
    '.fpx .fp-safe{margin-top:6px;text-align:center;width:100%}',
    /* Divider label always stays centered; Layout only moves the logo row */
    '.fpx .fp-safe-label{display:flex;align-items:center;gap:8px;justify-content:center;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.8}',
    '.fpx .fp-safe-label:before,.fpx .fp-safe-label:after{content:"";flex:1;height:1px;background:rgba(0,0,0,.18)}',
    '.fpx .fp-safe-logos{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;margin-top:8px}',
    '.fpx .fp-safe.align-left .fp-safe-logos{justify-content:flex-start}',
    '.fpx .fp-safe.align-right .fp-safe-logos{justify-content:flex-end}',
    '.fpx .fp-safe-logo{display:inline-flex;align-items:center;justify-content:center;height:var(--fp-safe-h,26px);min-width:calc(var(--fp-safe-h,26px) * 1.55);padding:0 6px;border:1px solid rgba(0,0,0,.12);border-radius:4px;background:#fff;font-size:9px;font-weight:700;box-sizing:border-box}',
    '.fpx .fp-safe-logo.is-img{min-width:0;padding:0;border:0;background:transparent}',
    '.fpx .fp-safe-logo img{display:block;height:var(--fp-safe-h,26px);width:auto;max-width:calc(var(--fp-safe-h,26px) * 2.4);object-fit:contain}',
    '.fpx .fp-qty-inline{display:inline-flex;align-items:center;width:120px;height:46px;border:1px solid rgba(0,0,0,.2);overflow:hidden;flex:none}',
    '.fpx .fp-qty-inline button{width:36px;height:100%;border:0;background:none;cursor:pointer}',
    '.fpx .fp-qty-inline span{min-width:36px;text-align:center;font-weight:600}',
    '.fpx .fp-desc-h{font-size:13px;font-weight:700;margin-bottom:6px}',
    '.fpx .fp-rich{font-size:14px;line-height:1.65;opacity:.9}.fpx .fp-rich a{color:inherit}',
    '.fpx .fp-share{display:flex;gap:10px;align-items:center;font-size:13px}.fpx .fp-share a{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(0,0,0,.15);text-decoration:none;color:inherit}',
  ].join(''));

  const TAG_SZ = { large: 13, medium: 12, small: 11 };

  const BLOCK_KINDS = {
    tag: { name: 'Tag', icon: 'label', fields: [
      { key: 'tag_text', control: 'text', label: 'Tag text', default: 'Best seller' },
      { key: 'tag_color', control: 'color', label: 'Tag color', default: '', allowTransparent: true, info: 'Blank inherits the theme primary color.' },
    ], defaults: () => ({}) },
    title: { name: 'Title', icon: 'heading', fields: [
      { key: 'title_size', control: 'select', label: 'Title size', default: 'large', options: [{ value: 'large', label: 'Large' }, { value: 'medium', label: 'Medium' }, { value: 'small', label: 'Small' }] },
    ], defaults: () => ({}) },
    rating: { name: 'Rating', icon: 'starLine', fields: [], defaults: () => ({}) },
    price: { name: 'Price', icon: 'priceTag', fields: [
      { key: 'show_compare_at', control: 'toggle', label: 'Show compare-at price', default: true },
      { key: 'show_savings', control: 'toggle', label: 'Show savings text', default: true },
    ], defaults: () => ({}) },
    variant: { name: 'Variant picker', icon: 'variant', fields: [
      { key: 'picker_type', control: 'segmented', label: 'Picker type', default: 'buttons', options: [{ value: 'buttons', label: 'Buttons' }, { value: 'dropdown', label: 'Dropdown' }] },
    ], defaults: () => ({}) },
    quantity: { name: 'Quantity selector', fields: [], defaults: () => ({}) },
    buy: { name: 'Buy buttons', icon: 'cart', fields: [
      { sub: 'Add to cart' },
      { key: 'show_quantity', control: 'toggle', label: 'Show quantity selector', default: false },
      { key: 'show_add', control: 'toggle', label: 'Show Add-to-cart button', default: true },
      { key: 'button_text', control: 'text', label: 'Add to cart text', default: 'Add to cart', visibleWhen: (v) => v.show_add !== false },
      { key: 'atc_layout', control: 'segmented', label: 'Add to cart style', default: 'with-quantity', options: [
        { value: 'with-quantity', label: 'With quantity' }, { value: 'full-width', label: 'Full width' },
      ], visibleWhen: (v) => v.show_add !== false },
      { key: 'atc_icon', control: 'select', label: 'Add to cart icon', default: 'bag-plus', options: ((window.OS_THEME_ICONS && window.OS_THEME_ICONS.options) ? window.OS_THEME_ICONS.options(true) : [{ value: 'none', label: 'None' }, { value: 'bag-plus', label: 'Bag plus' }, { value: 'gift', label: 'Gift' }, { value: 'heart', label: 'Heart' }, { value: 'star', label: 'Star' }]), visibleWhen: (v) => v.show_add !== false, info: 'Default is shopping bag with plus. Pick None to hide, or any icon from the theme library.' },
      { key: 'atc_background', control: 'color', label: 'Add to cart background', default: '#FFC439', allowTransparent: true, blankValue: () => '#FFC439', info: 'Defaults to PayPal yellow. T = transparent.', visibleWhen: (v) => v.show_add !== false },
      { key: 'atc_text_color', control: 'color', label: 'Add to cart text', default: '#FFFFFF', allowTransparent: true, blankValue: () => '#FFFFFF', info: 'Defaults to white. T = transparent.', visibleWhen: (v) => v.show_add !== false },
      { key: 'atc_shape', control: 'segmented', label: 'Button shape', default: 'pill', options: [
        { value: 'normal', label: 'Normal' }, { value: 'pill', label: 'Pill' }, { value: 'square', label: 'Square' }, { value: 'custom', label: 'Custom' },
      ] },
      { key: 'atc_custom_radius', control: 'range', label: 'Custom radius', min: 0, max: 40, step: 1, unit: 'px', default: 8, visibleWhen: (v) => (v.atc_shape || v.button_shape) === 'custom' },
      { sub: 'Dynamic checkout' },
      { key: 'show_dynamic', control: 'toggle', label: 'Show dynamic checkout buttons', default: true },
      { key: 'channels', control: 'multiselect', label: 'Channels', default: ['buy_now', 'paypal'], options: [
        { value: 'buy_now', label: 'Buy now' }, { value: 'paypal', label: 'PayPal' }, { value: 'apple_pay', label: 'Apple Pay' }, { value: 'google_pay', label: 'Google Pay' },
      ], visibleWhen: (v) => !!v.show_dynamic },
      { key: 'buy_now_text', control: 'text', label: 'Buy now label', default: 'Buy now', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'buy_now_background', control: 'color', label: 'Buy now background', default: '#000000', allowTransparent: true, blankValue: () => '#000000', info: 'Defaults to black. T = transparent.', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'buy_now_text_color', control: 'color', label: 'Buy now text', default: '#FFFFFF', allowTransparent: true, blankValue: () => '#FFFFFF', info: 'Defaults to white. T = transparent.', visibleWhen: (v) => !!v.show_dynamic && Array.isArray(v.channels) && v.channels.indexOf('buy_now') >= 0 },
      { key: 'dyn_shape', control: 'segmented', label: 'Button shape', default: 'normal', options: [
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
      { key: 'trust_logos', control: 'multiselect', label: 'Trust logos', default: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay'], options: [
        { value: 'norton', label: 'Norton' }, { value: 'mcafee', label: 'McAfee' }, { value: 'money_back', label: 'Money back' },
        { value: 'visa', label: 'Visa' }, { value: 'mastercard', label: 'Mastercard' }, { value: 'amex', label: 'Amex' },
        { value: 'discover', label: 'Discover' }, { value: 'diners', label: 'Diners Club' }, { value: 'amazon', label: 'Amazon' },
        { value: 'paypal', label: 'PayPal' }, { value: 'apple_pay', label: 'Apple Pay' },
        { value: 'google_pay', label: 'Google Pay' }, { value: 'venmo', label: 'Venmo' }, { value: 'bancontact', label: 'Bancontact' }, { value: 'giropay', label: 'Giropay' },
      ], visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
      { key: 'trust_logo_size', control: 'range', label: 'Logo size', min: 20, max: 56, step: 1, unit: 'px', default: 28, visibleWhen: (v) => !!v.show_dynamic && !!v.show_safe_checkout },
    ], defaults: () => ({}) },
    description: { name: 'Description', icon: 'text', fields: [
      { key: 'heading', control: 'text', label: 'Heading', default: 'Details' },
      { key: 'content', control: 'richtext', label: 'Description', default: 'Add product details, materials and care instructions here.' },
    ], defaults: () => ({}) },
    share: { name: 'Share buttons', fields: [], defaults: () => ({}) },
  };

  OS.register('featured-product', {
    name: 'Featured product', group: 'products', icon: 'grid',
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { key: 'product', control: 'product', label: 'Product', default: 'p1', required: true, info: 'Pick the product this buy box sells.' },
      { key: 'enable_image_zoom', control: 'toggle', label: 'Enable image zoom', default: true },
      { sub: 'Colors' },
      { key: 'background', control: 'color', label: 'Background', default: 'transparent', allowTransparent: true },
      { key: 'text', control: 'color', label: 'Text', default: '', allowTransparent: true },
    ],
    blocks: { kinds: BLOCK_KINDS, max: 12 },
    defaultBlocks: () => ([
      { id: OS.uid('fp'), kind: 'tag', hidden: false, settings: { tag_text: 'Best seller' } },
      { id: OS.uid('fp'), kind: 'title', hidden: false, settings: { title_size: 'large' } },
      { id: OS.uid('fp'), kind: 'rating', hidden: false, settings: {} },
      { id: OS.uid('fp'), kind: 'price', hidden: false, settings: { show_compare_at: true, show_savings: true } },
      { id: OS.uid('fp'), kind: 'variant', hidden: false, settings: { picker_type: 'buttons' } },
      { id: OS.uid('fp'), kind: 'quantity', hidden: false, settings: {} },
      { id: OS.uid('fp'), kind: 'buy', hidden: false, settings: { show_quantity: false, show_add: true, button_text: 'Add to cart', atc_layout: 'with-quantity', atc_icon: 'bag-plus', atc_background: '#FFC439', atc_text_color: '#FFFFFF', atc_shape: 'pill', atc_custom_radius: 8, show_dynamic: true, channels: ['buy_now', 'paypal'], buy_now_text: 'Buy now', buy_now_background: '#000000', buy_now_text_color: '#FFFFFF', dyn_shape: 'normal', dyn_custom_radius: 8, show_payment_options: true, channel_logo: true, show_safe_checkout: true, safe_checkout_align: 'center', safe_checkout_label: 'GUARANTEED SAFE CHECKOUT', trust_logos: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay'], trust_logo_size: 28 } },
      { id: OS.uid('fp'), kind: 'description', hidden: false, settings: { heading: 'Details', content: 'Soft, breathable linen-feel fabric with a relaxed fit. Machine washable. Designed in-house and made to last.' } },
    ]),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens, mob = ctx.mob, c = t.colors || {};
      const p = OS.sample.products.find((x) => x.id === s.product) || OS.sample.products[0];
      const text = OS.col(s.text, c.text_color || '#1a1a1a');
      const bg = OS.bgOrTransparent(s.background);
      const padV = OS.secSpace(t, mob), padH = OS.pagePad(t, mob);
      const maxW = s.full_width ? '100%' : OS.pageWidth(t) + 'px';
      const sale = p.compareAt && p.compareAt > p.price, pct = sale ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
      const saleColor = c.sale_price_color || '#d92d20';
      const thumbs = (p.images && p.images.length) ? p.images.slice(0, 4) : [p.image];

      const rowHtml = (b0) => {
        const b = b0.settings, kind = b0.kind; let body = '';
        if (kind === 'tag') { if (!b.tag_text) return ''; body = '<span class="fp-tag" style="background:' + OS.hexAlpha(OS.col(b.tag_color, c.primary_color || '#103635'), .12) + ';color:' + OS.col(b.tag_color, c.primary_color || '#103635') + '">' + OS.esc(b.tag_text) + '</span>'; }
        else if (kind === 'title') { const px = { large: 30, medium: 24, small: 20 }[b.title_size] || 30; body = '<h2 class="fp-title" style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, mob ? px * 0.82 : px) + 'px;color:' + OS.col(s.text, c.heading_color || '#1a1a1a') + '">' + OS.esc(p.title) + '</h2>'; }
        else if (kind === 'rating') { if (!p.rating) return ''; let st = ''; for (let i = 1; i <= 5; i++) st += '<span style="color:' + (p.rating >= i ? '#f5b301' : '#d8dce3') + '">' + OS.icon('star') + '</span>'; body = '<div class="fp-rate">' + st + ' <b>' + p.rating + '</b> <span style="opacity:.6">(' + (p.reviews || 0) + ' reviews)</span></div>'; }
        else if (kind === 'price') { body = '<div class="fp-price"><span class="now"' + (sale ? ' style="color:' + saleColor + '"' : '') + '>' + OS.money(p.price) + '</span>' + (sale && b.show_compare_at ? '<s>' + OS.money(p.compareAt) + '</s>' : '') + (sale && b.show_savings ? '<span class="save" style="background:' + saleColor + '">Save ' + OS.money(p.compareAt - p.price) + '</span>' : '') + '</div>'; }
        else if (kind === 'variant') {
          const sw = (p.swatches || ['#222', '#ccc']).map((cl, i) => '<button class="fp-sw' + (i === 0 ? ' on' : '') + '" style="background:' + cl + '"></button>').join('');
          const sizes = ['S', 'M', 'L', 'XL'].map((z, i) => b.picker_type === 'dropdown' ? '' : '<button class="fp-size' + (i === 1 ? ' on' : '') + '">' + z + '</button>').join('');
          const sizeBlock = b.picker_type === 'dropdown'
            ? '<select class="fp-size" style="height:40px;width:160px">' + ['S', 'M', 'L', 'XL'].map((z) => '<option>' + z + '</option>').join('') + '</select>'
            : '<div class="fp-sizes">' + sizes + '</div>';
          body = '<div><div class="fp-vlabel">Color</div><div class="fp-swatches">' + sw + '</div></div><div style="margin-top:12px"><div class="fp-vlabel">Size</div>' + sizeBlock + '</div>';
        }
        else if (kind === 'quantity') { body = '<div><div class="fp-vlabel">Quantity</div><div class="fp-qty"><button data-q="-">−</button><span>1</span><button data-q="+">+</button></div></div>'; }
        else if (kind === 'buy') {
          const shapeRadius = (shape, custom) => (shape === 'pill' ? 999 : (shape === 'square' ? 0 : (shape === 'custom' ? Number(custom == null ? 8 : custom) : 8)));
          const atcShape = b.atc_shape || b.button_shape || 'normal';
          const dynShape = b.dyn_shape || b.button_shape || 'normal';
          const atcRadiusStyle = 'border-radius:' + shapeRadius(atcShape, b.atc_custom_radius != null ? b.atc_custom_radius : b.custom_radius) + 'px';
          const dynRadiusStyle = 'border-radius:' + shapeRadius(dynShape, b.dyn_custom_radius != null ? b.dyn_custom_radius : b.custom_radius) + 'px';
          const atcFull = b.atc_layout === 'full-width';
          const allowed = ['buy_now', 'paypal', 'apple_pay', 'google_pay'];
          let channels = Array.isArray(b.channels) ? b.channels.filter((id) => allowed.indexOf(id) >= 0) : null;
          if (channels == null) channels = ['buy_now', 'paypal'];
          if (b.show_buy_now && channels.indexOf('buy_now') < 0) channels = ['buy_now'].concat(channels);
          if (!channels.length && b.show_paypal) channels = ['paypal'];
          const showDyn = b.show_dynamic !== false || !!b.show_paypal;
          const showPayMore = showDyn && channels.length > 0 && b.show_payment_options !== false;
          const buyNowLabel = b.buy_now_text || 'Buy now';
          const atcColorStyle = (b.atc_background ? ';background:' + b.atc_background : '') + (b.atc_text_color ? ';color:' + b.atc_text_color : '') + ';border:0;font:inherit;font-weight:700';
          const buyNowColorStyle = ';background:' + (b.buy_now_background || '#fff') + ';color:' + (b.buy_now_text_color || 'inherit') + ';border:0';
          const paySrc = {
            visa: 'settings/assets/payments/visa.svg', mastercard: 'settings/assets/payments/mastercard.svg', amex: 'settings/assets/payments/amex.svg',
            discover: 'settings/assets/payments/discover.svg', diners: 'settings/assets/payments/diners.svg', paypal: 'settings/assets/payments/paypal-logo.svg',
            apple_pay: 'settings/assets/payments/applepay.svg', google_pay: 'settings/assets/payments/googlepay.svg', amazon: 'settings/assets/payments/amazonpay.svg',
          };
          const trustMap = { norton: 'Norton', mcafee: 'McAfee', money_back: '100% Money Back', paypal: 'PayPal', visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', discover: 'Discover', diners: 'Diners Club', amazon: 'Amazon', apple_pay: 'Apple Pay', google_pay: 'Google Pay', venmo: 'Venmo', bancontact: 'Bancontact', giropay: 'Giropay' };
          const chanBtn = (id) => {
            if (id === 'buy_now') return '<button type="button" class="fp-buynow" style="' + dynRadiusStyle + buyNowColorStyle + '">' + OS.esc(buyNowLabel) + '</button>';
            if (id === 'paypal') return '<button type="button" class="fp-paypal" style="' + dynRadiusStyle + '">PayPal</button>';
            const map = { apple_pay: ['apple', 'Apple Pay'], google_pay: ['google', 'G Pay'] };
            const m = map[id];
            if (!m) return '';
            return '<button type="button" class="fp-chan ' + m[0] + '" style="' + dynRadiusStyle + '">' + OS.esc(m[1]) + '</button>';
          };
          const dynHtml = showDyn ? channels.map(chanBtn).join('') : '';
          const dyn = (dynHtml || showPayMore) ? '<div class="fp-dyn">' + dynHtml + (showPayMore ? '<button type="button" class="fp-pay-more">More payment options</button>' : '') + '</div>' : '';
          const trustList = (Array.isArray(b.trust_logos) && b.trust_logos.length ? b.trust_logos : ['norton', 'paypal', 'visa', 'mastercard', 'mcafee', 'money_back']).filter((id) => id && id !== 'shop');
          const logoSize = Math.max(20, Math.min(56, Number(b.trust_logo_size == null ? 28 : b.trust_logo_size)));
          const safeAlign = ({ left: 'left', right: 'right' }[b.safe_checkout_align] || 'center');
          const safe = (showDyn && b.show_safe_checkout)
            ? '<div class="fp-safe align-' + safeAlign + '" style="--fp-safe-h:' + logoSize + 'px"><div class="fp-safe-label">' + OS.esc(b.safe_checkout_label || 'GUARANTEED SAFE CHECKOUT') + '</div><div class="fp-safe-logos">' + trustList.map((id) => {
              const label = trustMap[id] || id;
              if (paySrc[id]) return '<span class="fp-safe-logo is-img" title="' + OS.esc(label) + '"><img src="' + OS.esc(paySrc[id]) + '" alt="' + OS.esc(label) + '"></span>';
              return '<span class="fp-safe-logo">' + OS.esc(label) + '</span>';
            }).join('') + '</div></div>'
            : '';
          const qty = b.show_quantity ? '<div class="fp-qty-inline" style="' + atcRadiusStyle + '"><button type="button" data-q="-">-</button><span>1</span><button type="button" data-q="+">+</button></div>' : '';
          const atcIcon = b.atc_icon == null ? 'bag-plus' : b.atc_icon;
          const atcIconHtml = (atcIcon && atcIcon !== 'none' && window.OS_THEME_ICONS)
            ? '<span class="fp-atc-ic" aria-hidden="true">' + window.OS_THEME_ICONS.svg(atcIcon, 20) + '</span>'
            : '';
          const add = b.show_add !== false
            ? '<button class="fp-add' + (atcFull ? ' full' : '') + '" style="' + OS.btnStyle(t) + ';' + atcRadiusStyle + atcColorStyle + '">' + atcIconHtml + '<span class="fp-atc-label">' + OS.esc(b.button_text || 'Add to cart') + '</span></button>'
            : '';
          let primary = '';
          if (qty || add) {
            primary = atcFull
              ? ((qty ? '<div class="fp-buy-row">' + qty + '</div>' : '') + add)
              : '<div class="fp-buy-row">' + qty + add + '</div>';
          }
          body = '<div class="fp-buy">' + primary + dyn + safe + '</div>';
        }
        else if (kind === 'description') { if (!b.content) return ''; body = (b.heading ? '<div class="fp-desc-h">' + OS.esc(b.heading) + '</div>' : '') + '<div class="fp-rich">' + b.content + '</div>'; }
        else if (kind === 'share') { body = '<div class="fp-share"><span style="opacity:.7">Share</span><a>f</a><a>𝕏</a><a>◎</a></div>'; }
        return '<div class="fp-row" data-block-id="' + OS.esc(b0.id) + '">' + body + '</div>';
      };

      const info = '<div class="fp-info">' + (blocks || []).filter((b) => !b.hidden).map(rowHtml).join('') + '</div>';
      const gallery = '<div class="fp-gallery"><div class="fp-main" data-fp-main style="background-image:url(' + OS.esc(p.image) + ');border-radius:' + OS.layoutRadius(t, 'image') + 'px"></div>' +
        '<div class="fp-thumbs">' + thumbs.map((im, i) => '<div class="fp-thumb' + (i === 0 ? ' on' : '') + '" data-fp-thumb style="background-image:url(' + OS.esc(im) + ')"></div>').join('') + '</div></div>';
      return '<div class="fpx' + (mob ? ' mob' : '') + '" style="background:' + bg + ';color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padV + 'px ' + padH + 'px">' +
        '<div style="max-width:' + maxW + ';margin:0 auto"><div class="fp-grid">' + gallery + info + '</div></div></div>';
    },
    hydrate: function (root) {
      const main = root.querySelector('[data-fp-main]');
      root.querySelectorAll('[data-fp-thumb]').forEach((th) => th.addEventListener('click', (e) => { e.stopPropagation(); root.querySelectorAll('[data-fp-thumb]').forEach((x) => x.classList.remove('on')); th.classList.add('on'); if (main) main.style.backgroundImage = th.style.backgroundImage; }));
      root.querySelectorAll('.fp-sw,.fp-size').forEach((el) => el.tagName !== 'SELECT' && el.addEventListener('click', (e) => { e.stopPropagation(); const sib = el.parentElement.children; [].forEach.call(sib, (x) => x.classList && x.classList.remove('on')); el.classList.add('on'); }));
      const span = root.querySelector('.fp-qty span'); let q = 1;
      root.querySelectorAll('.fp-qty [data-q]').forEach((bn) => bn.addEventListener('click', (e) => { e.stopPropagation(); q = Math.max(1, q + (bn.getAttribute('data-q') === '+' ? 1 : -1)); if (span) span.textContent = q; }));
    },
  });
})();

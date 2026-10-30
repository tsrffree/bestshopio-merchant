/* Shared theme icon catalog for Badges / Icon with text / Collapsible / Feature cards / Text with icon.
   Same component surfaces must share this set so capability does not shrink by location. */
(function () {
  const PATHS = {
    apple: '<path d="M10.4 4.2c.4-1.1 1.4-1.9 2.5-2.1-.1 1.2-.7 2.3-1.7 3-.5.4-1.2.7-1.9.7-.1-1.1.4-2.2 1.1-2.6z"/><path d="M13.8 11c0 2.4 1.9 3.5 1.9 3.5s-1.6 4.5-3.8 4.5c-.9 0-1.5-.6-2.5-.6s-1.6.6-2.5.6C5 18.9 3 14.7 3 11.7c0-2.9 1.9-4.4 3.7-4.4.9 0 1.7.6 2.4.6.7 0 1.4-.7 2.5-.7 1.3 0 2.3.5 2.9 1.3-.7.4-1.1 1.2-1.1 2.1 0 .2 0 .3.1.4z"/>',
    banana: '<path d="M4.5 14.5c1.8 1.8 4.2 2.5 6.8 2.2 2.2-.3 4-1.5 5.2-3.2"/><path d="M5.2 13.8c.8-2.8 2.4-5 4.8-6.5 1.8-1.1 3.6-1.6 5.5-1.6"/><path d="M15.5 5.7c.6-.4 1.2-1.2 1.5-2"/>',
    'bag-plus': '<path d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"/><path d="M14.608 12.563v5m2.5-2.5h-5"/>',
    bottle: '<path d="M8.2 3.5h3.6v2.2l1.4 1.4v9.4a1.5 1.5 0 0 1-1.5 1.5H8.3a1.5 1.5 0 0 1-1.5-1.5V7.1l1.4-1.4V3.5z"/><path d="M8.2 3.5h3.6"/><path d="M7.2 9.2h5.6"/>',
    box: '<path d="M3.2 6.4 10 3.2l6.8 3.2v7.2L10 16.8 3.2 13.6z"/><path d="M3.2 6.4 10 9.6l6.8-3.2"/><path d="M10 9.6v7.2"/>',
    carrot: '<path d="M10.8 4.2c.8.8.9 2 .3 2.9L5.5 15.8c-.4.6-1.3.7-1.9.2-.6-.4-.7-1.3-.2-1.9l5.6-7.3c.8-.9 2-1.1 2.8-.4z"/><path d="M11.2 4.8c.4-1.2 1.4-2.2 2.7-2.5"/><path d="M12.2 5.6c1.1-.2 2.2.1 3 .8"/>',
    'chat-bubble': '<path d="M4.2 4.8h11.6a1.5 1.5 0 0 1 1.5 1.5v6.2a1.5 1.5 0 0 1-1.5 1.5H9.4L5.8 16.8v-2.8H4.2A1.5 1.5 0 0 1 2.7 12.5V6.3A1.5 1.5 0 0 1 4.2 4.8z"/><path d="M6.5 8.4h7M6.5 11h4.8"/>',
    'check-mark': '<path d="m4.5 10.2 3.6 3.6 7.4-7.6"/>',
    clipboard: '<path d="M7.2 3.8h5.6a1 1 0 0 1 1 1V5h1.2a1.2 1.2 0 0 1 1.2 1.2v9.5a1.2 1.2 0 0 1-1.2 1.2H4.8a1.2 1.2 0 0 1-1.2-1.2V6.2A1.2 1.2 0 0 1 4.8 5H6V4.8a1 1 0 0 1 1.2-1z"/><path d="M7.2 5h5.6"/><path d="M6.8 9h6.4M6.8 11.6h6.4M6.8 14.2h4"/>',
    dairy: '<path d="M6.2 7.2h7.6l.8 9.2H5.4l.8-9.2z"/><path d="M7 7.2V5.6c0-1.4 1.2-2.4 3-2.4s3 1 3 2.4v1.6"/><path d="M7.2 11.2h5.6"/>',
    'dairy-free': '<path d="M6.2 7.2h7.6l.8 9.2H5.4l.8-9.2z"/><path d="M7 7.2V5.6c0-1.4 1.2-2.4 3-2.4s3 1 3 2.4v1.6"/><path d="m4.2 4.2 11.6 11.6"/>',
    dryer: '<rect x="3.5" y="2.8" width="13" height="14.4" rx="1.6"/><circle cx="10" cy="11" r="3.4"/><path d="M6.2 5.2h1.6M8.8 5.2h1.6"/>',
    eye: '<path d="M2.8 10s2.4-4.4 7.2-4.4S17.2 10 17.2 10s-2.4 4.4-7.2 4.4S2.8 10 2.8 10z"/><circle cx="10" cy="10" r="2.2"/>',
    fire: '<path d="M10 17.2c-2.8 0-4.8-1.9-4.8-4.6 0-1.8 1-3.1 2.1-4.1.4 1.4 1.2 2.2 2.1 2.5-.2-1.6.4-3.2 1.6-4.5 1.5 1.7 2.9 3.5 2.9 5.9 0 2.8-1.8 4.8-3.9 4.8z"/>',
    'gluten-free': '<path d="M10 3.2c2.2 1.8 3.6 4.2 3.6 6.8 0 2.8-1.5 5.2-3.6 6.8-2.1-1.6-3.6-4-3.6-6.8 0-2.6 1.4-5 3.6-6.8z"/><path d="M6.8 8.4h6.4M6.4 11.6h7.2"/><path d="m4.2 4.2 11.6 11.6"/>',
    heart: '<path d="M10 16.2S4.2 12.6 3.2 9.2a3.4 3.4 0 0 1 6-2.1 3.4 3.4 0 0 1 6 2.1c-1 3.4-5.2 7-5.2 7z"/>',
    iron: '<path d="M4.2 13.2h10.4a2.4 2.4 0 0 0 2.2-3.4L14.2 5.2H8.4L4.2 13.2z"/><path d="M4.2 15.2h8.8"/><path d="M6.2 8.6h3.2"/>',
    leaf: '<path d="M5 15.2C5 9 9.2 5.2 16.2 4.6 15.6 11.6 11.8 15.8 5.6 15.8"/><path d="M5.4 15.2c2.2-2.6 4.4-4.4 7.4-5.6"/>',
    leather: '<path d="M4.5 7.5c0-1.8 1.6-3.2 3.5-3.2h4c1.9 0 3.5 1.4 3.5 3.2v7.2c0 .8-.7 1.5-1.5 1.5H6c-.8 0-1.5-.7-1.5-1.5V7.5z"/><path d="M7.2 8.8h5.6"/><path d="M10 4.3v2.4"/>',
    'lightning-bolt': '<path d="M11.2 2.8 6.2 11h3.4l-.8 6.2 5.8-8.8H11l.2-5.6z"/>',
    lipstick: '<path d="M8.4 8.2h3.2v8.4H8.4z"/><path d="M8.8 8.2V5.4c0-.8.6-1.4 1.2-1.4s1.2.6 1.2 1.4v2.8"/><path d="M8.4 11h3.2"/>',
    lock: '<rect x="4.5" y="8.5" width="11" height="8" rx="1.5"/><path d="M7 8.5V6.4a3 3 0 0 1 6 0v2.1"/><circle cx="10" cy="12.4" r=".8"/>',
    'map-pin': '<path d="M10 17.2s-5.2-4.2-5.2-8.1a5.2 5.2 0 1 1 10.4 0c0 3.9-5.2 8.1-5.2 8.1z"/><circle cx="10" cy="9" r="2"/>',
    'nut-free': '<path d="M10 3.5c2.6 0 4.8 2.4 4.8 6.2S12.6 16.5 10 16.5 5.2 13.5 5.2 9.7 7.4 3.5 10 3.5z"/><path d="M8.2 7.8c.6-.6 1.4-.9 2.2-.8"/><path d="m4.2 4.2 11.6 11.6"/>',
    pants: '<path d="M6.2 3.5h7.6l.8 13H11.4L10 10.2 8.6 16.5H5.4l.8-13z"/><path d="M6.4 6.2h7.2"/>',
    'paw-print': '<circle cx="6.2" cy="7" r="1.4"/><circle cx="13.8" cy="7" r="1.4"/><circle cx="8" cy="4.6" r="1.2"/><circle cx="12" cy="4.6" r="1.2"/><path d="M10 9.2c2.2 0 3.8 1.5 3.8 3.2 0 1.2-1 1.8-2.2 1.8H8.4c-1.2 0-2.2-.6-2.2-1.8 0-1.7 1.6-3.2 3.8-3.2z"/>',
    pepper: '<path d="M10.2 4.2c.4-.8 1.2-1.4 2.2-1.5"/><path d="M9.2 5.2c2.6-.4 5 1.2 5.6 3.8.8 3.4-1.4 7.6-4.4 8.6-2.2.8-4.4-.6-5-2.8-.8-3 1.2-8.8 3.8-9.6z"/>',
    perfume: '<path d="M7.4 8.2h5.2l.8 8.2H6.6l.8-8.2z"/><path d="M8.4 8.2V6.4h3.2v1.8"/><path d="M9.2 4.2h1.6v2.2H9.2z"/><path d="M8.2 11.4h3.6"/>',
    plane: '<path d="M3.2 10.8 17 4.4l-3.4 11.4-2.6-3.4-2.8 1.4.4-2.6-5.4-.4z"/><path d="m10.2 11.2 2.4 3.1"/>',
    world: '<circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2.2 2.4 3.3 4.8 3.3 7s-1.1 4.6-3.3 7c-2.2-2.4-3.3-4.8-3.3-7S7.8 5.4 10 3z"/>',
    beach: '<path d="M4 16.5c2.2-1.2 4.4-1.8 6.5-1.8s4.3.6 6.5 1.8"/><path d="M10 14.5V6.2"/><path d="M10 6.2c2.4-.2 4.2 1.2 4.6 3.2-1.6.2-3.2-.4-4.6-1.6z"/><path d="M10 6.2C7.6 6 5.8 7.4 5.4 9.4c1.6.2 3.2-.4 4.6-1.6z"/>',
    plant: '<path d="M10 16.8V10"/><path d="M10 10c-2.4-2.8-5.2-3.2-6.8-2.6C4 10.8 6.6 13 10 13"/><path d="M10 9.2c2.2-2.4 4.8-2.8 6.4-2.2C15.6 10 13.2 12 10 12"/>',
    'price-tag': '<path d="M3.5 10.2 10.1 3.6h5.4v5.4L8.9 15.6a1.4 1.4 0 0 1-2 0L3.5 12.2a1.4 1.4 0 0 1 0-2z"/><circle cx="13.2" cy="6.8" r="1"/>',
    'question-mark': '<circle cx="10" cy="10" r="7.2"/><path d="M8.2 7.8c.3-.9 1.1-1.5 2.1-1.5 1.2 0 2 .7 2 1.8 0 1.2-1 1.6-1.7 2-.5.3-.8.7-.8 1.4"/><path d="M10 14.4h.01"/>',
    recycle: '<path d="M7.2 4.8 5.4 7.8h3.6"/><path d="M12.8 4.8 14.6 7.8h-3.6"/><path d="M10 15.8 7.2 12h5.6"/><path d="M5.8 8.2c-.6 1-.8 2.2-.4 3.4"/><path d="M14.2 8.2c.6 1 .8 2.2.4 3.4"/><path d="M8.4 13.6c1 .8 2.4 1.1 3.6.6"/>',
    return: '<path d="M4 10a6 6 0 1 0 1.8-4.3"/><path d="M4 3.5v3.2h3.2"/>',
    ruler: '<path d="M4.2 12.8 12.8 4.2l3 3-8.6 8.6-3-3z"/><path d="m6.4 10.6 1.2-1.2M8 9 9.2 7.8M9.6 7.4l1.2-1.2M11.2 5.8l1.2-1.2"/>',
    'serving-dish': '<path d="M3.5 11.2c0-3.4 2.9-5.8 6.5-5.8s6.5 2.4 6.5 5.8"/><path d="M3.2 11.8h13.6"/><path d="M5.2 14.8h9.6"/><path d="M10 5.4V3.8"/>',
    shirt: '<path d="M7.2 4.2 10 6.2l2.8-2 2.6 1.6-1.6 2.4v8.6H6.2V8.2L4.6 5.8z"/>',
    shoe: '<path d="M3.5 12.4c1.4-.4 2.8-.4 4.2.2 1.2.5 2.4.8 3.8.6l3.8-.4c1.2-.2 2.2.8 1.8 1.9H3.8c-.8 0-1.2-.8-.3-2.3z"/><path d="M5.2 12.2V9.4c0-1.2.8-2.2 2-2.4l3.4-.6c1.4-.2 2.6.8 2.8 2.2l.2 2.2"/>',
    silhouette: '<circle cx="10" cy="6.2" r="2.6"/><path d="M4.8 16.8c.6-3.2 2.6-5 5.2-5s4.6 1.8 5.2 5"/>',
    snowflake: '<path d="M10 3.2v13.6M4.4 6.8l11.2 6.4M15.6 6.8 4.4 13.2"/><path d="M8.2 4.4 10 3.2l1.8 1.2M8.2 15.6 10 16.8l1.8-1.2M5.2 8.4l-1.4.8.6 1.5M14.8 11.3l1.4-.8-.6-1.5M14.8 8.4l1.4.8-.6 1.5M5.2 11.3l-1.4-.8.6-1.5"/>',
    star: '<path d="m10 3.2 1.7 3.6 4 .5-2.9 2.7.8 3.9L10 12.1 6.4 14l.8-3.9L4.3 7.3l4-.5z"/>',
    stopwatch: '<circle cx="10" cy="11" r="6"/><path d="M8.4 3.4h3.2M10 3.4V5M10 11l2.4-2.4"/>',
    truck: '<path d="M2.5 6.5h9v6h-9z"/><path d="M11.5 8.5h3.2L17 11v1.5h-5.5z"/><circle cx="6" cy="14.2" r="1.2"/><circle cx="14.2" cy="14.2" r="1.2"/>',
    washing: '<rect x="3.8" y="2.8" width="12.4" height="14.4" rx="1.6"/><circle cx="10" cy="11" r="3.2"/><path d="M7.2 5h5.6"/>',
    moon: '<path d="M16.2 12.2A6.5 6.5 0 0 1 8.2 4.2 5.8 5.8 0 1 0 16.2 12.2z"/>',
    drop: '<path d="M10 3c2.8 3.2 4.8 5.6 4.8 8a4.8 4.8 0 1 1-9.6 0c0-2.4 2-4.8 4.8-8z"/>',
    flask: '<path d="M7.5 3h5M8.2 3v5L4.8 14.2A1.7 1.7 0 0 0 6.3 16.8h7.4a1.7 1.7 0 0 0 1.5-2.6L11.8 8V3"/><path d="M6.8 12h6.4"/>',
    gift: '<rect x="3.5" y="8" width="13" height="9" rx="1"/><path d="M2.5 8h15M10 8v9"/><path d="M10 8C7.8 8 6.2 6.8 6.2 5.6A1.6 1.6 0 0 1 10 4.8c2.2 0 3.8 1.2 3.8 2.4C13.8 7.8 12.2 8 10 8z"/>',
    support: '<path d="M4.5 12v-.8a5.5 5.5 0 0 1 11 0v.8"/><path d="M15.5 12.8a1.6 1.6 0 0 1-1.6 1.6h-.8V10h.8a1.6 1.6 0 0 1 1.6 1.6z"/><path d="M4.5 12.8a1.6 1.6 0 0 0 1.6 1.6h.8V10H6.1a1.6 1.6 0 0 0-1.6 1.6z"/><path d="M10 16.2h1.6"/>',
    shield: '<path d="M10 2.8 4.5 5v4.2c0 3.4 2.4 6.5 5.5 7.4 3.1-.9 5.5-4 5.5-7.4V5z"/><path d="m7.5 10 1.8 1.8 3.4-3.4"/>',
    percent: '<circle cx="6.6" cy="6.6" r="2.1"/><circle cx="13.4" cy="13.4" r="2.1"/><path d="m14.5 5.5-9 9"/>',
    tag: '<path d="M3.2 10.2 9.8 3.6h5.2v5.2L8.4 15.4a1.4 1.4 0 0 1-2 0L3.2 12.2a1.4 1.4 0 0 1 0-2z"/><circle cx="13.2" cy="6.8" r="1"/>',
  };

  const ALIASES = {
    none: '',
    package: 'box',
    currency: 'price-tag',
    star4: 'star',
    check: 'check-mark',
    bag: 'bag-plus',
    cart: 'bag-plus',
    'shopping-bag': 'bag-plus',
    globe: 'world',
    earth: 'world',
  };

  const LABELS = Object.keys(PATHS).sort().map((k) => ({
    value: k,
    label: k.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  }));

  function resolve(name) {
    if (!name || name === 'none') return '';
    return ALIASES[name] || name;
  }

  function svg(name, size) {
    const key = resolve(name);
    if (!key || !PATHS[key]) return '';
    const px = size || 20;
    return '<svg viewBox="0 0 20 20" width="' + px + '" height="' + px + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PATHS[key] + '</svg>';
  }

  function options(includeNone) {
    const list = includeNone === false ? [] : [{ value: 'none', label: 'None' }];
    return list.concat(LABELS);
  }

  function assetUrl(name) {
    const key = resolve(name);
    if (!key) return '';
    return 'online-store/assets/theme-icons/' + key + '.svg';
  }

  const API = {
    paths: PATHS,
    aliases: ALIASES,
    labels: LABELS,
    options: options,
    svg: svg,
    resolve: resolve,
    assetUrl: assetUrl,
    files: Object.keys(PATHS).sort().map((k) => ({ file: k + '.svg', name: 'Icon ' + k.replace(/-/g, ' ') })),
  };

  window.OS_THEME_ICONS = API;
  if (window.OS) window.OS.themeIcons = API;
})();

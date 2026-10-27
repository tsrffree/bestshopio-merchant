/* Product information — the required PDP buy box.
   Settings follow the Theme PDP research: breadcrumb, desktop media layout / size,
   mobile expanded vs contained, zoom, video chrome, purchase-area colors, trust badge,
   padding, and an add-to-cart popup. Blocks are the purchase-column rows. */
(function () {
  const OS = window.OS;
  OS.css('product-main', [
    '.pdpx{box-sizing:border-box;position:relative}.pdpx *{box-sizing:border-box}',
    '.pdpx .pdp-crumbs{font-size:12px;letter-spacing:.04em;text-transform:uppercase;margin:0 0 16px;opacity:.7}',
    '.pdpx .pdp-crumbs a{color:inherit;text-decoration:none}',
    '.pdpx .pdp-grid{display:grid;gap:30px;align-items:start}',
    '.pdpx.mob .pdp-grid{grid-template-columns:1fr!important;gap:30px}',
    '.pdpx .pdp-media{min-width:0}',
    '.pdpx .pdp-media.expanded{margin-left:-16px;margin-right:-16px}',
    '.pdpx .pdp-stage{position:relative;overflow:hidden}',
    '.pdpx .pdp-nav{position:absolute;top:50%;z-index:4;display:grid;place-items:center;width:44px;height:44px;margin:0;padding:0;border:1px solid rgba(34,34,34,.16);border-radius:50%;background:#fff;color:#222;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .28s ease,background .2s ease,color .2s ease,border-color .2s ease,transform .28s ease}',
    '.pdpx .pdp-nav svg{width:16px;height:16px;display:block;transition:transform .22s ease}',
    '.pdpx .pdp-nav.prev{left:14px;transform:translate(-10px,-50%)}',
    '.pdpx .pdp-nav.next{right:14px;transform:translate(10px,-50%)}',
    '.pdpx .pdp-stage:hover .pdp-nav,.pdpx .pdp-stage:focus-within .pdp-nav{opacity:1;pointer-events:auto}',
    '.pdpx .pdp-stage:hover .pdp-nav.prev,.pdpx .pdp-stage:focus-within .pdp-nav.prev{transform:translate(0,-50%)}',
    '.pdpx .pdp-stage:hover .pdp-nav.next,.pdpx .pdp-stage:focus-within .pdp-nav.next{transform:translate(0,-50%)}',
    '.pdpx .pdp-nav:hover,.pdpx .pdp-nav:focus-visible{background:#111;color:#fff;border-color:#111}',
    '.pdpx .pdp-nav.prev:hover svg,.pdpx .pdp-nav.prev:focus-visible svg{transform:translateX(-3px)}',
    '.pdpx .pdp-nav.next:hover svg,.pdpx .pdp-nav.next:focus-visible svg{transform:translateX(3px)}',
    '.pdpx.mob .pdp-nav{opacity:1;pointer-events:auto}',
    '.pdpx.mob .pdp-nav.prev,.pdpx.mob .pdp-nav.next{transform:translate(0,-50%)}',
    '.pdpx .pdp-slide{position:absolute;inset:0;z-index:2;background:#f1f2f4 center/cover no-repeat;pointer-events:none;will-change:transform}',
    '.pdpx .pdp-slide.from-right{animation:pdp-slide-in-right .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.from-left{animation:pdp-slide-in-left .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.to-left{animation:pdp-slide-out-left .42s cubic-bezier(.22,.61,.36,1) both}',
    '.pdpx .pdp-slide.to-right{animation:pdp-slide-out-right .42s cubic-bezier(.22,.61,.36,1) both}',
    '@keyframes pdp-slide-in-right{from{transform:translateX(100%)}to{transform:translateX(0)}}',
    '@keyframes pdp-slide-in-left{from{transform:translateX(-100%)}to{transform:translateX(0)}}',
    '@keyframes pdp-slide-out-left{from{transform:translateX(0)}to{transform:translateX(-100%)}}',
    '@keyframes pdp-slide-out-right{from{transform:translateX(0)}to{transform:translateX(100%)}}',
    '@media (prefers-reduced-motion:reduce){.pdpx .pdp-nav,.pdpx .pdp-nav svg{transition:none}.pdpx .pdp-nav.prev,.pdpx .pdp-nav.next{transform:translate(0,-50%)}.pdpx .pdp-slide{animation:none!important}}',
    '.pdpx .pdp-cell{position:relative;display:block;width:100%;border:0;padding:0;background:#f1f2f4 center/cover no-repeat;cursor:pointer;overflow:hidden}',
    '.pdpx .pdp-cell.zoomable{cursor:zoom-in}',
    '.pdpx .pdp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.pdpx .pdp-highlight{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:1fr 1fr;gap:8px}',
    '.pdpx .pdp-highlight .pdp-cell:first-child{grid-row:1/span 2;min-height:420px}',
    '.pdpx .pdp-carousel{display:grid;gap:8px}',
    '.pdpx .pdp-carousel.left{grid-template-columns:var(--pdp-thumb,72px) 1fr}',
    '.pdpx .pdp-thumbs{display:flex;gap:var(--pdp-thumb-gap,8px)}',
    '.pdpx .pdp-carousel.left .pdp-thumbs{flex-direction:column}',
    '.pdpx .pdp-thumb{width:var(--pdp-thumb,64px);height:var(--pdp-thumb,64px);flex:0 0 auto;border-radius:4px;border:1px solid transparent;background:#f1f2f4 center/cover no-repeat;padding:0;cursor:pointer;box-sizing:border-box}',
    '.pdpx .pdp-carousel:not(.left) .pdp-thumb{flex:1 1 0;width:auto;height:auto;min-width:0;aspect-ratio:1/1}',
    '.pdpx .pdp-carousel.left .pdp-thumb{width:100%;height:auto;aspect-ratio:1/1}',
    '.pdpx[data-media-size="small"]{--pdp-thumb:56px;--pdp-thumb-gap:6px}',
    '.pdpx[data-media-size="medium"]{--pdp-thumb:72px;--pdp-thumb-gap:8px}',
    '.pdpx[data-media-size="large"]{--pdp-thumb:96px;--pdp-thumb-gap:10px}',
    '.pdpx .pdp-thumb.on{border-color:currentColor}',
    '.pdpx .pdp-dots{display:flex;justify-content:center;gap:6px;margin-top:10px}',
    '.pdpx .pdp-dot{width:7px;height:7px;border-radius:50%;border:0;background:rgba(0,0,0,.2);padding:0;cursor:pointer}',
    '.pdpx .pdp-dot.on{background:currentColor}',
    '.pdpx .pdp-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:18px;box-shadow:0 8px 20px rgba(0,0,0,.18)}',
    '.pdpx .pdp-play i{margin-left:3px}',
    '.pdpx .pdp-video-ui{position:absolute;left:10px;right:10px;bottom:10px;display:flex;align-items:center;gap:8px}',
    '.pdpx .pdp-chip{height:28px;min-width:28px;border-radius:999px;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:700}',
    '.pdpx .pdp-time{flex:1;height:3px;border-radius:99px;background:rgba(255,255,255,.45);position:relative}',
    '.pdpx .pdp-time i{position:absolute;left:0;top:0;bottom:0;width:35%;background:#fff;border-radius:99px}',
    '.pdpx .pdp-badge{position:absolute;z-index:2;display:grid;place-items:center;background:#fff;color:#111;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:50%;box-shadow:0 6px 16px rgba(0,0,0,.12);text-align:center;line-height:1.15;padding:8px}',
    '.pdpx .pdp-badge.img{background:center/contain no-repeat;border-radius:0;box-shadow:none;padding:0}',
    '.pdpx .pdp-badge.tl{top:12px;left:12px}.pdpx .pdp-badge.tr{top:12px;right:12px}',
    '.pdpx .pdp-badge.bl{bottom:12px;left:12px}.pdpx .pdp-badge.br{bottom:12px;right:12px}',
    '.pdpx .pdp-buy{display:flex;flex-direction:column;gap:0;border-radius:0}',
    '.pdpx .pdp-row{margin:0}',
    '.pdpx .pdp-row+.pdp-row{margin-top:24px}',
    '.pdpx .pdp-kind-badges+.pdp-kind-title{margin-top:20px}',
    '.pdpx .pdp-row+.pdp-kind-price,.pdpx .pdp-row+.pdp-kind-description,.pdpx .pdp-row+.pdp-kind-inventory{margin-top:16px}',
    '.pdpx .pdp-kind-shipping+.pdp-kind-icon_text,.pdpx .pdp-kind-icon_text+.pdp-kind-icon_text,.pdpx .pdp-kind-icon_text+.pdp-kind-shipping{margin-top:12px}',
    '.pdpx .pdp-row+.pdp-kind-actions{margin-top:11px}',
    '.pdpx .pdp-row+.pdp-kind-buy,.pdpx .pdp-kind-buy+.pdp-row{margin-top:32px}',
    '.pdpx .pdp-kind-recommendations+.pdp-kind-collapsible{margin-top:12px}',
    '.pdpx .pdp-kind-collapsible+.pdp-kind-collapsible{margin-top:0}',
    '.pdpx.mob .pdp-row+.pdp-row{margin-top:20px}',
    '.pdpx.mob .pdp-kind-badges+.pdp-kind-title{margin-top:16px}',
    '.pdpx.mob .pdp-row+.pdp-kind-price,.pdpx.mob .pdp-row+.pdp-kind-description,.pdpx.mob .pdp-row+.pdp-kind-inventory{margin-top:12px}',
    '.pdpx.mob .pdp-kind-shipping+.pdp-kind-icon_text,.pdpx.mob .pdp-kind-icon_text+.pdp-kind-icon_text,.pdpx.mob .pdp-kind-icon_text+.pdp-kind-shipping{margin-top:8px}',
    '.pdpx.mob .pdp-row+.pdp-kind-actions{margin-top:7px}',
    '.pdpx.mob .pdp-row+.pdp-kind-buy,.pdpx.mob .pdp-kind-buy+.pdp-row{margin-top:24px}',
    '.pdpx.mob .pdp-kind-recommendations+.pdp-kind-collapsible{margin-top:8px}',
    '.pdpx.mob .pdp-kind-collapsible+.pdp-kind-collapsible{margin-top:0}',
    '.pdpx .pdp-row[data-block-id]{scroll-margin:80px}',
    '.pdpx .pdp-title{margin:0;line-height:1.15}',
    '.pdpx .pdp-title-desc{font-size:14px;line-height:1.55}',
    '.pdpx .pdp-title-desc img{display:block;max-width:100%;margin-top:8px;border-radius:8px}',
    '.pdpx .pdp-vendor{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.65}',
    '.pdpx{position:relative}',
    '.pdpx .pdp-tags{display:flex;flex-wrap:wrap;gap:8px}',
    '.pdpx .pdp-tags.is-overlay{position:absolute;z-index:3;top:12px;left:12px;max-width:48%}',
    '.pdpx .pdp-tags.is-overlay[data-badge-position="top-right"]{left:auto;right:12px;justify-content:flex-end}',
    '.pdpx .pdp-tag{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:2px 8px;border-radius:5px;background:#5b3f94;color:#fff;font-size:14.4px;font-weight:700;line-height:18px;letter-spacing:normal}',
    '.pdpx .pdp-tag svg,.pdpx .pdp-tag img{width:12px;height:12px;flex:none;object-fit:contain}',
    '.pdpx .pdp-tag.sale{background:#d63a2f}.pdpx .pdp-tag.sold{background:#4b5563}',
    '.pdpx .pdp-rate{display:flex;align-items:center;gap:6px;font-size:13px;line-height:1}',
    '.pdpx .pdp-rate-stars{display:inline-flex;align-items:center;gap:2px;flex:none}',
    '.pdpx .pdp-rate-st{display:inline-grid;place-items:center;width:1.15em;height:1.15em;border-radius:2px;flex:none}',
    '.pdpx .pdp-rate-st svg{display:block;width:72%;height:72%}',
    '.pdpx .pdp-rate > span:not(.pdp-rate-stars):not(.pdp-rate-st){display:inline-flex;align-items:center;line-height:1}',
    '.pdpx .pdp-price{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.pdpx .pdp-price .now,.os-frame.os-store .pdpx .pdp-price .now{font-size:22px;font-weight:700;line-height:32px}',
    '.pdpx .pdp-price s{font-size:16px;font-weight:400;line-height:26px;color:#666;opacity:1;text-decoration-thickness:1px}',
    '.pdpx .pdp-price .save{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:2px 8px;border-radius:5px;background:#d63a2f;color:#fff;font-size:14.4px;font-weight:700;line-height:18px}',
    '.pdpx .pdp-price .save svg{width:12px;height:12px;flex:none}',
    '.pdpx .pdp-line{border:0;border-top:1px solid rgba(0,0,0,.12);margin:2px 0}',
    '.pdpx .pdp-label{font-size:12px;font-weight:650;letter-spacing:.02em;margin-bottom:12px;opacity:.75;line-height:26px}',
    '.pdpx .pdp-options{display:flex;flex-direction:column}',
    '.pdpx .pdp-option+.pdp-option{margin-top:20px}',
    '.pdpx .pdp-option .pdp-label{display:flex;align-items:center;gap:4px;margin-bottom:12px;font-size:16px;font-weight:500;line-height:24px;letter-spacing:0;opacity:1;color:#222}',
    '.pdpx .pdp-opt-val{font-weight:400}',
    '.pdpx .pdp-swatches{display:flex;flex-wrap:wrap;margin:0 -5px}',
    '.pdpx .pdp-sw{width:40px;height:40px;margin:5px;border:0;border-radius:50%;padding:0;cursor:pointer;background-position:center;background-size:cover;background-repeat:no-repeat;box-shadow:0 0 0 1px rgba(34,34,34,.1);transition:box-shadow .25s ease,transform .25s ease}',
    '.pdpx .pdp-sw.pdp-sw-img{border-radius:8px}',
    '.pdpx .pdp-sw:hover{box-shadow:0 0 0 1px #222,0 8px 20px rgba(34,34,34,.2),inset 0 0 0 4px #fff;transform:scale(1.1)}',
    '.pdpx .pdp-sw.on{box-shadow:0 0 0 1px #222,inset 0 0 0 4px #fff}',
    '.pdpx .pdp-sw.shape-circle,.pdpx .pdp-size.shape-circle{border-radius:50%}',
    '.pdpx .pdp-sw.shape-square,.pdpx .pdp-size.shape-square{border-radius:0}',
    '.pdpx .pdp-sw.sold,.pdpx .pdp-size.sold{position:relative;opacity:.4}',
    '.pdpx .pdp-sw.sold:before,.pdpx .pdp-size.sold:before{content:"";position:absolute;inset:0;background:linear-gradient(to bottom right,transparent calc(50% - 1px),#eee 50%,transparent calc(50% + 1px));z-index:1}',
    '.pdpx .pdp-sw.sold:before{border-radius:50%}',
    '.pdpx .pdp-sizes{display:flex;flex-wrap:wrap;margin:0 -5px}',
    '.pdpx .pdp-size{min-width:45px;margin:5px;padding:10px;border:1px solid #eee;border-radius:5px;background:transparent;cursor:pointer;font:400 16px/1.3 inherit;color:#222;text-transform:capitalize;transition:.25s}',
    '.pdpx .pdp-size:hover{border-color:#222}',
    '.pdpx .pdp-size.on{background:#222;border-color:#222;color:#fff}',
    '.pdpx .pdp-dd{position:relative;width:100%}',
    '.pdpx .pdp-dd-btn{display:flex;align-items:center;width:100%;max-width:100%;min-height:48px;height:48px;margin:0;padding:0 40px 0 14px;border:1px solid rgba(0,0,0,.2);border-radius:8px;background:#fff url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1.5l5 5 5-5%27 fill=%27none%27 stroke=%27%23222%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E") no-repeat right 14px center;background-size:12px 8px;font:400 16px/1.3 inherit;color:#222;text-align:left;cursor:pointer;box-sizing:border-box}',
    '.pdpx .pdp-dd-btn:hover{border-color:#222}',
    '.pdpx .pdp-dd.open .pdp-dd-btn,.pdpx .pdp-dd-btn:focus{outline:none;border-color:#222;box-shadow:0 0 0 1px #222}',
    '.pdpx .pdp-dd-btn span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pdpx .pdp-dd-menu{display:none;position:fixed;z-index:80;max-height:240px;overflow:auto;margin:0;padding:6px 0;border:1px solid rgba(0,0,0,.16);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(0,0,0,.14);box-sizing:border-box}',
    '.pdpx .pdp-dd.open .pdp-dd-menu{display:block}',
    '.pdpx .pdp-dd-opt{display:block;width:100%;margin:0;padding:10px 14px;border:0;background:transparent;color:#222;font:400 15px/1.35 inherit;text-align:left;cursor:pointer;box-sizing:border-box}',
    '.pdpx .pdp-dd-opt:hover,.pdpx .pdp-dd-opt:focus{background:#f3f4f6;outline:none}',
    '.pdpx .pdp-dd-opt.on{font-weight:650}',
    '.pdpx .pdp-dd-opt[disabled]{opacity:.4;cursor:default}',
    '.pdpx .pdp-dd-opt.sold{color:#6b7280}',
    '.pdpx .pdp-qty{display:inline-flex;align-items:center;width:125px;height:48px;border:1px solid rgba(0,0,0,.2);border-radius:8px;overflow:hidden}',
    '.pdpx .pdp-qty button{width:38px;height:100%;border:0;background:transparent;cursor:pointer;font-size:16px;color:inherit}',
    '.pdpx .pdp-qty span{min-width:36px;text-align:center;font-weight:650}',
    // Match Silix .product__inventory: #10a443, DM Sans 16/400/26, 10px pulse dot
    '.pdpx .pdp-stock{--status-color:#10a443;display:flex;align-items:center;gap:0 8px;margin:0;font-family:inherit;font-size:16px;font-weight:400;line-height:26px;letter-spacing:normal;color:#10a443;color:var(--status-color)}',
    '.pdpx .pdp-stock > span{font:inherit;font-size:16px;font-weight:400;line-height:26px;letter-spacing:normal;color:inherit}',
    '.pdpx .pdp-stock i{position:relative;width:10px;height:10px;margin:0 4px;border-radius:50%;background:var(--status-color);display:block;flex:none}',
    '.pdpx .pdp-stock i::before,.pdpx .pdp-stock i::after{position:absolute;left:0;top:0;width:100%;height:100%;content:"";background:var(--status-color);border-radius:50%;animation:pdp-inventory-pulse 2s linear infinite}',
    '.pdpx .pdp-stock i::after{animation-delay:1s}',
    '.pdpx .pdp-stock.sold{--status-color:#9ca3af}',
    '.pdpx .pdp-stock.sold i::before,.pdpx .pdp-stock.sold i::after{animation:none}',
    '.pdpx .pdp-stock.low{--status-color:#f59e0b}',
    '.pdpx .pdp-stock.low i::before,.pdpx .pdp-stock.low i::after{animation:none}',
    '.pdpx .pdp-stock.style-badge{display:inline-flex;padding:4px 10px;border-radius:999px;background:color-mix(in srgb, var(--status-color) 14%, #fff);}',
    '.pdpx .pdp-stock.style-text i{display:none}',
    '@keyframes pdp-inventory-pulse{0%{opacity:.6}100%{transform:scale(2.5);opacity:0}}',
    '.pdpx .pdp-sku{font-size:13px;opacity:.72}',
    '.pdpx .pdp-actions{display:flex;flex-direction:column;gap:20px}',
    '.pdpx .pdp-actions.side{flex-direction:row;align-items:stretch;flex-wrap:wrap;gap:12px}',
    '.pdpx .pdp-actions.side .pdp-buy-row{flex:1 1 220px}',
    '.pdpx .pdp-actions.side .pdp-dyn{flex:1 1 160px}',
    '.pdpx .pdp-buy-row{display:flex;align-items:center;gap:12px}',
    '.pdpx .pdp-buy-row .pdp-qty{flex:none}',
    '.pdpx .pdp-atc{flex:1;width:auto;min-height:48px}',
    '.pdpx .pdp-buy-row .pdp-atc,.pdpx .pdp-paypal,.pdpx .pdp-chan{border-radius:8px}',
    '.pdpx .pdp-paypal,.pdpx .pdp-chan{display:inline-flex;align-items:center;justify-content:center;width:100%;height:48px;border:0;border-radius:8px;cursor:pointer;padding:0 16px;font:inherit;font-weight:650}',
    '.pdpx .pdp-paypal{background:#ffc439}',
    '.pdpx .pdp-paypal:hover{background:#f2bb31}',
    '.pdpx .pdp-paypal svg,.pdpx .pdp-chan svg{display:block;height:22px;width:auto}',
    '.pdpx .pdp-chan.shop{background:#5a31f4;color:#fff}',
    '.pdpx .pdp-chan.apple{background:#111;color:#fff}',
    '.pdpx .pdp-chan.google{background:#fff;color:#202124;border:1px solid #dadce0}',
    '.pdpx .pdp-chan.amazon{background:#ff9900;color:#111}',
    '.pdpx .pdp-chan.card{background:#fff;color:#111;border:1px solid rgba(0,0,0,.14);font-size:12px;letter-spacing:.04em}',
    '.pdpx .pdp-dyn{display:flex;flex-direction:column;gap:8px;align-items:center;width:100%}',
    '.pdpx .pdp-pay-more{padding:0;border:0;background:none;color:inherit;font:inherit;font-size:14px;line-height:1.4;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    '.pdpx .pdp-pays{display:flex;flex-wrap:wrap;gap:6px}',
    '.pdpx .pdp-pay{font-size:10px;font-weight:800;letter-spacing:.04em;border:1px solid rgba(0,0,0,.12);border-radius:3px;padding:3px 6px;opacity:.8}',
    '.pdpx .pdp-icons{display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px}',
    '.pdpx .pdp-icons.vertical{flex-direction:column;align-items:flex-start;gap:8px}',
    '.pdpx .pdp-icon-item{display:flex;align-items:center;height:var(--pdp-icon-line,26px);gap:8px;line-height:var(--pdp-icon-line,26px);font-weight:400}',
    '.pdpx .pdp-icon-mark{display:grid;place-items:center;width:var(--pdp-icon-size,20px);height:var(--pdp-icon-size,20px);flex:none;color:currentColor}',
    '.pdpx .pdp-icon-mark svg{display:block;width:100%;height:100%}',
    '.pdpx .pdp-icon-img{width:var(--pdp-icon-size,20px);height:var(--pdp-icon-size,20px);flex:none;object-fit:contain}',
    '.pdpx .pdp-custom-text{font-size:14px;line-height:1.6}',
    '.pdpx .pdp-property{display:grid;gap:6px}.pdpx .pdp-property input{height:40px;padding:0 10px;border:1px solid rgba(0,0,0,.2);border-radius:7px;font:inherit}',
    '.pdpx .pdp-link-actions{display:flex;align-items:center;flex-wrap:wrap;gap:0 24px;min-height:48px}',
    '.pdpx .pdp-link-actions button{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:none;color:inherit;font:inherit;font-size:16px;font-weight:500;line-height:30px;text-decoration:none;cursor:pointer}',
    '.pdpx .pdp-link-actions button svg{display:block;width:20px;height:20px;flex:none}',
    '.pdpx .pdp-share-tile{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.pdpx .pdp-share-tile a,.pdpx .pdp-share-tile button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(0,0,0,.12);border-radius:8px;background:#fff;color:inherit;padding:0;cursor:pointer;text-decoration:none}',
    '.pdpx .pdp-share-tile.mono a,.pdpx .pdp-share-tile.mono button{color:#111}',
    '.pdpx .pdp-share-tile.brand a[data-net=facebook]{color:#1877f2}',
    '.pdpx .pdp-share-tile.brand a[data-net=x]{color:#111}',
    '.pdpx .pdp-share-tile.brand a[data-net=pinterest]{color:#e60023}',
    '.pdpx .pdp-share-inline{display:flex;flex-wrap:wrap;gap:16px;align-items:center}',
    '.pdpx .pdp-share-inline a,.pdpx .pdp-share-inline button{display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:inherit;font:inherit;font-size:14px;font-weight:550;cursor:pointer;text-decoration:none;padding:0}',
    '.pdpx .pdp-share-dd{position:relative;display:inline-flex}',
    '.pdpx .pdp-popup-link{padding:0;border:0;background:none;color:inherit;font:inherit;font-size:13px;font-weight:650;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    '.pdpx .pdp-popup-link.hover-fx:hover{opacity:.72}',
    '.pdpx .pdp-ship{font-size:13px;line-height:1.55}',
    '.pdpx .pdp-ship strong{display:block;margin-bottom:4px}',
    '.pdpx .pdp-acc{border-bottom:1px solid rgba(0,0,0,.12)}',
    '.pdpx .pdp-acc button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;background:transparent;padding:20px 0;font:inherit;font-weight:650;text-align:left;cursor:pointer;color:inherit}',
    '.pdpx .pdp-acc.icon-left button{flex-direction:row-reverse;justify-content:flex-end}',
    '.pdpx .pdp-acc.icon-left button .pdp-acc-mark{order:-1}',
    '.pdpx .pdp-acc .body{display:none;padding:0 0 12px;font-size:14px;line-height:1.6;opacity:.85}',
    '.pdpx .pdp-acc.open .body{display:block}',
    '.pdpx .pdp-rec-h{font-size:15px;margin:0 0 4px}',
    '.pdpx .pdp-rec-sub{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:4px}',
    '.pdpx .pdp-rec-copy{font-size:13px;opacity:.75;margin-bottom:10px}',
    '.pdpx .pdp-rec-row{display:grid;gap:10px}',
    '.pdpx .pdp-rec-card{text-align:left;font-size:12px}',
    '.pdpx .pdp-rec-card .im{aspect-ratio:3/4;background:#f1f2f4 center/cover no-repeat;border-radius:8px;margin-bottom:6px}',
    '.pdpx .pdp-rec-card b{display:block;font-weight:650;line-height:1.3}',
    '.pdpx .pdp-progress{height:3px;border-radius:99px;background:rgba(0,0,0,.08);margin-top:10px;overflow:hidden}',
    '.pdpx .pdp-progress i{display:block;height:100%;width:40%;background:currentColor;opacity:.7}',
    '.pdpx .pdp-sticky{display:flex;align-items:center;gap:12px;margin-top:18px;padding:10px 12px;border:1px solid rgba(0,0,0,.08);border-radius:12px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.06)}',
    '.pdpx .pdp-sticky img{width:46px;height:46px;object-fit:cover;border-radius:8px}',
    '.pdpx .pdp-sticky .meta{flex:1;min-width:0}',
    '.pdpx .pdp-sticky .meta b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pdpx .pdp-pop,.pdpx .pdp-zoom{position:absolute;inset:0;z-index:6;background:rgba(17,24,39,.45);display:none;align-items:flex-start;justify-content:center;padding:28px 16px}',
    '.pdpx .pdp-pop.on,.pdpx .pdp-zoom.on{display:flex}',
    '.pdpx .pdp-pop-card{width:min(420px,100%);background:#fff;color:#1a1a1a;border-radius:12px;padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.2)}',
    '.pdpx .pdp-pop-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:16px}',
    '.pdpx .pdp-pop-head strong{font-size:16px;font-weight:650}',
    '.pdpx .pdp-pop-x{width:28px;height:28px;padding:0;border:1px solid rgba(0,0,0,.18);border-radius:6px;background:#fff;color:#111;font-size:18px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
    '.pdpx .pdp-pop-item{display:flex;gap:12px;align-items:center}',
    '.pdpx .pdp-pop-item img{width:72px;height:90px;object-fit:cover;border-radius:8px;background:#f3f4f6}',
    '.pdpx .pdp-pop-item .nm{font-weight:700}',
    '.pdpx .pdp-pop-item .sub{font-size:12px;opacity:.65;margin-top:2px}',
    '.pdpx .pdp-pop-actions{display:flex;flex-direction:column;gap:8px;margin-top:14px}',
    '.pdpx .pdp-pop-recs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}',
    '.pdpx .pdp-zoom img{max-width:min(720px,100%);max-height:100%;object-fit:contain;border-radius:8px;background:#fff}',
    '.pdpx .pdp-pop[data-pdp-share-pop]{background:rgba(0,0,0,.5);padding:16px;align-items:center;justify-content:center}',
    '.pdpx .pdp-pop[data-pdp-share-pop] .pdp-pop-card{position:relative;left:auto;top:auto;width:min(420px,100%);padding:20px 20px 18px;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.22)}',
    '.pdpx .pdp-share-x{-webkit-appearance:none;appearance:none;width:24px;height:24px;padding:0;margin:0;border:0;outline:0;box-shadow:none;border-radius:0;background:transparent;color:#111;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.pdpx .pdp-share-x svg{display:block;width:18px;height:18px;transition:transform .28s ease}',
    '.pdpx .pdp-share-x:hover svg,.pdpx .pdp-share-x:focus-visible svg{transform:rotate(90deg)}',
    '.pdpx .pdp-share-x:focus{outline:0}',
    '.pdpx .pdp-share-row{display:flex;align-items:stretch;width:100%;border:1px solid rgba(0,0,0,.16);border-radius:999px;overflow:hidden;background:#fff}',
    '.pdpx .pdp-share-row input{flex:1;min-width:0;height:44px;border:0;padding:0 16px;background:transparent;color:#111;font:inherit;font-size:14px;outline:none;text-overflow:ellipsis}',
    '.pdpx .pdp-share-row button{flex:none;height:44px;min-width:84px;border:0;border-left:1px solid rgba(0,0,0,.12);background:#111;color:#fff;padding:0 18px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .18s ease,color .18s ease}',
    '.pdpx .pdp-share-row button:hover,.pdpx .pdp-share-row button:focus-visible{background:#333}',
    '.pdpx .pdp-share-row button.is-copied{background:#111;min-width:92px}',
    '.pdpx .pdp-share-row button.is-copied:hover{background:#222}',
    '.pdpx .pdp-share-socials{display:flex;align-items:center;gap:18px;margin-top:18px}',
    '.pdpx .pdp-share-socials a{display:inline-flex;color:#111;line-height:0;transition:opacity .18s ease,transform .18s ease}',
    '.pdpx .pdp-share-socials a:hover,.pdpx .pdp-share-socials a:focus-visible{opacity:.55;transform:translateY(-1px)}',
    '.pdpx .pdp-share-socials svg{display:block;width:24px;height:24px}',
  ].join(''));

  const LAYOUTS = [
    { value: 'thumbs-bottom', label: 'Horizontal thumbnail carousel' },
    { value: 'thumbs-left', label: 'Vertical thumbnail carousel' },
    { value: 'grid-1', label: 'Grid (1x1)' },
    { value: 'grid-2', label: 'Grid (2x2)' },
  ];
  const POS = [
    { value: 'tr', label: 'Top right' }, { value: 'tl', label: 'Top left' },
    { value: 'br', label: 'Bottom right' }, { value: 'bl', label: 'Bottom left' },
  ];
  const SCHEMES = [
    { value: 'accent-1', label: 'Accent 1' }, { value: 'accent-2', label: 'Accent 2' },
    { value: 'text', label: 'Text' }, { value: 'inverse', label: 'Inverse' },
  ];
  const PAYS = [['visa', 'Visa'], ['mastercard', 'Mastercard'], ['amex', 'Amex'], ['paypal', 'PayPal'], ['apple', 'Apple Pay']];

  function scheme(value, t) {
    const c = (t && t.colors) || {};
    if (value === 'inverse') return '#ffffff';
    if (value === 'text') return c.text_color || '#1a1a1a';
    if (value === 'accent-2') return c.secondary_color || '#666666';
    return c.primary_color || '#103635';
  }
  function productOf(ctx) {
    if (ctx && ctx.resource && ctx.resource.title) return ctx.resource;
    return ((OS.sample && OS.sample.products) || [])[0] || { id: 'p1', title: 'Product', price: 0, image: '', swatches: ['#222'] };
  }
  // PRD 3.1 — sellable = tracked inventory and inventory > 0 (prototype: inventory field + available).
  function isSellableVariant(v) {
    if (!v) return false;
    if (v.available === false) return false;
    return Number(v.inventory || 0) > 0;
  }
  function readUrlVariantId() {
    try { return new URL(location.href).searchParams.get('variant') || ''; } catch (e) { return ''; }
  }
  // replaceState only; keep every non-variant query param (utm etc.) and the SPA hash.
  function replaceUrlVariant(variantId) {
    try {
      const url = new URL(location.href);
      if (variantId) url.searchParams.set('variant', String(variantId));
      else url.searchParams.delete('variant');
      const next = url.pathname + url.search + url.hash;
      const cur = location.pathname + location.search + location.hash;
      if (next !== cur) history.replaceState(history.state, '', next);
    } catch (e) { /* ignore */ }
  }
  // Resolve selected SKU from ?variant= per PRD access rules.
  // urlState: valid | invalid | absent
  function resolveSelectedVariant(p) {
    const variants = Array.isArray(p && p.variants) ? p.variants : [];
    if (!variants.length) return { variant: p, urlState: 'absent' };
    const urlId = readUrlVariantId();
    if (urlId) {
      const hit = variants.find((v) => String(v.id) === String(urlId));
      if (hit) return { variant: hit, urlState: 'valid' };
      return { variant: variants.find(isSellableVariant) || variants[0], urlState: 'invalid' };
    }
    return { variant: variants.find(isSellableVariant) || variants[0], urlState: 'absent' };
  }
  function storefrontProductUrl(handle, variantId) {
    const path = '/products/' + encodeURIComponent(handle || 'product');
    return variantId ? (path + '?variant=' + encodeURIComponent(variantId)) : path;
  }
  function others(current, n) {
    return ((OS.sample && OS.sample.products) || []).filter((p) => p.id !== current.id).slice(0, n);
  }
  function byIds(ids) {
    const all = (OS.sample && OS.sample.products) || [];
    return (ids || []).map((id) => all.find((p) => p.id === id)).filter(Boolean);
  }
  function slides(p) {
    const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
    return images.filter(Boolean).map((src) => ({ type: 'image', src }));
  }
  function badge(s) {
    if (!s.show_trust_badge) return '';
    const size = { small: 64, medium: 84, large: 112 }[s.trust_badge_size] || 84;
    const pos = s.trust_badge_position || 'tr';
    if (s.trust_badge_image) {
      return '<span class="pdp-badge img ' + pos + '" style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + OS.esc(s.trust_badge_image) + ')"></span>';
    }
    return '<span class="pdp-badge ' + pos + '" style="width:' + size + 'px;height:' + size + 'px">Trusted<br>quality</span>';
  }
  function videoChrome(s, t) {
    const play = scheme(s.play_button_scheme, t);
    const sound = scheme(s.sound_button_scheme, t);
    const auto = s.video_player === 'muted-autoplay';
    let html = '';
    if (!auto) html += '<span class="pdp-play" style="background:' + play + '"><i>▶</i></span>';
    html += '<span class="pdp-video-ui">';
    if (auto && s.video_pause) html += '<span class="pdp-chip">II</span>';
    if (s.video_sound) html += '<span class="pdp-chip" style="background:' + sound + ';color:' + (s.sound_button_scheme === 'inverse' ? '#111' : '#fff') + '">♪</span>';
    if (s.video_timeline) html += '<span class="pdp-time"><i style="background:' + play + '"></i></span>';
    html += '</span>';
    return html;
  }
  function navArrows() {
    const icon = (d) => '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' + d + '" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<button type="button" class="pdp-nav prev" data-pdp-nav="-1" aria-label="Previous image">' + icon('M10 3.5 5.5 8 10 12.5') + '</button>' +
      '<button type="button" class="pdp-nav next" data-pdp-nav="1" aria-label="Next image">' + icon('M6 3.5 10.5 8 6 12.5') + '</button>';
  }
  function stage(main, count) {
    if (count < 2) return main;
    return '<div class="pdp-stage">' + main + navArrows() + '</div>';
  }
  function cell(item, i, s, t, style) {
    const zoom = s.enable_zoom && item.type !== 'video' ? ' zoomable' : '';
    return '<button type="button" class="pdp-cell' + (i === 0 ? ' on' : '') + (item.type === 'video' ? ' is-video' : '') + zoom + '" data-pdp-media="' + i + '" data-src="' + OS.esc(item.src) + '" style="' + style + 'background-image:url(' + OS.esc(item.src) + ')">' +
      (i === 0 ? badge(s) : '') + (item.type === 'video' ? videoChrome(s, t) : '') + '</button>';
  }

  const STAR_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" stroke="none" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
  const ICO_PKG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 7.7L12 12.5l8.7-4.8M12 22V12.5"/></svg>';
  const ICO_RET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>';
  const BLOCKS = {
    // unique follows PRD 「限一条」. Multi (否): rating, icon_text, collapsible, text, liquid, popup, divider.
    badges: { name: 'Badges and tags', icon: 'label', unique: true, preview:
      '<span class="pdp-tag" style="background:#2563eb">Best Seller</span>' +
      '<span class="pdp-tag" style="background:#2563eb">End of Summer Sale</span>' +
      '<span class="pdp-tag" style="background:#2563eb">Halloween Sale</span>' +
      '<span class="pdp-tag sale">Sale</span>' +
      '<span class="pdp-tag" style="background:#2563eb">Material Safety</span>',
      fields: [
      { info: 'Valid custom tags use tag__hot_[DISPLAY_TEXT] or tag__new_[DISPLAY_TEXT].' },
      { key: 'show_sold_out', control: 'toggle', label: 'Show sold out badge', default: false },
      { key: 'show_saving', control: 'toggle', label: 'Show saving amount', default: false },
      { key: 'saving_type', control: 'select', label: 'Type', default: 'percentage', options: [
        { value: 'text', label: 'Sale' }, { value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed amount' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'badge_position', control: 'select', label: 'Badge position', default: 'top-left', options: [
        { value: 'top-left', label: 'Top left' }, { value: 'top-right', label: 'Top right' },
        { value: 'below-title', label: 'Below title' }, { value: 'above-price', label: 'Above price' },
      ] },
      { key: 'badge_icon', control: 'select', label: 'Badge icon', default: 'none', options: [
        { value: 'none', label: 'None' }, { value: 'fire', label: 'Fire' }, { value: 'tag', label: 'Tag' }, { value: 'percent', label: 'Percent' },
      ] },
      { key: 'badge_icon_image', control: 'image', label: 'Custom badge icon', default: '', info: 'Custom image replaces the built-in icon when set.' },
      { key: 'badge_bg', control: 'color', label: 'Badge background', default: '', info: 'Blank inherits the theme primary color.' },
      { key: 'badge_text_color', control: 'color', label: 'Badge text color', default: '', info: 'Blank uses white.' },
      { key: 'badge_gap', control: 'range', label: 'Badge gap', min: 0, max: 24, step: 1, unit: 'px', default: 8 },
    ] },
    title: { name: 'Title', icon: 'heading', unique: true, preview: '<div class="os-blkprev-title">Knitted Santa Wine Bottle Cover</div>', fields: [
      { key: 'title_size', control: 'range', label: 'Title font size', min: 10, max: 50, step: 1, unit: 'px', default: 24 },
      { key: 'description', control: 'richtext', label: 'Description', default: '', maxlength: 1000 },
      { key: 'description_image', control: 'image', label: 'Description image', default: '' },
      { key: 'description_color', control: 'color', label: 'Description color', default: '#000000' },
      { key: 'description_size', control: 'range', label: 'Description font size', min: 10, max: 50, step: 1, unit: 'px', default: 14 },
      { key: 'description_top', control: 'range', label: 'Description top padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'description_bottom', control: 'range', label: 'Description bottom padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
    ] },
    price: { name: 'Price', icon: 'priceTag', unique: true, preview: '<div class="os-blkprev-price"><span>$24.00</span><s>$32.00</s><span class="save">-25%</span></div>', fields: [
      { key: 'show_taxes', control: 'toggle', label: 'Show taxes notice', default: false },
      { key: 'show_saving', control: 'toggle', label: 'Show saving amount', default: true },
      { key: 'saving_type', control: 'select', label: 'Type', default: 'percentage', options: [
        { value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed amount' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_position', control: 'segmented', label: 'Saving position', default: 'right', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ], visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_label', control: 'text', label: 'Saving label', default: '', placeholder: 'Empty = auto Save x%', visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_bg', control: 'color', label: 'Saving background', default: '', info: 'Blank inherits the theme sale price color.', visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_text_color', control: 'color', label: 'Saving text color', default: '#ffffff', visibleWhen: (v) => !!v.show_saving },
      { key: 'saving_icon', control: 'toggle', label: 'Show saving icon', default: false, visibleWhen: (v) => !!v.show_saving },
    ] },
    rating: { name: 'Rating', icon: 'starLine', preview:
      '<div class="os-blkprev-rate">' +
        '<span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span><span class="st">' + STAR_SVG + '</span>' +
      '</div>',
      fields: [
      { key: 'show_rating', control: 'toggle', label: 'Show rating', default: true },
      { key: 'size', control: 'range', label: 'Size', min: 8, max: 48, step: 1, unit: 'px', default: 14 },
      { key: 'show_text', control: 'toggle', label: 'Show text', default: false },
      { key: 'text', control: 'text', label: 'Text', default: '4.8 (214) 7,000+ satisfied customers', visibleWhen: (v) => !!v.show_text },
    ] },
    description: { name: 'Description', icon: 'text', unique: true, preview: '<div class="os-blkprev-copy">Soft knit bottle cover with festive trim. Perfect for holiday gifting.</div>', fields: [
      { info: 'No customizable settings available.' },
    ] },
    inventory: { name: 'Inventory', unique: true, preview: '<div class="os-blkprev-stock"><i></i><span>In stock · 24 left</span></div>', fields: [
      { key: 'show_status', control: 'toggle', label: 'Show inventory status', default: true },
      { key: 'show_count', control: 'toggle', label: 'Show inventory count', default: true },
      { key: 'custom_text', control: 'text', label: 'Custom text', default: '', placeholder: '' },
      { key: 'low_stock_threshold', control: 'number', label: 'Low stock threshold', default: 5, min: 0, max: 999 },
      { key: 'low_stock_text', control: 'text', label: 'Low stock text', default: 'Low stock - {n} items left', info: 'Use {n} for the remaining count.' },
      { key: 'sold_out_text', control: 'text', label: 'Sold out text', default: 'Sold out' },
      { key: 'status_style', control: 'segmented', label: 'Status style', default: 'dot', options: [
        { value: 'dot', label: 'Dot' }, { value: 'badge', label: 'Badge' }, { value: 'text-only', label: 'Text only' },
      ] },
      { key: 'status_color', control: 'color', label: 'Status color', default: '#f59e0b' },
    ] },
    variant: { name: 'Variant picker', icon: 'variant', unique: true, preview:
      '<div class="os-blkprev-var">' +
        '<div class="os-blkprev-sw"><span style="background:#c4a484;box-shadow:0 0 0 1px #111,inset 0 0 0 3px #fff"></span><span style="background:#6b7280;box-shadow:0 0 0 1px rgba(0,0,0,.12)"></span><span style="background:#1f2937;box-shadow:0 0 0 1px rgba(0,0,0,.12)"></span></div>' +
        '<div class="os-blkprev-sz"><span class="on">S</span><span>M</span><span>L</span></div>' +
      '</div>',
      fields: [
      { key: 'hide_sold_out', control: 'toggle', label: 'Hide sold out variants', default: false },
      { key: 'picker_type', control: 'segmented', label: 'Selector style', default: 'buttons', options: [
        { value: 'dropdown', label: 'Dropdown' }, { value: 'buttons', label: 'Buttons' },
      ] },
      { key: 'swatch_style', control: 'select', label: 'Style', default: 'color', options: [
        { value: 'color', label: 'Color swatches' },
        { value: 'image', label: 'Variant image' },
        { value: 'text', label: 'Text' },
      ], visibleWhen: (v) => v.picker_type === 'buttons' },
      { key: 'shape', control: 'segmented', label: 'Shape', default: 'normal', options: [
        { value: 'normal', label: 'Normal' }, { value: 'circle', label: 'Circle' }, { value: 'square', label: 'Square' },
      ], visibleWhen: (v) => v.picker_type === 'buttons' && !v.nested_dropdown },
      { key: 'nested_dropdown', control: 'toggle', label: 'Nested dropdown', default: false, info: 'Show one dropdown with combined option values.' },
      { key: 'show_group_title', control: 'toggle', label: 'Show group title', default: false },
      { key: 'sku_display_name', control: 'text', label: 'SKU display name', default: '', placeholder: 'Empty = original SKU', visibleWhen: (v) => !!v.show_sku_in_option },
      { key: 'show_sku_in_option', control: 'toggle', label: 'Show SKU in option', default: false },
    ] },
    buy: { name: 'Buy buttons', icon: 'cart', unique: true, preview: '<div class="os-blkprev-btns"><div class="b b1">Add to cart</div><div class="b b2">Buy with PayPal</div></div>', fields: [
      { key: 'show_quantity', control: 'toggle', label: 'Show quantity selector', default: true },
      { key: 'show_add', control: 'toggle', label: 'Show Add-to-cart button', default: true },
      { key: 'show_dynamic', control: 'toggle', label: 'Show dynamic checkout buttons', default: true },
      { key: 'show_payment_options', control: 'toggle', label: 'Show more payment options', default: true },
      { key: 'button_shape', control: 'segmented', label: 'Button shape', default: 'normal', options: [
        { value: 'normal', label: 'Normal' }, { value: 'pill', label: 'Pill' }, { value: 'square', label: 'Square' }, { value: 'custom', label: 'Custom' },
      ] },
      { key: 'custom_radius', control: 'range', label: 'Custom radius', min: 0, max: 40, step: 1, unit: 'px', default: 8, visibleWhen: (v) => v.button_shape === 'custom' },
      { key: 'button_layout', control: 'select', label: 'Button layout', default: 'stacked', options: [
        { value: 'stacked', label: 'Stacked' }, { value: 'side-by-side', label: 'Side by side' },
      ] },
      { key: 'channels', control: 'multiselect', label: 'Channels', default: ['shop', 'paypal', 'apple_pay', 'google_pay'], options: [
        { value: 'shop', label: 'Shop' }, { value: 'paypal', label: 'PayPal' }, { value: 'apple_pay', label: 'Apple Pay' }, { value: 'google_pay', label: 'Google Pay' },
        { value: 'amazon', label: 'Amazon' }, { value: 'amex', label: 'Amex' }, { value: 'diners', label: 'Diners Club' },
        { value: 'discover', label: 'Discover' }, { value: 'mastercard', label: 'Mastercard' }, { value: 'visa', label: 'Visa' },
      ], visibleWhen: (v) => !!v.show_dynamic },
      { key: 'channel_logo', control: 'toggle', label: 'Show channel logo', default: false, visibleWhen: (v) => !!v.show_dynamic },
    ] },
    icon_text: { name: 'Icon with text', preview:
      '<div class="os-blkprev-icons">' +
        '<div class="cell"><span class="ico">' + ICO_PKG + '</span><span>Orders over $50 ship free</span></div>' +
        '<div class="cell"><span class="ico">' + ICO_RET + '</span><span>30 day returns</span></div>' +
      '</div>',
      fields: [
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'horizontal', options: [
        { value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' },
      ] },
      { key: 'font', control: 'select', label: 'Title font family', default: 'body', options: [
        { value: 'body', label: 'Body font' }, { value: 'heading', label: 'Heading font' },
      ] },
      { key: 'size', control: 'select', label: 'Title size', default: 'base', options: [
        { value: 'small', label: 'Small' }, { value: 'base', label: 'Base size' }, { value: 'large', label: 'Large' },
      ] },
      { key: 'icon_1', control: 'select', label: 'First icon', default: 'package', options: [
        { value: 'package', label: 'Package' }, { value: 'truck', label: 'Truck' }, { value: 'star', label: 'Star' }, { value: 'leaf', label: 'Leaf' },
      ] },
      { key: 'image_1', control: 'image', label: 'First image', default: '' },
      { key: 'first', control: 'richtext', label: 'First heading', default: 'Orders over $50 ship free' },
      { key: 'icon_2', control: 'select', label: 'Second icon', default: 'currency', options: [
        { value: 'currency', label: 'Currency circle dollar' }, { value: 'package', label: 'Package' }, { value: 'star', label: 'Star' }, { value: 'return', label: 'Returns' },
      ] },
      { key: 'image_2', control: 'image', label: 'Second image', default: '' },
      { key: 'second', control: 'richtext', label: 'Second heading', default: '30 day returns' },
      { key: 'icon_3', control: 'select', label: 'Third icon', default: 'star4', options: [
        { value: 'star4', label: 'Star four' }, { value: 'star', label: 'Star' }, { value: 'heart', label: 'Heart' }, { value: 'check', label: 'Check' },
      ] },
      { key: 'image_3', control: 'image', label: 'Third image', default: '' },
      { key: 'third', control: 'richtext', label: 'Third heading', default: '' },
    ] },
    sku: { name: 'SKU', unique: true, preview: '<div class="os-blkprev-sku">SKU: AURA-KNIT-01</div>', fields: [
      { key: 'text_style', control: 'select', label: 'Text style', default: 'body', options: [
        { value: 'body', label: 'Body' }, { value: 'subtitle', label: 'Subtitle' }, { value: 'uppercase', label: 'Uppercase' },
      ] },
    ] },
    text: { name: 'Text', icon: 'text', preview: '<div class="os-blkprev-copy">Add supporting product information.</div>', fields: [
      { key: 'text', control: 'richtext', label: 'Text', default: 'Add supporting product information.' },
      { key: 'text_style', control: 'select', label: 'Text style', default: 'body', options: [
        { value: 'body', label: 'Body' }, { value: 'subtitle', label: 'Subtitle' }, { value: 'uppercase', label: 'Uppercase' },
      ] },
    ] },
    // Custom Liquid has empty default code — preview stays blank.
    liquid: { name: 'Custom Liquid', icon: 'code', fields: [
      { key: 'code', control: 'textarea', label: 'Liquid code', default: '', placeholder: '{{ product.title }}' },
    ] },
    collapsible: { name: 'Collapsible row', preview: '<div class="os-blkprev-row"><span>Overview</span><span>+</span></div>', fields: [
      { key: 'heading', control: 'text', label: 'Heading', default: 'Overview' },
      { key: 'icon', control: 'select', label: 'Icon', default: 'none', options: [
        { value: 'none', label: 'None' }, { value: 'leaf', label: 'Leaf' }, { value: 'shirt', label: 'Shirt' }, { value: 'box', label: 'Package' },
      ] },
      { key: 'content', control: 'richtext', label: 'Row content', default: 'A clinically proven, non-sticky, vegan lip treatment that delivers the intense hydration of a lip mask with a sweet sheer tint using food-grade, non-artificial flavor. Designed for sensitive, irritated lips, this cushiony treatment delivers instant comfort to rescue dry, chapped lips.' },
      { key: 'custom_liquid', control: 'textarea', label: 'Custom liquid', default: '' },
      { key: 'page', control: 'page', label: 'Row content from page', default: '' },
      { key: 'open', control: 'toggle', label: 'Default open', default: false },
      { key: 'first_open_default', control: 'toggle', label: 'Open by default', default: false },
      { key: 'accordion_mode', control: 'toggle', label: 'Accordion mode', default: false, info: 'When on, only one row stays open at a time.' },
      { key: 'icon_position', control: 'segmented', label: 'Icon position', default: 'right', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ] },
      { info: 'Mobile order reuses the desktop block order.' },
    ] },
    popup: { name: 'Pop-up', preview: '<button type="button" style="padding:0;border:0;background:none;color:#111;font:inherit;font-size:13px;font-weight:650;line-height:1.3;text-decoration:underline;text-underline-offset:3px;cursor:default">View size guide</button>', fields: [
      { key: 'label', control: 'text', label: 'Link label', default: 'View size guide' },
      { key: 'page', control: 'page', label: 'Page', default: '' },
      { key: 'trigger', control: 'segmented', label: 'Trigger', default: 'click', options: [
        { value: 'click', label: 'Click' },
      ] },
      { key: 'content_type', control: 'select', label: 'Content type', default: 'page', options: [
        { value: 'page', label: 'Page' },
      ] },
      { key: 'hover_effect', control: 'toggle', label: 'Hover effect', default: false },
      { key: 'popup_width', control: 'range', label: 'Popup width', min: 280, max: 900, step: 10, unit: 'px', default: 560 },
      { key: 'popup_height', control: 'range', label: 'Popup height', min: 200, max: 800, step: 10, unit: 'px', default: 420 },
    ] },
    shipping: { name: 'Shipping', icon: 'doc', unique: true, preview: '<div class="os-blkprev-ship"><strong style="display:block;margin-bottom:4px;color:#111">Estimated delivery:</strong>Arrives by Oct 30</div>', fields: [
      { key: 'delivery_text', control: 'text', label: 'Delivery text', default: 'Estimated delivery:' },
      { key: 'days', control: 'number', label: 'Deliver in', min: 1, max: 60, default: 7 },
      { key: 'date_format', control: 'text', label: 'Date format', default: '%b %d' },
      { key: 'timezone', control: 'select', label: 'Timezone', default: 'store', options: [
        { value: 'store', label: 'Store' }, { value: 'utc', label: 'UTC' },
      ] },
      { key: 'fallback_text', control: 'text', label: 'Fallback text', default: '', placeholder: 'Shown when delivery date is unavailable' },
      { info: 'Holiday skipping is out of scope for this pass.' },
    ] },
    // Not in PRD Product information catalog — keep render support, hide from Add block.
    line_property: { name: 'Line item property', picker: false, preview:
      '<div class="os-blkprev-field"><div class="lb">Your label</div><div class="inp">Your placeholder</div></div>',
      fields: [
      { key: 'type', control: 'select', label: 'Type', default: 'text', options: [{ value: 'text', label: 'Text' }, { value: 'number', label: 'Number' }] },
      { key: 'label', control: 'text', label: 'Label', default: 'Your label' },
      { key: 'placeholder', control: 'text', label: 'Placeholder', default: 'Your placeholder' },
      { key: 'required', control: 'toggle', label: 'Required', default: false },
    ] },
    actions: { name: 'Sharing buttons', unique: true, preview: '<div class="os-blkprev-share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>Share</div>', fields: [
      { key: 'show_share', control: 'toggle', label: 'Show social sharing', default: true },
      { key: 'layout', control: 'segmented', label: 'Layout', default: 'tile', options: [
        { value: 'tile', label: 'Tile' }, { value: 'inline', label: 'Inline' }, { value: 'dropdown', label: 'Dropdown' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'icon_style', control: 'segmented', label: 'Icon style', default: 'brand', options: [
        { value: 'brand', label: 'Brand' }, { value: 'mono', label: 'Mono' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'platforms', control: 'multiselect', label: 'Platforms', default: ['facebook', 'x', 'pinterest'], options: [
        { value: 'facebook', label: 'Facebook' }, { value: 'x', label: 'X' }, { value: 'pinterest', label: 'Pinterest' },
        { value: 'instagram', label: 'Instagram' }, { value: 'whatsapp', label: 'WhatsApp' }, { value: 'telegram', label: 'Telegram' }, { value: 'email', label: 'Email' },
      ], visibleWhen: (v) => v.show_share !== false },
      { key: 'show_copy', control: 'toggle', label: 'Show copy link', default: true, visibleWhen: (v) => v.show_share !== false },
    ] },
    // Products default to [] — no init data, preview stays blank.
    recommendations: { name: 'Inline recommendations', unique: true, fields: [
      { key: 'heading', control: 'text', label: 'Heading', default: 'You Might Also Like' },
      { key: 'products', control: 'ordered_products', label: 'Select products', default: [], max: 8 },
      { key: 'per_row', control: 'range', label: 'Row Count/Desktop', min: 1, max: 4, step: 1, default: 2 },
      { key: 'mobile_count', control: 'range', label: 'Row Count/Mobile', min: 1, max: 2, step: 1, default: 2 },
      { key: 'image_ratio', control: 'select', label: 'Image aspect ratio', default: 'adapt', options: [
        { value: 'adapt', label: 'Adapt to image' }, { value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' },
      ] },
      { key: 'empty_behavior', control: 'select', label: 'Empty behavior', default: 'hide', options: [
        { value: 'hide', label: 'Hide block' },
      ] },
      { key: 'exclude_soldout', control: 'toggle', label: 'Exclude sold out', default: false },
      { key: 'dedupe_current', control: 'toggle', label: 'Hide current product', default: true },
    ] },
    divider: { name: 'Separator', preview: '<div class="os-blkprev-line"></div>', fields: [
      { key: 'color', control: 'color', label: 'Color', default: '#E5E5E5' },
      { key: 'thickness', control: 'range', label: 'Thickness', min: 1, max: 6, step: 1, unit: 'px', default: 1 },
      { key: 'padding_top', control: 'range', label: 'Padding Top', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_bottom', control: 'range', label: 'Padding Bottom', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
    ] },
  };

  // Trustpilot / Loox style: green square tiles with a white star.
  function stars(rating) {
    const star = '<svg viewBox="0 0 24 24" fill="#fff" stroke="none" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const on = rating >= i - 0.25;
      html += '<span class="pdp-rate-st" style="background:' + (on ? '#2e7d32' : '#dcdce6') + '">' + star + '</span>';
    }
    return '<span class="pdp-rate-stars">' + html + '</span>';
  }

  function rowHtml(block, p, s, t, ctx, selectedOverride) {
    const b = block.settings || {};
    const c = t.colors || {};
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const selected = selectedOverride || resolveSelectedVariant(p).variant || p;
    const price = selected.price == null ? p.price : selected.price;
    const compareAt = selected.compareAt == null ? p.compareAt : selected.compareAt;
    const inventory = selected.inventory == null ? (p.inventory == null ? 12 : p.inventory) : selected.inventory;
    const sale = compareAt && compareAt > price;
    const saleColor = c.sale_price_color || '#d63a2f';
    const mob = ctx.mob;
    let body = '';
    if (block.kind === 'badges') {
      const badgeBg = b.badge_bg || c.primary_color || '#5b3f94';
      const badgeText = b.badge_text_color || '#ffffff';
      const badgeGap = Number(b.badge_gap == null ? 8 : b.badge_gap);
      const position = b.badge_position || 'top-left';
      const iconSvgs = {
        fire: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.2c1.6 1.8 2.2 3.1 2.2 4.6A2.2 2.2 0 0 1 8 8.9 2.2 2.2 0 0 1 5.8 6.8C5.8 5.3 6.4 4 8 2.2z" stroke="currentColor" stroke-width="1.3"/><path d="M5.2 9.4c.7 2.4 2.1 3.6 2.8 3.6s2.1-1.2 2.8-3.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
        tag: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8.2 8.2 2.5h4.3v4.3L6.8 12.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="11" cy="5" r=".9" fill="currentColor"/></svg>',
        percent: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.2 4.2h7.6v7.6H4.2z" stroke="currentColor" stroke-width="1.3"/><path d="M6.2 9.8 9.8 6.2M6.5 6.5h.01M9.5 9.5h.01" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
      };
      const iconHtml = b.badge_icon_image
        ? '<img alt="" src="' + OS.esc(b.badge_icon_image) + '">'
        : (iconSvgs[b.badge_icon] || '');
      const tagStyle = 'background:' + OS.esc(badgeBg) + ';color:' + OS.esc(badgeText);
      const wrapTag = (label, extraClass) => '<span class="pdp-tag' + (extraClass ? ' ' + extraClass : '') + '" style="' + tagStyle + '">' + iconHtml + OS.esc(label) + '</span>';
      const tags = (p.tags || []).filter((tag) => /^tag__(hot|new)_/i.test(tag)).map((tag) =>
        wrapTag(String(tag).replace(/^tag__(hot|new)_/i, '')));
      if (b.show_sold_out && inventory <= 0) tags.push(wrapTag('Sold out', 'sold'));
      if (b.show_saving && sale) {
        const label = b.saving_type === 'text' ? 'Sale'
          : (b.saving_type === 'fixed' ? 'Save ' + OS.money(compareAt - price) : 'Save ' + Math.round((1 - price / compareAt) * 100) + '%');
        tags.push(wrapTag(label, 'sale'));
      }
      const overlay = (position === 'top-left' || position === 'top-right') ? ' is-overlay' : '';
      body = tags.length
        ? '<div class="pdp-tags' + overlay + '" data-badge-position="' + OS.esc(position) + '" style="gap:' + badgeGap + 'px">' + tags.join('') + '</div>'
        : '';
    } else if (block.kind === 'title') {
      const px = Number(b.title_size || 24);
      body = '<h1 class="pdp-title" style="font-family:' + OS.headingFamily(t) + ';font-size:' + OS.headingSize(t, px, mob) + 'px;color:' + OS.col(s.text, c.heading_color || '#1a1a1a') + '">' + OS.esc(p.title) + '</h1>';
      if (b.description || b.description_image) {
        body += '<div class="pdp-title-desc" style="color:' + OS.esc(b.description_color || '#000000') + ';font-size:' + (b.description_size || 14) + 'px;padding-top:' + (b.description_top || 0) + 'px;padding-bottom:' + (b.description_bottom || 0) + 'px">' +
          (b.description || '') + (b.description_image ? '<img alt="" src="' + OS.esc(b.description_image) + '">' : '') + '</div>';
      }
    } else if (block.kind === 'rating') {
      if (!p.rating || b.show_rating === false) return '';
      body = '<div class="pdp-rate" style="font-size:' + (b.size || 14) + 'px">' + stars(p.rating) +
        (b.show_text ? '<span>' + OS.esc(b.text || '') + '</span>' : '<b>' + p.rating + '</b><span style="opacity:.6">(' + (p.reviews || 0) + ')</span>') + '</div>';
    } else if (block.kind === 'price') {
      const autoSaving = b.saving_type === 'fixed'
        ? 'Save ' + OS.money(compareAt - price)
        : 'Save ' + Math.round((1 - price / compareAt) * 100) + '%';
      const saving = String(b.saving_label || '').trim() || autoSaving;
      const saveBg = b.saving_bg || saleColor;
      const saveText = b.saving_text_color || '#ffffff';
      const saveIcon = b.saving_icon
        ? '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.2 4.2h7.6v7.6H4.2z" stroke="currentColor" stroke-width="1.4"/><path d="M6.2 9.8 9.8 6.2M6.5 6.5h.01M9.5 9.5h.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
        : '';
      const saveOrder = b.saving_position === 'left' ? 'order:-1;' : '';
      body = '<div class="pdp-price"><span class="now" data-pdp-now' + (sale ? ' style="color:' + saleColor + '"' : '') + '>' + OS.money(price) + '</span>' +
        (sale ? '<s data-pdp-compare>' + OS.money(compareAt) + '</s>' : '<s data-pdp-compare hidden></s>') +
        (b.show_saving && sale
          ? '<span class="save" data-pdp-save data-save-type="' + OS.esc(b.saving_type || 'percentage') + '" data-save-label="' + OS.esc(String(b.saving_label || '').trim()) + '" data-save-icon="' + (b.saving_icon ? '1' : '0') + '" style="background:' + OS.esc(saveBg) + ';color:' + OS.esc(saveText) + ';' + saveOrder + '">' + saveIcon + OS.esc(saving) + '</span>'
          : '') + '</div>' +
        (b.show_taxes ? '<div style="font-size:12px;opacity:.62;margin-top:4px">Tax included.</div>' : '');
    } else if (block.kind === 'divider') {
      body = '<div style="padding:' + (b.padding_top || 0) + 'px 0 ' + (b.padding_bottom || 0) + 'px"><hr class="pdp-line" style="border-top-width:' + (b.thickness || 1) + 'px;border-top-color:' + OS.esc(b.color || '#E5E5E5') + '"></div>';
    } else if (block.kind === 'variant') {
      const vis = b.hide_sold_out
        ? variants.filter((v) => Number(v.inventory || 0) > 0 && v.available !== false)
        : variants;
      const inStock = (v) => Number(v.inventory || 0) > 0 && v.available !== false;
      const colors = Array.from(new Set(vis.map((v) => v.color).filter(Boolean)));
      const sizes = Array.from(new Set(vis.map((v) => v.size).filter(Boolean)));
      const selectedColor = selected.color || colors[0] || 'Default';
      const selectedSize = selected.size || sizes[0] || 'Default';
      const colorMap = {};
      colors.forEach((color, i) => { colorMap[color] = (p.swatches || [])[i] || ['#222222', '#c8b6a6', '#94a3b8'][i % 3]; });
      const shape = b.shape === 'circle' ? ' shape-circle' : (b.shape === 'square' ? ' shape-square' : '');
      const isDropdown = b.picker_type === 'dropdown' || !!b.nested_dropdown;
      const showTitle = !!b.show_group_title;
      const skuLabel = (v) => {
        if (!b.show_sku_in_option) return '';
        const name = String(b.sku_display_name || '').trim() || v.sku || '';
        return name ? ' · ' + name : '';
      };
      const optionLabel = (kind, item) => {
        const match = vis.find((v) => v[kind] === item) || {};
        return item + skuLabel(match);
      };
      const ddHtml = (kind, label, items, selectedValue) => {
        const opts = items.map((item) => {
          const sold = !vis.some((v) => v[kind] === item && inStock(v));
          return '<button type="button" class="pdp-dd-opt' + (item === selectedValue ? ' on' : '') + (sold ? ' sold' : '') + '" role="option" data-pdp-dd-opt data-value="' + OS.esc(item) + '" aria-selected="' + (item === selectedValue ? 'true' : 'false') + '">' + OS.esc(optionLabel(kind, item)) + (sold ? ' — Sold out' : '') + '</button>';
        }).join('');
        const selectedSold = !vis.some((v) => v[kind] === selectedValue && inStock(v));
        return '<div class="pdp-dd" data-pdp-' + kind + '-dd>' +
          '<button type="button" class="pdp-dd-btn" data-pdp-dd-btn aria-haspopup="listbox" aria-expanded="false" aria-label="' + OS.esc(label) + '"><span data-pdp-dd-val>' + OS.esc(optionLabel(kind, selectedValue)) + (selectedSold ? ' — Sold out' : '') + '</span></button>' +
          '<div class="pdp-dd-menu" data-pdp-dd-menu hidden role="listbox" aria-label="' + OS.esc(label) + '">' + opts + '</div></div>';
      };
      const imageForColor = (color) => {
        const match = vis.find((v) => v.color === color && v.image) || vis.find((v) => v.color === color);
        return (match && match.image) || (p.images && p.images[0]) || p.image || '';
      };
      // Keep every SKU in the data node so deep links to sold-out variants still resolve (PRD).
      const data = variants.map((v) => '<i data-pdp-variant data-id="' + OS.esc(v.id || '') + '" data-color="' + OS.esc(v.color || '') + '" data-size="' + OS.esc(v.size || '') + '" data-price="' + Number(v.price || 0) + '" data-compare="' + Number(v.compareAt || 0) + '" data-inventory="' + Number(v.inventory || 0) + '" data-image="' + OS.esc(v.image || p.image || '') + '" data-sku="' + OS.esc(v.sku || '') + '"></i>').join('');
      if (b.nested_dropdown) {
        const selectedId = selected.id || '';
        const selectedCombo = [selectedSize, selectedColor].filter(Boolean).join(' / ') || 'Variant';
        const opts = vis.map((v) => {
          const combo = [v.size, v.color].filter(Boolean).join(' / ') || (v.title || 'Variant');
          const sold = !inStock(v);
          const label = combo + skuLabel(v);
          return '<button type="button" class="pdp-dd-opt' + (v.id === selectedId ? ' on' : '') + (sold ? ' sold' : '') + '" role="option" data-pdp-dd-opt data-pdp-variant-id="' + OS.esc(v.id || '') + '" data-value="' + OS.esc(combo) + '" data-pdp-color="' + OS.esc(v.color || '') + '" data-pdp-size="' + OS.esc(v.size || '') + '" aria-selected="' + (v.id === selectedId ? 'true' : 'false') + '">' + OS.esc(label) + (sold ? ' — Sold out' : '') + '</button>';
        }).join('');
        const selectedSold = !inStock(selected);
        const nestedDd = '<div class="pdp-dd" data-pdp-nested-dd>' +
          '<button type="button" class="pdp-dd-btn" data-pdp-dd-btn aria-haspopup="listbox" aria-expanded="false" aria-label="Variant"><span data-pdp-dd-val>' + OS.esc(selectedCombo + skuLabel(selected)) + (selectedSold ? ' — Sold out' : '') + '</span></button>' +
          '<div class="pdp-dd-menu" data-pdp-dd-menu hidden role="listbox" aria-label="Variant">' + opts + '</div></div>';
        body = '<div class="pdp-options"><div class="pdp-option">' +
          (showTitle ? '<div class="pdp-label">Variant: <span class="pdp-opt-val">' + OS.esc(selectedCombo) + '</span></div>' : '') +
          nestedDd + '</div></div><span hidden data-pdp-variant-data>' + data + '</span>';
      } else {
        const colorHtml = isDropdown
          ? ddHtml('color', 'Color', colors, selectedColor)
          : '<div class="pdp-swatches">' + colors.map((color) => {
            const textStyle = b.swatch_style === 'text';
            const imageStyle = b.swatch_style === 'image';
            const sold = !vis.some((v) => v.color === color && inStock(v));
            const img = imageStyle ? imageForColor(color) : '';
            const bg = textStyle ? '' : (imageStyle
              ? (img ? 'background-image:url(' + OS.esc(img) + ')' : 'background:' + colorMap[color])
              : 'background:' + colorMap[color]);
            const match = vis.find((v) => v.color === color) || {};
            return '<button type="button" class="' + (textStyle ? 'pdp-size' : 'pdp-sw') + (imageStyle ? ' pdp-sw-img' : '') + shape + (color === selectedColor ? ' on' : '') + (sold ? ' sold' : '') + '" data-pdp-color="' + OS.esc(color) + '"' +
              (textStyle ? '' : ' aria-label="' + OS.esc(color) + '" style="' + bg + '"') + '>' + (textStyle ? OS.esc(color + skuLabel(match)) : '') + '</button>';
          }).join('') + '</div>';
        const sizeHtml = isDropdown
          ? ddHtml('size', 'Size', sizes, selectedSize)
          : '<div class="pdp-sizes">' + sizes.map((z) => {
            const sold = !vis.some((v) => v.size === z && inStock(v));
            const match = vis.find((v) => v.size === z) || {};
            return '<button type="button" class="pdp-size' + shape + (z === selectedSize ? ' on' : '') + (sold ? ' sold' : '') + '" data-pdp-size="' + OS.esc(z) + '">' + OS.esc(z + skuLabel(match)) + '</button>';
          }).join('') + '</div>';
        body = '<div class="pdp-options"><div class="pdp-option">' +
          (showTitle ? '<div class="pdp-label">Color: <span class="pdp-opt-val" data-pdp-color-label>' + OS.esc(selectedColor) + '</span></div>' : '<span hidden data-pdp-color-label>' + OS.esc(selectedColor) + '</span>') +
          colorHtml + '</div><div class="pdp-option">' +
          (showTitle ? '<div class="pdp-label">Size: <span class="pdp-opt-val" data-pdp-size-label>' + OS.esc(selectedSize) + '</span></div>' : '<span hidden data-pdp-size-label>' + OS.esc(selectedSize) + '</span>') +
          sizeHtml + '</div></div><span hidden data-pdp-variant-data>' + data + '</span>';
      }
    } else if (block.kind === 'description') {
      body = '<div class="pdp-custom-text">' + OS.esc(p.description || 'Product description will appear here.') + '</div>';
    } else if (block.kind === 'inventory') {
      if (b.show_status === false) return '';
      const showCount = b.show_count !== false;
      const customText = String(b.custom_text || '');
      const threshold = Number(b.low_stock_threshold == null ? 5 : b.low_stock_threshold);
      const lowTextTpl = String(b.low_stock_text || 'Low stock - {n} items left');
      const soldText = String(b.sold_out_text || 'Sold out');
      const style = b.status_style || 'dot';
      const statusColor = b.status_color || '#f59e0b';
      const isLow = inventory > 0 && inventory <= threshold;
      const statusText = inventory <= 0
        ? soldText
        : (isLow
          ? lowTextTpl.replace(/\{n\}/g, String(inventory)) + customText
          : ((showCount ? inventory + ' in stock' : 'In stock') + customText));
      const styleClass = style === 'badge' ? ' style-badge' : (style === 'text-only' ? ' style-text' : '');
      body = '<div class="pdp-stock' + (inventory <= 0 ? ' sold' : (isLow ? ' low' : '')) + styleClass + '" data-pdp-stock data-show-count="' + (showCount ? '1' : '0') + '" data-custom-text="' + OS.esc(customText) + '" data-low-threshold="' + threshold + '" data-low-text="' + OS.esc(lowTextTpl) + '" data-sold-text="' + OS.esc(soldText) + '" style="--status-color:' + OS.esc(inventory <= 0 ? '#9ca3af' : statusColor) + '"><i></i><span>' +
        OS.esc(statusText) + '</span></div>';
    } else if (block.kind === 'buy') {
      const showPayMore = b.show_payment_options !== false;
      const radius = b.button_shape === 'pill' ? 999
        : (b.button_shape === 'square' ? 0
          : (b.button_shape === 'custom' ? Number(b.custom_radius == null ? 8 : b.custom_radius) : 8));
      const radiusStyle = 'border-radius:' + radius + 'px';
      const layoutSide = b.button_layout === 'side-by-side';
      const channels = Array.isArray(b.channels) && b.channels.length
        ? b.channels
        : ['shop', 'paypal', 'apple_pay', 'google_pay'];
      const useLogo = !!b.channel_logo;
      const paypalLogo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="38 6 86 24" height="22" aria-hidden="true" focusable="false">' +
        '<path fill="#253B80" d="M46.211 6.749h-6.839c-.468 0-.866.34-.939.802l-2.766 17.537c-.055.346.213.658.564.658h3.265c.468 0 .866-.34.939-.803l.746-4.73c.072-.463.471-.803.938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415C50.224 7.353 48.5 6.749 46.211 6.749zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583c.043-.277.283-.481.563-.481h.473c1.235 0 2.4 0 3.002.704.361.41.471 1.034.332 1.906z"/>' +
        '<path fill="#253B80" d="M66.654 13.075h-3.275c-.279 0-.52.204-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.562.66h2.95c.469 0 .865-.34.939-.803l1.77-11.209c.055-.347-.212-.66-.562-.66zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.489.577.687 1.399.554 2.317z"/>' +
        '<path fill="#253B80" d="M84.096 13.075h-3.291c-.314 0-.609.156-.787.417l-4.539 6.686-1.924-6.425c-.121-.402-.492-.678-.912-.678h-3.234c-.393 0-.666.384-.541.754l3.625 10.638-3.408 4.811c-.268.379.002.9.465.9h3.287c.312 0 .604-.152.781-.408L84.564 13.97c.262-.378-.007-.895-.468-.895z"/>' +
        '<path fill="#179BD7" d="M94.992 6.749h-6.84c-.467 0-.865.34-.938.802l-2.766 17.537c-.055.346.213.658.562.658h3.51c.326 0 .605-.238.656-.562l.785-4.971c.072-.463.471-.803.938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415C99.004 7.353 97.281 6.749 94.992 6.749zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583c.043-.277.281-.481.562-.481h.473c1.234 0 2.4 0 3.002.704.36.41.469 1.034.331 1.906z"/>' +
        '<path fill="#179BD7" d="M115.434 13.075h-3.273c-.281 0-.52.204-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91c-.055.348.213.66.564.66h2.949c.467 0 .865-.34.938-.803l1.771-11.209c.055-.347-.213-.66-.564-.66zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.491.577.689 1.399.554 2.317z"/>' +
        '<path fill="#179BD7" d="M119.295 7.23l-2.807 17.858c-.055.346.213.658.562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536c.055-.346-.213-.659-.562-.659h-3.16c-.279 0-.519.204-.562.482z"/>' +
      '</svg>';
      const channelBtn = (id) => {
        const style = ' style="' + radiusStyle + '"';
        if (id === 'paypal') {
          return '<button type="button" class="pdp-paypal" data-pdp-paypal aria-label="PayPal"' + style + '>' + (useLogo ? paypalLogo : 'PayPal') + '</button>';
        }
        const map = {
          shop: { cls: 'shop', label: 'Shop', logo: 'Shop' },
          apple_pay: { cls: 'apple', label: 'Apple Pay', logo: 'Apple Pay' },
          google_pay: { cls: 'google', label: 'Google Pay', logo: 'G Pay' },
          amazon: { cls: 'amazon', label: 'Amazon', logo: 'Amazon' },
          amex: { cls: 'card', label: 'Amex', logo: 'AMEX' },
          diners: { cls: 'card', label: 'Diners Club', logo: 'DINERS' },
          discover: { cls: 'card', label: 'Discover', logo: 'DISCOVER' },
          mastercard: { cls: 'card', label: 'Mastercard', logo: 'MC' },
          visa: { cls: 'card', label: 'Visa', logo: 'VISA' },
        };
        const m = map[id];
        if (!m) return '';
        return '<button type="button" class="pdp-chan ' + m.cls + '" aria-label="' + OS.esc(m.label) + '"' + style + '>' + OS.esc(useLogo ? m.logo : m.label) + '</button>';
      };
      const channelHtml = b.show_dynamic ? channels.map(channelBtn).join('') : '';
      const dyn = (channelHtml || showPayMore) ? '<div class="pdp-dyn">' + channelHtml +
        (showPayMore ? '<button type="button" class="pdp-pay-more" data-pdp-pay-more>More payment options</button>' : '') +
      '</div>' : '';
      body = '<div class="pdp-actions' + (layoutSide ? ' side' : '') + '">' +
        ((b.show_quantity || b.show_add) ? '<div class="pdp-buy-row">' +
          (b.show_quantity ? '<div class="pdp-qty" style="' + radiusStyle + '"><button type="button" data-pdp-q="-">-</button><span data-pdp-qty>1</span><button type="button" data-pdp-q="+">+</button></div>' : '') +
          (b.show_add ? '<button type="button" class="pdp-atc" data-pdp-atc style="' + OS.btnStyle(t) + ';' + radiusStyle + '"' + (inventory <= 0 ? ' disabled' : '') + '>' + (inventory <= 0 ? 'Sold out' : 'Add to cart') + '</button>' : '') +
        '</div>' : '') +
        dyn + '</div>';
    } else if (block.kind === 'icon_text') {
      const svg = (inner) => '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
      const marks = {
        package: svg('<path d="M3.2 6.4 10 3.2l6.8 3.2v7.2L10 16.8 3.2 13.6z"/><path d="M3.2 6.4 10 9.6l6.8-3.2"/><path d="M10 9.6v7.2"/>'),
        box: svg('<path d="M3.2 6.4 10 3.2l6.8 3.2v7.2L10 16.8 3.2 13.6z"/><path d="M3.2 6.4 10 9.6l6.8-3.2"/><path d="M10 9.6v7.2"/>'),
        truck: svg('<path d="M2.5 6.5h9v6h-9z"/><path d="M11.5 8.5h3.2L17 11v1.5h-5.5z"/><circle cx="6" cy="14.2" r="1.2"/><circle cx="14.2" cy="14.2" r="1.2"/>'),
        star: svg('<path d="m10 3.2 1.7 3.6 4 .5-2.9 2.7.8 3.9L10 12.1 6.4 14l.8-3.9L4.3 7.3l4-.5z"/>'),
        star4: svg('<path d="M10 2.4 11.3 8.7 17.6 10 11.3 11.3 10 17.6 8.7 11.3 2.4 10 8.7 8.7z"/>'),
        leaf: svg('<path d="M5 15.2C5 9 9.2 5.2 16.2 4.6 15.6 11.6 11.8 15.8 5.6 15.8"/><path d="M5.4 15.2c2.2-2.6 4.4-4.4 7.4-5.6"/>'),
        return: svg('<path d="M4 10a6 6 0 1 0 1.8-4.3"/><path d="M4 3.5v3.2h3.2"/>'),
        currency: svg('<circle cx="10" cy="10" r="6.4"/><path d="M10 6v8"/><path d="M12.1 8c-.3-.8-1.1-1.1-2.1-1.1-1.2 0-2 .5-2 1.3 0 2.2 4.2 1.1 4.2 3 0 .8-.8 1.4-2.1 1.4-1.1 0-1.9-.4-2.2-1.1"/>'),
        shield: svg('<path d="M10 3.2 4.8 5.2v4.2c0 3.1 2.1 5.6 5.2 6.6 3.1-1 5.2-3.5 5.2-6.6V5.2z"/><path d="m7.6 10 1.6 1.6 3.2-3.2"/>'),
        heart: svg('<path d="M10 16.2S4.2 12.6 3.2 9.2a3.4 3.4 0 0 1 6-2.1 3.4 3.4 0 0 1 6 2.1c-1 3.4-5.2 7-5.2 7z"/>'),
        check: svg('<path d="m4.5 10.2 3.4 3.4 7.6-7.6"/>'),
      };
      const items = [
        { icon: b.icon_1 || 'package', image: b.image_1, text: b.first },
        { icon: b.icon_2 || 'currency', image: b.image_2, text: b.second },
        { icon: b.icon_3 || 'star4', image: b.image_3, text: b.third },
      ].filter((item) => String(item.text || '').trim());
      const spec = { small: { text: 14, icon: 18, line: 24 }, base: { text: 16, icon: 20, line: 26 }, large: { text: 18, icon: 24, line: 30 } }[b.size] || { text: 16, icon: 20, line: 26 };
      body = items.length ? '<div class="pdp-icons' + (b.layout === 'vertical' ? ' vertical' : '') + '" style="font-family:' + (b.font === 'heading' ? OS.headingFamily(t) : OS.bodyFamily(t)) + ';font-size:' + spec.text + 'px;--pdp-icon-size:' + spec.icon + 'px;--pdp-icon-line:' + spec.line + 'px">' +
        items.map((item) => '<div class="pdp-icon-item">' +
          (item.image ? '<img class="pdp-icon-img" alt="" src="' + OS.esc(item.image) + '">' : '<span class="pdp-icon-mark">' + (marks[item.icon] || marks.package) + '</span>') +
          '<span>' + item.text + '</span></div>').join('') + '</div>' : '';
    } else if (block.kind === 'sku') {
      body = '<div class="pdp-sku" style="' + (b.text_style === 'uppercase' ? 'text-transform:uppercase;letter-spacing:.06em' : '') + '">SKU: <span data-pdp-sku>' + OS.esc(selected.sku || p.sku || 'AUR-PRODUCT') + '</span></div>';
    } else if (block.kind === 'text') {
      body = '<div class="pdp-custom-text" style="' + (b.text_style === 'uppercase' ? 'text-transform:uppercase;letter-spacing:.08em;font-size:12px' : '') + '">' + (b.text || '') + '</div>';
    } else if (block.kind === 'liquid') {
      body = b.code ? '<div class="pdp-custom-text" style="font-family:ui-monospace,monospace">' + OS.esc(b.code) + '</div>' : '';
    } else if (block.kind === 'shipping') {
      const days = Number(b.days || 7);
      let dateLabel = '';
      try {
        const ms = Date.now() + days * 86400000;
        const date = b.timezone === 'utc' ? new Date(ms) : new Date(ms);
        dateLabel = b.timezone === 'utc'
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch (err) {
        dateLabel = '';
      }
      const shipLine = dateLabel
        ? (dateLabel + ' (+/- 2 days)')
        : String(b.fallback_text || '');
      body = '<div class="pdp-ship" data-ship-tz="' + OS.esc(b.timezone || 'store') + '"><strong>' + OS.esc(b.delivery_text || 'Estimated delivery:') + '</strong><div>' + OS.esc(shipLine || String(b.fallback_text || 'Delivery date unavailable')) + '</div></div>';
    } else if (block.kind === 'collapsible') {
      const isOpen = !!(b.open || b.first_open_default);
      const iconLeft = b.icon_position === 'left';
      body = '<div class="pdp-acc' + (isOpen ? ' open' : '') + (iconLeft ? ' icon-left' : '') + '" data-pdp-acc data-accordion="' + (b.accordion_mode ? '1' : '0') + '"><button type="button"><span class="pdp-acc-title">' + OS.esc(b.heading || 'Details') + '</span><span class="pdp-acc-mark">' + (isOpen ? '–' : '+') + '</span></button><div class="body">' + (b.content || '') + (b.custom_liquid ? '<pre>' + OS.esc(b.custom_liquid) + '</pre>' : '') + '</div></div>';
    } else if (block.kind === 'popup') {
      const w = Number(b.popup_width == null ? 560 : b.popup_width);
      const h = Number(b.popup_height == null ? 420 : b.popup_height);
      body = '<button type="button" class="pdp-popup-link' + (b.hover_effect ? ' hover-fx' : '') + '" data-pdp-popup-link data-popup-trigger="' + OS.esc(b.trigger || 'click') + '" data-popup-type="' + OS.esc(b.content_type || 'page') + '" data-popup-page="' + OS.esc(b.page || '') + '" data-popup-w="' + w + '" data-popup-h="' + h + '">' + OS.esc(b.label || 'View details') + '</button>';
    } else if (block.kind === 'line_property') {
      body = '<label class="pdp-property"><span class="pdp-label">' + OS.esc(b.label || 'Your label') + (b.required ? ' *' : '') + '</span><input type="' + (b.type === 'number' ? 'number' : 'text') + '" placeholder="' + OS.esc(b.placeholder || '') + '"' + (b.required ? ' required' : '') + '></label>';
    } else if (block.kind === 'actions') {
      if (b.show_share === false) {
        body = '';
      } else {
        const layout = b.layout || 'tile';
        const style = b.icon_style || 'brand';
        const platforms = Array.isArray(b.platforms) && b.platforms.length
          ? b.platforms
          : ['facebook', 'x', 'pinterest'];
        const showCopy = b.show_copy !== false;
        const icons = {
          facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
          x: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h4.2l4 5.6L16.8 4H20l-6.2 7.2L20 20h-4.2l-4.3-6L7.2 20H4l6.4-7.5L4 4z"/></svg>',
          pinterest: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.8 0-2.6l1.2-5s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-1 3.1-.3.9.4 1.7 1.3 1.7 1.6 0 2.7-2 2.7-4.4 0-1.8-1.2-3.2-3.4-3.2-2.5 0-4 1.7-4 3.6 0 .7.2 1.2.5 1.6l.1.2c-.1.3-.2.9-.2 1l-.3 1.2c0 .2-.2.3-.4.2-1.5-.6-2.2-2.3-2.2-4.2 0-3.1 2.6-6.8 7.7-6.8 4.1 0 6.8 3 6.8 6.2 0 4.2-2.3 7.3-5.8 7.3-1.2 0-2.3-.6-2.6-1.4l-.7 2.7c-.3 1-1 2.1-1.5 2.8A9 9 0 1 0 12 3z"/></svg>',
          instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zm6.2-.9a1 1 0 1 0-1 1 1 1 0 0 0 1-1z"/></svg>',
          whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.9 12.8c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.1-1.8-.1a14 14 0 0 1-6-4.3 6.8 6.8 0 0 1-1.4-3.5c0-.9.5-1.8 1.2-2 .3-.1.7-.1 1 .1l1.3 1.6c.2.2.2.5.1.8l-.4.8c-.1.2-.1.4.1.6a9.3 9.3 0 0 0 2.7 2.5c.2.1.4.1.6 0l.8-.5c.2-.1.5-.1.7.1l1.7 1.3c.3.2.4.6.2 1z"/></svg>',
          telegram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 4.5 3.8 11.2c-1.2.5-1.2 1.2-.2 1.5l4.3 1.3 1.7 5.1c.2.6.1.8.8.8.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.6 5.7c.3-1.2-.4-1.7-1.6-1.2z"/></svg>',
          email: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5H4zm0 2.2V16h16V10.2l-8 5-8-5z"/></svg>',
        };
        const labels = { facebook: 'Facebook', x: 'X', pinterest: 'Pinterest', instagram: 'Instagram', whatsapp: 'WhatsApp', telegram: 'Telegram', email: 'Email' };
        const platHtml = platforms.map((id) => '<a href="#" data-pdp-share-net="' + OS.esc(id) + '" data-net="' + OS.esc(id) + '" aria-label="' + OS.esc(labels[id] || id) + '">' + (icons[id] || '') + (layout === 'inline' ? '<span>' + OS.esc(labels[id] || id) + '</span>' : '') + '</a>').join('');
        const copyBtn = showCopy ? '<button type="button" data-pdp-share-copy aria-label="Copy link">' + (layout === 'inline' ? 'Copy' : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 7h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm2 2v9h9V9H10zM6 5h9v2H6a2 2 0 0 0-2 2v9h2V9a2 2 0 0 1 2-2z"/></svg>') + '</button>' : '';
        if (layout === 'dropdown') {
          const shareIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.4168 15.525C3.70274 14.1555 7.07852 11.25 11.8754 11.25V15L18.1254 8.75L11.8754 2.5V6.25C7.7504 6.25 2.46212 10.1914 1.8754 15.2766C1.86728 15.3424 1.88032 15.4091 1.91265 15.4671C1.94498 15.525 1.99491 15.5712 2.05522 15.5988C2.11552 15.6265 2.18307 15.6343 2.24807 15.621C2.31308 15.6077 2.37218 15.5741 2.4168 15.525Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          body = '<div class="pdp-link-actions pdp-share-dd"><button type="button" data-pdp-share>' + shareIcon + '<span>Share</span></button></div>';
        } else if (layout === 'inline') {
          body = '<div class="pdp-share-inline ' + OS.esc(style) + '" data-pdp-share-bar>' + platHtml + copyBtn + '</div>';
        } else {
          body = '<div class="pdp-share-tile ' + OS.esc(style) + '" data-pdp-share-bar>' + platHtml + copyBtn + '</div>';
        }
      }
    } else if (block.kind === 'recommendations') {
      let list = byIds(b.products);
      if (!list.length) list = others(p, 4);
      if (b.dedupe_current !== false) list = list.filter((item) => item.id !== p.id && item.handle !== p.handle);
      if (b.exclude_soldout) list = list.filter((item) => Number(item.inventory == null ? 1 : item.inventory) > 0);
      if (!list.length && (b.empty_behavior || 'hide') === 'hide') {
        body = '';
      } else {
        const cols = mob ? (b.mobile_count || 2) : (b.per_row || 2);
        const cards = list.map((item) => '<div class="pdp-rec-card"><div class="im" style="background-image:url(' + OS.esc(item.image) + ')"></div><b>' + OS.esc(item.title) + '</b><div>' + OS.money(item.price) + '</div></div>').join('');
        body = (b.heading ? '<h3 class="pdp-rec-h">' + OS.esc(b.heading) + '</h3>' : '') +
          '<div class="pdp-rec-row" data-pdp-rec style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))">' + cards + '</div>';
      }
    }
    if (!body) return '';
    return '<div class="pdp-row pdp-kind-' + OS.esc(block.kind) + '" data-block-id="' + OS.esc(block.id) + '">' + body + '</div>';
  }

  function mediaHtml(items, s, t, mob) {
    const ratio = 'aspect-ratio:3/4;';
    const layout = s.desktop_media_layout || 'thumbs-bottom';
    if (mob) {
      return '<div class="pdp-media">' +
        stage(cell(items[0], 0, s, t, ratio), items.length) +
        (s.mobile_thumbnails !== false
          ? '<div class="pdp-thumbs" style="margin-top:9px;overflow:auto">' + items.map((item, i) => '<button type="button" class="pdp-thumb' + (i === 0 ? ' on' : '') + '" data-pdp-thumb="' + i + '" data-src="' + OS.esc(item.src) + '" style="background-image:url(' + OS.esc(item.src) + ')"></button>').join('') + '</div>'
          : '<div class="pdp-dots">' + items.map((item, i) => '<button type="button" class="pdp-dot' + (i === 0 ? ' on' : '') + '" data-pdp-dot="' + i + '" data-src="' + OS.esc(item.src) + '"></button>').join('') + '</div>') + '</div>';
    }
    if (layout === 'grid-1') return '<div class="pdp-media">' + cell(items[0], 0, s, t, ratio) + '</div>';
    if (layout === 'grid-2') return '<div class="pdp-media pdp-grid-2">' + items.map((item, i) => cell(item, i, s, t, ratio)).join('') + '</div>';
    if (layout === 'grid-highlight') return '<div class="pdp-media pdp-highlight">' + items.map((item, i) => cell(item, i, s, t, i === 0 ? '' : ratio)).join('') + '</div>';
    const left = layout === 'thumbs-left';
    const main = stage(cell(items[0], 0, s, t, ratio + (left ? 'min-height:460px;' : '')), items.length);
    const thumbs = '<div class="pdp-thumbs">' + items.map((item, i) => '<button type="button" class="pdp-thumb' + (i === 0 ? ' on' : '') + '" data-pdp-thumb="' + i + '" data-src="' + OS.esc(item.src) + '" style="background-image:url(' + OS.esc(item.src) + ')"></button>').join('') + '</div>';
    return '<div class="pdp-media pdp-carousel' + (left ? ' left' : '') + '">' + (left ? thumbs + main : main + thumbs) + '</div>';
  }

  function stickyHtml(block, p, t) {
    if (!block || block.hidden) return '';
    const b = block.settings || {};
    return '<div class="pdp-sticky" data-block-id="' + OS.esc(block.id) + '">' +
      (b.show_image ? '<img alt="" src="' + OS.esc(p.image) + '">' : '') +
      '<div class="meta">' + (b.show_title ? '<b>' + OS.esc(p.title) + '</b>' : '') + (b.show_price ? '<span>' + OS.money(p.price) + '</span>' : '') + '</div>' +
      '<button type="button" class="pdp-atc" data-pdp-atc style="' + OS.btnStyle(t) + '">' + OS.esc(b.button_text || 'Add to cart') + '</button></div>';
  }

  function popupHtml(s, p, t) {
    const recs = s.atc_show_recs ? others(p, 2).map((item) => '<div class="pdp-rec-card"><div class="im" style="background-image:url(' + OS.esc(item.image) + ')"></div><b>' + OS.esc(item.title) + '</b><div>' + OS.money(item.price) + '</div></div>').join('') : '';
    return '<div class="pdp-pop" data-pdp-pop><div class="pdp-pop-card">' +
      '<div class="pdp-pop-head"><strong>' + OS.esc(s.atc_heading || 'Added to cart') + '</strong><button type="button" class="pdp-pop-x" data-pdp-pop-close>×</button></div>' +
      '<div class="pdp-pop-item"><img alt="" data-pdp-pop-img src="' + OS.esc(p.image) + '"><div><div class="nm">' + OS.esc(p.title) + '</div><div class="sub" data-pdp-pop-meta>M · Qty 1</div><div style="margin-top:4px;font-weight:700" data-pdp-pop-price>' + OS.money(p.price) + '</div></div></div>' +
      (recs ? '<div class="pdp-pop-recs">' + recs + '</div>' : '') +
      '<div class="pdp-pop-actions"><button type="button" style="' + OS.btnStyle(t) + ';width:100%" data-pdp-view>View cart</button><button type="button" style="' + OS.btnStyle(t, { variant: 'secondary' }) + ';width:100%" data-pdp-pop-close>Continue shopping</button></div>' +
      '</div></div><div class="pdp-zoom" data-pdp-zoom><img alt="" data-pdp-zoom-img></div>' +
      '<div class="pdp-pop" data-pdp-share-pop><div class="pdp-pop-card" data-pdp-share-card>' +
        '<div class="pdp-pop-head"><strong>Share this product</strong><button type="button" class="pdp-share-x" data-pdp-share-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M18.75 5.13496L5.25 18.8544" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.75 18.8544L5.25 5.13496" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>' +
        '<div class="pdp-share-row"><input data-pdp-share-url readonly value=""><button type="button" data-pdp-share-copy>Copy</button></div>' +
        '<div class="pdp-share-socials">' +
          '<a href="#" data-pdp-share-net="facebook" target="_blank" rel="noopener" aria-label="Share on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 12.4972C4 16.6986 7.06844 20.1919 11.081 20.9L11.1284 20.8621C11.1126 20.8591 11.0968 20.856 11.081 20.8528V14.8575H8.9567V12.4972H11.081V10.6089C11.081 8.48464 12.45 7.30447 14.3855 7.30447C14.9992 7.30447 15.6601 7.39888 16.2737 7.4933V9.6648H15.188C14.1494 9.6648 13.9134 10.1841 13.9134 10.845V12.4972H16.1793L15.8017 14.8575H13.9134V20.8528C13.8976 20.856 13.8818 20.8591 13.866 20.8621L13.9134 20.9C17.926 20.1919 20.9944 16.6986 20.9944 12.4972C20.9944 7.82374 17.1707 4 12.4972 4C7.82374 4 4 7.82374 4 12.4972Z" fill="currentColor"/></svg></a>' +
          '<a href="#" data-pdp-share-net="x" target="_blank" rel="noopener" aria-label="Share on X"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.04221 4L9.72655 12.9408L3 20.21H4.51388L10.403 13.8457L15.1612 20.21H20.313L13.2525 10.7663L19.5135 4H17.9997L12.5761 9.86141L8.19399 4H3.04221ZM5.26848 5.11552H7.63522L18.0863 19.0943H15.7196L5.26848 5.11552Z" fill="currentColor"/></svg></a>' +
          '<a href="#" data-pdp-share-net="pinterest" target="_blank" rel="noopener" aria-label="Pin on Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.6611 3.07934C10.6273 2.79957 8.56095 3.26511 6.84363 4.38998C5.12631 5.51485 3.87398 7.22309 3.31788 9.19927C2.76179 11.1754 2.93948 13.2861 3.81815 15.1415C4.69683 16.9969 6.21713 18.4717 8.09835 19.2936C8.04748 18.6406 8.09417 17.9838 8.2369 17.3446C8.39415 16.6315 9.33848 12.7011 9.33848 12.7011C9.15043 12.2796 9.05646 11.8222 9.06308 11.3607C9.06308 10.0985 9.79152 9.15671 10.6976 9.15671C10.8604 9.15434 11.0218 9.18705 11.1708 9.25261C11.3198 9.31818 11.4529 9.41506 11.5611 9.53667C11.6694 9.65828 11.7501 9.80177 11.7979 9.95739C11.8458 10.113 11.8595 10.2771 11.8383 10.4385C11.8383 11.2035 11.347 12.3611 11.0903 13.4474C11.0396 13.6466 11.0363 13.855 11.0809 14.0557C11.1254 14.2564 11.2165 14.4438 11.3468 14.6028C11.477 14.7619 11.6428 14.8881 11.8308 14.9713C12.0188 15.0545 12.2237 15.0924 12.429 15.0819C14.0423 15.0819 15.1235 13.0156 15.1235 10.5762C15.1235 8.70622 13.885 7.30545 11.602 7.30545C11.0558 7.28423 10.5109 7.37423 10.0006 7.57001C9.49018 7.76579 9.02493 8.06325 8.63303 8.44433C8.24114 8.82542 7.93078 9.28217 7.72081 9.78687C7.51084 10.2916 7.40563 10.8337 7.41157 11.3803C7.38723 11.9866 7.58284 12.5813 7.96235 13.0547C8.03327 13.1077 8.08505 13.1822 8.10989 13.2672C8.13473 13.3521 8.13127 13.4428 8.10005 13.5256C8.06095 13.682 7.96235 14.0552 7.92326 14.192C7.91512 14.2384 7.8962 14.2823 7.86803 14.32C7.83985 14.3578 7.80319 14.3884 7.76102 14.4094C7.71885 14.4304 7.67233 14.4412 7.62521 14.441C7.5781 14.4407 7.5317 14.4294 7.48976 14.4079C6.31339 13.937 5.7592 12.6425 5.7592 11.1644C5.7592 8.74447 7.78556 5.84773 11.84 5.84773C15.0665 5.84773 17.2119 8.20813 17.2119 10.7326C17.2119 14.0552 15.3614 16.5533 12.6271 16.5533C12.2184 16.5663 11.813 16.4761 11.4484 16.291C11.0838 16.1059 10.7718 15.8318 10.5412 15.4942C10.5412 15.4942 10.0499 17.4627 9.95301 17.835C9.75521 18.4782 9.46334 19.0886 9.08688 19.6463C9.87141 19.8843 10.6865 20.0033 11.5059 19.9999C12.6224 20.0008 13.7282 19.7815 14.7598 19.3544C15.7914 18.9274 16.7287 18.3011 17.5179 17.5113C18.3071 16.7215 18.9328 15.7838 19.3591 14.7519C19.7854 13.72 20.004 12.6141 20.0023 11.4976C20.0013 9.44485 19.2576 7.46184 17.9085 5.91469C16.5595 4.36754 14.6962 3.36074 12.6628 3.08019L12.6611 3.07934Z" fill="currentColor"/></svg></a>' +
        '</div></div></div>';
  }

  OS.register('product-main', {
    name: 'Product information', group: 'product-page', icon: 'cart', singleton: true, required: true, pages: ['product'],
    schema: [
      { key: 'full_width', control: 'toggle', label: 'Full width', default: false },
      { sub: 'Media' },
      { tip: 'Learn more about media types.', tipLink: { text: 'media types', href: 'https://help.shopify.com/manual/online-store/themes/theme-structure/theme-settings#media' } },
      { key: 'desktop_media_size', control: 'select', inline: true, label: 'Desktop media width', default: 'medium', options: [
        { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' },
      ], info: 'Media is automatically optimized for mobile.' },
      { key: 'desktop_media_layout', control: 'select', inline: true, label: 'Desktop layout', default: 'thumbs-bottom', options: LAYOUTS },
      { key: 'mobile_thumbnails', control: 'toggle', label: 'Show mobile thumbnails', default: true },
      { key: 'enable_zoom', control: 'toggle', label: 'Enable image zoom', default: true },
      { sub: 'Section padding' },
      { key: 'padding_top', control: 'range', inline: true, label: 'Top padding', min: 0, max: 100, step: 1, unit: 'px', default: 0 },
      { key: 'padding_bottom', control: 'range', inline: true, label: 'Bottom padding', min: 0, max: 100, step: 1, unit: 'px', default: 100 },
      { key: 'custom_css', control: 'custom_css', label: 'Custom CSS', default: '', placeholder: '.pdpx { }', info: 'Applies to this section on this page only.' },
    ],
    blocks: { kinds: BLOCKS, max: 24 },
    defaultBlocks: () => ([
      ['badges', { show_sold_out: false, show_saving: false, saving_type: 'percentage', badge_position: 'top-left', badge_icon: 'none', badge_icon_image: '', badge_bg: '', badge_text_color: '', badge_gap: 8 }],
      ['title', { title_size: 24, description: '', description_image: '', description_color: '#000000', description_size: 14, description_top: 0, description_bottom: 0 }],
      ['price', { show_taxes: false, show_saving: true, saving_type: 'percentage', saving_position: 'right', saving_label: '', saving_bg: '', saving_text_color: '#ffffff', saving_icon: false }],
      ['rating', { show_rating: true, size: 14, show_text: false, text: '4.8 (214) 7,000+ satisfied customers' }],
      ['description', {}],
      ['inventory', { show_status: true, show_count: true, custom_text: '', low_stock_threshold: 5, low_stock_text: 'Low stock - {n} items left', sold_out_text: 'Sold out', status_style: 'dot', status_color: '#f59e0b' }],
      ['variant', { hide_sold_out: false, picker_type: 'buttons', swatch_style: 'color', shape: 'normal', nested_dropdown: false, show_group_title: false, sku_display_name: '', show_sku_in_option: false }],
      ['buy', { show_quantity: true, show_add: true, show_dynamic: true, show_payment_options: true, button_shape: 'normal', custom_radius: 8, button_layout: 'stacked', channels: ['shop', 'paypal', 'apple_pay', 'google_pay'], channel_logo: false }],
      ['icon_text', { layout: 'horizontal', font: 'body', size: 'base', icon_1: 'package', image_1: '', first: 'Orders over $50 ship free', icon_2: 'currency', image_2: '', second: '30 day returns', icon_3: 'star4', image_3: '', third: '' }],
      ['collapsible', { heading: 'Overview', icon: 'none', content: 'A clinically proven, non-sticky, vegan lip treatment that delivers the intense hydration of a lip mask with a sweet sheer tint using food-grade, non-artificial flavor. Designed for sensitive, irritated lips, this cushiony treatment delivers instant comfort to rescue dry, chapped lips.', custom_liquid: '', page: '', open: false }],
      ['collapsible', { heading: 'How to use', icon: 'none', content: 'Apply generously to lips for hydration and comfort. Use at night for an overnight mask.', custom_liquid: '', page: '', open: false }],
      ['collapsible', { heading: 'Ingredients', icon: 'none', content: '<ul><li>Dulce De Leche</li><li>Ube vanilla</li><li>Watermelon kiwi</li><li>Blood orange vanilla</li></ul>', custom_liquid: '', page: '', open: false }],
      ['actions', { show_share: true, layout: 'tile', icon_style: 'brand', platforms: ['facebook', 'x', 'pinterest'], show_copy: true }],
    ]).map((pair) => ({ id: OS.uid('pdp'), kind: pair[0], hidden: false, settings: pair[1] })),
    render: function (s, blocks, ctx) {
      const t = ctx.tokens || {};
      const mob = !!ctx.mob;
      const p = productOf(ctx);
      const resolved = resolveSelectedVariant(p);
      const selected = resolved.variant || p;
      const c = t.colors || {};
      const text = c.text_color || '#1a1a1a';
      const bg = 'transparent';
      // Shopify Horizon page-width gutter — shared with header/footer via OS.pageGutter.
      const padX = OS.pageGutter(t, mob, { fullWidth: !!s.full_width });
      const mediaSize = s.desktop_media_size || 'medium';
      const size = mob ? 100 : ({ small: 45, medium: 55, large: 65 }[mediaSize] || 55);
      const items = slides(p);
      const visible = (blocks || []).filter((b) => !b.hidden);
      const customCss = s.custom_css ? '<style>' + String(s.custom_css).replace(/<\/style/gi, '<\\/style') + '</style>' : '';
      const padTop = Math.max(0, Math.min(100, s.padding_top == null ? 0 : Number(s.padding_top)));
      const padBot = Math.max(0, Math.min(100, s.padding_bottom == null ? 100 : Number(s.padding_bottom)));
      return '<div class="pdpx' + (mob ? ' mob' : '') + '" data-media-size="' + OS.esc(mediaSize) + '" data-pdp-handle="' + OS.esc(p.handle || p.id || '') + '" data-pdp-url-state="' + OS.esc(resolved.urlState) + '" data-pdp-variant="' + OS.esc(selected.id || '') + '" style="color:' + text + ';font-family:' + OS.bodyFamily(t) + ';padding:' + padTop + 'px ' + padX + ' ' + padBot + 'px">' +
        '<div style="max-width:100%;width:100%;margin:0 auto">' +
        '<div class="pdp-grid" style="grid-template-columns:' + size + '% minmax(0,1fr)">' +
          mediaHtml(items, s, t, mob) +
          '<div class="pdp-buy" style="background:' + bg + ';color:' + text + ';padding:' + (bg && bg !== 'transparent' ? '16px' : '0') + '">' +
            visible.map((b) => rowHtml(b, p, s, t, ctx, selected)).join('') +
          '</div></div></div>' + popupHtml(s, p, t) + customCss + '</div>';
    },
    hydrate: function (root, settings) {
      const pop = root.querySelector('[data-pdp-pop]');
      const zoom = root.querySelector('[data-pdp-zoom]');
      let slideBusy = false;
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function currentIndex() {
        const on = root.querySelector('[data-pdp-thumb].on,[data-pdp-dot].on');
        return on ? Number(on.getAttribute('data-pdp-thumb') || on.getAttribute('data-pdp-dot')) : 0;
      }
      function heroCell() {
        return root.querySelector('.pdp-stage > .pdp-cell, .pdp-carousel > .pdp-cell, .pdp-media > .pdp-cell');
      }
      function slideHero(hero, nextUrl, dir) {
        if (!hero || !nextUrl) return;
        const nextBg = 'url("' + nextUrl + '")';
        const curBg = hero.style.backgroundImage || '';
        if (!dir || reduceMotion || slideBusy || !curBg || curBg === nextBg) {
          hero.style.backgroundImage = nextBg;
          return;
        }
        const stage = hero.closest('.pdp-stage') || hero.parentElement;
        if (!stage) { hero.style.backgroundImage = nextBg; return; }
        slideBusy = true;
        const out = document.createElement('div');
        out.className = 'pdp-slide ' + (dir > 0 ? 'to-left' : 'to-right');
        out.style.backgroundImage = curBg;
        const inn = document.createElement('div');
        inn.className = 'pdp-slide ' + (dir > 0 ? 'from-right' : 'from-left');
        inn.style.backgroundImage = nextBg;
        stage.appendChild(out);
        stage.appendChild(inn);
        hero.style.backgroundImage = nextBg;
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          out.remove();
          inn.remove();
          slideBusy = false;
        };
        inn.addEventListener('animationend', finish, { once: true });
        window.setTimeout(finish, 500);
      }
      function activate(i, src, dir) {
        root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]').forEach((el) => {
          const on = Number(el.getAttribute('data-pdp-thumb') || el.getAttribute('data-pdp-dot')) === i;
          el.classList.toggle('on', on);
        });
        const srcEl = root.querySelector('[data-pdp-media="' + i + '"]');
        const image = src || (srcEl && srcEl.getAttribute('data-src'));
        const hero = heroCell();
        if (image && hero) slideHero(hero, image, dir || 0);
      }
      root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (slideBusy) return;
        const next = Number(el.getAttribute('data-pdp-thumb') || el.getAttribute('data-pdp-dot'));
        const cur = currentIndex();
        if (next === cur) return;
        activate(next, el.getAttribute('data-src'), next > cur ? 1 : -1);
      }));
      root.querySelectorAll('[data-pdp-nav]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (slideBusy) return;
        const marks = Array.from(root.querySelectorAll('[data-pdp-thumb],[data-pdp-dot]'));
        if (!marks.length) return;
        const cur = currentIndex();
        const dir = Number(el.getAttribute('data-pdp-nav')) || 1;
        const next = (cur + dir + marks.length) % marks.length;
        activate(next, marks[next].getAttribute('data-src'), dir);
      }));
      root.querySelectorAll('[data-pdp-media]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.classList.contains('is-video')) { el.classList.toggle('is-playing'); return; }
        if (!settings.enable_zoom || !zoom) return;
        const img = zoom.querySelector('img');
        if (img) img.src = el.getAttribute('data-src') || '';
        zoom.classList.add('on');
      }));
      if (zoom) zoom.addEventListener('click', (e) => { e.stopPropagation(); zoom.classList.remove('on'); });
      const qtyEl = root.querySelector('[data-pdp-qty]');
      let qty = 1;
      // Only the hidden <i data-pdp-variant> rows — not .pdpx[data-pdp-variant].
      const variantEls = Array.from(root.querySelectorAll('[data-pdp-variant-data] [data-id]'));
      const shellEl = root.querySelector('.pdpx') || root;
      const productHandle = shellEl.getAttribute('data-pdp-handle') || root.getAttribute('data-pdp-handle') || '';
      let currentColor = (root.querySelector('[data-pdp-color].on') || {}).dataset ? root.querySelector('[data-pdp-color].on').dataset.pdpColor : '';
      let currentSize = (root.querySelector('[data-pdp-size].on') || {}).dataset ? root.querySelector('[data-pdp-size].on').dataset.pdpSize : '';
      const colorDd = root.querySelector('[data-pdp-color-dd]');
      const sizeDd = root.querySelector('[data-pdp-size-dd]');
      const nestedDd = root.querySelector('[data-pdp-nested-dd]');
      if (!currentColor && colorDd) {
        const on = colorDd.querySelector('.pdp-dd-opt.on');
        currentColor = on ? on.getAttribute('data-value') : '';
      }
      if (!currentSize && sizeDd) {
        const on = sizeDd.querySelector('.pdp-dd-opt.on');
        currentSize = on ? on.getAttribute('data-value') : '';
      }
      if ((!currentColor || !currentSize) && nestedDd) {
        const on = nestedDd.querySelector('.pdp-dd-opt.on');
        if (on) {
          currentColor = currentColor || on.getAttribute('data-pdp-color') || '';
          currentSize = currentSize || on.getAttribute('data-pdp-size') || '';
        }
      }
      function variantData(el) {
        return {
          id: el.dataset.id,
          color: el.dataset.color,
          size: el.dataset.size,
          price: Number(el.dataset.price || 0),
          compareAt: Number(el.dataset.compare || 0),
          inventory: Number(el.dataset.inventory || 0),
          image: el.dataset.image,
          sku: el.dataset.sku,
        };
      }
      function closeAllDd() {
        root.querySelectorAll('.pdp-dd.open').forEach((dd) => {
          dd.classList.remove('open');
          const btn = dd.querySelector('[data-pdp-dd-btn]');
          const menu = dd.querySelector('[data-pdp-dd-menu]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (menu) {
            menu.hidden = true;
            menu.style.left = '';
            menu.style.top = '';
            menu.style.width = '';
          }
        });
      }
      function placeDdMenu(dd) {
        const btn = dd.querySelector('[data-pdp-dd-btn]');
        const menu = dd.querySelector('[data-pdp-dd-menu]');
        if (!btn || !menu) return;
        const r = btn.getBoundingClientRect();
        const maxH = Math.min(240, Math.max(120, window.innerHeight - r.bottom - 12));
        const openUp = r.bottom + Math.min(maxH, menu.scrollHeight || maxH) > window.innerHeight - 8 && r.top > maxH;
        menu.hidden = false;
        menu.style.left = Math.round(r.left) + 'px';
        menu.style.width = Math.round(r.width) + 'px';
        menu.style.maxHeight = maxH + 'px';
        if (openUp) {
          menu.style.top = 'auto';
          menu.style.bottom = Math.round(window.innerHeight - r.top + 4) + 'px';
        } else {
          menu.style.bottom = 'auto';
          menu.style.top = Math.round(r.bottom + 4) + 'px';
        }
      }
      function syncDd(dd, value, all, kind) {
        if (!dd) return;
        const label = dd.querySelector('[data-pdp-dd-val]');
        let selectedSold = false;
        dd.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
          const v = opt.getAttribute('data-value') || '';
          const on = v === value;
          const exists = kind === 'size'
            ? all.some((row) => (!currentColor || row.color === currentColor) && row.size === v)
            : true;
          const sold = kind === 'size'
            ? !all.some((row) => (!currentColor || row.color === currentColor) && row.size === v && Number(row.inventory || 0) > 0)
            : !all.some((row) => row.color === v && Number(row.inventory || 0) > 0);
          opt.classList.toggle('on', on);
          opt.setAttribute('aria-selected', on ? 'true' : 'false');
          opt.disabled = kind === 'size' ? !exists : false;
          opt.textContent = v + (exists && sold ? ' — Sold out' : '');
          if (on) selectedSold = !!sold && exists;
        });
        if (label) label.textContent = value + (selectedSold ? ' — Sold out' : '');
      }
      function syncVariant(prefer, opts) {
        const writeUrl = !!(opts && opts.writeUrl);
        const all = variantEls.map(variantData);
        let match = all.find((v) => (!currentColor || v.color === currentColor) && (!currentSize || v.size === currentSize));
        if (!match && prefer === 'color') match = all.find((v) => !currentColor || v.color === currentColor);
        if (!match && prefer === 'size') match = all.find((v) => !currentSize || v.size === currentSize);
        if (!match) match = all[0];
        if (!match) return;
        currentColor = match.color || currentColor;
        currentSize = match.size || currentSize;
        root.querySelectorAll('button[data-pdp-color]').forEach((el) => el.classList.toggle('on', el.dataset.pdpColor === currentColor));
        root.querySelectorAll('button[data-pdp-size]').forEach((el) => {
          const exists = all.some((v) => (!currentColor || v.color === currentColor) && v.size === el.dataset.pdpSize);
          el.disabled = !exists;
          el.classList.toggle('on', el.dataset.pdpSize === currentSize);
        });
        const colorLabel = root.querySelector('[data-pdp-color-label]');
        const sizeLabel = root.querySelector('[data-pdp-size-label]');
        if (colorLabel && currentColor) colorLabel.textContent = currentColor;
        if (sizeLabel && currentSize) sizeLabel.textContent = currentSize;
        syncDd(colorDd, currentColor, all, 'color');
        syncDd(sizeDd, currentSize, all, 'size');
        if (nestedDd) {
          const label = nestedDd.querySelector('[data-pdp-dd-val]');
          nestedDd.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
            const on = (opt.getAttribute('data-pdp-color') || '') === (currentColor || '')
              && (opt.getAttribute('data-pdp-size') || '') === (currentSize || '');
            opt.classList.toggle('on', on);
            opt.setAttribute('aria-selected', on ? 'true' : 'false');
            if (on && label) label.textContent = opt.textContent || '';
          });
        }
        const now = root.querySelector('[data-pdp-now]');
        const compare = root.querySelector('[data-pdp-compare]');
        const save = root.querySelector('[data-pdp-save]');
        const stock = root.querySelector('[data-pdp-stock]');
        const sku = root.querySelector('[data-pdp-sku]');
        if (now) now.textContent = OS.money(match.price);
        if (compare) {
          compare.hidden = !(match.compareAt > match.price);
          compare.textContent = match.compareAt > match.price ? OS.money(match.compareAt) : '';
        }
        if (save && match.compareAt > match.price) {
          const customLabel = String(save.dataset.saveLabel || '').trim();
          const label = customLabel || (save.dataset.saveType === 'fixed'
            ? 'Save ' + OS.money(match.compareAt - match.price)
            : 'Save ' + Math.round((1 - match.price / match.compareAt) * 100) + '%');
          const iconHtml = save.dataset.saveIcon === '1'
            ? '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.2 4.2h7.6v7.6H4.2z" stroke="currentColor" stroke-width="1.4"/><path d="M6.2 9.8 9.8 6.2M6.5 6.5h.01M9.5 9.5h.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
            : '';
          save.innerHTML = iconHtml + label;
        }
        if (stock) {
          const threshold = Number(stock.getAttribute('data-low-threshold') || 5);
          const isLow = match.inventory > 0 && match.inventory <= threshold;
          stock.classList.toggle('sold', match.inventory <= 0);
          stock.classList.toggle('low', isLow);
          const text = stock.querySelector('span');
          const showCount = stock.getAttribute('data-show-count') !== '0';
          const customText = stock.getAttribute('data-custom-text') || '';
          const lowTextTpl = stock.getAttribute('data-low-text') || 'Low stock - {n} items left';
          const soldText = stock.getAttribute('data-sold-text') || 'Sold out';
          if (text) {
            text.textContent = match.inventory <= 0
              ? soldText
              : (isLow
                ? lowTextTpl.replace(/\{n\}/g, String(match.inventory)) + customText
                : ((showCount ? match.inventory + ' in stock' : 'In stock') + customText));
          }
        }
        if (sku) sku.textContent = match.sku || '';
        if (match.image) {
          const hero = root.querySelector('.pdp-stage > .pdp-cell, .pdp-carousel > .pdp-cell, .pdp-media > .pdp-cell');
          if (hero) hero.style.backgroundImage = 'url("' + match.image + '")';
          const popImage = root.querySelector('[data-pdp-pop-img]');
          if (popImage) popImage.src = match.image;
        }
        if (qty > Math.max(1, match.inventory)) {
          qty = Math.max(1, match.inventory);
          if (qtyEl) qtyEl.textContent = String(qty);
        }
        root.querySelectorAll('[data-pdp-atc]').forEach((button) => {
          button.disabled = match.inventory <= 0;
          button.textContent = match.inventory <= 0 ? 'Sold out' : 'Add to cart';
        });
        // render() puts data-pdp-variant on .pdpx; hydrate root is .os-sec — keep the shell in sync.
        shellEl.setAttribute('data-pdp-variant', match.id || '');
        // User switch: update ?variant= via replaceState; keep utm and other params (PRD 3.1).
        if (writeUrl && match.id) replaceUrlVariant(match.id);
      }
      root.querySelectorAll('button[data-pdp-color]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        currentColor = el.dataset.pdpColor;
        syncVariant('color', { writeUrl: true });
      }));
      root.querySelectorAll('button[data-pdp-size]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.disabled) return;
        currentSize = el.dataset.pdpSize;
        syncVariant('size', { writeUrl: true });
      }));
      root.querySelectorAll('.pdp-dd').forEach((dd) => {
        const kind = dd.hasAttribute('data-pdp-nested-dd') ? 'nested'
          : (dd.hasAttribute('data-pdp-color-dd') ? 'color' : 'size');
        const btn = dd.querySelector('[data-pdp-dd-btn]');
        const menu = dd.querySelector('[data-pdp-dd-menu]');
        if (!btn || !menu) return;
        const stop = (e) => { e.stopPropagation(); };
        dd.addEventListener('mousedown', stop);
        dd.addEventListener('click', stop);
        menu.addEventListener('mousedown', stop);
        menu.addEventListener('click', stop);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const willOpen = !dd.classList.contains('open');
          closeAllDd();
          if (!willOpen) return;
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          placeDdMenu(dd);
        });
        menu.querySelectorAll('[data-pdp-dd-opt]').forEach((opt) => {
          opt.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (opt.disabled) return;
            if (kind === 'nested') {
              currentColor = opt.getAttribute('data-pdp-color') || '';
              currentSize = opt.getAttribute('data-pdp-size') || '';
              closeAllDd();
              syncVariant('nested', { writeUrl: true });
              return;
            }
            const value = opt.getAttribute('data-value') || '';
            if (kind === 'color') currentColor = value;
            else currentSize = value;
            closeAllDd();
            syncVariant(kind, { writeUrl: true });
          });
        });
      });
      const onDdOutside = (e) => {
        if (e.target.closest && e.target.closest('.pdp-dd, .pdp-dd-menu')) return;
        closeAllDd();
      };
      const onDdReposition = () => {
        const open = root.querySelector('.pdp-dd.open');
        if (open) placeDdMenu(open);
        else closeAllDd();
      };
      if (OS._pdpDdAbort) { try { OS._pdpDdAbort.abort(); } catch (err) { /* noop */ } }
      OS._pdpDdAbort = new AbortController();
      const ddSignal = { signal: OS._pdpDdAbort.signal };
      document.addEventListener('mousedown', onDdOutside, ddSignal);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllDd(); }, ddSignal);
      const sc = document.getElementById('os-cscroll') || document.querySelector('.os-canvas-scroll');
      if (sc) sc.addEventListener('scroll', onDdReposition, Object.assign({ passive: true }, ddSignal));
      window.addEventListener('resize', onDdReposition, ddSignal);
      root.querySelectorAll('[data-pdp-q]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        qty = Math.max(1, qty + (el.getAttribute('data-pdp-q') === '+' ? 1 : -1));
        if (qtyEl) qtyEl.textContent = String(qty);
      }));
      // Init from ?variant=: valid keeps link; invalid strips param; absent does not auto-add variant.
      const allInit = variantEls.map(variantData);
      const urlId = readUrlVariantId();
      const urlState = shellEl.getAttribute('data-pdp-url-state') || 'absent';
      if (urlState === 'invalid' || (urlId && !allInit.some((v) => String(v.id) === String(urlId)))) {
        replaceUrlVariant('');
      }
      let init = urlId ? allInit.find((v) => String(v.id) === String(urlId)) : null;
      if (!init) init = allInit.find((v) => v.inventory > 0) || allInit[0];
      if (init) {
        currentColor = init.color || currentColor;
        currentSize = init.size || currentSize;
      }
      syncVariant();
      const accordions = [...root.querySelectorAll('[data-pdp-acc]')];
      const setAcc = (box, open) => {
        box.classList.toggle('open', open);
        const mark = box.querySelector(':scope > button .pdp-acc-mark') || box.querySelector(':scope > button span:last-child');
        if (mark) mark.textContent = open ? '–' : '+';
      };
      const isAccordion = (box) => box.getAttribute('data-accordion') === '1';
      let keptAcc = false;
      accordions.forEach((box) => {
        if (!box.classList.contains('open')) return;
        if (isAccordion(box) && keptAcc) setAcc(box, false);
        else if (isAccordion(box)) keptAcc = true;
      });
      accordions.forEach((box) => {
        const btn = box.querySelector(':scope > button');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = !box.classList.contains('open');
          if (isAccordion(box) && open) {
            accordions.forEach((other) => { if (isAccordion(other)) setAcc(other, false); });
          }
          setAcc(box, open);
        });
      });
      function chosenSize() {
        const on = root.querySelector('button[data-pdp-size].on');
        const ddOn = root.querySelector('[data-pdp-size-dd] .pdp-dd-opt.on');
        return (on && on.textContent) || (ddOn && ddOn.getAttribute('data-value')) || currentSize || 'M';
      }
      function openPop() {
        if (settings.atc_popup === false || !pop) return;
        const meta = pop.querySelector('[data-pdp-pop-meta]');
        const price = pop.querySelector('[data-pdp-pop-price]');
        const unit = root.querySelector('.pdp-price .now');
        if (meta) meta.textContent = chosenSize() + ' · Qty ' + qty;
        if (price && unit) price.textContent = unit.textContent;
        pop.classList.add('on');
        const card = pop.querySelector('.pdp-pop-card');
        if (card && card.scrollIntoView) card.scrollIntoView({ block: 'nearest' });
      }
      root.querySelectorAll('[data-pdp-atc]').forEach((el) => el.addEventListener('click', (e) => { e.stopPropagation(); openPop(); }));
      root.querySelectorAll('[data-pdp-paypal]').forEach((el) => el.addEventListener('click', (e) => e.stopPropagation()));
      root.querySelectorAll('[data-pdp-pay-more]').forEach((el) => el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof OS.goCheckout === 'function') OS.goCheckout();
      }));
      root.querySelectorAll('[data-pdp-popup-link]').forEach((el) => el.addEventListener('click', (e) => { e.stopPropagation(); openPop(); }));
      const sharePop = root.querySelector('[data-pdp-share-pop]');
      let shareCopyTimer = 0;
      function shareUrl() {
        const input = sharePop && sharePop.querySelector('[data-pdp-share-url]');
        return (input && input.value) || location.href;
      }
      function resetShareCopy() {
        const copy = sharePop && sharePop.querySelector('[data-pdp-share-copy]');
        if (!copy) return;
        copy.textContent = 'Copy';
        copy.classList.remove('is-copied');
      }
      function setShareUrl(url) {
        const input = sharePop && sharePop.querySelector('[data-pdp-share-url]');
        if (input) input.value = url;
        if (!sharePop) return;
        const enc = encodeURIComponent(url);
        const title = encodeURIComponent(document.title || 'Product');
        const map = {
          facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc,
          x: 'https://twitter.com/intent/tweet?url=' + enc + '&text=' + title,
          pinterest: 'https://pinterest.com/pin/create/button/?url=' + enc + '&description=' + title,
        };
        sharePop.querySelectorAll('[data-pdp-share-net]').forEach((a) => {
          const href = map[a.getAttribute('data-pdp-share-net')];
          if (href) a.setAttribute('href', href);
        });
      }
      function pinSharePop() {
        const stage = document.getElementById('os-cscroll')
          || document.querySelector('.os-canvas-scroll')
          || document.querySelector('.os-preview-stage')
          || document.getElementById('os-frame')
          || root;
        const r = stage.getBoundingClientRect();
        sharePop.style.position = 'fixed';
        sharePop.style.inset = 'auto';
        sharePop.style.left = Math.round(r.left) + 'px';
        sharePop.style.top = Math.round(r.top) + 'px';
        sharePop.style.right = 'auto';
        sharePop.style.bottom = 'auto';
        sharePop.style.width = Math.round(r.width) + 'px';
        sharePop.style.height = Math.round(r.height) + 'px';
        sharePop.style.zIndex = '40';
      }
      function unpinSharePop() {
        ['position', 'inset', 'left', 'top', 'right', 'bottom', 'width', 'height', 'zIndex'].forEach((k) => {
          sharePop.style[k] = '';
        });
      }
      function openShare() {
        if (!sharePop) return;
        const card = sharePop.querySelector('[data-pdp-share-card]');
        if (card) { card.style.left = ''; card.style.top = ''; card.style.width = ''; }
        pinSharePop();
        sharePop.classList.add('on');
      }
      function closeShare() {
        if (!sharePop) return;
        sharePop.classList.remove('on');
        unpinSharePop();
        if (shareCopyTimer) clearTimeout(shareCopyTimer);
        resetShareCopy();
      }
      root.querySelectorAll('[data-pdp-share]').forEach((el) => el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sharePop && sharePop.classList.contains('on')) { closeShare(); return; }
        // Share uses storefront-shaped URL /products/{handle}?variant= (PRD 3.1); live page keeps SPA path.
        const vid = shellEl.getAttribute('data-pdp-variant') || readUrlVariantId();
        setShareUrl(location.origin + storefrontProductUrl(productHandle, vid || ''));
        resetShareCopy();
        openShare();
      }));
      if (sharePop) {
        sharePop.addEventListener('click', (e) => {
          e.stopPropagation();
          if (e.target === sharePop) closeShare();
        });
        sharePop.querySelectorAll('[data-pdp-share-close]').forEach((el) => el.addEventListener('click', (e) => { e.stopPropagation(); closeShare(); }));
        sharePop.querySelectorAll('[data-pdp-share-net]').forEach((a) => a.addEventListener('click', (e) => e.stopPropagation()));
        const copy = sharePop.querySelector('[data-pdp-share-copy]');
        if (copy) copy.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = shareUrl();
          if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
          copy.textContent = 'Copied';
          copy.classList.add('is-copied');
          if (shareCopyTimer) clearTimeout(shareCopyTimer);
          shareCopyTimer = setTimeout(resetShareCopy, 1800);
        });
      }
      if (pop) {
        pop.addEventListener('click', (e) => e.stopPropagation());
        pop.querySelectorAll('[data-pdp-pop-close]').forEach((el) => el.addEventListener('click', () => pop.classList.remove('on')));
        const view = pop.querySelector('[data-pdp-view]');
        if (view) view.addEventListener('click', () => pop.classList.remove('on'));
      }
    },
  });
})();

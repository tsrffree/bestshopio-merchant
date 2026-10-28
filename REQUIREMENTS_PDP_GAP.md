# PDP 装修能力缺口 - 需求 Spec

> 本文档是跨会话交接文件, 固化已确认的结论, 供后续实现直接使用.
> 分支: pdp-gap-fill (从本地 main 拉出, 含 bd51fb8 PDP theme editing).
> 只改商家后台仓库 bestshopio-merchant, 只推 origin https://github.com/tsrffree/bestshopio-merchant.git.

## 目标

用线上后装修能力, 装修出线上 15 个在跑店铺的商品详情页(PDP)效果.
线上是真相源, 本文档结论已对照: 线上案例 + pdp 文档 + 代码三源验证.

## 现状基线(已核实)

- 主购买区组件: `online-store/js/sections/product-main.js`, 已实现 19 个 block (PRD 的 18 个 + 1 个 line_property).
- BLOCKS 定义在第 338-505 行, 每个 block 的 `fields` 数组即配置项.
- 默认 blocks 在 `defaultBlocks` (约 759-772 行).
- sticky 吸附购物车: `stickyHtml` 函数(约 715 行)已实现渲染, 但未注册进 BLOCKS, 属死代码.
- 页面组件 70 个 section 在 `online-store/js/sections/`.
- section 页面归属规则: `app.js` 约 1249 行 `entry.pages`, 为空 = 不限页面.
- 以下组件 pages 不限, 已对商品页开放, 零开发可用: video-feed / media-grid / media-with-text / faq / feature-cards / testimonial / as-seen-in / ugc-gallery / before-after-image.

## 一、真新增(3 项)

1. Featured reviews block (在 product-main 内新增)
2. sticky 吸附购物车接入 (把 stickyHtml 注册成 block)
3. 3 个 PDP 预设模板

## 二、12 项补配置字段(已锁定)

字段格式: `字段名 / 控件类型 / 默认值 / 选项或说明`.

### 1. Badges 标签
- badge_position: select / top-left / [top-left, top-right, below-title, above-price]
- badge_icon: select / none / [none, fire, tag, percent]
- badge_icon_image: image / 空 (支持上传自定义小图, 与内置图标二选一)
- badge_bg: color / 继承主题
- badge_text_color: color / 继承主题
- badge_gap: range / 8 / px

### 2. Price
- saving_position: segmented / right / [left, right]
- saving_type: select / percentage / [Percentage, Fixed amount, Sale, Saving label]
- saving_label: text / 空 (仅 saving_type=label 级联出现; 空则展示 Save)
- saving_bg: color / 主题色
- saving_text_color: color / #fff
- saving_icon: toggle / false
- saving_style: segmented / filled / [filled, outline] (案例镂空 Sale tag)
- price_prefix: text / 空 (案例 Set of 2)
- compare_order: segmented / after / [before=Left, after=Right]

### 3. Inventory
- low_stock_threshold: number / 5 (商家可自定义, 不设死)
- low_stock_text: text / Low stock - {n} items left
- sold_out_text: text / Sold out (独立自定义)
- status_style: segmented / dot / [dot, badge, text-only]
- status_color: color / 橙

### 4. Variant
- nested_dropdown: toggle / false (开 = 单下拉显示组合值 12-18M / Yellow)
- show_group_title: toggle / false
- sku_display_name: text / 空 (空 = 原始 SKU)
- show_sku_in_option: toggle / false

### 5. Buy
- show_buy_now: toggle / false (案例 ATC + Buy now 双按钮)
- buy_now_text: text / Buy now
- button_shape: segmented / normal / [normal, pill, square, custom]
- custom_radius: range / 8 / px (仅 button_shape=custom 显示)
- button_layout: select / stacked / [stacked, side-by-side]
- channels: multi-select / 仅动态结账钱包 [Shop, PayPal, Apple Pay, Google Pay]
  - 注意: Visa / Amex / Mastercard / Amazon 等卡品牌不是 Channels. 案例里它们出现在 Safe checkout / Payment & Security logo 条, 走 trust_logos
- channel_logo: toggle / false
- show_shop_installments: toggle / false (案例 Shop Pay "Pay in 2 interest-free installments")
- show_safe_checkout: toggle / false (案例 Guaranteed Safe Checkout)
- safe_checkout_label: text / GUARANTEED SAFE CHECKOUT
- trust_logos: multi-select / [Norton, McAfee, Money back, Visa, Mastercard, Amex, Discover, Diners, Amazon, PayPal, Shop, Apple Pay, Google Pay, Venmo, Bancontact, Giropay]
- Featured product 的 Buy buttons 与 Product information 同字段集 (默认数据可不同; Featured 另有独立 Quantity block 时 show_quantity 默认关)

### 6. Collapsible
- first_open_default: toggle / false
- accordion_mode: toggle / false (开 = 多行互斥只开一个)
- icon_position: segmented / right / [left, right]
- mobile_order: 复用桌面顺序 (不单独排序)

### 7. Popup
- trigger: segmented / click (仅点击)
- content_type: select / page (仅关联页面)
- hover_effect: toggle / false
- popup_width: range / 默认
- popup_height: range / 默认

### 8. Shipping
- timezone: select / store / [store, utc]
- fallback_text: text / 空
- 不做节假日跳过

### 9. Sharing
- layout: segmented / tile / [tile, inline, dropdown]
- icon_style: segmented / brand / [brand, mono]
- platforms: multi-select / [Facebook, X, Pinterest, Instagram, WhatsApp, Telegram, Email]
- show_copy: toggle / true

### 10. Recommendations
- empty_behavior: select / hide (空态隐藏整个 block)
- exclude_soldout: toggle / false
- dedupe_current: toggle / true

### 11. 信任组件(扩展 icon_text)
- background: toggle / false
- card_style: segmented / none / [none, outline, filled]
- link: text / 空 (每组可加链接)
- logo_image: image / 空 (复用 image 字段承接 BBC/Forbes 大图)
- Badge / Icon with text / Collapsible / Feature cards / Text with icon 共用 theme-icons 图标集 (Shopify 对齐, 含 none)
- Text with icon section 与 PDP icon_text 能力对齐: 同图标集 + image + link + card_style (默认数据可不同)

### 12. Featured reviews(新 block)
- heading: text / What Our Customers Are Saying
- data_source: select / auto / [auto, manual, both]
- show_image: toggle / false
- scroll: toggle / false
- auto_play: toggle / false
- view_all_popup: toggle / true
- cards_per_row: range / 3

## 三、sticky 吸附购物车字段(已锁定)

- show_image: toggle / true
- show_title: toggle / true
- show_price: toggle / true
- show_quantity: toggle / true
- show_bundle: toggle / false (Bundle 走独立应用, 先留关)
- show_after_scroll: toggle / false (滚动后出现, 阈值默认 100px)
- appear_at: segmented / scroll / [top, scroll]
- position: segmented / bottom / [top, bottom]
- mobile_visible: toggle / true

交互规则: 底部固定, 滚过主购买区后出现, 含数量, 移动端显示, 不含变体选择器.

## 四、3 个预设模板构成 (已落地 data.js product.templates)

模板 id: `pdp-wellness` / `pdp-apparel` / `default`(通用, isDefault).
页面级 featured-reviews 用 `testimonial` section; product-main 内另有 `featured_reviews` + `sticky` block.

### 模板一 健康保健型 (`pdp-wellness`)
适配: nutrofuels / trypulmo / femburn / tindedly / purejit
Section 顺序: breadcrumbs -> product-main -> media-with-text -> testimonial -> faq -> video-feed -> related-products
product-main block 顺序: badges -> title -> price -> rating -> description -> inventory -> variant -> buy -> icon_text(信任背书) -> shipping -> featured_reviews -> collapsible -> recommendations -> sticky

### 模板二 服饰型 (`pdp-apparel`)
适配: bumpbabe / kovoapex / zumbamboo
Section 顺序: breadcrumbs -> product-main(颜色/尺码) -> media-with-text -> testimonial -> related-products
product-main block 顺序: badges -> title -> price -> rating -> description -> inventory -> variant(颜色/尺码) -> buy -> icon_text -> featured_reviews -> collapsible -> recommendations -> sticky

### 模板三 通用型 (`default`)
适配: 其余店铺
Section 顺序: product-main -> text-with-icon -> testimonial -> related-products
product-main block 顺序: badges -> title -> price -> rating -> description -> inventory -> variant -> buy -> icon_text -> collapsible -> recommendations -> sticky

## 五、零开发复用(7 项, 已可用)

视频列 / 图片列 / 图文分栏 / FAQ / Feature cards / 保障行(icon with text) / 精选评论入口.
这些组件 pages 不限, 已对商品页开放, 直接挂即可, 无需改代码.

## 六、独立应用(4 项, 不纳入本次)

访客跟踪 / Bundle 捆绑销售 / 订阅 Subscribe & Save / 尺码表.

## 七、实现优先级(P1)

首批 4 项: Price / Buy / Badges / Variant (覆盖线上店铺最多).
其余 8 项 + Featured reviews + sticky 接入 + 3 模板随后.

## 八、验证要求

- 改完必须在浏览器验收: 打开 `http://127.0.0.1:8765/index.html#/online-store/edit/aura/product`, 逐项验证字段生效, 不是只截图.
- 每改一项, 检查商品页 preview 左侧 block 树 + 右侧设置面板是否都正常.
- 完成某项后提交, 提交信息简洁描述 why.

## 九、关键提示

- 本文件结论是已拍板的, 不要重新推导或改动字段定义, 直接按此实现.
- 遇到与代码冲突时, 以本文件为准, 并回写说明.
- 不要提交到 main, 只在本分支 pdp-gap-fill 内工作.

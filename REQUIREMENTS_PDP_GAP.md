# PDP 装修能力缺口 - 需求 Spec

> 本文档是跨会话交接文件, 固化已确认的结论, 供后续实现直接使用.
> 分支: pdp-gap-fill (从本地 main 拉出, 含 bd51fb8 PDP theme editing).
> 只改商家后台仓库 bestshopio-merchant, 只推 origin https://github.com/tsrffree/bestshopio-merchant.git.

## 目标

用线上后装修能力, 装修出线上 15 个在跑店铺的商品详情页(PDP)效果.
线上是真相源, 本文档结论已对照: 线上案例 + pdp 文档 + 代码三源验证.

## 控件约定

- 色值选择器全部走 `control: 'color'` → `colorControl` / `wireColorControl` (色块 + hex; `allowTransparent` 时右侧统一带 T 透明按钮). 禁止另做第二套色板 UI.
- 空值与 `transparent` 统一棋盘格 swatch; 留空表示继承主题色 (由字段 info 说明); T 写入 `transparent`.

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
- 面板分区: Valid custom tags / Product badges (os-sub 分割线)
- custom_tag_style: segmented / filled / [filled, outline]
- hot_badge_bg / hot_badge_text_color: color (tag__hot_*; bg 空=主题主色, text 默认 #fff)
- new_badge_bg / new_badge_text_color: color (tag__new_*; bg 默认 #FFC439, text 默认 #fff)
- badge_position: segmented / left / [left, right] (购买区标签行左右对齐)
- badge_icon / badge_icon_image: 自定义 tag 图标
- badge_gap: range / 8 / px
- outline: 与 filled 同外框 (height 24 / radius 5 / padding 2 8 / weight 700); 底 #f9fafb; inset 0.5px hairline (画在内侧, 外尺寸不膨胀); 深色字

### 2. Price
- size: range / 24 / px, 10–120 (现价字号; 划线价与 Save 按比例缩放)
- saving_position: segmented / right / [left, right]
- saving_type: select / percentage / [Percentage, Fixed amount, Sale, Saving text]
- saving_label: text / 空 (仅 saving_type=label 级联出现; placeholder: e.g. Price after 34% Off; 空则展示 Save)
- saving_bg: color / 主题色
- saving_text_color: color / #fff
- saving_icon: toggle / false
- saving_style: segmented / filled / [filled, outline] (案例镂空 Sale tag)
- 不做 Price prefix; 划线价固定跟在现价右侧, 不做位置配置

### 3. Inventory
- low_stock_threshold: number / 5 (商家可自定义, 不设死)
- low_stock_text: text / Low stock - {n} items left
- sold_out_text: text / Sold out (独立自定义)
- status_style: segmented / dot / [dot, badge, text-only]
- status_color: color / 橙

### 4. Variant
- nested_dropdown: toggle / false (开 = 单下拉显示组合值 12-18M / Yellow)
- show_group_title: toggle / true (显示 Color / Size 标题, 并随选中项更新名称)
- sku_display_name: text / 空 (空 = 原始 SKU)
- show_sku_in_option: toggle / false

### 5. Buy
- 侧栏分两块 (os-sub 分割线): Add to cart | Dynamic checkout
- 开箱默认 (Default product): show_quantity / show_add / show_dynamic / show_payment_options / channel_logo / show_safe_checkout = on; atc_layout = with-quantity; atc_shape = pill; dyn_shape = normal; atc_background = #FFC439; atc_text_color = #FFFFFF; buy_now_background = #000000; buy_now_text_color = #FFFFFF; channels = [Buy now, PayPal]; trust_logos = [Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay]; safe_checkout_align = center
- show_buy_now: 已下线 (立买归入 Channels, 挂在 show_dynamic 下)
- show_dynamic: toggle / true — 开启后出现 Channels / more payment options / safe checkout; 关闭则这些配置项与预览一并隐藏
- buy_now_text: text / Buy now (仅 channels 含 buy_now 时显示)
- atc_layout: segmented / with-quantity / [with-quantity, full-width] (full-width = 加购按钮单独全宽, 类似 Buy now)
- atc_icon: select / bag-plus / theme icon 库 (含 None; 默认购物袋+加号 20px, 显示在加购文案左侧)
- atc_background / atc_text_color: color / 开箱 #FFC439 / #FFFFFF (T = transparent)
- buy_now_background / buy_now_text_color: color / 开箱 #000000 / #FFFFFF (仅 channels 含 buy_now)
- channel_logo: toggle / true (开箱开; PayPal 等渠道显示品牌 logo)
- atc_shape: segmented / pill / [normal, pill, square, custom] (加购区块; ≥4 项自动下拉)
- atc_custom_radius: range / 8 / px (仅 atc_shape=custom)
- dyn_shape: segmented / normal / [normal, pill, square, custom] (结账区块; ≥4 项自动下拉; visibleWhen show_dynamic)
- dyn_custom_radius: range / 8 / px (仅 dyn_shape=custom)
- button_shape / custom_radius: 已下线 (遗留数据仍作 atc_shape / dyn_shape 回退)
- button_layout: 已下线, 固定 stacked (无 Side by side 配置项)
- channels: multi-select / 默认 [Buy now, PayPal] / 可选 [Buy now, PayPal, Apple Pay, Google Pay] (visibleWhen show_dynamic; Shop 不在 Channels)
  - 注意: Visa / Amex / Mastercard / Amazon 等卡品牌不是 Channels. 案例里它们出现在 Safe checkout / Payment & Security logo 条, 走 trust_logos
- show_shop_installments: 已下线 (分期能力后续再补)
- show_safe_checkout: toggle / true (开箱 Guaranteed Safe Checkout)
- safe_checkout_label: text / GUARANTEED SAFE CHECKOUT
- trust_logos: multi-select / 开箱 [Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay]; 全量可选 [Norton, McAfee, Money back, Visa, Mastercard, Amex, Discover, Diners, Amazon, PayPal, Apple Pay, Google Pay, Venmo, Bancontact, Giropay] (无 Shop; 支付渠道用官方 logo)
- trust_logo_size: range / 28 / px (20-56, 拖动调大小; 超出一行自动换行)
- Featured product 的 Buy buttons 与 Product information 同字段集 (默认数据可不同; Featured 另有独立 Quantity block 时 show_quantity 默认关)

### 6. Collapsible
- open: toggle / false (行级 Open by default; 勾哪行展开哪行, 与顺序无关)
- accordion_mode: toggle / false (开 = 多行互斥只开一个)
- icon_position: segmented / right / [left, right]
- mobile_order: 复用桌面顺序 (不单独排序)

### 7. Popup
- Link label 默认: Pop-up link text
- Page: page 选择器 (内容仅关联页面; 无 Content type / Trigger / Hover effect 控件)
- popup_width: range / 560
- popup_height: range / 420
- 点击打开居中弹窗; 下划线左→右动效 (基于下划线本身)
- 编辑态无 page 内容: 空白居中弹窗
- 发布 / buyer preview: 无 page 内容则隐藏该 block

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
- Content
  - data_source: select / manual / [manual, auto]
    - manual(默认): 逐条添加; 每条可选 Select existing review 或 Manual edit; 默认 1 条可增删
    - auto: 自动拉取商品评论; auto_count 控制展示条数
  - reviews: review_items (仅 manual)
  - auto_count: range 1–8 / 3 (仅 auto)
- Style (统一设置, 与内容源独立)
  - layout: select / nav / [media, quote, nav, trust]
  - show_image / show_avatar / round_avatar / star_color
  - show_verified / verified_text / verified_subtext (空则隐藏对应区块)
  - scroll / nav_style / auto_play / view_all_popup / cards_per_row

## 三、sticky 吸附购物车字段(已锁定)

- show_image: toggle / true
- show_title: toggle / true
- show_price: toggle / true
- show_quantity: toggle / true
- show_after_scroll: toggle / false (滚动后出现, 阈值默认 100px)
- appear_at: segmented / scroll / [top, scroll]
- mobile_visible: toggle / true

交互规则: 固定吸附底部 (无 Position 配置), 滚过主购买区后出现, 含数量, 移动端显示, 不含变体选择器.

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

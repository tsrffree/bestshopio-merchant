/* Shared rich-text editor used by theme editor, product detail, and other surfaces.
   Compact toolbar (online): Paragraph | Insert icon | More (...).
   Call BSRichText.render / BSRichText.wire; do not fork a second toolbar. */
(function (global) {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function svg(paths, size) {
    const px = size || 14;
    return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  const BLOCK_OPTS = [
    { value: 'P', label: 'Paragraph', cls: 'is-p' },
    { value: 'H1', label: 'Heading 1', cls: 'is-h1' },
    { value: 'H2', label: 'Heading 2', cls: 'is-h2' },
    { value: 'H3', label: 'Heading 3', cls: 'is-h3' },
    { value: 'H4', label: 'Heading 4', cls: 'is-h4' },
    { value: 'H5', label: 'Heading 5', cls: 'is-h5' },
    { value: 'H6', label: 'Heading 6', cls: 'is-h6' },
  ];

  const I = {
    chevron: svg('<path d="m7 10 5 5 5-5"/>', 12),
    check: svg('<path d="m5 12 5 5 9-10"/>', 14),
    link: svg('<path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5"/><path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.4a5 5 0 0 0 7.07 7.07L14 19"/>'),
    textColor: '<span class="bs-rt-icolor" title="Text color"><span class="bs-rt-icolor-a">A</span><i></i>' + svg('<path d="m8 10 4 4 4-4"/>', 10) + '</span>',
    highlighter: '<span class="bs-rt-ihl" title="Highlight">' + svg('<path d="M5 16 14 7l3 3-9 9H5z"/><path d="M12 9l3 3"/>') + '<i></i>' + svg('<path d="m8 10 4 4 4-4"/>', 10) + '</span>',
    bullet: svg('<circle cx="5" cy="7" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1.3" fill="currentColor" stroke="none"/><path d="M9 7h10M9 12h10M9 17h10"/>'),
    number: svg('<path d="M4 7h2M4 12h2.4M4 17h2"/><path d="M9 7h10M9 12h10M9 17h10"/>'),
    more: svg('<circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
    icon: svg('<circle cx="12" cy="12" r="8"/><path d="M8.5 11.2c.4-.8 1.2-1.3 2.1-1.3.8 0 1.5.4 1.9 1M13.5 11.2c.4-.8 1.2-1.3 2.1-1.3"/><path d="M9 14.2c.8.9 1.8 1.4 3 1.4s2.2-.5 3-1.4"/>'),
    database: svg('<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/>'),
  };

  function btn(cmd, title, content, disabled) {
    return '<button type="button" class="bs-rt-btn" data-rt-cmd="' + esc(cmd) + '" title="' + esc(title) + '"' + (disabled ? ' disabled' : '') + '>' + content + '</button>';
  }

  function blockMenuHtml(disabled) {
    const items = BLOCK_OPTS.map((o) =>
      '<button type="button" class="bs-rt-block-item ' + o.cls + '" data-rt-block="' + o.value + '" role="option">' +
        '<span>' + esc(o.label) + '</span><span class="bs-rt-block-check" hidden>' + I.check + '</span>' +
      '</button>'
    ).join('');
    return '<div class="bs-rt-block-wrap i18n-skip">' +
      '<button type="button" class="bs-rt-block-btn" data-rt-block-toggle title="Paragraph format"' + (disabled ? ' disabled' : '') + '>' +
        '<span data-rt-block-label>Paragraph</span>' + I.chevron +
      '</button>' +
      '<div class="bs-rt-block-menu" hidden data-rt-block-menu role="listbox">' + items + '</div>' +
    '</div>';
  }

  function morePanelHtml(disabled) {
    // Online more menu: Bold / Italic / Text color / Highlight | Bullet / Number / Link
    return '<div class="bs-rt-more-panel" hidden data-rt-more-panel>' +
      '<div class="bs-rt-more-row">' +
        btn('bold', 'Bold', '<b>B</b>', disabled) +
        btn('italic', 'Italic', '<i>I</i>', disabled) +
        btn('foreColor', 'Text color', I.textColor, disabled) +
        btn('hiliteColor', 'Highlight', I.highlighter, disabled) +
      '</div>' +
      '<div class="bs-rt-more-divider"></div>' +
      '<div class="bs-rt-more-row">' +
        btn('insertUnorderedList', 'Bulleted list', I.bullet, disabled) +
        btn('insertOrderedList', 'Numbered list', I.number, disabled) +
        btn('createLink', 'Insert link', I.link, disabled) +
      '</div>' +
    '</div>';
  }

  function isMultilineHtml(html, editorEl) {
    const text = editorEl
      ? String(editorEl.innerText || '').replace(/\u00a0/g, ' ')
      : String(html || '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00a0/g, ' ');
    if (!text.trim()) return false;
    if ((text.match(/\n/g) || []).length > 0) return true;
    if (editorEl) {
      const blocks = [...editorEl.children].filter((el) =>
        /^(P|DIV|LI|H[1-6]|UL|OL)$/i.test(el.tagName) && String(el.innerText || '').replace(/\u00a0/g, ' ').trim()
      );
      return blocks.length > 1;
    }
    return false;
  }

  function refreshAutoHeight(root, editor) {
    if (!root || !editor || !root.classList.contains('is-autoheight')) return;
    const tall = isMultilineHtml('', editor);
    root.classList.toggle('is-tall', tall);
  }

  function render(opts) {
    opts = opts || {};
    const id = opts.id || ('bs-rt-' + Math.random().toString(36).slice(2, 10));
    const html = opts.html || '';
    const placeholder = opts.placeholder || 'Add description...';
    const connected = !!opts.connected;
    const sourceLabel = opts.sourceLabel || 'Value';
    const attrs = opts.attrs || '';
    const disabled = connected;
    const autoHeight = !!opts.autoHeight;
    const tall = autoHeight && isMultilineHtml(html);

    const sourcePill = connected
      ? ('<div class="bs-rt-source-wrap i18n-skip">' +
          '<button type="button" class="bs-rt-source" data-rt-source data-rt-source-label="' + esc(sourceLabel) + '" aria-haspopup="menu" title="Dynamic source">' +
            '<span class="bs-rt-source-icon">' + I.database + '</span><span>' + esc(sourceLabel) + '</span>' +
          '</button></div>')
      : '';

    const editor = connected
      ? ('<div class="bs-rt-editor is-bound" data-rt-editor data-rt-bound="1">' + sourcePill + '</div>')
      : ('<div class="bs-rt-editor" contenteditable="true" data-rt-editor data-placeholder="' + esc(placeholder) + '">' + html + '</div>');

    return '<div class="bs-richtext' + (connected ? ' is-bound' : '') + (autoHeight ? ' is-autoheight' : '') + (tall ? ' is-tall' : '') + '" data-rt-root data-rt-id="' + esc(id) + '" data-rt-source-label="' + esc(sourceLabel) + '"' + (autoHeight ? ' data-rt-autoheight="1"' : '') + ' ' + attrs + '>' +
      '<div class="bs-rt-toolbar">' +
        blockMenuHtml(disabled) +
        btn('insertIcon', 'Insert icon', I.icon, disabled) +
        '<span class="bs-rt-more-wrap">' +
          btn('more', 'More formatting', I.more, disabled) +
          morePanelHtml(disabled) +
        '</span>' +
      '</div>' +
      editor +
    '</div>';
  }

  function closeAllPops(except) {
    document.querySelectorAll('.bs-rt-more-panel').forEach((p) => {
      if (p !== except) p.hidden = true;
    });
    document.querySelectorAll('.bs-rt-block-menu').forEach((p) => {
      if (p !== except) p.hidden = true;
    });
    document.querySelectorAll('.bs-rt-icon-pop, .bs-rt-source-pop, .bs-rt-color-pop').forEach((p) => {
      if (p !== except) p.remove();
    });
  }

  function iconOptions() {
    const api = global.OS_THEME_ICONS;
    if (api && typeof api.options === 'function') {
      return api.options(false);
    }
    return [
      { value: 'star', label: 'Star' },
      { value: 'heart', label: 'Heart' },
      { value: 'check-mark', label: 'Check Mark' },
      { value: 'truck', label: 'Truck' },
      { value: 'leaf', label: 'Leaf' },
      { value: 'fire', label: 'Fire' },
    ];
  }

  function iconSvg(name) {
    const api = global.OS_THEME_ICONS;
    if (api && typeof api.svg === 'function') return api.svg(name, 18) || '';
    return '';
  }

  function openIconPicker(anchor, editor, sync) {
    closeAllPops();
    const pop = document.createElement('div');
    pop.className = 'bs-rt-icon-pop i18n-skip';
    pop.setAttribute('role', 'menu');
    const items = iconOptions().map((o) => {
      const mark = iconSvg(o.value) || ('<span class="bs-rt-icon-fallback">' + esc(o.label.charAt(0)) + '</span>');
      return '<button type="button" data-rt-icon="' + esc(o.value) + '" title="' + esc(o.label) + '">' + mark + '</button>';
    }).join('');
    pop.innerHTML = '<div class="bs-rt-icon-title">Insert icon</div><div class="bs-rt-icon-grid">' + items + '</div>';
    document.body.appendChild(pop);
    const rect = anchor.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 280)) + 'px';
    pop.style.top = (rect.bottom + 6) + 'px';
    pop.querySelectorAll('[data-rt-icon]').forEach((b) => {
      b.onclick = () => {
        const name = b.getAttribute('data-rt-icon');
        const svgHtml = iconSvg(name);
        if (!svgHtml) return;
        editor.focus();
        try {
          document.execCommand('insertHTML', false, '<span class="bs-rt-inline-icon" contenteditable="false" data-icon="' + esc(name) + '">' + svgHtml + '</span>&nbsp;');
        } catch (e) {}
        sync();
        pop.remove();
      };
    });
    const close = (e) => {
      if (!pop.contains(e.target) && e.target !== anchor) {
        pop.remove();
        document.removeEventListener('mousedown', close);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', close), 0);
  }

  function resolveSourceOptions(opts) {
    if (!opts) return [];
    if (typeof opts.sourceOptions === 'function') {
      try { return opts.sourceOptions() || []; } catch (e) { return []; }
    }
    return opts.sourceOptions || [];
  }

  function saveEditorSelection(editor) {
    try {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      const range = sel.getRangeAt(0);
      if (!editor || !editor.contains(range.commonAncestorContainer)) return null;
      return range.cloneRange();
    } catch (e) { return null; }
  }

  function restoreEditorSelection(editor, range) {
    if (!editor) return;
    editor.focus();
    try {
      const sel = window.getSelection();
      if (!sel) return;
      sel.removeAllRanges();
      if (range) sel.addRange(range);
    } catch (e) { /* ignore */ }
  }

  function insertMetafieldChip(editor, path, label, sync) {
    if (!editor || !path) return;
    const chip = '<span class="bs-rt-mf-chip" contenteditable="false" data-mf-path="' + esc(path) + '">' +
      '<span class="bs-rt-mf-ico">' + I.database + '</span>' + esc(label || path) +
      '</span>\u00a0';
    editor.focus();
    let ok = false;
    try { ok = document.execCommand('insertHTML', false, chip); } catch (e) { ok = false; }
    if (!ok) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const holder = document.createElement('span');
        holder.innerHTML = chip;
        const nodes = Array.prototype.slice.call(holder.childNodes);
        nodes.forEach((n) => range.insertNode(n));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        editor.insertAdjacentHTML('beforeend', chip);
      }
    }
    if (typeof sync === 'function') sync();
  }

  function openSourceMenu(field, editor, key, onChange, bound, opts) {
    closeAllPops();
    opts = opts || {};
    const sourceLabel = field.getAttribute('data-rt-source-label') || opts.fixedSourceLabel || 'Value';
    const mode = opts.sourceMode || field.getAttribute('data-rt-source-mode') || 'fixed';
    const options = resolveSourceOptions(opts);
    // Metafields mode inserts inline variable chips — never blank the editor into a bound pill.
    const chipMode = mode === 'metafields';
    const connected = !chipMode && !opts.forcePicker && (bound || field.classList.contains('is-connected') || field.classList.contains('bs-rt-source'));
    const savedRange = chipMode ? (opts.savedRange || saveEditorSelection(editor)) : null;
    const pop = document.createElement('div');
    pop.className = 'bs-rt-source-pop i18n-skip' + (chipMode ? ' is-list' : '');
    pop.setAttribute('role', 'menu');

    if (connected) {
      pop.innerHTML = '<div class="bs-rt-source-crumb">Template <span>›</span> Product <span>›</span> ' + esc(sourceLabel) + '</div>' +
        '<button type="button" data-rt-edit-source><span>' + svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>') + '</span>Edit value</button>' +
        '<button type="button" data-rt-remove-source><span>' + svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>') + '</span>Remove dynamic source</button>';
    } else if (chipMode) {
      const list = options.length
        ? '<div class="bs-rt-source-list">' + options.map((o) =>
            '<button type="button" data-rt-insert-mf="' + esc(o.value) + '" data-rt-insert-label="' + esc(o.label) + '"><span>' + I.database + '</span>' + esc(o.label) + '</button>'
          ).join('') + '</div>'
        : '<div class="bs-rt-source-empty">No metafields available</div>';
      pop.innerHTML = '<div class="bs-rt-source-crumb">Template <span>›</span> Product <span>›</span> Metafields</div>' + list;
    } else {
      pop.innerHTML = '<div class="bs-rt-source-crumb">Template <span>›</span> Product</div>' +
        '<button type="button" data-rt-connect-source><span>' + I.database + '</span>Connect ' + esc(sourceLabel) + '</button>';
    }

    document.body.appendChild(pop);
    const rect = field.getBoundingClientRect();
    const popW = chipMode ? 280 : 260;
    pop.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - popW)) + 'px';
    pop.style.top = (rect.bottom + 6) + 'px';

    const edit = pop.querySelector('[data-rt-edit-source]');
    if (edit) edit.onclick = () => {
      pop.remove();
      const notify = opts.toast || global.toast;
      if (typeof notify === 'function') notify('Edit this value on the product details page');
    };
    const connect = pop.querySelector('[data-rt-connect-source]');
    if (connect) connect.onclick = () => {
      pop.remove();
      onChange(key + '_dynamic_source', true, true);
    };
    pop.querySelectorAll('[data-rt-insert-mf]').forEach((btn) => {
      btn.onclick = () => {
        const path = btn.getAttribute('data-rt-insert-mf') || '';
        const label = btn.getAttribute('data-rt-insert-label') || path;
        pop.remove();
        if (!path || !editor) return;
        // Drop legacy whole-field bind when switching to inline chips.
        onChange(key + '_dynamic_source', false, false);
        restoreEditorSelection(editor, savedRange);
        insertMetafieldChip(editor, path, label, () => onChange(key, editor.innerHTML, false));
      };
    });
    const remove = pop.querySelector('[data-rt-remove-source]');
    if (remove) remove.onclick = () => {
      pop.remove();
      onChange(key + '_dynamic_source', false, true);
    };
    const close = (e) => {
      if (!pop.contains(e.target) && e.target !== field && !field.contains(e.target)) {
        pop.remove();
        document.removeEventListener('mousedown', close);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', close), 0);
  }

  function wire(el, onChange, opts) {
    opts = opts || {};
    const key = el.getAttribute('data-fkey') || opts.key || '';
    const editor = el.querySelector('[data-rt-editor]');
    if (!editor) return;
    const bound = editor.getAttribute('data-rt-bound') === '1';
    const autoHeight = el.getAttribute('data-rt-autoheight') === '1' || !!opts.autoHeight;
    if (autoHeight) el.classList.add('is-autoheight');
    const sync = () => {
      if (bound) return;
      if (autoHeight) refreshAutoHeight(el, editor);
      onChange(key, editor.innerHTML, false);
    };
    if (!bound) {
      editor.addEventListener('input', sync);
      if (autoHeight) refreshAutoHeight(el, editor);
    }

    const fld = el.closest('.os-fld') || el.parentElement;
    const sourceButtons = (fld || el).querySelectorAll('[data-rt-source]');
    let pendingMfRange = null;
    sourceButtons.forEach((btn) => {
      // Capture caret before the meta button steals focus (chip-at-cursor insert).
      btn.addEventListener('mousedown', () => {
        pendingMfRange = saveEditorSelection(editor);
      });
      btn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSourceMenu(btn, editor, key, onChange, bound, Object.assign({}, opts, {
          savedRange: pendingMfRange,
        }));
        pendingMfRange = null;
      };
    });

    const moreBtn = el.querySelector('[data-rt-cmd="more"]');
    const morePanel = el.querySelector('[data-rt-more-panel]');
    if (moreBtn && morePanel) {
      moreBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (moreBtn.disabled) return;
        const open = morePanel.hidden;
        closeAllPops(morePanel);
        morePanel.hidden = !open;
      };
    }

    const blockToggle = el.querySelector('[data-rt-block-toggle]');
    const blockMenu = el.querySelector('[data-rt-block-menu]');
    const blockLabel = el.querySelector('[data-rt-block-label]');
    let currentBlock = 'P';
    const syncBlockUI = () => {
      if (blockLabel) {
        const hit = BLOCK_OPTS.find((o) => o.value === currentBlock) || BLOCK_OPTS[0];
        blockLabel.textContent = hit.label;
      }
      if (blockMenu) {
        blockMenu.querySelectorAll('[data-rt-block]').forEach((item) => {
          const on = item.getAttribute('data-rt-block') === currentBlock;
          item.classList.toggle('is-on', on);
          const check = item.querySelector('.bs-rt-block-check');
          if (check) check.hidden = !on;
        });
      }
    };
    syncBlockUI();
    if (blockToggle && blockMenu) {
      blockToggle.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (blockToggle.disabled) return;
        const open = blockMenu.hidden;
        closeAllPops(blockMenu);
        blockMenu.hidden = !open;
      };
      blockMenu.querySelectorAll('[data-rt-block]').forEach((item) => {
        item.onmousedown = (e) => e.preventDefault();
        item.onclick = () => {
          currentBlock = item.getAttribute('data-rt-block') || 'P';
          syncBlockUI();
          blockMenu.hidden = true;
          if (bound) return;
          editor.focus();
          try { document.execCommand('formatBlock', false, '<' + currentBlock + '>'); } catch (e) {}
          sync();
        };
      });
    }

    const exec = (cmd, value) => {
      if (bound) return;
      editor.focus();
      try { document.execCommand(cmd, false, value); } catch (e) {}
      sync();
    };

    const openColorPop = (anchor, kind) => {
      closeAllPops();
      const colors = kind === 'hiliteColor'
        ? ['#fff3bf', '#ffd8a8', '#ffc9c9', '#b2f2bb', '#a5d8ff', '#d0bfff', '#e9ecef', 'transparent']
        : ['#111111', '#616161', '#d92d20', '#e8590c', '#f08c00', '#2f9e44', '#1971c2', '#7048e8'];
      const pop = document.createElement('div');
      pop.className = 'bs-rt-color-pop i18n-skip';
      pop.innerHTML = '<div class="bs-rt-color-grid">' + colors.map((c) =>
        '<button type="button" data-rt-color="' + esc(c) + '" style="' + (c === 'transparent' ? 'background:conic-gradient(#ccc 0 25%,#fff 0 50%,#ccc 0 75%,#fff 0)' : 'background:' + c) + '"></button>'
      ).join('') + '</div>';
      document.body.appendChild(pop);
      const rect = anchor.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 180)) + 'px';
      pop.style.top = (rect.bottom + 6) + 'px';
      pop.querySelectorAll('[data-rt-color]').forEach((b) => {
        b.onclick = () => {
          const color = b.getAttribute('data-rt-color');
          if (kind === 'hiliteColor') exec('hiliteColor', color === 'transparent' ? '#ffffff' : color);
          else exec('foreColor', color);
          pop.remove();
          if (morePanel) morePanel.hidden = true;
        };
      });
      const close = (e) => {
        if (!pop.contains(e.target) && e.target !== anchor && !anchor.contains(e.target)) {
          pop.remove();
          document.removeEventListener('mousedown', close);
        }
      };
      setTimeout(() => document.addEventListener('mousedown', close), 0);
    };

    el.querySelectorAll('[data-rt-cmd]').forEach((button) => {
      const cmd = button.getAttribute('data-rt-cmd');
      if (cmd === 'more') return;
      button.onmousedown = (e) => e.preventDefault();
      button.onclick = () => {
        if (button.disabled) return;
        if (cmd === 'insertIcon') {
          openIconPicker(button, editor, sync);
          return;
        }
        if (cmd === 'createLink') {
          const url = window.prompt('Link URL', 'https://');
          if (url) exec(cmd, url);
        } else if (cmd === 'foreColor' || cmd === 'hiliteColor') {
          openColorPop(button, cmd);
          return;
        } else {
          exec(cmd);
        }
        if (morePanel) morePanel.hidden = true;
      };
    });
  }

  const STYLE_ID = 'bs-richtext-style';
  function ensureStyles() {
    let st = document.getElementById(STYLE_ID);
    if (!st) {
      st = document.createElement('style');
      st.id = STYLE_ID;
      document.head.appendChild(st);
    }
    st.textContent = [
      '.bs-richtext{width:100%;border:1px solid var(--ctl,#c9cccf);border-radius:8px;background:#fff;overflow:visible}',
      '.bs-rt-toolbar{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:5px 8px;border-bottom:1px solid #e3e3e3;background:#f7f7f7;border-radius:8px 8px 0 0}',
      '.bs-rt-sep{width:1px;height:18px;margin:0 3px;background:#d4d4d4}',
      '.bs-rt-btn{min-width:28px;height:28px;padding:0 6px;border:1px solid transparent;border-radius:6px;background:transparent;color:#303030;font:inherit;font-size:12px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
      '.bs-rt-btn:hover:not(:disabled){background:#fff;border-color:#d4d4d4}',
      '.bs-rt-btn:disabled{opacity:.45;cursor:default}',
      '.bs-rt-btn svg{width:14px;height:14px;display:block}',
      '.bs-rt-select{height:28px;max-width:120px;border:1px solid #d4d4d4;border-radius:6px;background:#fff;color:#303030;font:inherit;font-size:12px}',
      '.bs-rt-select:disabled{opacity:.45}',
      '.bs-rt-block-wrap{position:relative;display:inline-flex}',
      '.bs-rt-block-btn{height:28px;padding:0 8px;border:1px solid #d4d4d4;border-radius:6px;background:#fff;color:#303030;font:inherit;font-size:12px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}',
      '.bs-rt-block-btn:hover:not(:disabled){background:#fafafa}',
      '.bs-rt-block-btn:disabled{opacity:.45;cursor:default}',
      '.bs-rt-block-btn svg{width:12px;height:12px;opacity:.7}',
      '.bs-rt-block-menu{position:absolute;left:0;top:calc(100% + 4px);z-index:45;min-width:168px;padding:6px;border:1px solid #d9d9d9;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.14)}',
      '.bs-rt-block-menu[hidden]{display:none!important}',
      '.bs-rt-block-item{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:7px 10px;border:0;border-radius:8px;background:#fff;color:#303030;text-align:left;font:inherit;cursor:pointer}',
      '.bs-rt-block-item:hover{background:#f5f6f7}',
      '.bs-rt-block-item.is-on{background:#005bd3;color:#fff}',
      '.bs-rt-block-item.is-on .bs-rt-block-check{color:#fff}',
      '.bs-rt-block-check{display:inline-flex;width:14px;height:14px}',
      '.bs-rt-block-check[hidden]{display:none!important}',
      '.bs-rt-block-check svg{width:14px;height:14px}',
      '.bs-rt-block-item.is-p{font-size:13px;font-weight:400}',
      '.bs-rt-block-item.is-h1{font-size:22px;font-weight:700;line-height:1.2}',
      '.bs-rt-block-item.is-h2{font-size:18px;font-weight:700;line-height:1.25}',
      '.bs-rt-block-item.is-h3{font-size:16px;font-weight:700;line-height:1.3}',
      '.bs-rt-block-item.is-h4{font-size:14px;font-weight:700;line-height:1.35}',
      '.bs-rt-block-item.is-h5{font-size:13px;font-weight:700;line-height:1.4}',
      '.bs-rt-block-item.is-h6{font-size:12px;font-weight:700;line-height:1.4}',
      '.bs-rt-more-wrap{position:relative;display:inline-flex}',
      '.bs-rt-more-panel{position:absolute;left:0;top:calc(100% + 4px);z-index:40;display:flex;flex-direction:column;gap:4px;min-width:auto;padding:6px;border:1px solid #d9d9d9;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.14)}',
      '.bs-rt-more-panel[hidden]{display:none!important}',
      '.bs-rt-more-row{display:flex;align-items:center;gap:2px}',
      '.bs-rt-more-divider{height:1px;margin:2px 4px;background:#e3e3e3}',
      '.bs-rt-icolor,.bs-rt-ihl{display:inline-flex;align-items:center;gap:1px;line-height:1}',
      '.bs-rt-icolor-a{font-weight:700;font-size:13px;line-height:1}',
      '.bs-rt-icolor i,.bs-rt-ihl i{display:block;width:12px;height:3px;border-radius:1px;background:#111;margin:0 1px}',
      '.bs-rt-ihl i{background:#f08c00}',
      '.bs-rt-icolor svg,.bs-rt-ihl svg{width:10px;height:10px;opacity:.7}',
      '.bs-rt-color-pop{position:fixed;z-index:510;padding:8px;border:1px solid #d9d9d9;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.16)}',
      '.bs-rt-color-grid{display:grid;grid-template-columns:repeat(4,28px);gap:6px}',
      '.bs-rt-color-grid button{width:28px;height:28px;padding:0;border:1px solid #d4d4d4;border-radius:6px;cursor:pointer}',
      '.bs-rt-color-grid button:hover{outline:2px solid #005bd3;outline-offset:1px}',
      '.bs-rt-editor{min-height:112px;padding:10px 12px;color:var(--ink,#1a1a1a);font-size:13px;line-height:1.55;outline:none;overflow:auto;background:#fff;border-radius:0 0 8px 8px}',
      '.bs-richtext.is-autoheight .bs-rt-editor{min-height:36px;padding-top:8px;padding-bottom:8px}',
      '.bs-richtext.is-autoheight.is-tall .bs-rt-editor{min-height:112px;padding-top:10px;padding-bottom:10px}',
      '.bs-rt-editor:empty:before{content:attr(data-placeholder);color:#9aa3b0}',
      '.bs-rt-editor.is-bound{min-height:52px;display:flex;align-items:flex-start}',
      '.bs-rt-editor img,.bs-rt-editor video{display:block;max-width:100%;height:auto;margin:8px 0;border-radius:6px}',
      '.bs-rt-editor a{color:#005bd3;text-decoration:underline}',
      '.bs-rt-editor ul,.bs-rt-editor ol{padding-left:22px;margin:.4em 0}',
      '.bs-rt-editor p{margin:.4em 0}',
      '.bs-richtext.is-autoheight:not(.is-tall) .bs-rt-editor p{margin:0}',
      '.bs-rt-inline-icon{display:inline-flex;vertical-align:-3px;color:currentColor}',
      '.bs-rt-inline-icon svg{width:18px;height:18px;display:block}',
      '.bs-rt-mf-chip{display:inline-flex;align-items:center;gap:5px;max-width:100%;margin:0 1px;padding:2px 8px 2px 6px;border-radius:6px;background:#eaf2ff;color:#005bd3;font-size:12px;font-weight:550;line-height:1.3;vertical-align:baseline;user-select:none;white-space:nowrap}',
      '.bs-rt-mf-chip .bs-rt-mf-ico{display:inline-flex;color:#005bd3}',
      '.bs-rt-mf-chip .bs-rt-mf-ico svg{width:12px;height:12px;display:block}',
      '.bs-rt-source-wrap{display:inline-flex;max-width:100%}',
      '.bs-rt-source{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:5px 10px 5px 8px;border:0;border-radius:8px;background:#eaf2ff;color:#005bd3;font:inherit;font-size:13px;font-weight:550;line-height:1.2;cursor:pointer}',
      '.bs-rt-source:hover{background:#dceaff}',
      '.bs-rt-source-icon{display:inline-flex;color:#005bd3}',
      '.bs-rt-source-icon svg{width:14px;height:14px;display:block}',
      '.bs-rt-source-pop,.bs-rt-icon-pop{position:fixed;z-index:500;min-width:220px;padding:8px 0;border:1px solid #d9d9d9;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.16);color:#303030}',
      '.bs-rt-source-pop.is-list{min-width:260px;max-width:320px}',
      '.bs-rt-source-crumb{padding:3px 12px 8px;color:#6b7280;font-size:12px;white-space:nowrap}',
      '.bs-rt-source-crumb span{padding:0 4px;color:#a0a6ad}',
      '.bs-rt-source-pop button{display:flex;align-items:center;gap:9px;width:100%;padding:9px 12px;border:0;background:#fff;color:#303030;text-align:left;font:inherit;font-size:13px;cursor:pointer}',
      '.bs-rt-source-pop button:hover{background:#f5f6f7}',
      '.bs-rt-source-pop button span{display:inline-flex;width:15px;color:#555}',
      '.bs-rt-source-pop button svg{width:15px;height:15px}',
      '.bs-rt-source-list{max-height:280px;overflow:auto;padding:0 0 4px}',
      '.bs-rt-source-empty{padding:10px 12px;color:#6b7280;font-size:12px}',
      '.bs-rt-icon-pop{padding:10px;min-width:260px}',
      '.bs-rt-icon-title{font-size:12px;font-weight:600;color:#4d4d4d;margin:0 2px 8px}',
      '.bs-rt-icon-grid{display:grid;grid-template-columns:repeat(6,32px);gap:6px}',
      '.bs-rt-icon-grid button{width:32px;height:32px;padding:0;border:1px solid #e3e3e3;border-radius:8px;background:#fff;color:#303030;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
      '.bs-rt-icon-grid button:hover{border-color:#005bd3;background:#f4f8ff}',
      '.bs-rt-icon-grid svg{width:16px;height:16px;display:block}',
      '.bs-rt-icon-fallback{font-size:12px;font-weight:700}',
    ].join('');
  }

  ensureStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureStyles);
  }

  global.BSRichText = {
    icons: I,
    render: render,
    wire: wire,
    ensureStyles: ensureStyles,
  };
})(window);

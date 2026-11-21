/* The Tower of Lumen – screens, windows, HUD, input and the main loop. */
(function () {
  var TOL = (window.TOL = window.TOL || {});
  var G = TOL.game, R = TOL.render, A = TOL.audio;
  var UI = (TOL.ui = {});
  TOL.now = function () { return performance.now() / 1000; };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mode = 'title';

  /* ---------------- svg snippets ---------------- */
  var SVG = {
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    heart: function (on) { return '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C5 15 1 11.5 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 4.5-4 8-11 14z" fill="' + (on ? '#F43F5E' : '#E2E8F0') + '"/></svg>'; },
    bulb: '<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M12 2a8 8 0 0 0-4.5 14.6V20h9v-3.4A8 8 0 0 0 12 2z" fill="#FACC15"/><rect x="8" y="22" width="8" height="3" rx="1.5" fill="#CA8A04"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#3B82F6"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    star: function (fill) { return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" fill="' + (fill || '#FACC15') + '"/></svg>'; },
    robot: function (c) { return '<svg viewBox="0 0 62 62" aria-hidden="true"><line x1="31" y1="2" x2="31" y2="12" stroke="#64748B" stroke-width="3"/><circle cx="31" cy="4" r="4" fill="#F43F5E"/><rect x="8" y="12" width="46" height="40" rx="12" fill="' + (c || '#93C5FD') + '"/><rect x="15" y="20" width="32" height="18" rx="9" fill="#1E3A8A"/><circle cx="24" cy="29" r="4" fill="#67E8F9"/><circle cx="38" cy="29" r="4" fill="#67E8F9"/><path d="M24 44 Q31 48 38 44" stroke="#1E3A8A" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="2" y="26" width="6" height="12" rx="3" fill="#64748B"/><rect x="54" y="26" width="6" height="12" rx="3" fill="#64748B"/></svg>'; },
    arrow: function (d, c) { var rot = { up: 0, right: 90, down: 180, left: 270 }[d]; return '<svg viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(' + rot + ' 12 12)"><path d="M12 3l7 8h-4.5v10h-5V11H5z" fill="' + (c || '#16A34A') + '"/></g></svg>'; },
    crate: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3" fill="#D97706"/><path d="M5 5l14 14M19 5L5 19" stroke="#92400E" stroke-width="2.5"/><rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#92400E" stroke-width="2"/></svg>',
    bot: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="13" rx="4" fill="#3B82F6"/><rect x="7" y="9" width="10" height="5" rx="2.5" fill="#1E3A8A"/><circle cx="10" cy="11.5" r="1.4" fill="#67E8F9"/><circle cx="14" cy="11.5" r="1.4" fill="#67E8F9"/><path d="M12 6V3" stroke="#64748B" stroke-width="2"/><circle cx="12" cy="2.5" r="1.6" fill="#F43F5E"/></svg>',
    goal: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" fill="#FACC15" stroke="#CA8A04" stroke-width="1"/></svg>',
    chest: '<svg viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="140" rx="70" ry="8" fill="rgba(31,42,68,0.15)"/><rect x="20" y="62" width="140" height="74" rx="12" fill="#B45309"/><rect x="20" y="62" width="140" height="18" fill="#92400E"/><path d="M20 66 Q20 18 90 18 Q160 18 160 66Z" fill="#D97706"/><rect x="80" y="18" width="20" height="118" fill="#FACC15"/><rect x="74" y="66" width="32" height="30" rx="6" fill="#FDE047" stroke="#A16207" stroke-width="3"/><text x="90" y="90" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="22" font-weight="700" fill="#A16207">?</text><circle cx="40" cy="30" r="4" fill="#FEF08A"/><circle cx="150" cy="40" r="3" fill="#FEF08A"/></svg>',
    bag: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="9" width="20" height="19" rx="6" fill="#F97316"/><rect x="10" y="17" width="12" height="7" rx="2" fill="#EA580C"/><path d="M11 9V7a5 5 0 0 1 10 0v2" stroke="#FDE047" stroke-width="2.5" fill="none"/></svg>',
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" fill="#FDE68A" stroke="#A16207" stroke-width="1.5"/><path d="M9 3v15M15 6v15" stroke="#A16207" stroke-width="1.5"/></svg>',
    cog: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4" fill="#fff"/><path d="M1 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="#fff"/><circle cx="18" cy="9" r="3" fill="#C7D2FE"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="12" rx="3" fill="#fff"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#fff" stroke-width="2.5" fill="none"/></svg>',
    school: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 5-10 5L2 8z" fill="#fff"/><path d="M6 10.5V16c3 2.5 9 2.5 12 0v-5.5" stroke="#fff" stroke-width="2" fill="none"/></svg>'
  };

  function branchIconSvg(b, color) {
    var info = TOL.BRANCH_INFO[b];
    if (info.icon === 'Aa') return '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="14" font-weight="700" fill="' + color + '">Aa</text></svg>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + R.ICON_PATHS[info.icon] + '" stroke="' + color + '" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function shapeSvg(name) {
    var c = TOL.SHAPE_COLOURS[name] || '#64748B', s;
    switch (name) {
      case 'circle': s = '<circle cx="20" cy="20" r="15" fill="' + c + '"/>'; break;
      case 'square': s = '<rect x="6" y="6" width="28" height="28" rx="4" fill="' + c + '"/>'; break;
      case 'triangle': s = '<path d="M20 4l17 30H3z" fill="' + c + '"/>'; break;
      case 'star': s = '<path d="M20 3l5.2 10.6 11.8 1.8-8.5 8.2 2 11.6L20 29.8 9.5 35.2l2-11.6L3 15.4l11.8-1.8z" fill="' + c + '"/>'; break;
      case 'heart': s = '<path d="M20 35C10 27 4 21.5 4 14.5a8.5 8.5 0 0 1 16-4 8.5 8.5 0 0 1 16 4C36 21.5 30 27 20 35z" fill="' + c + '"/>'; break;
      case 'diamond': s = '<path d="M20 3l15 17-15 17L5 20z" fill="' + c + '"/>'; break;
    }
    return '<svg viewBox="0 0 40 40" role="img" aria-label="' + name + '">' + s + '</svg>';
  }
  function tokenHtml(t) { return (typeof t === 'string' && t.indexOf('shape:') === 0) ? shapeSvg(t.slice(6)) : esc(t); }
  function tokenWords(t) { return (typeof t === 'string' && t.indexOf('shape:') === 0) ? t.slice(6) : String(t); }

  var STICKER_GLYPH = {
    lantern: 'M9 5h6v2h1v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7h1z', key: 'M8 14a4 4 0 1 1 3.5-6H21v3h-2v3h-3v-3h-4.5A4 4 0 0 1 8 14z',
    moon: 'M15 3a9 9 0 1 0 6 15A8 8 0 0 1 15 3z', star: 'M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1z',
    cog: 'M12 8a4 4 0 1 0 0.01 0M11 1h2l.5 3 2.5 1 2.5-2 1.5 1.5-2 2.5 1 2.5 3 .5v2l-3 .5-1 2.5 2 2.5-1.5 1.5-2.5-2-2.5 1-.5 3h-2l-.5-3-2.5-1-2.5 2-1.5-1.5 2-2.5-1-2.5-3-.5v-2l3-.5 1-2.5-2-2.5L5.5 3l2.5 2 2.5-1z',
    book: 'M3 5c3-1.3 6-1.3 9 1 3-2.3 6-2.3 9-1v14c-3-1.3-6-1.3-9 1-3-2.3-6-2.3-9-1z', cloud: 'M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9z',
    heart: 'M12 21C5 15 1 11.5 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 4.5-4 8-11 14z', leaf: 'M4 20C4 9 10 4 21 3c-1 11-6 17-17 17zM4 20l9-9',
    map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z', gem: 'M6 3h12l4 6-10 12L2 9z', sun: 'M12 7a5 5 0 1 0 0.01 0M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
    rocket: 'M12 2c4 3 6 8 5 13l-5 3-5-3c-1-5 1-10 5-13zM7 15l-3 5 5-2M17 15l3 5-5-2', shell: 'M12 3c5 0 9 4 9 9H3c0-5 4-9 9-9zM12 3v9M7 5l3 7M17 5l-3 7M3 12l2 6h14l2-6',
    crown: 'M3 8l5 4 4-7 4 7 5-4-2 11H5z', rainbow: 'M2 18a10 10 0 0 1 20 0h-3a7 7 0 0 0-14 0z', tower: 'M8 22V9l4-6 4 6v13zM10 13h4v3h-4z',
    feather: 'M20 4C10 4 5 10 5 19l-2 2M20 4c0 8-5 13-13 13', snow: 'M12 2v20M3.5 7l17 10M3.5 17l17-10', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
    music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z', fish: 'M2 12c4-6 12-6 16 0-4 6-12 6-16 0zM18 12l4-4v8z',
    flower: 'M12 8a3 3 0 1 0 0.01 0M12 2a3 3 0 0 1 0 6 3 3 0 0 1 0-6M12 16a3 3 0 0 1 0 6 3 3 0 0 1 0-6M2 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0M16 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0', compass: 'M12 2a10 10 0 1 0 0.01 0M15 9l-2 5-5 2 2-5z'
  };
  function stickerSvg(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (STICKER_GLYPH[id] || STICKER_GLYPH.star) + '" fill="#fff" stroke="#fff" stroke-width="0.5" stroke-linejoin="round"/></svg>'; }

  /* ---------------- canvas helpers ---------------- */
  function prepCanvas(cv) {
    var w = cv.clientWidth || cv.width, h = cv.clientHeight || cv.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }
  function drawPortrait(cv, p) {
    if (!cv) return;
    var c = prepCanvas(cv), s = c.w / 54;
    R.drawCharacter(c.ctx, c.w / 2, c.h / 2 + 114 * s * 0.95, p.look, p.equipped, { scale: s * 0.95, noShadow: true });
  }
  function drawFull(cv, look, equip, petToo) {
    if (!cv) return;
    var c = prepCanvas(cv), s = c.h / 200;
    var x = petToo && equip && equip.pet ? c.w * 0.42 : c.w / 2;
    R.drawCharacter(c.ctx, x, c.h - 18 * s, look, equip, { scale: s });
    if (petToo && equip && equip.pet) { c.ctx.save(); c.ctx.translate(c.w * 0.8, c.h - 16 * s); c.ctx.scale(s * 1.3, s * 1.3); R.drawPet(c.ctx, equip.pet, 0, 0, 0, -1); c.ctx.restore(); }
  }
  function drawItemThumb(cv, itemId) {
    var c = prepCanvas(cv), it = TOL.ITEMS[itemId], p = G.profile, eq = {};
    eq[it.slot] = itemId;
    if (it.slot === 'pet') { c.ctx.save(); c.ctx.translate(c.w / 2, c.h - 10); c.ctx.scale(1.6, 1.6); R.drawPet(c.ctx, itemId, 0, 0, 0, 1); c.ctx.restore(); return; }
    if (it.slot === 'hat' || it.slot === 'glasses') { var s = c.w / 70; R.drawCharacter(c.ctx, c.w / 2, c.h / 2 + 118 * s, p.look, eq, { scale: s, noShadow: true }); return; }
    if (it.slot === 'hand') { var s3 = c.h / 175; R.drawCharacter(c.ctx, c.w / 2 - 4, c.h - 4, p.look, eq, { scale: s3, noShadow: true }); return; }
    var s2 = c.h / 150; R.drawCharacter(c.ctx, c.w / 2, c.h - 6, p.look, eq, { scale: s2, noShadow: true });
  }

  /* ---------------- scene canvas ---------------- */
  var scene = $('scene'), sctx = scene.getContext('2d');
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    scene.width = Math.round(w * dpr); scene.height = Math.round(h * dpr);
    var narrow = w < 760;
    R.layout(w, h, narrow ? 150 : 130, narrow ? 84 : 104, dpr);
    var mm = $('minimap'); if (mm && mm.clientWidth) { mm.width = Math.round(mm.clientWidth * dpr); mm.height = Math.round(mm.clientHeight * dpr); }
  }
  window.addEventListener('resize', resize);

  var last = TOL.now(), frame = 0;
  function loop() {
    var now = TOL.now(), dt = Math.min(0.05, now - last); last = now;
    if (mode === 'game' && G.room) {
      G.update(dt);
      R.drawScene(sctx, G, now, scene.width, scene.height);
      if (frame++ % 15 === 0) { var mm = $('minimap'); R.drawMiniMap(mm.getContext('2d'), G.floor, G.room.id, mm.clientWidth || 150, mm.clientHeight || 104, dpr); }
    } else {
      drawTitleBackdrop(now);
    }
    requestAnimationFrame(loop);
  }
  function drawTitleBackdrop() {}

  /* ---------------- HUD ---------------- */
  UI.refreshHud = function () {
    var p = G.profile, f = G.floor; if (!p || !f) return;
    var term = TOL.currentTerm(), wing = term < 2 ? 'AUTUMN' : term < 4 ? 'SPRING' : 'SUMMER';
    $('hudFloor').textContent = f.n === 0 ? 'TUTORIAL' : 'FLOOR ' + f.n + ' · ' + wing + ' WING';
    $('hudRoom').textContent = G.room ? G.room.name : '';
    var q = '';
    if (f.n > 0) {
      TOL.BRANCHES.forEach(function (b) {
        var info = TOL.BRANCH_INFO[b], o = f.opened[b], done = o.req >= 3;
        q += '<div class="chip' + (done ? ' done' : '') + '" title="' + esc(info.name) + '"><span class="ic" style="background:' + info.label + '">' + branchIconSvg(b, '#fff') + '</span>' + Math.min(3, o.req) + '/3' + (o.bonus ? ' <span class="bonus">+★</span>' : '') + '<span class="visually-hidden"> ' + esc(info.name) + ' doors</span></div>';
      });
      if (f.completed) q += '<div class="chip golden">Floor complete!</div>';
      else if (f.golden) q += '<div class="chip golden">Golden Door is open!</div>';
    }
    $('hudQuota').innerHTML = q;
    $('hudName').textContent = p.name;
    $('hudTitle').textContent = G.title() + ' · Year ' + p.year;
    $('hudScore').textContent = p.score.toLocaleString('en-GB');
    $('hudStars').textContent = p.stars;
    $('hudHints').textContent = p.hints;
    if (!Q.active) $('hudTries').textContent = '3 / 3';
    var lit = f.n > 0 ? G.reqOpened(f) : 0;
    $('hudLumen').style.width = (f.n > 0 ? (lit / 15 * 100) : 100) + '%';
    $('hudLumenLabel').textContent = f.n > 0 ? 'TOWER LIGHT ' + lit + ' / 15 DOORS' : 'TUTORIAL';
    var badge = $('bagBadge'); badge.hidden = !p.pendingBoxes; badge.textContent = p.pendingBoxes;
    var pb = $('petBtn'), pet = p.equipped && p.equipped.pet;
    pb.hidden = !pet; if (pet) pb.setAttribute('aria-label', 'Pet your ' + TOL.ITEMS[pet].name.toLowerCase() + ' (P)');
    drawPortrait($('portrait'), p);
  };

  UI.roomBanner = function (room) {
    var old = document.querySelector('.room-banner'); if (old) old.remove();
    var d = document.createElement('div'); d.className = 'room-banner'; d.textContent = room.name;
    $('hud').appendChild(d); setTimeout(function () { d.remove(); }, 2300);
  };

  UI.celebrate = function () {
    $('toasts').innerHTML = ''; $('nearPrompt').hidden = true;
    var rb = document.querySelector('.room-banner'); if (rb) rb.remove();
  };
  UI.toast = function (text, kind) {
    var box = $('toasts'), d = document.createElement('div'); d.className = 'toast ' + (kind || ''); d.textContent = text;
    while (box.children.length >= 3) box.removeChild(box.firstChild);
    box.appendChild(d); setTimeout(function () { d.remove(); }, 3800);
  };

  UI.nearDoorChanged = function (d) {
    var el = $('nearPrompt');
    if (!d || mode !== 'game') { el.hidden = true; return; }
    var text, btn;
    if (d.kind === 'back') { text = 'The way back to the last room.'; btn = 'Go back'; }
    else if (d.kind === 'golden') {
      if (G.floor.completed) { text = 'The Golden Door leads up to Floor ' + (G.floor.n + 1) + '.'; btn = 'Climb up'; }
      else { text = 'The Golden Door: one question from every subject. Question ' + (G.floor.goldenStep + 1) + ' of 5.'; btn = 'Try it'; }
    } else {
      var name = TOL.BRANCH_INFO[d.branch].name + (d.kind === 'bonus' ? ' bonus door' : d.kind === 'extra' ? ' practice door (extra points)' : ' door');
      if (d.state === 'open') { text = name + ' is open.'; btn = 'Go through'; }
      else { text = name + ': ' + (d.progress || 0) + ' of 2 answers.'; btn = 'Open'; }
    }
    el.innerHTML = '<span>' + esc(text) + ' <span class="note">Space</span></span><button type="button" id="nearGo">' + esc(btn) + '</button>';
    el.hidden = false;
    $('nearGo').onclick = function () { A.init(); G.interact(d); };
  };

  /* ---------------- modal system ---------------- */
  var modalQueue = [], modalOpen = false, modalOnClose = null, modalKeys = null;
  function openModal(html, opts) {
    opts = opts || {};
    var m = $('modal'); m.innerHTML = html; m.hidden = false; modalOpen = true;
    modalOnClose = opts.onClose || null; modalKeys = opts.keys || null;
    G.paused = true; G.keys = {};
    $('nearPrompt').hidden = true;
    var first = m.querySelector('[autofocus]') || m.querySelector('.card button, .card input');
    if (first && !opts.noFocus) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }
  function closeModal() {
    var m = $('modal'); m.hidden = true; m.innerHTML = ''; modalOpen = false; modalKeys = null;
    A.stopSpeaking();
    var cb = modalOnClose; modalOnClose = null;
    G.paused = false;
    if (cb) cb();
    if (!modalOpen && modalQueue.length) modalQueue.shift()();
    if (!modalOpen) { UI.nearDoorChanged(G.nearDoor); UI.refreshHud(); }
  }
  UI.closeModal = closeModal;
  function queueModal(fn) { if (modalOpen) modalQueue.push(fn); else fn(); }
  function head(title, color, extra) {
    return '<div class="card-head" style="background:' + color + '"><h3>' + title + '</h3>' + (extra || '') + '<button class="x-btn" data-act="close" aria-label="Close">' + SVG.close + '</button></div>';
  }

  /* ---------------- question window ---------------- */
  var Q = (UI.Q = { active: false });

  UI.openDoor = function (door) {
    Q.active = true; Q.golden = false; Q.door = door; Q.branch = door.branch;
    door.ctx = door.ctx || {};
    nextQuestion();
  };
  UI.openGolden = function () {
    var f = G.floor;
    Q.active = true; Q.golden = true; Q.door = null; f.goldenCtx = f.goldenCtx || {};
    nextQuestion();
  };

  function nextQuestion() {
    var f = G.floor, ctx;
    if (Q.golden) { Q.branch = TOL.BRANCHES[f.goldenStep]; ctx = f.goldenCtx; }
    else ctx = Q.door.ctx;
    Q.q = TOL.nextQuestion(G.profile, Q.branch, f.n, ctx, Q.golden);
    G.markSeen(Q.q);
    Q.tries = 3; Q.hintUsed = false; Q.phase = 'ask'; Q.gone = {}; Q.wrongPicked = {}; Q.input = ''; Q.feedback = ''; Q.fbClass = '';
    Q.placed = Q.q.slots ? new Array(Q.q.slots).fill(null) : null;
    Q.maze = Q.q.type === 'maze' ? TOL.parseMaze(Q.q.maze) : null; Q.mazeHint = null; Q.botPos = null;
    $('hudTries').textContent = '3 / 3';
    renderQ(true);
  }

  function qHeader() {
    var info = TOL.BRANCH_INFO[Q.branch];
    if (Q.golden) return head('GOLDEN DOOR · ' + esc(info.name.toUpperCase()), '#A16207', '<span class="yr">Question ' + (G.floor.goldenStep + 1) + ' of 5</span>');
    if (Q.door.kind === 'tut') return head('PRACTICE DOOR · CAPTAIN COG', '#2563EB', '<span class="yr">Tutorial</span>');
    return head(esc(info.short) + (Q.door.kind === 'bonus' ? ' BONUS DOOR' : Q.door.kind === 'extra' ? ' PRACTICE DOOR' : ' DOOR') + ' · ' + esc(info.guard.toUpperCase()), info.label, '<span class="yr">Year ' + G.profile.year + '</span>');
  }

  function guardLine() {
    var q = Q.q, info = TOL.BRANCH_INFO[Q.branch];
    if (Q.golden) return 'The Golden Door glows. Answer one question from every subject to climb up!';
    if (q.type === 'maze') return info.guard + ': Use the arrows, your keyboard, or tap a square next to the robot.';
    if (q.type === 'build' || q.type === 'program') return info.guard + ': Drag the tiles into the boxes, or tap a tile to place it.';
    var lines = { maths: 'Beep boop! Answer my question to open this door.', english: 'Hello! Let\'s play with words.', reading: 'Read the story carefully, then answer.', logic: 'Time to think like a robot!', science: 'Let\'s explore the world!' };
    return (Q.door && Q.door.kind === 'tut') ? 'Answer 2 questions to open a door. Have a go!' : info.guard + ': ' + lines[Q.branch];
  }

  function progressDots() {
    if (Q.golden) { var s = ''; for (var i = 0; i < 5; i++) s += '<i class="' + (i < G.floor.goldenStep ? 'on' : '') + '"></i>'; return '<div class="qprog">' + s + '<span>Golden questions</span></div>'; }
    var p = Q.door.progress || 0;
    return '<div class="qprog"><i class="' + (p > 0 ? 'on' : '') + '"></i><i class="' + (p > 1 ? 'on' : '') + '"></i><span>' + p + ' of 2 answered</span></div>';
  }

  function renderQ(first) {
    var q = Q.q, info = TOL.BRANCH_INFO[Q.branch], html = '';
    html += '<div class="card" role="dialog" aria-modal="true" aria-label="Door question">' + qHeader() + '<div class="card-body">';
    html += '<div class="guard">' + SVG.robot(Q.golden ? '#FDE047' : info.body) + '<div class="bubble">' + esc(guardLine()) + '</div></div>';
    html += progressDots();
    if (q.passage) {
      html += '<div class="passage"><h4>' + esc(q.passage.title) + '</h4><p>' + q.passage.sentences.map(function (s, i) {
        return '<span class="' + (Q.hintUsed && i === q.passage.highlight ? 'hl' : '') + '">' + esc(s) + '</span>';
      }).join(' ') + '</p></div>';
    }
    html += '<div class="prompt' + (q.prompt.length > 60 ? ' long' : '') + '" id="qPrompt">' + esc(q.prompt) + '</div>';
    if (q.pattern) html += '<div class="prompt spell-pattern" aria-label="Word with missing letters">' + esc(q.pattern) + '</div>';
    if (q.spellWord && q.mode !== 'pick' && A.canSpeak() && A.voiceOn) html += '<div style="display:flex;justify-content:center"><button class="btn navy small" data-act="hearword" style="display:flex;align-items:center;gap:8px">' + SVG.speaker.replace(/#3B82F6/g, '#fff').replace('<svg', '<svg style="width:22px;height:22px"') + ' Hear the word</button></div>';
    if (q.sequence) html += '<div class="seq" aria-label="Pattern">' + q.sequence.map(function (t) { return '<div class="tok' + (t === '?' || t === '_' ? ' q' : '') + '">' + (t === '_' ? '' : tokenHtml(t)) + '</div>'; }).join('') + '</div>';
    if (q.grid) html += gridHtml(q);
    if (q.type === 'debug') html += '<div class="prog-list">' + q.grid.program.map(function (d, i) { return '<div class="prog-step">' + SVG.arrow(d) + 'Step ' + (i + 1) + '</div>'; }).join('') + '</div>';
    html += '<div id="qAnswer">' + answerHtml() + '</div>';
    if (Q.hintUsed) html += '<div class="hintbox"><div>' + SVG.bulb.replace('<svg', '<svg style="width:20px;height:20px;vertical-align:-4px"') + ' ' + esc(q.hint) + '</div>' + visualHtml(q.visual) + '</div>';
    if (Q.phase === 'reveal') html += revealHtml();
    html += '<div class="feedback ' + Q.fbClass + '" id="qFeedback" aria-live="polite">' + Q.feedback + '</div>';
    html += '<div class="qfoot"><div class="hearts" aria-label="' + Q.tries + ' tries left">' + [0, 1, 2].map(function (i) { return SVG.heart(i < Q.tries); }).join('') + '</div>';
    if (A.canSpeak() && A.voiceOn) html += '<button class="icon-btn" data-act="speak" aria-label="Read the question aloud">' + SVG.speaker + '<span>Read aloud</span></button>';
    html += '<button class="icon-btn hint" data-act="hint" ' + (Q.hintUsed || Q.phase !== 'ask' ? 'disabled' : '') + '>' + SVG.bulb + '<span>Hint (' + G.profile.hints + ')</span></button>';
    html += '</div></div></div>';
    if (first) {
      openModal(html, { onClose: function () { Q.active = false; G.save(); }, keys: qKeys, noFocus: true });
      var fa = document.querySelector('#qAnswer button, #qAnswer .tile'); if (fa) setTimeout(function () { try { fa.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }
    else { var m = $('modal'), y = m.firstChild ? m.firstChild.scrollTop : 0; m.innerHTML = html; if (m.firstChild) m.firstChild.scrollTop = y; }
    bindBuild();
    $('hudTries').textContent = Q.tries + ' / 3';
    if (first && (G.profile.settings.autoRead || (q.spellWord && q.mode !== 'pick'))) speakQ();
  }

  function answerHtml() {
    var q = Q.q, locked = Q.phase !== 'ask';
    if (q.type === 'mc' || q.type === 'debug') {
      return '<div class="answers"' + (q.options.length > 4 ? ' style="grid-template-columns:repeat(3,minmax(0,1fr))"' : '') + '>' + q.options.map(function (o, i) {
        var cls = 'ans' + (Q.gone[i] ? ' gone' : '') + (Q.wrongPicked[i] ? ' wrong' : '') + (Q.phase === 'reveal' && i === q.answerIndex ? ' right' : '') + (Q.phase === 'done' && i === q.answerIndex ? ' right' : '');
        return '<button class="' + cls + '" data-act="mc" data-i="' + i + '" ' + (locked || Q.gone[i] || Q.wrongPicked[i] ? 'disabled' : '') + '><span class="k">' + (i + 1) + '</span>' + (q.optionKind === 'token' ? tokenHtml(o) : esc(o)) + '</button>';
      }).join('') + '</div>';
    }
    if (q.type === 'input') {
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
      return '<div class="numpad-wrap"><div class="num-display" id="numDisplay" aria-live="polite">' + (esc(Q.input) || '&nbsp;') + '</div><div class="numpad">' + keys.map(function (k) {
        if (k === 'del') return '<button data-act="num" data-k="del" aria-label="Delete" ' + (locked ? 'disabled' : '') + '>⌫</button>';
        if (k === 'ok') return '<button class="ok" data-act="num" data-k="ok" aria-label="Check answer" ' + (locked ? 'disabled' : '') + '>✓</button>';
        return '<button data-act="num" data-k="' + k + '" ' + (locked ? 'disabled' : '') + '>' + k + '</button>';
      }).join('') + '</div></div>';
    }
    if (q.type === 'spell') {
      var rows = ['qwertyuiop', 'asdfghjkl', "zxcvbnm'"];
      return '<div class="numpad-wrap"><div class="num-display spell-display" id="numDisplay" aria-live="polite">' + (esc(Q.input) || '&nbsp;') + '</div><div class="letters">' + rows.map(function (r, ri2) {
        return '<div class="letter-row">' + r.split('').map(function (c) { return '<button data-act="letter" data-k="' + esc(c) + '" ' + (locked ? 'disabled' : '') + '>' + esc(c) + '</button>'; }).join('') +
          (ri2 === 2 ? '<button class="wide" data-act="letter" data-k="del" aria-label="Delete" ' + (locked ? 'disabled' : '') + '>⌫</button>' : '') + '</div>';
      }).join('') + '<div class="letter-row"><button class="ok wide2" data-act="letter" data-k="ok" ' + (locked ? 'disabled' : '') + '>Check ✓</button></div></div></div>';
    }
    if (q.type === 'build' || q.type === 'program') {
      var used = {}; Q.placed.forEach(function (ti) { if (ti != null) used[ti] = 1; });
      var slots = Q.placed.map(function (ti, si) {
        var content = ti == null ? '<span class="note">' + (si + 1) + '</span>' : tileFace(q.tiles[ti]);
        return '<div class="slot' + (ti != null ? ' filled' : '') + '" data-slot="' + si + '" role="button" tabindex="0" aria-label="Box ' + (si + 1) + (ti != null ? ': ' + esc(tokenWords(q.tiles[ti])) + '. Tap to take it out' : ', empty') + '">' + content + '</div>';
      }).join('');
      var pool = q.tiles.map(function (t, i) { return '<div class="tile' + (used[i] ? ' used' : '') + '" data-tile="' + i + '" role="button" tabindex="0" aria-label="' + esc(tokenWords(t)) + '">' + tileFace(t) + '</div>'; }).join('');
      var full = Q.placed.every(function (x) { return x != null; });
      return '<div style="display:flex;flex-direction:column;gap:12px;align-items:center"><div class="note">Your answer</div><div class="slots">' + slots + '</div><div class="pool">' + pool + '</div><button class="btn" data-act="check" ' + (full && !locked ? '' : 'disabled') + '>Check</button></div>';
    }
    if (q.type === 'maze') {
      return '<div style="display:flex;flex-direction:column;gap:10px;align-items:center">' + mazeHtml() + '<div class="maze-controls"><span></span><button data-act="mz" data-d="up" aria-label="Up">' + SVG.arrow('up') + '</button><span></span><button data-act="mz" data-d="left" aria-label="Left">' + SVG.arrow('left') + '</button><button data-act="mzreset" aria-label="Start again" style="font-size:12px">Reset</button><button data-act="mz" data-d="right" aria-label="Right">' + SVG.arrow('right') + '</button><span></span><button data-act="mz" data-d="down" aria-label="Down">' + SVG.arrow('down') + '</button><span></span></div></div>';
    }
    return '';
  }
  function tileFace(t) { return TOL.DIRS[t] ? SVG.arrow(t) : tokenHtml(t); }

  function gridHtml(q) {
    var g = q.grid, cell = window.innerWidth < 500 ? 40 : 48, html = '<div class="grid-board" style="grid-template-columns:repeat(' + g.size + ',var(--cell));--cell:' + cell + 'px" aria-label="Robot grid">';
    var walls = {}; (g.walls || []).forEach(function (k) { walls[k] = 1; });
    var bot = Q.botPos || g.start;
    for (var y = 0; y < g.size; y++) for (var x = 0; x < g.size; x++) {
      var k = x + ',' + y, inner = '';
      if (bot[0] === x && bot[1] === y) inner = SVG.bot; else if (g.star[0] === x && g.star[1] === y) inner = SVG.goal;
      html += '<div class="cell' + (walls[k] ? ' wall' : '') + '">' + inner + '</div>';
    }
    return html + '</div>';
  }
  function mazeHtml() {
    var st = Q.maze, cell = window.innerWidth < 500 ? 44 : 54, html = '<div class="grid-board" id="mazeBoard" style="grid-template-columns:repeat(' + st.w + ',var(--cell));--cell:' + cell + 'px" aria-label="Maze">';
    var hintCell = null;
    if (Q.mazeHint) { var v = TOL.DIRS[Q.mazeHint]; hintCell = (st.robot[0] + v[0]) + ',' + (st.robot[1] + v[1]); }
    for (var y = 0; y < st.h; y++) for (var x = 0; x < st.w; x++) {
      var k = x + ',' + y, inner = '';
      if (st.robot[0] === x && st.robot[1] === y) inner = SVG.bot;
      else if (st.crates[k]) inner = SVG.crate;
      else if (st.star[0] === x && st.star[1] === y) inner = SVG.goal;
      html += '<div class="cell' + (st.walls[k] ? ' wall' : '') + (hintCell === k ? ' next' : '') + '" data-act="mzcell" data-x="' + x + '" data-y="' + y + '">' + (hintCell === k && !inner ? SVG.arrow(Q.mazeHint, '#CA8A04') : inner) + '</div>';
    }
    return html + '</div>';
  }

  function visualHtml(v) {
    if (!v) return '';
    if (v.kind === 'groups') {
      var g = Math.min(v.groups, 12), out = '<div class="vis-groups" aria-label="' + v.groups + ' groups of ' + v.each + '">';
      for (var i = 0; i < g; i++) { out += '<div class="vis-group">'; for (var j = 0; j < Math.min(v.each, 12); j++) out += '<i></i>'; out += '</div>'; }
      return out + '</div>';
    }
    if (v.kind === 'pv') {
      var s = String(v.n).padStart(3, '0');
      return '<div class="pv"><div class="h">Hundreds</div><div class="h">Tens</div><div class="h">Ones</div><div>' + s[0] + '</div><div>' + s[1] + '</div><div>' + s[2] + '</div></div>';
    }
    if (v.kind === 'line') {
      var o = '<div class="numline"><div class="jump"><div class="tick">' + v.from + '</div></div>';
      var n = v.from; for (var k = 0; k < Math.min(v.count, 9); k++) { n += v.step; o += '<div class="jump"><div class="arc"></div><div class="tick">' + (k === v.count - 1 ? '?' : n) + '</div></div>'; }
      return o + '</div>';
    }
    if (v.kind === 'column') {
      var w = Math.max(String(v.a).length, String(v.b).length) + 1;
      return '<div class="colsum">' + String(v.a).padStart(w, ' ') + '<br>' + v.op + String(v.b).padStart(w - 1, ' ') + '<div class="line"></div></div>';
    }
    return '';
  }

  function correctText() {
    var q = Q.q;
    if (q.type === 'mc' || q.type === 'debug') return q.optionKind === 'token' ? tokenHtml(q.options[q.answerIndex]) : esc(q.options[q.answerIndex]);
    if (q.spellWord && q.mode !== 'pick') return '<b style="font-family:var(--display);font-size:24px">' + esc(q.word) + '</b>';
    if (q.type === 'input') return esc(q.answer);
    if (q.type === 'build' || q.type === 'program') return q.answer.map(function (t) { return '<span class="tok" style="display:inline-grid;vertical-align:middle">' + tileFace(t) + '</span>'; }).join(' ');
    return '';
  }
  function revealHtml() {
    return '<div class="explain"><div><b>The answer is:</b> ' + correctText() + '</div><div>' + esc(Q.q.explain) + '</div>' + visualHtml(Q.q.visual) + '<div><button class="btn" data-act="nextq" autofocus>Try another question</button></div></div>';
  }

  function speakWord() { var q = Q.q; if (q && q.word) A.speak(q.word + '. ' + q.word + '.'); }
  function speakQ() {
    var q = Q.q;
    if (q.spellWord && q.mode !== 'pick') { A.speak((q.mode === 'listen' ? 'Spell the word: ' : q.mode === 'fill' ? 'Fill in the missing letters in: ' : 'Unscramble the letters to spell: ') + q.word + '.'); return; }
    var t = q.prompt.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/= \?/g, 'equals what?').replace(/___/g, ' blank ').replace(/\?$/, '?');
    if (q.sequence) t += '. ' + q.sequence.map(function (s) { return s === '?' || s === '_' ? 'something missing' : tokenWords(s); }).join(', ');
    if ((q.type === 'mc') && q.options) t += '. Is it: ' + q.options.map(tokenWords).join('? or ') + '?';
    A.speak(t);
  }

  function fb(text, cls) { Q.feedback = text; Q.fbClass = cls; var el = $('qFeedback'); if (el) { el.innerHTML = text; el.className = 'feedback ' + cls; } }

  function answerWas(ok, pickIndex) {
    var q = Q.q;
    if (Q.phase !== 'ask') return;
    G.recordAnswer(q, ok);
    if (ok) {
      Q.phase = 'done';
      var stars = Math.max(0, Q.tries - (Q.hintUsed ? 1 : 0));
      A.sfx('correct');
      fb('Correct! ' + (stars ? new Array(stars + 1).join(SVG.star().replace('<svg', '<svg style="width:22px;height:22px;vertical-align:-4px"')) : 'Well done!'), 'good');
      renderQ(false); fb(Q.feedback, 'good');
      setTimeout(function () { finishQuestion(true, stars); }, 1250);
      return;
    }
    Q.tries--; A.sfx('wrong');
    if (pickIndex != null) Q.wrongPicked[pickIndex] = true;
    if (Q.tries > 0) {
      var nudges = ['Not quite. Have another go!', 'So close! Try again.', 'Hmm, not that one. You can do it!'];
      Q.feedback = TOL.pick(nudges) + (Q.hintUsed || G.profile.hints <= 0 ? '' : ' A hint might help.'); Q.fbClass = 'bad';
      if (q.type === 'input' || q.type === 'spell') Q.input = '';
      if (q.type === 'program') { Q.botPos = null; }
      renderQ(false);
    } else {
      Q.phase = 'reveal'; Q.feedback = ''; Q.fbClass = '';
      renderQ(false);
      var nb = document.querySelector('[data-act="nextq"]'); if (nb) nb.focus();
    }
  }

  function finishQuestion(solved, stars) {
    if (!Q.active) return;
    if (Q.golden) {
      if (solved) { G.addStars(stars); G.floor.goldenStep++; G.save(); }
      if (G.floor.goldenStep >= 5) { closeModal(); G.goldenFinished(); return; }
      nextQuestion(); return;
    }
    var opened = G.questionFinished(Q.door, solved, stars);
    if (opened) { closeModal(); if (Q.door.kind !== 'tut') UI.toast('Door open! Walk through it to explore.', 'blue'); return; }
    nextQuestion();
  }

  function useHint() {
    var p = G.profile, q = Q.q;
    if (Q.hintUsed || Q.phase !== 'ask') return;
    if (p.hints <= 0) { fb('No hints left. Mystery boxes and Golden Doors give you more!', 'bad'); return; }
    p.hints--; Q.hintUsed = true; A.sfx('hint');
    if ((q.type === 'mc' || q.type === 'debug') && q.options.length >= 3) {
      var wrong = q.options.map(function (_, i) { return i; }).filter(function (i) { return i !== q.answerIndex && !Q.wrongPicked[i]; });
      TOL.shuffle(wrong).slice(0, q.options.length >= 4 ? 2 : 1).forEach(function (i) { Q.gone[i] = true; });
    }
    if (q.type === 'maze') { var sol = TOL.mazeSolve(Q.maze); Q.mazeHint = sol && sol[0]; }
    UI.refreshHud(); renderQ(false);
  }

  function checkBuild() {
    var q = Q.q, seq = Q.placed.map(function (i) { return q.tiles[i]; });
    if (q.type === 'build') { answerWas(seq.join('|') === q.answer.join('|')); return; }
    // program: run the robot
    var g = q.grid, walls = {}; (g.walls || []).forEach(function (k) { walls[k] = 1; });
    var pos = g.start.slice(), i = 0;
    Q.phase = 'run';
    var timer = setInterval(function () {
      if (i >= seq.length) {
        clearInterval(timer); Q.phase = 'ask';
        answerWas(pos[0] === g.star[0] && pos[1] === g.star[1]); return;
      }
      var v = TOL.DIRS[seq[i]], nx = pos[0] + v[0], ny = pos[1] + v[1];
      i++;
      if (nx < 0 || ny < 0 || nx >= g.size || ny >= g.size || walls[nx + ',' + ny]) { clearInterval(timer); A.sfx('bump'); Q.phase = 'ask'; Q.botPos = null; answerWas(false); return; }
      pos = [nx, ny]; Q.botPos = pos; renderQ(false);
    }, 320);
  }

  function mazeStep(d) {
    if (Q.phase !== 'ask' || !Q.maze) return;
    if (!TOL.mazeMove(Q.maze, d)) { A.sfx('bump'); return; }
    A.sfx('click');
    if (Q.mazeHint) { var sol = TOL.mazeSolve(Q.maze); Q.mazeHint = sol && sol[0]; }
    var st = Q.maze;
    if (st.robot[0] === st.star[0] && st.robot[1] === st.star[1]) { answerWas(true); return; }
    if (!TOL.mazeSolve(st)) { fb('Oh no, a crate is stuck! Press Reset to start again.', 'bad'); }
    var board = $('mazeBoard'); if (board) board.outerHTML = mazeHtml();
  }

  // Build tiles: tap to place, tap a filled box to take it out, or drag a tile onto a box.
  function bindBuild() {
    var q = Q.q; if (!Q.placed || Q.phase !== 'ask') return;
    var m = $('modal');
    m.querySelectorAll('.tile').forEach(function (el) {
      el.addEventListener('pointerdown', function (e) {
        if (el.classList.contains('used')) return;
        e.preventDefault();
        var ti = Number(el.dataset.tile), sx = e.clientX, sy = e.clientY, ghost = null, over = null;
        function move(ev) {
          if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
            ghost = el.cloneNode(true); ghost.classList.add('dragging'); document.body.appendChild(ghost);
          }
          if (ghost) {
            ghost.style.left = (ev.clientX - 31) + 'px'; ghost.style.top = (ev.clientY - 31) + 'px';
            var t = document.elementFromPoint(ev.clientX, ev.clientY), s = t && t.closest ? t.closest('.slot') : null;
            if (over && over !== s) over.classList.remove('over');
            over = s; if (s) s.classList.add('over');
          }
        }
        function up() {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          if (ghost) { ghost.remove(); if (over) { var si = Number(over.dataset.slot); Q.placed[si] = ti; } }
          else { var empty = Q.placed.indexOf(null); if (empty >= 0) Q.placed[empty] = ti; }
          A.sfx('click'); renderQ(false);
        }
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); var empty = Q.placed.indexOf(null); if (empty >= 0) { Q.placed[empty] = Number(el.dataset.tile); renderQ(false); } } });
    });
    m.querySelectorAll('.slot.filled').forEach(function (el) {
      function take() { Q.placed[Number(el.dataset.slot)] = null; A.sfx('click'); renderQ(false); }
      el.addEventListener('click', take);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); take(); } });
    });
  }

  function qKeys(e) {
    var q = Q.q; if (!q) return false;
    if (Q.phase === 'reveal' && e.key === 'Enter') { var b = document.querySelector('[data-act="nextq"]'); if (b) { b.click(); return true; } }
    if (Q.phase !== 'ask') return false;
    if (q.type === 'input') {
      if (/^[0-9]$/.test(e.key)) { numKey(e.key); return true; }
      if (e.key === 'Backspace') { numKey('del'); return true; }
      if (e.key === 'Enter') { numKey('ok'); return true; }
    }
    if (q.type === 'spell') {
      if (/^[a-zA-Z']$/.test(e.key)) { spellKey(e.key.toLowerCase()); return true; }
      if (e.key === 'Backspace') { spellKey('del'); return true; }
      if (e.key === 'Enter') { spellKey('ok'); return true; }
    }
    if ((q.type === 'mc' || q.type === 'debug') && /^[1-6]$/.test(e.key)) { var i = Number(e.key) - 1; if (i < q.options.length && !Q.gone[i] && !Q.wrongPicked[i]) answerWas(i === q.answerIndex, i); return true; }
    if (q.type === 'maze') { var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }; if (map[e.key]) { mazeStep(map[e.key]); return true; } }
    return false;
  }
  function spellKey(k) {
    if (Q.phase !== 'ask') return;
    if (k === 'del') Q.input = Q.input.slice(0, -1);
    else if (k === 'ok') {
      if (!Q.input) { fb('Type the word first.', 'bad'); return; }
      answerWas(Q.input.trim().toLowerCase() === String(Q.q.answer).toLowerCase()); return;
    }
    else if (Q.input.length < 24) Q.input += k;
    A.sfx('click');
    var d = $('numDisplay'); if (d) d.innerHTML = esc(Q.input) || '&nbsp;';
  }
  function numKey(k) {
    if (Q.phase !== 'ask') return;
    if (k === 'del') Q.input = Q.input.slice(0, -1);
    else if (k === 'ok') { if (!Q.input) { fb('Type your answer first.', 'bad'); return; } answerWas(Number(Q.input) === Q.q.answer); return; }
    else if (Q.input.length < 5) Q.input += k;
    A.sfx('click');
    var d = $('numDisplay'); if (d) d.innerHTML = esc(Q.input) || '&nbsp;';
  }

  /* ---------------- golden door, level up, boxes ---------------- */
  UI.goldenAppeared = function () {
    queueModal(function () {
      openModal('<div class="card">' + head('THE GOLDEN DOOR HAS APPEARED!', '#A16207') + '<div class="card-body"><div class="guard">' + SVG.robot('#FDE047') + '<div class="bubble">You opened 3 doors in every subject. The Golden Door has appeared, and you will find it in every room on this floor! It asks one question from every subject. Answer all 5 to climb to the next floor.</div></div><p class="note">You can still open bonus doors on this floor first for extra points.</p><div><button class="btn gold" data-act="close" autofocus>Let\'s find it!</button></div></div></div>');
      UI.refreshHud();
    });
  };

  UI.levelUp = function (n) {
    var practice = n >= 3;
    queueModal(function () {
      openModal('<div class="card">' + head('FLOOR ' + n + ' COMPLETE!', '#A16207') + '<div class="card-body" style="align-items:center;text-align:center">' +
        '<div style="width:90px">' + SVG.star('#FACC15') + '</div><h2 style="font-family:var(--display);margin:0;font-size:32px">The tower glows brighter!</h2>' +
        '<p style="font-size:17px;margin:0">You earned <b>300 points</b>, a <b>Mystery Box</b> and a <b>free hint</b>.</p>' +
        (practice ? '<p class="note">The doors get a little trickier on every floor you climb.</p>' : '') +
        '<div class="link-row"><button class="btn gold" data-act="climb" autofocus>Climb to Floor ' + (n + 1) + '</button><button class="btn secondary" data-act="close">Stay and explore bonus doors</button></div></div></div>', { onClose: function () { G.celebration = null; } });
    });
  };

  UI.boxEarned = function (why) {
    A.sfx('box');
    UI.toast(why + ' You won a Mystery Box! Open it from your backpack.', 'gold');
  };

  function openBoxModal(after) {
    var p = G.profile;
    if (!p.pendingBoxes) { if (after) after(); return; }
    openModal('<div class="card">' + head('MYSTERY BOX', '#7C3AED') + '<div class="card-body" style="align-items:center;text-align:center" id="boxBody">' +
      '<div class="chest" id="chest">' + SVG.chest + '</div><p style="font-size:18px;margin:0">You have <b>' + p.pendingBoxes + '</b> mystery box' + (p.pendingBoxes > 1 ? 'es' : '') + ' to open.</p>' +
      '<button class="btn gold" data-act="openbox" autofocus>Open it!</button></div></div>', { onClose: after });
  }
  UI.openBoxModal = openBoxModal;

  function revealBox() {
    var chest = $('chest'); if (!chest) return;
    var btn = document.querySelector('[data-act="openbox"]'); if (btn) btn.disabled = true;
    chest.classList.add('shake');
    setTimeout(function () {
      var res = G.openBox(); if (!res) return;
      A.sfx('box');
      var p = G.profile, html = '<div class="reward">';
      if (res.kind === 'item') {
        var it = TOL.ITEMS[res.item];
        html += '<canvas id="rewardCv" width="160" height="190"></canvas><h2 style="font-family:var(--display);margin:0">' + esc(it.name) + '!</h2><p class="note">It is in your backpack.</p>';
      } else if (res.kind === 'memory') {
        html += '<div class="memory" style="max-width:520px"><b>A MEMORY RETURNS · ' + (res.memory + 1) + ' OF ' + TOL.MEMORIES.length + '</b>' + esc(TOL.MEMORIES[res.memory]) + '</div>';
      } else {
        html += '<div style="width:80px">' + SVG.bulb + '</div><h2 style="font-family:var(--display);margin:0">+' + res.hints + ' hints!</h2><p class="note">You now have ' + p.hints + ' hints.</p>';
      }
      html += '<div style="display:flex;align-items:center;gap:10px"><div class="sticker"><div class="disc" style="background:' + res.sticker.color + '">' + stickerSvg(res.sticker.id) + '</div></div><span>Plus a sticker for your book: <b>' + esc(res.sticker.name) + '</b></span></div>';
      html += '<div class="link-row">';
      if (res.kind === 'item') html += '<button class="btn" data-act="wear" data-item="' + res.item + '">Wear it now</button>';
      if (res.kind === 'memory' && A.canSpeak() && A.voiceOn) html += '<button class="btn secondary" data-act="speakmem" data-m="' + res.memory + '">Read it to me</button>';
      html += p.pendingBoxes ? '<button class="btn gold" data-act="nextbox">Open the next box (' + p.pendingBoxes + ')</button>' : '<button class="btn secondary" data-act="close">Brilliant!</button>';
      html += '</div></div>';
      $('boxBody').innerHTML = html;
      if (res.kind === 'item') { var eq = Object.assign({}, p.equipped); eq[TOL.ITEMS[res.item].slot] = res.item; drawFull($('rewardCv'), p.look, eq, true); }
    }, 900);
  }

  /* ---------------- backpack ---------------- */
  var bagTab = 'wear';
  UI.openBackpack = function () {
    openModal('<div class="card" id="bagCard"></div>', { onClose: function () { if (G.tutorial && G.tutorial.step === 3) { G.tutorial.step = 4; UI.coach(4); } } });
    renderBag();
  };
  function renderBag() {
    var p = G.profile, html = head('YOUR BACKPACK', '#EA580C') + '<div class="card-body">';
    var nt = G.nextTitle();
    html += '<div class="pstats"><div class="pstat"><b>' + p.score.toLocaleString('en-GB') + '</b><small>points</small></div><div class="pstat"><b>' + p.stars + '</b><small>stars</small></div><div class="pstat"><b>' + esc(G.title()) + '</b><small>' + (nt ? (nt.at - p.score) + ' points to ' + esc(nt.name) : 'top title!') + '</small></div><div class="pstat"><b>' + p.hints + '</b><small>hints</small></div></div>';
    if (p.pendingBoxes) html += '<button class="btn gold" data-act="bagbox">' + SVG.bag.replace('<svg', '<svg style="width:26px;height:26px;vertical-align:-6px"') + ' Open mystery box' + (p.pendingBoxes > 1 ? 'es (' + p.pendingBoxes + ')' : '') + '</button>';
    html += '<button class="btn secondary small" data-act="editme" style="align-self:flex-start">Change my name and look</button>';
    html += '<div class="tabs" role="tablist">' + [['wear', 'Clothes'], ['toys', 'Toys'], ['pets', 'Pets'], ['memories', 'Memories'], ['stickers', 'Stickers']].map(function (t) { return '<button class="tab' + (bagTab === t[0] ? ' on' : '') + '" role="tab" aria-selected="' + (bagTab === t[0]) + '" data-act="bagtab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    if (bagTab === 'wear' || bagTab === 'pets' || bagTab === 'toys') {
      var want = function (slot) { return bagTab === 'pets' ? slot === 'pet' : bagTab === 'toys' ? slot === 'hand' : (slot !== 'pet' && slot !== 'hand'); };
      var mine = p.items.filter(function (id) { return TOL.ITEMS[id] && want(TOL.ITEMS[id].slot); });
      html += '<div class="bag"><canvas id="bagPreview" width="180" height="220" aria-label="Your explorer"></canvas><div>';
      if (!mine.length) html += '<div class="empty">' + (bagTab === 'pets' ? 'No pets yet. Keep opening mystery boxes and a friendly pet will turn up!' : bagTab === 'toys' ? 'No toys yet. Wands, guitars, balloons and more are hiding in mystery boxes!' : 'Nothing to wear yet. Finish all 3 doors of a subject to win a mystery box.') + '</div>';
      else html += '<div class="items">' + mine.map(function (id) {
        var it = TOL.ITEMS[id], on = p.equipped[it.slot] === id;
        return '<button class="item' + (on ? ' on' : '') + '" data-act="equip" data-item="' + id + '" aria-pressed="' + on + '"><canvas data-thumb="' + id + '" width="72" height="72"></canvas>' + esc(it.name) + (on ? '<span class="tag">WEARING</span>' : '<span class="note">Tap to wear</span>') + '</button>';
      }).join('') + '</div>';
      html += '</div></div>';
    } else if (bagTab === 'memories') {
      html += p.memories.length ? p.memories.slice().sort(function (a, b) { return a - b; }).map(function (m) { return '<div class="memory"><b>MEMORY ' + (m + 1) + '</b>' + esc(TOL.MEMORIES[m]) + '</div>'; }).join('') : '<div class="empty">No memories yet. They are hidden in mystery boxes.</div>';
      html += '<p class="note">' + p.memories.length + ' of ' + TOL.MEMORIES.length + ' memories found. Find them all to remember why you came to the Tower of Lumen.</p>';
    } else {
      html += '<div class="stickers">' + TOL.STICKERS.map(function (s) { var has = p.stickers.indexOf(s.id) >= 0; return '<div class="sticker' + (has ? '' : ' locked') + '"><div class="disc" style="background:' + s.color + '">' + (has ? stickerSvg(s.id) : '<span style="color:#94A3B8;font-family:var(--display);font-size:22px">?</span>') + '</div>' + (has ? esc(s.name) : '???') + '</div>'; }).join('') + '</div>';
      html += '<p class="note">' + p.stickers.length + ' of ' + TOL.STICKERS.length + ' stickers collected.</p>';
    }
    html += '</div>';
    $('bagCard').innerHTML = html;
    drawFull($('bagPreview'), p.look, p.equipped, true);
    document.querySelectorAll('[data-thumb]').forEach(function (cv) { drawItemThumb(cv, cv.dataset.thumb); });
  }

  /* ---------------- change my explorer (name and look) ---------------- */
  var edit = null;
  UI.openEditMe = function () {
    var p = G.profile;
    edit = { name: p.name, look: Object.assign({}, p.look), msg: '' };
    openModal('<div class="card" id="editCard"></div>', { noFocus: true });
    renderEdit(true);
  };
  function renderEdit(first) {
    var L = edit.look;
    function sw(list, key, label) { return '<div class="opt-group"><span>' + label + '</span><div class="swatches">' + list.map(function (c) { return '<button class="swatch' + (L[key] === c ? ' sel' : '') + '" style="background:' + c + '" data-act="elook" data-k="' + key + '" data-v="' + c + '" aria-label="' + label + ' ' + c + '" aria-pressed="' + (L[key] === c) + '"></button>'; }).join('') + '</div></div>'; }
    var html = head('CHANGE MY EXPLORER', '#2563EB') + '<div class="card-body">' +
      '<div class="opt-group"><span>Name</span><label class="visually-hidden" for="editName">Your name</label><input class="name-input" id="editName" maxlength="14" autocomplete="off" value="' + esc(edit.name) + '"></div>' +
      '<div class="custom"><canvas id="editCv" width="200" height="240" aria-label="Your explorer"></canvas><div>' + sw(TOL.SKINS, 'skin', 'Skin') +
      '<div class="opt-group"><span>Hair style</span><div class="swatches">' + TOL.HAIR_STYLES.map(function (h) { return '<button class="pill' + (L.hair === h ? ' sel' : '') + '" data-act="elook" data-k="hair" data-v="' + h + '" aria-pressed="' + (L.hair === h) + '">' + ({ short: 'Short', long: 'Long', curly: 'Curly', bunches: 'Bunches' })[h] + '</button>'; }).join('') + '</div></div>' +
      sw(TOL.HAIR_COLOURS, 'hairColor', 'Hair colour') + sw(TOL.OUTFITS, 'outfit', 'Coat colour') + '</div></div>' +
      '<p class="note">Hats, glasses, capes, shoes and pets you have won are in your backpack.</p>' +
      '<div class="feedback bad" id="editMsg">' + esc(edit.msg) + '</div>' +
      '<div class="row-end"><button class="btn secondary" data-act="close">Cancel</button><button class="btn" data-act="saveme">Save</button></div></div>';
    $('editCard').innerHTML = html;
    var ni = $('editName'); ni.addEventListener('input', function () { edit.name = ni.value; });
    drawFull($('editCv'), L, G.profile.equipped, true);
    if (first) setTimeout(function () { try { ni.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }
  function saveEdit() {
    var name = (edit.name || '').trim();
    if (!name) { edit.msg = 'Please type a name.'; renderEdit(); return; }
    G.profile.name = name; G.profile.look = Object.assign({}, edit.look);
    G.save(); A.sfx('correct'); closeModal(); UI.refreshHud();
    UI.toast('Looking great, ' + name + '!', 'blue');
  }

  /* ---------------- map, menu, settings ---------------- */
  UI.openMap = function () {
    var p = G.profile, html = '<div class="card">' + head('TOWER MAP', '#2B2D6E') + '<div class="card-body">';
    if (G.floor.n === 0) html += '<p class="note">Finish the tutorial to start exploring the tower.</p>';
    else {
      html += '<canvas class="big-map" id="bigMap" aria-label="Map of this floor"></canvas><p class="note">Yellow is where you are. A white dot means that room still has a locked door. A star marks the Golden Door.</p>';
      html += '<div class="floors">';
      for (var n = p.maxFloor; n >= 1; n--) {
        var f = p.floors[n]; if (!f) continue;
        var dots = '', lit = G.reqOpened(f);
        for (var i = 0; i < 15; i++) dots += '<i class="' + (i < lit ? 'on' : '') + '"></i>';
        var bonus = TOL.BRANCHES.reduce(function (s, b) { return s + f.opened[b].bonus; }, 0);
        html += '<div class="floor-row"><b>Floor ' + n + '</b><div class="dots" aria-label="' + lit + ' of 15 doors">' + dots + '</div><span class="note">' + (f.completed ? 'Complete' : lit + '/15') + ' · bonus ' + bonus + '/5</span>' + (n === G.floor.n ? '<span class="note"><b>You are here</b></span>' : '<button class="btn small navy" data-act="gofloor" data-n="' + n + '">Go</button>') + '</div>';
      }
      html += '</div>';
    }
    html += '</div></div>';
    openModal(html);
    var bm = $('bigMap');
    if (bm) { bm.width = bm.clientWidth * dpr; bm.height = bm.clientHeight * dpr; R.drawMiniMap(bm.getContext('2d'), G.floor, G.room.id, bm.clientWidth, bm.clientHeight, dpr); }
  };

  UI.openMenu = function () {
    openModal('<div class="card">' + head('MENU', '#2B2D6E') + '<div class="card-body"><div class="menu-list">' +
      '<button class="btn" data-act="close" autofocus>' + SVG.play + ' Keep exploring</button>' +
      '<button class="btn navy" data-act="menubag">' + SVG.bag + ' Backpack</button>' +
      '<button class="btn navy" data-act="menumap">' + SVG.map + ' Tower map</button>' +
      '<button class="btn navy" data-act="settings">' + SVG.cog + ' Sound and reading</button>' +
      '<button class="btn navy" data-act="editme">' + SVG.users + ' Change my explorer</button>' +
      '<button class="btn navy" data-act="tutorial">' + SVG.school + ' Play the tutorial</button>' +
      '<button class="btn navy" data-act="parent">' + SVG.lock + ' Parent view</button>' +
      '<button class="btn navy" data-act="switch">' + SVG.users + ' Switch player</button>' +
      '</div><p class="note">Your progress saves automatically on this device.</p></div></div>');
  };

  function settingsHtml() {
    var s = G.profile.settings;
    function tog(key, label) { return '<div class="setting"><label id="lbl-' + key + '">' + label + '</label><div class="ctrls"><button class="toggle" data-act="tog" data-k="' + key + '" aria-labelledby="lbl-' + key + '" aria-pressed="' + !!s[key] + '"></button></div></div>'; }
    return '<div class="card">' + head('SOUND AND READING', '#2B2D6E') + '<div class="card-body">' +
      '<div class="setting"><label for="musicVol">Music</label><div class="ctrls"><input type="range" id="musicVol" min="0" max="1" step="0.05" value="' + s.musicVol + '"><button class="toggle" data-act="tog" data-k="musicOn" aria-label="Music on" aria-pressed="' + s.musicOn + '"></button></div></div>' +
      '<div class="setting"><label for="sfxVol">Sound effects</label><div class="ctrls"><input type="range" id="sfxVol" min="0" max="1" step="0.05" value="' + s.sfxVol + '"><button class="toggle" data-act="tog" data-k="sfxOn" aria-label="Sound effects on" aria-pressed="' + s.sfxOn + '"></button></div></div>' +
      tog('voiceOn', 'Read-aloud button') + tog('autoRead', 'Read each question aloud automatically') + tog('easyFont', 'Easier-to-read letters') + tog('bigText', 'Bigger text') +
      (A.canSpeak() ? '' : '<p class="note">Read-aloud is not available in this browser.</p>') +
      '<div><button class="btn" data-act="close">Done</button></div></div></div>';
  }
  UI.openSettings = function () { openModal(settingsHtml()); bindSettings(); };
  function bindSettings() {
    var s = G.profile.settings;
    var mv = $('musicVol'), sv = $('sfxVol');
    if (mv) mv.oninput = function () { s.musicVol = Number(mv.value); applySettings(); };
    if (sv) sv.oninput = function () { s.sfxVol = Number(sv.value); applySettings(); };
    if (mv) mv.onchange = sv.onchange = function () { G.save(); A.sfx('click'); };
  }
  function applySettings() {
    var s = G.profile.settings;
    A.musicOn = s.musicOn; A.musicVol = s.musicVol; A.sfxOn = s.sfxOn; A.sfxVol = s.sfxVol; A.voiceOn = s.voiceOn !== false;
    A.apply();
    document.body.classList.toggle('easy-font', !!s.easyFont);
    document.body.classList.toggle('big-text', !!s.bigText);
  }

  /* ---------------- break reminder ---------------- */
  UI.breakReminder = function () {
    queueModal(function () {
      openModal('<div class="card">' + head('TIME FOR A BREAK?', '#2563EB') + '<div class="card-body"><div class="guard">' + SVG.robot() + '<div class="bubble">Beep boop! You have been exploring for 30 minutes. Brilliant work! How about a little break? Stretch like a robot, have a drink of water, or tell someone what you learned. Your progress is saved.</div></div><div class="link-row"><button class="btn" data-act="takebreak" autofocus>Take a break</button><button class="btn secondary" data-act="close">Keep exploring</button></div></div></div>');
    });
  };

  /* ---------------- tutorial coach ---------------- */
  UI.coach = function (step) {
    var el = $('coach');
    if (step < 0) { el.hidden = true; return; }
    var name = esc(G.profile.name), msg, actions = '';
    if (step === 0) msg = 'Hello ' + name + '! I\'m Captain Cog. You\'ve just woken up in the Tower of Lumen. Let\'s learn to explore! Walk to the glowing circle with the arrow keys, or tap the floor.';
    if (step === 1) msg = 'Well done! Every door is guarded by questions, and its sign shows the subject. Walk to the blue Maths door and press Space, or just tap the door.';
    if (step === 2) {
      msg = 'Brilliant! 2 correct answers open a door. When you open all 3 doors of a subject on a floor, you win a Mystery Box. Here is one to practise with!';
      if (!G.tutorial.boxGiven) { G.tutorial.boxGiven = true; G.profile.pendingBoxes++; UI.refreshHud(); }
      actions = '<button class="btn small gold" data-act="tutbox">Open the box</button>';
    }
    if (step === 3) { msg = 'Everything you find goes into your backpack. Tap the backpack at the bottom, or press B, and try something on!'; actions = '<button class="btn small" data-act="tutbag">Open my backpack</button>'; }
    if (step === 4) msg = 'Look at the bottom corners. The pink orb shows your tries: 3 for each question. The blue orb shows your hints. Now walk through the open door to start your adventure!';
    el.innerHTML = SVG.robot() + '<div><div>' + msg + '</div><div class="coach-actions">' + actions + '<button class="btn small secondary" data-act="skiptut">Skip tutorial</button></div></div>';
    el.hidden = false;
    if (G.profile.settings.autoRead) A.speak(el.textContent.replace('Skip tutorial', ''));
  };
  $('coach').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    A.init();
    var act = b.dataset.act;
    if (act === 'skiptut') G.finishTutorial();
    if (act === 'tutbox') openBoxModal(function () { if (G.tutorial) { G.tutorial.step = 3; UI.coach(3); } });
    if (act === 'tutbag') UI.openBackpack();
  });

  /* ---------------- parent view ---------------- */
  var parentBack = null;
  UI.openParent = function (back) {
    parentBack = back || null;
    var hasPin = !!G.store.pin;
    openModal('<div class="card">' + head('PARENT VIEW', '#334155') + '<div class="card-body" style="align-items:center;text-align:center">' +
      '<p style="font-size:17px">' + (hasPin ? 'Enter the 4-digit parent PIN.' : 'Choose a 4-digit parent PIN. You will need it to open this view.') + '</p>' +
      '<form id="pinForm" style="display:flex;flex-direction:column;gap:14px;align-items:center"><div class="pin">' + [0, 1, 2, 3].map(function (i) { return '<input inputmode="numeric" maxlength="1" pattern="[0-9]" id="pin' + i + '" aria-label="PIN digit ' + (i + 1) + '" autocomplete="off">'; }).join('') + '</div>' +
      '<div class="feedback bad" id="pinMsg"></div><button class="btn" type="submit">' + (hasPin ? 'Open' : 'Set PIN') + '</button></form>' +
      '<p class="note">This keeps children out of the settings. It is not a security lock.</p></div></div>', { onClose: function () { if (parentBack) parentBack(); } });
    var inputs = [0, 1, 2, 3].map(function (i) { return $('pin' + i); });
    inputs.forEach(function (inp, i) {
      inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 1); if (inp.value && i < 3) inputs[i + 1].focus(); });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus(); });
    });
    inputs[0].focus();
    var firstPin = null;
    $('pinForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var pin = inputs.map(function (x) { return x.value; }).join('');
      if (!/^\d{4}$/.test(pin)) { $('pinMsg').textContent = 'Please type 4 numbers.'; return; }
      if (!hasPin) {
        if (!firstPin) { firstPin = pin; inputs.forEach(function (x) { x.value = ''; }); inputs[0].focus(); $('pinMsg').textContent = ''; document.querySelector('#pinForm').previousElementSibling.textContent = 'Type the same PIN again to confirm.'; return; }
        if (pin !== firstPin) { firstPin = null; inputs.forEach(function (x) { x.value = ''; }); inputs[0].focus(); $('pinMsg').textContent = 'The PINs did not match. Please start again.'; return; }
        G.store.pin = pin; G.save();
      } else if (pin !== G.store.pin) { inputs.forEach(function (x) { x.value = ''; }); inputs[0].focus(); $('pinMsg').textContent = 'That PIN is not right.'; return; }
      renderParent();
    });
  };

  function fmtTime(ms) { var m = Math.round(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; }
  var parentState = {};
  function renderParent() {
    var html = '<div class="card">' + head('PARENT VIEW', '#334155') + '<div class="card-body">';
    // School term and weekly spellings (shared by every player on this device).
    var auto = TOL.termFromDate(), cur = G.store.term == null ? 'auto' : String(G.store.term);
    html += '<section class="panel" style="box-shadow:none;border:3px solid #E2E8F0;padding:16px"><h2 style="font-size:22px">School term</h2>' +
      '<p class="note">Questions only use topics the school has taught up to this term. Spring and Summer topics appear when their term starts.</p>' +
      '<div class="link-row" style="justify-content:flex-start"><label class="note" for="termSel">Term</label><select id="termSel" style="font-size:16px;padding:8px;border-radius:10px">' +
      '<option value="auto"' + (cur === 'auto' ? ' selected' : '') + '>Automatic (now ' + TOL.TERMS[auto] + ')</option>' +
      TOL.TERMS.map(function (t, i) { return '<option value="' + i + '"' + (cur === String(i) ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div></section>';
    var sp = G.store.spellings;
    html += '<section class="panel" style="box-shadow:none;border:3px solid #E2E8F0;padding:16px"><h2 style="font-size:22px">This week\'s spellings</h2>' +
      '<p class="note">Type the words from school, one per line or separated by commas. About half of the English door questions will practise them; the rest stay normal English questions. Saving a new list replaces this one, and up to 3 tricky words from the old list are kept.</p>' +
      '<label class="visually-hidden" for="spellIn">Spelling words</label><textarea class="code" id="spellIn" style="font-family:var(--body);font-size:16px;min-height:120px" placeholder="believe&#10;February&#10;library">' + esc(sp ? sp.words.join('\n') : '') + '</textarea>' +
      (sp && sp.carry && sp.carry.length ? '<p class="note">Also practising from last week: ' + sp.carry.map(esc).join(', ') + '</p>' : '') +
      '<div class="link-row" style="justify-content:flex-start"><button class="btn small" data-act="savespell">Save spellings</button>' + (sp ? '<button class="btn small secondary" data-act="clearspell">Clear list</button>' : '') +
      '<span class="note">' + esc(parentState.spellMsg || (sp ? 'Set on ' + new Date(sp.setAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'No list yet.')) + '</span></div></section>';
    parentState.spellMsg = null;
    if (!G.store.order.length) html += '<div class="empty">No players yet.</div>';
    G.store.order.forEach(function (id) {
      var p = G.store.profiles[id], acc = p.answered ? Math.round(p.correct / p.answered * 100) : 0;
      var topics = Object.keys(p.topicStats || {}).map(function (t) { var s = p.topicStats[t], n = s.right + s.wrong; return { t: t, s: s, n: n, pct: n ? Math.round(s.right / n * 100) : 0 }; }).sort(function (a, b) { return a.pct - b.pct; });
      var strong = topics.filter(function (x) { return x.n >= 4 && x.pct >= 80; }), work = topics.filter(function (x) { return x.n >= 3 && x.pct < 65; });
      html += '<section class="panel" style="box-shadow:none;border:3px solid #E2E8F0;padding:16px"><div class="row-end"><h2 style="font-size:24px">' + esc(p.name) + '</h2><span class="note">Year ' + p.year + ' · ' + esc(G.title(p)) + '</span></div>';
      html += '<div class="pstats"><div class="pstat"><b>' + (p.floor || 1) + '</b><small>current floor (highest ' + (p.maxFloor || 1) + ')</small></div><div class="pstat"><b>' + p.doorsOpened + '</b><small>doors opened</small></div><div class="pstat"><b>' + acc + '%</b><small>answers right first or later</small></div><div class="pstat"><b>' + fmtTime(p.playMs) + '</b><small>time played</small></div><div class="pstat"><b>' + p.score.toLocaleString('en-GB') + '</b><small>points</small></div><div class="pstat"><b>' + p.stars + '</b><small>stars</small></div></div>';
      html += '<div><b>Strong topics</b><div class="tagrow">' + (strong.length ? strong.map(function (x) { return '<span class="tag-good">' + esc(x.t) + '</span>'; }).join('') : '<span class="note">Not enough answers yet.</span>') + '</div></div>';
      html += '<div><b>Topics to practise</b><div class="tagrow">' + (work.length ? work.map(function (x) { return '<span class="tag-work">' + esc(x.t) + '</span>'; }).join('') : '<span class="note">Nothing stands out yet.</span>') + '</div></div>';
      if (topics.length) html += '<details><summary>All topics</summary><div class="table-wrap"><table class="ptable"><thead><tr><th>Topic</th><th>Subject</th><th class="num">Right</th><th class="num">Wrong tries</th><th class="num">Score</th></tr></thead><tbody>' + topics.slice().sort(function (a, b) { return a.t.localeCompare(b.t); }).map(function (x) { return '<tr><td>' + esc(x.t) + '</td><td>' + esc(x.s.branch ? TOL.BRANCH_INFO[x.s.branch].name : '') + '</td><td class="num">' + x.s.right + '</td><td class="num">' + x.s.wrong + '</td><td class="num">' + x.pct + '%</td></tr>'; }).join('') + '</tbody></table></div></details>';
      var words = TOL.spellingWords();
      if (words.length) html += '<div><b>This week\'s spellings</b><div class="tagrow">' + words.map(function (w) {
        var stt = G.spellStatus(p, w), cls = stt === 'secure' ? 'tag-good' : stt === 'practising' ? 'tag-work' : 'tag-new';
        return '<span class="' + cls + '">' + esc(w) + ' · ' + (stt === 'secure' ? 'secure' : stt === 'practising' ? 'practising' : 'not seen yet') + '</span>';
      }).join('') + '</div></div>';
      html += '<div class="link-row" style="justify-content:flex-start"><label class="note" for="yr-' + id + '">School year</label><select id="yr-' + id + '" data-act="year" data-id="' + id + '" style="font-size:16px;padding:8px;border-radius:10px">' + [1, 2, 3, 4, 5, 6].map(function (y) { return '<option value="' + y + '"' + (p.year === y ? ' selected' : '') + (y !== 3 ? ' disabled' : '') + '>Year ' + y + (y !== 3 ? ' (coming soon)' : '') + '</option>'; }).join('') + '</select>' +
        '<button class="btn small navy" data-act="export" data-id="' + id + '">Move to another device</button>' +
        (parentState.del === id ? '<button class="btn small danger" data-act="delyes" data-id="' + id + '">Yes, delete ' + esc(p.name) + '\'s progress</button><button class="btn small secondary" data-act="delno">Keep it</button>' : '<button class="btn small danger" data-act="del" data-id="' + id + '">Delete player</button>') + '</div>';
      if (parentState.exp === id) html += '<div class="explain"><div>Copy this code, then on the other device open Parent view and paste it under "Bring a player from another device".</div><textarea class="code" id="expCode" readonly>' + esc(G.exportProfile(id)) + '</textarea><div class="link-row" style="justify-content:flex-start"><button class="btn small" data-act="copy">Copy code</button><span class="note" id="copyMsg"></span></div></div>';
      html += '</section>';
    });
    html += '<section class="panel" style="box-shadow:none;border:3px solid #E2E8F0;padding:16px"><h2 style="font-size:22px">Bring a player from another device</h2><p class="note">Paste a code from "Move to another device", or choose a saved code file. Progress saves only on the device where it is played, so use this to carry it across.</p><textarea class="code" id="impCode" placeholder="Paste the code here"></textarea><div class="link-row" style="justify-content:flex-start"><input type="file" id="impFile" accept=".txt,.json,text/plain,application/json"><button class="btn small" data-act="import">Bring player here</button><span class="note" id="impMsg"></span></div></section>';
    html += '<div class="link-row" style="justify-content:flex-start"><button class="btn small secondary" data-act="resetpin">Change PIN</button><button class="btn" data-act="close">Done</button></div>';
    html += '</div></div>';
    $('modal').innerHTML = html;
    var f = $('impFile');
    if (f) f.addEventListener('change', function () { var file = f.files[0]; if (!file) return; var rd = new FileReader(); rd.onload = function () { $('impCode').value = String(rd.result || ''); }; rd.readAsText(file); });
    var ts = $('termSel'); if (ts) ts.addEventListener('change', function () { G.store.term = ts.value === 'auto' ? null : Number(ts.value); G.save(); });
    document.querySelectorAll('[data-act="year"]').forEach(function (sel) { sel.addEventListener('change', function () { G.store.profiles[sel.dataset.id].year = Number(sel.value); G.save(); }); });
  }

  /* ---------------- title, new player ---------------- */
  function showScreen(html) {
    mode = 'title'; $('hud').hidden = true; $('modal').hidden = true; modalOpen = false; modalQueue = [];
    var s = $('screen'); s.hidden = false; s.innerHTML = html; s.scrollTop = 0;
  }

  UI.showTitle = function () {
    A.stopSpeaking();
    var ids = G.store.order, html = '<div class="screen-inner"><div class="logo"><svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="108" rx="44" ry="8" fill="rgba(43,45,110,0.2)"/><rect x="38" y="40" width="44" height="66" rx="6" fill="#FFF7E6" stroke="#2B2D6E" stroke-width="4"/><path d="M32 42L60 12l28 30z" fill="#7C3AED" stroke="#2B2D6E" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="30" r="6" fill="#FDE047"/><path d="M52 106V86a8 8 0 0 1 16 0v20" fill="#FDE047" stroke="#A16207" stroke-width="3"/><rect x="45" y="52" width="10" height="12" rx="3" fill="#60A5FA"/><rect x="65" y="52" width="10" height="12" rx="3" fill="#F9A8D4"/><circle cx="18" cy="40" r="10" fill="#fff"/><circle cx="28" cy="38" r="8" fill="#fff"/><circle cx="98" cy="62" r="9" fill="#fff"/><circle cx="106" cy="60" r="7" fill="#fff"/></svg><h1>The Tower of Lumen</h1><p>Open the doors. Light up the tower. Remember who you are.</p></div>';
    if (!G.storageWorks()) html += '<div class="panel"><p>This browser is not letting the game save. You can still play, but progress will be lost when the page closes.</p></div>';
    html += '<div class="cards">';
    ids.forEach(function (id) { var p = G.store.profiles[id]; html += '<button class="pcard" data-act="play" data-id="' + id + '"><canvas data-portrait="' + id + '" width="96" height="96"></canvas><span class="nm">' + esc(p.name) + '</span><span class="meta">Year ' + p.year + ' · Floor ' + (p.floor || 1) + ' · ' + esc(G.title(p)) + '</span><span class="meta">' + p.score.toLocaleString('en-GB') + ' points</span></button>'; });
    html += '<button class="pcard new" data-act="newplayer"><span class="plus">+</span>New player</button></div>';
    html += '<div class="link-row"><button class="btn secondary small" data-act="titleparent">' + 'Parent view</button></div><p class="note" style="text-align:center">Progress is saved on this device. A parent can move a player to another device from Parent view.</p></div>';
    showScreen(html);
    document.querySelectorAll('[data-portrait]').forEach(function (cv) { drawPortrait(cv, G.store.profiles[cv.dataset.portrait]); });
  };

  var draft = null;
  function wizard(step) {
    draft.step = step;
    var steps = '<div class="steps" aria-label="Step ' + (step + 1) + ' of 4">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i <= step ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    var html = '<div class="screen-inner"><div class="panel">' + steps;
    if (step === 0) {
      html += '<h2>What is your name, explorer?</h2><form id="nameForm" style="display:flex;flex-direction:column;gap:16px"><label class="visually-hidden" for="nameIn">Your name</label><input class="name-input" id="nameIn" maxlength="14" autocomplete="off" value="' + esc(draft.name) + '" placeholder="Type your name"><div class="row-end"><button type="button" class="btn secondary" data-act="cancelnew">Back</button><button type="submit" class="btn">Next</button></div></form>';
    } else if (step === 1) {
      html += '<h2>Which school year are you in, ' + esc(draft.name) + '?</h2><div class="years">' + [1, 2, 3, 4, 5, 6].map(function (y) { return '<button class="year' + (draft.year === y ? ' sel' : '') + '" data-act="pickyear" data-y="' + y + '" ' + (y !== 3 ? 'disabled' : '') + ' aria-pressed="' + (draft.year === y) + '">Year ' + y + '<small>' + (y === 3 ? 'Ready to play' : 'Coming soon') + '</small></button>'; }).join('') + '</div><div class="row-end"><button class="btn secondary" data-act="wiz" data-s="0">Back</button><button class="btn" data-act="wiz" data-s="2" ' + (draft.year ? '' : 'disabled') + '>Next</button></div>';
    } else if (step === 2) {
      var L = draft.look;
      function sw(list, key, label) { return '<div class="opt-group"><span>' + label + '</span><div class="swatches">' + list.map(function (c) { return '<button class="swatch' + (L[key] === c ? ' sel' : '') + '" style="background:' + c + '" data-act="look" data-k="' + key + '" data-v="' + c + '" aria-label="' + label + ' ' + c + '" aria-pressed="' + (L[key] === c) + '"></button>'; }).join('') + '</div></div>'; }
      html += '<h2>Make your explorer</h2><div class="custom"><canvas id="lookCv" width="200" height="240" aria-label="Your explorer"></canvas><div>' + sw(TOL.SKINS, 'skin', 'Skin') +
        '<div class="opt-group"><span>Hair style</span><div class="swatches">' + TOL.HAIR_STYLES.map(function (h) { return '<button class="pill' + (L.hair === h ? ' sel' : '') + '" data-act="look" data-k="hair" data-v="' + h + '" aria-pressed="' + (L.hair === h) + '">' + ({ short: 'Short', long: 'Long', curly: 'Curly', bunches: 'Bunches' })[h] + '</button>'; }).join('') + '</div></div>' +
        sw(TOL.HAIR_COLOURS, 'hairColor', 'Hair colour') + sw(TOL.OUTFITS, 'outfit', 'Coat colour') + '</div></div><div class="row-end"><button class="btn secondary" data-act="wiz" data-s="1">Back</button><button class="btn" data-act="wiz" data-s="3">Next</button></div>';
    } else {
      html += '<h2>Would you like a quick tutorial?</h2><p>Captain Cog will show you how to walk, open doors, use hints and open mystery boxes. It takes about 2 minutes.</p><div class="link-row" style="justify-content:flex-start"><button class="btn" data-act="create" data-tut="1">Yes, show me!</button><button class="btn secondary" data-act="create" data-tut="0">Skip, let\'s go!</button></div><div><button class="btn secondary small" data-act="wiz" data-s="2">Back</button></div>';
    }
    html += '</div></div>';
    showScreen(html);
    if (step === 0) { var ni = $('nameIn'); ni.focus(); $('nameForm').addEventListener('submit', function (e) { e.preventDefault(); var v = ni.value.trim(); if (!v) { ni.placeholder = 'Please type your name'; ni.focus(); return; } draft.name = v; wizard(1); }); }
    if (step === 2) drawFull($('lookCv'), draft.look, {}, false);
  }

  function startGame(p, tutorial) {
    A.init();
    G.profile = p; G.store.lastId = p.id; G.sessionMs = 0; G.lastBreakAt = 0;
    applySettings();
    mode = 'game'; $('screen').hidden = true; $('hud').hidden = false; $('coach').hidden = true;
    resize();
    if (tutorial) G.enterFloor(0); else G.enterFloor(p.floor || 1);
    UI.refreshHud();
    if (!tutorial) UI.toast('Welcome back, ' + p.name + '!', 'blue');
  }

  /* ---------------- clicks ---------------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    if (b.closest('#coach')) return;
    var act = b.dataset.act;
    A.init();
    switch (act) {
      case 'close': closeModal(); break;
      case 'mc': answerWas(Number(b.dataset.i) === Q.q.answerIndex, Number(b.dataset.i)); break;
      case 'num': numKey(b.dataset.k); break;
      case 'letter': spellKey(b.dataset.k); break;
      case 'hearword': speakWord(); break;
      case 'savespell': G.setSpellings(G.parseSpellings($('spellIn').value)); parentState.spellMsg = 'Saved. The English doors will now mix these words in.'; renderParent(); break;
      case 'clearspell': G.setSpellings([]); parentState.spellMsg = 'Spelling list cleared.'; renderParent(); break;
      case 'check': checkBuild(); break;
      case 'hint': useHint(); break;
      case 'speak': speakQ(); break;
      case 'nextq': finishQuestion(false, 0); break;
      case 'mz': mazeStep(b.dataset.d); break;
      case 'mzreset': Q.maze = TOL.parseMaze(Q.q.maze); if (Q.mazeHint) { var sol = TOL.mazeSolve(Q.maze); Q.mazeHint = sol && sol[0]; } fb('', ''); var bd = $('mazeBoard'); if (bd) bd.outerHTML = mazeHtml(); break;
      case 'mzcell': if (Q.maze) { var x = Number(b.dataset.x) - Q.maze.robot[0], y = Number(b.dataset.y) - Q.maze.robot[1]; var d = x === 1 && !y ? 'right' : x === -1 && !y ? 'left' : y === 1 && !x ? 'down' : y === -1 && !x ? 'up' : null; if (d) mazeStep(d); } break;
      case 'climb': closeModal(); G.floorUp(); break;
      case 'openbox': revealBox(); break;
      case 'nextbox': var cb = modalOnClose; modalOnClose = null; closeModal(); openBoxModal(cb); break;
      case 'wear': G.equip(b.dataset.item); UI.refreshHud(); b.disabled = true; b.textContent = 'Wearing it!'; break;
      case 'speakmem': A.speak(TOL.MEMORIES[Number(b.dataset.m)]); break;
      case 'bagtab': bagTab = b.dataset.t; renderBag(); break;
      case 'equip': G.equip(b.dataset.item); A.sfx('click'); renderBag(); UI.refreshHud(); break;
      case 'bagbox': closeModal(); openBoxModal(function () { UI.openBackpack(); }); break;
      case 'menubag': closeModal(); UI.openBackpack(); break;
      case 'menumap': closeModal(); UI.openMap(); break;
      case 'settings': closeModal(); UI.openSettings(); break;
      case 'tutorial': closeModal(); G.enterFloor(0); break;
      case 'editme': closeModal(); UI.openEditMe(); break;
      case 'elook': edit.look[b.dataset.k] = b.dataset.v; A.sfx('click'); renderEdit(); break;
      case 'saveme': saveEdit(); break;
      case 'parent': closeModal(); UI.openParent(); break;
      case 'switch': closeModal(); G.save(); A.stopMusic(); UI.showTitle(); break;
      case 'tog': var s = G.profile.settings, k = b.dataset.k; s[k] = !s[k]; b.setAttribute('aria-pressed', !!s[k]); applySettings(); G.save(); A.sfx('click'); break;
      case 'gofloor': closeModal(); G.enterFloor(Number(b.dataset.n)); break;
      case 'takebreak': closeModal(); G.save(); A.stopMusic(); UI.showTitle(); break;
      case 'export': parentState.exp = parentState.exp === b.dataset.id ? null : b.dataset.id; renderParent(); break;
      case 'copy': var ta = $('expCode'); try { navigator.clipboard.writeText(ta.value).then(function () { $('copyMsg').textContent = 'Copied!'; }, function () { ta.select(); $('copyMsg').textContent = 'Press Ctrl+C (or long-press) to copy.'; }); } catch (err) { ta.select(); $('copyMsg').textContent = 'Press Ctrl+C (or long-press) to copy.'; } break;
      case 'del': parentState.del = b.dataset.id; renderParent(); break;
      case 'delno': parentState.del = null; renderParent(); break;
      case 'delyes': G.deleteProfile(b.dataset.id); parentState.del = null; if (G.profile && G.profile.id === b.dataset.id) { G.profile = null; parentBack = null; closeModal(); UI.showTitle(); } else renderParent(); break;
      case 'import':
        try { var p = G.parseImport($('impCode').value); var exists = !!G.store.profiles[p.id]; G.importProfile(p); $('impMsg').textContent = (exists ? 'Updated ' : 'Added ') + p.name + '.'; setTimeout(renderParent, 900); }
        catch (err) { $('impMsg').textContent = 'That code did not work. Copy the whole code and try again.'; }
        break;
      case 'resetpin': G.store.pin = null; G.save(); closeModal(); UI.openParent(parentBack); break;
      case 'titleparent': UI.openParent(function () { if (mode === 'title') UI.showTitle(); }); break;
      case 'play': startGame(G.store.profiles[b.dataset.id], false); break;
      case 'newplayer': draft = { name: '', year: 3, look: { skin: TOL.SKINS[1], hair: 'short', hairColor: TOL.HAIR_COLOURS[1], outfit: TOL.OUTFITS[0] } }; wizard(0); break;
      case 'cancelnew': UI.showTitle(); break;
      case 'wiz': wizard(Number(b.dataset.s)); break;
      case 'pickyear': draft.year = Number(b.dataset.y); wizard(1); break;
      case 'look': draft.look[b.dataset.k] = b.dataset.v; wizard(2); break;
      case 'create': var np = G.newProfile(draft.name, draft.year, draft.look); var tut = b.dataset.tut === '1'; if (!tut) { np.tutorialDone = true; G.save(); } startGame(np, tut); break;
    }
  });

  /* ---------------- keyboard and pointer ---------------- */
  var KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  window.addEventListener('keydown', function (e) {
    if (modalOpen) {
      if (e.key === 'Escape') { if (!Q.active || Q.phase !== 'run') closeModal(); e.preventDefault(); return; }
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (modalKeys && modalKeys(e)) e.preventDefault();
      return;
    }
    if (mode !== 'game') return;
    if (KEYMAP[e.key]) { G.keys[KEYMAP[e.key]] = true; e.preventDefault(); A.init(); return; }
    if (e.key === ' ' || e.key === 'Enter') { if (G.nearDoor) { e.preventDefault(); A.init(); G.interact(G.nearDoor); } return; }
    if (e.key === 'b' || e.key === 'B') { UI.openBackpack(); return; }
    if (e.key === 'p' || e.key === 'P') { A.init(); G.petPet(); return; }
    if (e.key === 'm' || e.key === 'M') { UI.openMap(); return; }
    if (e.key === 'Escape') UI.openMenu();
  });
  window.addEventListener('keyup', function (e) { if (KEYMAP[e.key]) G.keys[KEYMAP[e.key]] = false; });
  window.addEventListener('blur', function () { G.keys = {}; });
  scene.addEventListener('pointerdown', function (e) { if (mode !== 'game' || modalOpen) return; A.init(); G.clickAt(e.clientX, e.clientY); });
  $('bagBtn').addEventListener('click', function () { if (!modalOpen) UI.openBackpack(); });
  $('petBtn').addEventListener('click', function () { A.init(); G.petPet(); });
  $('mapBtn').addEventListener('click', function () { if (!modalOpen) UI.openMap(); });
  $('menuBtn').addEventListener('click', function () { if (!modalOpen) UI.openMenu(); });
  setInterval(function () { if (mode === 'game') G.save(); }, 10000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && mode === 'game') G.save(); });

  /* ---------------- boot ---------------- */
  G.load();
  resize();
  UI.showTitle();
  requestAnimationFrame(loop);
  TOL.debug = { G: G, UI: UI, Q: Q, startGame: startGame };
})();

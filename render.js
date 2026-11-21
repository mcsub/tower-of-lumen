/* The Tower of Lumen – isometric canvas renderer. World units: tiles of 120x60, origin at the floor's back corner. */
(function () {
  var TOL = (window.TOL = window.TOL || {});
  var R = (TOL.render = {});
  var N = (R.N = 8), HW = (R.HW = 60), HH = (R.HH = 30), WALL = 230, DH = 150, DHALF = 0.65;
  R.SLOTS = { L0: ['L', 6.6], L1: ['L', 4.3], L2: ['L', 1.9], R0: ['R', 1.9], R1: ['R', 4.3], R2: ['R', 6.6] };

  R.PALETTES = [
    { wallL: '#8EC9FF', wallR: '#BFE0FF', floorA: '#F6C17A', floorB: '#EDB36A', edge: '#C9813A', edgeR: '#B06F2E', pattern: '#78B4EE', sky: '#7DD3C0', sky2: '#6CC5B1' },
    { wallL: '#F9A8D4', wallR: '#FBCFE8', floorA: '#C7D2FE', floorB: '#B6C2FA', edge: '#818CF8', edgeR: '#6366F1', pattern: '#F27FBD', sky: '#A5F3FC', sky2: '#8DE8F4' },
    { wallL: '#86EFAC', wallR: '#BBF7D0', floorA: '#FDE68A', floorB: '#F8D96E', edge: '#D97706', edgeR: '#B45309', pattern: '#5FE291', sky: '#BAE6FD', sky2: '#A3DBFB' },
    { wallL: '#C4B5FD', wallR: '#DDD6FE', floorA: '#FDBA74', floorB: '#F9A95E', edge: '#C2410C', edgeR: '#9A3412', pattern: '#AE9BFB', sky: '#99F6E4', sky2: '#7FEEDB' },
    { wallL: '#FDE047', wallR: '#FEF08A', floorA: '#A7F3D0', floorB: '#90EAC2', edge: '#059669', edgeR: '#047857', pattern: '#F6D32C', sky: '#C7D2FE', sky2: '#B4C1FC' },
    { wallL: '#67E8F9', wallR: '#A5F3FC', floorA: '#FBCFE8', floorB: '#F6B9DA', edge: '#DB2777', edgeR: '#BE185D', pattern: '#3FDDF3', sky: '#FDE68A', sky2: '#FBDA6A' }
  ];
  var RUGS = ['#A78BFA', '#F472B6', '#34D399', '#60A5FA', '#FB923C', '#F87171'];

  R.rng = function (seed) { var a = seed >>> 0; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  R.w = function (tx, ty) { return [(tx - ty) * HW, (tx + ty) * HH]; };
  R.toTile = function (wx, wy) { var a = wx / HW, b = wy / HH; return [(a + b) / 2, (b - a) / 2]; };
  function wallPt(side, c, h) { return side === 'L' ? [-c * HW, c * HH - h] : [c * HW, c * HH - h]; }
  R.wallPt = wallPt;

  /* ---------- camera ---------- */
  var cam = (R.cam = { s: 1, cx: 0, cy: 0, dpr: 1 });
  R.layout = function (cw, ch, top, bottom, dpr) {
    var availH = Math.max(200, ch - top - bottom);
    var s = Math.min(cw / (cw < 600 ? 900 : 1020), availH / 760);
    cam.s = s; cam.dpr = dpr; cam.cx = cw / 2; cam.cy = top + availH / 2 - 135 * s;
  };
  R.toScreen = function (wx, wy) { return [cam.cx + wx * cam.s, cam.cy + wy * cam.s]; };
  R.toWorld = function (sx, sy) { return [(sx - cam.cx) / cam.s, (sy - cam.cy) / cam.s]; };

  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  R.rrect = rrect;
  function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }

  /* ---------- icons ---------- */
  var ICON_PATHS = {
    plus: 'M7 3v8M3 7h8M14 7h7M3 17h8M15 14l5 5M20 14l-5 5',
    book: 'M2 5c3-1.3 6.5-1.3 10 1 3.5-2.3 7-2.3 10-1v14c-3-1.3-6.5-1.3-10 1-3.5-2.3-7-2.3-10-1z M12 6v14',
    globe: 'M12 2.5a9.5 9.5 0 1 0 0.01 0 M2.5 12h19 M12 2.5c3.5 3.5 3.5 15.5 0 19 M12 2.5c-3.5 3.5-3.5 15.5 0 19',
    puzzle: 'M4 9h4a2.5 2.5 0 1 1 5 0h4v4a2.5 2.5 0 1 1 0 5v3H4v-4a2.5 2.5 0 1 0 0-5z'
  };
  R.ICON_PATHS = ICON_PATHS;
  R.drawIcon = function (ctx, icon, x, y, size, color) {
    ctx.save();
    if (icon === 'Aa') {
      ctx.fillStyle = color; ctx.font = '700 ' + Math.round(size * 0.8) + 'px Fredoka, Nunito, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Aa', x, y + size * 0.04);
    } else if (ICON_PATHS[icon] && window.Path2D) {
      ctx.translate(x - size / 2, y - size / 2); ctx.scale(size / 24, size / 24);
      ctx.strokeStyle = color; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke(new Path2D(ICON_PATHS[icon]));
    }
    ctx.restore();
  };

  /* ---------- room ---------- */
  R.drawRoom = function (ctx, room, game, t) {
    var pal = R.PALETTES[room.palette % R.PALETTES.length];
    var rnd = R.rng(room.seed);
    ctx.save();
    ctx.setTransform(cam.s * cam.dpr, 0, 0, cam.s * cam.dpr, cam.cx * cam.dpr, cam.cy * cam.dpr);

    // floor slab
    var top = R.w(0, 0), right = R.w(N, 0), bottom = R.w(N, N), left = R.w(0, N);
    poly(ctx, [left, bottom, [bottom[0], bottom[1] + 22], [left[0], left[1] + 22]], pal.edge);
    poly(ctx, [bottom, right, [right[0], right[1] + 22], [bottom[0], bottom[1] + 22]], pal.edgeR);
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      poly(ctx, [R.w(i, j), R.w(i + 1, j), R.w(i + 1, j + 1), R.w(i, j + 1)], (i + j) % 2 ? pal.floorA : pal.floorB);
    }
    // rug
    var rugCol = RUGS[room.seed % RUGS.length];
    poly(ctx, [R.w(2.5, 2.5), R.w(5.5, 2.5), R.w(5.5, 5.5), R.w(2.5, 5.5)], rugCol);
    ctx.setLineDash([10, 8]);
    poly(ctx, [R.w(2.8, 2.8), R.w(5.2, 2.8), R.w(5.2, 5.2), R.w(2.8, 5.2)], null, 'rgba(255,255,255,0.75)', 3);
    ctx.setLineDash([]);

    // walls
    var lw = [left, top, [top[0], top[1] - WALL], [left[0], left[1] - WALL]];
    var rw = [top, right, [right[0], right[1] - WALL], [top[0], top[1] - WALL]];
    poly(ctx, lw, pal.wallL); poly(ctx, rw, pal.wallR);
    // wallpaper dots
    ctx.fillStyle = pal.pattern;
    for (var c = 0.5; c < N; c += 0.75) for (var h = 30; h < WALL - 10; h += 38) {
      var off = (Math.round(c / 0.75) % 2) * 19;
      var p = wallPt('L', c, h + off); ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 7); ctx.fill();
      var q = wallPt('R', c, h + off); ctx.beginPath(); ctx.arc(q[0], q[1], 3.2, 0, 7); ctx.fill();
    }
    // wall caps
    poly(ctx, [[left[0], left[1] - WALL], [top[0], top[1] - WALL], [top[0] + 10, top[1] - WALL + 5], [left[0] + 10, left[1] - WALL + 5]], '#FFFFFF');
    poly(ctx, [[top[0], top[1] - WALL], [right[0], right[1] - WALL], [right[0] - 10, right[1] - WALL + 5], [top[0] - 10, top[1] - WALL + 5]], '#FFFFFF');
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(top[0], top[1] - WALL); ctx.stroke();
    // skirting
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(left[0], left[1]); ctx.lineTo(top[0], top[1]); ctx.lineTo(right[0], right[1]); ctx.stroke();

    // bunting
    var bcol = ['#F43F5E', '#FACC15', '#22C55E', '#3B82F6', '#F97316', '#A855F7'];
    for (var b = 0; b < 10; b++) {
      var side = b < 5 ? 'L' : 'R', cc = 0.7 + (b % 5) * 1.6;
      var a1 = wallPt(side, cc, WALL - 14), a2 = wallPt(side, cc + 0.6, WALL - 14), a3 = wallPt(side, cc + 0.3, WALL - 52);
      poly(ctx, [a1, a2, a3], bcol[(b + room.seed) % bcol.length]);
    }

    // wall decor between the door slots
    [['L', 3.1], ['R', 3.1], ['L', 5.45], ['R', 5.45], ['L', 0.55], ['R', 0.55]].forEach(function (spot, k) {
      var kind = Math.floor(rnd() * 4);
      if (spot[1] < 1) kind = 3;
      drawWallDecor(ctx, spot[0], spot[1], kind, pal, t, k);
    });

    // doors
    room.doors.forEach(function (d) { drawDoor(ctx, d, game, t); });

    ctx.restore();
  };

  function drawWallDecor(ctx, side, c, kind, pal, t, k) {
    if (kind === 0 || kind === 1) { // window with sky
      var a = wallPt(side, c - 0.36, 70), b = wallPt(side, c + 0.36, 70), b2 = wallPt(side, c + 0.36, 175), a2 = wallPt(side, c - 0.36, 175);
      poly(ctx, [a, b, b2, a2], '#FFFFFF');
      var ia = wallPt(side, c - 0.3, 76), ib = wallPt(side, c + 0.3, 76), ib2 = wallPt(side, c + 0.3, 169), ia2 = wallPt(side, c - 0.3, 169);
      poly(ctx, [ia, ib, ib2, ia2], '#BAE6FD');
      var cl = wallPt(side, c - 0.05, 140); circle(ctx, cl[0], cl[1], 12, '#FFFFFF'); circle(ctx, cl[0] + 12, cl[1] + 2, 9, '#FFFFFF');
      var m1 = wallPt(side, c, 76), m2 = wallPt(side, c, 169);
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(m1[0], m1[1]); ctx.lineTo(m2[0], m2[1]); ctx.stroke();
    } else if (kind === 2) { // framed picture: little map
      var p1 = wallPt(side, c - 0.32, 95), p2 = wallPt(side, c + 0.32, 95), p3 = wallPt(side, c + 0.32, 160), p4 = wallPt(side, c - 0.32, 160);
      poly(ctx, [p1, p2, p3, p4], '#8A4419');
      var q1 = wallPt(side, c - 0.26, 100), q2 = wallPt(side, c + 0.26, 100), q3 = wallPt(side, c + 0.26, 155), q4 = wallPt(side, c - 0.26, 155);
      poly(ctx, [q1, q2, q3, q4], '#FFF4D6');
      var x1 = wallPt(side, c - 0.15, 115), x2 = wallPt(side, c + 0.15, 140);
      ctx.strokeStyle = '#2563EB'; ctx.setLineDash([5, 4]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1[0], x1[1]); ctx.lineTo(x2[0], x2[1]); ctx.stroke(); ctx.setLineDash([]);
      circle(ctx, x2[0], x2[1], 4, '#F43F5E');
    } else { // lantern
      var l = wallPt(side, c, 150);
      ctx.strokeStyle = '#6B7280'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(l[0], l[1] - 30); ctx.lineTo(l[0], l[1] - 12); ctx.stroke();
      var glow = 0.35 + 0.15 * Math.sin(t * 2 + k);
      circle(ctx, l[0], l[1], 22, 'rgba(253,224,71,' + glow + ')');
      rrect(ctx, l[0] - 8, l[1] - 12, 16, 22, 4); ctx.fillStyle = '#FDE047'; ctx.fill();
      ctx.strokeStyle = '#A16207'; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  /* ---------- doors ---------- */
  function doorPath(ctx, side, c, half, height, inset) {
    var a = wallPt(side, c - half, inset), b = wallPt(side, c + half, inset);
    var at = wallPt(side, c - half, height), bt = wallPt(side, c + half, height), mid = wallPt(side, c, height + 48);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(at[0], at[1]);
    ctx.quadraticCurveTo(mid[0], mid[1], bt[0], bt[1]); ctx.lineTo(b[0], b[1]); ctx.closePath();
  }
  R.doorPoly = function (d) {
    var s = R.SLOTS[d.slot], side = s[0], c = s[1];
    return [wallPt(side, c - DHALF, -6), wallPt(side, c + DHALF, -6), wallPt(side, c + DHALF, DH + 70), wallPt(side, c - DHALF, DH + 70)];
  };
  R.doorApproach = function (d) {
    var s = R.SLOTS[d.slot];
    return s[0] === 'L' ? [0.75, s[1]] : [s[1], 0.75];
  };

  function drawDoor(ctx, d, game, t) {
    var s = R.SLOTS[d.slot], side = s[0], c = s[1];
    var info, frame, body, panel;
    if (d.kind === 'golden') { frame = '#A16207'; body = '#FDE047'; panel = '#FACC15'; }
    else if (d.kind === 'back') { frame = '#7C3AED'; body = '#EDE9FE'; panel = '#DDD6FE'; }
    else { info = TOL.BRANCH_INFO[d.branch]; frame = info.frame; body = info.body; panel = info.panel; }
    var near = game && game.nearDoor === d;

    if (near || d.kind === 'golden') {
      ctx.save(); doorPath(ctx, side, c, DHALF + 0.06, DH + 6, -4);
      ctx.strokeStyle = d.kind === 'golden' ? 'rgba(253,224,71,' + (0.55 + 0.3 * Math.sin(t * 4)) + ')' : 'rgba(253,224,71,0.85)';
      ctx.lineWidth = 16; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
    }
    doorPath(ctx, side, c, DHALF, DH, 0); ctx.fillStyle = frame; ctx.fill();
    doorPath(ctx, side, c, DHALF - 0.1, DH - 10, 0);
    var open = d.state === 'open' || d.kind === 'back';
    ctx.fillStyle = open ? '#FFF7C2' : body; ctx.fill();

    if (open) {
      ctx.save(); doorPath(ctx, side, c, DHALF - 0.1, DH - 10, 0); ctx.clip();
      var sun = wallPt(side, c + 0.15, 95); circle(ctx, sun[0], sun[1], 26, '#FFE066');
      for (var st = 0; st < 4; st++) {
        var s1 = wallPt(side, c - 0.25 + st * 0.16, st * 16), s2 = wallPt(side, c + 0.55, st * 16), s3 = wallPt(side, c + 0.55, st * 16 + 16), s4 = wallPt(side, c - 0.25 + st * 0.16, st * 16 + 16);
        poly(ctx, [s1, s2, s3, s4], st % 2 ? '#FBBF24' : '#F59E0B');
      }
      ctx.restore();
      if (d.kind !== 'back') { // swung-open leaf
        var h1 = wallPt(side, c - DHALF + 0.1, 0), h2 = wallPt(side, c - DHALF + 0.1, DH - 30);
        var dir = side === 'L' ? [26, 14] : [26, -14];
        poly(ctx, [h1, h2, [h2[0] + dir[0] * (side === 'L' ? 1 : -1) * -1, h2[1] + 20], [h1[0] + dir[0] * (side === 'L' ? 1 : -1) * -1, h1[1] + 20]], body, frame, 3);
      }
      // light spill
      var f1 = R.w.apply(null, side === 'L' ? [0, c - DHALF] : [c - DHALF, 0]), f2 = R.w.apply(null, side === 'L' ? [0, c + DHALF] : [c + DHALF, 0]);
      var f3 = R.w.apply(null, side === 'L' ? [1.1, c + DHALF] : [c + DHALF, 1.1]), f4 = R.w.apply(null, side === 'L' ? [1.1, c - DHALF] : [c - DHALF, 1.1]);
      poly(ctx, [f1, f2, f3, f4], 'rgba(255,243,176,0.55)');
    } else {
      // panels
      var pa = [wallPt(side, c - 0.42, 20), wallPt(side, c + 0.42, 20), wallPt(side, c + 0.42, 62), wallPt(side, c - 0.42, 62)];
      var pb = [wallPt(side, c - 0.42, 74), wallPt(side, c + 0.42, 74), wallPt(side, c + 0.42, 118), wallPt(side, c - 0.42, 118)];
      poly(ctx, pa, panel); poly(ctx, pb, panel);
      var knob = wallPt(side, c + 0.45, 70); circle(ctx, knob[0], knob[1], 6, '#FDE047');
      if (d.kind === 'golden') {
        var gs = wallPt(side, c, 95);
        drawStar(ctx, gs[0], gs[1], 22, '#FFFFFF');
        for (var sp = 0; sp < 5; sp++) {
          var ang = t * 1.5 + sp * 1.25, rr = 55 + 10 * Math.sin(t * 3 + sp);
          drawStar(ctx, gs[0] + Math.cos(ang) * rr * 0.7, gs[1] + Math.sin(ang) * rr * 0.6, 6, 'rgba(255,255,255,0.9)');
        }
      } else {
        var lk = wallPt(side, c, 86);
        circle(ctx, lk[0], lk[1], 19, '#FFFFFF');
        ctx.strokeStyle = frame; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lk[0], lk[1] - 4, 6, Math.PI, 0); ctx.stroke();
        rrect(ctx, lk[0] - 9, lk[1] - 3, 18, 13, 3); ctx.fillStyle = frame; ctx.fill();
        // progress dots: 2 answers open a door
        for (var pd = 0; pd < 2; pd++) {
          var dp = wallPt(side, c - 0.14 + pd * 0.28, 125);
          circle(ctx, dp[0], dp[1], 7, '#FFFFFF');
          if ((d.progress || 0) > pd) circle(ctx, dp[0], dp[1], 5, '#22C55E');
        }
      }
    }

    // sign above the door, drawn on the wall's slant
    var label, labelBg, icon;
    if (d.kind === 'golden') { label = 'GOLDEN DOOR'; labelBg = '#A16207'; icon = null; }
    else if (d.kind === 'back') { label = 'BACK'; labelBg = '#6D28D9'; icon = null; }
    else { label = info.short; labelBg = info.label; icon = info.icon; }
    var sc = wallPt(side, c, DH + 72);
    ctx.save();
    ctx.translate(sc[0], sc[1]);
    ctx.transform(1, side === 'L' ? -0.5 : 0.5, 0, 1, 0, 0);
    ctx.font = '600 15px Fredoka, Nunito, sans-serif';
    var tw = ctx.measureText(label).width, w = tw + (icon ? 44 : 24), hgt = 30;
    rrect(ctx, -w / 2, -hgt / 2, w, hgt, 9); ctx.fillStyle = labelBg; ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    if (icon) {
      circle(ctx, -w / 2 + 16, 0, 11, '#FFFFFF');
      R.drawIcon(ctx, icon, -w / 2 + 16, 0, 15, labelBg);
      ctx.fillStyle = '#FFFFFF'; ctx.fillText(label, -w / 2 + 32, 1);
    } else { ctx.textAlign = 'center'; ctx.fillText(label, 0, 1); }
    if (d.kind === 'bonus') {
      drawStar(ctx, w / 2 - 2, -hgt / 2 - 2, 11, '#FACC15');
      ctx.font = '800 9px Nunito, sans-serif'; ctx.fillStyle = '#713F12'; ctx.textAlign = 'center';
      rrect(ctx, w / 2 - 50, -hgt / 2 - 22, 42, 16, 8); ctx.fillStyle = '#FDE047'; ctx.fill();
      ctx.fillStyle = '#713F12'; ctx.fillText('BONUS', w / 2 - 29, -hgt / 2 - 13);
    }
    ctx.restore();

    if (d.state === 'open' && d.kind !== 'back' && d.kind !== 'golden') {
      var ok = wallPt(side, c + DHALF, DH - 10);
      circle(ctx, ok[0], ok[1], 14, '#16A34A');
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(ok[0] - 6, ok[1]); ctx.lineTo(ok[0] - 1, ok[1] + 5); ctx.lineTo(ok[0] + 7, ok[1] - 5); ctx.stroke();
    }
    if (near) {
      var ar = wallPt(side, c, DH + 112 + 6 * Math.sin(t * 5));
      poly(ctx, [[ar[0] - 12, ar[1] - 14], [ar[0] + 12, ar[1] - 14], [ar[0], ar[1]]], '#FDE047', '#A16207', 2);
    }
  }

  function drawStar(ctx, x, y, r, fill) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  R.drawStar = drawStar;

  /* ---------- props ---------- */
  R.drawProp = function (ctx, kind, x, y, t) {
    if (kind === 'plant') {
      ctx.fillStyle = 'rgba(31,42,68,0.15)'; ctx.beginPath(); ctx.ellipse(x, y, 24, 10, 0, 0, 7); ctx.fill();
      poly(ctx, [[x - 18, y - 30], [x + 18, y - 30], [x + 13, y], [x - 13, y]], '#EA580C');
      ctx.fillStyle = '#16A34A';
      [[-14, -58, 12], [0, -72, 14], [14, -56, 12], [-4, -48, 11], [8, -45, 10]].forEach(function (l) { ctx.beginPath(); ctx.ellipse(x + l[0], y + l[1], l[2] * 0.7, l[2], l[0] / 30, 0, 7); ctx.fill(); });
    } else if (kind === 'lamp') {
      ctx.fillStyle = 'rgba(31,42,68,0.15)'; ctx.beginPath(); ctx.ellipse(x, y, 18, 8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.fillRect(x - 3, y - 92, 6, 92);
      circle(ctx, x, y - 104, 30, 'rgba(253,224,71,' + (0.3 + 0.1 * Math.sin(t * 2)) + ')');
      poly(ctx, [[x - 20, y - 92], [x + 20, y - 92], [x + 12, y - 118], [x - 12, y - 118]], '#F472B6');
    } else if (kind === 'crate') {
      poly(ctx, [[x - 30, y - 15], [x, y - 30], [x + 30, y - 15], [x, y]], '#D97706');
      poly(ctx, [[x - 30, y - 15], [x, y], [x, y + 32], [x - 30, y + 17]], '#B45309');
      poly(ctx, [[x, y], [x + 30, y - 15], [x + 30, y + 17], [x, y + 32]], '#92400E');
    } else if (kind === 'books') {
      var cols = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B'];
      for (var i = 0; i < 4; i++) { rrect(ctx, x - 22, y - 12 - i * 11, 44 - i * 4, 11, 3); ctx.fillStyle = cols[i]; ctx.fill(); }
    } else if (kind === 'globe') {
      ctx.fillStyle = '#8A4419'; ctx.fillRect(x - 3, y - 30, 6, 30); ctx.fillRect(x - 14, y - 4, 28, 6);
      circle(ctx, x, y - 52, 24, '#38BDF8');
      ctx.fillStyle = '#22C55E'; ctx.beginPath(); ctx.ellipse(x - 7, y - 58, 9, 6, 0.5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + 9, y - 45, 7, 5, -0.3, 0, 7); ctx.fill();
    }
  };

  /* ---------- characters ---------- */
  R.drawCharacter = function (ctx, x, y, look, equip, opts) {
    opts = opts || {};
    var t = opts.t || 0, walking = !!opts.walking, sc = opts.scale || 1, face = opts.facing || 1;
    look = look || {}; equip = equip || {};
    var skin = look.skin || TOL.SKINS[0], hairC = look.hairColor || TOL.HAIR_COLOURS[1], outfit = look.outfit || TOL.OUTFITS[0], style = look.hair || 'short';
    var swing = walking ? Math.sin(t * 12) * 7 : 0, bob = walking ? Math.abs(Math.sin(t * 12)) * 3 : Math.sin(t * 2) * 1.2;
    var it = TOL.ITEMS;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc * face, sc);
    if (!opts.noShadow) { ctx.fillStyle = 'rgba(31,42,68,0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, 26, 9, 0, 0, 7); ctx.fill(); }
    ctx.translate(0, -bob);
    // cape
    if (equip.cape) { poly(ctx, [[-16, -78], [16, -78], [24, -22], [-24, -22]], it[equip.cape].color); }
    // legs and shoes
    var shoe = equip.shoes ? it[equip.shoes].color : '#E11D48';
    rrect(ctx, -12, -36 + 0, 9, 32, 4); ctx.fillStyle = '#2B2D6E';
    ctx.save(); ctx.translate(-7, -36); ctx.rotate(swing * 0.03); rrect(ctx, -5, 0, 10, 32, 5); ctx.fillStyle = '#2B2D6E'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 32, 9, 5, 0, 0, 7); ctx.fillStyle = shoe; ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(7, -36); ctx.rotate(-swing * 0.03); rrect(ctx, -5, 0, 10, 32, 5); ctx.fillStyle = '#2B2D6E'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 32, 9, 5, 0, 0, 7); ctx.fillStyle = shoe; ctx.fill(); ctx.restore();
    // backpack
    rrect(ctx, -30, -78, 18, 36, 7); ctx.fillStyle = '#F97316'; ctx.fill();
    // body
    rrect(ctx, -20, -84, 40, 52, 15); ctx.fillStyle = outfit; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(-2, -80, 4, 44);
    // arm
    var armA = -0.45 + swing * 0.02, hx = 16 - 33 * Math.sin(armA), hy = -78 + 33 * Math.cos(armA);
    if (equip.hand === 'hand_guitar') drawHandItem(ctx, equip.hand, hx, hy, t);
    ctx.save(); ctx.translate(16, -78); ctx.rotate(armA); rrect(ctx, -5, 0, 10, 32, 5); ctx.fillStyle = outfit; ctx.fill();
    circle(ctx, 0, 33, 6, skin); ctx.restore();
    // hair behind
    ctx.fillStyle = hairC;
    if (style === 'long') { rrect(ctx, -23, -118, 46, 50, 16); ctx.fill(); }
    if (style === 'bunches') { circle(ctx, -24, -104, 10, hairC); circle(ctx, 24, -104, 10, hairC); }
    // head
    circle(ctx, 0, -106, 22, skin);
    // hair front
    ctx.fillStyle = hairC;
    if (style === 'curly') { [-16, -8, 0, 8, 16].forEach(function (cx, i) { circle(ctx, cx, -124 + (i % 2) * 3, 9, hairC); }); }
    else { ctx.beginPath(); ctx.ellipse(0, -118, 23, 14, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-23, -118); ctx.quadraticCurveTo(-8, -108, 4, -116); ctx.quadraticCurveTo(14, -108, 23, -118); ctx.fill(); }
    // face
    circle(ctx, -7, -104, 3, '#1F2A44'); circle(ctx, 8, -104, 3, '#1F2A44');
    circle(ctx, -6, -105, 1, '#FFFFFF'); circle(ctx, 9, -105, 1, '#FFFFFF');
    circle(ctx, -13, -96, 4, 'rgba(253,164,175,0.8)'); circle(ctx, 14, -96, 4, 'rgba(253,164,175,0.8)');
    ctx.strokeStyle = '#1F2A44'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -98, 6, 0.2, Math.PI - 0.2); ctx.stroke();
    // glasses
    if (equip.glasses === 'glasses_round') { ctx.strokeStyle = '#1F2A44'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(-7, -104, 6, 0, 7); ctx.moveTo(14, -104); ctx.arc(8, -104, 6, 0, 7); ctx.moveTo(-1, -104); ctx.lineTo(2, -104); ctx.stroke(); }
    if (equip.glasses === 'glasses_star') { drawStar(ctx, -7, -104, 8, '#F59E0B'); drawStar(ctx, 8, -104, 8, '#F59E0B'); circle(ctx, -7, -104, 2.2, '#1F2A44'); circle(ctx, 8, -104, 2.2, '#1F2A44'); }
    // hats
    var hat = equip.hat;
    if (hat === 'hat_explorer') { ctx.fillStyle = '#8B5E34'; ctx.beginPath(); ctx.ellipse(0, -124, 32, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#A47148'; ctx.beginPath(); ctx.ellipse(0, -128, 19, 15, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#4B2E16'; ctx.fillRect(-19, -130, 38, 4); }
    if (hat === 'hat_wizard') { poly(ctx, [[-24, -122], [24, -122], [4, -170]], '#7C3AED'); drawStar(ctx, 0, -140, 6, '#FDE047'); ctx.fillStyle = '#6D28D9'; ctx.beginPath(); ctx.ellipse(0, -122, 28, 6, 0, 0, 7); ctx.fill(); }
    if (hat === 'hat_flowers') { ['#F472B6', '#FDE047', '#A78BFA', '#FB7185', '#34D399'].forEach(function (c2, i) { circle(ctx, -18 + i * 9, -126 - (i % 2) * 3, 6, c2); circle(ctx, -18 + i * 9, -126 - (i % 2) * 3, 2, '#FFFFFF'); }); }
    if (hat === 'hat_cap') { ctx.fillStyle = '#2563EB'; ctx.beginPath(); ctx.ellipse(0, -122, 22, 14, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(16, -122, 16, 4, 0, 0, 7); ctx.fill(); circle(ctx, 0, -134, 3, '#FDE047'); }
    if (equip.hand && equip.hand !== 'hand_guitar') drawHandItem(ctx, equip.hand, hx, hy, t);
    ctx.restore();
  };

  function drawHandItem(ctx, item, hx, hy, t) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (item === 'hand_wand') {
      ctx.strokeStyle = '#1F2A44'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx - 3, hy + 5); ctx.lineTo(hx + 14, hy - 30); ctx.stroke();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx + 11, hy - 24); ctx.lineTo(hx + 14, hy - 30); ctx.stroke();
      drawStar(ctx, hx + 16, hy - 36, 9, '#FACC15');
      for (var i = 0; i < 3; i++) { var a = t * 3 + i * 2.1; drawStar(ctx, hx + 16 + Math.cos(a) * 16, hy - 36 + Math.sin(a) * 12, 3, '#FDE68A'); }
    } else if (item === 'hand_football') {
      var bx = hx + 4, by = hy + 9; circle(ctx, bx, by, 10, '#FFFFFF'); ctx.strokeStyle = '#1F2A44'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, 10, 0, 7); ctx.stroke();
      ctx.beginPath(); for (var k = 0; k < 5; k++) { var aa = -Math.PI / 2 + k * Math.PI * 2 / 5; ctx.lineTo(bx + Math.cos(aa) * 4, by + Math.sin(aa) * 4); } ctx.closePath(); ctx.fillStyle = '#1F2A44'; ctx.fill();
    } else if (item === 'hand_guitar') {
      ctx.translate(hx - 12, hy + 2); ctx.rotate(-0.7);
      ctx.fillStyle = '#92400E'; ctx.fillRect(-3, -40, 6, 34); ctx.fillStyle = '#1F2A44'; ctx.fillRect(-4, -46, 8, 8);
      ctx.fillStyle = '#EA580C'; ctx.beginPath(); ctx.ellipse(0, 0, 11, 9, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 12, 14, 11, 0, 0, 7); ctx.fill();
      circle(ctx, 0, 4, 4, '#431407');
    } else if (item === 'hand_balloon') {
      var sway = Math.sin(t * 2) * 4;
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + 12, hy - 30, hx + 10 + sway, hy - 60); ctx.stroke();
      ctx.fillStyle = '#F43F5E'; ctx.beginPath(); ctx.ellipse(hx + 10 + sway, hy - 76, 13, 16, 0, 0, 7); ctx.fill();
      circle(ctx, hx + 5 + sway, hy - 82, 4, 'rgba(255,255,255,0.6)');
    } else if (item === 'hand_kite') {
      var kx = hx + 30 + Math.sin(t * 1.5) * 5, ky = hy - 78;
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(kx, ky + 16); ctx.stroke();
      poly(ctx, [[kx, ky - 16], [kx + 12, ky], [kx, ky + 16], [kx - 12, ky]], '#3B82F6');
      poly(ctx, [[kx, ky - 16], [kx + 12, ky], [kx, ky]], '#FACC15');
      ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(kx, ky + 16); for (var q = 1; q < 5; q++) ctx.lineTo(kx + (q % 2 ? 5 : -5), ky + 16 + q * 7); ctx.stroke();
    } else if (item === 'hand_umbrella') {
      var ux = hx - 18, uy = hy - 94;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, hy + 6); ctx.lineTo(ux, uy); ctx.stroke();
      var cols = ['#F43F5E', '#F97316', '#FACC15', '#22C55E', '#3B82F6', '#A855F7'];
      for (var u = 0; u < 6; u++) { ctx.beginPath(); ctx.moveTo(ux, uy); ctx.arc(ux, uy, 40, Math.PI + u * Math.PI / 6, Math.PI + (u + 1) * Math.PI / 6); ctx.closePath(); ctx.fillStyle = cols[u]; ctx.fill(); }
      circle(ctx, ux, uy - 40, 3, '#475569');
    } else if (item === 'hand_magnifier') {
      ctx.strokeStyle = '#92400E'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx - 2, hy + 4); ctx.lineTo(hx + 8, hy - 12); ctx.stroke();
      circle(ctx, hx + 14, hy - 22, 10, 'rgba(186,230,253,0.85)'); ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(hx + 14, hy - 22, 10, 0, 7); ctx.stroke();
    } else if (item === 'hand_teddy') {
      var tx = hx + 4, ty = hy + 8;
      circle(ctx, tx, ty + 6, 9, '#B45309'); circle(ctx, tx, ty - 6, 7, '#B45309'); circle(ctx, tx - 5, ty - 12, 3, '#B45309'); circle(ctx, tx + 5, ty - 12, 3, '#B45309');
      circle(ctx, tx, ty - 4, 3, '#FDE68A'); circle(ctx, tx - 2.5, ty - 7, 1.2, '#1F2A44'); circle(ctx, tx + 2.5, ty - 7, 1.2, '#1F2A44');
    } else if (item === 'hand_lantern') {
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy + 8); ctx.stroke();
      circle(ctx, hx, hy + 18, 16, 'rgba(253,224,71,' + (0.3 + 0.12 * Math.sin(t * 3)) + ')');
      rrect(ctx, hx - 6, hy + 8, 12, 18, 3); ctx.fillStyle = '#FDE047'; ctx.fill(); ctx.strokeStyle = '#A16207'; ctx.stroke();
    }
    ctx.restore();
  }
  R.drawHandItem = drawHandItem;

  R.drawPet = function (ctx, pet, x, y, t, face) {
    ctx.save(); ctx.translate(x, y); ctx.scale(face || 1, 1);
    ctx.fillStyle = 'rgba(31,42,68,0.18)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 6, 0, 0, 7); ctx.fill();
    var hop = Math.abs(Math.sin(t * 6)) * 4;
    if (pet === 'pet_fox') {
      ctx.translate(0, -hop);
      ctx.fillStyle = '#F97316'; ctx.beginPath(); ctx.ellipse(-16, -14, 12, 6, -0.6, 0, 7); ctx.fill(); circle(ctx, -24, -20, 4, '#FFFFFF');
      ctx.beginPath(); ctx.ellipse(0, -12, 14, 10, 0, 0, 7); ctx.fill();
      circle(ctx, 12, -24, 10, '#F97316'); poly(ctx, [[6, -32], [10, -42], [14, -32]], '#F97316'); poly(ctx, [[13, -32], [18, -42], [20, -30]], '#F97316');
      circle(ctx, 20, -22, 4, '#FFFFFF'); circle(ctx, 23, -23, 2, '#1F2A44'); circle(ctx, 14, -26, 1.8, '#1F2A44');
    } else if (pet === 'pet_owl') {
      ctx.translate(0, -18 - Math.sin(t * 3) * 5);
      circle(ctx, 0, -10, 14, '#A16207'); circle(ctx, 0, -6, 9, '#FDE68A');
      circle(ctx, -6, -16, 6, '#FFFFFF'); circle(ctx, 6, -16, 6, '#FFFFFF'); circle(ctx, -6, -16, 3, '#1F2A44'); circle(ctx, 6, -16, 3, '#1F2A44');
      poly(ctx, [[-3, -11], [3, -11], [0, -6]], '#F59E0B');
      var flap = Math.sin(t * 12) * 0.5;
      ctx.fillStyle = '#854D0E'; ctx.beginPath(); ctx.ellipse(-14, -8, 5, 10, 0.4 + flap, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(14, -8, 5, 10, -0.4 - flap, 0, 7); ctx.fill();
    } else if (pet === 'pet_cat') {
      ctx.translate(0, -hop * 0.5);
      ctx.strokeStyle = '#EA580C'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-24, -14, -20, -30 + Math.sin(t * 4) * 3); ctx.stroke();
      ctx.fillStyle = '#FB923C'; ctx.beginPath(); ctx.ellipse(0, -10, 13, 9, 0, 0, 7); ctx.fill();
      circle(ctx, 11, -22, 9, '#FB923C'); poly(ctx, [[5, -28], [6, -38], [11, -30]], '#FB923C'); poly(ctx, [[12, -30], [17, -38], [18, -27]], '#FB923C');
      circle(ctx, 9, -23, 1.8, '#1F2A44'); circle(ctx, 15, -23, 1.8, '#1F2A44'); circle(ctx, 12, -19, 1.5, '#F472B6');
      ctx.strokeStyle = '#1F2A44'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(14, -19); ctx.lineTo(23, -21); ctx.moveTo(14, -18); ctx.lineTo(23, -17); ctx.stroke();
    } else if (pet === 'pet_puppy') {
      ctx.translate(0, -hop * 0.6);
      ctx.strokeStyle = '#A16207'; ctx.lineWidth = 4; ctx.lineCap = 'round'; var wag = Math.sin(t * 14) * 6; ctx.beginPath(); ctx.moveTo(-13, -12); ctx.lineTo(-20, -22 + wag * 0.3); ctx.stroke();
      ctx.fillStyle = '#CA8A04'; ctx.beginPath(); ctx.ellipse(0, -11, 14, 9, 0, 0, 7); ctx.fill();
      circle(ctx, 12, -22, 10, '#CA8A04'); ctx.fillStyle = '#854D0E'; ctx.beginPath(); ctx.ellipse(5, -21, 4, 8, 0.3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(19, -21, 4, 8, -0.3, 0, 7); ctx.fill();
      circle(ctx, 10, -24, 1.8, '#1F2A44'); circle(ctx, 15, -24, 1.8, '#1F2A44'); circle(ctx, 13, -18, 2.5, '#1F2A44');
    } else if (pet === 'pet_penguin') {
      ctx.rotate(Math.sin(t * 6) * 0.12);
      ctx.fillStyle = '#1F2A44'; ctx.beginPath(); ctx.ellipse(0, -16, 11, 16, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(1, -13, 7, 11, 0, 0, 7); ctx.fill();
      circle(ctx, -2, -25, 1.8, '#FFFFFF'); circle(ctx, 4, -25, 1.8, '#FFFFFF'); circle(ctx, -2, -25, 1, '#1F2A44'); circle(ctx, 4, -25, 1, '#1F2A44');
      poly(ctx, [[0, -22], [6, -21], [1, -18]], '#F59E0B'); ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.ellipse(-4, 0, 4, 2, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(5, 0, 4, 2, 0, 0, 7); ctx.fill();
    } else if (pet === 'pet_robodog') {
      ctx.translate(0, -hop * 0.4);
      ctx.fillStyle = '#64748B'; [-9, -3, 4, 10].forEach(function (lx) { ctx.fillRect(lx - 1.5, -6, 3, 6); });
      rrect(ctx, -13, -18, 26, 13, 4); ctx.fillStyle = '#94A3B8'; ctx.fill();
      rrect(ctx, 6, -30, 15, 13, 4); ctx.fillStyle = '#CBD5E1'; ctx.fill();
      rrect(ctx, 8, -27, 11, 5, 2); ctx.fillStyle = '#1E3A8A'; ctx.fill(); circle(ctx, 11, -24.5, 1.4, '#67E8F9'); circle(ctx, 16, -24.5, 1.4, '#67E8F9');
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(13, -30); ctx.lineTo(13, -36); ctx.stroke(); circle(ctx, 13, -37, 2.5, (Math.sin(t * 6) > 0) ? '#F43F5E' : '#FDE047');
      ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-13, -15); ctx.lineTo(-19, -21 + Math.sin(t * 12) * 3); ctx.stroke();
    } else if (pet === 'pet_bunny') {
      ctx.translate(0, -hop * 1.4);
      circle(ctx, -11, -10, 4, '#FFFFFF');
      ctx.fillStyle = '#F8FAFC'; ctx.beginPath(); ctx.ellipse(0, -10, 12, 9, 0, 0, 7); ctx.fill();
      circle(ctx, 10, -20, 8, '#F8FAFC');
      ctx.beginPath(); ctx.ellipse(7, -34, 3, 10, -0.15, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(13, -34, 3, 10, 0.15, 0, 7); ctx.fill();
      ctx.fillStyle = '#F9A8D4'; ctx.beginPath(); ctx.ellipse(7, -34, 1.4, 7, -0.15, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(13, -34, 1.4, 7, 0.15, 0, 7); ctx.fill();
      circle(ctx, 8, -21, 1.6, '#1F2A44'); circle(ctx, 13, -21, 1.6, '#1F2A44'); circle(ctx, 11, -17, 1.4, '#F472B6');
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, -10, 12, 9, 0, 0, 7); ctx.stroke();
    } else if (pet === 'pet_dragon') {
      ctx.translate(0, -14 - Math.sin(t * 2.5) * 6);
      var fl = Math.sin(t * 10) * 0.4;
      ctx.fillStyle = '#5EEAD4'; ctx.beginPath(); ctx.ellipse(-8, -14, 10, 5, -0.8 + fl, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, -16, 10, 5, -1.2 - fl, 0, 7); ctx.fill();
      ctx.fillStyle = '#14B8A6'; ctx.beginPath(); ctx.ellipse(0, -6, 13, 9, 0, 0, 7); ctx.fill();
      circle(ctx, 12, -14, 8, '#14B8A6'); circle(ctx, 15, -16, 2, '#1F2A44');
      poly(ctx, [[-12, -4], [-24, -2], [-12, 0]], '#0D9488');
      poly(ctx, [[8, -21], [10, -27], [13, -21]], '#FDE047');
    }
    ctx.restore();
  };

  R.drawRobot = function (ctx, x, y, color, t, sc) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sc || 1, sc || 1);
    ctx.fillStyle = 'rgba(31,42,68,0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, 24, 8, 0, 0, 7); ctx.fill();
    var b = Math.sin((t || 0) * 3) * 2;
    ctx.translate(0, b);
    rrect(ctx, -14, -34, 28, 30, 7); ctx.fillStyle = '#60A5FA'; ctx.fill();
    rrect(ctx, -22, -76, 44, 40, 12); ctx.fillStyle = color || '#93C5FD'; ctx.fill();
    rrect(ctx, -15, -68, 30, 18, 9); ctx.fillStyle = '#1E3A8A'; ctx.fill();
    circle(ctx, -7, -59, 4, '#67E8F9'); circle(ctx, 7, -59, 4, '#67E8F9');
    ctx.strokeStyle = '#1E3A8A'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -46, 6, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.strokeStyle = '#64748B'; ctx.beginPath(); ctx.moveTo(0, -76); ctx.lineTo(0, -88); ctx.stroke();
    circle(ctx, 0, -90, 5, '#F43F5E');
    rrect(ctx, -28, -62, 6, 14, 3); ctx.fillStyle = '#64748B'; ctx.fill(); rrect(ctx, 22, -62, 6, 14, 3); ctx.fill();
    ctx.restore();
  };

  /* ---------- whole scene ---------- */
  R.drawScene = function (ctx, game, t, W, H) {
    var room = game.room, pal = R.PALETTES[room.palette % R.PALETTES.length];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = pal.sky; ctx.fillRect(0, 0, W, H);
    // soft background clouds
    ctx.fillStyle = pal.sky2;
    for (var i = 0; i < 6; i++) {
      var cx = ((i * 263 + t * 8 * (1 + i % 3)) % (W + 300)) - 150, cy = (H * 0.15) + (i * 97) % (H * 0.7);
      ctx.beginPath(); ctx.arc(cx, cy, 60 + (i % 3) * 25, 0, 7); ctx.arc(cx + 70, cy + 10, 45, 0, 7); ctx.arc(cx - 60, cy + 15, 40, 0, 7); ctx.fill();
    }
    R.drawRoom(ctx, room, game, t);

    ctx.save();
    ctx.setTransform(cam.s * cam.dpr, 0, 0, cam.s * cam.dpr, cam.cx * cam.dpr, cam.cy * cam.dpr);
    // target marker
    if (game.target) {
      var tp = R.w(game.target[0], game.target[1]), pp = R.w(game.player.x, game.player.y);
      ctx.setLineDash([3, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(pp[0], pp[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(tp[0], tp[1], 16, 8, 0, 0, 7); ctx.stroke();
    }
    if (game.tutorialSpot) {
      var ts = R.w(game.tutorialSpot[0], game.tutorialSpot[1]), pulse = 1 + 0.15 * Math.sin(t * 5);
      ctx.fillStyle = 'rgba(253,224,71,0.45)'; ctx.beginPath(); ctx.ellipse(ts[0], ts[1], 46 * pulse, 23 * pulse, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#EAB308'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(ts[0], ts[1], 46 * pulse, 23 * pulse, 0, 0, 7); ctx.stroke();
    }
    // depth-sorted objects
    var objs = [];
    (room.props || []).forEach(function (p) { objs.push({ d: p.x + p.y, f: function () { var w = R.w(p.x, p.y); R.drawProp(ctx, p.kind, w[0], w[1], t); } }); });
    if (game.npc) objs.push({ d: game.npc.x + game.npc.y, f: function () { var w = R.w(game.npc.x, game.npc.y); R.drawRobot(ctx, w[0], w[1], '#93C5FD', t, 1); } });
    var pl = game.player, eq = game.profile.equipped || {};
    if (eq.pet && game.pet) objs.push({ d: game.pet.x + game.pet.y, f: function () { var w = R.w(game.pet.x, game.pet.y); R.drawPet(ctx, eq.pet, w[0], w[1], t, game.pet.face); } });
    objs.push({ d: pl.x + pl.y, f: function () {
      var w = R.w(pl.x, pl.y);
      ctx.strokeStyle = '#22C55E'; ctx.lineWidth = 3.5; ctx.fillStyle = 'rgba(34,197,94,0.22)';
      ctx.beginPath(); ctx.ellipse(w[0], w[1], 32, 15, 0, 0, 7); ctx.fill(); ctx.stroke();
      var jump = 0;
      if (game.celebration) { var ca = t - game.celebration.t0; if (ca < 2.6) jump = -Math.abs(Math.sin(ca * 7)) * 30; }
      R.drawCharacter(ctx, w[0], w[1] + jump, game.profile.look, eq, { t: t, walking: pl.moving, facing: pl.face, noShadow: true });
    } });
    objs.sort(function (a, b) { return a.d - b.d; }).forEach(function (o) { o.f(); });

    // pet reaction: speech bubble and hearts
    if (game.petReact && eq.pet && game.pet) {
      var pa = t - game.petReact.t0;
      if (pa < 2.2) {
        var pw = R.w(game.pet.x, game.pet.y), al = Math.min(1, (2.2 - pa) * 2);
        ctx.globalAlpha = al;
        for (var hk = 0; hk < 4; hk++) {
          var hy = pw[1] - 40 - pa * 55 - hk * 16, hx = pw[0] + (hk - 1.5) * 15 + Math.sin(pa * 5 + hk) * 6;
          drawHeart(ctx, hx, hy, 9 - hk, hk % 2 ? '#FB7185' : '#F43F5E');
        }
        ctx.font = '700 20px Fredoka, Nunito, sans-serif';
        var tw2 = ctx.measureText(game.petReact.text).width, bx = pw[0] + 20, by = pw[1] - 112;
        rrect(ctx, bx - 12, by - 22, tw2 + 24, 36, 14); ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 3; ctx.stroke();
        poly(ctx, [[bx, by + 12], [bx + 14, by + 12], [bx - 4, by + 28]], '#FFFFFF');
        ctx.fillStyle = '#9D174D'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(game.petReact.text, bx, by - 3);
        ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1;
      }
    }
    // celebration flag next to the player
    if (game.celebration) drawFlag(ctx, game, t - game.celebration.t0);

    // floating texts
    (game.floaters || []).forEach(function (f) {
      var w = R.w(f.x, f.y), age = (t - f.t0);
      ctx.globalAlpha = Math.max(0, 1 - age / 1.6);
      ctx.font = '700 26px Fredoka, Nunito, sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 6; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(f.text, w[0], w[1] - 150 - age * 40);
      ctx.fillStyle = f.color || '#A16207'; ctx.fillText(f.text, w[0], w[1] - 150 - age * 40);
      ctx.globalAlpha = 1;
    });
    ctx.restore();

    // dimness: the tower's light comes back as doors open
    if (game.dim > 0.01) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(76,60,150,' + game.dim + ')'; ctx.fillRect(0, 0, W, H); }
    if (game.celebration) drawCelebration(ctx, t - game.celebration.t0, game.celebration.n, W, H);
  };

  function drawHeart(ctx, x, y, r, fill) {
    ctx.beginPath(); ctx.moveTo(x, y + r);
    ctx.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.9, y - r * 1.9, x, y - r * 0.7);
    ctx.bezierCurveTo(x + r * 0.9, y - r * 1.9, x + r * 2, y - r * 0.4, x, y + r);
    ctx.fillStyle = fill; ctx.fill();
  }
  R.drawHeart = drawHeart;

  // A flagpole springs up beside the player and a golden flag races to the top.
  function drawFlag(ctx, game, age) {
    var px = Math.min(R.N - 0.6, game.player.x + 1.1), py = Math.max(0.8, game.player.y - 1.1);
    var b = R.w(px, py), grow = Math.min(1, age / 0.35), H = 360 * grow;
    ctx.fillStyle = 'rgba(31,42,68,0.2)'; ctx.beginPath(); ctx.ellipse(b[0], b[1], 22, 9, 0, 0, 7); ctx.fill();
    rrect(ctx, b[0] - 14, b[1] - 16, 28, 18, 5); ctx.fillStyle = '#16A34A'; ctx.fill();
    ctx.fillStyle = '#E2E8F0'; ctx.fillRect(b[0] - 4, b[1] - H, 8, H);
    ctx.fillStyle = '#94A3B8'; ctx.fillRect(b[0] + 1, b[1] - H, 3, H);
    circle(ctx, b[0], b[1] - H - 8, 11, '#FACC15');
    if (grow < 1) return;
    var rise = Math.min(1, Math.max(0, (age - 0.35) / 1.1)), ease = 1 - Math.pow(1 - rise, 3);
    var fy = b[1] - 40 - ease * (H - 70);
    ctx.beginPath(); ctx.moveTo(b[0] + 4, fy - 34);
    for (var i = 0; i <= 12; i++) { var x = b[0] + 4 + i * 9, w = Math.sin(age * 9 - i * 0.7) * 5 * (i / 12); ctx.lineTo(x, fy - 34 + w); }
    for (var j = 12; j >= 0; j--) { var x2 = b[0] + 4 + j * 9, w2 = Math.sin(age * 9 - j * 0.7) * 5 * (j / 12); ctx.lineTo(x2, fy + 30 + w2); }
    ctx.closePath(); ctx.fillStyle = '#FACC15'; ctx.fill(); ctx.strokeStyle = '#A16207'; ctx.lineWidth = 3; ctx.stroke();
    drawStar(ctx, b[0] + 58, fy - 2 + Math.sin(age * 9 - 6 * 0.7) * 2.5, 15, '#FFFFFF');
  }

  var CONFETTI = ['#F43F5E', '#FACC15', '#22C55E', '#3B82F6', '#A855F7', '#F97316', '#FFFFFF'];
  function drawCelebration(ctx, age, n, W, H) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    var u = Math.min(W, H) / 800;
    // fireworks
    [[0.45, 0.22, 0.25], [0.78, 0.3, 0.27], [0.62, 0.15, 0.3], [0.25, 0.3, 0.28], [0.5, 0.25, 0.24]].forEach(function (fw, k) {
      var tb = 1.4 + k * 0.35, a = age - tb; if (a < 0 || a > 1.3) return;
      var cx = W * fw[0] + (k === 3 ? -W * 0.05 : 0), cy = H * fw[1], r = a * 230 * u * (1 + fw[2]);
      ctx.globalAlpha = Math.max(0, 1 - a / 1.3);
      for (var i = 0; i < 16; i++) {
        var an = i / 16 * Math.PI * 2, x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r + a * a * 40 * u;
        ctx.beginPath(); ctx.arc(x, y, 5 * u + 2, 0, 7); ctx.fillStyle = CONFETTI[(i + k) % 6]; ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    // confetti
    if (age > 1.3) {
      var ca = age - 1.3;
      for (var c = 0; c < 140; c++) {
        var x0 = (c * 137.5) % W, sp = (90 + (c * 53) % 140) * u * 1.4, y = -30 + ca * sp - ((c * 97) % 300) * u;
        if (y < -20 || y > H) continue;
        var x = x0 + Math.sin(ca * 2 + c) * 30 * u;
        ctx.save(); ctx.translate(x, y); ctx.rotate(ca * 3 + c);
        ctx.fillStyle = CONFETTI[c % CONFETTI.length]; ctx.fillRect(-5 * u - 2, -3 * u - 1, 10 * u + 4, 6 * u + 2);
        ctx.restore();
      }
    }
    // big banner
    if (age > 1.2) {
      var pa = Math.min(1, (age - 1.2) / 0.35), sc = 0.6 + 0.4 * (1 - Math.pow(1 - pa, 3)) + (pa >= 1 ? Math.sin(age * 4) * 0.02 : 0);
      var size = Math.round(Math.min(W / 12, 72));
      ctx.translate(W / 2, H * 0.24); ctx.scale(sc, sc); ctx.globalAlpha = pa;
      ctx.font = '700 ' + size + 'px Fredoka, Nunito, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.16; ctx.strokeStyle = '#2B2D6E';
      ctx.strokeText('FLOOR ' + n + ' COMPLETE!', 0, 0); ctx.fillStyle = '#FDE047'; ctx.fillText('FLOOR ' + n + ' COMPLETE!', 0, 0);
      ctx.font = '700 ' + Math.round(size * 0.42) + 'px Fredoka, Nunito, sans-serif'; ctx.lineWidth = size * 0.09;
      ctx.strokeText('The tower glows brighter!', 0, size * 0.85); ctx.fillStyle = '#FFFFFF'; ctx.fillText('The tower glows brighter!', 0, size * 0.85);
    }
    ctx.restore();
  }

  /* ---------- mini-map ---------- */
  R.drawMiniMap = function (ctx, floor, currentId, W, H, dpr) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var rooms = Object.keys(floor.rooms).map(function (k) { return floor.rooms[k]; });
    if (!rooms.length) return;
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    rooms.forEach(function (r) { var sx = (r.mx - r.my), sy = (r.mx + r.my); minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy); });
    var cell = Math.min(22, (W - 30) / Math.max(1, (maxX - minX + 2)), (H - 20) / Math.max(1, (maxY - minY + 2)) * 2);
    var ox = W / 2 - ((minX + maxX) / 2) * cell, oy = H / 2 - ((minY + maxY) / 2) * cell / 2;
    function pos(r) { return [ox + (r.mx - r.my) * cell, oy + (r.mx + r.my) * cell / 2]; }
    ctx.strokeStyle = '#C7D2FE'; ctx.lineWidth = 3;
    rooms.forEach(function (r) { if (r.parent != null && floor.rooms[r.parent]) { var a = pos(r), b = pos(floor.rooms[r.parent]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } });
    rooms.forEach(function (r) {
      var p = pos(r), s = cell * 0.48, cur = r.id === currentId;
      var col = R.PALETTES[r.palette % R.PALETTES.length].wallL;
      poly(ctx, [[p[0], p[1] - s / 2], [p[0] + s, p[1]], [p[0], p[1] + s / 2], [p[0] - s, p[1]]], cur ? '#FDE047' : col, cur ? '#FFFFFF' : null, 2);
      if (floor.golden && floor.golden.roomId === r.id) { ctx.strokeStyle = '#FACC15'; ctx.lineWidth = 3; ctx.stroke(); drawStar(ctx, p[0], p[1] - s, 6, '#FACC15'); }
      var locked = r.doors.filter(function (d) { return d.state === 'locked' && d.kind !== 'golden'; }).length;
      if (locked && !cur) circle(ctx, p[0] + s * 0.7, p[1] - s * 0.4, 3.5, '#FFFFFF');
    });
  };
})();

/* The Tower of Lumen – game state, saving, floors, rooms, doors and movement. */
(function () {
  var TOL = (window.TOL = window.TOL || {});
  var R = TOL.render;
  var G = (TOL.game = {
    store: { profiles: {}, order: [], pin: null, lastId: null },
    profile: null, floor: null, room: null,
    player: { x: 4, y: 4, moving: false, face: 1 }, pet: null, target: null, pendingDoor: null,
    nearDoor: null, floaters: [], dim: 0, npc: null, tutorialSpot: null,
    keys: {}, paused: false, sessionMs: 0, lastBreakAt: 0
  });
  var KEY = 'towerOfLumen.v1';
  var BREAK_MS = 30 * 60 * 1000;
  var UI = function () { return TOL.ui; };

  /* ---------------- saving ---------------- */
  G.load = function () {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) { var s = JSON.parse(raw); if (s && s.profiles) G.store = s; }
    } catch (e) { /* storage unavailable: play without saving */ }
    G.store.order = (G.store.order || []).filter(function (id) { return G.store.profiles[id]; });
  };
  G.save = function () {
    try { window.localStorage.setItem(KEY, JSON.stringify(G.store)); return true; } catch (e) { return false; }
  };
  G.storageWorks = function () { try { window.localStorage.setItem(KEY + '.t', '1'); window.localStorage.removeItem(KEY + '.t'); return true; } catch (e) { return false; } };

  G.newProfile = function (name, year, look) {
    var id = 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    var p = {
      id: id, name: name, year: year, look: look, created: Date.now(),
      equipped: {}, items: [], memories: [], stickers: [], boxesOpened: 0, pendingBoxes: 0,
      hints: 3, score: 0, stars: 0, floor: 1, maxFloor: 1, floors: {}, tutorialDone: false,
      seen: {}, topicStats: {}, playMs: 0, doorsOpened: 0, answered: 0, correct: 0,
      settings: { musicOn: true, musicVol: 0.5, sfxOn: true, sfxVol: 0.7, voiceOn: true, easyFont: false, bigText: false }
    };
    G.store.profiles[id] = p; G.store.order.push(id); G.store.lastId = id; G.save();
    return p;
  };
  G.deleteProfile = function (id) {
    delete G.store.profiles[id];
    G.store.order = G.store.order.filter(function (x) { return x !== id; });
    G.save();
  };

  G.title = function (p) {
    var name = TOL.TITLES[0].name;
    TOL.TITLES.forEach(function (t) { if ((p || G.profile).score >= t.at) name = t.name; });
    return name;
  };
  G.nextTitle = function (p) {
    var s = (p || G.profile).score;
    for (var i = 0; i < TOL.TITLES.length; i++) if (TOL.TITLES[i].at > s) return TOL.TITLES[i];
    return null;
  };

  /* ---------------- floors and rooms ---------------- */
  function doorsPerRoom(year) { return year <= 2 ? 2 : year <= 4 ? 3 : 4; }

  function createFloor(n) {
    var pool = [];
    TOL.BRANCHES.forEach(function (b) { for (var i = 0; i < 3; i++) pool.push({ branch: b, kind: 'req' }); pool.push({ branch: b, kind: 'bonus' }); });
    var opened = {}; TOL.BRANCHES.forEach(function (b) { opened[b] = { req: 0, bonus: 0 }; });
    return { n: n, rooms: {}, nextId: 0, pool: TOL.shuffle(pool), opened: opened, boxGiven: {}, golden: null, goldenStep: 0, goldenCtx: {}, completed: false, start: 0, current: 0 };
  }

  // Every new room offers doors for what is still missing on this floor, so nobody has to walk back to find them.
  function offerDoors(floor, count) {
    var o = floor.opened, picks = [];
    var need = TOL.shuffle(TOL.BRANCHES.filter(function (b) { return o[b].req < 3; }))
      .sort(function (a, b) { return o[a].req - o[b].req; });
    var bonus = TOL.shuffle(TOL.BRANCHES.filter(function (b) { return !o[b].bonus; }));
    need.forEach(function (b) { if (picks.length < count) picks.push({ branch: b, kind: 'req' }); });
    // Now and then swap the last required door for a bonus door, so bonus doors turn up along the way.
    if (picks.length === count && need.length > count && bonus.length && Math.random() < 0.25) {
      var bb = bonus.filter(function (b) { return !picks.some(function (p) { return p.branch === b; }); })[0];
      if (bb) picks[count - 1] = { branch: bb, kind: 'bonus' };
    }
    bonus.forEach(function (b) { if (picks.length < count && !picks.some(function (p) { return p.branch === b; })) picks.push({ branch: b, kind: 'bonus' }); });
    return picks;
  }
  // Doors left behind for a subject that is already finished become bonus or practice doors.
  function refreshStale(floor, room) {
    room.doors.forEach(function (d) {
      if (d.state !== 'locked' || !d.branch || d.kind === 'tut') return;
      var o = floor.opened[d.branch];
      if (d.kind === 'req' && o.req >= 3) d.kind = o.bonus ? 'extra' : 'bonus';
      else if (d.kind === 'bonus' && o.bonus) d.kind = 'extra';
    });
  }
  function addGolden(floor, room) {
    if (room.doors.some(function (d) { return d.kind === 'golden'; })) return;
    var slot = ['R2', 'L2', 'L0'].filter(function (s) { return !room.doors.some(function (d) { return d.slot === s; }); })[0];
    if (!slot) { slot = 'R2'; room.doors = room.doors.filter(function (d) { return d.slot !== 'R2'; }); }
    room.doors.push({ slot: slot, kind: 'golden', state: floor.completed ? 'open' : 'locked', progress: 0, ctx: {} });
  }

  function makeRoom(floor, parentId, viaSlot) {
    var id = floor.nextId++;
    var parent = parentId != null ? floor.rooms[parentId] : null;
    var seed = Math.floor(Math.random() * 1e9);
    var room = { id: id, parent: parentId, seed: seed, palette: (floor.n * 2 + id) % R.PALETTES.length, name: TOL.ROOM_NAMES[(seed >>> 3) % TOL.ROOM_NAMES.length], doors: [], props: [], mx: 0, my: 0 };
    if (parent) {
      var dir = viaSlot && viaSlot[0] === 'L' ? [0, 1] : [1, 0];
      var mx = parent.mx + dir[0], my = parent.my + dir[1];
      var taken = function (x, y) { return Object.keys(floor.rooms).some(function (k) { return floor.rooms[k].mx === x && floor.rooms[k].my === y; }); };
      var tries = 0;
      while (taken(mx, my) && tries < 30) { tries++; var r2 = TOL.pick([[1, 0], [0, 1], [1, -1], [-1, 1]]); mx += r2[0]; my += r2[1]; }
      room.mx = mx; room.my = my;
      room.doors.push({ slot: 'L0', kind: 'back', state: 'open', target: parentId });
    }
    var year = (G.profile && G.profile.year) || 3;
    var slots = parent ? ['L1', 'R0', 'R1', 'L2'] : ['L1', 'R0', 'R1', 'L2'];
    var picks = offerDoors(floor, doorsPerRoom(year));
    picks.forEach(function (p, i) { room.doors.push({ slot: slots[i], branch: p.branch, kind: p.kind, state: 'locked', progress: 0, target: null, ctx: {} }); });
    var rnd = R.rng(seed);
    var spots = TOL.shuffle([[7.35, 2.4], [2.4, 7.35], [7.35, 7.35], [7.35, 5.0], [5.0, 7.35]]);
    var kinds = ['plant', 'lamp', 'crate', 'books', 'globe'];
    var np = 2 + Math.floor(rnd() * 2);
    for (var i = 0; i < np; i++) room.props.push({ kind: kinds[Math.floor(rnd() * kinds.length)], x: spots[i][0], y: spots[i][1] });
    floor.rooms[id] = room;
    return room;
  }

  function tutorialFloor() {
    var f = createFloor(0); f.pool = [];
    var room = { id: 0, parent: null, seed: 4242, palette: 0, name: 'The Waking Room', doors: [
      { slot: 'L1', branch: 'maths', kind: 'tut', state: 'locked', progress: 0, target: null, ctx: {} }
    ], props: [{ kind: 'plant', x: 7.35, y: 2.4 }, { kind: 'lamp', x: 2.4, y: 7.35 }], mx: 0, my: 0 };
    f.rooms[0] = room; f.nextId = 1;
    return f;
  }

  G.floorState = function (n) {
    var p = G.profile;
    if (!p.floors[n]) { var f = createFloor(n); p.floors[n] = f; makeRoom(f, null, null); }
    return p.floors[n];
  };

  G.reqOpened = function (floor) { var t = 0; TOL.BRANCHES.forEach(function (b) { t += Math.min(3, floor.opened[b].req); }); return t; };

  G.enterFloor = function (n, opts) {
    var p = G.profile;
    if (n === 0) { G.floor = tutorialFloor(); G.tutorial = { step: 0 }; }
    else { G.tutorial = null; G.floor = G.floorState(n); p.floor = n; p.maxFloor = Math.max(p.maxFloor || 1, n); }
    var start = (opts && opts.room != null) ? opts.room : (G.floor.current || 0);
    G.enterRoom(start, null);
    if (n === 0) { G.npc = { x: 5.6, y: 2.2 }; G.tutorialSpot = [2.8, 5.6]; UI().coach(0); }
    G.save();
  };

  G.enterRoom = function (id, fromRoomId) {
    var room = G.floor.rooms[id];
    if (G.floor.n > 0) { refreshStale(G.floor, room); if (G.floor.golden) addGolden(G.floor, room); }
    G.room = room; G.floor.current = id; G.target = null; G.pendingDoor = null; G.npc = null; G.floaters = [];
    var spawn = [4.5, 4.5];
    if (fromRoomId != null) {
      var back = room.doors.filter(function (d) { return d.kind === 'back' && d.target === fromRoomId; })[0]
        || room.doors.filter(function (d) { return d.target === fromRoomId; })[0];
      if (back) { var a = R.doorApproach(back); spawn = R.SLOTS[back.slot][0] === 'L' ? [a[0] + 0.7, a[1]] : [a[0], a[1] + 0.7]; }
    }
    G.player.x = spawn[0]; G.player.y = spawn[1]; G.player.moving = false;
    G.pet = { x: spawn[0] + 0.6, y: spawn[1] + 0.6, face: 1 };
    G.updateDim();
    UI().refreshHud(); UI().roomBanner(room);
  };

  G.updateDim = function () {
    if (!G.floor || G.floor.n === 0) { G.dim = 0; return; }
    G.dim = G.floor.completed ? 0 : 0.16 * (1 - G.reqOpened(G.floor) / 15);
  };

  /* ---------------- doors ---------------- */
  G.interact = function (door) {
    if (!door || G.paused) return;
    TOL.audio.sfx('click');
    if (door.kind === 'back') { G.enterRoom(door.target, G.room.id); TOL.audio.sfx('door'); G.save(); return; }
    if (door.kind === 'golden') {
      if (G.floor.completed) { G.floorUp(); return; }
      UI().openGolden(); return;
    }
    if (door.state === 'open') {
      if (door.kind === 'tut') { G.finishTutorial(); return; }
      if (door.target == null) { var nr = makeRoom(G.floor, G.room.id, door.slot); door.target = nr.id; }
      TOL.audio.sfx('door');
      G.enterRoom(door.target, G.room.id); G.save(); return;
    }
    UI().openDoor(door);
  };

  G.markSeen = function (q) { if (q.id) G.profile.seen[q.id] = 1; };
  G.recordAnswer = function (q, ok) {
    var p = G.profile, st = p.topicStats[q.topic] || (p.topicStats[q.topic] = { right: 0, wrong: 0, branch: q.branch });
    if (ok) { st.right++; p.correct++; } else st.wrong++;
    p.answered++;
    if (q.spellWord) {
      var ss = p.spellStats || (p.spellStats = {}), k = q.spellWord.toLowerCase(), w = ss[k] || (ss[k] = { right: 0, wrong: 0 });
      if (ok) w.right++; else w.wrong++;
      w.last = ok;
    }
  };

  /* Weekly spellings: one list for the household (both children are in the same year). */
  G.parseSpellings = function (text) {
    var out = [];
    String(text || '').split(/[\n,;]+/).forEach(function (w) {
      w = w.trim().replace(/\s+/g, ' ');
      if (w && /^[A-Za-z' -]{1,24}$/.test(w) && out.map(function (x) { return x.toLowerCase(); }).indexOf(w.toLowerCase()) < 0) out.push(w);
    });
    return out.slice(0, 20);
  };
  G.setSpellings = function (words) {
    var old = G.store.spellings, carry = [];
    if (old) {
      // Keep up to 3 of last week's words that a child still finds tricky.
      (old.words || []).concat(old.carry || []).forEach(function (w) {
        if (words.some(function (x) { return x.toLowerCase() === w.toLowerCase(); }) || carry.length >= 3) return;
        var tricky = G.store.order.some(function (id) {
          var st = (G.store.profiles[id].spellStats || {})[w.toLowerCase()];
          return st && (st.last === false || st.wrong > st.right);
        });
        if (tricky) carry.push(w);
      });
    }
    G.store.spellings = words.length ? { words: words, carry: carry, setAt: Date.now() } : null;
    G.save();
  };
  G.spellStatus = function (p, w) {
    var st = (p.spellStats || {})[w.toLowerCase()];
    if (!st) return 'new';
    if (st.right >= 2 && st.last !== false) return 'secure';
    return 'practising';
  };
  G.addStars = function (n) { G.profile.stars += n; };

  // Called by the question window when one question is finished (correct, or shown after 3 tries).
  G.questionFinished = function (door, solved, stars) {
    if (stars) G.addStars(stars);
    if (solved) door.progress = (door.progress || 0) + 1;
    if (door.progress >= 2) { G.openDoor(door); return true; }
    G.save(); UI().refreshHud();
    return false;
  };

  G.openDoor = function (door) {
    var p = G.profile, f = G.floor;
    door.state = 'open';
    TOL.audio.sfx('door');
    var a = R.doorApproach(door);
    if (door.kind === 'tut') { G.floaters.push({ text: 'Door open!', x: a[0], y: a[1], t0: TOL.now(), color: '#15803D' }); UI().coach(2); G.save(); return; }
    var o = f.opened[door.branch];
    if (door.kind === 'req' && o.req >= 3) door.kind = o.bonus ? 'extra' : 'bonus';
    if (door.kind === 'bonus' && o.bonus) door.kind = 'extra';
    var pts = door.kind === 'bonus' ? 150 : door.kind === 'extra' ? 50 : 100;
    var before = G.title();
    p.score += pts; p.doorsOpened++;
    if (door.kind !== 'extra') o[door.kind]++;
    refreshStale(f, G.room);
    G.floaters.push({ text: '+' + pts, x: a[0], y: a[1], t0: TOL.now() });
    G.updateDim();
    // branch finished: mystery box
    if (door.kind === 'req' && f.opened[door.branch].req >= 3 && !f.boxGiven[door.branch]) {
      f.boxGiven[door.branch] = true; p.pendingBoxes++;
      UI().boxEarned(TOL.BRANCH_INFO[door.branch].name + ' doors complete!');
    }
    var after = G.title();
    if (after !== before) G.titleUp(after);
    G.checkGolden();
    G.save(); UI().refreshHud();
  };

  G.titleUp = function (name) {
    var t = TOL.TITLES.filter(function (x) { return x.name === name; })[0];
    if (t && t.item && G.profile.items.indexOf(t.item) < 0) G.profile.items.push(t.item);
    UI().toast('New title: ' + name + '!' + (t && t.item ? ' You earned the ' + TOL.ITEMS[t.item].name + '.' : ''), 'gold');
  };

  G.checkGolden = function () {
    var f = G.floor;
    if (f.golden || f.n === 0) return;
    var all = TOL.BRANCHES.every(function (b) { return f.opened[b].req >= 3; });
    if (!all) return;
    var room = G.room;
    addGolden(f, room);
    f.golden = { roomId: room.id };
    TOL.audio.sfx('golden');
    UI().goldenAppeared();
  };

  G.goldenFinished = function () {
    var p = G.profile, f = G.floor;
    f.completed = true;
    Object.keys(f.rooms).forEach(function (k) { f.rooms[k].doors.forEach(function (d) { if (d.kind === 'golden') d.state = 'open'; }); });
    p.score += 300; p.pendingBoxes++; p.hints += 1;
    G.updateDim();
    G.save(); UI().refreshHud();
    // Floor-complete celebration: flag rises, fireworks and a fanfare, then the summary.
    G.celebration = { t0: TOL.now(), n: f.n };
    UI().celebrate();
    G.paused = true; G.keys = {}; G.target = null;
    TOL.audio.sfx('fanfare');
    setTimeout(function () { UI().levelUp(f.n); }, 3400);
  };

  G.floorUp = function () {
    var n = G.floor.n + 1, first = !G.profile.floors[n];
    G.enterFloor(n);
    if (first) { G.profile.hints += 1; UI().toast('Welcome to Floor ' + n + '! You found a free hint on the stairs.', 'blue'); }
    else UI().toast('Back on Floor ' + n + '.', 'blue');
    G.save(); UI().refreshHud();
  };

  G.finishTutorial = function () {
    G.profile.tutorialDone = true;
    G.tutorial = null; G.tutorialSpot = null;
    UI().coach(-1);
    G.enterFloor(G.profile.floor || 1);
  };

  /* ---------------- mystery boxes ---------------- */
  G.openBox = function () {
    var p = G.profile;
    if (p.pendingBoxes <= 0) return null;
    p.pendingBoxes--;
    var r = TOL.REWARD_ORDER[p.boxesOpened] || { hints: 2 };
    // If this item or memory is already owned, or the list has moved on, give the earliest reward this player has missed.
    var owned = function (x) { return (x.item && p.items.indexOf(x.item) >= 0) || (x.memory != null && p.memories.indexOf(x.memory) >= 0); };
    if (owned(r) || r.hints) {
      var upto = Math.min(TOL.REWARD_ORDER.length, p.boxesOpened + 1);
      for (var i = 0; i < upto; i++) { var c = TOL.REWARD_ORDER[i]; if (!c.hints && !owned(c)) { r = c; break; } }
    }
    var res = { kind: null };
    if (r.item) { p.items.push(r.item); res.kind = 'item'; res.item = r.item; }
    else if (r.memory != null) { if (p.memories.indexOf(r.memory) < 0) p.memories.push(r.memory); res.kind = 'memory'; res.memory = r.memory; }
    else { p.hints += r.hints; res.kind = 'hints'; res.hints = r.hints; }
    var sticker = TOL.STICKERS[p.boxesOpened % TOL.STICKERS.length];
    if (p.stickers.indexOf(sticker.id) < 0) p.stickers.push(sticker.id);
    res.sticker = sticker;
    p.boxesOpened++;
    G.save(); UI().refreshHud();
    return res;
  };

  G.equip = function (itemId) {
    var p = G.profile, slot = TOL.ITEMS[itemId].slot;
    p.equipped[slot] = p.equipped[slot] === itemId ? null : itemId;
    G.save();
  };

  /* ---------------- movement and update loop ---------------- */
  var MIN = 0.55, MAX = R.N - 0.4, SPEED = 3.4;
  G.setTargetTile = function (tx, ty, door) {
    G.target = [Math.max(MIN, Math.min(MAX, tx)), Math.max(MIN, Math.min(MAX, ty))];
    G.pendingDoor = door || null;
  };

  G.update = function (dt) {
    if (!G.room || !G.profile) return;
    var pl = G.player, dx = 0, dy = 0, k = G.keys;
    if (!G.paused) {
      if (k.up) { dx -= 1; dy -= 1; } if (k.down) { dx += 1; dy += 1; }
      if (k.left) { dx -= 1; dy += 1; } if (k.right) { dx += 1; dy -= 1; }
      if (dx || dy) { G.target = null; G.pendingDoor = null; }
      else if (G.target) {
        dx = G.target[0] - pl.x; dy = G.target[1] - pl.y;
        var dist = Math.hypot(dx, dy);
        if (dist < 0.08) {
          G.target = null; dx = dy = 0;
          if (G.pendingDoor) { var d = G.pendingDoor; G.pendingDoor = null; G.interact(d); }
        }
      }
    }
    if (dx || dy) {
      var len = Math.hypot(dx, dy), step = Math.min(SPEED * dt, G.target ? len : 1e9);
      pl.x = Math.max(MIN, Math.min(MAX, pl.x + dx / len * step));
      pl.y = Math.max(MIN, Math.min(MAX, pl.y + dy / len * step));
      pl.moving = true;
      var sx = (dx - dy); if (Math.abs(sx) > 0.01) pl.face = sx > 0 ? 1 : -1;
    } else pl.moving = false;

    // pet follows
    if (G.pet) {
      var px = pl.x + 0.55 * -pl.face * 0.7, py = pl.y + 0.55;
      var ddx = px - G.pet.x, ddy = py - G.pet.y, dd = Math.hypot(ddx, ddy);
      if (dd > 0.15) { var s2 = Math.min(dd, (SPEED + 0.6) * dt); G.pet.x += ddx / dd * s2; G.pet.y += ddy / dd * s2; var fx = ddx - ddy; if (Math.abs(fx) > 0.02) G.pet.face = fx > 0 ? 1 : -1; }
    }

    // nearest door
    var best = null, bd = 1.15;
    G.room.doors.forEach(function (d) { var a = R.doorApproach(d), dist2 = Math.hypot(a[0] - pl.x, a[1] - pl.y); if (dist2 < bd) { bd = dist2; best = d; } });
    if (best !== G.nearDoor) { G.nearDoor = best; UI().nearDoorChanged(best); }

    // tutorial: reach the glowing spot
    if (G.tutorial && G.tutorial.step === 0 && G.tutorialSpot && Math.hypot(pl.x - G.tutorialSpot[0], pl.y - G.tutorialSpot[1]) < 0.7) {
      G.tutorialSpot = null; G.tutorial.step = 1; UI().coach(1);
    }

    // floaters expire
    var now = TOL.now();
    G.floaters = G.floaters.filter(function (f) { return now - f.t0 < 1.6; });

    // play time and break reminder
    if (!G.paused && document.visibilityState !== 'hidden') {
      G.profile.playMs += dt * 1000; G.sessionMs += dt * 1000;
      if (G.sessionMs - G.lastBreakAt >= BREAK_MS) { G.lastBreakAt = G.sessionMs; UI().breakReminder(); }
    }
  };

  G.doorAtScreen = function (sx, sy) {
    var w = R.toWorld(sx, sy), hit = null;
    G.room.doors.forEach(function (d) { if (pointInPoly(w, R.doorPoly(d))) hit = d; });
    return hit;
  };
  function pointInPoly(p, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  /* ---------------- pets ---------------- */
  var PET_LINES = {
    pet_fox: [['Yip yip!', 'yip'], ['That tickles!', 'yip'], ['Hee hee!', 'yip']],
    pet_owl: [['Hoo hoo!', 'hoot'], ['Hoo-ray!', 'hoot'], ['Twit-twoo!', 'hoot']],
    pet_dragon: [['Rawr!', 'rawr'], ['Purrrr...', 'purr'], ['Puff puff!', 'rawr']],
    pet_cat: [['Meow!', 'meow'], ['Purrrr...', 'purr'], ['Mrrow?', 'meow']],
    pet_puppy: [['Woof woof!', 'woof'], ['*wags tail*', 'woof'], ['Arf!', 'woof']],
    pet_penguin: [['Squawk!', 'squawk'], ['Waddle waddle!', 'squawk'], ['Peep peep!', 'squawk']],
    pet_robodog: [['Beep-woof!', 'beep'], ['Boop boop!', 'beep'], ['Wag mode: ON', 'beep']],
    pet_bunny: [['*nose wiggle*', 'nibble'], ['Hop hop!', 'nibble'], ['Thump thump!', 'nibble']]
  };
  G.petPet = function () {
    var pet = G.profile && G.profile.equipped && G.profile.equipped.pet;
    if (!pet || !G.pet || G.paused) return false;
    var line = TOL.pick(PET_LINES[pet] || [['Hello!', 'yip']]);
    G.petReact = { t0: TOL.now(), text: line[0] };
    TOL.audio.sfx(line[1]);
    G.profile.pets = (G.profile.pets || 0) + 1;
    return true;
  };

  G.clickAt = function (sx, sy) {
    if (G.paused) return;
    if (G.profile.equipped && G.profile.equipped.pet && G.pet) {
      var pw = R.w(G.pet.x, G.pet.y), ps = R.toScreen(pw[0], pw[1] - 20);
      if (Math.hypot(sx - ps[0], sy - ps[1]) < Math.max(34, 60 * R.cam.s)) { G.petPet(); return; }
    }
    var door = G.doorAtScreen(sx, sy);
    if (door) {
      var a = R.doorApproach(door);
      if (Math.hypot(a[0] - G.player.x, a[1] - G.player.y) < 0.4) { G.interact(door); return; }
      G.setTargetTile(a[0], a[1], door); return;
    }
    var w = R.toWorld(sx, sy), t = R.toTile(w[0], w[1]);
    if (t[0] < -0.5 || t[1] < -0.5 || t[0] > R.N + 0.5 || t[1] > R.N + 0.5) return;
    G.setTargetTile(t[0], t[1], null);
  };

  /* ---------------- export / import ---------------- */
  G.exportProfile = function (id) {
    var p = G.store.profiles[id];
    var json = JSON.stringify({ app: 'tower-of-lumen', v: 1, profile: p });
    return 'TOL1:' + btoa(unescape(encodeURIComponent(json)));
  };
  G.parseImport = function (text) {
    text = (text || '').trim();
    if (text.indexOf('TOL1:') === 0) text = decodeURIComponent(escape(atob(text.slice(5))));
    var data = JSON.parse(text);
    if (!data || data.app !== 'tower-of-lumen' || !data.profile || !data.profile.id) throw new Error('not a save');
    return data.profile;
  };
  G.importProfile = function (p) {
    if (!G.store.profiles[p.id]) G.store.order.push(p.id);
    G.store.profiles[p.id] = p; G.save();
  };
})();

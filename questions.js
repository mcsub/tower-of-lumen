/* The Tower of Lumen – question generators and picker (Year 3). */
(function () {
  var TOL = (window.TOL = window.TOL || {});

  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  TOL.ri = ri; TOL.pick = pick; TOL.shuffle = shuffle;

  /* School terms (the school's Year 3 plan). 0 Autumn 1, 1 Autumn 2, 2 Spring 1, 3 Spring 2, 4 Summer 1, 5 Summer 2.
     Topics from later terms stay hidden until that term. A parent can override the term in Parent view. */
  TOL.TERMS = ['Autumn 1', 'Autumn 2', 'Spring 1', 'Spring 2', 'Summer 1', 'Summer 2'];
  TOL.termFromDate = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    if (m >= 9 && m <= 10) return (m === 10 && day >= 25) ? 1 : 0;
    if (m >= 11) return 1;
    if (m === 1 || (m === 2 && day < 15)) return 2;
    if (m === 2 || m === 3) return 3;
    if (m === 4 || m === 5) return 4;
    return 5;
  };
  TOL.currentTerm = function () {
    var st = TOL.game && TOL.game.store, o = st && st.term;
    if (o != null && o !== 'auto' && !isNaN(Number(o))) return Number(o);
    return TOL.termFromDate();
  };

  // Difficulty level = the floor number. Each floor up widens ranges and adds harder puzzle shapes.
  var LVL = 1;
  function tableB() { return LVL <= 2 ? ri(2, 10) : LVL === 3 ? ri(2, 12) : ri(4, 12); }

  // Turn a question whose correct option is first into a shuffled one.
  function mc(q, options) {
    var idx = options.map(function (_, i) { return i; });
    var order = shuffle(idx);
    q.type = q.type || 'mc';
    q.options = order.map(function (i) { return options[i]; });
    q.answerIndex = order.indexOf(0);
    return q;
  }
  TOL.mc = mc;

  function uniqueNums(correct, cands) {
    var out = [correct];
    cands.forEach(function (c) { if (out.indexOf(c) < 0 && c >= 0) out.push(c); });
    var k = 1;
    while (out.length < 4) { var c = correct + k * (k % 2 ? 1 : -1) * 10; if (out.indexOf(c) < 0 && c >= 0) out.push(c); k++; }
    return out.slice(0, 4);
  }

  /* ---------------- Maths (Year 3, Autumn order) ---------------- */
  var MATHS = {
    pv_value: { topic: 'Place value', gen: function () {
      var n, h, t, o;
      do { h = ri(1, 9); t = ri(1, 9); o = ri(1, 9); } while (h === t || t === o || h === o);
      n = h * 100 + t * 10 + o;
      var pos = pick(['h', 't', 'o']);
      var d = pos === 'h' ? h : pos === 't' ? t : o;
      var val = pos === 'h' ? d * 100 : pos === 't' ? d * 10 : d;
      var cands = [d, d * 10, d * 100, d * 1000].filter(function (x) { return x !== val; });
      return mc({ topic: 'Place value', prompt: 'What is the value of the ' + d + ' in ' + n + '?',
        hint: 'Find the ' + d + ' in the place value chart. Is it in the hundreds, tens or ones?',
        visual: { kind: 'pv', n: n },
        explain: 'The ' + d + ' is in the ' + (pos === 'h' ? 'hundreds' : pos === 't' ? 'tens' : 'ones') + ' column, so it is worth ' + val + '.' },
        uniqueNums(val, cands).map(String));
    } },
    pv_partition: { topic: 'Place value', gen: function () {
      var h = ri(1, 9), t = ri(0, 9), o = ri(0, 9), n = h * 100 + t * 10 + o;
      var parts = [h * 100]; if (t) parts.push(t * 10); if (o) parts.push(o);
      return { type: 'input', topic: 'Place value', prompt: parts.join(' + ') + ' = ?', answer: n,
        hint: 'Put ' + h + ' in the hundreds, ' + t + ' in the tens and ' + o + ' in the ones.', visual: { kind: 'pv', n: n },
        explain: parts.join(' + ') + ' makes ' + n + ': ' + h + ' hundreds, ' + t + ' tens and ' + o + ' ones.' };
    } },
    pv_more_less: { topic: 'Place value', gen: function () {
      var step = pick([10, 100]), more = Math.random() < 0.5, n;
      do { n = ri(110, 889); } while (!more && n - step < 100);
      var ans = more ? n + step : n - step;
      return { type: 'input', topic: 'Place value', prompt: 'What is ' + step + ' ' + (more ? 'more' : 'less') + ' than ' + n + '?', answer: ans,
        hint: 'Only the ' + (step === 10 ? 'tens' : 'hundreds') + ' digit changes. Make it 1 ' + (more ? 'bigger' : 'smaller') + '.', visual: { kind: 'pv', n: n },
        explain: step + ' ' + (more ? 'more' : 'less') + ' than ' + n + ' is ' + ans + '. The ' + (step === 10 ? 'tens' : 'hundreds') + ' digit went ' + (more ? 'up' : 'down') + ' by 1.' };
    } },
    pv_compare: { topic: 'Place value', gen: function () {
      var a, b;
      do { a = ri(100, 999); var s = String(a).split(''); b = Number(shuffle(s).join('')); } while (b === a || b < 100);
      if (Math.random() < 0.5) {
        var big = Math.max(a, b), small = Math.min(a, b);
        return mc({ topic: 'Place value', prompt: 'Which number is greater: ' + a + ' or ' + b + '?',
          hint: 'Compare the hundreds first. If they are the same, compare the tens.', visual: { kind: 'pv', n: big },
          explain: big + ' is greater than ' + small + '.' }, [String(big), String(small)]);
      }
      var sym = a > b ? '>' : '<';
      return mc({ topic: 'Place value', prompt: 'Which sign goes in the gap?   ' + a + '  ___  ' + b,
        hint: 'The open mouth of the sign always faces the bigger number.',
        explain: a + ' ' + sym + ' ' + b + ', because ' + Math.max(a, b) + ' is the bigger number.' }, [sym, sym === '>' ? '<' : '>', '=']);
    } },
    pv_order: { topic: 'Place value', gen: function () {
      var nums = [];
      while (nums.length < 4) { var n = ri(100, 999); if (nums.indexOf(n) < 0) nums.push(n); }
      var sorted = nums.slice().sort(function (x, y) { return x - y; });
      return { type: 'build', topic: 'Place value', prompt: 'Put these numbers in order, smallest first.',
        tiles: shuffle(nums.map(String)), answer: sorted.map(String), slots: 4,
        hint: 'Look at the hundreds digit first. The smallest hundreds digit comes first.',
        explain: 'In order from smallest: ' + sorted.join(', ') + '.' };
    } },
    add_ones: { topic: 'Adding and subtracting', gen: function () { var k = ri(3, 9), n = ri(101, 989 - k); return addsub(n, k, '+'); } },
    add_tens: { topic: 'Adding and subtracting', gen: function () { var k = ri(1, 8) * 10, n = ri(101, 989 - k); return addsub(n, k, '+'); } },
    sub_ones: { topic: 'Adding and subtracting', gen: function () { var k = ri(3, 9), n = ri(110, 999); return addsub(n, k, '-'); } },
    sub_tens: { topic: 'Adding and subtracting', gen: function () { var k = ri(1, 8) * 10, n = ri(110 + k, 999); return addsub(n, k, '-'); } },
    add_hundreds: { topic: 'Adding and subtracting', gen: function () { var k = ri(1, 6) * 100, n = ri(101, 999 - k); return addsub(n, k, '+'); } },
    sub_hundreds: { topic: 'Adding and subtracting', gen: function () { var k = ri(1, 6) * 100, n = ri(100 + k, 999); return addsub(n, k, '-'); } },
    add_col: { topic: 'Column addition and subtraction', gen: function () {
      var a, b;
      if (LVL <= 2) { // no carrying yet
        var h1 = ri(1, 6), h2 = ri(1, 9 - h1), t1 = ri(0, 8), t2 = ri(0, 9 - t1), o1 = ri(0, 8), o2 = ri(1, 9 - o1);
        a = h1 * 100 + t1 * 10 + o1; b = h2 * 100 + t2 * 10 + o2;
      } else { a = ri(150, 599); b = ri(120, 380); }
      return { type: 'input', topic: 'Column addition and subtraction', prompt: a + ' + ' + b + ' = ?', answer: a + b,
        hint: 'Add the ones first, then the tens, then the hundreds. Carry if a column makes 10 or more.', visual: { kind: 'column', a: a, b: b, op: '+' },
        explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
    } },
    sub_col: { topic: 'Column addition and subtraction', gen: function () {
      var a, b;
      if (LVL <= 2) { // no exchanging yet
        var h = ri(3, 9), t = ri(1, 9), o = ri(1, 9);
        a = h * 100 + t * 10 + o; b = ri(1, h - 1) * 100 + ri(0, t) * 10 + ri(0, o);
      } else { a = ri(350, 999); b = ri(110, a - 100); }
      return { type: 'input', topic: 'Column addition and subtraction', prompt: a + ' − ' + b + ' = ?', answer: a - b,
        hint: 'Subtract the ones first, then the tens, then the hundreds. Exchange if the top digit is smaller.', visual: { kind: 'column', a: a, b: b, op: '−' },
        explain: a + ' − ' + b + ' = ' + (a - b) + '. Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.' };
    } },
    times3: { term: 1, topic: '3 times table', gen: function () { return times(3); } },
    times4: { term: 1, topic: '4 and 8 times tables', gen: function () { return times(4); } },
    times8: { term: 1, topic: '4 and 8 times tables', gen: function () { return times(8); } },
    times_review: { topic: '2, 5 and 10 times tables', gen: function () { return times(pick([2, 5, 10])); } },
    missing_add: { topic: 'Missing numbers', gen: function () {
      var a = ri(110, 450), b = ri(110, 450), tot = a + b;
      if (Math.random() < 0.5) return { type: 'input', topic: 'Missing numbers', prompt: '___ + ' + b + ' = ' + tot, answer: a,
        hint: 'Use the opposite: ' + tot + ' − ' + b + '.', visual: { kind: 'column', a: tot, b: b, op: '−' }, explain: tot + ' − ' + b + ' = ' + a + ', so ' + a + ' + ' + b + ' = ' + tot + '.' };
      return { type: 'input', topic: 'Missing numbers', prompt: tot + ' − ___ = ' + b, answer: a,
        hint: 'What do you take away from ' + tot + ' to leave ' + b + '? Work out ' + tot + ' − ' + b + '.', visual: { kind: 'column', a: tot, b: b, op: '−' }, explain: tot + ' − ' + a + ' = ' + b + '.' };
    } },
    two_step: { topic: 'Word problems', gen: function () {
      var a = ri(200, 500), b = ri(30, 150), c = ri(20, 150), ans = a - b + c;
      var t = pick([
        'Captain Cog had ' + a + ' cogs. He used ' + b + ' to fix a clock, then found ' + c + ' more. How many cogs does he have now?',
        'The library had ' + a + ' books. Children borrowed ' + b + ', then the robots brought ' + c + ' new ones. How many books are there now?',
        'Nell grew ' + a + ' strawberries. The birds ate ' + b + ', then ' + c + ' more ripened. How many strawberries are there now?']);
      return { type: 'input', topic: 'Word problems', prompt: t, answer: ans,
        hint: 'Two steps! First take away: ' + a + ' − ' + b + '. Then add ' + c + '.', explain: a + ' − ' + b + ' = ' + (a - b) + ', then ' + (a - b) + ' + ' + c + ' = ' + ans + '.' };
    } },
    times6: { term: 1, topic: '6 times table', gen: function () { return times(6); } },
    div6: { term: 1, topic: 'Division', gen: function () { return divide(6); } },
    mult_2d1d: { term: 1, topic: '2-digit × 1-digit', gen: function () {
      var a = LVL <= 3 ? pick([2, 3, 4, 5]) : pick([3, 4, 6, 8]), b = ri(11, LVL <= 3 ? 25 : 32), t = Math.floor(b / 10) * 10, o = b % 10;
      return { type: 'input', topic: '2-digit × 1-digit', prompt: b + ' × ' + a + ' = ?', answer: a * b,
        hint: 'Split ' + b + ' into ' + t + ' and ' + o + '. Work out ' + t + ' × ' + a + ' and ' + o + ' × ' + a + ', then add them.',
        explain: t + ' × ' + a + ' = ' + (t * a) + ' and ' + o + ' × ' + a + ' = ' + (o * a) + '. ' + (t * a) + ' + ' + (o * a) + ' = ' + (a * b) + '.' };
    } },
    div3: { term: 1, topic: 'Division', gen: function () { return divide(3); } },
    div4: { term: 1, topic: 'Division', gen: function () { return divide(4); } },
    div8: { term: 1, topic: 'Division', gen: function () { return divide(8); } },
    missing_mult: { term: 1, topic: '4 and 8 times tables', gen: function () {
      var a = pick([3, 4, 6, 8]), b = tableB(), p = a * b;
      return { type: 'input', topic: a === 6 ? '6 times table' : a === 3 ? '3 times table' : '4 and 8 times tables', prompt: '___ × ' + a + ' = ' + p, answer: b,
        hint: 'How many ' + a + 's make ' + p + '? Count in ' + a + 's.', visual: { kind: 'groups', groups: b, each: a },
        explain: b + ' × ' + a + ' = ' + p + ', so the missing number is ' + b + '.' };
    } },
    word_add: { topic: 'Word problems', gen: function () {
      var a = ri(120, 450), b = ri(30, 300);
      var t = pick([
        ['The library has ' + a + ' books about space and ' + b + ' books about animals. How many books is that altogether?', 'books'],
        ['Captain Cog polished ' + a + ' cogs on Monday and ' + b + ' cogs on Tuesday. How many cogs did he polish?', 'cogs'],
        ['There are ' + a + ' steps to the Star Gallery and ' + b + ' more steps to the roof. How many steps is that in total?', 'steps']]);
      return { type: 'input', topic: 'Word problems', prompt: t[0], answer: a + b, hint: 'The word "altogether" or "total" means add: ' + a + ' + ' + b + '.',
        visual: { kind: 'column', a: a, b: b, op: '+' }, explain: a + ' + ' + b + ' = ' + (a + b) + ' ' + t[1] + '.' };
    } },
    word_sub: { topic: 'Word problems', gen: function () {
      var a = ri(150, 600), b = ri(20, a - 100);
      var t = pick([
        ['There were ' + a + ' lanterns glowing. ' + b + ' went out. How many are still glowing?', 'lanterns'],
        ['Nell planted ' + a + ' seeds. The birds ate ' + b + ' of them. How many seeds are left?', 'seeds']]);
      return { type: 'input', topic: 'Word problems', prompt: t[0], answer: a - b, hint: 'Some went away, so subtract: ' + a + ' − ' + b + '.',
        visual: { kind: 'column', a: a, b: b, op: '−' }, explain: a + ' − ' + b + ' = ' + (a - b) + ' ' + t[1] + '.' };
    } },
    word_mult: { term: 1, topic: 'Word problems', gen: function () {
      var a = pick([3, 4, 6, 8]), b = ri(2, 10);
      var t = pick([
        ['There are ' + b + ' boxes with ' + a + ' crayons in each box. How many crayons are there?', 'crayons'],
        ['Each robot has ' + a + ' wheels. How many wheels do ' + b + ' robots have?', 'wheels']]);
      return { type: 'input', topic: 'Word problems', prompt: t[0], answer: a * b, hint: b + ' groups of ' + a + ' means ' + b + ' × ' + a + '.',
        visual: { kind: 'groups', groups: b, each: a }, explain: b + ' × ' + a + ' = ' + (a * b) + ' ' + t[1] + '.' };
    } },
    word_div: { term: 1, topic: 'Word problems', gen: function () {
      var a = pick([3, 4, 6, 8]), b = ri(2, 10), p = a * b;
      return { type: 'input', topic: 'Word problems', prompt: p + ' stickers are shared equally between ' + a + ' children. How many stickers does each child get?', answer: b,
        hint: 'Share ' + p + ' into ' + a + ' equal groups: ' + p + ' ÷ ' + a + '.', visual: { kind: 'groups', groups: a, each: b },
        explain: p + ' ÷ ' + a + ' = ' + b + ' stickers each.' };
    } }
  };

  function addsub(n, k, op) {
    var ans = op === '+' ? n + k : n - k;
    var stepName = k >= 100 ? 'hundreds' : k >= 10 ? 'tens' : 'ones';
    var step = k >= 100 ? 100 : k >= 10 ? 10 : 1;
    return { type: 'input', topic: 'Adding and subtracting', prompt: n + ' ' + (op === '+' ? '+' : '−') + ' ' + k + ' = ?', answer: ans,
      hint: 'Count ' + (op === '+' ? 'on' : 'back') + ' ' + (k / step) + ' ' + stepName + ' from ' + n + '.',
      visual: { kind: 'line', from: n, step: op === '+' ? step : -step, count: k / step },
      explain: n + ' ' + (op === '+' ? '+' : '−') + ' ' + k + ' = ' + ans + '.' };
  }
  function times(a) {
    var b = tableB(), p = a * b, flip = Math.random() < 0.5;
    var topic = a === 3 ? '3 times table' : a === 6 ? '6 times table' : (a === 4 || a === 8) ? '4 and 8 times tables' : '2, 5 and 10 times tables';
    var prompt = flip ? b + ' × ' + a + ' = ?' : a + ' × ' + b + ' = ?';
    var extra = (b === 2) ? ' That is the same as ' + a + ' + ' + a + '.' : '';
    return { type: 'input', topic: topic, prompt: prompt, answer: p,
      hint: 'Count in ' + a + 's, ' + b + ' times.', visual: { kind: 'groups', groups: b, each: a },
      explain: a + ' × ' + b + ' = ' + p + '.' + extra };
  }
  function divide(a) {
    var b = tableB(), p = a * b;
    return { type: 'input', topic: 'Division', prompt: p + ' ÷ ' + a + ' = ?', answer: b,
      hint: 'How many ' + a + 's make ' + p + '? Count in ' + a + 's until you reach ' + p + '.', visual: { kind: 'groups', groups: b, each: a },
      explain: p + ' ÷ ' + a + ' = ' + b + ', because ' + b + ' × ' + a + ' = ' + p + '.' };
  }

  // Which maths topics belong to which floor (Autumn wing order).
  var MATHS_FLOORS = {
    1: ['pv_value', 'pv_partition', 'pv_more_less', 'pv_compare', 'pv_order', 'add_ones', 'add_tens', 'sub_ones', 'sub_tens'],
    2: ['add_hundreds', 'sub_hundreds', 'add_col', 'sub_col', 'word_add', 'word_sub', 'times_review', 'times3', 'div3'],
    3: ['times4', 'times8', 'times6', 'div4', 'div8', 'div6', 'missing_mult', 'mult_2d1d', 'word_mult', 'word_div', 'times3'],
    4: ['missing_add', 'two_step'] // only from Floor 4 upwards
  };

  /* ---------------- Logic ---------------- */
  var SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
  var SHAPE_COLOURS = { circle: '#F43F5E', square: '#3B82F6', triangle: '#22C55E', star: '#F59E0B', heart: '#EC4899', diamond: '#8B5CF6' };
  TOL.SHAPE_COLOURS = SHAPE_COLOURS;
  var UNITS = [[0, 1], [0, 1, 2], [0, 0, 1], [0, 1, 1], [0, 1, 2, 2]];

  var ODD = [
    [['carrot', 'apple', 'banana', 'pear'], 'The others are fruits.'],
    [['tulip', 'cat', 'dog', 'rabbit'], 'The others are animals.'],
    [['spoon', 'triangle', 'square', 'circle'], 'The others are shapes.'],
    [['7', '2', '4', '8'], 'The others are even numbers.'],
    [['table', 'red', 'blue', 'green'], 'The others are colours.'],
    [['March', 'Monday', 'Friday', 'Sunday'], 'The others are days of the week. March is a month.'],
    [['14', '6', '9', '12'], 'The others are in the 3 times table.'],
    [['30', '8', '16', '24'], 'The others are in the 8 times table.'],
    [['July', 'spring', 'summer', 'winter'], 'The others are seasons. July is a month.'],
    [['bat', 'robin', 'sparrow', 'owl'], 'The others are birds. A bat is a mammal.'],
    [['45', '30', '50', '70'], 'The others are multiples of 10.'],
    [['Paris', 'London', 'Cardiff', 'Edinburgh'], 'The others are capital cities in the UK.'],
    [['hexagon', 'cube', 'sphere', 'cylinder'], 'The others are 3D shapes. A hexagon is flat.'],
    [['21', '4', '12', '20'], 'The others are in the 4 times table.']
  ];

  // Push-the-crate mazes. R robot, C crate, * star, # wall, . floor.
  TOL.MAZES = [
    ['###.*', 'RC...', '#####'],
    ['R.C..', '###.#', '###*#'],
    ['R#*', '.#.', 'C..', '..#'],
    ['#.#*', '#C..', 'R.##'],
    ['R.C...', '####.#', '#..C.#', '##*###'],
    ['R.C..', '###.#', '..C..', '#*###']
  ];

  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  TOL.DIRS = DIRS;

  function genDebug() {
    for (var tries = 0; tries < 200; tries++) {
      var size = 5, len = LVL <= 1 ? ri(3, 4) : LVL === 2 ? ri(4, 5) : LVL <= 4 ? ri(5, 6) : ri(6, 7);
      var x = ri(0, 4), y = ri(0, 4), start = [x, y], prog = [], ok = true, visited = {};
      visited[x + ',' + y] = 1;
      for (var i = 0; i < len; i++) {
        var opts = Object.keys(DIRS).filter(function (d) {
          var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          return nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[nx + ',' + ny];
        });
        if (!opts.length) { ok = false; break; }
        var d = pick(opts); prog.push(d); x += DIRS[d][0]; y += DIRS[d][1]; visited[x + ',' + y] = 1;
      }
      if (!ok) continue;
      var star = [x, y];
      var k = ri(0, len - 1);
      var wrongs = Object.keys(DIRS).filter(function (d) { return d !== prog[k]; });
      var w = pick(wrongs);
      var bad = prog.slice(); bad[k] = w;
      if (endOf(start, bad)[0] === star[0] && endOf(start, bad)[1] === star[1]) continue;
      // Only changing step k can fix it.
      var unique = true;
      for (var j = 0; j < len && unique; j++) {
        if (j === k) continue;
        Object.keys(DIRS).forEach(function (dd) {
          if (dd === bad[j]) return;
          var t = bad.slice(); t[j] = dd; var e = endOf(start, t);
          if (e[0] === star[0] && e[1] === star[1]) unique = false;
        });
      }
      if (!unique) continue;
      var opts2 = bad.map(function (_, i2) { return 'Step ' + (i2 + 1); });
      var q = { type: 'debug', topic: 'Debugging', prompt: 'Gizmo\'s robot should reach the star, but one arrow is wrong. Which step is the bug?',
        grid: { size: size, start: start, star: star, program: bad },
        hint: 'Trace the robot one step at a time with your finger. Where does it first go the wrong way?',
        explain: 'Step ' + (k + 1) + ' should be ' + arrowWord(prog[k]) + ', not ' + arrowWord(w) + '.' };
      q.options = opts2; q.answerIndex = k;
      return q;
    }
    return genPatternNumbers();
  }
  function endOf(start, prog) { var x = start[0], y = start[1]; prog.forEach(function (d) { x += DIRS[d][0]; y += DIRS[d][1]; }); return [x, y]; }
  function arrowWord(d) { return { up: 'up', down: 'down', left: 'left', right: 'right' }[d]; }

  function genProgram() {
    for (var tries = 0; tries < 300; tries++) {
      var size = 5, walls = {};
      var nw = ri(2, 4) + (LVL >= 3 ? 2 : 0) + (LVL >= 5 ? 1 : 0), minL = LVL <= 1 ? 3 : LVL === 2 ? 4 : LVL <= 4 ? 5 : 6, maxL = minL + 1;
      for (var i = 0; i < nw; i++) walls[ri(0, 4) + ',' + ri(0, 4)] = 1;
      var s = [ri(0, 4), ri(0, 4)], g = [ri(0, 4), ri(0, 4)];
      if (walls[s.join(',')] || walls[g.join(',')]) continue;
      var path = bfsGrid(size, walls, s, g);
      if (!path || path.length < minL || path.length > maxL) continue;
      var straight = Math.abs(s[0] - g[0]) + Math.abs(s[1] - g[1]);
      if (straight === path.length && nw && path.every(function (d) { return d === path[0]; })) continue;
      return { type: 'program', topic: 'Algorithms', prompt: 'Put the arrows in order so the robot reaches the star without bumping into a wall.',
        grid: { size: size, start: s, star: g, walls: Object.keys(walls) },
        tiles: shuffle(path), slots: path.length, answer: path,
        hint: 'The first arrow should be: ' + arrowWord(path[0]) + '.',
        explain: 'One way that works: ' + path.map(arrowWord).join(', ') + '.' };
    }
    return genPatternNumbers();
  }
  function bfsGrid(size, walls, s, g) {
    var q = [[s[0], s[1], []]], seen = {}; seen[s.join(',')] = 1;
    while (q.length) {
      var c = q.shift();
      if (c[0] === g[0] && c[1] === g[1]) return c[2];
      for (var d in DIRS) {
        var nx = c[0] + DIRS[d][0], ny = c[1] + DIRS[d][1], key = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size || walls[key] || seen[key]) continue;
        seen[key] = 1; q.push([nx, ny, c[2].concat([d])]);
      }
    }
    return null;
  }
  TOL.bfsGrid = bfsGrid;

  function genPatternShapes(forGolden) {
    var unit = pick(UNITS.slice(0, LVL <= 1 ? 2 : LVL === 2 ? 4 : 5)), shapes = shuffle(SHAPES).slice(0, 3);
    var seq = []; for (var i = 0; i < 9; i++) seq.push('shape:' + shapes[unit[i % unit.length]]);
    var showN = ri(5, 7);
    if (forGolden || Math.random() < 0.55) {
      var shown = seq.slice(0, showN), ans = seq[showN];
      var others = SHAPES.map(function (s) { return 'shape:' + s; }).filter(function (s) { return s !== ans; });
      var q = mc({ topic: 'Patterns', prompt: 'What comes next in the pattern?', sequence: shown.concat(['?']),
        hint: 'Find the part that repeats. Say the shapes out loud.', explain: 'The pattern repeats, so next comes the ' + ans.slice(6) + '.' },
        [ans].concat(shuffle(others).slice(0, 3)));
      q.optionKind = 'token';
      return q;
    }
    var need = seq.slice(showN, showN + 2);
    var extras = shuffle(SHAPES.map(function (s) { return 'shape:' + s; }).filter(function (s) { return need.indexOf(s) < 0; })).slice(0, 2);
    return { type: 'build', topic: 'Patterns', prompt: 'Drag the shapes to finish the pattern.', sequence: seq.slice(0, showN).concat(['_', '_']),
      tiles: shuffle(need.concat(extras)), slots: 2, answer: need,
      hint: 'Find the part that repeats, then carry it on.', explain: 'The next two are the ' + need[0].slice(6) + ' and the ' + need[1].slice(6) + '.' };
  }
  function genPatternNumbers() {
    var step = pick(LVL <= 1 ? [2, 5, 10, 3, 100] : LVL === 2 ? [3, 4, 50, 100, -3, 10] : LVL <= 4 ? [4, 8, 50, -4, -3, 100, 8] : [6, 8, 25, 50, -6, -8, -25, 100]), start;
    if (step > 0) start = step >= 50 ? ri(1, 9) * 50 : ri(0, 30);
    else start = ri(40, 80);
    var seq = []; for (var i = 0; i < 6; i++) seq.push(start + step * i);
    var missing = Math.random() < 0.5 ? 5 : ri(1, 4);
    var shown = seq.map(function (n, i2) { return i2 === missing ? '?' : String(n); });
    return { type: 'input', topic: 'Number patterns', prompt: 'What is the missing number?', sequence: shown, answer: seq[missing],
      hint: 'Find the difference between two numbers next to each other. The pattern goes ' + (step > 0 ? 'up' : 'down') + ' by the same amount each time.',
      explain: 'The pattern goes ' + (step > 0 ? 'up' : 'down') + ' by ' + Math.abs(step) + ' each time, so the missing number is ' + seq[missing] + '.' };
  }
  function genOdd(profile) {
    var idx = pickUnseenIndex(profile, 'o', ODD.length);
    var item = ODD[idx];
    var q = mc({ id: 'o' + idx, topic: 'Odd one out', prompt: 'Which one is the odd one out?', hint: 'Three of them belong to the same group.',
      explain: '"' + item[0][0] + '" is the odd one out. ' + item[1] }, item[0]);
    return q;
  }
  function genMaze(profile) {
    var pool = LVL <= 1 ? [0, 1, 2] : LVL === 2 ? [1, 2, 3, 4] : [2, 3, 4, 5];
    var seen = profile.seen || {}, unseen = pool.filter(function (i) { return !seen['m' + i]; });
    if (!unseen.length) { pool.forEach(function (i) { delete seen['m' + i]; }); unseen = pool; }
    var idx = pick(unseen);
    return { id: 'm' + idx, type: 'maze', topic: 'Maze puzzles', prompt: 'Help the robot reach the star! Push the crates out of the way.',
      maze: TOL.MAZES[idx], hint: 'Watch the glowing arrow for the next move.', explain: 'Crates can be pushed, but only one at a time and never into a wall.' };
  }

  /* ---------------- Picker ---------------- */
  function pickUnseenIndex(profile, prefix, n) {
    var seen = (profile && profile.seen) || {};
    var unseen = []; for (var i = 0; i < n; i++) if (!seen[prefix + i]) unseen.push(i);
    if (!unseen.length) { for (var j = 0; j < n; j++) delete seen[prefix + j]; unseen = []; for (var k = 0; k < n; k++) unseen.push(k); }
    return pick(unseen);
  }
  TOL.pickUnseenIndex = pickUnseenIndex;

  function weakness(profile, topic) {
    var st = profile && profile.topicStats && profile.topicStats[topic];
    if (!st) return 0;
    return st.wrong > st.right ? 2 : st.wrong > 0 ? 1 : 0;
  }

  function weightedPick(items, weightFn) {
    var total = 0, ws = items.map(function (it) { var w = weightFn(it); total += w; return w; });
    var r = Math.random() * total;
    for (var i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  }

  function mathsQuestion(profile, floorN, recent) {
    var f = Math.min(Math.max(floorN, 1), 99);
    var pool = [], term = TOL.currentTerm();
    Object.keys(MATHS_FLOORS).forEach(function (k) {
      var kf = Number(k);
      MATHS_FLOORS[k].forEach(function (key) {
        // Floors 1-3 focus on their own topics; from Floor 4 everything taught so far mixes, leaning towards the harder topics.
        var w = f > 3 ? (kf === 1 ? (f >= 6 ? 0.3 : 0.6) : kf >= 3 ? 1.6 : 1) : kf === f ? 4 : kf < f ? 1 : 0;
        if ((MATHS[key].term || 0) > term) w = 0;
        if (w) pool.push({ key: key, w: w });
      });
    });
    if (!pool.length) MATHS_FLOORS[1].concat(MATHS_FLOORS[2]).forEach(function (key) { if (!(MATHS[key].term > term)) pool.push({ key: key, w: 1 }); });
    for (var t = 0; t < 10; t++) {
      var choice = weightedPick(pool, function (it) { return it.w + weakness(profile, MATHS[it.key].topic); });
      var q = MATHS[choice.key].gen();
      if (!recent || recent.indexOf(q.prompt) < 0) return q;
    }
    return q;
  }

  // How hard each English and Science & World topic is: 1 from Floor 1, 2 from Floor 2, 3 from Floor 3.
  var TOPIC_LEVEL = {
    'a or an': 1, 'Homophones': 1, 'Word classes': 1, 'Conjunctions': 2, 'Prefixes': 2, 'Suffixes': 2, 'Adverbs': 2,
    'Prepositions': 2, 'Speech marks': 3, 'Present perfect': 3, 'Spelling': 3,
    'Plants': 1, 'UK geography': 1, 'Maps': 1, 'Light': 2, 'Animals and humans': 2, 'Forces and magnets': 2,
    'World geography': 2, 'Rocks': 3, 'History': 3, 'Stone Age to Iron Age': 1
  };
  TOL.TOPIC_LEVEL = TOPIC_LEVEL;

  function bankQuestion(profile, branch) {
    var bank = TOL.BANK;
    var prefix = branch === 'english' ? 'e' : 's';
    var items = [];
    var term = TOL.currentTerm();
    bank.forEach(function (q, i) { if (q.branch === branch && !(q.term > term)) items.push(i); });
    var seen = profile.seen || (profile.seen = {});
    var unseen = items.filter(function (i) { return !seen[prefix + i]; });
    if (!unseen.length) { items.forEach(function (i) { delete seen[prefix + i]; }); unseen = items.slice(); }
    var i = weightedPick(unseen, function (idx) {
      var lv = TOPIC_LEVEL[bank[idx].topic] || 2;
      var base = lv <= LVL ? 3 : lv === LVL + 1 ? 0.6 : 0.1;
      return base + weakness(profile, bank[idx].topic) * 2;
    });
    var src = bank[i];
    var q = mc({ id: prefix + i, topic: src.topic, prompt: src.prompt, hint: src.hint, explain: src.explain }, src.options.slice());
    return q;
  }

  // Reading doors keep one passage for both of their questions.
  function readingQuestion(profile, ctx, forGolden) {
    var name = (profile && profile.name) || 'Pip';
    if (ctx.passage == null || ctx.passageQ >= 2) {
      var term = TOL.currentTerm(), list = [];
      TOL.PASSAGES.forEach(function (P, i) { if (!(P.term > term)) list.push(i); });
      var seen = profile.seen || (profile.seen = {}), unseen = list.filter(function (i) { return !seen['p' + i]; });
      if (!unseen.length) { list.forEach(function (i) { delete seen['p' + i]; }); unseen = list; }
      ctx.passage = pick(unseen);
      ctx.passageQ = 0;
    }
    var P = TOL.PASSAGES[ctx.passage];
    var qd = P.q[ctx.passageQ];
    var sub = function (s) { return s.replace(/\{name\}/g, name); };
    var q = mc({ id: 'p' + ctx.passage, topic: 'Reading comprehension', prompt: sub(qd[0]),
      passage: { title: P.title, sentences: P.s.map(sub), highlight: qd[2] },
      hint: 'The answer is in the highlighted sentence.', explain: 'Look again: "' + sub(P.s[qd[2]]) + '"' },
      qd[1].map(sub));
    q.readingQ = ctx.passageQ;
    ctx.passageQ++;
    if (forGolden) ctx.passageQ = 2;
    return q;
  }

  function logicQuestion(profile, floorN, forGolden) {
    var gens = forGolden
      ? [['shapes', 3], ['numbers', 3], ['odd', 2], ['debug', 2]]
      : [['shapes', 3], ['numbers', 3], ['odd', 2], ['debug', 2], ['program', 2], ['maze', 2]];
    var topicOf = { shapes: 'Patterns', numbers: 'Number patterns', odd: 'Odd one out', debug: 'Debugging', program: 'Algorithms', maze: 'Maze puzzles' };
    var g = weightedPick(gens, function (it) { return it[1] + weakness(profile, topicOf[it[0]]); })[0];
    switch (g) {
      case 'shapes': return genPatternShapes(forGolden);
      case 'numbers': return genPatternNumbers();
      case 'odd': return genOdd(profile);
      case 'debug': return genDebug();
      case 'program': return genProgram();
      default: return genMaze(profile);
    }
  }

  /* ---------------- Weekly spellings ---------------- */
  // The list lives in game.store.spellings = { words: [...], carry: [...], setAt }. Carried words are last week's tricky ones.
  TOL.spellingWords = function () {
    var sp = TOL.game && TOL.game.store && TOL.game.store.spellings;
    if (!sp) return [];
    var out = (sp.words || []).slice();
    (sp.carry || []).forEach(function (w) { if (out.indexOf(w) < 0) out.push(w); });
    return out;
  };
  function misspellings(word) {
    var w = word, out = [], V = 'aeiou', tries = 0;
    var makers = [
      function () { var m = w.match(/ie/) ? w.replace('ie', 'ei') : w.match(/ei/) ? w.replace('ei', 'ie') : null; return m; },
      function () { var i = ri(1, w.length - 2); return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2); },
      function () { var m = w.match(/([b-df-hj-np-tv-z])\1/); if (m) return w.replace(m[0], m[1]); var i = ri(1, w.length - 2); return /[b-df-hj-np-tv-z]/.test(w[i]) ? w.slice(0, i) + w[i] + w.slice(i) : null; },
      function () { var idx = []; for (var i = 1; i < w.length; i++) if (V.indexOf(w[i]) >= 0) idx.push(i); if (!idx.length) return null; var k = pick(idx), r = pick(V.replace(w[k], '').split('')); return w.slice(0, k) + r + w.slice(k + 1); },
      function () { if (w.length < 5) return null; var i = ri(1, w.length - 2); return w.slice(0, i) + w.slice(i + 1); },
      function () { var rules = [['ph', 'f'], ['tion', 'shun'], ['ck', 'k'], ['ou', 'ow'], ['ai', 'ay'], ['ea', 'ee'], ['ough', 'uff'], ['igh', 'ite'], ['c', 'k'], ['s', 'z'], ['y', 'ey']]; var r = rules.filter(function (x) { return w.indexOf(x[0]) > 0 || (x[0].length > 1 && w.indexOf(x[0]) >= 0); }); if (!r.length) return null; var x = pick(r); return w.replace(x[0], x[1]); }
    ];
    while (out.length < 3 && tries++ < 200) {
      var m = pick(makers)();
      if (m && m !== w && m.toLowerCase() !== w.toLowerCase() && out.indexOf(m) < 0 && m.length > 1) out.push(m);
    }
    while (out.length < 3) out.push(w + w[w.length - 1].repeat(out.length + 1));
    return out;
  }
  TOL.misspellings = misspellings;

  function spellingQuestion(profile) {
    var words = TOL.spellingWords();
    var stats = profile.spellStats || (profile.spellStats = {});
    var word = weightedPick(words, function (w) {
      var st = stats[w.toLowerCase()];
      if (!st) return 3;
      return 1 + Math.max(0, st.wrong - st.right) * 2 + (st.last === false ? 2 : 0) + (st.right < 2 ? 1 : 0);
    });
    var canHear = TOL.audio && TOL.audio.canSpeak && TOL.audio.canSpeak() && TOL.audio.voiceOn;
    var modes = ['pick'];
    if (canHear) modes.push('listen', 'listen');
    if (word.length >= 4) modes.push('fill');
    if (word.length >= 3 && word.length <= 10 && word.indexOf(' ') < 0) modes.push('unscramble');
    var mode = pick(modes), base = { topic: 'Weekly spellings', spellWord: word, word: word,
      explain: 'It is spelt ' + word.split('').join(' - ') + '.' };
    var first = 'It has ' + word.length + ' letters and starts with "' + word[0] + '".';
    if (mode === 'listen') {
      return Object.assign(base, { type: 'spell', mode: 'listen', prompt: 'Listen, then spell the word.', answer: word, hint: first });
    }
    if (mode === 'fill') {
      var vowels = []; for (var i = 1; i < word.length - 1; i++) if ('aeiouy'.indexOf(word[i].toLowerCase()) >= 0) vowels.push(i);
      var start = vowels.length ? pick(vowels) : ri(1, word.length - 2), len = (word.length >= 6 && start < word.length - 2) ? 2 : 1;
      var miss = word.substr(start, len), pattern = word.slice(0, start) + new Array(len + 1).join('_') + word.slice(start + len);
      return Object.assign(base, { type: 'spell', mode: 'fill', prompt: 'Fill in the missing letter' + (len > 1 ? 's' : '') + ':', pattern: pattern.split('').join(' '),
        answer: miss, hint: 'Say the word slowly. The first missing letter is "' + miss[0] + '".' });
    }
    if (mode === 'unscramble') {
      var letters = word.split(''), tiles;
      for (var k = 0; k < 20; k++) { tiles = shuffle(letters); if (tiles.join('') !== word) break; }
      return Object.assign(base, { type: 'build', mode: 'unscramble', prompt: 'Put the letters in order to spell this week\'s word.', tiles: tiles, slots: letters.length, answer: letters,
        hint: 'The word starts with "' + word[0] + '" and ends with "' + word[word.length - 1] + '".' });
    }
    return mc(Object.assign(base, { mode: 'pick', prompt: 'Which word is spelt correctly?', hint: 'Picture the word. Which one looks right?' }), [word].concat(misspellings(word)));
  }

  // Public: get the next question for a branch.
  // ctx is a small object the door keeps (reading passage, recent prompts).
  TOL.nextQuestion = function (profile, branch, floorN, ctx, forGolden) {
    ctx = ctx || {};
    ctx.recent = ctx.recent || [];
    LVL = Math.max(1, floorN || 1);
    var q;
    if (floorN === 0) q = tutorialQuestion(ctx);
    else if (branch === 'maths') q = mathsQuestion(profile, floorN, ctx.recent);
    else if (branch === 'english' && TOL.spellingWords().length && Math.random() < 0.5) q = spellingQuestion(profile);
    else if (branch === 'english' || branch === 'science') q = bankQuestion(profile, branch);
    else if (branch === 'reading') q = readingQuestion(profile, ctx, forGolden);
    else q = logicQuestion(profile, floorN, forGolden);
    q.branch = branch;
    ctx.recent.push(q.prompt); if (ctx.recent.length > 8) ctx.recent.shift();
    return q;
  };

  function tutorialQuestion(ctx) {
    ctx.tut = (ctx.tut || 0) + 1;
    if (ctx.tut % 2) return { type: 'input', topic: 'Tutorial', prompt: '5 + 5 = ?', answer: 10, hint: 'Count on 5 from 5.', visual: { kind: 'groups', groups: 2, each: 5 }, explain: '5 + 5 = 10.' };
    return mc({ topic: 'Tutorial', prompt: 'Which of these is a colour?', hint: 'Look at the rainbow!', explain: 'Blue is a colour.' }, ['blue', 'chair', 'seven', 'jump']);
  }

  // Maze helpers used by the UI and tests.
  TOL.parseMaze = function (rows) {
    var st = { w: rows[0].length, h: rows.length, walls: {}, crates: {}, robot: null, star: null };
    rows.forEach(function (r, y) { r.split('').forEach(function (c, x) {
      var k = x + ',' + y;
      if (c === '#') st.walls[k] = 1; else if (c === 'C') st.crates[k] = 1;
      else if (c === 'R') st.robot = [x, y]; else if (c === '*') st.star = [x, y];
    }); });
    return st;
  };
  TOL.mazeMove = function (st, d) {
    var v = DIRS[d], nx = st.robot[0] + v[0], ny = st.robot[1] + v[1];
    function free(x, y) { return x >= 0 && y >= 0 && x < st.w && y < st.h && !st.walls[x + ',' + y]; }
    if (!free(nx, ny)) return false;
    var k = nx + ',' + ny;
    if (st.crates[k]) {
      var bx = nx + v[0], by = ny + v[1], bk = bx + ',' + by;
      if (!free(bx, by) || st.crates[bk] || (st.star[0] === bx && st.star[1] === by)) return false;
      delete st.crates[k]; st.crates[bk] = 1;
    }
    st.robot = [nx, ny];
    return true;
  };
  TOL.mazeSolve = function (st) {
    function key(s) { return s.robot.join(',') + '|' + Object.keys(s.crates).sort().join(';'); }
    function clone(s) { return { w: s.w, h: s.h, walls: s.walls, star: s.star, robot: s.robot.slice(), crates: Object.assign({}, s.crates) }; }
    var q = [[clone(st), []]], seen = {}; seen[key(st)] = 1;
    while (q.length) {
      var c = q.shift();
      if (c[0].robot[0] === st.star[0] && c[0].robot[1] === st.star[1]) return c[1];
      for (var d in DIRS) {
        var n = clone(c[0]);
        if (!TOL.mazeMove(n, d)) continue;
        var k = key(n); if (seen[k]) continue; seen[k] = 1;
        q.push([n, c[1].concat([d])]);
      }
    }
    return null;
  };
})();

/* The Tower of Lumen – music, sound effects and read-aloud. All sound is generated in code. */
(function () {
  var TOL = (window.TOL = window.TOL || {});
  var A = (TOL.audio = { ctx: null, musicOn: true, sfxOn: true, musicVol: 0.5, sfxVol: 0.7, voiceOn: true });
  var musicGain, sfxGain, master, timer = null, nextTime = 0, step = 0, noiseBuf = null;

  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { A.ctx = new AC(); } catch (e) { return; }
    master = A.ctx.createGain(); master.gain.value = 0.9; master.connect(A.ctx.destination);
    musicGain = A.ctx.createGain(); musicGain.connect(master);
    sfxGain = A.ctx.createGain(); sfxGain.connect(master);
    var len = A.ctx.sampleRate * 0.5; noiseBuf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.apply();
    if (A.musicOn) A.startMusic();
  };

  A.apply = function () {
    if (!A.ctx) return;
    musicGain.gain.setTargetAtTime(A.musicOn ? A.musicVol * 0.22 : 0, A.ctx.currentTime, 0.05);
    sfxGain.gain.setTargetAtTime(A.sfxOn ? A.sfxVol * 0.5 : 0, A.ctx.currentTime, 0.02);
    if (A.musicOn && !timer) A.startMusic();
    if (!A.musicOn && timer) A.stopMusic();
  };

  function tone(dest, freq, t, dur, type, vol, glideTo) {
    var o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dest, t, dur, vol, hp) {
    var s = A.ctx.createBufferSource(), f = A.ctx.createBiquadFilter(), g = A.ctx.createGain();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp || 6000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t); s.stop(t + dur + 0.02);
  }

  // Upbeat arcade loop with a little mystery: Am – F – C – G, arpeggios, bass and hats.
  var BPM = 128, SIXTEENTH = 60 / BPM / 4;
  var CHORDS = [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]];
  var ARP = [0, 1, 2, 3, 2, 1, 0, 2];
  var MELODY = [76, -1, 79, 81, -1, 79, 76, -1, 72, -1, 74, 76, -1, -1, 74, -1, 72, -1, 76, 79, -1, 81, 84, -1, 83, -1, 81, 79, -1, -1, -1, -1];

  function scheduleStep(t) {
    var bar = Math.floor(step / 16) % 4, s16 = step % 16, chord = CHORDS[bar];
    var section = Math.floor(step / 64) % 4;
    if (s16 % 2 === 0) {
      var ai = ARP[(s16 / 2) % 8], n = ai === 3 ? chord[0] + 12 : chord[ai];
      tone(musicGain, midi(n + 12), t, SIXTEENTH * 1.8, 'square', 0.06);
    }
    if (s16 % 4 === 0) tone(musicGain, midi(chord[0] - 12), t, SIXTEENTH * 3.5, 'triangle', 0.32);
    if (s16 % 4 === 2) noise(musicGain, t, 0.04, 0.05);
    if (s16 === 0 || s16 === 8) tone(musicGain, 90, t, 0.12, 'sine', 0.35, 45);
    if (section % 2 === 1 && s16 % 2 === 0) {
      var mi = ((bar * 8) + s16 / 2) % 32, mn = MELODY[mi];
      if (mn > 0) tone(musicGain, midi(mn), t, SIXTEENTH * 2.6, 'triangle', 0.16);
    }
    step++;
  }
  A.startMusic = function () {
    if (!A.ctx || timer) return;
    nextTime = A.ctx.currentTime + 0.1;
    timer = setInterval(function () {
      while (nextTime < A.ctx.currentTime + 0.15) { scheduleStep(nextTime); nextTime += SIXTEENTH; }
    }, 30);
  };
  A.stopMusic = function () { if (timer) { clearInterval(timer); timer = null; } };

  A.sfx = function (name) {
    if (!A.ctx || !A.sfxOn) return;
    var t = A.ctx.currentTime + 0.01, d = sfxGain;
    switch (name) {
      case 'correct': [72, 76, 79].forEach(function (n, i) { tone(d, midi(n), t + i * 0.08, 0.18, 'square', 0.18); }); tone(d, midi(84), t + 0.24, 0.35, 'triangle', 0.25); break;
      case 'wrong': tone(d, 330, t, 0.28, 'sine', 0.3, 200); break;
      case 'door': noise(d, t, 0.35, 0.18, 800); tone(d, midi(79), t + 0.15, 0.3, 'triangle', 0.25); tone(d, midi(84), t + 0.28, 0.45, 'triangle', 0.25); break;
      case 'box': [72, 76, 79, 84, 88].forEach(function (n, i) { tone(d, midi(n), t + i * 0.07, 0.25, 'square', 0.14); }); break;
      case 'levelup': [72, 76, 79, 84].forEach(function (n, i) { tone(d, midi(n), t + i * 0.12, 0.3, 'square', 0.18); }); tone(d, midi(79), t + 0.55, 0.25, 'square', 0.16); tone(d, midi(84), t + 0.7, 0.7, 'triangle', 0.3); break;
      case 'golden': for (var i = 0; i < 8; i++) tone(d, midi(84 + (i % 4) * 3), t + i * 0.06, 0.2, 'triangle', 0.15); break;
      case 'hint': tone(d, midi(81), t, 0.15, 'triangle', 0.22); tone(d, midi(88), t + 0.1, 0.25, 'triangle', 0.18); break;
      case 'click': tone(d, 900, t, 0.04, 'square', 0.06); break;
      case 'fanfare':
        // Floor complete: a quick climbing run (the flag going up), then a bright chord and a sparkly finish.
        if (A.ctx && timer) { musicGain.gain.setTargetAtTime(0, t, 0.05); musicGain.gain.setTargetAtTime(A.musicOn ? A.musicVol * 0.22 : 0, t + 4.2, 0.4); }
        [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79].forEach(function (n, i) { tone(d, midi(n), t + i * 0.055, 0.09, 'square', 0.13); });
        var c = t + 0.75;
        [[72, 76, 79], [74, 77, 81], [76, 79, 84]].forEach(function (ch, i) { ch.forEach(function (n) { tone(d, midi(n), c + i * 0.22, 0.2, 'square', 0.1); }); });
        [72, 76, 79, 84].forEach(function (n) { tone(d, midi(n), c + 0.72, 1.3, 'triangle', 0.2); tone(d, midi(n), c + 0.72, 0.9, 'square', 0.06); });
        tone(d, midi(48), c + 0.72, 1.3, 'triangle', 0.35);
        for (var k = 0; k < 10; k++) tone(d, midi(96 + (k % 3) * 2), c + 1.0 + k * 0.07, 0.12, 'sine', 0.08);
        noise(d, c + 0.72, 0.5, 0.12, 3000);
        break;
      case 'yip': tone(d, 900, t, 0.09, 'sine', 0.3, 1500); tone(d, 1000, t + 0.13, 0.11, 'sine', 0.3, 1700); break;
      case 'hoot': tone(d, 520, t, 0.22, 'sine', 0.35, 440); tone(d, 500, t + 0.3, 0.32, 'sine', 0.35, 400); break;
      case 'rawr': tone(d, 220, t, 0.35, 'sawtooth', 0.12, 140); tone(d, 330, t, 0.3, 'square', 0.05, 200); tone(d, 1200, t + 0.38, 0.1, 'sine', 0.15, 1600); break;
      case 'meow': tone(d, 600, t, 0.18, 'sine', 0.3, 950); tone(d, 950, t + 0.18, 0.28, 'sine', 0.3, 480); break;
      case 'woof': tone(d, 260, t, 0.12, 'sawtooth', 0.14, 150); tone(d, 280, t + 0.2, 0.14, 'sawtooth', 0.14, 160); break;
      case 'squawk': for (var sq = 0; sq < 3; sq++) tone(d, 1400 - sq * 150, t + sq * 0.09, 0.07, 'square', 0.07, 1000); break;
      case 'beep': [880, 660, 990].forEach(function (f, i) { tone(d, f, t + i * 0.1, 0.08, 'square', 0.08); }); break;
      case 'nibble': for (var nb = 0; nb < 4; nb++) tone(d, 1800, t + nb * 0.06, 0.03, 'square', 0.05); tone(d, 120, t + 0.3, 0.1, 'sine', 0.35); break;
      case 'purr': for (var q = 0; q < 6; q++) tone(d, 90 + (q % 2) * 10, t + q * 0.08, 0.09, 'triangle', 0.3); break;
      case 'bump': tone(d, 160, t, 0.08, 'sine', 0.2); break;
    }
  };

  /* Read-aloud with the browser's own voice, preferring a British voice. */
  A.speak = function (text) {
    if (!A.voiceOn || !window.speechSynthesis) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var voices = window.speechSynthesis.getVoices() || [];
      var v = voices.filter(function (x) { return /en-GB/i.test(x.lang); })[0] || voices.filter(function (x) { return /^en/i.test(x.lang); })[0];
      if (v) u.voice = v;
      u.lang = 'en-GB'; u.rate = 0.92; u.pitch = 1.05;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  };
  A.stopSpeaking = function () { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {} };
  A.canSpeak = function () { return !!window.speechSynthesis; };
})();

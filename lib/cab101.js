/* THE 101 · HYSCORE CAB MODE (PC 1124, Order 34). OPT-IN ONLY: loaded by POV DRIVE TEST.html when the URL has ?cab=101.
   The default game, the sandbox and the ?run=101&from=menu mode never load this file.
   Merc Zebra is RETIRED (Joe 22 Nov); this is the one surviving experience, a HYSCORE cab: ATTRACT -> DRIVE -> SCORE -> ATTRACT.
   Re-uses only what exists: the POV pseudo-3D road + its step() sim (steer, curve, off-road, miles) and THE 101's exit windows.
   Pure logic (no DOM): the page owns drawing and input; node can require() this for the headless tests (tools/cab101_test.js).
   Saves NOTHING (studio rule): the session best lives in memory and is gone on reload, like a cab after a power cycle. */
(function (root) {
  var C = {
    RUN_SECS: 75,      // one credit = one timed run (?secs= overrides, 30..300)
    OVER_SECS: 7,      // the score card holds this long, then back to attract
    SKIP_AFTER: 1.5,   // a START press may skip the score card after this long
    MI_PTS: 1000,      // points per mile driven
    EXIT_PTS: 500,     // points per off-ramp made inside its window
    OFF_PEN: 40,       // points lost per second off the asphalt

    create: function (opts) {
      var s = (opts && +opts.runSecs) || C.RUN_SECS;
      return { phase: 'attract', t: 0, runT: 0, overT: 0, score: 0, exits: 0, offT: 0, miles0: 0,
               best: 0, last: 0, newBest: false, runSecs: Math.max(30, Math.min(300, s)), lastExitWin: -1, runs: 0 };
    },

    // the demo driver: holds the lane against the curve (bang-bang on the same keys a player uses), cruises, never exits
    autopilot: function (sim) {
      var spdN = sim.spd / sim.TOP;
      var want = (sim.curve * spdN * 0.9) / 1.3 - sim.lat * 0.9;   // the steer that cancels the outward pull, plus a pull home
      var err = want - sim.steer;
      return { left: err < -0.06, right: err > 0.06, up: false, down: false };
    },

    // one frame. ev = { start: bool }. Returns 'begin' when a run starts (the page resets the car), 'end' when it ends.
    tick: function (st, dt, sim, ev) {
      st.t += dt;
      if (st.phase === 'attract') {
        if (ev && ev.start) {
          st.phase = 'play'; st.runT = 0; st.score = 0; st.exits = 0; st.offT = 0; st.miles0 = sim.miles;
          st.lastExitWin = -1; st.newBest = false; st.runs++;
          return 'begin';
        }
        return null;
      }
      if (st.phase === 'play') {
        st.runT += dt;
        if (sim.offroadT > 0) st.offT += dt;
        st.score = Math.max(0, Math.round((sim.miles - st.miles0) * C.MI_PTS + st.exits * C.EXIT_PTS - st.offT * C.OFF_PEN));
        if (st.runT >= st.runSecs) {
          st.phase = 'over'; st.overT = 0; st.last = st.score;
          st.newBest = st.score > st.best; if (st.newBest) st.best = st.score;
          return 'end';
        }
        return null;
      }
      // 'over'
      st.overT += dt;
      if (st.overT >= C.OVER_SECS || (ev && ev.start && st.overT >= C.SKIP_AFTER)) { st.phase = 'attract'; st.t = 0; }
      return null;
    },

    // an off-ramp taken. win = the exit window's index (floor(simT / EXIT_EVERY)); each window counts once.
    exitMade: function (st, win) {
      if (st.phase !== 'play' || win === st.lastExitWin) return false;
      st.lastExitWin = win; st.exits++; return true;
    },

    timeLeft: function (st) { return Math.max(0, st.runSecs - st.runT); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = C; else root.CAB101 = C;
})(this);

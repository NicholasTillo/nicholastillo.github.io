import React from "react";
import "./RotomScreen.css";
import { IDLE1, IDLE2, NEUTRAL3, FRUITS, SCREEN_W, SCREEN_H } from "../data/rotomSprites";

// Renders the Rotom OLED output and ports the firmware's behaviour: it plays the
// random "neutral" idle animations, and while the Feed button is held it plays
// the feeding animation (raising happiness, which also fills the side bar and
// speeds the idle blink, exactly like the .ino). Drawing is done pixel-accurate
// on a 128x64 canvas so it stays crisp when scaled up.
const LIT = "rgb(233,226,245)";
const BG = [31, 34, 69]; // deep navy field (#1F2245)
const MAX_HAPPINESS = 2000;
const rnd = (n) => Math.floor(Math.random() * n);

export default class RotomScreen extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = { feeding: false };
    this.h = 0;            // rotom_happiness
    this.feeding = false;  // live flag read by the loop
    this.gen = 0;          // bumped to interrupt the current animation
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.run();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.gen++;
    this.poke();
  }

  // ---- timing / interruption ----------------------------------------------
  wait(ms) {
    return new Promise((resolve) => {
      const done = () => { this.pending = null; resolve(); };
      const timer = setTimeout(done, Math.max(0, ms));
      this.pending = { cancel: () => { clearTimeout(timer); done(); } };
    });
  }
  poke() { if (this.pending) this.pending.cancel(); }
  stale(gen) { return !this.mounted || gen !== this.gen; }

  setFeeding(v) {
    if (this.feeding === v) return;
    this.feeding = v;
    this.gen++;      // interrupt whatever is playing so we switch promptly
    this.poke();
    this.setState({ feeding: v });
  }

  // ---- drawing primitives (all in 128x64 space) ---------------------------
  ctx() { return this.canvasRef.current.getContext("2d"); }

  drawBitmap(bytes) {
    const ctx = this.ctx();
    const img = ctx.createImageData(SCREEN_W, SCREEN_H);
    for (let y = 0; y < SCREEN_H; y++) {
      for (let x = 0; x < SCREEN_W; x++) {
        const lit = (bytes[y * (SCREEN_W / 8) + (x >> 3)] >> (7 - (x & 7))) & 1;
        const p = (y * SCREEN_W + x) * 4;
        img.data[p] = lit ? 233 : BG[0];
        img.data[p + 1] = lit ? 226 : BG[1];
        img.data[p + 2] = lit ? 245 : BG[2];
        img.data[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.fillStyle = LIT; // overlays (lines/hearts/bars) draw lit on top
  }

  px(x, y) {
    if (x < 0 || x >= SCREEN_W || y < 0 || y >= SCREEN_H) return;
    this.ctx().fillRect(x, y, 1, 1);
  }

  line(x0, y0, x1, y1) { // Bresenham
    let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
    for (;;) {
      this.px(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  circle(cx, cy, r) { // midpoint circle outline
    let x = r, y = 0, err = 1 - r;
    while (x >= y) {
      [[x, y], [y, x], [-x, y], [-y, x], [-x, -y], [-y, -x], [x, -y], [y, -x]]
        .forEach(([ox, oy]) => this.px(cx + ox, cy + oy));
      y++;
      if (err < 0) err += 2 * y + 1;
      else { x--; err += 2 * (y - x) + 1; }
    }
  }

  rectOutline(x, y, w, h) {
    if (w <= 0 || h <= 0) return;
    this.line(x, y, x + w - 1, y);
    this.line(x, y + h - 1, x + w - 1, y + h - 1);
    this.line(x, y, x, y + h - 1);
    this.line(x + w - 1, y, x + w - 1, y + h - 1);
  }

  heart(sx, sy) {
    const pts = [
      [0, 0], [-1, -1], [1, -1], [-2, -2], [2, -2], [-3, -3], [3, -3],
      [0, -4], [-4, -4], [4, -4], [-3, -5], [3, -5], [-1, -5], [1, -5],
      [-2, -6], [2, -6],
    ];
    pts.forEach(([ox, oy]) => this.px(sx + ox, sy + oy));
  }

  // ---- animations ---------------------------------------------------------
  async run() {
    if (this.reduced) return this.runReduced();
    while (this.mounted) {
      const gen = this.gen;
      if (this.feeding) await this.animFeed(gen);
      else await this.animNeutral(gen);
    }
  }

  // Reduced motion: no flashing. Show a static frame per state; poke re-draws.
  async runReduced() {
    while (this.mounted) {
      const gen = this.gen;
      if (this.feeding) {
        const [s3] = FRUITS[0];
        this.drawBitmap(s3);
        this.drawFeedBar();
        if (this.h < MAX_HAPPINESS) this.h += 100;
      } else {
        this.drawBitmap(IDLE1);
      }
      await this.wait(1500);
      if (this.stale(gen)) continue;
    }
  }

  drawFeedBar() {
    const n = Math.round((this.h / MAX_HAPPINESS) * 60);
    this.rectOutline(123, 60 - n, 4, n);
  }

  async animFeed(gen) {
    const [s3, s4] = FRUITS[rnd(FRUITS.length)];
    for (let f = 0; f < 8; f++) {
      this.drawBitmap(f % 2 === 0 ? s3 : s4);
      this.drawFeedBar();
      await this.wait(200);
      if (this.stale(gen)) return;
    }
    if (this.h < MAX_HAPPINESS) this.h += 100;
  }

  async animNeutral(gen) {
    let pick = rnd(7);
    if (pick === 5 && this.h < 1000) pick = 0; // n6 gated
    if (pick === 6 && this.h < 1500) pick = 0; // n7 gated
    await [
      this.n1, this.n2, this.n3, this.n4, this.n5, this.n6, this.n7,
    ][pick].call(this, gen);
    if (this.h > 0) this.h = Math.max(0, this.h - 15); // slow decay toward idle
  }

  idleDelay() { return Math.max(300, 3000 - this.h); }

  async n1(gen) {
    this.drawBitmap(IDLE2); await this.wait(this.idleDelay()); if (this.stale(gen)) return;
    this.drawBitmap(IDLE1); await this.wait(this.idleDelay());
  }

  async n2(gen) {
    this.drawBitmap(IDLE2); await this.wait(this.idleDelay()); if (this.stale(gen)) return;
    for (const b of [IDLE1, NEUTRAL3, IDLE1, NEUTRAL3]) {
      this.drawBitmap(b); await this.wait(300); if (this.stale(gen)) return;
    }
    this.drawBitmap(IDLE1); await this.wait(this.idleDelay());
  }

  async n3(gen) {
    this.drawBitmap(NEUTRAL3); await this.wait(this.idleDelay()); if (this.stale(gen)) return;
    this.drawBitmap(IDLE1); await this.wait(this.idleDelay());
  }

  async n4(gen) {
    this.drawBitmap(NEUTRAL3); await this.wait(1000); if (this.stale(gen)) return;
    this.drawBitmap(IDLE1); await this.wait(this.idleDelay()); if (this.stale(gen)) return;
    this.drawBitmap(IDLE2); await this.wait(1000); if (this.stale(gen)) return;
    this.drawBitmap(IDLE1); await this.wait(this.idleDelay());
  }

  async n5(gen) {
    this.drawBitmap(NEUTRAL3); await this.wait(3000 + this.h); if (this.stale(gen)) return;
    this.circle(64, 30, 15); await this.wait(1000); if (this.stale(gen)) return;

    let pass1 = [], pass2 = [];
    if (this.h > 1500) {
      pass1 = [[0,0,21,17],[57,0,55,6],[128,0,100,10],[128,28,112,28],[128,64,116,54],[64,64,70,57],[0,64,14,47],[0,32,14,25]];
      pass2 = [[21,17,34,18],[55,6,58,10],[100,10,92,22],[112,28,108,33],[116,54,106,44],[70,57,65,50],[14,47,31,44],[14,25,24,31]];
    } else if (this.h > 1000) {
      pass1 = [[0,0,21,17],[128,0,100,10],[128,64,116,54],[0,64,14,47]];
      pass2 = [[21,17,34,18],[100,10,92,22],[116,54,106,44],[14,47,31,44]];
    } else if (this.h > 500) {
      pass1 = [[0,0,21,17],[128,64,116,54]];
      pass2 = [[21,17,34,18],[116,54,106,44]];
    }
    if (pass1.length) {
      pass1.forEach((l) => this.line(...l)); await this.wait(300); if (this.stale(gen)) return;
      pass2.forEach((l) => this.line(...l)); await this.wait(1000); if (this.stale(gen)) return;
    }
    this.drawBitmap(IDLE1); await this.wait(500);
  }

  async n6(gen) {
    this.drawBitmap(IDLE2); await this.wait(1000); if (this.stale(gen)) return;
    for (let i = 0; i < 8; i++) {
      const base = rnd(32) + 96 * rnd(2), y = rnd(64);
      [[0,0],[1,0],[-1,0],[0,-1],[0,1]].forEach(([ox, oy]) => this.px(base + ox, y + oy));
      await this.wait(500); if (this.stale(gen)) return;
    }
  }

  async n7(gen) {
    for (let i = 0; i < 8; i++) {
      this.drawBitmap(NEUTRAL3); await this.wait(200); if (this.stale(gen)) return;
      this.heart(87, 17); await this.wait(500); if (this.stale(gen)) return;
      this.drawBitmap(IDLE2); await this.wait(200); if (this.stale(gen)) return;
      this.heart(27, 36); await this.wait(500); if (this.stale(gen)) return;
    }
  }

  // ---- feed button handlers -----------------------------------------------
  hold = (e) => { e.preventDefault(); this.setFeeding(true); };
  release = () => this.setFeeding(false);
  keyHold = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); this.setFeeding(true); } };
  keyRelease = (e) => { if (e.key === " " || e.key === "Enter") this.setFeeding(false); };

  render() {
    return (
      <div className="rotomStage">
        <canvas
          ref={this.canvasRef}
          width={SCREEN_W}
          height={SCREEN_H}
          className="rotomScreen"
          role="img"
          aria-label="Rotom sprite animating on the 128x64 OLED display"
        />
        <button
          type="button"
          className={"rotomFeedBtn" + (this.state.feeding ? " isFeeding" : "")}
          aria-pressed={this.state.feeding}
          onPointerDown={this.hold}
          onPointerUp={this.release}
          onPointerLeave={this.release}
          onPointerCancel={this.release}
          onKeyDown={this.keyHold}
          onKeyUp={this.keyRelease}
        >
          {this.state.feeding ? "Nom nom nom…" : "Hold Me To Feed"}
        </button>
      </div>
    );
  }
}

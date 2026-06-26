import React from "react";

import mugi from '../Assets/mugi.png'

import Fight from '../Assets/Fight.png'
import Mercy from '../Assets/Mercy.png'
import Act from '../Assets/Act.png'
import Item from '../Assets/Item.png'

import Fight_Selected from '../Assets/Fight_Selected.png'
import Mercy_Selected from '../Assets/Mercy_Selected.png'
import Act_Selected from '../Assets/Act_Selected.png'
import Item_Selected from '../Assets/Item_Selected.png'

import Carrot from '../Assets/carrot.gif'

import "./homepage.css"
import "./mugi.css"

// Battle arena internal resolution (CSS scales it down responsively).
const BW = 480;
const BH = 320;
const GAME_SECONDS = 15;
// Hug minigame: half-width of the centre "hug zone" and the bunny size.
const HUG_TOL = 48;
const HUG_BUNNY_R = 28;

// Item minigame: Mugi shows a mood; offer an item that matches it.
const EMOTIONS = { happy: '😊', sad: '😢', angry: '😠', mysterious: '🔮' };
// 20 items, 5 per mood.
const ITEMS = [
    { name: 'Golden Carrot', emotion: 'happy' },
    { name: 'Squeaky Toy', emotion: 'happy' },
    { name: 'Sunny Nap Spot', emotion: 'happy' },
    { name: 'Party Hat', emotion: 'happy' },
    { name: 'Fresh Clover', emotion: 'happy' },
    { name: 'Wilted Lettuce', emotion: 'sad' },
    { name: 'Empty Bowl', emotion: 'sad' },
    { name: 'Rainy Blanket', emotion: 'sad' },
    { name: 'Lost Sock', emotion: 'sad' },
    { name: 'Faded Photo', emotion: 'sad' },
    { name: 'Chili Pepper', emotion: 'angry' },
    { name: 'Chew Stick', emotion: 'angry' },
    { name: 'Thunder Drum', emotion: 'angry' },
    { name: 'Spiky Burr', emotion: 'angry' },
    { name: 'Hot Sauce', emotion: 'angry' },
    { name: 'Glowing Mushroom', emotion: 'mysterious' },
    { name: 'Ancient Rune', emotion: 'mysterious' },
    { name: 'Moonstone', emotion: 'mysterious' },
    { name: 'Unmarked Vial', emotion: 'mysterious' },
    { name: 'Whispering Shell', emotion: 'mysterious' },
];

// ponytail: toy shuffle (sort by random) — bias is irrelevant for a 4-item menu.
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default class Mugi extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hovered: null, showItem: false, paragraphText: "This is Mugi, We like Mugi", gameActive: false, itemMenu: false, mugiEmotion: null, itemChoices: [] };
        this.areaRef = React.createRef();
        this.canvasRef = React.createRef();

        // The "heart" is a pixel carrot.
        this.heartImg = new Image();
        this.heartImg.src = Carrot;

        // Mutable game state kept off React state — it changes every frame.
        this.keys = {};
        this.heart = { x: BW / 2, y: BH / 2 };
        this.heartR = 13;
        this.projectiles = [];
        this.running = false;
    }

    componentWillUnmount() {
        this.stopGame();
    }

    toggleFullscreen = () => {
        const el = this.areaRef.current;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    setHovered = (name) => this.setState({ hovered: name });
    clearHovered = () => this.setState({ hovered: null });
    changeParagraph = (newText) => this.setState({ paragraphText: newText });

    // Enter/Space activate the image "buttons".
    onKeyActivate = (fn) => (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fn();
        }
    };

    // --- Mini-game: dodge Mugi's carrots with the arrow keys for 15s ---------
    fight = () => {
        if (this.state.gameActive) return;
        this.mode = 'fight';
        this.heart = { x: BW / 2, y: BH / 2 };
        this.projectiles = [];
        this.keys = {};
        this.elapsed = 0;
        this.spawnAcc = 0;
        this.lastTime = null;
        this.running = true;
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        this.setState(
            { gameActive: true, showItem: false, paragraphText: "Mugi attacks! Dodge the bunnies with the arrow keys!" },
            () => { this.rafId = requestAnimationFrame(this.loop); }
        );
    };

    stopGame = () => {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    };

    handleKeyDown = (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            this.keys[e.key] = true;
            return;
        }
        if (e.key === ' ' && this.mode === 'hug') {
            e.preventDefault();
            if (!e.repeat) this.tryHug(); // ignore key auto-repeat while held
        }
    };
    handleKeyUp = (e) => { this.keys[e.key] = false; };

    tryHug = () => {
        if (Math.abs(this.bunnyX - BW / 2) < HUG_TOL) {
            this.hugs += 1;
            this.hugFlash = 0.35;
            this.setState({ paragraphText: `Hug! You've hugged Mugi ${this.hugs} time${this.hugs === 1 ? '' : 's'}!` });
        } else {
            this.hugs = Math.max(0, this.hugs - 1); // penalty for missing
            this.setState({ paragraphText: `You hug the air! The bunny dodges. (${this.hugs} hug${this.hugs === 1 ? '' : 's'})` });
        }
    };

    spawnProjectile = () => {
        // Spawn on a random edge, aimed at the heart's current position.
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        if (edge === 0) { x = Math.random() * BW; y = -10; }
        else if (edge === 1) { x = Math.random() * BW; y = BH + 10; }
        else if (edge === 2) { x = -10; y = Math.random() * BH; }
        else { x = BW + 10; y = Math.random() * BH; }
        const dx = this.heart.x - x, dy = this.heart.y - y;
        const d = Math.hypot(dx, dy) || 1;
        const speed = 160;
        this.projectiles.push({ x, y, vx: (dx / d) * speed, vy: (dy / d) * speed, r: 7 });
    };

    // A small white bunny: head + two ears (radius r ≈ projectile size).
    drawBunny = (ctx, cx, cy, r) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.45, cy - r * 0.9, r * 0.28, r * 0.75, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + r * 0.45, cy - r * 0.9, r * 0.28, r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    };

    loop = (time) => {
        if (!this.running) return;
        const canvas = this.canvasRef.current;
        if (!canvas) { this.rafId = requestAnimationFrame(this.loop); return; }

        const dt = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.05) : 0;
        this.lastTime = time;
        this.elapsed += dt;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, BW, BH);

        if (this.mode === 'fight') {
            if (this.fightStep(ctx, dt)) return; // returned true → died, loop stopped
        } else {
            this.hugStep(ctx, dt);
        }

        // Shared survival/round timer bar.
        const remain = Math.max(0, GAME_SECONDS - this.elapsed);
        ctx.fillStyle = '#6B4A7F';
        ctx.fillRect(0, BH - 4, BW * (remain / GAME_SECONDS), 4);

        if (this.elapsed >= GAME_SECONDS) {
            if (this.mode === 'fight') this.win(); else this.hugEnd();
            return;
        }
        this.rafId = requestAnimationFrame(this.loop);
    };

    // Returns true if the player died (loop already stopped).
    fightStep = (ctx, dt) => {
        const sp = 200 * dt;
        if (this.keys['ArrowLeft']) this.heart.x -= sp;
        if (this.keys['ArrowRight']) this.heart.x += sp;
        if (this.keys['ArrowUp']) this.heart.y -= sp;
        if (this.keys['ArrowDown']) this.heart.y += sp;
        const r = this.heartR;
        this.heart.x = Math.max(r, Math.min(BW - r, this.heart.x));
        this.heart.y = Math.max(r, Math.min(BH - r, this.heart.y));

        // Spawn — gets a little faster over time.
        this.spawnAcc += dt;
        const interval = Math.max(0.18, 0.5 - this.elapsed * 0.018);
        if (this.spawnAcc >= interval) { this.spawnAcc = 0; this.spawnProjectile(); }

        this.projectiles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; });
        this.projectiles = this.projectiles.filter((p) => p.x > -20 && p.x < BW + 20 && p.y > -20 && p.y < BH + 20);

        for (const p of this.projectiles) {
            if (Math.hypot(p.x - this.heart.x, p.y - this.heart.y) < this.heartR + p.r) {
                this.die();
                return true;
            }
        }

        this.projectiles.forEach((p) => this.drawBunny(ctx, p.x, p.y, p.r));
        if (this.heartImg.complete && this.heartImg.naturalWidth) {
            ctx.drawImage(this.heartImg, this.heart.x - r, this.heart.y - r, r * 2, r * 2);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(this.heart.x - r, this.heart.y - r, r * 2, r * 2);
        }
        return false;
    };

    hugStep = (ctx, dt) => {
        // Move the bunny left/right, bouncing off the walls.
        this.bunnyX += this.bunnyVX * dt;
        if (this.bunnyX < HUG_BUNNY_R) { this.bunnyX = HUG_BUNNY_R; this.bunnyVX *= -1; }
        if (this.bunnyX > BW - HUG_BUNNY_R) { this.bunnyX = BW - HUG_BUNNY_R; this.bunnyVX *= -1; }

        // Centre "hug zone" — easy to see.
        ctx.fillStyle = this.hugFlash > 0 ? 'rgba(95,168,96,0.45)' : 'rgba(107,74,127,0.30)';
        ctx.fillRect(BW / 2 - HUG_TOL, 0, HUG_TOL * 2, BH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(BW / 2, 0);
        ctx.lineTo(BW / 2, BH);
        ctx.stroke();

        if (this.hugFlash > 0) this.hugFlash -= dt;

        this.drawBunny(ctx, this.bunnyX, BH / 2, HUG_BUNNY_R);
    };

    win = () => {
        this.stopGame();
        this.setState({ gameActive: false, paragraphText: "You dodged every bunny! Mugi is impressed." });
    };

    hugEnd = () => {
        this.stopGame();
        this.setState({
            gameActive: false,
            paragraphText: `Time's up! You hugged Mugi ${this.hugs} time${this.hugs === 1 ? '' : 's'}. Mugi feels loved.`,
        });
    };

    // Death: Mugi eats a carrot again (reuse the carrot overlay).
    die = () => {
        this.stopGame();
        this.setState({ gameActive: false, showItem: true, paragraphText: "A bunny hits you! Mugi happily eats a carrot... and you. GAME OVER." });
        setTimeout(() => this.setState({ showItem: false, paragraphText: "This is Mugi, We like Mugi" }), 2800);
    };

    act = () => {
        if (this.state.gameActive) return;
        this.mode = 'hug';
        this.bunnyX = HUG_BUNNY_R;
        this.bunnyVX = 170;
        this.hugs = 0;
        this.hugFlash = 0;
        this.elapsed = 0;
        this.lastTime = null;
        this.running = true;
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        this.setState(
            { gameActive: true, showItem: false, paragraphText: "Hug Mugi! Press SPACE when the bunny is in the middle!" },
            () => { this.rafId = requestAnimationFrame(this.loop); }
        );
    };
    item = () => {
        if (this.state.gameActive || this.state.itemMenu) return;
        const mood = shuffle(Object.keys(EMOTIONS))[0];
        // Guarantee one matching item, fill the rest from the others, then shuffle.
        const match = shuffle(ITEMS.filter((i) => i.emotion === mood))[0];
        const others = shuffle(ITEMS.filter((i) => i !== match)).slice(0, 3);
        this.setState({
            itemMenu: true,
            mugiEmotion: mood,
            itemChoices: shuffle([match, ...others]),
            paragraphText: `Mugi looks ${mood}. Offer Mugi an item!`,
        });
    };

    chooseItem = (it) => {
        const correct = it.emotion === this.state.mugiEmotion;
        const msg = correct
            ? `You offer the ${it.name}. Just what a ${this.state.mugiEmotion} Mugi wanted! ❤️`
            : `You offer the ${it.name} — that's a ${it.emotion} item. Mugi stays ${this.state.mugiEmotion}.`;
        this.setState({ itemMenu: false, mugiEmotion: null, itemChoices: [], paragraphText: msg });
    };
    mercy = () => this.changeParagraph("Mugi is feeling merciful today.");

    render() {
        const { gameActive, itemMenu } = this.state;
        return (
        <div className="mainBody">
            <div className="mugiArea" ref={this.areaRef}>
                <button className="fullscreenBtn" onClick={this.toggleFullscreen}>⛶ Fullscreen</button>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={mugi} className="App-logo" alt="logo" />
                    {this.state.showItem && (
                        <img src={Carrot} alt="" className="item-overlay" />
                    )}
                </div>

                <p>
                {this.state.paragraphText}
                </p>

                {gameActive && (
                    <canvas
                        ref={this.canvasRef}
                        className="battleCanvas"
                        width={BW}
                        height={BH}
                    />
                )}

                {itemMenu && (
                    <div className="itemMenu">
                        <div className="emotionBanner" role="img" aria-label={`Mugi is ${this.state.mugiEmotion}`}>
                            {EMOTIONS[this.state.mugiEmotion]} Mugi is {this.state.mugiEmotion}
                        </div>
                        <div className="itemGrid">
                            {this.state.itemChoices.map((it) => (
                                <button key={it.name} className="itemMenuBtn" onClick={() => this.chooseItem(it)}>
                                    {it.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!gameActive && !itemMenu && (
                <div className="ActionBar">
                    <img
                        src={this.state.hovered === 'Fight' ? Fight_Selected : Fight}
                        alt="Fight"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Fight')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.fight}
                        onKeyDown={this.onKeyActivate(this.fight)}
                    />
                    <img
                        src={this.state.hovered === 'Act' ? Act_Selected : Act}
                        alt="Act"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Act')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.act}
                        onKeyDown={this.onKeyActivate(this.act)}
                    />
                    <img
                        src={this.state.hovered === 'Item' ? Item_Selected : Item}
                        alt="Item"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Item')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.item}
                        onKeyDown={this.onKeyActivate(this.item)}
                    />
                    <img
                        src={this.state.hovered === 'Mercy' ? Mercy_Selected : Mercy}
                        alt="Mercy"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Mercy')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.mercy}
                        onKeyDown={this.onKeyActivate(this.mercy)}
                    />
                </div>
                )}
            </div>
            </div>
    );

    }
}

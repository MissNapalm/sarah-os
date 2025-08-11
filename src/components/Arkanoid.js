import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Ultranoid — Enhanced space shooter with flying saucers
 * - Ball bounces off enemies and destroys them instantly
 * - Level progression system with increasing difficulty
 * - Complete audio system with background music and sound effects
 * - Glowing visual effects and starfield background
 * - Pause/resume functionality
 * - NEW: Mega Man–style charge shot (hold LMB 3s → big, double-damage shot)
 */

const DPR = typeof window !== 'undefined'
  ? Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  : 1;

function Ultranoid({ onClose }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // dragging
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const desiredPosRef = useRef({
    x: Math.max(50, (window.innerWidth - 520) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 420) / 2, window.innerHeight - 425)),
  });
  const lastDragRafRef = useRef(0);

  // UI-only state (throttled)
  const [ui, setUi] = useState({ score: 0, health: 5, started: false, level: 1, paused: false });

  // Config (tuned)
  const cfg = useMemo(() => ({
    W: 480,
    H: 340,
    paddleW: 80,
    paddleH: 10,
    ballR: 8,

    // Player bullets
    playerBulletW: 3,
    playerBulletH: 10,
    playerBulletSpeed: 3.9, // 30% faster (3 * 1.3 = 3.9)

    // BIG charge shot (auto-fires after 3s of hold)
    chargeTimeMs: 3000,
    bigBulletW: 8,
    bigBulletH: 22,
    bigBulletSpeed: 4.16, // 30% faster (3.2 * 1.3 = 4.16)
    bigBulletDamage: 2,    // <- double damage
    bigBulletColor: '#80FFEA',

    // Enemies
    enemySize: 31,
    enemySpawnFrames: 120,
    enemyBaseSpeed: 0.6,
    enemyBulletW: 6,
    enemyBulletH: 6,
    enemyBulletSpeed: 2.2,
    enemyFireMs: 500,
    maxEnemies: 6,

    // Bricks
    brickRows: 3,
    brickCols: 8,
    brickW: 52,
    brickH: 20,
    brickPad: 3,
    brickTop: 30,
    brickLeft: 25,

    // Particles
    maxParticles: 200,

    // Ball
    ballSpeed: 1.8,
  }), []);

  // Game state (mutable)
  const gameRef = useRef(null);

  // Assets
  const emojiSpriteRef = useRef(null);
  const emojiSizeRef = useRef(64);
  const bgPatternRef = useRef(null);
  const bgOffRef = useRef({ x: 0, y: 0 });
  const audioRef = useRef(null);
  const laserSoundRef = useRef(null);
  const raygunSoundRef = useRef(null);
  const blipSoundRef = useRef(null);
  const chargeHumRef = useRef(null); // optional subtle charge hum

  const initBricks = useCallback(() => {
    const b = [];
    for (let c = 0; c < cfg.brickCols; c++) {
      b[c] = [];
      for (let r = 0; r < cfg.brickRows; r++) {
        const x = c * (cfg.brickW + cfg.brickPad) + cfg.brickLeft;
        const y = r * (cfg.brickH + cfg.brickPad) + cfg.brickTop;
        b[c][r] = { x, y, status: 1, health: 4 };
      }
    }
    return b;
  }, [cfg]);

  const resetGame = useCallback(() => {
    const bricks = initBricks();
    gameRef.current = {
      started: false,
      paused: false,
      score: 0,
      health: 5,
      level: 1,
      frames: 0,
      enemySpawnTimer: 0,

      paddleX: 200,
      ball: { x: 240, y: 240, dx: cfg.ballSpeed, dy: -cfg.ballSpeed },
      bricks,
      enemies: [],
      playerBullets: [],
      enemyBullets: [],

      // Charge shot state
      isCharging: false,
      chargeStart: 0,
      chargeFired: false, // auto-fired at threshold

      // Particles
      particles: new Array(cfg.maxParticles).fill(0).map(() => ({
        active: false, x:0, y:0, dx:0, dy:0, life:0, maxLife:0, size:0, color:'#fff'
      })),
      pIndex: 0,
    };
    setUi({ score: 0, health: 5, started: false, level: 1, paused: false });
  }, [cfg.maxParticles, initBricks]);

  useEffect(() => { resetGame(); }, [resetGame]);

  // Audio
  useEffect(() => {
    const audio = new Audio('/battle.mp3');
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    const laserSound = new Audio('/Lasers.wav');
    laserSound.volume = 0.3;
    laserSoundRef.current = laserSound;

    const raygunSound = new Audio('/Raygun.wav');
    raygunSound.volume = 0.3;
    raygunSoundRef.current = raygunSound;

    const blipSound = new Audio('/Bamage.wav');
    blipSound.volume = 0.32;
    blipSound.playbackRate = 1.3;
    blipSoundRef.current = blipSound;

    // Optional subtle charge hum
    const chargeHum = new Audio('/charge_hum.mp3');
    chargeHum.loop = true;
    chargeHum.volume = 0.18;
    chargeHumRef.current = chargeHum;

    (async () => {
      try { await audio.play(); } catch {}
    })();

    return () => {
      for (const ref of [audioRef, laserSoundRef, raygunSoundRef, blipSoundRef, chargeHumRef]) {
        if (ref.current) {
          try { ref.current.pause(); } catch {}
          ref.current.currentTime = 0;
          ref.current = null;
        }
      }
    };
  }, []);

  // Dragging via transform
  const onMouseDownShell = (e) => {
    if (!wrapRef.current) return;
    if (e.target === wrapRef.current || e.target.closest('.drag-handle')) {
      draggingRef.current = true;
      const rect = wrapRef.current.getBoundingClientRect();
      dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();
    }
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current || !wrapRef.current) return;
      const target = desiredPosRef.current;
      target.x = e.clientX - dragOffsetRef.current.x;
      target.y = e.clientY - dragOffsetRef.current.y;
      if (!lastDragRafRef.current) {
        lastDragRafRef.current = requestAnimationFrame(() => {
          const { x, y } = desiredPosRef.current;
          if (wrapRef.current) wrapRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
          lastDragRafRef.current = 0;
        });
      }
    };
    const onUp = () => { draggingRef.current = false; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseup', onUp, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Canvas & assets setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = Math.floor(cfg.W * DPR);
    canvas.height = Math.floor(cfg.H * DPR);
    canvas.style.width = `${cfg.W}px`;
    canvas.style.height = `${cfg.H}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Enemy sprite (image or fallback)
    const size = 64;
    const enemyImg = new Image();
    enemyImg.src = '/enemy.png';
    enemyImg.onload = () => {
      const off = document.createElement('canvas');
      off.width = size; off.height = size;
      const octx = off.getContext('2d');
      octx.drawImage(enemyImg, 0, 0, size, size);
      emojiSpriteRef.current = off;
      emojiSizeRef.current = size;
    };
    enemyImg.onerror = () => {
      const off = document.createElement('canvas');
      off.width = size; off.height = size;
      const octx = off.getContext('2d');
      octx.fillStyle = '#FF4444';
      octx.beginPath(); octx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2); octx.fill();
      octx.fillStyle = '#000'; octx.fillRect(size/2 - 12, size/2 - 8, 6, 6); octx.fillRect(size/2 + 6, size/2 - 8, 6, 6);
      octx.beginPath(); octx.arc(size/2, size/2 + 8, 8, 0, Math.PI); octx.stroke();
      emojiSpriteRef.current = off;
      emojiSizeRef.current = size;
    };

    // Starfield
    const starCount = 450;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * cfg.W,
        y: Math.random() * cfg.H,
        z: Math.random() * 1000,
        brightness: 0.3 + Math.random() * 0.7,
        size: 0.5 + Math.random() * 1.5
      });
    }
    bgPatternRef.current = stars;
  }, [cfg.H, cfg.W]);

  // Helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const rectCircleOverlap = (rx, ry, rw, rh, cx, cy, cr) => {
    const cxn = clamp(cx, rx, rx + rw);
    const cyn = clamp(cy, ry, ry + rh);
    const dx = cx - cxn, dy = cy - cyn;
    return (dx*dx + dy*dy) <= cr*cr;
  };

  // Particles
  const spawnParticles = (g, x, y, color, count = 4, speed = 2, type = 'normal') => {
    const availableSlots = g.particles.filter(p => !p.active).length;
    const actualCount = Math.min(count, Math.max(0, availableSlots - 30));
    for (let i = 0; i < actualCount; i++) {
      const p = g.particles[g.pIndex];
      if (p.active) { g.pIndex = (g.pIndex + 1) % g.particles.length; i--; continue; }
      p.active = true;
      p.x = x; p.y = y;
      if (type === 'explosion') {
        const angle = (i / Math.max(1, actualCount)) * Math.PI * 2;
        p.dx = Math.cos(angle) * speed * (1 + Math.random());
        p.dy = Math.sin(angle) * speed * (1 + Math.random());
        p.life = 15 + Math.random() * 10;
        p.size = 1.2 + Math.random() * 1.5;
      } else if (type === 'trail') {
        p.dx = (Math.random() - 0.5) * speed * 0.5;
        p.dy = (Math.random() - 0.5) * speed * 0.5;
        p.life = 8 + Math.random() * 6;
        p.size = 0.6 + Math.random() * 0.8;
      } else {
        p.dx = (Math.random() - 0.5) * speed * 1.8;
        p.dy = (Math.random() - 0.5) * speed * 1.8;
        p.life = 12 + Math.random() * 10;
        p.size = 0.8 + Math.random() * 1.2;
      }
      p.maxLife = p.life;
      p.color = color;
      g.pIndex = (g.pIndex + 1) % g.particles.length;
    }
  };

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameRef.current) return;
    const ctx = canvas.getContext('2d');
    let lastUiPush = 0;

    const drawBackground = (g) => {
      const stars = bgPatternRef.current;
      if (!stars) return;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= 2;
        if (star.z <= 0) {
          star.z = 1000; star.x = Math.random() * cfg.W; star.y = Math.random() * cfg.H;
        }
        const scale = 100 / star.z;
        const screenX = star.x + (star.x - cfg.W / 2) * scale * 0.05;
        const screenY = star.y + (star.y - cfg.H / 2) * scale * 0.05;
        const alpha = star.brightness * (1 - star.z / 1000) * 0.6;
        const size = Math.min(star.size * scale * 0.3, 2.5);
        if (alpha > 0.05 && size > 0.2 && screenX > -10 && screenX < cfg.W + 10 && screenY > -10 && screenY < cfg.H + 10) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = Math.min(size * 1.5, 4);
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.5, size), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    const drawBricks = (g) => {
      for (let c = 0; c < cfg.brickCols; c++) {
        for (let r = 0; r < cfg.brickRows; r++) {
          const b = g.bricks[c][r];
          if (b.status !== 1) continue;
          const ratio = b.health / 4;
          const color = ratio === 1 ? '#0095DD' : ratio === 0.75 ? '#00DD95' : ratio === 0.5 ? '#DDDD00' : '#DD4400';
          ctx.save();
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(b.x, b.y, cfg.brickW, cfg.brickH, 6); ctx.fill(); }
          else { ctx.fillRect(b.x, b.y, cfg.brickW, cfg.brickH); }
          ctx.restore();
        }
      }
    };

    const drawPaddle = (g) => {
      // charge indicator glow
      if (g.isCharging) {
        const t = Math.min(1, (performance.now() - g.chargeStart) / cfg.chargeTimeMs);
        const glow = 8 + t * 18;
        ctx.save();
        ctx.shadowColor = '#80FFEA';
        ctx.shadowBlur = glow;
        ctx.fillStyle = 'rgba(128,255,234,0.3)';
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(g.paddleX - 4, cfg.H - cfg.paddleH - 14, cfg.paddleW + 8, cfg.paddleH + 8, 10); ctx.fill(); }
        ctx.restore();
      }
      ctx.save();
      ctx.fillStyle = '#0095DD';
      ctx.shadowColor = '#0095DD';
      ctx.shadowBlur = 10;
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(g.paddleX, cfg.H - cfg.paddleH - 10, cfg.paddleW, cfg.paddleH, 8); ctx.fill(); }
      else { ctx.fillRect(g.paddleX, cfg.H - cfg.paddleH - 10, cfg.paddleW, cfg.paddleH); }
      ctx.restore();
    };

    const drawBall = (g) => {
      ctx.save();
      ctx.fillStyle = '#00DDFF';
      ctx.shadowColor = '#00DDFF';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(g.ball.x, g.ball.y, cfg.ballR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPlayerBullets = (g) => {
      for (let i = 0; i < g.playerBullets.length; i++) {
        const b = g.playerBullets[i];
        // trail
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = b.isBig ? cfg.bigBulletColor : '#FFFFAA';
        ctx.lineWidth = b.isBig ? 3 : 2;
        ctx.lineCap = 'round';
        const trail = b.isBig ? 10 : 6;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + trail);
        ctx.stroke();
        ctx.restore();

        // body
        ctx.save();
        if (b.isBig) {
          ctx.fillStyle = cfg.bigBulletColor;
          ctx.shadowColor = cfg.bigBulletColor;
          ctx.shadowBlur = 10;
          if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(b.x - cfg.bigBulletW/2, b.y, cfg.bigBulletW, cfg.bigBulletH, 4); ctx.fill(); }
          else { ctx.fillRect(b.x - cfg.bigBulletW/2, b.y, cfg.bigBulletW, cfg.bigBulletH); }
        } else {
          ctx.fillStyle = '#FFFFAA';
          ctx.fillRect(b.x - cfg.playerBulletW / 2, b.y, cfg.playerBulletW, cfg.playerBulletH);
        }
        ctx.restore();
      }
    };

    const drawEnemyBullets = (g) => {
      for (let i = 0; i < g.enemyBullets.length; i++) {
        const b = g.enemyBullets[i];
        // trail
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#FF6644';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const trailLength = 8;
        const speed = Math.sqrt((b.dx || 0)**2 + (b.dy || cfg.enemyBulletSpeed)**2);
        const ndx = speed ? -(b.dx || 0) / speed : 0;
        const ndy = speed ? -(b.dy || cfg.enemyBulletSpeed) / speed : -1;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + ndx * trailLength, b.y + ndy * trailLength);
        ctx.stroke();
        ctx.restore();

        // body
        ctx.save();
        ctx.fillStyle = '#FF6644';
        ctx.shadowColor = '#FF6644';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(b.x, b.y, cfg.enemyBulletW / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawParticles = (g) => {
      const particles = g.particles;
      let activeCount = 0;
      for (let i = 0; i < particles.length && activeCount < 80; i++) {
        const p = particles[i];
        if (!p.active || p.life <= 0) continue;
        const alpha = (p.life / p.maxLife) * 0.8;
        if (alpha <= 0.1) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        activeCount++;
      }
    };

    const drawEnemies = (g) => {
      const spr = emojiSpriteRef.current;
      const base = emojiSizeRef.current || 64;
      const drawSize = cfg.enemySize * 1.1;
      if (!spr) return;
      for (let i = 0; i < g.enemies.length; i++) {
        const e = g.enemies[i];
        const hover = Math.sin(Date.now() * 0.003 + e.ox) * 1.5;
        if (e.flashTime > 0) {
          ctx.save();
          ctx.globalAlpha = e.flashTime / 15 * 0.8;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(e.x, e.y + hover, drawSize/2, drawSize/3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.save();
        ctx.shadowColor = '#666666';
        ctx.shadowBlur = 3;
        ctx.drawImage(spr, 0, 0, base, base, e.x - drawSize / 2, (e.y + hover) - drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }
    };

    const drawHUD = (g) => {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#00DDFF';
      ctx.fillText('Score: ' + g.score, 8, 20);
      ctx.fillStyle = '#FF88AA';
      ctx.fillText('Health: ' + g.health, cfg.W - 110, 20);
      ctx.fillStyle = '#FFFF00';
      ctx.fillText('Round: ' + g.level, cfg.W/2 - 30, 20);

      // charge bar (bottom center) if charging
      if (g.isCharging) {
        const t = clamp((performance.now() - g.chargeStart) / cfg.chargeTimeMs, 0, 1);
        const barW = 160, barH = 8;
        const bx = (cfg.W - barW) / 2, by = cfg.H - 14;
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(bx, by, barW, barH);
        ctx.fillStyle = cfg.bigBulletColor;
        ctx.fillRect(bx, by, barW * t, barH);
        ctx.restore();
      }

      if (!g.started) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('Click to start!', cfg.W / 2, cfg.H / 2);
        ctx.textAlign = 'left';
      }
    };

    const collideBallBricks = (g) => {
      let hit = false;
      const { ball } = g;
      for (let c = 0; c < cfg.brickCols; c++) {
        for (let r = 0; r < cfg.brickRows; r++) {
          const b = g.bricks[c][r];
          if (b.status !== 1) continue;
          if (ball.x + cfg.ballR > b.x && ball.x - cfg.ballR < b.x + cfg.brickW && ball.y + cfg.ballR > b.y && ball.y - cfg.ballR < b.y + cfg.brickH) {
            const ratio = b.health / 4;
            const col = ratio === 1 ? '#0095DD' : ratio === 0.75 ? '#00DD95' : ratio === 0.5 ? '#DDDD00' : '#DD4400';
            spawnParticles(g, b.x + cfg.brickW / 2, b.y + cfg.brickH / 2, col, 4, 2);
            b.status = 0;
            g.score += 1;
            hit = true;
            if (blipSoundRef.current) { blipSoundRef.current.currentTime = 0; blipSoundRef.current.play().catch(()=>{}); }
          }
        }
      }
      return hit;
    };

    // ball update (includes enemy bounce/kill from your earlier version)
    const updateBall = (g) => {
      if (!g.started || g.paused) return;
      let { x, y, dx, dy } = g.ball;

      const nx = x + dx;
      const ny = y + dy;

      if (nx + cfg.ballR > cfg.W || nx - cfg.ballR < 0) { dx = -dx; spawnParticles(g, nx, ny, '#00DDFF', 2, 2); }
      if (ny - cfg.ballR < 0) { dy = -dy; spawnParticles(g, nx, ny, '#00DDFF', 2, 2); }

      const pTop = cfg.H - cfg.paddleH - 10;
      if (ny + cfg.ballR > pTop && ny - cfg.ballR < pTop + cfg.paddleH && nx > g.paddleX && nx < g.paddleX + cfg.paddleW) {
        dy = -Math.abs(dy);
        const hitPos = (nx - g.paddleX) / cfg.paddleW;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        const speed = Math.sqrt(dx * dx + dy * dy);
        dx = speed * Math.sin(angle); dy = -speed * Math.cos(angle);
        spawnParticles(g, nx, pTop, '#0095DD', 3, 2);
      }

      if (ny + cfg.ballR > cfg.H) { resetGame(); return; }
      if (collideBallBricks(g)) dy = -dy;

      // enemies: kill + bounce
      const rSum = cfg.ballR + cfg.enemySize / 2;
      for (let i = 0; i < g.enemies.length; i++) {
        const e = g.enemies[i];
        const ex = nx - e.x, ey = ny - e.y;
        const d2 = ex*ex + ey*ey;
        if (d2 <= rSum * rSum) {
          spawnParticles(g, e.x, e.y, '#FF0044', 10, 3, 'explosion');
          g.score += 2;
          g.enemies.splice(i, 1);
          const dist = Math.max(0.0001, Math.sqrt(d2));
          const nxn = ex / dist, nyn = ey / dist;
          const vdotn = dx * nxn + dy * nyn;
          dx = dx - 2 * vdotn * nxn;
          dy = dy - 2 * vdotn * nyn;
          const overlap = rSum - dist + 0.5;
          x = nx + nxn * overlap;
          y = ny + nyn * overlap;
          break;
        }
      }

      g.ball.x = x + dx;
      g.ball.y = y + dy;
      g.ball.dx = dx;
      g.ball.dy = dy;
    };

    const spawnEnemies = (g) => {
      if (!g.started || g.paused || g.enemies.length >= cfg.maxEnemies) return;
      if (g.enemySpawnTimer++ >= cfg.enemySpawnFrames) {
        const e = {
          x: Math.random() * (cfg.W - cfg.enemySize) + cfg.enemySize / 2,
          y: -cfg.enemySize,
          dx: 0, dy: 1,
          health: 2,
          flashTime: 0,
          baseSpeed: cfg.enemyBaseSpeed,
          ox: Math.random() * Math.PI * 2,
          oy: Math.random() * Math.PI * 2,
          lastShot: performance.now() + Math.random() * 500,
          horizontalIntensity: 2.2 + Math.random() * 0.8,
        };
        g.enemies.push(e);
        g.enemySpawnTimer = 0;
      }
    };

    const updateEnemies = (g) => {
      if (g.paused || g.enemies.length === 0) return;
      const now = performance.now();
      const t = Date.now() * 0.002;
      const out = [];
      for (let i = 0; i < g.enemies.length; i++) {
        const e = g.enemies[i];
        if (e.flashTime > 0) e.flashTime--;
        const hx = Math.sin(t + e.ox) * e.horizontalIntensity * 0.6;
        const dx = hx * e.baseSpeed * 0.5;
        const dy = e.baseSpeed;
        let x = e.x + dx, y = e.y + dy;
        const half = cfg.enemySize / 2;
        if (x <= half || x >= cfg.W - half) { e.ox += Math.PI; x = clamp(x, half, cfg.W - half); }

        if (Math.random() < 0.008 && now - (e.lastShot || 0) >= cfg.enemyFireMs) {
          const paddleX = g.paddleX + cfg.paddleW / 2;
          const paddleY = cfg.H - cfg.paddleH - 10;
          const vx = paddleX - x, vy = paddleY - y;
          const mag = Math.sqrt(vx*vx + vy*vy) || 1;
          g.enemyBullets.push({ x, y: y + half + 2, dx: (vx/mag)*cfg.enemyBulletSpeed, dy: (vy/mag)*cfg.enemyBulletSpeed });
          if (raygunSoundRef.current) { raygunSoundRef.current.currentTime = 0; raygunSoundRef.current.play().catch(()=>{}); }
          spawnParticles(g, x, y, '#FF8844', 4, 1.8, 'explosion');
          e.lastShot = now;
        }
        e.x = x; e.y = y;
        if (y < cfg.H + cfg.enemySize) out.push(e);
      }
      g.enemies = out;
    };

    const updateEnemyBullets = (g) => {
      if (g.paused) return;
      const pTop = cfg.H - cfg.paddleH - 10;
      const out = [];
      let tookDamage = false;
      for (let i = 0; i < g.enemyBullets.length; i++) {
        const b = g.enemyBullets[i];
        const nx = b.x + (b.dx || 0);
        const ny = b.y + (b.dy || cfg.enemyBulletSpeed);
        const r = cfg.enemyBulletW / 2;
        if (ny + r >= pTop && ny - r <= pTop + cfg.paddleH && nx + r >= g.paddleX && nx - r <= g.paddleX + cfg.paddleW) {
          tookDamage = true;
          spawnParticles(g, nx, pTop, '#FF88AA', 6, 2.5, 'explosion');
          continue;
        }
        if (nx > -10 && nx < cfg.W + 10 && ny > -10 && ny < cfg.H + 10) {
          out.push({ x: nx, y: ny, dx: b.dx, dy: b.dy });
          if (b.dx && Math.random() < 0.4) spawnParticles(g, nx, ny, '#FF3322', 1, 0.5, 'trail');
        }
      }
      g.enemyBullets = out;
      if (tookDamage) {
        g.health = Math.max(0, g.health - 1);
        if (g.health <= 0) { resetGame(); }
      }
    };

    const updatePlayerBullets = (g) => {
      if (g.paused || g.playerBullets.length === 0) return;
      const out = [];
      const halfEnemy = cfg.enemySize / 2;

      bulletLoop:
      for (let i = 0; i < g.playerBullets.length; i++) {
        const b = g.playerBullets[i];

        // Bricks
        for (let c = 0; c < cfg.brickCols; c++) {
          for (let r = 0; r < cfg.brickRows; r++) {
            const br = g.bricks[c][r];
            if (br.status !== 1) continue;
            const bw = b.isBig ? cfg.bigBulletW : cfg.playerBulletW;
            const bh = b.isBig ? cfg.bigBulletH : cfg.playerBulletH;
            if (b.x > br.x && b.x < br.x + cfg.brickW && b.y < br.y + cfg.brickH && b.y + bh > br.y) {
              const dmg = b.damage || 1;
              const ratio = br.health / 4;
              const col = ratio === 1 ? '#0095DD' : ratio === 0.75 ? '#00DD95' : ratio === 0.5 ? '#DDDD00' : '#DD4400';
              spawnParticles(g, b.x, b.y, col, 3 + (dmg-1)*2, 2 + (dmg-1), dmg > 1 ? 'explosion' : 'normal');
              br.health -= dmg;
              if (br.health <= 0) {
                br.status = 0; g.score += 1;
                spawnParticles(g, br.x + cfg.brickW / 2, br.y + cfg.brickH / 2, col, 6 + (dmg-1)*3, 2.5 + (dmg-1), 'explosion');
              }
              if (blipSoundRef.current) { blipSoundRef.current.currentTime = 0; blipSoundRef.current.play().catch(()=>{}); }
              continue bulletLoop;
            }
          }
        }

        // Enemies
        for (let j = 0; j < g.enemies.length; j++) {
          const e = g.enemies[j];
          const dx = b.x - e.x, dy = b.y - e.y;
          if (dx*dx + dy*dy <= halfEnemy*halfEnemy) {
            const dmg = b.damage || 1;
            spawnParticles(g, b.x, b.y, '#FF4466', 3 + (dmg-1)*2, 2 + (dmg-1));
            e.health -= dmg; e.flashTime = 12;
            if (e.health <= 0) {
              g.score += 2;
              spawnParticles(g, e.x, e.y, '#FF0044', 8 + (dmg-1)*4, 3 + (dmg-1), 'explosion');
              g.enemies.splice(j, 1);
            }
            continue bulletLoop;
          }
        }

        // Move bullet
        const speed = b.isBig ? cfg.bigBulletSpeed : cfg.playerBulletSpeed;
        const ny = b.y - speed;
        if (ny > 0) out.push({ ...b, y: ny });
      }
      g.playerBullets = out;
    };

    const updateParticles = (g) => {
      const particles = g.particles;
      let activeCount = 0;
      for (let i = 0; i < particles.length && activeCount < 50; i++) {
        const p = particles[i];
        if (!p.active) continue;
        p.x += p.dx; p.y += p.dy;
        p.dx *= 0.95; p.dy *= 0.95;
        p.life -= 1.5;
        if (p.life <= 0) p.active = false;
        else activeCount++;
      }
    };

    const checkLevelComplete = (g) => {
      let remaining = 0;
      for (let c = 0; c < cfg.brickCols; c++) for (let r = 0; r < cfg.brickRows; r++) if (g.bricks[c][r].status === 1) remaining++;
      if (remaining === 0) {
        g.level += 1; g.score += 50;
        spawnParticles(g, cfg.W/2, cfg.H/2, '#00FF00', 20, 4, 'explosion');
        spawnParticles(g, cfg.W/4, cfg.H/3, '#FFFF00', 15, 3, 'explosion');
        spawnParticles(g, 3*cfg.W/4, cfg.H/3, '#FF00FF', 15, 3, 'explosion');
        const nb = initBricks();
        const extra = Math.min(3, Math.floor((g.level - 1) / 2));
        for (let c = 0; c < cfg.brickCols; c++) for (let r = 0; r < cfg.brickRows; r++) nb[c][r].health = 4 + extra;
        g.bricks = nb;
        g.enemies = []; g.enemyBullets = []; g.playerBullets = [];
        g.ball.x = 240; g.ball.y = 240; g.ball.dx = cfg.ballSpeed; g.ball.dy = -cfg.ballSpeed;
        if (blipSoundRef.current) { blipSoundRef.current.currentTime = 0; blipSoundRef.current.play().catch(()=>{}); }
      }
    };

    // Auto-fire big shot at full charge
    const checkChargeAutoFire = (g) => {
      if (!g.isCharging || g.paused) return;
      const elapsed = performance.now() - g.chargeStart;
      if (elapsed >= cfg.chargeTimeMs && !g.chargeFired) {
        fireBullet(g, true); // big bullet
        g.isCharging = false;
        g.chargeFired = true;
        if (chargeHumRef.current) { try { chargeHumRef.current.pause(); } catch {} }
      }
    };

    const fireBullet = (g, isBig = false) => {
      const x = g.paddleX + cfg.paddleW / 2;
      const y = cfg.H - cfg.paddleH - 20;
      if (isBig) {
        g.playerBullets.push({ x, y, isBig: true, damage: cfg.bigBulletDamage });
      } else {
        g.playerBullets.push({ x, y, isBig: false, damage: 1 });
      }
      if (laserSoundRef.current) { laserSoundRef.current.currentTime = 0; laserSoundRef.current.play().catch(()=>{}); }
      spawnParticles(g, x, y, isBig ? cfg.bigBulletColor : '#FFFFAA', isBig ? 8 : 3, isBig ? 2.2 : 1.5, 'explosion');
    };

    const loop = () => {
      const g = gameRef.current;
      if (!g) return;

      // Clear
      ctx.fillStyle = 'rgba(0, 10, 25, 1)';
      ctx.fillRect(0, 0, cfg.W, cfg.H);

      drawBackground(g);
      drawBricks(g);
      drawPaddle(g);
      drawBall(g);
      drawPlayerBullets(g);
      drawEnemies(g);
      drawEnemyBullets(g);
      if (g.particles.some(p => p.active)) drawParticles(g);
      drawHUD(g);

      // Update
      updateBall(g);
      spawnEnemies(g);
      updateEnemies(g);
      updateEnemyBullets(g);
      updatePlayerBullets(g);
      updateParticles(g);
      checkLevelComplete(g);
      checkChargeAutoFire(g);

      // Throttle HUD
      const now = performance.now();
      if (now - lastUiPush > 150) {
        lastUiPush = now;
        setUi(prev => {
          if (prev.score !== g.score || prev.health !== g.health || prev.started !== g.started || prev.level !== g.level || prev.paused !== g.paused) {
            return { score: g.score, health: g.health, started: g.started, level: g.level, paused: g.paused };
          }
          return prev;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [cfg, resetGame, initBricks]);

  // Input
  const onCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const g = gameRef.current;
    if (!canvas || !g) return;
    const rect = canvas.getBoundingClientRect();
    const rx = e.clientX - rect.left;
    if (rx > 0 && rx < cfg.W) g.paddleX = clamp(rx - cfg.paddleW / 2, 0, cfg.W - cfg.paddleW);
  };

  // NEW: charge-shot input
  const startChargingIfNeeded = () => {
    const g = gameRef.current;
    if (!g) return;
    // start music on first interaction
    if (audioRef.current && audioRef.current.paused) { audioRef.current.play().catch(()=>{}); }

    if (!g.started) {
      g.started = true;
      setUi(prev => ({ ...prev, started: true }));
      return;
    }
    if (!g.isCharging) {
      g.isCharging = true;
      g.chargeStart = performance.now();
      g.chargeFired = false;
      // play charge hum softly
      if (chargeHumRef.current) {
        try { chargeHumRef.current.currentTime = 0; chargeHumRef.current.play(); } catch {}
      }
    }
  };

  const releaseChargeOrShoot = () => {
    const g = gameRef.current;
    if (!g || !g.started) return;

    // If we already auto-fired at full charge, nothing to do
    if (g.chargeFired) { g.isCharging = false; g.chargeFired = false; return; }

    const held = performance.now() - (g.chargeStart || 0);
    const fullyCharged = held >= cfg.chargeTimeMs;

    // stop charge hum
    if (chargeHumRef.current) { try { chargeHumRef.current.pause(); } catch {} }

    if (g.isCharging) {
      // Fire big if fully charged; else normal
      const isBig = fullyCharged;
      // eslint-disable-next-line no-use-before-define
      fireImmediate(g, isBig);
    } else {
      // quick tap (if not in charging state for some reason)
      // eslint-disable-next-line no-use-before-define
      fireImmediate(g, false);
    }
    g.isCharging = false;
    g.chargeFired = false;
  };

  // local wrapper used by release and auto
  const fireImmediate = (g, isBig) => {
    const x = g.paddleX + cfg.paddleW / 2;
    const y = cfg.H - cfg.paddleH - 20;
    if (isBig) g.playerBullets.push({ x, y, isBig: true, damage: cfg.bigBulletDamage });
    else g.playerBullets.push({ x, y, isBig: false, damage: 1 });
    if (laserSoundRef.current) { laserSoundRef.current.currentTime = 0; laserSoundRef.current.play().catch(()=>{}); }
    spawnParticles(g, x, y, isBig ? cfg.bigBulletColor : '#FFFFAA', isBig ? 8 : 3, isBig ? 2.2 : 1.5, 'explosion');
  };

  // initial placement
  useEffect(() => {
    if (wrapRef.current) {
      const { x, y } = desiredPosRef.current;
      wrapRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      wrapRef.current.style.willChange = 'transform';
    }
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseDown={onMouseDownShell}
      style={{
        position: 'fixed',
        width: '520px',
        height: '420px',
        background: 'rgba(10, 15, 30, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(100, 150, 255, 0.3)',
        borderRadius: '20px',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 50px rgba(0, 221, 255, 0.2)
        `,
        cursor: 'grab',
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <div
        className="drag-handle"
        style={{
          height: '60px',
          background: 'linear-gradient(135deg, rgba(0, 221, 255, 0.2) 0%, rgba(100, 150, 255, 0.1) 100%)',
          borderBottom: '1px solid rgba(0, 221, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00ddff 0%, #0095dd 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 221, 255, 0.5)'
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{
              margin: 0,
              color: 'rgba(0, 221, 255, 1)',
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '-0.5px',
              textShadow: '0 0 10px rgba(0, 221, 255, 0.5)'
            }}>
              Ultranoid
            </h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
              Score: {ui.score} &nbsp;•&nbsp; Health: {ui.health} &nbsp;•&nbsp; Round: {ui.level}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              const g = gameRef.current;
              if (g && g.started) {
                g.paused = !g.paused;
                setUi(prev => ({ ...prev, paused: g.paused }));
              } else {
                resetGame();
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(0, 221, 255, 0.1)',
              color: 'rgba(0, 221, 255, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            title={gameRef.current?.started ? (ui.paused ? "Resume Game" : "Pause Game") : "Reset Game"}
          >
            {gameRef.current?.started ? (ui.paused ? '▶️' : '⏸️') : '🔄'}
          </button>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 59, 92, 0.1)',
              color: 'rgba(255, 59, 92, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div style={{
        padding: '20px',
        height: 'calc(100% - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={cfg.W}
          height={cfg.H}
          style={{
            border: '2px solid rgba(0, 221, 255, 0.4)',
            borderRadius: '8px',
            background: 'radial-gradient(ellipse at center, rgba(0, 20, 40, 1) 0%, rgba(0, 10, 25, 1) 100%)',
            boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 221, 255, 0.3)',
            cursor: 'crosshair'
          }}
          onMouseMove={onCanvasMouseMove}
          onClick={() => {
            const g = gameRef.current;
            if (!g) return;
            
            // Start music on first click
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().catch(() => {});
            }
            
            if (!g.started) {
              g.started = true;
              setUi(prev => ({ ...prev, started: true }));
            } else if (!g.paused) {
              // Fire normal bullet on click
              const x = g.paddleX + cfg.paddleW / 2;
              const y = cfg.H - cfg.paddleH - 20;
              g.playerBullets.push({ x, y, isBig: false, damage: 1 });
              if (laserSoundRef.current) {
                laserSoundRef.current.currentTime = 0;
                laserSoundRef.current.play().catch(() => {});
              }
            }
          }}
        />
      </div>
     </div>
  );
}

export default Ultranoid;
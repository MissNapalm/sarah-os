import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Ultranoid — fast version with angry-emoji enemies
 * - Single rAF    // Build flying saucer sprite once
    const si    // Build flying saucer sprite once
    const size = 64;
    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    
    // Draw flying saucer
    const centerX = size / 2;
    const centerY = size / 2;
    const saucerWidth = size * 0.8;
    const saucerHeight = size * 0.35;
    
    // Main saucer body (ellipse)
    octx.save();
    octx.fillStyle = '#666666';
    octx.shadowColor = '#333333';
    octx.shadowBlur = 4;
    octx.beginPath();
    octx.ellipse(centerX, centerY, saucerWidth/2, saucerHeight/2, 0, 0, Math.PI * 2);
    octx.fill();
    octx.restore();
    
    // Top dome
    octx.save();
    octx.fillStyle = '#888888';
    octx.shadowColor = '#444444';
    octx.shadowBlur = 2;
    octx.beginPath();
    octx.ellipse(centerX, centerY - saucerHeight/4, saucerWidth/3, saucerHeight/3, 0, 0, Math.PI * 2);
    octx.fill();
    octx.restore();
    
    // Bottom detail ring
    octx.strokeStyle = '#444444';
    octx.lineWidth = 2;
    octx.beginPath();
    octx.ellipse(centerX, centerY + saucerHeight/6, saucerWidth/2 - 2, saucerHeight/3, 0, 0, Math.PI * 2);
    octx.stroke();
    
    // Small lights around the edge
    octx.fillStyle = '#FF4444';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const lightX = centerX + Math.cos(angle) * (saucerWidth/2 - 4);
      const lightY = centerY + Math.sin(angle) * (saucerHeight/2 - 2);
      octx.beginPath();
      octx.arc(lightX, lightY, 2, 0, Math.PI * 2);
      octx.fill();
    }
    
    emojiSpriteRef.current = off;
    emojiSizeRef.current = size;  const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    
    // Draw flying saucer
    const centerX = size / 2;
    const centerY = size / 2;
    const saucerWidth = size * 0.8;
    const saucerHeight = size * 0.35;
    
    // Main saucer body (ellipse)
    octx.save();
    octx.fillStyle = '#666666';
    octx.shadowColor = '#333333';
    octx.shadowBlur = 4;
    octx.beginPath();
    octx.ellipse(centerX, centerY, saucerWidth/2, saucerHeight/2, 0, 0, Math.PI * 2);
    octx.fill();
    octx.restore();
    
    // Top dome
    octx.save();
    octx.fillStyle = '#888888';
    octx.shadowColor = '#444444';
    octx.shadowBlur = 2;
    octx.beginPath();
    octx.ellipse(centerX, centerY - saucerHeight/4, saucerWidth/3, saucerHeight/3, 0, 0, Math.PI * 2);
    octx.fill();
    octx.restore();
    
    // Bottom detail ring
    octx.strokeStyle = '#444444';
    octx.lineWidth = 2;
    octx.beginPath();
    octx.ellipse(centerX, centerY + saucerHeight/6, saucerWidth/2 - 2, saucerHeight/3, 0, 0, Math.PI * 2);
    octx.stroke();
    
    // Small lights around the edge
    octx.fillStyle = '#FF4444';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const lightX = centerX + Math.cos(angle) * (saucerWidth/2 - 4);
      const lightY = centerY + Math.sin(angle) * (saucerHeight/2 - 2);
      octx.beginPath();
      octx.arc(lightX, lightY, 2, 0, Math.PI * 2);
      octx.fill();
    }
    
    emojiSpriteRef.current = off;
    emojiSizeRef.current = size; not setState per frame)
 * - Enemies: 😠 sprite cached on offscreen canvas
 * - Enemies fire every 1.3s; 2 hits to kill (flash + particles)
 * - Subtle particle system with pooling
 * - Background is a cached pattern (cheap "scroll" animation)
 * - Drag window via CSS transform to avoid layout thrash
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
  const [ui, setUi] = useState({ score: 0, health: 3, started: false });

  // Config - Optimized for performance (Slowed down 20%)
  const cfg = useMemo(() => ({
    W: 480,
    H: 340,
    paddleW: 80,
    paddleH: 10,
    ballR: 8,
    playerBulletW: 3,
    playerBulletH: 10,
    playerBulletSpeed: 4, // Slowed down 20% (was 5)
    enemySize: 31, // 30% smaller than 44 (was 44)
    enemySpawnFrames: 120, // 2 seconds at 60fps (was 220)
    enemyBaseSpeed: 0.8, // Much slower downward movement (was 1.5)
    enemyBulletW: 6, // Round bullets - width = diameter
    enemyBulletH: 6, // Round bullets - height = diameter
    enemyBulletSpeed: 2.9, // Slowed down 20% (was 3.6)
    enemyFireMs: 800, // Shoot much more frequently (was 1200)
    brickRows: 3,
    brickCols: 8,
    brickW: 52,
    brickH: 20,
    brickPad: 3,
    brickTop: 30,
    brickLeft: 25,
    maxParticles: 200, // Increased for cool effects
    maxEnemies: 6, // Reduced since enemies are bigger
    ballSpeed: 2.4, // Slowed down 20% (was 3)
  }), []);

  // Game state (mutable)
  const gameRef = useRef(null);

  // Cached drawing assets
  const emojiSpriteRef = useRef(null); // offscreen canvas with 😠
  const emojiSizeRef = useRef(64);
  const bgPatternRef = useRef(null); // canvas pattern
  const bgOffRef = useRef({ x: 0, y: 0 });

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
      score: 0,
      health: 3,
      frames: 0,
      enemySpawnTimer: 0,
      bgTime: 0,

      paddleX: 200,
      ball: { x: 240, y: 240, dx: cfg.ballSpeed, dy: -cfg.ballSpeed }, // Use slowed speed
      bricks,
      enemies: [],
      playerBullets: [],
      enemyBullets: [],

      // particle pool
      particles: new Array(cfg.maxParticles).fill(0).map(() => ({
        active: false, x:0, y:0, dx:0, dy:0, life:0, maxLife:0, size:0, color:'#fff'
      })),
      pIndex: 0,
    };
    setUi({ score: 0, health: 3, started: false });
  }, [cfg.maxParticles, initBricks]);

  useEffect(() => { resetGame(); }, [resetGame]);

  // Dragging via transform
  const onMouseDown = (e) => {
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
          wrapRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
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

    // DPR scale
    canvas.width = Math.floor(cfg.W * DPR);
    canvas.height = Math.floor(cfg.H * DPR);
    canvas.style.width = `${cfg.W}px`;
    canvas.style.height = `${cfg.H}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Build angry emoji sprite once - RED ANGRY FACE
    const size = 64;
    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    octx.textBaseline = 'middle';
    octx.textAlign = 'center';
    octx.font = `${size * 0.9}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    octx.fillText('�', size / 2, size / 2); // Changed to red angry face
    emojiSpriteRef.current = off;
    emojiSizeRef.current = size;

    // Background tile pattern
    const tile = document.createElement('canvas');
    tile.width = 80;
    tile.height = 80;
    const tctx = tile.getContext('2d');
    tctx.strokeStyle = 'rgba(0, 221, 255, 0.08)';
    tctx.lineWidth = 1;
    for (let x = 0; x <= 80; x += 40) { tctx.beginPath(); tctx.moveTo(x, 0); tctx.lineTo(x, 80); tctx.stroke(); }
    for (let y = 0; y <= 80; y += 40) { tctx.beginPath(); tctx.moveTo(0, y); tctx.lineTo(80, y); tctx.stroke(); }
    bgPatternRef.current = ctx.createPattern(tile, 'repeat');
  }, [cfg.H, cfg.W]);

  // Helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const rectCircleOverlap = (rx, ry, rw, rh, cx, cy, cr) => {
    const cxn = clamp(cx, rx, rx + rw);
    const cyn = clamp(cy, ry, ry + rh);
    const dx = cx - cxn, dy = cy - cyn;
    return (dx*dx + dy*dy) <= cr*cr;
  };

  // Particles (pooled) - Enhanced for cool effects
  const spawnParticles = (g, x, y, color, count = 4, speed = 2, type = 'normal') => {
    // Increase particle count for cooler effects
    const availableSlots = g.particles.filter(p => !p.active).length;
    const actualCount = Math.min(count, Math.max(0, availableSlots - 30)); 
    
    for (let i = 0; i < actualCount; i++) {
      const p = g.particles[g.pIndex];
      if (p.active) continue;
      
      p.active = true;
      p.x = x; p.y = y;
      
      if (type === 'explosion') {
        // Explosion particles spread outward
        const angle = (i / actualCount) * Math.PI * 2;
        p.dx = Math.cos(angle) * speed * (1 + Math.random());
        p.dy = Math.sin(angle) * speed * (1 + Math.random());
        p.life = 15 + Math.random() * 10;
        p.size = 1.2 + Math.random() * 1.5;
      } else if (type === 'trail') {
        // Trail particles with gentle drift
        p.dx = (Math.random() - 0.5) * speed * 0.5;
        p.dy = (Math.random() - 0.5) * speed * 0.5;
        p.life = 8 + Math.random() * 6;
        p.size = 0.6 + Math.random() * 0.8;
      } else {
        // Normal particles
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
      const pattern = bgPatternRef.current;
      if (!pattern) return;
      const o = bgOffRef.current;
      // Slow drift to "animate" cheaply
      o.x = (o.x + 0.2) % 80;
      o.y = (o.y + 0.1) % 80;
      ctx.save();
      ctx.translate(-o.x, -o.y);
      ctx.fillStyle = pattern;
      ctx.fillRect(-80, -80, canvas.width + 160, canvas.height + 160);
      ctx.restore();
    };

    const drawBricks = (g) => {
      const {
        brickCols, brickRows, brickW, brickH
      } = cfg;
      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          const b = g.bricks[c][r];
          if (b.status !== 1) continue;
          const ratio = b.health / 4;
          const color =
            ratio === 1 ? '#0095DD' :
            ratio === 0.75 ? '#00DD95' :
            ratio === 0.5 ? '#DDDD00' : '#DD4400';
          ctx.fillStyle = color;
          ctx.fillRect(b.x, b.y, cfg.brickW, cfg.brickH);
        }
      }
    };

    const drawPaddle = (g) => {
      ctx.fillStyle = '#0095DD';
      ctx.fillRect(g.paddleX, cfg.H - cfg.paddleH - 10, cfg.paddleW, cfg.paddleH);
    };

    const drawBall = (g) => {
      ctx.beginPath();
      ctx.arc(g.ball.x, g.ball.y, cfg.ballR, 0, Math.PI * 2);
      ctx.fillStyle = '#00DDFF';
      ctx.fill();
    };

    const drawPlayerBullets = (g) => {
      for (let i = 0; i < g.playerBullets.length; i++) {
        const b = g.playerBullets[i];
        
        // Draw subtle trail behind bullet
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#FFFFAA';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        const trailLength = 6;
        
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + trailLength);
        ctx.stroke();
        ctx.restore();
        
        // Draw the bullet
        ctx.fillStyle = '#FFFFAA';
        ctx.fillRect(b.x - cfg.playerBulletW / 2, b.y, cfg.playerBulletW, cfg.playerBulletH);
      }
    };

    const drawEnemyBullets = (g) => {
      for (let i = 0; i < g.enemyBullets.length; i++) {
        const b = g.enemyBullets[i];
        
        // Draw subtle trail behind bullet
        if (b.dx || b.dy) { // Only for directional bullets
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.strokeStyle = '#FF6644';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          
          // Calculate trail direction (opposite of movement)
          const trailLength = 8;
          const speed = Math.sqrt((b.dx || 0)**2 + (b.dy || cfg.enemyBulletSpeed)**2);
          const normalizedDx = -(b.dx || 0) / speed;
          const normalizedDy = -(b.dy || cfg.enemyBulletSpeed) / speed;
          
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(
            b.x + normalizedDx * trailLength, 
            b.y + normalizedDy * trailLength
          );
          ctx.stroke();
          ctx.restore();
        }
        
        // Draw the bullet as a glowing circle
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
      // Enhanced particle rendering with subtle glow effects
      const particles = g.particles;
      let activeCount = 0;
      
      for (let i = 0; i < particles.length && activeCount < 80; i++) { // Increased limit for effects
        const p = particles[i];
        if (!p.active || p.life <= 0) continue;
        
        const alpha = (p.life / p.maxLife) * 0.8; // Higher alpha for visibility
        if (alpha <= 0.1) continue;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Add subtle glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.fillStyle = p.color;
        
        // Use circles for smoother particles
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
      const drawSize = cfg.enemySize * 1.1; // Smaller multiplier for 30% smaller saucers
      if (!spr) return;
      
      for (let i = 0; i < g.enemies.length; i++) {
        const e = g.enemies[i];
        
        // Add subtle hover/floating effect
        const time = Date.now() * 0.003;
        const hoverOffset = Math.sin(time + e.ox) * 1.5; // Proportionally smaller hover
        
        // Enhanced flash effect for saucer damage
        if (e.flashTime > 0) {
          ctx.save();
          ctx.globalAlpha = e.flashTime / 15 * 0.8;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8; // Smaller glow for smaller saucers
          ctx.beginPath();
          ctx.ellipse(e.x, e.y + hoverOffset, drawSize/2, drawSize/3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Draw the flying saucer with subtle glow
        ctx.save();
        ctx.shadowColor = '#666666';
        ctx.shadowBlur = 3;
        ctx.drawImage(
          spr,
          0, 0, base, base,
          e.x - drawSize / 2, (e.y + hoverOffset) - drawSize / 2,
          drawSize, drawSize
        );
        ctx.restore();
      }
    };

    const drawHUD = (g) => {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#00DDFF';
      ctx.fillText('Score: ' + g.score, 8, 20);
      ctx.fillStyle = '#FF88AA';
      ctx.fillText('Health: ' + g.health, cfg.W - 110, 20);
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
            const col =
              ratio === 1 ? '#0095DD' :
              ratio === 0.75 ? '#00DD95' :
              ratio === 0.5 ? '#DDDD00' : '#DD4400';
            spawnParticles(g, b.x + cfg.brickW / 2, b.y + cfg.brickH / 2, col, 4, 2);
            b.status = 0;
            g.score += 1;
            hit = true;
          }
        }
      }
      return hit;
    };

    const updateBall = (g) => {
      if (!g.started) return;
      let { x, y, dx, dy } = g.ball;

      const nx = x + dx;
      const ny = y + dy;

      if (nx + cfg.ballR > cfg.W || nx - cfg.ballR < 0) {
        dx = -dx;
        spawnParticles(g, nx, ny, '#00DDFF', 2, 2);
      }
      if (ny - cfg.ballR < 0) {
        dy = -dy;
        spawnParticles(g, nx, ny, '#00DDFF', 2, 2);
      }

      const pTop = cfg.H - cfg.paddleH - 10;
      if (ny + cfg.ballR > pTop && ny - cfg.ballR < pTop + cfg.paddleH && nx > g.paddleX && nx < g.paddleX + cfg.paddleW) {
        dy = -Math.abs(dy);
        const hitPos = (nx - g.paddleX) / cfg.paddleW;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        const speed = Math.sqrt(dx * dx + dy * dy);
        dx = speed * Math.sin(angle);
        dy = -speed * Math.cos(angle);
        spawnParticles(g, nx, pTop, '#0095DD', 3, 2);
      }

      if (ny + cfg.ballR > cfg.H) { resetGame(); return; }
      if (collideBallBricks(g)) dy = -dy;

      g.ball.x = x + dx;
      g.ball.y = y + dy;
      g.ball.dx = dx;
      g.ball.dy = dy;
    };

    const spawnEnemies = (g) => {
      if (!g.started || g.enemies.length >= cfg.maxEnemies) return; // Limit enemy count
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
          horizontalIntensity: 2.2 + Math.random() * 0.8, // Simpler calculation
        };
        g.enemies.push(e);
        g.enemySpawnTimer = 0;
      }
    };

    const updateEnemies = (g) => {
      if (g.enemies.length === 0) return; // Early exit
      
      const now = performance.now();
      const timeCache = Date.now() * 0.002; // Even slower time
      const out = [];
      
      for (let i = 0; i < g.enemies.length; i++) {
        const e = g.enemies[i];
        if (e.flashTime > 0) e.flashTime--;

        // Slower horizontal movement
        const nx = Math.sin(timeCache + e.ox) * e.horizontalIntensity * 0.6; // Reduced intensity
        const dx = nx * e.baseSpeed * 0.5; // Much slower horizontal
        const dy = e.baseSpeed; // Slower vertical movement

        let x = e.x + dx;
        let y = e.y + dy;
        
        // Simple boundary check
        const halfSize = cfg.enemySize / 2;
        if (x <= halfSize || x >= cfg.W - halfSize) { 
          e.ox += Math.PI; 
          x = Math.max(halfSize, Math.min(cfg.W - halfSize, x));
        }

        // Directional shooting toward player
        if (Math.random() < 0.008 && now - (e.lastShot || 0) >= cfg.enemyFireMs) {
          const paddleX = g.paddleX + cfg.paddleW / 2;
          const paddleY = cfg.H - cfg.paddleH - 10;
          
          // Calculate angle to player
          const dx = paddleX - x;
          const dy = paddleY - y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance > 0) {
            const bulletDx = (dx / distance) * cfg.enemyBulletSpeed;
            const bulletDy = (dy / distance) * cfg.enemyBulletSpeed;
            
            g.enemyBullets.push({ 
              x, 
              y: y + halfSize + 2,
              dx: bulletDx,
              dy: bulletDy
            });
            
            // Add muzzle flash particles from saucer
            spawnParticles(g, x, y, '#FF8844', 4, 1.8, 'explosion');
          }
          e.lastShot = now;
        }

        e.x = x; e.y = y;
        if (y < cfg.H + cfg.enemySize) out.push(e);
      }
      g.enemies = out;
    };

    const updateEnemyBullets = (g) => {
      const pTop = cfg.H - cfg.paddleH - 10;
      const out = [];
      let tookDamage = false;
      
      for (let i = 0; i < g.enemyBullets.length; i++) {
        const b = g.enemyBullets[i];
        
        // Move bullet in its direction
        const nx = b.x + (b.dx || 0);
        const ny = b.y + (b.dy || cfg.enemyBulletSpeed); // Default downward if no direction
        
        // Check collision with paddle (circular bullet collision)
        const bulletRadius = cfg.enemyBulletW / 2;
        if (ny + bulletRadius >= pTop && ny - bulletRadius <= pTop + cfg.paddleH && 
            nx + bulletRadius >= g.paddleX && nx - bulletRadius <= g.paddleX + cfg.paddleW) {
          tookDamage = true;
          spawnParticles(g, nx, pTop, '#FF88AA', 6, 2.5, 'explosion');
          continue;
        }
        
        // Keep bullet if still on screen
        if (nx > -10 && nx < cfg.W + 10 && ny > -10 && ny < cfg.H + 10) {
          out.push({ x: nx, y: ny, dx: b.dx, dy: b.dy });
          
          // Add subtle trail particles for directional bullets
          if (b.dx && Math.random() < 0.4) {
            spawnParticles(g, nx, ny, '#FF3322', 1, 0.5, 'trail');
          }
        }
      }
      
      g.enemyBullets = out;
      if (tookDamage) {
        g.health = Math.max(0, g.health - 1);
        if (g.health <= 0) { resetGame(); }
      }
    };

    const updatePlayerBullets = (g) => {
      if (g.playerBullets.length === 0) return; // Early exit
      
      const out = [];
      const halfBulletW = cfg.playerBulletW / 2;
      const halfEnemySize = cfg.enemySize / 2;
      
      bulletLoop:
      for (let i = 0; i < g.playerBullets.length; i++) {
        const b = g.playerBullets[i];

        // Simplified brick collision
        for (let c = 0; c < cfg.brickCols; c++) {
          for (let r = 0; r < cfg.brickRows; r++) {
            const br = g.bricks[c][r];
            if (br.status !== 1) continue;
            if (b.x > br.x && b.x < br.x + cfg.brickW && b.y < br.y + cfg.brickH && b.y + cfg.playerBulletH > br.y) {
              const ratio = br.health / 4;
              const col =
                ratio === 1 ? '#0095DD' :
                ratio === 0.75 ? '#00DD95' :
                ratio === 0.5 ? '#DDDD00' : '#DD4400';
              spawnParticles(g, b.x, b.y, col, 3, 2); // Fewer particles
              br.health -= 1;
              if (br.health <= 0) {
                br.status = 0;
                g.score += 1;
                spawnParticles(g, br.x + cfg.brickW / 2, br.y + cfg.brickH / 2, col, 6, 2.5, 'explosion');
              }
              continue bulletLoop;
            }
          }
        }

        // Simplified enemy collision
        for (let j = 0; j < g.enemies.length; j++) {
          const e = g.enemies[j];
          const dx = b.x - e.x;
          const dy = b.y - e.y;
          if (dx*dx + dy*dy <= halfEnemySize*halfEnemySize) { // Simple distance check
            spawnParticles(g, b.x, b.y, '#FF4466', 3, 2);
            e.health -= 1;
            e.flashTime = 12; 
            if (e.health <= 0) {
              g.score += 2;
              spawnParticles(g, e.x, e.y, '#FF0044', 8, 3, 'explosion');
              g.enemies.splice(j, 1);
            }
            continue bulletLoop;
          }
        }

        // Move bullet
        const ny = b.y - cfg.playerBulletSpeed;
        if (ny > 0) out.push({ x: b.x, y: ny });
      }
      g.playerBullets = out;
    };

    const updateParticles = (g) => {
      // Extremely optimized particle update
      const particles = g.particles;
      let activeCount = 0;
      
      for (let i = 0; i < particles.length && activeCount < 50; i++) {
        const p = particles[i];
        if (!p.active) continue;
        
        p.x += p.dx; 
        p.y += p.dy;
        p.dx *= 0.95; // More aggressive friction
        p.dy *= 0.95;
        p.life -= 1.5; // Faster decay
        
        if (p.life <= 0) {
          p.active = false;
        } else {
          activeCount++;
        }
      }
    };

    const loop = () => {
      const g = gameRef.current;
      if (!g) return;

      // Clear with simple fillRect (faster than clearRect)
      ctx.fillStyle = 'rgba(0, 20, 40, 1)';
      ctx.fillRect(0, 0, cfg.W, cfg.H);

      // Skip background animation when there are many objects
      if (g.enemies.length < 5 && g.particles.filter(p => p.active).length < 30) {
        drawBackground(g);
      }
      
      // Core gameplay rendering only
      drawBricks(g);
      drawPaddle(g);
      drawBall(g);
      drawPlayerBullets(g);
      drawEnemies(g);
      drawEnemyBullets(g);
      
      // Conditional particle rendering
      if (g.particles.some(p => p.active)) {
        drawParticles(g);
      }
      
      drawHUD(g);

      // Update game state
      updateBall(g);
      spawnEnemies(g);
      updateEnemies(g);
      updateEnemyBullets(g);
      updatePlayerBullets(g);
      updateParticles(g);

      // Reduce UI update frequency even more
      const now = performance.now();
      if (now - lastUiPush > 150) {
        lastUiPush = now;
        setUi(prev => {
          if (prev.score !== g.score || prev.health !== g.health || prev.started !== g.started) {
            return { score: g.score, health: g.health, started: g.started };
          }
          return prev;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [cfg, resetGame]);

  // Input
  const onCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const g = gameRef.current;
    if (!canvas || !g) return;
    const rect = canvas.getBoundingClientRect();
    const rx = e.clientX - rect.left;
    if (rx > 0 && rx < cfg.W) {
      g.paddleX = clamp(rx - cfg.paddleW / 2, 0, cfg.W - cfg.paddleW);
    }
  };

  const onCanvasClick = () => {
    const g = gameRef.current;
    if (!g) return;
    if (!g.started) {
      g.started = true;
      setUi(prev => ({ ...prev, started: true }));
    } else {
      const bulletX = g.paddleX + cfg.paddleW / 2;
      const bulletY = cfg.H - cfg.paddleH - 20;
      g.playerBullets.push({ x: bulletX, y: bulletY });
    }
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
      onMouseDown={onMouseDown}
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
              Score: {ui.score} &nbsp;•&nbsp; Health: {ui.health}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={resetGame}
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
            title="Reset Game"
          >
            🔄
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
          onClick={onCanvasClick}
        />
      </div>
    </div>
  );
}

export default Ultranoid;

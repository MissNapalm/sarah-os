import React, { useRef, useEffect, useState } from 'react';

const Arkanoid = () => {
  const canvasRef = useRef(null);
  
  // Fixed speed constants - these NEVER change
  const SPEED_CONSTANTS = {
    BALL_INITIAL: 2.0,      // Starting speed
    BALL_GAMEPLAY: 2.5,     // Gameplay speed after paddle hits
    BALL_MAX_ALLOWED: 2.5,  // Absolute maximum - NEVER exceed this
    PADDLE: 6,
    BULLET: 7,
    ENEMY: 1.5,
    ENEMY_BULLET: 3,
    POWERUP: 1.5
  };
  
  // Game state with locked initial speeds
  const gameStateRef = useRef({
    ball: {
      x: 260,
      y: 400,
      radius: 8,
      dx: SPEED_CONSTANTS.BALL_INITIAL,
      dy: -SPEED_CONSTANTS.BALL_INITIAL,
      speedLocked: false  // Prevents any external speed modifications
    },
    paddle: { x: 210, y: 450, width: 100, height: 12 },
    bricks: [],
    particles: [],
    stars: [],
    enemies: [],
    bullets: [],
    enemyBullets: [],
    powerups: [],
    keys: {},
    health: 100,
    gameRunning: true,
    gameStarted: false,
    ballMoving: false,
    timeMultiplier: 1,
    slowTime: 0,
    lastTime: 0,
    frameCount: 0
  });

  const animationId = useRef();
  const [, forceUpdate] = useState({});

  // Immutable speed enforcement system
  const SpeedController = {
    // Force ball to exact speed - no tolerance for deviation
    lockBallSpeed: (ball, targetSpeed) => {
      const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      if (Math.abs(currentSpeed - targetSpeed) > 0.001) { // Tiny tolerance for floating point
        if (currentSpeed === 0) {
          // Handle edge case of zero velocity
          ball.dx = targetSpeed * 0.6;
          ball.dy = targetSpeed * 0.8;
        } else {
          const ratio = targetSpeed / currentSpeed;
          ball.dx *= ratio;
          ball.dy *= ratio;
        }
      }
    },
    
    // Validate and enforce speed limits every frame
    validateBallSpeed: (ball) => {
      const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      
      // Hard cap - if speed exceeds maximum, reset to gameplay speed
      if (currentSpeed > SPEED_CONSTANTS.BALL_MAX_ALLOWED + 0.001) {
        console.warn(`Speed violation detected: ${currentSpeed}, resetting to ${SPEED_CONSTANTS.BALL_GAMEPLAY}`);
        SpeedController.lockBallSpeed(ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
      }
      
      // Prevent ball from stopping
      if (currentSpeed < 0.5) {
        SpeedController.lockBallSpeed(ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
      }
    },
    
    // Set ball direction while maintaining exact speed
    setBallDirection: (ball, angle, speed) => {
      ball.dx = Math.cos(angle) * speed;
      ball.dy = Math.sin(angle) * speed;
      SpeedController.lockBallSpeed(ball, speed);
    }
  };

  // Initialize stars
  const initStars = () => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * 520,
        y: Math.random() * 480,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    return stars;
  };

  // Initialize bricks
  const initBricks = () => {
    const bricks = [];
    const brickWidth = 50;
    const brickHeight = 20;
    const padding = 5;
    const offsetTop = 80;
    const offsetLeft = 35;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 9; col++) {
        bricks.push({
          x: col * (brickWidth + padding) + offsetLeft,
          y: row * (brickHeight + padding) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          color: colors[row],
          hits: Math.floor(Math.random() * 3) + 1,
          maxHits: Math.floor(Math.random() * 3) + 1
        });
      }
    }
    return bricks;
  };

  // Particle system
  const createParticles = (x, y, color, count = 10) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        dx: (Math.random() - 0.5) * 8,
        dy: (Math.random() - 0.5) * 8,
        color,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 4 + 2
      });
    }
    return particles;
  };

  // Enemy system
  const spawnEnemy = () => ({
    x: Math.random() * 460,
    y: -30,
    width: 30,
    height: 20,
    speed: SPEED_CONSTANTS.ENEMY,
    health: 2,
    shootTimer: Math.random() * 120 + 60,
    color: '#ff4757'
  });

  // Powerup system
  const createPowerup = (x, y) => ({
    x, y,
    width: 20,
    height: 20,
    dy: SPEED_CONSTANTS.POWERUP,
    type: 'timeSlow',
    color: '#00d4ff',
    collected: false,
    glowIntensity: 0
  });

  // Strict ball reset system
  const resetBall = () => {
    const game = gameStateRef.current;
    game.ball.x = 260;
    game.ball.y = 400;
    game.ball.dx = SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.dy = -SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.speedLocked = false;
    game.ballMoving = false;
    
    // Verify speed was set correctly
    SpeedController.lockBallSpeed(game.ball, SPEED_CONSTANTS.BALL_INITIAL);
  };

  // Complete game reset with locked speeds
  const resetGame = () => {
    const game = gameStateRef.current;
    
    // Reset all game objects
    game.bricks = initBricks();
    game.particles = [];
    game.enemies = [];
    game.bullets = [];
    game.enemyBullets = [];
    game.powerups = [];
    game.health = 100;
    game.gameRunning = true;
    game.gameStarted = false;
    game.timeMultiplier = 1;
    game.slowTime = 0;
    game.frameCount = 0;
    
    // Reset paddle
    game.paddle.x = 210;
    game.paddle.y = 450;
    
    // Reset ball with locked initial speed
    game.ball.x = 260;
    game.ball.y = 400;
    game.ball.dx = SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.dy = -SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.speedLocked = false;
    game.ballMoving = false;
    
    // Force speed lock
    SpeedController.lockBallSpeed(game.ball, SPEED_CONSTANTS.BALL_INITIAL);
    
    forceUpdate({});
  };

  // Collision system with locked speeds
  const CollisionHandler = {
    // Paddle collision with angle calculation but locked speed
    handlePaddleCollision: (ball, paddle) => {
      if (ball.y + ball.radius >= paddle.y &&
          ball.x >= paddle.x && 
          ball.x <= paddle.x + paddle.width) {
        
        // Calculate angle based on hit position
        const hitPos = (ball.x - paddle.x) / paddle.width;
        const maxAngle = Math.PI / 3; // 60 degrees max
        const angle = (hitPos - 0.5) * maxAngle;
        
        // Set new direction but LOCK speed to gameplay constant
        ball.dx = Math.sin(angle) * SPEED_CONSTANTS.BALL_GAMEPLAY;
        ball.dy = -Math.abs(Math.cos(angle) * SPEED_CONSTANTS.BALL_GAMEPLAY);
        
        // Ensure ball is above paddle
        ball.y = paddle.y - ball.radius - 1;
        
        // Lock speed to prevent any accumulation
        SpeedController.lockBallSpeed(ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
        ball.speedLocked = true;
        
        return true;
      }
      return false;
    },
    
    // Wall collision with speed preservation
    handleWallCollision: (ball, canvasWidth, canvasHeight) => {
      let collided = false;
      
      // Side walls
      if (ball.x - ball.radius <= 2) {
        ball.x = ball.radius + 2;
        ball.dx = Math.abs(ball.dx);
        collided = true;
      } else if (ball.x + ball.radius >= canvasWidth - 2) {
        ball.x = canvasWidth - ball.radius - 2;
        ball.dx = -Math.abs(ball.dx);
        collided = true;
      }
      
      // Top wall
      if (ball.y - ball.radius <= 2) {
        ball.y = ball.radius + 2;
        ball.dy = Math.abs(ball.dy);
        collided = true;
      }
      
      // Maintain exact speed after collision
      if (collided) {
        const targetSpeed = ball.speedLocked ? SPEED_CONSTANTS.BALL_GAMEPLAY : SPEED_CONSTANTS.BALL_INITIAL;
        SpeedController.lockBallSpeed(ball, targetSpeed);
      }
      
      return collided;
    },
    
    // Brick collision with simple reflection
    handleBrickCollision: (ball, bricks, particles, powerups) => {
      for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        if (ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height) {
          
          // Simple Y reflection to avoid complex speed calculations
          ball.dy = -ball.dy;
          
          // Lock speed immediately
          const targetSpeed = ball.speedLocked ? SPEED_CONSTANTS.BALL_GAMEPLAY : SPEED_CONSTANTS.BALL_INITIAL;
          SpeedController.lockBallSpeed(ball, targetSpeed);
          
          // Handle brick damage
          brick.hits--;
          particles.push(...createParticles(brick.x + brick.width/2, brick.y + brick.height/2, brick.color, 15));
          
          if (brick.hits <= 0) {
            if (Math.random() < 0.3) {
              powerups.push(createPowerup(brick.x + brick.width/2, brick.y + brick.height/2));
            }
            bricks.splice(i, 1);
          }
          
          return true;
        }
      }
      return false;
    }
  };

  // Game initialization
  useEffect(() => {
    const game = gameStateRef.current;
    game.stars = initStars();
    game.bricks = initBricks();
    
    const handleKeyDown = (e) => {
      game.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!game.gameStarted) {
          game.gameStarted = true;
          game.ballMoving = true;
        }
      }
    };

    const handleKeyUp = (e) => {
      game.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // Main game loop with strict speed control
  useEffect(() => {
    const gameLoop = (currentTime) => {
      const game = gameStateRef.current;
      const deltaTime = currentTime - game.lastTime;
      game.lastTime = currentTime;
      game.frameCount++;
      
      if (!game.gameRunning) {
        animationId.current = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update scrolling stars
      game.stars.forEach(star => {
        star.y += star.speed * game.timeMultiplier;
        if (star.y > canvas.height) {
          star.y = -5;
          star.x = Math.random() * canvas.width;
        }
        
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(star.x, star.y, star.size, star.size);
        ctx.globalAlpha = 1;
      });

      // Handle paddle input with fixed speed
      const paddleSpeed = SPEED_CONSTANTS.PADDLE * game.timeMultiplier;
      if (game.keys['ArrowLeft'] && game.paddle.x > 0) {
        game.paddle.x -= paddleSpeed;
        if (game.paddle.x < 0) game.paddle.x = 0;
      }
      if (game.keys['ArrowRight'] && game.paddle.x < canvas.width - game.paddle.width) {
        game.paddle.x += paddleSpeed;
        if (game.paddle.x > canvas.width - game.paddle.width) {
          game.paddle.x = canvas.width - game.paddle.width;
        }
      }

      // Update time slow effect
      if (game.slowTime > 0) {
        game.slowTime -= deltaTime;
        game.timeMultiplier = 0.3;
        if (game.slowTime <= 0) {
          game.timeMultiplier = 1;
          game.slowTime = 0;
        }
      }

      // Ball update with MANDATORY speed validation
      if (game.ballMoving && game.gameStarted) {
        // VALIDATE SPEED BEFORE MOVEMENT - catch any corruption early
        SpeedController.validateBallSpeed(game.ball);
        
        // Move ball with time multiplier
        game.ball.x += game.ball.dx * game.timeMultiplier;
        game.ball.y += game.ball.dy * game.timeMultiplier;
        
        // VALIDATE SPEED AFTER MOVEMENT - ensure no external modification
        SpeedController.validateBallSpeed(game.ball);
      }

      // Handle collisions with locked speed system
      if (game.ballMoving) {
        // Wall collisions
        if (CollisionHandler.handleWallCollision(game.ball, canvas.width, canvas.height)) {
          game.particles.push(...createParticles(game.ball.x, game.ball.y, '#4fc3f7', 5));
        }
        
        // Paddle collision
        if (CollisionHandler.handlePaddleCollision(game.ball, game.paddle)) {
          game.particles.push(...createParticles(game.ball.x, game.paddle.y, '#81c784', 8));
        }
        
        // Brick collision
        CollisionHandler.handleBrickCollision(game.ball, game.bricks, game.particles, game.powerups);
      }

      // Enemy spawning and movement
      if (Math.random() < 0.002) {
        game.enemies.push(spawnEnemy());
      }

      game.enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed * game.timeMultiplier;
        enemy.shootTimer -= game.timeMultiplier;
        
        if (enemy.shootTimer <= 0) {
          game.enemyBullets.push({
            x: enemy.x + enemy.width/2,
            y: enemy.y + enemy.height,
            dy: SPEED_CONSTANTS.ENEMY_BULLET,
            width: 3,
            height: 8
          });
          enemy.shootTimer = Math.random() * 120 + 60;
        }
        
        if (enemy.y > canvas.height) {
          game.enemies.splice(enemyIndex, 1);
        }
      });

      // Update powerups with glow
      game.powerups.forEach((powerup, index) => {
        powerup.y += powerup.dy * game.timeMultiplier;
        powerup.glowIntensity = (Math.sin(currentTime * 0.01) + 1) * 0.5;
        
        // Check collection
        if (powerup.x < game.paddle.x + game.paddle.width &&
            powerup.x + powerup.width > game.paddle.x &&
            powerup.y < game.paddle.y + game.paddle.height &&
            powerup.y + powerup.height > game.paddle.y) {
          
          game.slowTime = 7000; // 7 seconds
          game.timeMultiplier = 0.3;
          game.particles.push(...createParticles(powerup.x + powerup.width/2, powerup.y + powerup.height/2, '#00d4ff', 20));
          game.powerups.splice(index, 1);
        } else if (powerup.y > canvas.height) {
          game.powerups.splice(index, 1);
        }
      });

      // Player bullets
      if (game.keys['Space'] && Math.random() < 0.3) {
        game.bullets.push({
          x: game.paddle.x + game.paddle.width/2,
          y: game.paddle.y,
          dy: -SPEED_CONSTANTS.BULLET,
          width: 3,
          height: 10
        });
      }

      // Update bullets with fixed speeds
      game.bullets.forEach((bullet, bulletIndex) => {
        bullet.y += bullet.dy * game.timeMultiplier;
        if (bullet.y < 0) {
          game.bullets.splice(bulletIndex, 1);
        }
      });

      // Update enemy bullets with fixed speeds
      game.enemyBullets.forEach((bullet, bulletIndex) => {
        bullet.y += bullet.dy * game.timeMultiplier;
        if (bullet.y > canvas.height) {
          game.enemyBullets.splice(bulletIndex, 1);
        }
        
        // Check collision with paddle
        if (bullet.x < game.paddle.x + game.paddle.width &&
            bullet.x + bullet.width > game.paddle.x &&
            bullet.y < game.paddle.y + game.paddle.height &&
            bullet.y + bullet.height > game.paddle.y) {
          game.health -= 10;
          game.particles.push(...createParticles(bullet.x, bullet.y, '#ff4757', 10));
          game.enemyBullets.splice(bulletIndex, 1);
        }
      });

      // Bullet-enemy collisions
      game.bullets.forEach((bullet, bulletIndex) => {
        game.enemies.forEach((enemy, enemyIndex) => {
          if (bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            enemy.health--;
            game.particles.push(...createParticles(bullet.x, bullet.y, enemy.color, 8));
            game.bullets.splice(bulletIndex, 1);
            
            if (enemy.health <= 0) {
              game.particles.push(...createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color, 15));
              game.enemies.splice(enemyIndex, 1);
            }
          }
        });
      });

      // Update particles
      game.particles.forEach((particle, index) => {
        particle.x += particle.dx * game.timeMultiplier;
        particle.y += particle.dy * game.timeMultiplier;
        particle.life -= particle.decay * game.timeMultiplier;
        
        if (particle.life <= 0) {
          game.particles.splice(index, 1);
        }
      });

      // Ball out of bounds - health damage
      if (game.ball.y > canvas.height + 50) {
        game.health -= 25;
        
        if (game.health <= 0) {
          // Death explosion
          game.particles.push(...createParticles(game.paddle.x + game.paddle.width/2, game.paddle.y, '#ff4757', 50));
          game.gameRunning = false;
          
          // Auto-restart with proper speed reset
          setTimeout(() => {
            resetGame();
          }, 5000);
        } else {
          resetBall();
        }
      }

      // Win condition
      if (game.bricks.length === 0) {
        resetGame();
      }

      // FINAL SPEED VALIDATION - ensure no frame ends with invalid speed
      if (game.ballMoving) {
        SpeedController.validateBallSpeed(game.ball);
      }

      // Rendering code
      renderGame(ctx, game, canvas);
      
      animationId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // Separate render function to keep game loop clean
  const renderGame = (ctx, game, canvas) => {
    // Draw bricks
    game.bricks.forEach(brick => {
      const alpha = brick.hits / brick.maxHits;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.globalAlpha = 1;
    });

    // Draw ball
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw paddle
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);

    // Draw enemies
    game.enemies.forEach(enemy => {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw bullets
    ctx.fillStyle = '#00ff00';
    game.bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemy bullets
    ctx.fillStyle = '#ff0000';
    game.enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw powerups with glow
    game.powerups.forEach(powerup => {
      const glowSize = 5 + powerup.glowIntensity * 10;
      const gradient = ctx.createRadialGradient(
        powerup.x + powerup.width/2, powerup.y + powerup.height/2, 0,
        powerup.x + powerup.width/2, powerup.y + powerup.height/2, glowSize
      );
      gradient.addColorStop(0, `rgba(0, 212, 255, ${0.8 * powerup.glowIntensity})`);
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(powerup.x - glowSize/2, powerup.y - glowSize/2, powerup.width + glowSize, powerup.height + glowSize);
      
      ctx.fillStyle = powerup.color;
      ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    });

    // Draw particles
    game.particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
      ctx.globalAlpha = 1;
    });

    // Draw health bar
    const barWidth = 200;
    const barHeight = 20;
    const barX = 20;
    const barY = 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const healthPercent = game.health / 100;
    let healthColor = '#4caf50';
    if (healthPercent < 0.5) healthColor = '#ff9800';
    if (healthPercent < 0.25) healthColor = '#f44336';
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.fillText(`Health: ${game.health}%`, barX, barY - 5);

    // Time slow indicator
    if (game.slowTime > 0) {
      const timeLeft = Math.ceil(game.slowTime / 1000);
      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 16px Inter';
      ctx.fillText(`TIME SLOW: ${timeLeft}s`, canvas.width - 150, 30);
    }

    // Speed debug info (remove in production)
    if (game.ballMoving) {
      const currentSpeed = Math.sqrt(game.ball.dx * game.ball.dx + game.ball.dy * game.ball.dy);
      ctx.fillStyle = '#ffff00';
      ctx.font = '12px monospace';
      ctx.fillText(`Speed: ${currentSpeed.toFixed(3)}`, canvas.width - 150, canvas.height - 20);
    }

    // Game status overlay
    if (!game.gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to start', canvas.width/2, canvas.height/2);
      ctx.font = '16px Inter';
      ctx.fillText('Arrow keys to move, SPACE to shoot', canvas.width/2, canvas.height/2 + 40);
      ctx.textAlign = 'left';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={480}
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0a0a0a',
        display: 'block'
      }}
    />
  );
};

export default Arkanoid;

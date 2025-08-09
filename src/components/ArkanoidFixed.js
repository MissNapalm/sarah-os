import React, { useState, useRef, useEffect } from "react";

const Arkanoid = ({ onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 550) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 550) / 2, window.innerHeight - 555))
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const timeSlowTimerRef = useRef(0);
  const [gameState, setGameState] = useState('waiting');
  const [health, setHealth] = useState(100);
  const [timeSlowActive, setTimeSlowActive] = useState(false);
  const [timeSlowTimer, setTimeSlowTimer] = useState(0);
  const [gameOverCountdown, setGameOverCountdown] = useState(0);
  
  // Speed control constants - NEVER CHANGE
  const SPEED_CONSTANTS = {
    BALL_INITIAL: 2.25,
    BALL_GAMEPLAY: 3.0,
    BALL_MAX_ALLOWED: 3.0,
  };

  const gameStateRef = useRef({
    ball: { x: 250, y: 250, dx: SPEED_CONSTANTS.BALL_INITIAL, dy: -SPEED_CONSTANTS.BALL_INITIAL, radius: 6, speedLocked: false },
    paddle: { x: 200, y: 350, width: 80, height: 10 },
    bricks: [],
    mouseX: 250,
    stars: [],
    particles: [],
    bullets: [],
    enemies: [],
    bombs: [],
    powerups: [],
    lastEnemySpawn: 0,
    gameStarted: false,
    ballMoving: false,
    timeMultiplier: 1,
    gameRunning: true
  });

  const animationId = useRef();

  // Speed enforcement system
  const SpeedController = {
    lockBallSpeed: (ball, targetSpeed) => {
      const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      if (Math.abs(currentSpeed - targetSpeed) > 0.001) {
        if (currentSpeed === 0) {
          ball.dx = targetSpeed * 0.6;
          ball.dy = targetSpeed * 0.8;
        } else {
          const ratio = targetSpeed / currentSpeed;
          ball.dx *= ratio;
          ball.dy *= ratio;
        }
      }
    },
    
    validateBallSpeed: (ball) => {
      const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      if (currentSpeed > SPEED_CONSTANTS.BALL_MAX_ALLOWED + 0.001) {
        console.warn(`Speed violation: ${currentSpeed}, resetting to ${SPEED_CONSTANTS.BALL_GAMEPLAY}`);
        SpeedController.lockBallSpeed(ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
      }
      if (currentSpeed < 0.5) {
        SpeedController.lockBallSpeed(ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
      }
    }
  };

  // Initialize stars for background
  const initializeStars = () => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * 500,
        y: Math.random() * 400,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    return stars;
  };

  // Initialize bricks
  const initializeBricks = () => {
    const bricks = [];
    const rows = 6;
    const cols = 10;
    const brickWidth = 45;
    const brickHeight = 20;
    const padding = 5;
    const offsetTop = 60;
    const offsetLeft = 25;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#fd79a8'];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push({
          x: col * (brickWidth + padding) + offsetLeft,
          y: row * (brickHeight + padding) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          color: colors[row % colors.length],
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
        dx: (Math.random() - 0.5) * 10,
        dy: (Math.random() - 0.5) * 10,
        color,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.01,
        size: Math.random() * 4 + 2
      });
    }
    return particles;
  };

  // Create falling powerup
  const createPowerup = (x, y) => ({
    x: x - 10, y: y - 10,
    width: 20, height: 20,
    dy: 2, type: 'timeSlow',
    color: '#00d4ff',
    glowIntensity: 0
  });

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      const game = gameStateRef.current;
      if (dragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      }
      
      if (containerRef.current && gameState === 'playing') {
        const rect = containerRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        if (canvas) {
          const canvasRect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - canvasRect.left;
          game.mouseX = Math.max(40, Math.min(460, mouseX));
        }
      }
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, gameState]);

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.closest('.drag-handle')) {
      setDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      e.preventDefault();
    }
  };

  // Reset ball with speed control
  const resetBall = () => {
    const game = gameStateRef.current;
    game.ball.x = 250;
    game.ball.y = 250;
    game.ball.dx = SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.dy = -SPEED_CONSTANTS.BALL_INITIAL;
    game.ball.speedLocked = false;
    game.ballMoving = false;
    SpeedController.lockBallSpeed(game.ball, SPEED_CONSTANTS.BALL_INITIAL);
  };

  // Reset game
  const resetGame = () => {
    const game = gameStateRef.current;
    game.bricks = initializeBricks();
    game.particles = [];
    game.enemies = [];
    game.bullets = [];
    game.bombs = [];
    game.powerups = [];
    setHealth(100);
    setGameState('waiting');
    setTimeSlowActive(false);
    setTimeSlowTimer(0);
    timeSlowTimerRef.current = 0;
    setGameOverCountdown(0);
    game.timeMultiplier = 1;
    game.paddle.x = 200;
    resetBall();
    game.gameStarted = false;
    game.gameRunning = true;
  };

  // Game initialization
  useEffect(() => {
    const game = gameStateRef.current;
    game.stars = initializeStars();
    game.bricks = initializeBricks();
    
    const updateTimers = () => {
      if (timeSlowTimerRef.current > 0) {
        timeSlowTimerRef.current -= 16;
        const newTimer = Math.max(0, Math.ceil(timeSlowTimerRef.current / 1000));
        setTimeSlowTimer(newTimer);
        
        if (timeSlowTimerRef.current <= 0) {
          setTimeSlowActive(false);
          game.timeMultiplier = 1;
        }
      }
      
      if (gameOverCountdown > 0) {
        setGameOverCountdown(prev => {
          const newCountdown = Math.max(0, prev - 16);
          if (newCountdown === 0) resetGame();
          return newCountdown;
        });
      }
    };

    const intervalId = setInterval(updateTimers, 16);
    return () => clearInterval(intervalId);
  }, [gameOverCountdown]);

  // Main game loop
  useEffect(() => {
    const gameLoop = (currentTime) => {
      const game = gameStateRef.current;
      
      if (!game.gameRunning || gameState !== 'playing') {
        animationId.current = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.fillStyle = 'rgba(5, 10, 20, 0.9)';
      ctx.fillRect(0, 0, 500, 400);

      // Update and draw scrolling stars
      game.stars.forEach(star => {
        star.y += star.speed * game.timeMultiplier;
        star.twinkle += 0.1;
        if (star.y > 400) {
          star.y = -5;
          star.x = Math.random() * 500;
        }
        
        ctx.globalAlpha = star.opacity * (0.8 + 0.2 * Math.sin(star.twinkle));
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(star.x, star.y, star.size, star.size);
        ctx.globalAlpha = 1;
      });

      // Update paddle position (smooth mouse following)
      const targetX = Math.max(40, Math.min(460, game.mouseX - 40));
      game.paddle.x = game.paddle.x + (targetX - game.paddle.x) * 0.15;

      // Ball movement with speed validation
      if (game.ballMoving && game.gameStarted) {
        SpeedController.validateBallSpeed(game.ball);
        game.ball.x += game.ball.dx * game.timeMultiplier;
        game.ball.y += game.ball.dy * game.timeMultiplier;
        SpeedController.validateBallSpeed(game.ball);
      }

      // Ball collision with walls
      if (game.ball.x - game.ball.radius <= 0 || game.ball.x + game.ball.radius >= 500) {
        game.ball.dx = -game.ball.dx;
        game.ball.x = game.ball.x - game.ball.radius <= 0 ? game.ball.radius : 500 - game.ball.radius;
        game.particles.push(...createParticles(game.ball.x, game.ball.y, '#4fc3f7', 5));
        SpeedController.validateBallSpeed(game.ball);
      }
      
      if (game.ball.y - game.ball.radius <= 0) {
        game.ball.dy = -game.ball.dy;
        game.ball.y = game.ball.radius;
        game.particles.push(...createParticles(game.ball.x, game.ball.y, '#4fc3f7', 5));
        SpeedController.validateBallSpeed(game.ball);
      }

      // Ball collision with paddle - WITH SPEED CONTROL
      if (game.ball.y + game.ball.radius >= game.paddle.y &&
          game.ball.x >= game.paddle.x && 
          game.ball.x <= game.paddle.x + game.paddle.width) {
        
        const hitPos = (game.ball.x - game.paddle.x) / game.paddle.width;
        const angle = (hitPos - 0.5) * Math.PI * 0.5;
        
        // LOCKED SPEED - use fixed gameplay speed
        game.ball.dx = Math.sin(angle) * SPEED_CONSTANTS.BALL_GAMEPLAY;
        game.ball.dy = -Math.abs(Math.cos(angle) * SPEED_CONSTANTS.BALL_GAMEPLAY);
        game.ball.y = game.paddle.y - game.ball.radius;
        game.ball.speedLocked = true;
        
        SpeedController.lockBallSpeed(game.ball, SPEED_CONSTANTS.BALL_GAMEPLAY);
        game.particles.push(...createParticles(game.ball.x, game.paddle.y, '#81c784', 8));
      }

      // Ball collision with bricks
      for (let i = game.bricks.length - 1; i >= 0; i--) {
        const brick = game.bricks[i];
        if (game.ball.x + game.ball.radius > brick.x &&
            game.ball.x - game.ball.radius < brick.x + brick.width &&
            game.ball.y + game.ball.radius > brick.y &&
            game.ball.y - game.ball.radius < brick.y + brick.height) {
          
          game.ball.dy = -game.ball.dy;
          const targetSpeed = game.ball.speedLocked ? SPEED_CONSTANTS.BALL_GAMEPLAY : SPEED_CONSTANTS.BALL_INITIAL;
          SpeedController.lockBallSpeed(game.ball, targetSpeed);
          
          brick.hits--;
          game.particles.push(...createParticles(brick.x + brick.width/2, brick.y + brick.height/2, brick.color, 15));
          
          if (brick.hits <= 0) {
            if (Math.random() < 0.3) {
              game.powerups.push(createPowerup(brick.x + brick.width/2, brick.y + brick.height/2));
            }
            game.bricks.splice(i, 1);
          }
          break;
        }
      }

      // Enemy spawning
      if (Math.random() < 0.005 && game.enemies.length < 3) {
        game.enemies.push({
          x: Math.random() * 450,
          y: -30,
          width: 25,
          height: 15,
          speed: 1.5,
          health: 2,
          color: '#ff4757'
        });
      }

      // Update enemies
      game.enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed * game.timeMultiplier;
        if (enemy.y > 400) {
          game.enemies.splice(index, 1);
        }
      });

      // Update powerups
      game.powerups.forEach((powerup, index) => {
        powerup.y += powerup.dy * game.timeMultiplier;
        powerup.glowIntensity = (Math.sin(currentTime * 0.01) + 1) * 0.5;
        
        // Check collection
        if (powerup.x < game.paddle.x + game.paddle.width &&
            powerup.x + powerup.width > game.paddle.x &&
            powerup.y < game.paddle.y + game.paddle.height &&
            powerup.y + powerup.height > game.paddle.y) {
          
          setTimeSlowActive(true);
          timeSlowTimerRef.current = 7000;
          game.timeMultiplier = 0.3;
          game.particles.push(...createParticles(powerup.x + powerup.width/2, powerup.y + powerup.height/2, '#00d4ff', 20));
          game.powerups.splice(index, 1);
        } else if (powerup.y > 400) {
          game.powerups.splice(index, 1);
        }
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

      // Ball out of bounds
      if (game.ball.y > 400) {
        const newHealth = Math.max(0, health - 25);
        setHealth(newHealth);
        
        if (newHealth <= 0) {
          game.particles.push(...createParticles(game.paddle.x + 40, game.paddle.y, '#ff4757', 50));
          setGameState('gameOver');
          setGameOverCountdown(5000);
        } else {
          resetBall();
        }
      }

      // Win condition
      if (game.bricks.length === 0) {
        resetGame();
      }

      // Final speed validation
      if (game.ballMoving) {
        SpeedController.validateBallSpeed(game.ball);
      }

      // Render everything
      renderGame(ctx, game, currentTime);
      
      animationId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop(0);
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [gameState, health]);

  // Render function
  const renderGame = (ctx, game, currentTime) => {
    // Draw bricks with transparency based on hits
    game.bricks.forEach(brick => {
      const alpha = brick.hits / brick.maxHits;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      
      // Subtle glow effect
      ctx.shadowBlur = 5;
      ctx.shadowColor = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });

    // Draw ball with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw paddle with gradient
    const gradient = ctx.createLinearGradient(game.paddle.x, game.paddle.y, game.paddle.x, game.paddle.y + game.paddle.height);
    gradient.addColorStop(0, '#4fc3f7');
    gradient.addColorStop(1, '#29b6f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);

    // Draw enemies
    game.enemies.forEach(enemy => {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw powerups with animated glow
    game.powerups.forEach(powerup => {
      const glowSize = 8 + powerup.glowIntensity * 12;
      const powerupGradient = ctx.createRadialGradient(
        powerup.x + powerup.width/2, powerup.y + powerup.height/2, 0,
        powerup.x + powerup.width/2, powerup.y + powerup.height/2, glowSize
      );
      powerupGradient.addColorStop(0, `rgba(0, 212, 255, ${0.8 * powerup.glowIntensity})`);
      powerupGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = powerupGradient;
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

    // Speed debug display (optional)
    if (game.ballMoving) {
      const currentSpeed = Math.sqrt(game.ball.dx * game.ball.dx + game.ball.dy * game.ball.dy);
      ctx.fillStyle = '#ffff00';
      ctx.font = '12px monospace';
      ctx.fillText(`Speed: ${currentSpeed.toFixed(3)}`, 400, 20);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '500px',
        height: '500px',
        background: 'rgba(20, 25, 40, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(100, 150, 255, 0.3)',
        borderRadius: '20px',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div 
        className="drag-handle"
        style={{
          height: '60px',
          background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.1) 0%, rgba(50, 100, 200, 0.05) 100%)',
          borderBottom: '1px solid rgba(100, 150, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            🎮
          </div>
          <div>
            <h3 style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '-0.5px'
            }}>
              Arkanoid Space
            </h3>
            <p style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px'
            }}>
              Health: {health}% | Time Slow: {timeSlowActive ? `${timeSlowTimer}s` : 'Ready'}
            </p>
          </div>
        </div>

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
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 59, 92, 0.2)';
            e.target.style.color = 'rgba(255, 59, 92, 1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 59, 92, 0.1)';
            e.target.style.color = 'rgba(255, 59, 92, 0.8)';
          }}
        >
          ×
        </button>
      </div>

      {/* Game canvas with frame */}
      <div style={{
        padding: '20px',
        height: 'calc(100% - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{
            border: '2px solid rgba(100, 150, 255, 0.3)',
            borderRadius: '12px',
            background: 'rgba(5, 10, 20, 0.8)',
            boxShadow: `
              inset 0 2px 10px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(100, 150, 255, 0.1)
            `,
            cursor: gameState === 'playing' ? 'none' : 'default'
          }}
          onClick={() => {
            if (gameState === 'waiting') {
              setGameState('playing');
              const game = gameStateRef.current;
              game.gameStarted = true;
              game.ballMoving = true;
            }
          }}
        />
        
        {/* Game status overlays */}
        {gameState === 'waiting' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.9)',
            pointerEvents: 'none'
          }}>
            <h2 style={{
              margin: '0 0 10px 0',
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Click to Start
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Move mouse to control paddle • Collect time-slow powerups
            </p>
          </div>
        )}

        {gameOverCountdown > 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.9)',
            pointerEvents: 'none'
          }}>
            <h2 style={{
              margin: '0 0 10px 0',
              fontSize: '32px',
              fontWeight: '700',
              color: '#ff6b6b'
            }}>
              GAME OVER
            </h2>
            <p style={{
              margin: 0,
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Restarting in {Math.ceil(gameOverCountdown / 1000)}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arkanoid;

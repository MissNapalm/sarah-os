import React, { useState, useRef, useEffect } from "react";

const PipesScreensaver = ({ onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 600) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 500) / 2, window.innerHeight - 505))
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = Math.max(-550, Math.min(window.innerWidth - 50, e.clientX - dragOffset.current.x));
        const newY = Math.max(-450, e.clientY - dragOffset.current.y);
        setPosition({
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = "auto";
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.pipes-close-btn') || e.target.closest('canvas')) return;
    setDragging(true);
    document.body.style.userSelect = "none";
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Pipes data
    const pipes = [];
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
    ];
    
    // Pipe class
    class Pipe {
      constructor(x, y) {
        this.segments = [{x, y}];
        this.direction = Math.floor(Math.random() * 4); // 0=right, 1=down, 2=left, 3=up
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = 2;
        this.segmentSize = 20;
        this.maxLength = 30 + Math.random() * 20;
        this.turnProbability = 0.02;
      }
      
      update() {
        if (this.segments.length >= this.maxLength) return;
        
        // Maybe turn
        if (Math.random() < this.turnProbability) {
          this.direction = Math.floor(Math.random() * 4);
        }
        
        // Get current head
        const head = this.segments[this.segments.length - 1];
        let newX = head.x;
        let newY = head.y;
        
        // Move based on direction
        switch(this.direction) {
          case 0: newX += this.segmentSize; break; // right
          case 1: newY += this.segmentSize; break; // down
          case 2: newX -= this.segmentSize; break; // left
          case 3: newY -= this.segmentSize; break; // up
        }
        
        // Wrap around edges
        if (newX < 0) newX = canvas.width;
        if (newX > canvas.width) newX = 0;
        if (newY < 0) newY = canvas.height;
        if (newY > canvas.height) newY = 0;
        
        this.segments.push({x: newX, y: newY});
      }
      
      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        
        // Draw segments as 3D-looking cylinders
        for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i];
          const size = this.segmentSize;
          
          // Main cylinder body
          ctx.fillStyle = this.color;
          ctx.fillRect(segment.x - size/2, segment.y - size/2, size, size);
          
          // Highlight for 3D effect
          const gradient = ctx.createLinearGradient(
            segment.x - size/2, segment.y - size/2,
            segment.x + size/2, segment.y + size/2
          );
          gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
          gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
          ctx.fillStyle = gradient;
          ctx.fillRect(segment.x - size/2, segment.y - size/2, size, size);
          
          // Pipe joints (circles at connections)
          if (i > 0) {
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, size/2 + 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Joint highlight
            ctx.beginPath();
            ctx.arc(segment.x - 3, segment.y - 3, size/3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();
          }
        }
      }
    }
    
    // Initialize pipes
    for (let i = 0; i < 5; i++) {
      pipes.push(new Pipe(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
    
    // Animation loop
    const animate = () => {
      // Clear with fade trail effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw pipes
      pipes.forEach(pipe => {
        pipe.update();
        pipe.draw(ctx);
      });
      
      // Add new pipe occasionally
      if (Math.random() < 0.003 && pipes.length < 8) {
        pipes.push(new Pipe(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }
      
      // Remove old pipes
      pipes.forEach((pipe, index) => {
        if (pipe.segments.length >= pipe.maxLength) {
          pipes.splice(index, 1);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "600px",
        height: "500px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "20px",
        padding: "15px",
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.6),
          0 8px 16px -8px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        animation: "windowAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        userSelect: "none",
        cursor: dragging ? "grabbing" : "grab",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1002
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Close button */}
      <button
        className="pipes-close-btn"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: 0.8,
          boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "white",
          fontWeight: "bold"
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = "1";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = "0.8";
          e.target.style.transform = "scale(1)";
        }}
      >
        ×
      </button>

      <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '18px', marginTop: '10px' }}>
        🔳 3D Pipes Screensaver
      </h2>
      
      <canvas
        ref={canvasRef}
        width={570}
        height={420}
        style={{
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          background: '#0a0a0a',
          boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.5)'
        }}
      />
      
      <div style={{ 
        color: 'rgba(255, 255, 255, 0.7)', 
        fontSize: '12px', 
        marginTop: '8px',
        textAlign: 'center'
      }}>
        Classic Windows 3D Pipes - Now in your browser! 🚀
      </div>
    </div>
  );
};

export default PipesScreensaver;

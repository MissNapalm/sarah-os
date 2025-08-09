
import React, { useState, useRef, useEffect } from "react";

const Window = ({ title, content, onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 520) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 480) / 2, window.innerHeight - 485))
  });
  const [size, setSize] = useState({ width: 520, height: 480 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = Math.max(-size.width + 50, Math.min(window.innerWidth - 50, e.clientX - dragOffset.current.x));
        const newY = Math.max(-size.height + 50, e.clientY - dragOffset.current.y);
        setPosition({
          x: newX,
          y: newY
        });
      } else if (resizing) {
        const newWidth = Math.max(400, e.clientX - position.x);
        const newHeight = Math.max(400, Math.min(e.clientY - position.y, window.innerHeight - position.y - 5));

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      document.body.style.userSelect = "auto";
    };

    if (dragging || resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, position.x, position.y, size.width, size.height]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-header-buttons') || e.target.closest('.resize-handle')) return;
    setDragging(true);
    document.body.style.userSelect = "none";
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const handleResizeStart = (e) => {
    setResizing(true);
    document.body.style.userSelect = "none";
    resizeStart.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  return (
    <div
      className="window"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        borderRadius: "20px",
        background: "rgba(20, 20, 20, 0.95)",
        backdropFilter: "blur(40px) saturate(180%)",
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.6),
          0 8px 16px -8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "windowAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        userSelect: "none",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        isolation: "isolate",
        position: "relative"
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Window Header */}
      <div
        className="window-header"
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)",
          padding: "16px 20px",
          color: "rgba(255, 255, 255, 0.95)",
          fontSize: "15px",
          fontWeight: "600",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          cursor: "grab",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          height: "52px",
          letterSpacing: "-0.01em",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px"
        }}
      >
        <span>{title}</span>
        <div className="window-header-buttons" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={onClose}
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: 0.9,
              boxShadow: `
                0 2px 8px rgba(255, 107, 107, 0.3),
                0 1px 3px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "1";
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow = `
                0 4px 12px rgba(255, 107, 107, 0.4),
                0 2px 6px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "0.9";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 2px 8px rgba(255, 107, 107, 0.3),
                0 1px 3px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
          >
            <span style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "10px",
              fontWeight: "bold",
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.3)"
            }}>×</span>
          </button>
        </div>
      </div>

      {/* Window Content with integrated resize corner */}
      <div
        className="window-content"
        style={{
          flex: 1,
          padding: "0",
          overflowY: "auto",
          overflowX: "hidden",
          color: "rgba(255, 255, 255, 0.92)",
          fontSize: "14px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: `
            linear-gradient(135deg, transparent 0%, transparent calc(100% - 30px), rgba(255, 255, 255, 0.08) calc(100% - 25px), rgba(255, 255, 255, 0.04) 100%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.1) 100%)
          `,
          position: "relative",
          lineHeight: "1.6",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px"
        }}
      >
        <div style={{ 
          padding: "24px", 
          height: "100%", 
          boxSizing: "border-box",
          paddingBottom: "40px" // Extra space for resize area
        }}>
          {content}
        </div>
        
        {/* Integrated resize handle */}
        <div
          className="resize-handle"
          style={{
            position: "absolute",
            bottom: "1px",
            right: "1px",
            width: "28px",
            height: "28px",
            cursor: "se-resize",
            zIndex: 1001,
            borderBottomRightRadius: "19px",
            userSelect: "none"
          }}
          onMouseDown={handleResizeStart}
        >
        </div>
      </div>
    </div>
  );
};

export default Window;
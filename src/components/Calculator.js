import React, { useState, useRef, useEffect } from "react";

const Calculator = ({ onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 300) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 420) / 2, window.innerHeight - 425))
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = Math.max(-280, Math.min(window.innerWidth - 50, e.clientX - dragOffset.current.x));
        const newY = Math.max(-400, e.clientY - dragOffset.current.y);
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
    if (e.target.closest('.calc-button') || e.target.closest('.calc-close-btn')) return;
    setDragging(true);
    document.body.style.userSelect = "none";
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '−':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation(null);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    { label: 'C', className: 'clear', onClick: clear },
    { label: '±', className: 'function', onClick: () => setDisplay(String(-parseFloat(display))) },
    { label: '%', className: 'function', onClick: () => setDisplay(String(parseFloat(display) / 100)) },
    { label: '÷', className: 'operator', onClick: () => performOperation('÷') },
    { label: '7', className: 'number', onClick: () => inputDigit(7) },
    { label: '8', className: 'number', onClick: () => inputDigit(8) },
    { label: '9', className: 'number', onClick: () => inputDigit(9) },
    { label: '×', className: 'operator', onClick: () => performOperation('×') },
    { label: '4', className: 'number', onClick: () => inputDigit(4) },
    { label: '5', className: 'number', onClick: () => inputDigit(5) },
    { label: '6', className: 'number', onClick: () => inputDigit(6) },
    { label: '−', className: 'operator', onClick: () => performOperation('−') },
    { label: '1', className: 'number', onClick: () => inputDigit(1) },
    { label: '2', className: 'number', onClick: () => inputDigit(2) },
    { label: '3', className: 'number', onClick: () => inputDigit(3) },
    { label: '+', className: 'operator', onClick: () => performOperation('+') },
    { label: '0', className: 'number zero', onClick: () => inputDigit(0) },
    { label: '.', className: 'number', onClick: inputDecimal },
    { label: '=', className: 'operator equals', onClick: calculate }
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "300px",
        height: "420px",
        background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "20px",
        padding: "15px",
        zIndex: 1003,
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.6),
          0 8px 16px -8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        animation: "windowAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        userSelect: "none",
        cursor: dragging ? "grabbing" : "grab",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Close button */}
      <button
        className="calc-close-btn"
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

      {/* Calculator title */}
      <div style={{
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: "10px",
        fontFamily: "'Inter', sans-serif",
        opacity: 0.9
      }}>
        ✨ Sarah's Calculator ✨
      </div>

      {/* Display */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        color: "#ffffff",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "15px",
        textAlign: "right",
        fontSize: "28px",
        fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', monospace",
        fontWeight: "300",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        wordBreak: "break-all"
      }}>
        {display.length > 10 ? display.slice(-10) : display}
      </div>
      
      {/* Buttons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "8px",
        flex: 1
      }}>
        {buttons.map((button, index) => (
          <button
            key={index}
            className="calc-button"
            onClick={button.onClick}
            style={{
              height: "45px",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              gridColumn: button.className.includes('zero') ? "span 2" : "auto",
              background: button.className.includes('operator') 
                ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                : button.className.includes('function') || button.className.includes('clear')
                ? "linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 100%)"
                : "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
              color: "white",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              boxShadow: `
                0 4px 12px rgba(0, 0, 0, 0.3), 
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              `,
              userSelect: "none",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
              e.target.style.boxShadow = `
                0 2px 8px rgba(0, 0, 0, 0.4), 
                inset 0 2px 4px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              `;
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 4px 12px rgba(0, 0, 0, 0.3), 
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 4px 12px rgba(0, 0, 0, 0.3), 
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              `;
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;

import React, { useState, useRef, useEffect } from "react";

const Calculator = ({ onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 300) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 420) / 2, window.innerHeight - 425))
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

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
      className="calculator-window fixed"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1003
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header flex items-center justify-between mb-2 select-none cursor-grab">
        <div className="window-header-buttons">
          {/* Close button */}
          <div
            className="window-header-button close"
            onClick={onClose}
            title="Close"
          />
          {/* ...other buttons... */}
        </div>
        {/* Calculator title */}
        <div className="calculator-title font-bold text-base text-white flex-1 text-center">
          Calculator
        </div>
      </div>

      {/* Display */}
      <div className="calculator-display bg-gray-800 text-white text-2xl rounded-lg px-4 py-3 mb-4 text-right min-h-[40px] tracking-wider shadow-inner">
        {display.length > 10 ? display.slice(-10) : display}
      </div>
      
      {/* Buttons */}
      <div className="calculator-buttons grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`calc-button ${button.className} bg-gray-700 text-white rounded-lg py-3 text-lg font-medium hover:bg-gray-600 transition`}
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;

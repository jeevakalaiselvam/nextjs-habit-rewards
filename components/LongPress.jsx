import React, { useState, useRef } from 'react';

const LongPress = ({ onLongPress, onClick, delay = 500, children }) => {
  const [longPressActive, setLongPressActive] = useState(false);
  const timeoutRef = useRef(null);

  const startPress = () => {
    timeoutRef.current = setTimeout(() => {
      setLongPressActive(true);
      if (onLongPress) onLongPress();
    }, delay);
  };

  const cancelPress = () => {
    clearTimeout(timeoutRef.current);
    if (!longPressActive && onClick) onClick();
    setLongPressActive(false);
  };

  return (
    <div
      onMouseDown={startPress}
      onTouchStart={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchEnd={cancelPress}
      style={{
        display: 'inline-block',
        textAlign: 'center',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default LongPress;

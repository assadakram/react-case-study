import React, { useEffect, useState } from 'react';
import './UndoToast.css';

interface UndoToastProps {
  onUndo: () => void;
  lastUndoTimestamp: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({ onUndo, lastUndoTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    // Reset timer when a new undo becomes available
    const elapsed = (Date.now() - lastUndoTimestamp) / 1000;
    const remaining = Math.max(0, 5 - elapsed);
    setTimeLeft(Math.ceil(remaining));

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        return newTime > 0 ? newTime : 0;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [lastUndoTimestamp]);

  if (timeLeft <= 0) return null;

  return (
    <div className="undo-toast">
      <span>Issue updated</span>
      <button onClick={onUndo} className="undo-button">
        Undo ({timeLeft}s)
      </button>
    </div>
  );
};
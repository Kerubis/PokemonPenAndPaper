import React, { useRef, useState, useLayoutEffect } from 'react';
import './ConfirmPopover.css';

const MARGIN = 8;

interface ConfirmPopoverProps {
  x: number;
  y: number;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
  x,
  y,
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y + MARGIN, left: x + MARGIN, visible: false });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const maxLeft = window.innerWidth - w - MARGIN;
    const maxTop = window.innerHeight - h - MARGIN;
    setPos({
      top: Math.min(Math.max(y + MARGIN, MARGIN), maxTop),
      left: Math.min(Math.max(x + MARGIN, MARGIN), maxLeft),
      visible: true,
    });
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="confirm-popover"
      style={{ top: pos.top, left: pos.left, visibility: pos.visible ? 'visible' : 'hidden' }}
    >
      <p>{message}</p>
      <div className="confirm-popover-buttons">
        <button onClick={onCancel} className="confirm-popover-cancel">{cancelLabel}</button>
        <button onClick={onConfirm} className="confirm-popover-confirm">{confirmLabel}</button>
      </div>
    </div>
  );
};

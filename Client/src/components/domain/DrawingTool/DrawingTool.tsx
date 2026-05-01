import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ConfirmPopover } from '../../ui/ConfirmPopover';
import './DrawingTool.css';

interface DrawingToolProps {
    initialDrawing?: string;
    onDrawingChange?: (dataUrl: string) => void;
}

const PALETTE_COLORS = [
    '#1a1a1a', // Black
    '#888888', // Grey
    '#cccccc', // Light Grey
    '#ffffff', // White
    '#e74c3c', // Red
    '#e67e22', // Orange
    '#f1c40f', // Yellow
    '#2ecc71', // Green
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#1abc9c', // Teal
    '#795548', // Brown
];

const BRUSH_SIZES = [1, 2, 5, 10, 20];

export const DrawingTool: React.FC<DrawingToolProps> = ({ initialDrawing, onDrawingChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const prevEraser = useRef(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [color, setColor] = useState('#1a1a1a');
    const [brushSize, setBrushSize] = useState(2);
    const [eraser, setEraser] = useState(false);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
    const [clearAnchor, setClearAnchor] = useState<{ x: number; y: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Scale canvas to devicePixelRatio for crisp rendering, then draw initial image
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        if (initialDrawing) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, rect.width, rect.height);
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = initialDrawing;
        } else {
            ctx.clearRect(0, 0, rect.width, rect.height);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scheduleSave = useCallback(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas || !onDrawingChange) return;
            onDrawingChange(canvas.toDataURL('image/png'));
        }, 500);
    }, [onDrawingChange]);

    const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY,
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if ('button' in e && e.button === 2) {
            prevEraser.current = eraser;
            setEraser(true);
        }
        isDrawing.current = true;
        lastPos.current = getPos(e);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing.current || !lastPos.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = eraser ? '#ffffff' : color;
        ctx.lineWidth = eraser ? brushSize * 2 : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
        ctx.stroke();

        lastPos.current = pos;
        scheduleSave();
    };

    const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement>) => {
        if (e && 'button' in e && e.button === 2) {
            setEraser(prevEraser.current);
        }
        isDrawing.current = false;
        lastPos.current = null;
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        draw(e);
    };

    const handleCanvasMouseLeave = () => {
        setCursorPos(null);
        if (isDrawing.current) setEraser(prevEraser.current);
        stopDrawing();
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const currentIndex = BRUSH_SIZES.indexOf(brushSize);
        if (e.deltaY < 0) {
            // scroll up → increase size
            if (currentIndex < BRUSH_SIZES.length - 1) setBrushSize(BRUSH_SIZES[currentIndex + 1]);
        } else {
            // scroll down → decrease size
            if (currentIndex > 0) setBrushSize(BRUSH_SIZES[currentIndex - 1]);
        }
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDrawingChange?.('');
        setClearAnchor(null);
    };

    return (
        <div className="drawing-tool">
            <div className="drawing-tool-header">
                <span className="drawing-tool-title">Map</span>
                <div className="drawing-tool-controls">
                    <div className="drawing-tool-palette">
                        {PALETTE_COLORS.map((c) => (
                            <button
                                key={c}
                                className={`drawing-tool-color-btn${!eraser && color === c ? ' active' : ''}`}
                                style={{ background: c }}
                                onClick={() => { setColor(c); setEraser(false); }}
                                title={c}
                            />
                        ))}
                    </div>
                    <div className="drawing-tool-brush-sizes">
                        {BRUSH_SIZES.map((s) => (
                            <button
                                key={s}
                                className={`drawing-tool-size-btn${brushSize === s ? ' active' : ''}`}
                                onClick={() => setBrushSize(s)}
                                title={`Brush size ${s}`}
                            >
                                <span
                                    className="drawing-tool-size-dot"
                                    style={{ width: s + 4, height: s + 4 }}
                                />
                            </button>
                        ))}
                    </div>
                    <button
                        className={`drawing-tool-eraser-btn${eraser ? ' active' : ''}`}
                        onClick={() => setEraser((v) => !v)}
                        title="Eraser"
                    >
                        ✏ Eraser
                    </button>
                    <button
                        className="drawing-tool-clear-btn"
                        onClick={(e) => setClearAnchor({ x: e.clientX, y: e.clientY })}
                        title="Clear canvas"
                    >
                        Clear
                    </button>
                </div>
            </div>
            {clearAnchor && (
                <ConfirmPopover
                    x={clearAnchor.x}
                    y={clearAnchor.y}
                    message="Clear the entire canvas?"
                    confirmLabel="Clear"
                    onConfirm={handleClear}
                    onCancel={() => setClearAnchor(null)}
                />
            )}
            <div className="drawing-tool-canvas-wrapper" ref={wrapperRef}>
                {cursorPos && (
                    <span
                        className="drawing-tool-cursor-dot"
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y,
                            width: eraser ? brushSize * 2 : brushSize,
                            height: eraser ? brushSize * 2 : brushSize,
                            background: eraser ? 'transparent' : color,
                            borderColor: eraser ? '#888' : (color === '#ffffff' ? '#aaa' : color),
                        }}
                    />
                )}
                <canvas
                    ref={canvasRef}
                    className="drawing-tool-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={(e) => stopDrawing(e)}
                    onMouseLeave={handleCanvasMouseLeave}
                    onWheel={handleWheel}
                    onContextMenu={(e) => e.preventDefault()}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={() => stopDrawing()}
                />
            </div>
        </div>
    );
};

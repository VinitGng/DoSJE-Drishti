import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  PenTool,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Eraser,
  Tag,
  Palette,
  Undo2,
  Save,
  Check,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { Inspection } from '../../types';

interface AnnotationStamp {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface StrokePoint {
  x: number;
  y: number;
}

interface DrawStroke {
  id: string;
  points: StrokePoint[];
  color: string;
  width: number;
}

interface EvidencePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  inspection: Inspection;
  initialCaption?: string;
  initialObservation?: string;
  initialCategory?: string;
  currentTimeStr?: string;
  onFinalize: (finalizedImage: string, notes: string, category: string) => void;
}

export const EvidencePreviewModal: React.FC<EvidencePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  inspection,
  initialCaption = '',
  initialObservation = '',
  initialCategory = 'infrastructure',
  currentTimeStr = '',
  onFinalize,
}) => {
  if (!isOpen || !imageUrl) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // 90-degree rotation state: 0, 90, 180, 270
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [toolMode, setToolMode] = useState<'draw' | 'stamp' | 'view'>('draw');
  const [strokeColor, setStrokeColor] = useState<string>('#ef4444'); // Red default
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [activeStampText, setActiveStampText] = useState<string>('⚠️ Structural Defect');
  const [notes, setNotes] = useState<string>(
    initialObservation ? `${initialCaption}: ${initialObservation}` : initialCaption || 'On-site physical inspection evidence.'
  );
  const [category, setCategory] = useState<string>(initialCategory);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawStroke | null>(null);
  const [stamps, setStamps] = useState<AnnotationStamp[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const colors = [
    { label: 'Crimson Red', hex: '#ef4444' },
    { label: 'Warning Amber', hex: '#f59e0b' },
    { label: 'Statutory Yellow', hex: '#eab308' },
    { label: 'Emerald Green', hex: '#10b981' },
    { label: 'Signal Blue', hex: '#3b82f6' },
    { label: 'White', hex: '#ffffff' },
  ];

  const presetStamps = [
    '⚠️ Structural Defect',
    '🚯 Hygiene Violation',
    '📋 Attendance Mismatch',
    '🧯 Fire Safety Hazard',
    '♿ Accessibility Barrier',
    '✓ Verified Compliant',
  ];

  // Pre-load image object
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Re-render when rotation, stamps, or strokes update
  useEffect(() => {
    renderCanvas();
  }, [rotationAngle, stamps, strokes, currentStroke]);

  // 90-degree step rotation handlers
  const handleRotateCw90 = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleRotateCcw90 = () => {
    setRotationAngle((prev) => (prev - 90 + 360) % 360);
  };

  const handleResetOrientation = () => {
    setRotationAngle(0);
  };

  // Render image onto canvas with 90-degree rotation and annotations
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas dimensions for 90 or 270 degree rotation
    const isQuarterTurn = rotationAngle === 90 || rotationAngle === 270;
    const targetWidth = isQuarterTurn ? img.naturalHeight || 720 : img.naturalWidth || 1280;
    const targetHeight = isQuarterTurn ? img.naturalWidth || 1280 : img.naturalHeight || 720;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Center and rotate image
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    ctx.restore();

    // Draw all completed freehand strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 1) return;
      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Draw active stroke currently being drawn
    if (currentStroke && currentStroke.points.length > 0) {
      ctx.save();
      ctx.strokeStyle = currentStroke.color;
      ctx.lineWidth = currentStroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
      for (let i = 1; i < currentStroke.points.length; i++) {
        ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw all annotation stamps
    stamps.forEach((stamp) => {
      drawStamp(ctx, stamp.x, stamp.y, stamp.text, stamp.color);
    });
  };

  const drawStamp = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) => {
    ctx.save();
    ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    const textMetrics = ctx.measureText(text);
    const paddingX = 14;
    const paddingY = 10;
    const boxWidth = textMetrics.width + paddingX * 2;
    const boxHeight = 36;

    // Background pill
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Callout pointer triangle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + boxHeight / 2);
    ctx.lineTo(x + 8, y + boxHeight / 2);
    ctx.lineTo(x, y + boxHeight / 2 + 10);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // Canvas coordinates accounting for CSS scaling
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (toolMode === 'stamp') {
      const newStamp: AnnotationStamp = {
        id: `stamp-${Date.now()}`,
        x,
        y,
        text: activeStampText,
        color: strokeColor,
      };
      setStamps((prev) => [...prev, newStamp]);
      return;
    }

    if (toolMode === 'draw') {
      setIsDrawing(true);
      setCurrentStroke({
        id: `stroke-${Date.now()}`,
        points: [{ x, y }],
        color: strokeColor,
        width: strokeWidth,
      });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode !== 'draw' || !currentStroke) return;
    const { x, y } = getCanvasCoords(e);

    setCurrentStroke((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, { x, y }],
      };
    });
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke) {
      setIsDrawing(false);
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
  };

  const handleUndo = () => {
    if (stamps.length > 0) {
      setStamps((prev) => prev.slice(0, -1));
      return;
    }
    if (strokes.length > 0) {
      setStrokes((prev) => prev.slice(0, -1));
    }
  };

  const handleClearAllAnnotations = () => {
    setStamps([]);
    setStrokes([]);
    setCurrentStroke(null);
  };

  const handleFinalize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    try {
      const finalizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onFinalize(finalizedDataUrl, notes, category);
      onClose();
    } catch (err) {
      console.warn('Canvas export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Orientation label helper
  const getOrientationLabel = (angle: number) => {
    switch (angle) {
      case 90:
        return '90° Clockwise (Vertical Right)';
      case 180:
        return '180° Inverted (Upside Down)';
      case 270:
        return '270° Counter-Clockwise (Vertical Left)';
      default:
        return '0° Normal (Original)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-white space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Evidence Preview, 90° Rotation & Annotation Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  DoSJE Statutory HUD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adjust orientation in 90-degree increments, draw defect callouts, or pin regulatory violation stamps before saving to the evidence queue.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated 90-Degree Rotation & Annotation Toolbar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 space-y-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* 90-Degree Rotation Control Group */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-indigo-500/30">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-300 px-1 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                Rotation (90° Increments):
              </span>

              {/* CCW -90° */}
              <button
                type="button"
                onClick={handleRotateCcw90}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-mono text-[11px] font-semibold border border-slate-700"
                title="Rotate 90° Counter-Clockwise (-90°)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>-90°</span>
              </button>

              {/* Primary 1-Click Rotate 90° Button */}
              <button
                type="button"
                onClick={handleRotateCw90}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono text-[11px] font-bold shadow-md shadow-indigo-900/40 active:scale-95"
                title="Rotate 90° Clockwise (+90°)"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-300 animate-spin-once" />
                <span>Rotate 90° ↻</span>
              </button>

              {/* Angle Pill */}
              <span
                className={`text-[10px] font-mono px-2 py-1 rounded-md font-bold border transition-colors ${
                  rotationAngle !== 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
                title={getOrientationLabel(rotationAngle)}
              >
                {rotationAngle}°
              </span>

              {/* Reset to 0° if rotated */}
              {rotationAngle !== 0 && (
                <button
                  type="button"
                  onClick={handleResetOrientation}
                  className="px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset orientation to 0°"
                >
                  Reset (0°)
                </button>
              )}
            </div>

            {/* Tool Mode Buttons (Draw vs Stamp) */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setToolMode('draw')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  toolMode === 'draw' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw / Highlight</span>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('stamp')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  toolMode === 'stamp' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Violation Stamp</span>
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setStrokeColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    strokeColor === c.hex ? 'scale-110 border-white shadow-md' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Stroke Width Selector */}
            {toolMode === 'draw' && (
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[2, 4, 8].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setStrokeWidth(size)}
                    className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${
                      strokeWidth === size ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            )}

            {/* Undo & Reset Annotations */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                title="Undo last action"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleClearAllAnnotations}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                title="Reset annotations"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Clear Marks</span>
              </button>
            </div>
          </div>

          {/* Stamp selector tray when in stamp mode */}
          {toolMode === 'stamp' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Click Image to place:</span>
              {presetStamps.map((stamp) => (
                <button
                  key={stamp}
                  type="button"
                  onClick={() => setActiveStampText(stamp)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono whitespace-nowrap border transition-all cursor-pointer ${
                    activeStampText === stamp
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {stamp}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Canvas Viewport with Live Floating Rotation Button */}
        <div className="relative flex-1 min-h-[260px] max-h-[48vh] bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="max-h-full max-w-full object-contain cursor-crosshair touch-none"
          />

          {/* Floating On-Canvas Quick 90° Rotation Button */}
          <button
            type="button"
            onClick={handleRotateCw90}
            className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-black/85 hover:bg-black text-amber-300 hover:text-amber-200 border border-amber-500/50 backdrop-blur-md flex items-center gap-1.5 text-xs font-mono font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
            title="Rotate image orientation by 90 degrees clockwise"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Rotate 90°</span>
            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/30">
              {rotationAngle}°
            </span>
          </button>

          {/* Floating Canvas Hint */}
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none">
            {toolMode === 'draw'
              ? `✍️ Drag cursor to draw callouts · Orientation: ${rotationAngle}°`
              : toolMode === 'stamp'
              ? `🏷️ Click to place "${activeStampText}" pin · Orientation: ${rotationAngle}°`
              : `Orientation: ${rotationAngle}°`}
          </div>
        </div>

        {/* Notes & Category Customization Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 block">
              Inspector Observation & Annotation Notes:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Broken tile threshold and seepage observed near fire exit..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 block">
              Evidence Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="infrastructure">Infrastructure & Facility</option>
              <option value="kitchen_hygiene">Kitchen & Food Hygiene</option>
              <option value="attendance_register">Attendance & Muster Roll</option>
              <option value="beneficiaries">Beneficiary Living Quarters</option>
              <option value="medical_records">Medical & Rehabilitation Files</option>
            </select>
          </div>
        </div>

        {/* Action Buttons: Cancel vs Save to Evidence Queue */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFinalize}
            disabled={isExporting}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            title="Bake rotation and annotations, and save to evidence queue"
          >
            <Save className="w-4 h-4" />
            <span>Finalize & Save to Evidence Queue</span>
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiDownload, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ width = 600, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [prevPoint, setPrevPoint] = useState<Point | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Available colors
  const colors = [
    '#000000', // Black
    '#ff0000', // Red
    '#0000ff', // Blue
    '#008000', // Green
    '#ffa500', // Orange
    '#800080', // Purple
    '#ff69b4', // Pink
    '#8b4513', // Brown
  ];

  // Line width options
  const lineWidths = [2, 5, 10, 15, 20];

  // Initialize the canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas to white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Make sure the canvas resolution matches its display size
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      // Fill with white again at the new size
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Handle drawing on the canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    
    // Get the current point
    const currentPoint = getPointFromEvent(e, canvas);
    setPrevPoint(currentPoint);
    
    // Start the new path
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Draw a small circle at the starting point
    context.beginPath();
    context.arc(currentPoint.x, currentPoint.y, lineWidth / 2, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    
    // Set hasDrawing to true as soon as there's any mark on the canvas
    setHasDrawing(true);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Prevent scrolling on touch devices
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
    
    // Get the current point
    const currentPoint = getPointFromEvent(e, canvas);
    
    // Draw a line from previous point to current point
    if (prevPoint) {
      context.beginPath();
      context.moveTo(prevPoint.x, prevPoint.y);
      context.lineTo(currentPoint.x, currentPoint.y);
      context.stroke();
    }
    
    setPrevPoint(currentPoint);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    setPrevPoint(null);
  };
  
  // Helper function to get coordinates from mouse or touch event
  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement): Point => {
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Get canvas position
    const rect = canvas.getBoundingClientRect();
    
    // Calculate point relative to canvas
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };
  
  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    
    toast.info('Canvas cleared!', {
      position: 'bottom-right',
      autoClose: 2000
    });
  };
  
  // Save the drawing
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsSaving(true);
    
    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create an anchor element for downloading
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mindease-drawing-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Drawing saved!', {
        position: 'bottom-right',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error saving drawing:', error);
      toast.error('Could not save drawing. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Creative Drawing</h2>
        <div className="flex space-x-2">
          {/* Clear button */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={clearCanvas}
            disabled={!hasDrawing}
          >
            <FiTrash2 className="mr-1" />
            Clear
          </button>
          
          {/* Save button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={saveDrawing}
            disabled={!hasDrawing || isSaving}
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <FiDownload className="mr-1" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tool Selection */}
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <div className="mr-4">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Color:</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((colorOption) => (
              <div
                key={colorOption}
                className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition ${
                  color === colorOption ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
                aria-label={`Select ${colorOption} color`}
              >
                {color === colorOption && (
                  <FiCheck className="text-white m-auto h-full" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Size:</label>
          <div className="flex flex-wrap gap-2">
            {lineWidths.map((width) => (
              <div
                key={width}
                className={`w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  lineWidth === width ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setLineWidth(width)}
              >
                <div 
                  className="rounded-full bg-black dark:bg-white" 
                  style={{ width: width, height: width }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full aspect-video bg-white rounded-lg touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        ></canvas>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Draw something that expresses your feelings or just helps you relax.
        </p>
      </div>
    </div>
  );
};

export default DrawingCanvas; 
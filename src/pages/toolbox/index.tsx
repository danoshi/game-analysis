import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Move, 
  Circle, 
  Square, 
  Triangle, 
  ArrowRight, 
  Pencil, 
 
  Trash2, 
  RotateCcw,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface BoardElement {
  id: string;
  type: 'player' | 'ball' | 'cone' | 'marker' | 'drawing' | 'text';
  position: Point;
  data?: any;
}

interface DrawingPath {
  id: string;
  points: Point[];
  type: 'line' | 'arrow';
  color: string;
  width: number;
}

const SoccerTacticsBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [drawings, setDrawings] = useState<DrawingPath[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  // Canvas dimensions - vertical field (rotated 90 degrees)
  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 1000;

  const drawField = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw field background
    ctx.fillStyle = '#2d5a2d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Field margins
    const margin = 50;
    const fieldWidth = CANVAS_WIDTH - 2 * margin;
    const fieldHeight = CANVAS_HEIGHT - 2 * margin;
    
    // Draw field lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    // Outer boundary
    ctx.strokeRect(margin, margin, fieldWidth, fieldHeight);
    
    // Center line (now horizontal across the middle)
    ctx.beginPath();
    ctx.moveTo(margin, CANVAS_HEIGHT / 2);
    ctx.lineTo(CANVAS_WIDTH - margin, CANVAS_HEIGHT / 2);
    ctx.stroke();
    
    // Center circle
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 80, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Center spot
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Goal areas (6-yard box) - now top and bottom
    const goalAreaWidth = 180;
    const goalAreaHeight = 60;
    const goalAreaX = (CANVAS_WIDTH - goalAreaWidth) / 2;
    
    // Top goal area
    ctx.strokeRect(goalAreaX, margin, goalAreaWidth, goalAreaHeight);
    
    // Bottom goal area
    ctx.strokeRect(goalAreaX, CANVAS_HEIGHT - margin - goalAreaHeight, goalAreaWidth, goalAreaHeight);
    
    // Penalty areas (18-yard box) - now top and bottom
    const penaltyAreaWidth = 400;
    const penaltyAreaHeight = 170;
    const penaltyAreaX = (CANVAS_WIDTH - penaltyAreaWidth) / 2;
    
    // Top penalty area
    ctx.strokeRect(penaltyAreaX, margin, penaltyAreaWidth, penaltyAreaHeight);
    
    // Bottom penalty area
    ctx.strokeRect(penaltyAreaX, CANVAS_HEIGHT - margin - penaltyAreaHeight, penaltyAreaWidth, penaltyAreaHeight);
    
    // Penalty spots
    ctx.fillStyle = '#ffffff';
    const penaltySpotDistance = 130;
    
    // Top penalty spot
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, margin + penaltySpotDistance, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bottom penalty spot
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT - margin - penaltySpotDistance, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Penalty arcs
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    // Top penalty arc
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, margin + penaltySpotDistance, 100, Math.PI/6, 5*Math.PI/6);
    ctx.stroke();
    
    // Bottom penalty arc
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT - margin - penaltySpotDistance, 100, -5*Math.PI/6, -Math.PI/6);
    ctx.stroke();
    
    // Goals - now at top and bottom
    const goalWidth = 80;
    const goalHeight = 20;
    const goalX = (CANVAS_WIDTH - goalWidth) / 2;
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Top goal
    ctx.strokeRect(goalX, margin - goalHeight, goalWidth, goalHeight);
    
    // Bottom goal
    ctx.strokeRect(goalX, CANVAS_HEIGHT - margin, goalWidth, goalHeight);
    
    // Corner arcs
    const cornerRadius = 10;
    
    // Top-left corner
    ctx.beginPath();
    ctx.arc(margin, margin, cornerRadius, 0, Math.PI/2);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - margin, margin, cornerRadius, Math.PI/2, Math.PI);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.arc(margin, CANVAS_HEIGHT - margin, cornerRadius, -Math.PI/2, 0);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - margin, CANVAS_HEIGHT - margin, cornerRadius, Math.PI, 3*Math.PI/2);
    ctx.stroke();
  }, []);

  const drawElements = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw drawings first (so they're behind elements)
    drawings.forEach((drawing) => {
      if (drawing.points.length < 2) return;
      
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw straight line
      ctx.beginPath();
      ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
      ctx.lineTo(drawing.points[drawing.points.length - 1].x, drawing.points[drawing.points.length - 1].y);
      ctx.stroke();
      
      // Draw arrow head if it's an arrow
      if (drawing.type === 'arrow' && drawing.points.length >= 2) {
        const startPoint = drawing.points[0];
        const endPoint = drawing.points[drawing.points.length - 1];
        
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x
        );
        
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;
        
        ctx.fillStyle = drawing.color;
        ctx.beginPath();
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(
          endPoint.x - arrowLength * Math.cos(angle - arrowAngle),
          endPoint.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          endPoint.x - arrowLength * Math.cos(angle + arrowAngle),
          endPoint.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fill();
      }
    });
    
    // Draw current path being drawn (as straight line preview)
    if (isDrawing && currentPath.length > 1) {
      const startPoint = currentPath[0];
      const endPoint = currentPath[currentPath.length - 1];
      
      ctx.strokeStyle = selectedTool === 'arrow' ? '#ef4444' : '#000000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.setLineDash([5, 5]); // Dashed preview line
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
      
      ctx.setLineDash([]); // Reset dash
      
      // Show arrow preview if drawing arrow
      if (selectedTool === 'arrow') {
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x
        );
        
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;
        
        ctx.beginPath();
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(
          endPoint.x - arrowLength * Math.cos(angle - arrowAngle),
          endPoint.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(
          endPoint.x - arrowLength * Math.cos(angle + arrowAngle),
          endPoint.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      }
    }
    
    // Draw elements
    elements.forEach((element) => {
      const { x, y } = element.position;
      
      switch (element.type) {
        case 'player':
          // Draw player as colored circle with number
          ctx.fillStyle = element.data?.team === 'home' ? '#3b82f6' : '#ef4444';
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
          ctx.fill();
          
          // White border
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Player number
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.data?.number || '1', x, y + 4);
          break;
          
        case 'ball':
          // Draw realistic soccer ball
          const ballRadius = 12;
          
          // White base
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // Black outline
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Soccer ball pentagon pattern
          ctx.fillStyle = '#000000';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          
          // Central pentagon
          const pentagonRadius = 4;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const px = x + pentagonRadius * Math.cos(angle);
            const py = y + pentagonRadius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          
          // Three curved lines extending from pentagon
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          
          // Top curve
          ctx.beginPath();
          ctx.arc(x, y - 3, 6, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
          
          // Bottom-left curve
          ctx.beginPath();
          ctx.arc(x - 4, y + 2, 6, -Math.PI * 0.1, Math.PI * 0.4);
          ctx.stroke();
          
          // Bottom-right curve
          ctx.beginPath();
          ctx.arc(x + 4, y + 2, 6, Math.PI * 0.6, Math.PI * 1.1);
          ctx.stroke();
          break;
          
        case 'cone':
          // Draw training cone
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(x, y - 12);
          ctx.lineTo(x - 8, y + 8);
          ctx.lineTo(x + 8, y + 8);
          ctx.closePath();
          ctx.fill();
          
          // Cone outline
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
          
        case 'marker':
          // Draw marker
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
          
          // Marker outline
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
      }
      
      // Highlight selected element
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - 22, y - 22, 44, 44);
        ctx.setLineDash([]);
      }
    });
  }, [elements, drawings, selectedElement, isDrawing, currentPath, selectedTool]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawField(ctx);
    drawElements(ctx);
  }, [drawField, drawElements]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const isPointOnLine = (point: Point, lineStart: Point, lineEnd: Point, threshold: number = 10) => {
    const lineLength = Math.sqrt(
      Math.pow(lineEnd.x - lineStart.x, 2) + Math.pow(lineEnd.y - lineStart.y, 2)
    );
    
    if (lineLength === 0) return false;
    
    const distance = Math.abs(
      (lineEnd.y - lineStart.y) * point.x - 
      (lineEnd.x - lineStart.x) * point.y + 
      lineEnd.x * lineStart.y - 
      lineEnd.y * lineStart.x
    ) / lineLength;
    
    return distance <= threshold;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    
    if (selectedTool === 'move') {
      // Check for elements first
      const element = elements.find(el => {
        const distance = Math.sqrt(
          Math.pow(el.position.x - point.x, 2) + Math.pow(el.position.y - point.y, 2)
        );
        return distance <= 20;
      });
      
      if (element) {
        setSelectedElement(element.id);
        setIsDragging(true);
        setDragOffset({
          x: point.x - element.position.x,
          y: point.y - element.position.y
        });
      } else {
        // Check for drawings
        const drawing = drawings.find(d => 
          isPointOnLine(point, d.points[0], d.points[d.points.length - 1])
        );
        
        if (drawing) {
          // Delete the drawing
          setDrawings(prev => prev.filter(d => d.id !== drawing.id));
        } else {
          setSelectedElement(null);
        }
      }
    } else if (selectedTool === 'line' || selectedTool === 'arrow') {
      setIsDrawing(true);
      setCurrentPath([point]);
    } else {
      // Add elements
      switch (selectedTool) {
        case 'player-home':
          addElement('player', point, { team: 'home', number: Math.floor(Math.random() * 11) + 1 });
          break;
        case 'player-away':
          addElement('player', point, { team: 'away', number: Math.floor(Math.random() * 11) + 1 });
          break;
        case 'ball':
          addElement('ball', point);
          break;
        case 'cone':
          addElement('cone', point);
          break;
        case 'marker':
          addElement('marker', point);
          break;
      }
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    
    if (isDragging && selectedElement) {
      setElements(prev => prev.map(el => 
        el.id === selectedElement 
          ? { ...el, position: { x: point.x - dragOffset.x, y: point.y - dragOffset.y } }
          : el
      ));
    } else if (isDrawing) {
      setCurrentPath(prev => [...prev, point]);
      redrawCanvas();
    }
  };
  
  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    } else if (isDrawing) {
      if (currentPath.length > 1) {
        // Create straight line from first to last point
        const straightLine: DrawingPath = {
          id: Date.now().toString(),
          points: [currentPath[0], currentPath[currentPath.length - 1]],
          type: selectedTool === 'arrow' ? 'arrow' : 'line',
          color: selectedTool === 'arrow' ? '#ef4444' : '#000000',
          width: 3
        };
        setDrawings(prev => [...prev, straightLine]);
      }
      setIsDrawing(false);
      setCurrentPath([]);
    }
  };

  const addElement = (type: BoardElement['type'], position: Point, data?: any) => {
    const newElement: BoardElement = {
      id: Date.now().toString(),
      type,
      position,
      data
    };
    setElements(prev => [...prev, newElement]);
  };


  const clearBoard = () => {
    setElements([]);
    setDrawings([]);
    setSelectedElement(null);
  };

  const deleteSelected = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const tools = [
    { id: 'move', icon: Move, label: 'Move', color: 'bg-gray-100' },
    { id: 'player-home', icon: Circle, label: 'Home Player', color: 'bg-blue-100' },
    { id: 'player-away', icon: Circle, label: 'Away Player', color: 'bg-red-100' },
    { id: 'ball', icon: Circle, label: 'Ball', color: 'bg-white' },
    { id: 'cone', icon: Triangle, label: 'Cone', color: 'bg-yellow-100' },
    { id: 'marker', icon: Square, label: 'Marker', color: 'bg-green-100' },
    { id: 'line', icon: Pencil, label: 'Draw Line', color: 'bg-gray-100' },
    { id: 'arrow', icon: ArrowRight, label: 'Draw Arrow', color: 'bg-red-100' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-shrink-0 bg-background border-b px-4 py-3">
        <h1 className="text-2xl font-bold">Soccer Tactics Board</h1>
        <p className="text-sm text-muted-foreground">
          Create and plan your training sessions and tactics
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <div className="w-64 lg:w-72 border-r bg-muted/30 p-2 lg:p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-3">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  className="flex flex-col h-14 lg:h-16 p-1 lg:p-2 text-xs lg:text-sm"
                >
                  <tool.icon className="h-4 w-4 lg:h-5 lg:w-5 mb-1" />
                  <span className="text-xs leading-tight">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Actions</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelected}
              disabled={!selectedElement}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearBoard}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Board
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Instructions</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Select tools to add elements</p>
              <p>• Use Move tool to drag elements</p>
              <p>• Draw straight lines and arrows</p>
              <p>• Lines auto-correct to be straight</p>
              <p>• Click elements/lines to delete them</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Save/Load</h3>
            <Button variant="outline" size="sm" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Setup
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-2 lg:p-4 bg-gray-50 overflow-auto">
          <Card className="shadow-lg w-full max-w-none">
            <CardContent className="p-2 lg:p-4">
              <div className="w-full overflow-auto">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleCanvasMouseDown(e as any);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    handleCanvasMouseMove(e as any);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleCanvasMouseUp();
                  }}
                  className="border border-gray-300 cursor-crosshair bg-white rounded block"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SoccerTacticsBoard;
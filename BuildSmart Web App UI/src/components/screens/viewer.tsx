import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Box,
  Layers,
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Camera,
  Calculator,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
} from "lucide-react";
import IFCViewer from "../ifc-viewer/IFCViewer";
import FloorPlan2D from "../2d-viewer/FloorPlan2D";
import FloorPlan3D from "../ifc-viewer/FloorPlan3D";
import PlanViewer2DOL from "../2d-viewer/FloorPlan2DOL";

interface ViewerScreenProps {
  onScreenChange: (screen: string) => void;
}

export function ViewerScreen({ onScreenChange }: ViewerScreenProps) {
  const [layers, setLayers] = useState({
    walls: true,
    doors: true,
    windows: true,
    roof: false,
    furniture: false,
    dimensions: true,
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(
    "wall-1"
  );
  const [viewMode, setViewMode] = useState("3d");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleLayer = (layer: string) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const layerControls = [
    { key: "walls", label: "Walls", count: 12, color: "bg-primary" },
    { key: "doors", label: "Doors", count: 3, color: "bg-accent" },
    { key: "windows", label: "Windows", count: 8, color: "bg-chart-3" },
    { key: "roof", label: "Roof", count: 1, color: "bg-chart-4" },
    { key: "furniture", label: "Furniture", count: 15, color: "bg-chart-5" },
    {
      key: "dimensions",
      label: "Dimensions",
      count: 24,
      color: "bg-muted-foreground",
    },
  ];

  return (
    <div className="flex-1 min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex overflow-auto">
      {/* Main 3D Canvas */}
      <div className="flex-1 relative bg-gradient-to-br from-muted/10 to-muted/5">
        {/* 3D Viewport Placeholder */}
        <div className="absolute inset-4 bg-background rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          {/* <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Box className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">3D Model Viewport</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Interactive 3D model with WebGL rendering. Use mouse to rotate,
              pan, and zoom.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Camera className="w-4 h-4" />
              <span>Three.js / WebGL Canvas</span>
            </div>
          </div> */}
          {viewMode === "3d" ? (
            <FloorPlan3D />
          ) : (
            <FloorPlan2D />
//             <PlanViewer2DOL 
//   imageUrl="https://i.pinimg.com/1200x/59/f7/d4/59f7d43b756c8419fd5472214684b12e.jpg" 
//   width={2000}   // original image width
//   height={1500}  // original image height
// />

          )}
        </div>

        {/* View Mode Toggle */}
        <div className="absolute top-6 left-6">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-2 bg-background/80 backdrop-blur">
              <TabsTrigger value="3d">3D View</TabsTrigger>
              <TabsTrigger value="2d">2D Plan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-background/50 backdrop-blur flex flex-col">
        {/* Layer Controls */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Layers
          </h3>

          <div className="space-y-3">
            {layerControls.map((layer) => (
              <div
                key={layer.key}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{layer.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {layer.count}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    {layers[layer.key] ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Switch
                    checked={layers[layer.key]}
                    onCheckedChange={() => toggleLayer(layer.key)}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Element Inspector */}
        <div className="flex-1 p-6 overflow-auto">
          <h3 className="font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Inspector
          </h3>

          {selectedElement ? (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Wall Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Length</span>
                    <div className="font-medium">12.5 ft</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height</span>
                    <div className="font-medium">9.0 ft</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thickness</span>
                    <div className="font-medium">6 in</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area</span>
                    <div className="font-medium">112.5 sq ft</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Material</div>
                  <div className="text-sm text-muted-foreground">
                    Standard Drywall
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Room</div>
                  <div className="text-sm text-muted-foreground">
                    Living Room
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Estimated Cost</div>
                  <div className="text-lg font-semibold text-primary">
                    $340.50
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-2xl flex items-center justify-center">
                <Info className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                Click on an element in the 3D view to inspect its properties
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-t border-border bg-muted/10">
          <h4 className="font-medium mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Area</span>
              <div className="font-semibold">2,450 sq ft</div>
            </div>
            <div>
              <span className="text-muted-foreground">Rooms</span>
              <div className="font-semibold">8</div>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Cost</span>
              <div className="font-semibold text-primary">$18,750</div>
            </div>
            <div>
              <span className="text-muted-foreground">Timeline</span>
              <div className="font-semibold">6-8 weeks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

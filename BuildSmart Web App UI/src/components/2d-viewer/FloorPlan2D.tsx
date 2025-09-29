// FloorPlan2DViewer.tsx
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "../ui/button";
import { RotateCcw, Move, ZoomIn, ZoomOut } from "lucide-react";

type FloorPlan2DViewerProps = {
  // src: string; // Floor plan image URL
};

const cameraControls = [
  { icon: RotateCcw, label: "Reset View", action: "reset" },
  { icon: ZoomIn, label: "Zoom In", action: "zoom-in" },
  { icon: ZoomOut, label: "Zoom Out", action: "zoom-out" },
];

const FloorPlan2DViewer: React.FC<FloorPlan2DViewerProps> = ({}) => {
  return (
    <div className="h-full w-full">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false }}
        pinch={{ step: 5 }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            {/* Floating Camera Controls */}
            <div className="absolute bottom-6 left-6 z-50">
              <div className="flex items-center justify-center space-x-2 bg-background border border-muted-foreground/20 rounded-lg shadow-md p-2">
                {cameraControls.map((control) => {
                  const Icon = control.icon;
                  return (
                    <Button
                      key={control.action}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:bg-gray-100 rounded-md p-2 "
                      title={control.label}
                      onClick={() => {
                        if (control.action === "zoom-in") {
                          zoomIn();
                        } else if (control.action === "zoom-out") {
                          zoomOut();
                        } else if (control.action === "reset") {
                          resetTransform();
                        } else if (control.action === "pan") {
                        }
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Image */}
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              <img
                src={
                  "https://i.pinimg.com/1200x/59/f7/d4/59f7d43b756c8419fd5472214684b12e.jpg"
                }
                alt="2D Floor Plan"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default FloorPlan2DViewer;

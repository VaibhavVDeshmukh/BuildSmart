import React, { useEffect, useRef } from "react";
import { Viewer } from "@xeokit/xeokit-sdk";
import { XKTLoaderPlugin } from "@xeokit/xeokit-sdk";

type IFCViewerProps = {
  modelUrl?: string;
};

const XeokitViewer = ({modelUrl}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viewer = new Viewer({
      canvasElement: canvasRef.current,
      transparent: true,
    });

    const camera = viewer.camera;
    camera.eye = [10, 10, 10];
    camera.look = [0, 0, 0];
    camera.up = [0, 1, 0];

    // Orbit controls
    viewer.cameraControl.navMode = "orbit";

    // XKT loader
    const xktLoader = new XKTLoaderPlugin(viewer);

    xktLoader.load({
      id: "myModel",
      src: modelUrl, // ✅ must point to actual .xkt file in public folder
    });

    return () => viewer.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default XeokitViewer;

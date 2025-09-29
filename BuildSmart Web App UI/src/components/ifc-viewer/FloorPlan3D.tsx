import React from 'react'
import IFCViewer from './IFCViewer';

type FloorPlanViewerProps = {
//   mesh: THREE.Mesh;
};

const FloorPlan3D: React.FC<FloorPlanViewerProps> = ({ }) => {
  return (
    <IFCViewer/>
  )
}

export default FloorPlan3D
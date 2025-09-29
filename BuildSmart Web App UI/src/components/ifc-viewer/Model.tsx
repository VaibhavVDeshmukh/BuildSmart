import { useLoader } from "@react-three/fiber";
// Removed import of Primitive as it does not exist
import { IFCLoader } from "web-ifc-three";
import React, { Suspense } from "react";

export type ModelProps = {
  ifcURL: string;
};

export const Model: React.FC<ModelProps> = ({ ifcURL }) => {
  const ifcModel = useLoader(IFCLoader, ifcURL);
  return (
    <Suspense fallback={null}>
      <primitive object={ifcModel} />
    </Suspense>
  );
};

export default Model;

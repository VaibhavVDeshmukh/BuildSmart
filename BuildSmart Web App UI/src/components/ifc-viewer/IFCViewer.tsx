import XeokitViewer from "./XeokitViewer";

type IFCViewerProps = {
  ifcURL?: string;
};

const IFCViewer = ({ ifcURL }: IFCViewerProps) => {
  return (
    <div className="h-full w-full">
      <XeokitViewer modelUrl={"/rac.xkt"}/>
    </div>
  );
};

export default IFCViewer;

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Upload, 
  FileImage, 
  Check, 
  AlertCircle, 
  Trash2, 
  Eye,
  Box,
  Ruler,
  Edit3,
  ArrowRight
} from 'lucide-react';

interface UploadScreenProps {
  onScreenChange: (screen: string) => void;
}

export function UploadScreen({ onScreenChange }: UploadScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('upload');
  const [progress, setProgress] = useState(0);

  // Mock file upload simulation
  const simulateProcessing = () => {
    setIsProcessing(true);
    setProcessingStage('parsing');
    setProgress(0);

    const stages = [
      { stage: 'parsing', progress: 25, duration: 1000 },
      { stage: 'detection', progress: 60, duration: 1500 },
      { stage: 'analysis', progress: 85, duration: 1000 },
      { stage: 'complete', progress: 100, duration: 500 }
    ];

    stages.forEach((stageInfo, index) => {
      setTimeout(() => {
        setProcessingStage(stageInfo.stage);
        setProgress(stageInfo.progress);
        
        if (stageInfo.stage === 'complete') {
          setTimeout(() => {
            setIsProcessing(false);
          }, 500);
        }
      }, stages.slice(0, index + 1).reduce((acc, s) => acc + s.duration, 0));
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = {
      id: Date.now(),
      name: 'floor-plan-sample.pdf',
      size: '2.4 MB',
      type: 'PDF',
      status: 'uploaded'
    };
    
    setUploadedFiles([file]);
    simulateProcessing();
  };

  const handleFileUpload = () => {
    const file = {
      id: Date.now(),
      name: 'floor-plan-sample.pdf',
      size: '2.4 MB',
      type: 'PDF',
      status: 'uploaded'
    };
    
    setUploadedFiles([file]);
    simulateProcessing();
  };

  const getProcessingMessage = () => {
    switch (processingStage) {
      case 'parsing':
        return 'Analyzing floor plan structure...';
      case 'detection':
        return 'Detecting walls, doors, and windows...';
      case 'analysis':
        return 'Calculating dimensions and areas...';
      case 'complete':
        return 'Processing complete!';
      default:
        return 'Preparing to process...';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Upload Floor Plan</h1>
        <p className="text-xl text-muted-foreground">
          Upload your floor plan to get started with 3D visualization and cost estimation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            className={`transition-all duration-300 ${
              isDragOver ? 'border-primary shadow-lg scale-[1.02]' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-3xl flex items-center justify-center">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">
                Drop files here or click to browse
              </h3>
              <p className="text-muted-foreground mb-8">
                Supports PDF, PNG, JPG, DWG, and DXF files up to 50MB
              </p>
              
              <Button size="lg" onClick={handleFileUpload}>
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
            </CardContent>
          </Card>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileImage className="w-5 h-5 mr-2" />
                  Uploaded Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileImage className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">{file.size} • {file.type}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          <Check className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Section */}
          {isProcessing && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Processing Floor Plan</h3>
                  <p className="text-muted-foreground">{getProcessingMessage()}</p>
                </div>
                
                <div className="space-y-4">
                  <Progress value={progress} className="h-3" />
                  <div className="text-center text-sm text-muted-foreground">
                    {progress}% complete
                  </div>
                </div>
                
                {/* Processing Steps */}
                <div className="mt-8 space-y-4">
                  {['parsing', 'detection', 'analysis'].map((stage, index) => (
                    <div key={stage} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        processingStage === stage 
                          ? 'bg-primary/20 text-primary' 
                          : progress > (index + 1) * 25
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {progress > (index + 1) * 25 ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium capitalize">{stage} Complete</div>
                        {processingStage === stage && (
                          <div className="text-sm text-muted-foreground">In progress...</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Section - Shows after processing */}
          {uploadedFiles.length > 0 && !isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Floor Plan Preview
                  </span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    <Check className="w-3 h-3 mr-1" />
                    Detected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted/20 rounded-xl p-8 mb-6">
                  <div className="aspect-video bg-background rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">2D Floor Plan Preview</p>
                      <p className="text-sm text-muted-foreground mt-1">With detected elements highlighted</p>
                    </div>
                  </div>
                  
                  {/* Overlay indicators */}
                  <div className="absolute top-12 right-12 space-y-2">
                    <Badge variant="outline" className="bg-background/80">
                      12 Walls detected
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      3 Doors detected
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      8 Windows detected
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => onScreenChange('viewer')}
                    className="flex-1 transition-all duration-200 hover:scale-105"
                  >
                    <Box className="w-5 h-5 mr-2" />
                    Generate 3D Model
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Ruler className="w-5 h-5 mr-2" />
                    Set Scale
                  </Button>
                  <Button variant="outline" size="lg">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Detection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <div>
                  <div className="font-medium">High Resolution</div>
                  <div className="text-sm text-muted-foreground">Upload plans at 300 DPI or higher for best results</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <div>
                  <div className="font-medium">Clear Lines</div>
                  <div className="text-sm text-muted-foreground">Ensure walls and boundaries are clearly defined</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <div>
                  <div className="font-medium">Scale Reference</div>
                  <div className="text-sm text-muted-foreground">Include dimensions or scale bars when possible</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Files uploaded</span>
                  <Badge variant="outline">{uploadedFiles.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing status</span>
                  <Badge className={
                    isProcessing 
                      ? "bg-primary/10 text-primary" 
                      : uploadedFiles.length > 0 
                      ? "bg-accent/10 text-accent" 
                      : "bg-muted text-muted-foreground"
                  }>
                    {isProcessing ? 'Processing' : uploadedFiles.length > 0 ? 'Complete' : 'Waiting'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Elements detected</span>
                  <Badge variant="outline">
                    {uploadedFiles.length > 0 && !isProcessing ? '23' : '-'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
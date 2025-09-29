import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  Upload, 
  Box, 
  Clock, 
  Target, 
  MapPin, 
  ArrowRight,
  FileImage,
  Layers,
  Calculator
} from 'lucide-react';

interface HomeScreenProps {
  onScreenChange: (screen: string) => void;
}

export function HomeScreen({ onScreenChange }: HomeScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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
    // Handle file drop and navigate to upload screen
    onScreenChange('upload');
  };

  const benefits = [
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Get your 3D model and estimates in minutes, not hours"
    },
    {
      icon: Target,
      title: "Accurate Detection",
      description: "AI-powered recognition of walls, doors, windows, and rooms"
    },
    {
      icon: MapPin,
      title: "Local Pricing",
      description: "Material costs based on your geographic location"
    }
  ];

  const features = [
    {
      icon: FileImage,
      title: "Smart Upload",
      description: "Drag & drop floor plans in any format"
    },
    {
      icon: Layers,
      title: "3D Visualization",
      description: "Interactive 3D models with layer controls"
    },
    {
      icon: Calculator,
      title: "Cost Estimation",
      description: "Detailed material lists with pricing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Upload your floor plan.
            <br />
            Get instant 3D model + cost estimate.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform 2D floor plans into interactive 3D models with accurate material estimates and local pricing.
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card 
            className={`transition-all duration-300 hover:shadow-lg ${
              isDragOver ? 'border-primary shadow-lg scale-105' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">
                Drop your floor plan here
              </h3>
              <p className="text-muted-foreground mb-8">
                Supports PDF, PNG, JPG, and CAD files up to 50MB
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => onScreenChange('upload')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => onScreenChange('upload')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 3D Preview Section */}
        <Card className="mb-16 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">
                  See your plans come to life
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our AI transforms your 2D floor plans into interactive 3D models with precise measurements and detailed room layouts.
                </p>
                <Button 
                  onClick={() => onScreenChange('viewer')}
                  className="w-fit transition-all duration-200 hover:scale-105"
                >
                  View 3D Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-12 flex items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-64 h-48 bg-card rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Box className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Layers className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
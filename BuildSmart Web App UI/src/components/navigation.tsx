import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { Switch } from './ui/switch';
import { 
  Home, 
  Upload, 
  Box, 
  Calculator, 
  ShoppingCart, 
  Settings,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Navigation({ activeScreen, onScreenChange, isDark, onThemeToggle }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'viewer', label: '3D Viewer', icon: Box },
    { id: 'estimate', label: 'Estimates', icon: Calculator },
    { id: 'suppliers', label: 'Suppliers', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">BuildSmart</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeScreen === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onScreenChange(item.id)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4" />
            <Switch checked={isDark} onCheckedChange={onThemeToggle} />
            <Moon className="w-4 h-4" />
          </div>
          <Button variant="outline" size="sm">
            Account
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">BuildSmart</span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Box className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>BuildSmart</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeScreen === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onScreenChange(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm">Theme</span>
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <Switch checked={isDark} onCheckedChange={onThemeToggle} />
                    <Moon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
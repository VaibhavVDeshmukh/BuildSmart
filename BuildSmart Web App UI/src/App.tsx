import { useState, useEffect } from 'react';
import { Navigation } from './components/navigation';
import { HomeScreen } from './components/screens/home';
import { UploadScreen } from './components/screens/upload';
import { ViewerScreen } from './components/screens/viewer';
import { EstimateScreen } from './components/screens/estimate';
import { SuppliersScreen } from './components/screens/suppliers';
import { SettingsScreen } from './components/screens/settings';
import { Toaster } from './components/ui/sonner';

type Screen = 'home' | 'upload' | 'viewer' | 'estimate' | 'suppliers' | 'settings';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(systemDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleScreenChange = (screen: string) => {
    setActiveScreen(screen as Screen);
    
    // Add smooth scroll to top when changing screens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onScreenChange={handleScreenChange} />;
      case 'upload':
        return <UploadScreen onScreenChange={handleScreenChange} />;
      case 'viewer':
        return <ViewerScreen onScreenChange={handleScreenChange} />;
      case 'estimate':
        return <EstimateScreen onScreenChange={handleScreenChange} />;
      case 'suppliers':
        return <SuppliersScreen onScreenChange={handleScreenChange} />;
      case 'settings':
        return <SettingsScreen 
          onScreenChange={handleScreenChange}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
        />;
      default:
        return <HomeScreen onScreenChange={handleScreenChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation
        activeScreen={activeScreen}
        onScreenChange={handleScreenChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />
      
      <main className="transition-all duration-300 ease-out">
        {renderScreen()}
      </main>
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
}
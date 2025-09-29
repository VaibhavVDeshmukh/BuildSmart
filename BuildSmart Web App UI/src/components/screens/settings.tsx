import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  User, 
  Ruler, 
  DollarSign, 
  Globe, 
  Moon, 
  Sun,
  Bell,
  Download,
  Upload,
  Trash2,
  Save,
  Home,
  Info
} from 'lucide-react';

interface SettingsScreenProps {
  onScreenChange: (screen: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function SettingsScreen({ onScreenChange, isDark, onThemeToggle }: SettingsScreenProps) {
  const [projectSettings, setProjectSettings] = useState({
    name: "Residential Home Project",
    description: "Modern 3-bedroom home with open floor plan",
    wallThickness: "6",
    wallHeight: "9",
    ceilingHeight: "9",
    unitSystem: "imperial",
    currency: "USD",
    location: "San Francisco, CA"
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    processingComplete: true,
    priceAlerts: false,
    weeklyReports: true
  });

  const handleProjectSettingChange = (key: string, value: string) => {
    setProjectSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-xl text-muted-foreground">
          Manage your project preferences and account settings
        </p>
      </div>

      <Tabs defaultValue="project" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="defaults">Defaults</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Project Settings */}
        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectSettings.name}
                    onChange={(e) => handleProjectSettingChange('name', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={projectSettings.location}
                    onChange={(e) => handleProjectSettingChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectSettings.description}
                  onChange={(e) => handleProjectSettingChange('description', e.target.value)}
                  placeholder="Brief description of your project"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Project
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Files Uploaded</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-accent">1</div>
                  <div className="text-sm text-muted-foreground">3D Models</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">$18,750</div>
                  <div className="text-sm text-muted-foreground">Total Estimate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Default Settings */}
        <TabsContent value="defaults" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="w-5 h-5 mr-2" />
                Construction Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wall-thickness">Wall Thickness</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="wall-thickness"
                      value={projectSettings.wallThickness}
                      onChange={(e) => handleProjectSettingChange('wallThickness', e.target.value)}
                      placeholder="6"
                    />
                    <Select value="inches">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wall-height">Wall Height</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="wall-height"
                      value={projectSettings.wallHeight}
                      onChange={(e) => handleProjectSettingChange('wallHeight', e.target.value)}
                      placeholder="9"
                    />
                    <Select value="feet">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ceiling-height">Ceiling Height</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="ceiling-height"
                      value={projectSettings.ceilingHeight}
                      onChange={(e) => handleProjectSettingChange('ceilingHeight', e.target.value)}
                      placeholder="9"
                    />
                    <Select value="feet">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="unit-system">Unit System</Label>
                  <Select value={projectSettings.unitSystem} onValueChange={(value) => handleProjectSettingChange('unitSystem', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
                      <SelectItem value="metric">Metric (m, cm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={projectSettings.currency} onValueChange={(value) => handleProjectSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Cost Estimation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Labor Cost Multiplier</Label>
                  <div className="flex items-center space-x-2">
                    <Input value="0.6" readOnly className="bg-muted/20" />
                    <Badge variant="outline">60% of materials</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically calculates labor costs as percentage of material costs
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Markup Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input value="15" />
                    <span className="text-sm">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Additional markup for overhead and profit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Appearance & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch checked={isDark} onCheckedChange={onThemeToggle} />
                  <Moon className="w-4 h-4" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-save Projects</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes to your projects
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Tooltips</Label>
                    <p className="text-sm text-muted-foreground">
                      Display helpful tooltips throughout the interface
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Advanced Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Show additional technical options and controls
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch 
                  checked={notifications.emailUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Processing Complete</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when floor plan processing is finished
                  </p>
                </div>
                <Switch 
                  checked={notifications.processingComplete}
                  onCheckedChange={(checked) => handleNotificationChange('processingComplete', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified of significant material price changes
                  </p>
                </div>
                <Switch 
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly project summary reports
                  </p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="John Smith" />
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.smith@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input defaultValue="Smith Construction LLC" />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="(555) 123-4567" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Update Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Backup
                </Button>
                <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data Privacy</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your data is securely stored and never shared with third parties. 
                      You can export or delete your data at any time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <div className="font-semibold">Pro Plan</div>
                  <div className="text-sm text-muted-foreground">
                    Unlimited projects • Advanced features • Priority support
                  </div>
                </div>
                <Badge className="bg-accent/10 text-accent">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
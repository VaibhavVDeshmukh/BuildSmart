import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calculator, 
  Download, 
  Edit3, 
  TrendingUp,
  PieChart,
  FileText,
  Settings,
  DollarSign,
  Package
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface EstimateScreenProps {
  onScreenChange: (screen: string) => void;
}

const materialData = [
  { category: 'Walls', material: 'Drywall Sheets', quantity: 45, unit: 'sheets', costPerUnit: 12.50, total: 562.50, room: 'Living Room' },
  { category: 'Walls', material: 'Joint Compound', quantity: 6, unit: 'buckets', costPerUnit: 18.75, total: 112.50, room: 'Living Room' },
  { category: 'Walls', material: 'Drywall Screws', quantity: 2, unit: 'lbs', costPerUnit: 8.99, total: 17.98, room: 'Living Room' },
  { category: 'Flooring', material: 'Hardwood Planks', quantity: 1200, unit: 'sq ft', costPerUnit: 4.50, total: 5400.00, room: 'Living Room' },
  { category: 'Flooring', material: 'Underlayment', quantity: 1200, unit: 'sq ft', costPerUnit: 0.75, total: 900.00, room: 'Living Room' },
  { category: 'Doors', material: 'Interior Door', quantity: 3, unit: 'units', costPerUnit: 125.00, total: 375.00, room: 'Multiple' },
  { category: 'Windows', material: 'Double Hung Window', quantity: 8, unit: 'units', costPerUnit: 245.00, total: 1960.00, room: 'Multiple' },
  { category: 'Electrical', material: 'Electrical Wire', quantity: 500, unit: 'ft', costPerUnit: 0.85, total: 425.00, room: 'Whole House' },
  { category: 'Plumbing', material: 'PVC Pipe', quantity: 150, unit: 'ft', costPerUnit: 2.15, total: 322.50, room: 'Bathrooms' },
];

const categoryTotals = materialData.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = 0;
  }
  acc[item.category] += item.total;
  return acc;
}, {} as Record<string, number>);

const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
  name: category,
  value: total
}));

const COLORS = ['#0b6ef6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function EstimateScreen({ onScreenChange }: EstimateScreenProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [materialList, setMaterialList] = useState(materialData);
  const [activeTab, setActiveTab] = useState('materials');

  const totalCost = materialList.reduce((sum, item) => sum + item.total, 0);
  const roomBreakdown = materialList.reduce((acc, item) => {
    if (!acc[item.room]) {
      acc[item.room] = 0;
    }
    acc[item.room] += item.total;
    return acc;
  }, {} as Record<string, number>);

  const updateMaterialCost = (index: number, field: string, value: number) => {
    const updated = [...materialList];
    updated[index] = {
      ...updated[index],
      [field]: value,
      total: field === 'quantity' ? value * updated[index].costPerUnit : 
             field === 'costPerUnit' ? updated[index].quantity * value :
             updated[index].total
    };
    setMaterialList(updated);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Material Estimate</h1>
          <p className="text-xl text-muted-foreground">
            Detailed breakdown of materials and costs for your project
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Adjust Coefficients
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-3xl font-bold text-primary">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Material Items</p>
                <p className="text-3xl font-bold">{materialList.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold">{Object.keys(categoryTotals).length}</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. per Sq Ft</p>
                <p className="text-3xl font-bold">
                  ${(totalCost / 2450).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">Materials List</TabsTrigger>
              <TabsTrigger value="rooms">By Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Material Breakdown
                    </span>
                    <Badge className="bg-accent/10 text-accent">
                      Editable
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Cost/Unit</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materialList.map((item, index) => (
                          <TableRow key={index} className="hover:bg-muted/20">
                            <TableCell className="font-medium">{item.material}</TableCell>
                            <TableCell>
                              {editingCell === `quantity-${index}` ? (
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateMaterialCost(index, 'quantity', parseFloat(e.target.value) || 0)}
                                  onBlur={() => setEditingCell(null)}
                                  className="w-20"
                                  autoFocus
                                />
                              ) : (
                                <div 
                                  className="cursor-pointer hover:bg-muted/20 p-2 rounded flex items-center"
                                  onClick={() => setEditingCell(`quantity-${index}`)}
                                >
                                  {item.quantity}
                                  <Edit3 className="w-3 h-3 ml-2 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              {editingCell === `cost-${index}` ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.costPerUnit}
                                  onChange={(e) => updateMaterialCost(index, 'costPerUnit', parseFloat(e.target.value) || 0)}
                                  onBlur={() => setEditingCell(null)}
                                  className="w-24"
                                  autoFocus
                                />
                              ) : (
                                <div 
                                  className="cursor-pointer hover:bg-muted/20 p-2 rounded flex items-center"
                                  onClick={() => setEditingCell(`cost-${index}`)}
                                >
                                  ${item.costPerUnit.toFixed(2)}
                                  <Edit3 className="w-3 h-3 ml-2 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ${item.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Grand Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Room Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {Object.entries(roomBreakdown).map(([room, cost]) => (
                      <AccordionItem key={room} value={room} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">{room}</span>
                            <span className="font-semibold text-primary">
                              ${cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {materialList
                              .filter(item => item.room === room)
                              .map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                                  <div>
                                    <span className="font-medium">{item.material}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                      ({item.quantity} {item.unit})
                                    </span>
                                  </div>
                                  <span className="font-semibold">${item.total.toFixed(2)}</span>
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart data={pieData}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV Data
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onScreenChange('suppliers')}
              >
                <Package className="w-4 h-4 mr-2" />
                Find Suppliers
              </Button>
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Area</span>
                  <span className="text-sm font-medium">2,450 sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Material Cost</span>
                  <span className="text-sm font-medium">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Labor Est.</span>
                  <span className="text-sm font-medium">${(totalCost * 0.6).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Project</span>
                  <span className="font-bold text-primary">
                    ${(totalCost * 1.6).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
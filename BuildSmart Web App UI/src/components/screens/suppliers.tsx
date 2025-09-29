import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  ExternalLink,
  Filter,
  Package,
  Truck,
  Clock,
  ShoppingCart
} from 'lucide-react';

interface SuppliersScreenProps {
  onScreenChange: (screen: string) => void;
}

const suppliers = [
  {
    id: 1,
    name: "BuildMax Supply Co.",
    logo: "BM",
    rating: 4.8,
    reviews: 342,
    distance: "2.3 miles",
    materials: ["Lumber", "Drywall", "Hardware", "Electrical"],
    phone: "(555) 123-4567",
    email: "orders@buildmax.com",
    delivery: "Same Day",
    discount: "10% off $500+",
    featured: true
  },
  {
    id: 2,
    name: "Metro Building Materials",
    logo: "MB",
    rating: 4.6,
    reviews: 189,
    distance: "3.7 miles",
    materials: ["Flooring", "Roofing", "Windows", "Doors"],
    phone: "(555) 987-6543",
    email: "sales@metrobuilding.com",
    delivery: "Next Day",
    discount: "5% contractor rate",
    featured: false
  },
  {
    id: 3,
    name: "Precision Hardware",
    logo: "PH",
    rating: 4.9,
    reviews: 567,
    distance: "5.1 miles",
    materials: ["Hardware", "Tools", "Fasteners", "Safety"],
    phone: "(555) 456-7890",
    email: "info@precisionhw.com",
    delivery: "2-3 Days",
    discount: "Bulk pricing",
    featured: true
  },
  {
    id: 4,
    name: "Elite Electrical Supply",
    logo: "EE",
    rating: 4.7,
    reviews: 223,
    distance: "4.2 miles",
    materials: ["Electrical", "Lighting", "HVAC", "Smart Home"],
    phone: "(555) 321-0987",
    email: "orders@eliteelectric.com",
    delivery: "Same Day",
    discount: "Free shipping $200+",
    featured: false
  },
  {
    id: 5,
    name: "Quality Plumbing Depot",
    logo: "QP",
    rating: 4.5,
    reviews: 134,
    distance: "6.8 miles",
    materials: ["Plumbing", "Fixtures", "Pipe", "Water Heaters"],
    phone: "(555) 654-3210",
    email: "sales@qualityplumbing.com",
    delivery: "Next Day",
    discount: "Trade discounts",
    featured: false
  },
  {
    id: 6,
    name: "Home & Garden Center",
    logo: "HG",
    rating: 4.4,
    reviews: 445,
    distance: "7.2 miles",
    materials: ["Landscaping", "Paint", "Garden", "Outdoor"],
    phone: "(555) 789-0123",
    email: "contact@homegardencc.com",
    delivery: "3-5 Days",
    discount: "Seasonal sales",
    featured: false
  }
];

const materialTypes = ["All Materials", "Lumber", "Drywall", "Hardware", "Electrical", "Flooring", "Plumbing", "Roofing"];
const sortOptions = ["Distance", "Rating", "Price", "Delivery Speed"];

export function SuppliersScreen({ onScreenChange }: SuppliersScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [sortBy, setSortBy] = useState('Distance');
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterSuppliers(query, selectedMaterial);
  };

  const handleMaterialFilter = (material: string) => {
    setSelectedMaterial(material);
    filterSuppliers(searchQuery, material);
  };

  const filterSuppliers = (query: string, material: string) => {
    let filtered = suppliers;

    if (query) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(query.toLowerCase()) ||
        supplier.materials.some(m => m.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (material !== 'All Materials') {
      filtered = filtered.filter(supplier => 
        supplier.materials.includes(material)
      );
    }

    setFilteredSuppliers(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Material Suppliers</h1>
        <p className="text-xl text-muted-foreground">
          Find trusted suppliers for your construction materials with competitive pricing
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search suppliers or materials..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedMaterial} onValueChange={handleMaterialFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map(material => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      Sort by {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Found {filteredSuppliers.length} suppliers {selectedMaterial !== 'All Materials' && `for ${selectedMaterial}`}
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-accent/10 text-accent">
            {filteredSuppliers.filter(s => s.featured).length} Featured
          </Badge>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
            supplier.featured ? 'ring-2 ring-primary/20 bg-primary/5' : ''
          }`}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {supplier.logo}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-semibold">{supplier.name}</h3>
                      {supplier.featured && (
                        <Badge className="bg-accent/10 text-accent border-accent/20">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{supplier.rating}</span>
                        <span>({supplier.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{supplier.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-2">
                    {supplier.delivery}
                  </Badge>
                  <div className="text-sm font-medium text-accent">
                    {supplier.discount}
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Materials Available:</div>
                <div className="flex flex-wrap gap-2">
                  {supplier.materials.map((material) => (
                    <Badge key={material} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Contact & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="font-medium">Delivery</div>
                    <div className="text-xs text-muted-foreground">{supplier.delivery}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="font-medium">Items</div>
                    <div className="text-xs text-muted-foreground">{supplier.materials.length} types</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="font-medium">Hours</div>
                    <div className="text-xs text-muted-foreground">7AM - 6PM</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or material filters to find more suppliers in your area.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedMaterial('All Materials');
              setFilteredSuppliers(suppliers);
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Onboarding State for first-time users */}
      {filteredSuppliers.length > 0 && searchQuery === '' && selectedMaterial === 'All Materials' && (
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Find the right supplier for your project</h3>
                <p className="text-muted-foreground">
                  Use filters to narrow down suppliers by material type, distance, or delivery speed. 
                  Contact multiple suppliers to compare pricing and availability.
                </p>
              </div>
              <Button onClick={() => onScreenChange('estimate')}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Back to Estimate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
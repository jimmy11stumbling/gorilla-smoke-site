import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PieChart, LineChart } from '@/components/ui/chart';
import { 
  Loader2, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  ArrowUpDown,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Lead interface
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
}

// Service tracking interface
interface ServiceTracking {
  id: number;
  leadId: number;
  service: string;
  timestamp: string;
}

export default function AdminLeads() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadServices, setLeadServices] = useState<ServiceTracking[]>([]);

  // Fetch all leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/admin/leads'],
    refetchOnWindowFocus: false,
  });

  // Fetch service statistics
  const { data: serviceStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/leads/stats/services'],
    refetchOnWindowFocus: false,
  });

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle view lead details
  const handleViewLead = async (lead: Lead) => {
    setSelectedLead(lead);
    
    // Fetch service selections for this lead
    if (lead.id) {
      try {
        const response = await fetch(`/api/admin/leads/${lead.id}/services`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setLeadServices(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching lead service selections:", error);
        setLeadServices([]);
      }
    }
    
    setViewDialogOpen(true);
  };

  // Handle export CSV
  const handleExportCSV = () => {
    if (!leadsData?.success || !leadsData?.data) {
      toast({
        title: "Export failed",
        description: "No lead data available to export",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Filter leads by selected location if needed
      let leads = leadsData.data;
      if (selectedLocation !== 'all') {
        leads = leads.filter((lead: Lead) => lead.locationId === selectedLocation);
      }
      
      // Create CSV header
      const csvHeader = ["ID", "Name", "Email", "Phone", "Message", "Location", "Created At"];
      
      // Create CSV rows
      const csvRows = leads.map((lead: Lead) => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`, // Escape quotes in name
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.message.replace(/"/g, '""')}"`, // Escape quotes in message
        `"${lead.locationId}"`,
        `"${format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss')}"`
      ]);
      
      // Combine header and rows
      const csvContent = [
        csvHeader.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${leads.length} leads exported to CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting leads",
        variant: "destructive",
      });
    }
  };

  // Get filtered and sorted leads
  const getFilteredLeads = () => {
    if (!leadsData?.success || !leadsData?.data) return [];
    
    let leads = leadsData.data;
    
    // Filter by location
    if (selectedLocation !== 'all') {
      leads = leads.filter((lead: Lead) => lead.locationId === selectedLocation);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      leads = leads.filter((lead: Lead) => 
        lead.name.toLowerCase().includes(query) || 
        lead.email.toLowerCase().includes(query) || 
        lead.phone.includes(query) || 
        lead.message.toLowerCase().includes(query)
      );
    }
    
    // Sort leads
    leads = [...leads].sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return leads;
  };

  // Get unique locations
  const getLocations = () => {
    if (!leadsData?.success || !leadsData?.data) return [];
    
    const locationSet = new Set<string>();
    
    leadsData.data.forEach((lead: Lead) => {
      locationSet.add(lead.locationId);
    });
    
    return Array.from(locationSet).sort();
  };

  // Prepare service distribution chart data
  const getServiceDistributionData = () => {
    if (!serviceStats?.success || !serviceStats?.data) return null;
    
    const services = serviceStats.data;
    
    const chartColors = [
      'rgba(239, 68, 68, 0.8)',   // red (UberEats)
      'rgba(16, 185, 129, 0.8)',  // green (GrubHub)
      'rgba(59, 130, 246, 0.8)',  // blue (DoorDash)
    ];
    
    return {
      labels: services.map((item: any) => item.service),
      datasets: [
        {
          data: services.map((item: any) => item.count),
          backgroundColor: chartColors.slice(0, services.length),
          borderColor: chartColors.slice(0, services.length).map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }
      ]
    };
  };

  // Format location ID for display
  const formatLocation = (locationId: string) => {
    const locationMap: Record<string, string> = {
      'delmar': 'Del Mar',
      'zapata': 'Zapata',
      'sanbernardo': 'San Bernardo',
    };
    
    return locationMap[locationId] || locationId;
  };

  // Format service name for display
  const formatService = (service: string) => {
    const serviceMap: Record<string, string> = {
      'ubereats': 'UberEats',
      'doordash': 'DoorDash',
      'grubhub': 'GrubHub',
    };
    
    return serviceMap[service] || service;
  };

  // Loading state
  if (leadsLoading || statsLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading leads data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
          <p className="text-muted-foreground">
            View and analyze customer leads from all locations
          </p>
        </div>
        
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsData?.data?.length || 0}</div>
          </CardContent>
        </Card>
        
        {getLocations().slice(0, 3).map((location) => (
          <Card key={location}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{formatLocation(location)}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leadsData?.data?.filter((lead: Lead) => lead.locationId === location).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Leads for this location
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribution chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>
              Lead distribution across delivery services
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {getServiceDistributionData() ? (
              <PieChart data={getServiceDistributionData()!} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No service data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Location Breakdown</CardTitle>
            <CardDescription>
              Leads by restaurant location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLocations().map((location) => {
                const count = leadsData?.data?.filter((lead: Lead) => lead.locationId === location).length || 0;
                const percentage = leadsData?.data?.length ? Math.round((count / leadsData.data.length) * 100) : 0;
                
                return (
                  <div key={location} className="flex items-center">
                    <div className="w-1/3 font-medium">{formatLocation(location)}</div>
                    <div className="w-2/3">
                      <div className="flex items-center">
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {getLocations().map((location) => (
              <SelectItem key={location} value={location}>
                {formatLocation(location)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Leads</CardTitle>
          <CardDescription>
            View and manage all customer leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getFilteredLeads().length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange('name')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange('email')}>
                    <div className="flex items-center">
                      Email
                      {sortField === 'email' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange('createdAt')}>
                    <div className="flex items-center">
                      Date
                      {sortField === 'createdAt' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredLeads().map((lead: Lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatLocation(lead.locationId)}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No leads found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {searchQuery || selectedLocation !== 'all' ? 
                  'Try adjusting your filters or search query.' : 
                  'There are no customer leads in the system yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="mt-1">{selectedLead.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="mt-1">{format(new Date(selectedLead.createdAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </span>
                  </h3>
                  <p className="mt-1">{selectedLead.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> Phone
                    </span>
                  </h3>
                  <p className="mt-1">{selectedLead.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> Location
                    </span>
                  </h3>
                  <p className="mt-1">{formatLocation(selectedLead.locationId)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Lead ID</h3>
                  <p className="mt-1">{selectedLead.id}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" /> Message
                  </span>
                </h3>
                <p className="mt-1 text-sm">{selectedLead.message}</p>
              </div>
              
              {leadServices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Service Selections</h3>
                  <div className="space-y-2">
                    {leadServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm bg-muted rounded-md p-2">
                        <div className="font-medium">{formatService(service.service)}</div>
                        <div className="text-muted-foreground">
                          {format(new Date(service.timestamp), 'MMM d, yyyy HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
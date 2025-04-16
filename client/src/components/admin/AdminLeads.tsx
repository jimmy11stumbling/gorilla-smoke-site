import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart } from '@/components/ui/chart';
import { Loader2, Eye, Mail, Download } from 'lucide-react';

// Lead type definition
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  locationId: string;
  marketingConsent: boolean;
  source: string;
  createdAt: string;
}

// Service tracking definition
interface ServiceTracking {
  id: number;
  leadId: number;
  service: string;
  timestamp: string;
}

export default function AdminLeads() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
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

  // Handle export leads to CSV
  const handleExportCSV = () => {
    if (!leadsData?.data?.length) return;
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Marketing Consent', 'Source', 'Created At'];
    const csvRows = [headers.join(',')];
    
    // Add data rows
    leadsData.data.forEach((lead: Lead) => {
      const row = [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`, // Escape quotes
        `"${lead.email.replace(/"/g, '""')}"`,
        lead.phone ? `"${lead.phone.replace(/"/g, '""')}"` : '',
        lead.locationId,
        lead.marketingConsent ? 'Yes' : 'No',
        lead.source,
        new Date(lead.createdAt).toLocaleString()
      ];
      csvRows.push(row.join(','));
    });
    
    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format data for service selection chart
  const serviceChartData = serviceStats?.data
    ? {
        labels: serviceStats.data.map((item: any) => item.service),
        datasets: [
          {
            label: 'Service Selections',
            data: serviceStats.data.map((item: any) => item.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Filter leads by location
  const filteredLeads = leadsData?.data
    ? selectedLocation === 'all'
      ? leadsData.data
      : leadsData.data.filter((lead: Lead) => lead.locationId === selectedLocation)
    : [];

  // Calculate leads by location
  const calculateLocationCounts = () => {
    if (!leadsData?.data) return {};
    const counts: Record<string, number> = {
      delmar: 0,
      zapata: 0,
      sanbernardo: 0,
    };
    
    leadsData.data.forEach((lead: Lead) => {
      if (counts[lead.locationId] !== undefined) {
        counts[lead.locationId]++;
      }
    });
    
    return counts;
  };

  const locationCounts = calculateLocationCounts();

  if (leadsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Lead Management</h3>
          <p className="text-sm text-muted-foreground">
            View and analyze customer leads from all locations
          </p>
        </div>
        
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Leads overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Del Mar Location</CardTitle>
            <CardDescription>Lead count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCounts.delmar || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zapata Location</CardTitle>
            <CardDescription>Lead count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCounts.zapata || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">San Bernardo Location</CardTitle>
            <CardDescription>Lead count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCounts.sanbernardo || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Leads Tabs */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Leads List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by location:</span>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="delmar">Del Mar</SelectItem>
                  <SelectItem value="zapata">Zapata</SelectItem>
                  <SelectItem value="sanbernardo">San Bernardo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} leads
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead: Lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.name}
                          {lead.marketingConsent && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
                              Marketing
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {lead.locationId}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No leads found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads by Location</CardTitle>
                <CardDescription>
                  Distribution of leads across restaurant locations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {serviceChartData && (
                  <PieChart
                    data={{
                      labels: Object.keys(locationCounts),
                      datasets: [
                        {
                          label: 'Leads by Location',
                          data: Object.values(locationCounts),
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivery Service Selection</CardTitle>
                <CardDescription>
                  Which delivery platforms customers prefer
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {serviceChartData ? (
                  <PieChart data={serviceChartData} />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No service data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Marketing Consent Rate</CardTitle>
                <CardDescription>
                  Percentage of leads who provided marketing consent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leadsData?.data?.length > 0 ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-4xl font-bold">
                      {Math.round(
                        (leadsData.data.filter((lead: Lead) => lead.marketingConsent).length /
                          leadsData.data.length) *
                          100
                      )}%
                    </div>
                    <p className="text-muted-foreground">
                      {leadsData.data.filter((lead: Lead) => lead.marketingConsent).length} out of {leadsData.data.length} leads
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Detailed information about this lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p>{selectedLead.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p className="capitalize">{selectedLead.locationId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                  <p>{selectedLead.phone || '—'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                  <p>{selectedLead.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Marketing Consent</h4>
                  <p>{selectedLead.marketingConsent ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                  <p>{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Delivery Service Selections</h4>
                {leadServices.length > 0 ? (
                  <ul className="space-y-2">
                    {leadServices.map((service) => (
                      <li key={service.id} className="flex justify-between text-sm">
                        <Badge variant="outline" className="capitalize">
                          {service.service}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(service.timestamp).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No delivery services selected</p>
                )}
              </div>
              
              <div className="pt-4 border-t flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
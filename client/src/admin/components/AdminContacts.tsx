import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
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
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Eye, 
  Search,
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Contact form submission interface
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContacts() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  // Fetch all contact submissions
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
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

  // Handle view contact details
  const handleViewContact = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  };

  // Export contacts as CSV
  const handleExportCSV = () => {
    if (!contactsData?.success || !contactsData?.data) {
      toast({
        title: "Export failed",
        description: "No contact data available to export",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create CSV header
      const csvHeader = ["ID", "Name", "Email", "Phone", "Subject", "Message", "Created At"];
      
      // Create CSV rows
      const csvRows = contactsData.data.map((contact: ContactSubmission) => [
        contact.id,
        `"${contact.name.replace(/"/g, '""')}"`, // Escape quotes in name
        `"${contact.email}"`,
        `"${contact.phone}"`,
        `"${contact.subject.replace(/"/g, '""')}"`, // Escape quotes in subject
        `"${contact.message.replace(/"/g, '""')}"`, // Escape quotes in message
        `"${format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm:ss')}"`
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
      link.setAttribute('download', `contacts-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${contactsData.data.length} contacts exported to CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting contacts",
        variant: "destructive",
      });
    }
  };

  // Get filtered and sorted contacts
  const getFilteredContacts = () => {
    if (!contactsData?.success || !contactsData?.data) return [];
    
    let contacts = contactsData.data;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      contacts = contacts.filter((contact: ContactSubmission) => 
        contact.name.toLowerCase().includes(query) || 
        contact.email.toLowerCase().includes(query) || 
        contact.phone.includes(query) || 
        contact.subject.toLowerCase().includes(query) || 
        contact.message.toLowerCase().includes(query)
      );
    }
    
    // Sort contacts
    contacts = [...contacts].sort((a: any, b: any) => {
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
    
    return contacts;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading contact submissions...</p>
      </div>
    );
  }

  // Calculate metrics
  const totalContacts = contactsData?.data?.length || 0;
  const last30DaysContacts = contactsData?.data?.filter((contact: ContactSubmission) => {
    const contactDate = new Date(contact.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return contactDate >= thirtyDaysAgo;
  }).length || 0;
  
  const last7DaysContacts = contactsData?.data?.filter((contact: ContactSubmission) => {
    const contactDate = new Date(contact.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return contactDate >= sevenDaysAgo;
  }).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contact Management</h2>
          <p className="text-muted-foreground">
            View and manage contact form submissions
          </p>
        </div>
        
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last30DaysContacts}</div>
            <p className="text-xs text-muted-foreground">
              New submissions in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last7DaysContacts}</div>
            <p className="text-xs text-muted-foreground">
              New submissions in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contact submissions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contacts table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            Review and manage customer inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getFilteredContacts().length > 0 ? (
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
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange('subject')}>
                    <div className="flex items-center">
                      Subject
                      {sortField === 'subject' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
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
                {getFilteredContacts().map((contact: ContactSubmission) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{format(new Date(contact.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewContact(contact)}
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
              <h3 className="text-lg font-semibold">No contact submissions found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {searchQuery ? 
                  'Try adjusting your search query.' : 
                  'There are no contact form submissions in the system yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Detailed information about the contact submission
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" /> Name
                    </span>
                  </h3>
                  <p className="mt-1">{selectedContact.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Date
                    </span>
                  </h3>
                  <p className="mt-1">{format(new Date(selectedContact.createdAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </span>
                  </h3>
                  <p className="mt-1">{selectedContact.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> Phone
                    </span>
                  </h3>
                  <p className="mt-1">{selectedContact.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1">{selectedContact.subject}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" /> Message
                  </span>
                </h3>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
                
                {selectedContact.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${selectedContact.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
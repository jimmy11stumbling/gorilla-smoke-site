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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Mail, Phone, Download } from 'lucide-react';

// Contact submission type definition
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Fetch all contact submissions
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    refetchOnWindowFocus: false,
  });

  // Handle view submission details
  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // Handle export contacts to CSV
  const handleExportCSV = () => {
    if (!submissionsData?.data?.length) return;
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Created At'];
    const csvRows = [headers.join(',')];
    
    // Add data rows
    submissionsData.data.forEach((submission: ContactSubmission) => {
      const row = [
        submission.id,
        `"${submission.name.replace(/"/g, '""')}"`, // Escape quotes
        `"${submission.email.replace(/"/g, '""')}"`,
        submission.phone ? `"${submission.phone.replace(/"/g, '""')}"` : '',
        `"${submission.subject.replace(/"/g, '""')}"`,
        `"${submission.message.replace(/"/g, '""')}"`,
        new Date(submission.createdAt).toLocaleString()
      ];
      csvRows.push(row.join(','));
    });
    
    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group submissions by month
  const groupSubmissionsByMonth = () => {
    if (!submissionsData?.data?.length) return {};
    
    const grouped: Record<string, ContactSubmission[]> = {};
    
    submissionsData.data.forEach((submission: ContactSubmission) => {
      const date = new Date(submission.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(submission);
    });
    
    return grouped;
  };

  // Calculate statistics
  const calculateStatistics = () => {
    if (!submissionsData?.data?.length) return { total: 0, withPhone: 0, lastMonth: 0 };
    
    const today = new Date();
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const totalSubmissions = submissionsData.data.length;
    const submissionsWithPhone = submissionsData.data.filter(
      (submission: ContactSubmission) => submission.phone && submission.phone.trim() !== ''
    ).length;
    const lastMonthSubmissions = submissionsData.data.filter((submission: ContactSubmission) => {
      const date = new Date(submission.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }).length;
    
    return {
      total: totalSubmissions,
      withPhone: submissionsWithPhone,
      lastMonth: lastMonthSubmissions,
    };
  };

  const stats = calculateStatistics();
  const groupedSubmissions = groupSubmissionsByMonth();

  if (isLoading) {
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
          <h3 className="text-lg font-medium">Contact Form Submissions</h3>
          <p className="text-sm text-muted-foreground">
            Manage and respond to website contact form submissions
          </p>
        </div>
        
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <CardDescription>Submissions count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastMonth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Phone Provided</CardTitle>
            <CardDescription>Percentage of submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List grouped by month */}
      <div className="space-y-8">
        {Object.entries(groupedSubmissions).length > 0 ? (
          Object.entries(groupedSubmissions)
            .sort((a, b) => {
              // Sort by date descending (newest first)
              const dateA = new Date(a[1][0].createdAt);
              const dateB = new Date(b[1][0].createdAt);
              return dateB.getTime() - dateA.getTime();
            })
            .map(([monthYear, submissions]) => (
              <div key={monthYear} className="space-y-2">
                <h3 className="text-lg font-medium">{monthYear}</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission: ContactSubmission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.name}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {submission.subject}
                            </TableCell>
                            <TableCell>
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewSubmission(submission)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    window.location.href = `mailto:${submission.email}`;
                                  }}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                {submission.phone && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      window.location.href = `tel:${submission.phone}`;
                                    }}
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No contact form submissions found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submission Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Detailed information about this contact form submission
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">From</h4>
                  <div className="flex flex-col">
                    <span className="font-medium">{selectedSubmission.name}</span>
                    <span className="text-sm">{selectedSubmission.email}</span>
                    {selectedSubmission.phone && (
                      <span className="text-sm">{selectedSubmission.phone}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Subject</h4>
                  <p>{selectedSubmission.subject}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
                  <p className="whitespace-pre-wrap text-sm">{selectedSubmission.message}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Received</h4>
                  <p>{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply by Email
                </Button>
                
                {selectedSubmission.phone && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.location.href = `tel:${selectedSubmission.phone}`;
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
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
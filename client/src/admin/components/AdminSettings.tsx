import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  RefreshCcw, 
  Save, 
  Shield, 
  Settings as SettingsIcon,
  Globe,
  FileText,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export default function AdminSettings() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>({ 
    username: 'admin', // Will be replaced with actual user data
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin'
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRegeneratingSitemap, setIsRegeneratingSitemap] = useState(false);

  // Password change form
  const passwordForm = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Profile update form
  const profileForm = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
    },
  });

  // Handle password change
  const onPasswordSubmit = async (values: z.infer<typeof passwordChangeSchema>) => {
    setIsUpdatingPassword(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: 'Failed to update password',
        description: 'There was an error updating your password',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle profile update
  const onProfileSubmit = async (values: z.infer<typeof profileUpdateSchema>) => {
    setIsUpdatingProfile(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      // Update local state with new values
      setCurrentUser({
        ...currentUser,
        name: values.name,
        email: values.email,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: 'There was an error updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle sitemap regeneration
  const handleRegenerateSitemap = async () => {
    setIsRegeneratingSitemap(true);
    
    try {
      const response = await fetch('/api/admin/regenerate-sitemap', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Sitemap regenerated',
          description: 'The sitemap has been regenerated successfully',
        });
      } else {
        throw new Error(data.message || 'Failed to regenerate sitemap');
      }
    } catch (error) {
      toast({
        title: 'Failed to regenerate sitemap',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsRegeneratingSitemap(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and system settings
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Username</FormLabel>
                    <Input value={currentUser.username} disabled className="bg-muted" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Username cannot be changed
                    </p>
                  </div>
                  
                  <div>
                    <FormLabel>Role</FormLabel>
                    <Input value={currentUser.role} disabled className="bg-muted" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Role can only be changed by an administrator
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter current password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Must be at least 8 characters with uppercase, lowercase, and numbers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Session timeout</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Login alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new logins
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Tools</CardTitle>
              <CardDescription>
                Manage search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Sitemap</h3>
                  <p className="text-sm text-muted-foreground">
                    Regenerate the sitemap.xml file
                  </p>
                </div>
                <Button
                  onClick={handleRegenerateSitemap}
                  disabled={isRegeneratingSitemap}
                >
                  {isRegeneratingSitemap ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Regenerate Sitemap
                    </>
                  )}
                </Button>
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="advanced-seo">
                  <AccordionTrigger>Advanced SEO Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div>
                        <FormLabel>Meta Title</FormLabel>
                        <Input defaultValue="Gorilla Bar & Grill | Authentic BBQ Restaurant in Laredo, TX" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Used for the primary title tag of your website
                        </p>
                      </div>
                      
                      <div>
                        <FormLabel>Meta Description</FormLabel>
                        <Textarea defaultValue="Experience authentic BBQ and grilled specialties at Gorilla Bar & Grill. Multiple locations in Laredo, TX serving quality food with a unique atmosphere." />
                        <p className="text-xs text-muted-foreground mt-1">
                          Brief description of your website for search engines
                        </p>
                      </div>
                      
                      <div>
                        <FormLabel>Google Analytics ID</FormLabel>
                        <Input placeholder="e.g. G-XXXXXXXXXX" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your Google Analytics tracking ID
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Application Version</h4>
                  <p>v1.0.0</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                  <p>April 16, 2025</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Server Environment</h4>
                  <p>Production</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Database Status</h4>
                  <p className="flex items-center text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                    Connected
                  </p>
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>System Maintenance</AlertTitle>
                <AlertDescription>
                  Regular system maintenance is performed automatically. No manual intervention required.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
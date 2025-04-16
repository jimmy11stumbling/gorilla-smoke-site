import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pencil, Trash2, Star, StarOff, ImageIcon } from 'lucide-react';

// MenuItem type definition
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: number;
}

// Form validation schema
const menuItemSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  image: z.string().url({ message: 'Please enter a valid image URL' }),
  category: z.enum(['appetizers', 'mains', 'sides', 'desserts', 'drinks'], { 
    required_error: 'Please select a category'
  }),
  featured: z.coerce.number().min(0).max(1),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export default function AdminMenu() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all menu items
  const { data: menuItemsData, isLoading, error } = useQuery({
    queryKey: ['/api/menu'],
    refetchOnWindowFocus: false,
  });

  // Initialize add menu item form
  const addForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'mains',
      featured: 0,
    },
  });

  // Initialize edit menu item form
  const editForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'mains',
      featured: 0,
    },
  });

  // Handle add menu item form submission
  const onAddSubmit = async (data: MenuItemFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Success',
          description: 'Menu item created successfully',
          variant: 'default',
        });
        
        // Reset form and close dialog
        addForm.reset();
        setIsAddDialogOpen(false);
        
        // Refetch menu items
        queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      } else {
        toast({
          title: 'Error',
          description: responseData.message || 'Failed to create menu item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit menu item form submission
  const onEditSubmit = async (data: MenuItemFormValues) => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/menu/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Success',
          description: 'Menu item updated successfully',
          variant: 'default',
        });
        
        // Reset form and close dialog
        editForm.reset();
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        
        // Refetch menu items
        queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      } else {
        toast({
          title: 'Error',
          description: responseData.message || 'Failed to update menu item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete menu item
  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/menu/${selectedItem.id}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Success',
          description: 'Menu item deleted successfully',
          variant: 'default',
        });
        
        // Close dialog
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
        
        // Refetch menu items
        queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      } else {
        toast({
          title: 'Error',
          description: responseData.message || 'Failed to delete menu item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: item.featured === 1 ? 0 : 1
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Success',
          description: `${item.name} is now ${item.featured === 1 ? 'removed from' : 'marked as'} featured`,
          variant: 'default',
        });
        
        // Refetch menu items
        queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      } else {
        toast({
          title: 'Error',
          description: responseData.message || 'Failed to update featured status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    editForm.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category as any,
      featured: item.featured,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Filter menu items by category
  const filteredItems = menuItemsData?.data
    ? activeCategory === 'all'
      ? menuItemsData.data
      : menuItemsData.data.filter((item: MenuItem) => item.category === activeCategory)
    : [];

  // Count items by category
  const getCategoryCount = (category: string) => {
    if (!menuItemsData?.data) return 0;
    return category === 'all' 
      ? menuItemsData.data.length 
      : menuItemsData.data.filter((item: MenuItem) => item.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading menu items. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Menu Management</h3>
          <p className="text-sm text-muted-foreground">
            Add, edit and manage restaurant menu items
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Create a new item for your restaurant menu
              </DialogDescription>
            </DialogHeader>

            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter menu item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the menu item" 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            placeholder="0.00" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="appetizers">Appetizers</SelectItem>
                            <SelectItem value="mains">Main Courses</SelectItem>
                            <SelectItem value="sides">Side Dishes</SelectItem>
                            <SelectItem value="desserts">Desserts</SelectItem>
                            <SelectItem value="drinks">Drinks</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter image URL" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Item</FormLabel>
                        <FormDescription>
                          Mark this as a featured menu item
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === 1}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? 1 : 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Menu Item'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">
            All Items ({getCategoryCount('all')})
          </TabsTrigger>
          <TabsTrigger value="appetizers">
            Appetizers ({getCategoryCount('appetizers')})
          </TabsTrigger>
          <TabsTrigger value="mains">
            Main Courses ({getCategoryCount('mains')})
          </TabsTrigger>
          <TabsTrigger value="sides">
            Sides ({getCategoryCount('sides')})
          </TabsTrigger>
          <TabsTrigger value="desserts">
            Desserts ({getCategoryCount('desserts')})
          </TabsTrigger>
          <TabsTrigger value="drinks">
            Drinks ({getCategoryCount('drinks')})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Menu Items List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item: MenuItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {item.featured === 1 && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFeatured(item)}
                          title={item.featured === 1 ? "Remove from featured" : "Add to featured"}
                        >
                          {item.featured === 1 ? (
                            <StarOff className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No menu items found in this category
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of this menu item
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter menu item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the menu item" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="0.00" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="appetizers">Appetizers</SelectItem>
                          <SelectItem value="mains">Main Courses</SelectItem>
                          <SelectItem value="sides">Side Dishes</SelectItem>
                          <SelectItem value="desserts">Desserts</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter image URL" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Item</FormLabel>
                      <FormDescription>
                        Mark this as a featured menu item
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 1 : 0);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Menu Item'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Menu Item Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu item "{selectedItem?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Item'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
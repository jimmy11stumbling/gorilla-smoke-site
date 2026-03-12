import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useReservation } from '@/contexts/ReservationContext';
import { useLocation } from '@/contexts/LocationContext';
import { trackReservation } from '@/lib/analytics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format, addDays, isBefore, isAfter, addMonths, differenceInDays } from 'date-fns';
import { AlertCircle, CalendarIcon, Info, PhoneCall } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced validation schema with more specific rules
const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

const reservationSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .refine(val => /^[A-Za-z\s\-']+$/.test(val), {
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be less than 100 characters' }),
  phone: z.string()
    .min(10, { message: 'Please enter a valid phone number' })
    .refine(val => phoneRegex.test(val), {
      message: 'Please enter a valid phone number format: (123) 456-7890',
    }),
  date: z.date({ 
      required_error: 'Please select a date',
      invalid_type_error: 'That\'s not a valid date',
    })
    .refine(date => !isBefore(date, new Date().setHours(0, 0, 0, 0)), {
      message: 'Cannot book for past dates',
    })
    .refine(date => !isAfter(date, addMonths(new Date(), 3)), {
      message: 'Reservations are only available up to 3 months in advance',
    }),
  time: z.string({ required_error: 'Please select a time' }),
  people: z.string()
    .min(1, { message: 'Please select number of people' }),
  locationId: z.string({ required_error: 'Please select a location' }),
  specialRequests: z.string()
    .max(300, { message: 'Special requests must be less than 300 characters' })
    .optional(),
  agreesToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms to continue' }),
  }),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

export default function ReservationModal() {
  const { isReservationModalOpen, closeReservationModal } = useReservation();
  const { currentLocation, locations } = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);

  // Generate available times based on day of week and location
  const generateAvailableTimes = (date: Date, locationId: string): string[] => {
    const times: string[] = [];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Find location operating hours
    const location = locations.find(loc => loc.id === locationId);
    
    // Default hours if location not found or hours not specified
    let openHour = 11;
    let closeHour = 22;
    
    // Weekend hours (Friday, Saturday) - open later
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      openHour = 12;
      closeHour = 23;
    }
    
    // Sunday hours - close earlier
    if (dayOfWeek === 0) {
      openHour = 12;
      closeHour = 20;
    }
    
    // Generate time slots in 30-minute intervals
    // Last reservation is 2 hours before closing
    for (let hour = openHour; hour <= closeHour - 2; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      times.push(`${hourStr}:00`);
      if (hour < closeHour - 2) {
        times.push(`${hourStr}:30`);
      }
    }
    
    return times;
  };

  // Default values for the form
  const defaultValues: Partial<ReservationFormValues> = {
    locationId: currentLocation.id,
    date: addDays(new Date(), 1), // Default to tomorrow
    time: '19:00',
    people: '2',
    specialRequests: '',
    agreesToTerms: true,
  };

  // Initialize the form
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Watch date and location to update available times
  const watchedDate = form.watch('date');
  const watchedLocation = form.watch('locationId');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Update available times when date or location changes
  useEffect(() => {
    if (watchedDate && watchedLocation) {
      const times = generateAvailableTimes(watchedDate, watchedLocation);
      setAvailableTimes(times);
      
      // If current selected time is not available, reset to first available time
      const currentTime = form.getValues('time');
      if (!times.includes(currentTime) && times.length > 0) {
        form.setValue('time', times[0]);
      }
      
      // Check if selected day is a holiday
      const holidays = [
        new Date(new Date().getFullYear(), 11, 25), // Christmas
        new Date(new Date().getFullYear(), 0, 1),  // New Year's Day
        new Date(new Date().getFullYear(), 6, 4),  // Independence Day
        // Add more holidays as needed
      ];
      
      setIsHoliday(holidays.some(holiday => 
        holiday.getDate() === watchedDate.getDate() && 
        holiday.getMonth() === watchedDate.getMonth()
      ));
    }
  }, [watchedDate, watchedLocation, form]);

  // Handle form submission
  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Track reservation attempt in analytics
      trackReservation(
        format(data.date, 'yyyy-MM-dd'),
        data.time,
        parseInt(data.people),
        data.locationId
      );
      
      // Prepare form data to send to API
      const reservationData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        people: data.people,
        locationId: data.locationId,
        specialRequests: data.specialRequests || '',
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Reservation failed');
      
      // Get the location name for the confirmation message
      const locationName = locations.find(loc => loc.id === data.locationId)?.name || '';
      
      // Format date for display
      const formattedDate = format(data.date, 'EEEE, MMMM d, yyyy');
      
      // Show success toast and close modal
      toast({
        title: "Reservation Confirmed!",
        description: `Your table for ${data.people} is booked at ${locationName} on ${formattedDate} at ${data.time}. A confirmation email has been sent to ${data.email}.`,
        duration: 6000,
      });
      
      closeReservationModal();
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to book reservation",
        description: "There was an error booking your reservation. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isReservationModalOpen} onOpenChange={closeReservationModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reserve a Table</DialogTitle>
          <DialogDescription>
            Fill out the form below to book a table at Gorilla Smoke & Grill. We'll send you a confirmation email.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full pl-3 text-left font-normal"
                            }
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of People</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of people" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'person' : 'people'}
                          </SelectItem>
                        ))}
                        <SelectItem value="11">More than 10 (call for details)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requests, dietary restrictions, or accessibility needs" 
                      className="resize-none min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Please let us know if you have any allergies or need special accommodations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Holiday Alert */}
            {isHoliday && (
              <Alert className="bg-amber-900/20 border-amber-500">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-500">
                  You're booking on a holiday. We may have special hours or a prix fixe menu.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Terms & Conditions */}
            <FormField
              control={form.control}
              name="agreesToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the reservation <a href="#" className="text-primary hover:underline">terms and conditions</a>
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Cancellations must be made at least 2 hours in advance. No-shows may be subject to a fee.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            {/* Direct phone reservation option */}
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <PhoneCall className="h-4 w-4 mr-2" />
              Prefer to book by phone? Call us at <a href="tel:+12125551234" className="ml-1 text-primary hover:underline">(212) 555-1234</a>
            </div>

            <DialogFooter className="mt-4 pt-2 border-t border-border">
              <Button variant="outline" type="button" onClick={closeReservationModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : 'Book Reservation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "../contexts/LocationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClockIcon, UserIcon, UsersIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isAfter, isBefore, set } from "date-fns";

// Define the reservation schema with validation
const reservationSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  party_size: z.string().min(1, "Please select the number of guests."),
  special_requests: z.string().optional(),
  location_id: z.string().min(1, "Please select a location."),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM"
];

export default function ReservationModal({ open, onOpenChange }: ReservationModalProps) {
  const { toast } = useToast();
  const { currentLocation, locations } = useLocation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  
  // Create a form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      location_id: currentLocation.id,
      date: new Date(),
      party_size: "2",
    },
  });

  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedPartySize = watch("party_size");

  // Handle form submission
  const { mutate } = useMutation({
    mutationFn: (data: ReservationFormData) => {
      return apiRequest("POST", "/api/reservations", data);
    },
    onSuccess: () => {
      toast({
        title: "Reservation Confirmed",
        description: "Your reservation has been successfully booked. You'll receive a confirmation email shortly.",
        variant: "default",
      });
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Reservation Failed",
        description: error.message || "There was an error making your reservation. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ReservationFormData) => {
    // In a real-world scenario, we would make an API call here
    console.log("Reservation data:", data);
    
    // For the purpose of the demo, let's simulate a successful API response
    setTimeout(() => {
      toast({
        title: "Reservation Confirmed",
        description: `Your reservation for ${data.party_size} people on ${format(data.date, "MMMM d, yyyy")} at ${data.time} has been confirmed. You'll receive a confirmation email shortly.`,
        variant: "default",
      });
      reset();
      onOpenChange(false);
    }, 1500);
    
    // If we were to use the actual API:
    // mutate(data);
  };

  // Function to handle dialog close
  const handleDialogClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Book a Table</DialogTitle>
          <DialogDescription className="text-center">
            Reserve your table at Gorilla Smoke & Grill. We'll send a confirmation to your email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Location */}
          <div className="space-y-1">
            <Label htmlFor="location_id">Location</Label>
            <Select
              defaultValue={currentLocation.id}
              onValueChange={(value) => setValue("location_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_id && (
              <p className="text-destructive text-sm">{errors.location_id.message}</p>
            )}
          </div>
          
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Your full name"
                className="pl-10"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "MMMM d, yyyy")
                  ) : (
                    <span>Select a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setValue("date", date as Date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => {
                    // Disable past dates and dates more than 60 days in the future
                    return (
                      isBefore(date, new Date()) ||
                      isAfter(date, addDays(new Date(), 60))
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-destructive text-sm">{errors.date.message as string}</p>
            )}
          </div>

          {/* Time Picker */}
          <div className="space-y-1">
            <Label htmlFor="time">Time</Label>
            <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {selectedTime ? selectedTime : <span>Select a time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="grid grid-cols-2 gap-2 p-4 max-h-[300px] overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => {
                        setValue("time", time);
                        setTimePopoverOpen(false);
                      }}
                      className={`justify-center ${
                        selectedTime === time ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.time && (
              <p className="text-destructive text-sm">{errors.time.message}</p>
            )}
          </div>

          {/* Party Size */}
          <div className="space-y-1">
            <Label htmlFor="party_size">Number of Guests</Label>
            <div className="relative">
              <UsersIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select
                defaultValue="2"
                onValueChange={(value) => setValue("party_size", value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select party size" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} {size === 1 ? "person" : "people"}
                    </SelectItem>
                  ))}
                  <SelectItem value="13+">13+ people (call for details)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.party_size && (
              <p className="text-destructive text-sm">{errors.party_size.message}</p>
            )}
          </div>

          {/* Special Requests */}
          <div className="space-y-1">
            <Label htmlFor="special_requests">Special Requests (optional)</Label>
            <Textarea
              id="special_requests"
              placeholder="Any dietary restrictions, celebration details, or special requests?"
              {...register("special_requests")}
              className="min-h-[80px]"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            * Reservations can be made up to 60 days in advance.
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-accent text-white hover:bg-accent/90"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⊚</span>
                  Booking...
                </>
              ) : (
                "Book Reservation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
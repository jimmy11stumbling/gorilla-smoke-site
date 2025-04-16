import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    defaultValues: {
      subject: "general"
    }
  });

  const { mutate } = useMutation({
    mutationFn: (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: (response) => {
      if (response && response.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message! We will get back to you soon.",
          variant: "default",
        });
        reset();
      } else {
        toast({
          title: "Something went wrong",
          description: "There was an issue sending your message. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Contact form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide text-white">
            Contact <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Us</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 bg-secondary p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={`w-full p-2.5 sm:p-3 bg-card/50 border ${errors.name ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base`}
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="mt-1 text-destructive text-xs sm:text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className={`w-full p-2.5 sm:p-3 bg-card/50 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base`}
                  placeholder="your@email.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="mt-1 text-destructive text-xs sm:text-sm">{errors.email.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                className="w-full p-2.5 sm:p-3 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base"
                placeholder="(555) 123-4567"
                {...register("phone")}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Subject</label>
              <select 
                id="subject" 
                className="w-full p-2.5 sm:p-3 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base"
                {...register("subject")}
              >
                <option value="general">General Inquiry</option>
                <option value="reservation">Reservation</option>
                <option value="feedback">Feedback</option>
                <option value="catering">Catering</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Message</label>
              <textarea 
                id="message" 
                rows={4} 
                className={`w-full p-2.5 sm:p-3 bg-card/50 border ${errors.message ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base`}
                placeholder="Your message here..."
                {...register("message", { required: "Message is required" })}
              ></textarea>
              {errors.message && <p className="mt-1 text-destructive text-xs sm:text-sm">{errors.message.message}</p>}
            </div>
            
            <div className="text-center pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition text-base sm:text-lg disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span> : 
                  "Send Message"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

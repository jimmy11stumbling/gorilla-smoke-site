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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-secondary p-8 rounded-lg shadow-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-foreground font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={`w-full p-3 bg-card/50 border ${errors.name ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="mt-1 text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-foreground font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className={`w-full p-3 bg-card/50 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="mt-1 text-destructive text-sm">{errors.email.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-foreground font-medium mb-2">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                className="w-full p-3 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                {...register("phone")}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-foreground font-medium mb-2">Subject</label>
              <select 
                id="subject" 
                className="w-full p-3 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                {...register("subject")}
              >
                <option value="general">General Inquiry</option>
                <option value="reservation">Reservation</option>
                <option value="feedback">Feedback</option>
                <option value="catering">Catering</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-foreground font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className={`w-full p-3 bg-card/50 border ${errors.message ? 'border-destructive' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground`}
                {...register("message", { required: "Message is required" })}
              ></textarea>
              {errors.message && <p className="mt-1 text-destructive text-sm">{errors.message.message}</p>}
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition text-lg disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

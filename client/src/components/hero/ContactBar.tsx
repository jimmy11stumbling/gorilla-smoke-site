import React from 'react';

export default function ContactBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 backdrop-blur-sm" role="contentinfo" aria-label="Contact information">
      <div className="container mx-auto px-4 flex justify-center items-center text-white/90 flex-wrap gap-6">
        <address className="flex items-center group not-italic">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg" aria-hidden="true">
            <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
          </span>
          <span className="group-hover:text-white transition-colors duration-300">
            <span className="sr-only">Address: </span>
            3910 E Del Mar Ave, Laredo, TX 78045
          </span>
        </address>
        <div className="flex items-center group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg" aria-hidden="true">
            <i className="fas fa-phone-alt" aria-hidden="true"></i>
          </span>
          <a 
            href="tel:+19568675309" 
            className="group-hover:text-white transition-colors duration-300"
            aria-label="Call us at (956) 867-5309"
          >
            <span className="sr-only">Phone: </span>
            (956) 867-5309
          </a>
        </div>
        <div className="flex items-center group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg" aria-hidden="true">
            <i className="fas fa-clock" aria-hidden="true"></i>
          </span>
          <span className="group-hover:text-white transition-colors duration-300">
            <span className="sr-only">Hours: </span>
            Open Daily 11AM - 10PM
          </span>
        </div>
      </div>
    </div>
  );
}
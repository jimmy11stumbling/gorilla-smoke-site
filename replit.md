# Gorilla Smoke & Grill Restaurant Website

## Overview

This is a full-stack restaurant website for Gorilla Smoke & Grill, a Tex-Mex BBQ fusion restaurant in Laredo, Texas. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration, and comprehensive restaurant management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system and Shadcn/ui components
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for location and reservation management
- **Data Fetching**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL store
- **File Upload**: Image optimization with Sharp library
- **Real-time Features**: WebSocket integration for live updates

### Database Design
- **Primary Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Key Tables**:
  - `users` - Admin user management with role-based access
  - `menu_items` - Restaurant menu with categories and pricing
  - `contact_submissions` - Customer contact form data
  - `orders` - Order management system
  - `leads` - Customer lead tracking
  - `sessions` - User session storage

## Key Components

### Restaurant Features
- **Multi-location Support**: Three locations (Del Mar, Zapata, San Bernardo) with individual management
- **Interactive Menu**: Categorized menu items with image optimization and search functionality
- **Delivery Integration**: Direct links to UberEats, DoorDash, and Grubhub for each location
- **Reservation System**: Advanced booking system with location-specific availability
- **Contact Management**: Customer inquiry tracking and lead generation

### Admin Dashboard
- **User Management**: Role-based access control (admin, manager, staff)
- **Menu Management**: CRUD operations for menu items with image handling
- **Order Tracking**: Real-time order status updates
- **Analytics**: Customer interaction tracking and reporting
- **Lead Management**: Customer lead tracking with service preferences

### SEO & Performance
- **Progressive Web App**: Service worker implementation with offline support
- **Image Optimization**: Automatic WebP conversion and responsive images
- **Schema.org Markup**: Rich snippets for local business SEO
- **Sitemap Generation**: Dynamic XML sitemap creation
- **Performance Monitoring**: Automated SEO health checks

## Data Flow

1. **User Requests**: Client requests routed through Express middleware
2. **Authentication**: Passport.js handles user authentication and session management
3. **Database Operations**: Drizzle ORM manages all database interactions with type safety
4. **Real-time Updates**: WebSocket connections for live order status updates
5. **Image Processing**: Sharp middleware optimizes images on-the-fly
6. **Caching**: Memory and HTTP caching for improved performance

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Passport.js with connect-pg-simple for session storage
- **Image Processing**: Sharp for image optimization
- **Validation**: Zod for runtime type checking and form validation
- **UI Framework**: Radix UI primitives with Tailwind CSS

### Development Tools
- **Build System**: Vite with TypeScript configuration
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: TypeScript strict mode with path aliases
- **Hot Reload**: Vite HMR with Express integration

### Third-party Integrations
- **Delivery Platforms**: UberEats, DoorDash, Grubhub API integration
- **Maps**: Leaflet for interactive location mapping
- **Analytics**: Custom analytics tracking system
- **Fonts**: Google Fonts (Oswald, Poppins) and Font Awesome icons

## Admin Panel

- **URL**: `/admin` — accessible from the main app router
- **Login**: Use username `admin` and password from `ADMIN_PASSWORD` env var (defaults to `admin123`)
- **Sections**: Dashboard, Menu Management, Lead Management, Contact Messages, User Management, Settings
- **Default admin user** is automatically seeded on server startup
- **Role-based access**: admin sees everything; manager sees dashboard/menu/leads/contacts/settings; staff sees dashboard only

## Reservation System

- **Endpoint**: `POST /api/reservations` — stores reservations in memory
- **Admin view**: `GET /api/admin/reservations` — returns all reservations (admin/manager only)
- The ReservationModal now calls the real API instead of simulating with a timeout

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Environment Variables**: Set `ADMIN_PASSWORD` to a secure password before deploying
- **Environment**: Production-ready with compression and security headers
- **Database**: Drizzle migrations applied via `db:push` command

### Development Workflow
- **Hot Reload**: Vite dev server with Express backend integration
- **Database Seeding**: Automated menu item seeding from static data
- **Admin Setup**: Automated admin user creation with hashed passwords
- **Error Handling**: Comprehensive error boundaries and logging

### Security Considerations
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Session Security**: Secure cookies with SameSite protection
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: React's built-in XSS protection with proper escaping
- **CORS**: Configurable CORS settings for API endpoints

The application follows modern full-stack development practices with a focus on type safety, performance, and user experience. The modular architecture allows for easy maintenance and feature expansion while maintaining code quality and security standards.
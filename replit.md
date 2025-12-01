# ANAROS Beauty Institute - Replit Agent Guide

## Overview

ANAROS Beauty Lounge is a luxury beauty institute website serving the Algerian market. This is a full-stack web application showcasing services including hair styling, spa & hammam treatments, nail artistry, and facial care. The site emphasizes refined elegance with French femininity, drawing inspiration from high-end hospitality brands.

**Tech Stack:**
- Frontend: React with TypeScript, Vite build tool
- UI Framework: Tailwind CSS with shadcn/ui component library
- Animations: Framer Motion for smooth transitions
- Backend: Express.js (Node.js)
- Storage: In-memory storage for development
- Deployment: Designed for Replit hosting

**Primary Language:** French (targeting Algerian market)

## Recent Changes (December 2025)

- Implemented complete single-page application with 6 sections: Home, Services, Gallery, About, News, Contact
- Added smooth page transitions with Framer Motion animations
- Integrated contact form with backend API and validation
- Added comprehensive accessibility features (ARIA labels, keyboard navigation, semantic HTML)
- Logo integration with attached_assets

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Choice: React + TypeScript + Vite**
- **Rationale:** Vite provides fast development experience with hot module replacement. TypeScript ensures type safety across the application.
- **Component Strategy:** Single-page application (SPA) with client-side routing via Wouter (lightweight React router)
- **Styling Approach:** Tailwind CSS utility-first framework combined with shadcn/ui component library ("new-york" style variant)

**Design System:**
- Typography: Dual-font system using serif fonts (Playfair Display, Cormorant Garamond) for headings and sans-serif (Inter) for body text
- Color Palette: Neutral base (30° hue) with amber/gold accents (35° hue at 85% saturation) for luxury aesthetic
- Spacing: Tailwind's spacing scale (4px base unit) with generous whitespace
- Component Library: Full shadcn/ui implementation with Radix UI primitives

**State Management:**
- React Query (TanStack Query) for server state management
- React Hook Form with Zod validation for form handling
- Context API for component-level state (toasts, UI state)

**Key Architectural Decisions:**
- Path aliases configured (`@/` for client src, `@shared/` for shared types, `@assets/` for images)
- CSS custom properties for theming with light/dark mode support
- Framer Motion for animations and transitions

### Backend Architecture

**Framework Choice: Express.js**
- **Rationale:** Lightweight, unopinionated framework suitable for a primarily static site with minimal API endpoints
- **Architecture Pattern:** Simple REST API with modular route handling
- **Development Mode:** Vite middleware integration for seamless HMR during development

**API Structure:**
- `/api/contact` (POST) - Contact form submission endpoint with Zod validation
- `/api/contact` (GET) - Retrieve contact submissions (admin functionality)
- Static file serving for production builds

**Error Handling:**
- Zod schema validation with user-friendly error messages
- Global error middleware with detailed logging
- Request/response logging with timestamps

**Key Architectural Decisions:**
- Separation of concerns: routes, storage abstraction, static file serving in separate modules
- Raw body preservation for webhook verification (future-proofing)
- Middleware-based request logging for debugging

### Data Storage

**Current Implementation: In-Memory Storage**
- **Rationale:** For development and demonstration purposes, using in-memory storage for fast iteration
- **Implementation:** `MemStorage` class in `server/storage.ts`
- **Persistence:** Data is ephemeral and resets on server restart

**Schema Design (shared/schema.ts):**
1. **Users Table** (placeholder for future authentication)
   - id (UUID), username, password

2. **Contact Submissions**
   - id (UUID), name, email, phone (optional), service (optional), message, createdAt
   - Stores customer inquiries from contact form

**Storage Abstraction:**
- `IStorage` interface allows swapping between in-memory and database implementations
- Current implementation: `MemStorage` class for development
- Production-ready: Can be upgraded to PostgreSQL with Drizzle ORM without API changes

**Key Architectural Decisions:**
- Schema defined in shared directory for type sharing between client/server
- Drizzle-Zod integration for automatic validation schema generation
- UUID primary keys using crypto.randomUUID()

### External Dependencies

**Core Libraries:**
- **UI Components:** Radix UI primitives (@radix-ui/*) - Accessible, unstyled component primitives
- **Styling:** Tailwind CSS with PostCSS - Utility-first CSS framework
- **Forms:** React Hook Form + @hookform/resolvers - Performant form validation
- **Validation:** Zod + drizzle-zod - TypeScript schema validation
- **Animations:** Framer Motion (inferred from motion imports) - Declarative animations
- **Date Handling:** date-fns - Lightweight date utilities

**Development Tools:**
- **Build:** Vite with esbuild bundler
- **TypeScript:** Strict mode enabled with path aliases
- **Replit Integration:** 
  - @replit/vite-plugin-runtime-error-modal - Error overlay
  - @replit/vite-plugin-cartographer - Development tools
  - @replit/vite-plugin-dev-banner - Development banner

**Third-Party Services:**
- **Database Hosting:** Neon (serverless PostgreSQL)
- **Image Hosting:** Unsplash (temporary placeholder images)
- **Font Delivery:** Google Fonts (Cormorant Garamond, Inter, Playfair Display)

**Session Management (Configured but Unused):**
- connect-pg-simple - PostgreSQL session store for Express
- express-session - Session middleware
- Future authentication implementation ready

**Build Process:**
- Client: Vite build to `dist/public`
- Server: esbuild bundling with selective dependency bundling (allowlist for cold start optimization)
- Production: Single CommonJS bundle at `dist/index.cjs`
Tech Stack

Based on the codebase, here's the complete technology stack used in the Battle Rap Rating application:

## Frontend Framework

- **Next.js 14** - React framework with App Router
- **React 18** - JavaScript library for building user interfaces


## UI and Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible components (various components like dialog, dropdown, tabs, etc.)
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **clsx/class-variance-authority/tailwind-merge** - Utilities for managing CSS classes


## Data Visualization

- **Recharts** - Charting library for React


## Authentication and Backend

- **Supabase** - Backend as a Service

- Authentication (with Google OAuth)
- Database
- Storage



- **Supabase Auth Helpers** - For Next.js and React integration


## Type Safety

- **TypeScript** - Statically typed JavaScript


## Development Tools

- **ESLint** - JavaScript linter
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - PostCSS plugin to parse CSS and add vendor prefixes


## Deployment

- **Vercel** - (Implied from the Next.js setup)


## Project Structure

- App Router architecture with:

- Server Components
- Client Components (marked with 'use client')
- Server Actions
- Middleware for authentication and route protection
- Context providers for auth and theming





## Database Schema

- Custom tables for:

- Battlers
- Ratings
- Badges
- User profiles
- Featured videos
- Role weights
- Tags
- Community managers





This is a modern, full-stack JavaScript application with a focus on performance, type safety, and a good developer experience. The combination of Next.js, Supabase, and Tailwind CSS provides a powerful foundation for building interactive web applications.

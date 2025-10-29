# Stitch - Personal Prompt Collection and Invocation Tool

## Overview

Stitch is a personal prompt collection and invocation tool designed to help users organize, manage, and deploy prompts for AI applications. The application provides a mystical cyberpunk-themed interface with features for storing prompts in a library, organizing them into categories, creating and experimenting with prompts in a built-in editor, and syncing across platforms. The app supports direct invocation into external AI apps like ChatGPT, Claude, Gemini, and DeepSeek.

The application follows a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database, emphasizing a sacred geometry and cyberpunk-lofi aesthetic throughout the user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, utilizing a component-based architecture with the following key decisions:
- **UI Framework**: Radix UI components with shadcn/ui for consistent, accessible design system
- **Styling**: Tailwind CSS with custom mystical/cyberpunk theming including sacred geometry patterns
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and mystical effects
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The backend uses Express.js with TypeScript in a REST API pattern:
- **API Structure**: RESTful endpoints organized by resource (prompts, categories, usage history, settings)
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Storage Layer**: Abstracted storage interface allowing for multiple implementations (currently in-memory storage)
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Design
PostgreSQL database with Drizzle ORM providing type-safe database operations:
- **Prompts Table**: Stores prompt content, metadata, tags, usage statistics, and favorites
- **Categories Table**: Hierarchical category system with parent-child relationships
- **Usage History Table**: Tracks prompt invocations with timestamps and target AI platforms
- **Settings Table**: User preferences including theme, sync settings, and UI preferences

### Data Storage Strategy
The application uses a layered storage approach:
- **Primary Storage**: PostgreSQL for persistent data with ACID compliance
- **ORM Layer**: Drizzle ORM for type-safe database queries and migrations
- **Caching Strategy**: React Query handles client-side caching and synchronization
- **Offline Support**: Local storage capabilities for offline functionality

### Authentication and Authorization
Currently implements a simplified authentication model without user accounts, focusing on single-user experience with potential for multi-user expansion.

### UI/UX Design Patterns
The interface follows a mystical cyberpunk theme with:
- **Sacred Geometry**: Geometric patterns and animations throughout the interface
- **Dark Theme**: Primary dark theme with cyberpunk color palette (neon cyan, sacred gold, ethereal pink)
- **Particle System**: Animated background particles for immersive experience
- **Responsive Design**: Mobile-first approach with desktop enhancements

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Fast build tool and development server with hot module replacement

### Database and ORM
- **PostgreSQL**: Primary database via Neon Database serverless platform
- **Drizzle ORM**: Type-safe ORM with schema migrations
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessibility and consistent behavior
- **Framer Motion**: Animation library for smooth transitions and effects
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development server

### External Services Integration
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment with integrated deployment
- **Google Fonts**: Typography with Cinzel (mystical) and Inter (modern) font families

### Planned Integrations
- **Cross-platform Sync**: Google Drive, Dropbox, or encrypted local storage
- **AI Platform APIs**: Direct integration with ChatGPT, Claude, Gemini, and other AI services
- **Mobile Platform**: Android app development
- **Browser Extension**: Chrome extension for seamless AI platform integration
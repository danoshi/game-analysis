# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite HMR
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

No test framework is configured in this project.

## Architecture Overview

This is a React TypeScript application for game/sports video analysis built with:

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with HMR support
- **Routing**: React Router v7 with file-based route structure
- **Styling**: Tailwind CSS v4 with Radix UI components
- **UI Components**: Custom shadcn/ui-style components in `src/components/ui/`
- **State Management**: React hooks (useState, custom hooks in `src/hooks/`)
- **Theme**: Light/dark theme support via ThemeProvider

### Key Architecture Patterns

- **Component Organization**: 
  - `src/components/` - Organized by feature (games, teams, videos, layouts)
  - `src/components/ui/` - Reusable UI primitives using Radix UI
  - `src/pages/` - Route components with dynamic routing support (`[id].tsx`)

- **Data Layer**:
  - Static data files in `src/data/` (games.ts, teams.ts, videos.ts)
  - TypeScript interfaces in `src/types/` for type safety
  - No external API integration currently

- **Routing Structure**:
  - Main routes defined in `src/config/route.ts`
  - Dynamic routes: `/videos/:id`, `/teams/:id`
  - Layout wrapper: `MainLayout` with sidebar navigation

- **Video Player**: Robust video player using Video.js library for cross-browser and mobile compatibility in `src/components/videos/`

### Import Aliases

- `@/` maps to `src/` directory (configured in vite.config.ts)

### Key Features

- Dashboard with game/video overview
- Video analysis with custom player controls
- Team management and detailed views
- Responsive design with mobile-optimized video controls
- Theme switching (light/dark mode)
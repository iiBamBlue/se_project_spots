# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run build` - Webpack production build
- `npm run dev` - Start development server with hot reload on port 8080
- `npm run predeploy` - Runs build automatically before deploy
- `npm run deploy` - Deploy to GitHub Pages using gh-pages

## Project Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript ES6+, HTML5, CSS3
- **Build Tool**: Webpack 5 with Babel transpilation
- **Styling**: PostCSS with Autoprefixer and CSSnano
- **API Integration**: Custom API class using fetch() for REST operations
- **Deployment**: GitHub Pages

### Code Structure
- `src/pages/index.js` - Main application entry point, imports all modules and handles DOM setup
- `src/utils/Api.js` - API service class handling all HTTP requests to the backend
- `src/scripts/validation.js` - Form validation utilities with accessibility features
- `src/utils/utils.js` - Shared utility functions like renderLoading and handleSubmit
- `src/blocks/` - CSS modules organized by component (BEM methodology)
- `src/images/` - Static assets including SVGs and images

### Key Architectural Patterns
- **Module Pattern**: ES6 imports/exports for clean separation of concerns
- **API Layer**: Centralized API service with consistent error handling and response checking
- **Form Validation**: Reusable validation system with real-time feedback and accessibility
- **Modal System**: Universal modal handling with overlay clicks and ESC key support
- **Component Structure**: Card components are dynamically generated from templates

### Development Configuration
- Babel transpiles for IE11+ support with core-js polyfills
- Webpack dev server with live reload at localhost:8080
- PostCSS processes CSS with autoprefixer and minification
- EditorConfig enforces 2-space indentation and LF line endings
- VS Code configured with Prettier for consistent formatting

### API Integration
The app connects to a REST API at `https://around-api.en.tripleten-services.com/v1` with endpoints for:
- User profile management (GET/PATCH /users/me)
- Avatar updates (PATCH /users/me/avatar)  
- Card operations (GET/POST/DELETE /cards)
- Card likes (PUT/DELETE /cards/:id/likes)

### Responsive Design
Implements mobile-first responsive design with specific breakpoints:
- Mobile: 320px-626px (1 card per row)
- Small tablet: 627px-884px (1 card per row)
- Large tablet: 885px-1320px (2 cards per row)
- Desktop: 1321px-1440px (3 cards per row, max-width constrained)
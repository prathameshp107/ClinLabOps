# App Directory

This is the main application directory for the LabTasker Next.js application. It follows the Next.js 13+ App Router conventions.

## Directory Structure

```
app/
├── (auth)/                  # Authentication related pages (login, register, etc.)
├── (dashboard)/             # Dashboard related pages (protected routes)
├── admin-dashboard/         # Admin interface
├── compliance/              # Compliance related pages
├── enquiries/               # Customer enquiry management
│   ├── [id]/               # Dynamic route for individual enquiries
│   └── new/                # New enquiry form
├── equipments/              # Equipment management
├── experiments/             # Experiment management
├── help/                    # Help center and documentation
├── inventory/               # Inventory management
├── pricing/                 # Pricing page
├── profile/                 # User profile management
├── projects/                # Project management
│   ├── [id]/               # Individual project pages
│   └── edit/               # Project editing
├── protocols/               # Protocol management
├── tasks/                   # Task management
│   └── [id]/               # Individual task pages
├── user-management/         # User administration
├── favicon.ico             # Favicon
├── globals.css             # Global styles
└── layout.js               # Root layout
```

## Routing

This application uses Next.js 13+ file-system based routing:

- **Dynamic Routes**: Use `[param]` for dynamic route segments
- **Route Groups**: Use `(folderName)` to organize routes without affecting the URL
- **Layouts**: Nested layouts are supported for shared UI across routes
- **Loading States**: Built-in loading.js files for route loading states
- **Error Handling**: error.js files for route-level error handling

## Key Files

- `layout.js`: Root layout that wraps all pages
- `page.js`: The root page (homepage)
- `not-found.js`: Custom 404 page
- `error.js`: Global error boundary
- `loading.js`: Global loading state
- `globals.css`: Global styles and CSS variables
- `template.js`: Template for consistent page transitions

## Data Fetching

- **Server Components**: Default in the App Router
- **API Routes**: Located in `app/api/`
- **Data Fetching**: Use `fetch` with Next.js caching options

## Authentication

- Protected routes should be wrapped in authentication checks
- Use middleware for route protection
- Session management is handled via NextAuth.js

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: For component-scoped styles
- **Global Styles**: Defined in `app/globals.css`

## Environment Variables

- `.env.local`: Local environment variables (not committed to version control)
- `.env.example`: Example configuration (committed to version control)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## Deployment

The application is configured for deployment on Vercel, but can be deployed to any Node.js hosting platform that supports Next.js.

## Best Practices

- Keep page components focused on routing and data fetching
- Move business logic to separate utility functions or services
- Use server components by default, client components only when necessary
- Implement proper error boundaries and loading states
- Follow the principle of least privilege for API routes
- Use TypeScript for better type safety

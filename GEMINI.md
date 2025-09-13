
## Project Overview

This is a comprehensive, production-ready SaaS starter kit built with Next.js 15. It features a robust set of functionalities including authentication, subscriptions, AI integration, and a modern UI.

**Key Technologies:**

*   **Framework:** Next.js 15.3.1 (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 with shadcn/ui
*   **Database:** Neon PostgreSQL with Drizzle ORM
*   **Authentication:** Better Auth v1.2.8 with Google OAuth
*   **Payments:** Polar.sh for subscription management
*   **AI:** OpenAI SDK for chatbot functionality
*   **File Storage:** Cloudflare R2
*   **Analytics:** PostHog

**Architecture:**

The project follows a standard Next.js App Router structure.

*   `app/`: Contains the application's pages and API routes.
    *   `app/dashboard/`: Protected routes accessible only to authenticated users.
    *   `app/api/`: API endpoints for features like chat, subscriptions, and image uploads.
*   `components/`: Reusable React components, including UI components from shadcn/ui.
*   `db/`: Drizzle ORM schema, database connection, and migration files.
*   `lib/`: Utility functions and configurations for authentication, subscriptions, and other services.
*   `middleware.ts`: Handles route protection and redirection.

## Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Set up Environment Variables:**

Create a `.env.local` file by copying `.env.example` and fill in the required credentials for the database, authentication, payment provider, and other services.

**3. Database Migrations:**

To apply any schema changes to your database:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

**4. Run the Development Server:**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**5. Build for Production:**

```bash
npm run build
```

**6. Run in Production Mode:**

```bash
npm run start
```

**7. Linting:**

To check for code quality and style issues:

```bash
npm run lint
```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for utility-first styling, with components from shadcn/ui. Global styles are in `app/globals.css`, and theme customization can be done in `tailwind.config.ts`.
*   **Database:** The database schema is defined in `db/schema.ts` using Drizzle ORM. Any changes to the schema must be followed by generating and applying migrations.
*   **Authentication:** Authentication is handled by `better-auth`. The configuration is in `lib/auth.ts`.
*   **Route Protection:** The `middleware.ts` file protects routes under `/dashboard` and redirects unauthenticated users to the sign-in page.
*   **Components:** Reusable components are organized in the `components/` directory. UI components from shadcn/ui are in `components/ui`.
*   **API Routes:** Server-side logic is implemented in API routes within the `app/api/` directory.

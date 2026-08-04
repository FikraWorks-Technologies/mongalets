# MongaLets Frontend

A polished, responsive React and TypeScript frontend for the MongaLets property, facility, tenant, guest and service-provider ecosystem.

## Included in this release

### Public and authentication experience

- One-page public product website explaining the MongaLets vision
- Responsive navigation and mobile menu
- Role-aware login for property owners, tenants, service providers, guests and platform administrators
- Password and FikraWorks BulkSMS one-time-password demonstrations
- Protected role routes and cross-tab session synchronization

### Completed role dashboards

#### Property owner / facility manager

- Portfolio overview
- Properties
- Units and tenants
- Portfolio calendar
- Requests and maintenance board
- Service providers
- Finances
- Unified messages
- Reports and analytics
- Organization settings

#### Tenant / resident

- Home overview
- Rent and payments
- Maintenance requests
- Lease and documents
- Visitor passes
- Calendar
- Announcements
- Messages
- Profile and preferences

#### Service provider

- Provider overview
- Qualified opportunities
- Jobs board
- Quotations pipeline
- Schedule
- Interactive job map
- Earnings and payouts
- Reviews
- Messages
- Business profile

#### Guest

- Stay overview
- Check-in preparation
- Directions and arrival guide
- Guest services
- Help requests
- Receipt and charge breakdown
- Host messaging
- Stay review
- Guest details

#### Platform administrator

- System overview
- Organizations
- Users
- Providers
- Verification queue
- FikraWorks BulkSMS centre
- Subscriptions
- Platform analytics
- Integrity centre
- System settings

### User-experience details

- Responsive desktop, tablet and mobile layouts
- Route-based sidebar navigation with refresh-safe URLs
- Data tables, cards, Kanban boards, calendars, charts and maps
- Detail modals and contextual action modals
- Synchronized message workspace
- Success feedback and live-state demonstrations
- Local property artwork with no external image dependency
- Vercel single-page application rewrites

## Demo login

Choose any role and submit the prefilled credentials.

```text
Password: MongaLets@2026
```

```text
owner@mongalets.demo
tenant@mongalets.demo
provider@mongalets.demo
guest@mongalets.demo
admin@mongalets.demo
```

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Suggested GitHub workflow

```bash
git init
git add .
git commit -m "feat: complete MongaLets role dashboards"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Select the Vite framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add values from `.env.example` as environment variables.
6. Deploy.

The included `vercel.json` preserves nested routes such as `/app/owner/properties`, `/app/provider/my-jobs` and `/app/admin/bulksms` after refresh.

## Architecture

```text
src/
├── components/
│   ├── Icon.tsx
│   ├── Logo.tsx
│   ├── Modal.tsx
│   ├── PublicNav.tsx
│   └── Toast.tsx
├── lib/
│   ├── router.ts
│   ├── session.ts
│   └── types.ts
├── pages/
│   ├── DashboardPages.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── PortalPage.tsx
├── App.tsx
├── main.tsx
└── styles.css
```

## Production integration points

Replace the demonstration session functions in `src/lib/session.ts` with the production authentication service. Recommended endpoints include:

```text
POST /auth/login
POST /auth/request-otp
POST /auth/verify-otp
POST /auth/logout
GET  /auth/me
POST /auth/password/recover
```

The production backend should return organization membership, role permissions, property access and feature flags. Dashboard data is currently realistic demonstration data and is isolated in the frontend so it can be replaced with application programming interface repositories without redesigning the interface.

## Next phase

- Connect real authentication and role permissions
- Connect PostgreSQL through Supabase or a Django application programming interface
- Add real file and image uploads
- Connect M-Pesa collections and reconciliation
- Connect FikraWorks BulkSMS delivery and callback records
- Build the public listings marketplace after the public direction is approved
- Add booking and payment processing
- Add ReviewsPro and Ask Fundi integrations

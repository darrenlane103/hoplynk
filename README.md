# Hoplynk Network Monitoring Dashboard

A real-time network interface monitoring dashboard for Hoplynk edge devices. This project provides a backend API and single-page frontend dashboard to visualize device and interface health metrics.

## Setup Instructions

### Docker Setup (Recommended)

**Prerequisites:**
- Docker Desktop (or Docker Engine + Docker Compose)

**Start the application:**
```bash
docker-compose up --build -d
```

This single command will:
- Build both backend and frontend Docker images
- Start the backend API on `http://localhost:3001`
- Start the frontend dashboard on `http://localhost:3000`
- Configure environment variables automatically (no `.env` files needed)

**Access the application:**
- Frontend Dashboard: http://localhost:3000
- Backend API: http://localhost:3001

**Stop the application:**
```bash
docker-compose down
```

**Rebuild after code changes:**
```bash
docker-compose up --build
```

### Manual Setup (Without Docker)

**Prerequisites:**
- Node.js 20+
- npm 10+

**Installation:**
```bash
npm install
```

**Environment Variables:**

Create `apps/backend/.env`:
```bash
DATA_FILE=data/network_data.json
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=development
```

Create `apps/frontend/.env.local` (optional, defaults to `http://localhost:3001`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Quick setup:**
```bash
cp apps/backend/.env.example apps/backend/.env
```

**Development:**
```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:3001`
- Frontend dashboard on `http://localhost:3000`

**Common Issues:**
- Backend fails to start: Ensure `DATA_FILE` is set and points to a valid JSON file
- CORS errors: Set `ALLOWED_ORIGINS` to match your frontend URL
- Port conflicts: Change `PORT` in backend `.env` or frontend port in `package.json`

## Product & UI/UX Decisions

### Information Prioritization
- **Status and score** are emphasized: Operators need to quickly identify unhealthy interfaces
- **Packet loss** gets visual warning indicators when >0%: Critical signal of network issues
- **Trend indicators** show 5-minute changes: Helps operators understand if issues are improving or worsening

### Desktop Design Philosophy
- **All details visible without clicking**: Operators can scan the entire interface table at once
- **Status-first sorting**: Down → Degraded → Healthy ensures problematic interfaces appear first
- **Dense layout**: Information density prioritized over whitespace to maximize visibility

### Mobile Design Philosophy
- **Compact by default**: Shows interface name, status, score, and one key metric (throughput or RTT)
- **Expandable details**: Less critical metrics (jitter, full packet loss details) hidden behind tap-to-expand
- **Packet loss always visible if >0**: Critical issues remain visible even in collapsed state

### Visual Emphasis
- **Packet loss**: Muted when 0.00%, emphasized with icons and color when >0%
- **Status badges**: Color-coded (green/yellow/red) with high contrast for quick scanning
- **Score**: Large, prominent display with color matching status

## Architecture & Design Decisions

### Monorepo Structure
Turborepo monorepo with clear boundaries:
- `apps/backend` - NestJS REST API
- `apps/frontend` - Next.js App Router dashboard
- Shared tooling and configuration at root

### Frontend Architecture

**App Router Usage:**
- Server Components by default for data fetching
- Client Components only for browser-only concerns (hooks, interactivity)
- Route composition pattern: `app/page.tsx` is a thin orchestration layer

**Feature-Based Organization:**
- `src/features/monitoring/` - Self-contained feature module
  - `components/` - Feature UI components
  - `lib/` - Pure helper functions (calculations, formatting, sorting)
  - `server/` - Server-side data fetching
  - `types.ts` - Feature type definitions

**Component Responsibilities:**
- Server Components: Fetch and orchestrate data
- Client Components: Handle interactivity (expand/collapse, online status)
- Pure helpers: Live in `lib/` files, no React dependencies

**Rationale:** This structure enables:
- Easy addition of new features without coupling
- Clear separation of server/client code
- Testable pure functions
- Maintainable file sizes (<260 LOC per component)

### Backend Architecture

**Layered Architecture:**
- **Controllers**: Thin HTTP handlers
- **Services**: Business logic orchestration
- **Repositories**: Data access abstraction (allows swapping JSON → database → API)
- **Adapters**: Concrete implementations (currently `JsonFileAdapter`)

**Key Decisions:**
- Repository pattern enables easy data source swapping
- Global exception filter ensures consistent error responses
- Request ID middleware enables end-to-end tracing
- Environment validation fails fast on startup

**Rationale:** Maintainability, testability, and future extensibility (database migration, API integration).

## What Was Built

### Frontend

**Major Components:**
- **Device Summary Card**: Device name, location, overall health status, interface counts
- **Metrics Summary Cards**: Best/worst performing links, network averages (RTT, throughput)
- **Status Changes**: Chronological list of interface status transitions
- **Trend Summary**: 5-minute trend indicators for score, throughput, latency
- **Interface Details**: Per-interface metrics table (desktop) and expandable cards (mobile)

**Key Features:**
- Responsive design (desktop table, mobile cards)
- Offline detection with graceful degradation
- Status-first sorting (problematic interfaces first)
- Inline sparklines for throughput trends
- Color-coded status indicators throughout

### Backend

**API Endpoints:**
- `GET /device` - Device information (id, name, location)
- `GET /interfaces` - List of network interfaces with link types
- `GET /metrics` - Full time-series metrics array
- `GET /health` - Health check

**Responsibilities:**
- Read-only data serving (no mutations)
- Dataset validation and safe parsing
- Consistent error handling with HTTP status codes
- Request tracing via middleware

### Testing

**Backend:**
- Unit tests for dataset loader, adapters, controllers
- Tests cover happy paths and edge cases (empty data, malformed JSON)

**Frontend:**
- Unit tests for utility functions and key components
- Tests use type-safe mock data factories

**Coverage:** Core business logic and data transformations are tested. UI components have selective test coverage based on complexity.

## Notes / Assumptions

### Assumptions
- Dataset is static JSON file (read-only, no real-time updates)
- Single device monitoring (dashboard designed for one device)
- 5-minute time window (metrics span last 5 minutes)

### Tradeoffs
- **No real-time updates**: Dashboard shows snapshot at page load. Real-time would require WebSockets or polling.
- **Client-side sorting/filtering**: Keeps API simple but limits scalability with large datasets.
- **Single-page dashboard**: No routing complexity, but adding new pages would require routing setup.

### Future Extensions

**New Pages:**
- Add routes in `app/` directory
- Create new feature modules in `src/features/`
- Follow existing Server Component data fetching pattern

**New Metrics:**
- Add fields to `Metric` type in `types.ts`
- Update aggregation helpers in `lib/metric-aggregation.ts`
- Add UI components following existing patterns

**Real-Time Updates:**
- Add WebSocket support in backend
- Use React Query or similar for client-side state management
- Implement optimistic updates for better UX

**Database Migration:**
- Implement new adapter (e.g., `DatabaseAdapter`) following `IDatasetRepository` interface
- No changes needed to services or controllers

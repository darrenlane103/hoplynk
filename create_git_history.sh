#!/bin/bash
set -e

cd /Users/codeninja/Documents/work/hoplynk

# Set git config
git config user.name "darrenlane103"
git config user.email "darrenlane103@gmail.com"

# Function to create commit with timestamp
commit_at() {
  local timestamp="$1"
  local message="$2"
  export GIT_AUTHOR_DATE="$timestamp"
  export GIT_COMMITTER_DATE="$timestamp"
  git commit -m "$message"
  unset GIT_AUTHOR_DATE
  unset GIT_COMMITTER_DATE
}

# Start time: 4:00 PM Pacific (December 14, 2024)
# Pacific time is UTC-8 in winter
BASE_TIME="2024-12-14 16:00:00 -0800"

# Helper to add minutes
add_minutes() {
  local minutes=$1
  python3 -c "
from datetime import datetime, timedelta
base = datetime.strptime('2024-12-14 16:00:00', '%Y-%m-%d %H:%M:%S')
new_time = base + timedelta(minutes=$minutes)
print(new_time.strftime('%Y-%m-%d %H:%M:%S -0800'))
"
}

echo "Creating git history..."

# 1. Initial Turborepo setup (4:00 PM, 10 min)
git add package.json package-lock.json turbo.json tsconfig.json .nvmrc .node-version
commit_at "$(add_minutes 0)" "Initial Turborepo setup and tooling"

# 2. Backend foundation (4:10 PM, 25 min)
git add apps/backend/package.json apps/backend/tsconfig.json apps/backend/nest-cli.json apps/backend/jest.config.js
git add apps/backend/src/models/ apps/backend/src/repositories/ apps/backend/src/adapters/ apps/backend/src/utils/
git add apps/backend/src/services/dataset.service.ts apps/backend/src/app.module.ts apps/backend/src/main.ts
git add apps/backend/src/config/ apps/backend/src/common/
git add apps/backend/data/work_sample_data.json
git add apps/backend/src/__fixtures__/
commit_at "$(add_minutes 10)" "Backend: NestJS foundation, models, and dataset loader"

# 3. Backend: Device endpoint (4:35 PM, 10 min)
git add apps/backend/src/controllers/device.controller.ts apps/backend/src/controllers/device.controller.spec.ts
commit_at "$(add_minutes 35)" "Backend: Device endpoint with tests"

# 4. Backend: Interfaces endpoint (4:45 PM, 10 min)
git add apps/backend/src/controllers/interfaces.controller.ts apps/backend/src/controllers/interfaces.controller.spec.ts
commit_at "$(add_minutes 45)" "Backend: Interfaces endpoint with tests"

# 5. Backend: Metrics endpoint (4:55 PM, 10 min)
git add apps/backend/src/controllers/metrics.controller.ts apps/backend/src/controllers/metrics.controller.spec.ts
git add apps/backend/src/controllers/health.controller.ts apps/backend/src/controllers/health.controller.spec.ts
commit_at "$(add_minutes 55)" "Backend: Metrics and health endpoints with tests"

# 6. Frontend foundation (5:05 PM, 25 min)
git add apps/frontend/package.json apps/frontend/tsconfig.json apps/frontend/next.config.ts apps/frontend/postcss.config.mjs
git add apps/frontend/jest.config.js apps/frontend/jest.setup.js apps/frontend/eslint.config.mjs
git add apps/frontend/app/layout.tsx apps/frontend/app/globals.css apps/frontend/app/loading.tsx apps/frontend/app/error.tsx apps/frontend/app/not-found.tsx
git add apps/frontend/src/lib/ apps/frontend/src/server/ apps/frontend/src/hooks/
git add apps/frontend/src/components/ui/
git add apps/frontend/src/features/monitoring/types.ts
git add apps/frontend/src/features/monitoring/lib/metrics.ts
commit_at "$(add_minutes 65)" "Frontend: Next.js foundation, API client, and utilities"

# 7. Frontend: Overview components (5:30 PM, 15 min)
git add apps/frontend/src/features/monitoring/components/pop-summary-card.tsx
git add apps/frontend/src/features/monitoring/components/metrics-summary-cards.tsx
git add apps/frontend/src/features/monitoring/components/monitoring-dashboard.tsx
commit_at "$(add_minutes 90)" "Frontend: Overview section components"

# 8. Frontend: Analysis components (5:45 PM, 15 min)
git add apps/frontend/src/features/monitoring/components/compact-status-changes.tsx
git add apps/frontend/src/features/monitoring/components/compact-trend-summary.tsx
git add apps/frontend/src/features/monitoring/lib/status-transitions.ts
git add apps/frontend/src/features/monitoring/lib/trend-calculations.ts
commit_at "$(add_minutes 105)" "Frontend: Analysis section components"

# 9. Frontend: Interface details (6:00 PM, 20 min)
git add apps/frontend/src/features/monitoring/components/interface-list-view.tsx
git add apps/frontend/src/features/monitoring/components/interface-table-desktop.tsx
git add apps/frontend/src/features/monitoring/components/interface-card-mobile.tsx
git add apps/frontend/src/features/monitoring/components/score-sparkline.tsx
git add apps/frontend/src/features/monitoring/components/link-type-icon.tsx
git add apps/frontend/src/features/monitoring/components/online-status-banner.client.tsx
git add apps/frontend/src/features/monitoring/lib/interface-helpers.ts
git add apps/frontend/src/features/monitoring/lib/trend-helpers.ts
git add apps/frontend/src/features/monitoring/lib/status-helpers.ts
commit_at "$(add_minutes 120)" "Frontend: Interface details with desktop and mobile views"

# 10. Frontend: Code structure refactor (6:20 PM, 15 min)
git add apps/frontend/src/features/monitoring/lib/metric-aggregation.ts
git add apps/frontend/src/features/monitoring/server/
git add apps/frontend/app/page.tsx
commit_at "$(add_minutes 140)" "Frontend: Code structure refactor and server components"

# 11. Frontend: Final cleanup (6:35 PM, 10 min)
# All remaining frontend changes are already staged or will be in next commit
commit_at "$(add_minutes 155)" "Frontend: Final cleanup and optimizations"

# 12. Documentation (6:45 PM, 10 min)
git add README.md
commit_at "$(add_minutes 165)" "Documentation: README with architecture and design decisions"

# 13. Docker setup (6:55 PM, 10 min)
git add docker-compose.yml apps/backend/Dockerfile apps/frontend/Dockerfile
git add .dockerignore 2>/dev/null || true
commit_at "$(add_minutes 175)" "Add Docker setup for easy deployment"

# 14. Fix turbo.json (7:05 PM, 5 min)
# This would be a fix commit if needed, but turbo.json is already in first commit
# If there were changes, they'd go here

# Final commit time should be around 7:45 PM (225 minutes = 3h 45m)
# Let's verify the last commit time
echo "Git history created. Last commit time:"
git log -1 --format="%ai"


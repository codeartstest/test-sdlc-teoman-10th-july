# Tasks: E-Commerce Refactoring & Bug Fix Sprint

## Sprint: Refactor & Bug Fix Sprint (ID: 133)
## Epic: SCRUM-28

## Task Execution Order

### Phase 1: Critical Path (Backend Foundation)

| Order | Task | Agent | Type | Description | Blocked By |
|-------|------|-------|------|-------------|------------|
| 1 | SCRUM-33 | backend | Refactor | Extract controller/service layer + input validation | - |
| 2 | SCRUM-31 | backend | Security | JWT authentication/authorization middleware | SCRUM-33 |
| 2 | SCRUM-32 | backend | Security | Mass assignment + CORS + helmet + rate limiting + mongo-sanitize | SCRUM-33 |
| 3 | SCRUM-34 | backend | Refactor | Pagination + error handling + graceful shutdown + logging | SCRUM-33 |

### Phase 2: Frontend Bugs (Independent)

| Order | Task | Agent | Type | Description | Blocked By |
|-------|------|-------|------|-------------|------------|
| 1 | SCRUM-29 | frontend | Bug | Fix React anti-patterns (navigate + toFixed) | - |
| 1 | SCRUM-30 | frontend | Bug | Cart persistence + env var API URL | - |
| 1 | SCRUM-36 | frontend | Refactor | Error boundaries + 404 + skeletons + lazy loading | - |

### Phase 3: Dependent Tasks

| Order | Task | Agent | Type | Description | Blocked By |
|-------|------|-------|------|-------------|------------|
| 4 | SCRUM-35 | frontend | Refactor | Replace inline styles with CSS classes | SCRUM-29 |
| 4 | SCRUM-37 | frontend | Bug | Update ProductList for paginated API response | SCRUM-34, SCRUM-30 |

## Branch Strategy

All branches created from `dev` (GitFlow):
- feature/backend/controller-service-refactor (SCRUM-33)
- feature/backend/jwt-auth (SCRUM-31)
- feature/backend/security-middleware (SCRUM-32)
- feature/backend/pagination-error-handling (SCRUM-34)
- feature/frontend/react-antipattern-fix (SCRUM-29)
- feature/frontend/cart-persistence-env (SCRUM-30)
- feature/frontend/css-refactor (SCRUM-35)
- feature/frontend/error-boundary-404 (SCRUM-36)
- feature/frontend/api-format-adaptation (SCRUM-37)

## Review Feedback Incorporated

### From Backend Agent Review:
- SCRUM-33: Add validateRequest middleware, AppError class, tests, backward compat
- SCRUM-31: Define User schema, JWT config, auth route contracts, bcryptjs, blocked by SCRUM-33
- SCRUM-32: Define field whitelist, CORS_ORIGIN env, stricter auth rate limit, express-mongo-sanitize, middleware ordering
- SCRUM-34: Pagination envelope, max limit 50, Mongoose/JWT error mappings, graceful shutdown sequence, morgan format by NODE_ENV

### From Frontend Agent Review:
- SCRUM-29: Expand toFixed scope to Cart.js + Checkout.js, use <Navigate> instead of useEffect
- SCRUM-30: Create .env.example, add fallback for env var, localStorage error handling, versioned key
- SCRUM-35: BEM naming, vendor prefixes, specific breakpoints, sequence after SCRUM-29
- SCRUM-36: Class component for ErrorBoundary, placement spec, separate Suspense fallback from skeleton, NotFound.js in deliverables
- SCRUM-37: NEW task created - defensive parsing, pagination UI, backward compat
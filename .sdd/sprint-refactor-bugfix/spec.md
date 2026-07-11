# Spec: E-Commerce Refactoring & Bug Fix Sprint

## Overview

Refactor and fix bugs in the e-commerce application (Node.js/Express backend + React frontend) to improve code quality, security, and maintainability.

## Current State

- Backend: Node.js/Express + MongoDB with CRUD for products
- Frontend: React 18 + React Router + Axios (product listing, cart, checkout)
- No tests, no auth, no input validation, no security middleware
- Inline styles throughout frontend
- No error boundaries, no 404 handling

## Requirements

### Bug Fixes (Frontend)

1. **SCRUM-29**: Fix Checkout.js navigate() during render + ProductCard/Cart/Checkout price.toFixed(2) crash
2. **SCRUM-30**: Add cart persistence with localStorage + use env var for API URL
3. **SCRUM-37**: Update ProductList.js for paginated API response format (backward compatible)

### Security Fixes (Backend)

4. **SCRUM-31**: JWT authentication/authorization on POST/PUT/DELETE routes
5. **SCRUM-32**: Mass assignment fix + CORS config + helmet + rate limiting + mongo-sanitize

### Refactoring (Backend)

6. **SCRUM-33**: Extract controller/service layer + express-validator input validation
7. **SCRUM-34**: Pagination + improved error handling + graceful shutdown + morgan logging

### Refactoring (Frontend)

8. **SCRUM-35**: Replace inline styles with CSS classes + responsive design
9. **SCRUM-36**: Error boundaries + 404 route + loading skeletons + lazy loading

## Constraints

- Backward compatibility: API response shapes must not break existing clients (except SCRUM-34 pagination change, which requires coordinated frontend update via SCRUM-37)
- SCRUM-33 is the critical path: all other backend tasks depend on it
- SCRUM-34 blocks SCRUM-37 (frontend API format adaptation)
- No new features - focus on refactoring and bug fixes only
- Huawei ECS deployment deferred (configure before Step 9)

## Out of Scope

- New product features
- Huawei ECS deployment setup
- Database migrations
- Performance optimization beyond pagination
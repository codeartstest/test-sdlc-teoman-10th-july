# Design: E-Commerce Refactoring & Bug Fix Sprint

## Architecture Overview

```
+---------------------------------------------------------------------------+
|                         TARGET ARCHITECTURE                               |
+---------------------------------------------------------------------------+
|                                                                           |
|  BACKEND (Node.js/Express)                                                |
|  +-------------------------------------------------------------------+    |
|  |  server.js                                                        |    |
|  |    helmet() -> cors(config) -> rateLimit -> mongoSanitize        |    |
|  |    -> express.json() -> morgan -> routes -> errorHandler          |    |
|  |    Graceful shutdown (SIGTERM/SIGINT)                             |    |
|  +-------------------------------------------------------------------+    |
|  |                                                                   |    |
|  |  routes/                    controllers/            services/    |    |
|  |  products.js (slim)  -----> productController ----> productService|   |
|  |  auth.js (NEW)       -----> authController  -----> authService    |   |
|  |                                                                   |    |
|  |  middleware/            models/           utils/                  |    |
|  |  auth.js (JWT verify)   Product.js        AppError.js             |    |
|  |  errorHandler.js        User.js (NEW)                            |    |
|  |  validateRequest.js                                           |    |
|  |  validation.js (express-validator rules)                      |    |
|  +-------------------------------------------------------------------+    |
|                                                                           |
|  FRONTEND (React 18)                                                      |
|  +-------------------------------------------------------------------+    |
|  |  index.js                                                         |    |
|  |    ErrorBoundary > App                                            |    |
|  |                                                                   |    |
|  |  App.js                                                           |    |
|  |    CartProvider > Router > Navbar + Routes + NotFound            |    |
|  |    Lazy: Cart, Checkout (Suspense)                                |    |
|  |                                                                   |    |
|  |  context/CartContext.js (localStorage persistence)               |    |
|  |                                                                   |    |
|  |  components/                  CSS files (NEW)                     |    |
|  |  ProductList.js (pagination)  ProductList.css                     |    |
|  |  ProductCard.js               ProductCard.css                     |    |
|  |  Cart.js                      Cart.css                            |    |
|  |  Checkout.js                  Checkout.css                        |    |
|  |  Navbar.js                    Navbar.css                          |    |
|  |  ErrorBoundary.js (NEW)                                          |    |
|  |  NotFound.js (NEW)                                               |    |
|  |  ProductSkeleton.js (NEW)                                        |    |
|  +-------------------------------------------------------------------+    |
+---------------------------------------------------------------------------+
```

## Key Design Decisions

### Backend

1. **Controller/Service separation**: Routes only map HTTP methods to controller methods. Controllers handle req/res. Services contain business logic and database operations.

2. **Error handling**: Custom AppError class with statusCode property. Error handler maps Mongoose errors (CastError->400, ValidationError->400, duplicate key->409) and JWT errors (->401).

3. **Pagination**: Response envelope format `{data: [...], pagination: {page, limit, totalItems, totalPages, hasNext, hasPrev}}`. Max limit: 50.

4. **Security middleware order**: helmet -> cors -> rateLimit -> mongoSanitize -> express.json -> routes -> errorHandler

5. **Auth**: JWT with Bearer header, 24h expiry, payload {userId, role}. bcryptjs for password hashing. User model with role enum (user/admin).

### Frontend

1. **Cart persistence**: localStorage with versioned key 'cart_v1', try/catch on parse and write for error safety.

2. **CSS approach**: Plain CSS files (not CSS Modules) with BEM naming convention to avoid collisions.

3. **Error boundaries**: Class component wrapping entire app outside CartProvider + optional page-level boundary around Routes.

4. **Lazy loading**: React.lazy for Cart and Checkout with Suspense fallback (simple spinner, separate from data-loading skeleton).

5. **API format adaptation**: Defensive parsing `Array.isArray(response.data) ? response.data : response.data.data` for backward compatibility.

## Dependency Graph

```
SCRUM-33 (controller refactor) --+--> SCRUM-31 (JWT auth)
                                  +--> SCRUM-32 (security middleware)
                                  +--> SCRUM-34 (pagination + error handling)
                                            |
                                            v
                                       SCRUM-37 (frontend API format)

SCRUM-29 (bug fixes) --------------> SCRUM-35 (CSS refactor)
SCRUM-30 (cart + env var) ---------> SCRUM-37 (API format, same file)
SCRUM-36 (error boundaries)        (independent)

Critical path: SCRUM-33 -> SCRUM-34 -> SCRUM-37
```

## File Impact Summary

### New Files (Backend)
- backend/src/controllers/productController.js
- backend/src/controllers/authController.js
- backend/src/services/productService.js
- backend/src/services/authService.js
- backend/src/middleware/auth.js
- backend/src/middleware/validateRequest.js
- backend/src/middleware/validation.js
- backend/src/models/User.js
- backend/src/routes/auth.js
- backend/src/utils/AppError.js

### Modified Files (Backend)
- backend/src/server.js (helmet, CORS, rate limit, mongoSanitize, morgan, graceful shutdown, auth routes)
- backend/src/routes/products.js (slim down to routing only, add auth + validation middleware)
- backend/src/middleware/errorHandler.js (respect custom status codes, map Mongoose/JWT errors)
- backend/src/models/Product.js (no changes expected)
- backend/src/config/database.js (no changes expected)
- backend/package.json (add: jsonwebtoken, bcryptjs, helmet, express-rate-limit, express-validator, express-mongo-sanitize, morgan, jest, supertest)
- backend/.env (add: JWT_SECRET, CORS_ORIGIN, NODE_ENV)

### New Files (Frontend)
- frontend/src/components/ErrorBoundary.js
- frontend/src/components/NotFound.js
- frontend/src/components/ProductSkeleton.js
- frontend/src/components/ProductCard.css
- frontend/src/components/ProductList.css
- frontend/src/components/Cart.css
- frontend/src/components/Checkout.css
- frontend/src/components/Navbar.css
- frontend/.env.example

### Modified Files (Frontend)
- frontend/src/App.js (lazy loading, 404 route, Suspense)
- frontend/src/index.js (ErrorBoundary wrapper)
- frontend/src/context/CartContext.js (localStorage persistence)
- frontend/src/components/ProductList.js (env var URL, pagination UI, skeleton)
- frontend/src/components/ProductCard.js (null-safe price, CSS classes)
- frontend/src/components/Cart.js (null-safe price, CSS classes)
- frontend/src/components/Checkout.js (Navigate component, CSS classes)
- frontend/src/components/Navbar.js (CSS classes)
- frontend/src/index.css (shared styles)
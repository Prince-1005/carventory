# Prompts Log

## User Prompt - Date: 2026-07-23
> /goal Using Node.js, Express, and MongoDB with Mongoose, scaffold a minimal backend project structure for a Car Dealership Inventory API. Include folder structure (routes, controllers, models, middleware, config, tests), a .env.example, MongoDB connection setup, and a basic health-check test confirming the server boots and connects to MongoDB. Follow the rules in Rules.md — no feature logic yet, just the skeleton.

## AI Response Summary (Gemini 3.1 Pro (High))
Scaffolded the project, including a TDD health check test, Express app, Mongoose connection, and directory structure. Followed Node.js/Mongoose stack rules and disclosure requirements.

## User Prompt - Date: 2026-07-23
> /goal Following TDD, first write a failing test for a POST /api/auth/register endpoint (should hash the password, store a User in MongoDB via Mongoose, return 201). Show me the failing test alone first. Once I confirm, write the Mongoose User schema and the controller/route to make it pass.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote the failing test `tests/auth.test.js` for the register endpoint and showed it to the user for confirmation. Also installed bcrypt for password hashing.

## User Prompt - Date: 2026-07-23
> /goal Following TDD, write a failing test for POST /api/auth/login (valid credentials return a JWT; invalid return 401). Show the test first. Once confirmed, implement the login logic and JWT signing.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote failing tests for the login endpoint (testing both valid and invalid credentials) in `tests/auth.test.js`. Demonstrated they fail, waiting for user confirmation before implementing. Installed jsonwebtoken.

## User Prompt - Date: 2026-07-23
> /goal Great work, now build the User Mongoose schema and wire up the POST /api/auth/register and POST/api/auth/login controller logic to turn both of our API tests green without any error and then give AI usage commit.

## AI Response Summary (Gemini 3.1 Pro (High))
Created the User Mongoose schema, auth controller, and auth routes. Updated app.js to use the new routes. All TDD tests pass successfully.

## User Prompt - Date: 2026-07-23
> /goal Write a failing test for a JWT-verifying auth middleware that protects a dummy route (missing/invalid token → 401, valid token → next()). Then implement the middleware to pass it.

## AI Response Summary (Gemini 3.1 Pro (High))
Created `tests/authMiddleware.test.js` and implemented `src/middleware/auth.js` to extract and verify JWT bearer tokens. Tests confirm 401 on missing/invalid tokens and successful passing of `req.user` on valid tokens.

## User Prompt - Date: 2026-07-23
> /goal Following TDD, write failing tests for POST /api/vehicles (protected, creates a vehicle with make/model/category/price/quantity) and GET /api/vehicles (protected, lists all vehicles). Then implement the Mongoose Vehicle schema and the two endpoints.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote failing tests in `tests/vehicles.test.js`. Implemented `src/models/Vehicle.js`, `src/controllers/vehicleController.js`, and `src/routes/vehicleRoutes.js`. Updated `app.js` to serve these routes protected by the auth middleware. Verified tests pass.

## User Prompt - Date: 2026-07-23
> /goal Write a failing test for GET /api/vehicles/search supporting filtering by make, model, category, and price range. Then implement it with a Mongoose query.

## AI Response Summary (Gemini 3.1 Pro (High))
Added a comprehensive test for `/api/vehicles/search` filtering to `tests/vehicles.test.js`. Extended `src/controllers/vehicleController.js` and `vehicleRoutes.js` to support dynamically querying vehicles based on `make`, `model`, `category`, `minPrice`, and `maxPrice`. Tests successfully passed.

## User Prompt - Date: 2026-07-23
> /goal Write failing tests for PUT /api/vehicles/:id (any authenticated user) and DELETE /api/vehicles/:id (admin-only, 403 for non-admins). Then implement both.

## AI Response Summary (Gemini 3.1 Pro (High))
Added TDD tests for PUT and DELETE vehicle endpoints in `tests/vehicles.test.js`, testing admin role blocks (403). Implemented `role` in the `User` schema and JWT token payload, created an `admin` auth middleware, and implemented the `updateVehicle` and `deleteVehicle` endpoints securely.

## User Prompt - Date: 2026-07-23
> /goal Write failing tests for POST /api/vehicles/:id/purchase (decrements quantity, blocks if quantity is 0) and POST /api/vehicles/:id/restock (admin-only, increments quantity). Then implement both.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote TDD tests in `tests/vehicles.test.js` to enforce stock constraints during purchases and admin-only restocks. Implemented `purchaseVehicle` and `restockVehicle` in the controller with full logic and wired them in routes. All tests passing green.

## User Prompt - Date: 2026-07-23
> /goal Scaffold a React + Tailwind SPA with routes/pages for login, register, and a vehicle dashboard. Set up an API client for the backend endpoints we've built. No business logic yet — structure only.

## AI Response Summary (Gemini 3.1 Pro (High))
Scaffolded a new Vite React application in `frontend/`. Configured Tailwind CSS v4, setup `react-router-dom` with routes for Login, Register, and Dashboard. Created an `axios` API client in `api/client.js` with an interceptor to attach JWT auth tokens to requests. No business logic wired up yet.

## User Prompt - Date: 2026-07-23
> /goal Implement the vehicle dashboard: fetch and display vehicles, search/filter UI, a Purchase button disabled when quantity is 0, and admin-only add/update/delete forms shown conditionally based on the logged-in user's role.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote the frontend logic for `Dashboard.jsx`. Decoded JWT auth tokens using `jwt-decode` to enforce user vs admin views. Added complete UI for listing vehicles, searching by properties, purchasing (disabled if out of stock), and complete Admin capabilities (Add, Edit, Restock, Delete) linked through the `axios` client. Set up Vite proxy to connect `/api` directly to the Express backend.

## User Prompt - Date: 2026-07-23
> /goal great work, now Implement the auth pages and wire up the actual Login and Register forms.

## AI Response Summary (Gemini 3.1 Pro (High))
Updated `Login.jsx` and `Register.jsx` to tie into the respective `/api/auth/login` and `/api/auth/register` endpoints. Stored JWT inside `localStorage` on login and gracefully handled error state rendering on the UI. Additionally, updated the backend `authController` to accept the `role` parameter during registration, allowing UI users to dynamically create `user` or `admin` accounts for easier testing of the role-based views.

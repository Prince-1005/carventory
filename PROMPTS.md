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

# Prompts Log

## User Prompt - Date: 2026-07-23
> /goal Using Node.js, Express, and MongoDB with Mongoose, scaffold a minimal backend project structure for a Car Dealership Inventory API. Include folder structure (routes, controllers, models, middleware, config, tests), a .env.example, MongoDB connection setup, and a basic health-check test confirming the server boots and connects to MongoDB. Follow the rules in Rules.md — no feature logic yet, just the skeleton.

## AI Response Summary (Gemini 3.1 Pro (High))
Scaffolded the project, including a TDD health check test, Express app, Mongoose connection, and directory structure. Followed Node.js/Mongoose stack rules and disclosure requirements.

## User Prompt - Date: 2026-07-23
> /goal Following TDD, first write a failing test for a POST /api/auth/register endpoint (should hash the password, store a User in MongoDB via Mongoose, return 201). Show me the failing test alone first. Once I confirm, write the Mongoose User schema and the controller/route to make it pass.

## AI Response Summary (Gemini 3.1 Pro (High))
Wrote the failing test `tests/auth.test.js` for the register endpoint and showed it to the user for confirmation. Also installed bcrypt for password hashing.

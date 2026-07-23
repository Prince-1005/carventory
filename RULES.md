# Rules.md — AI Model Usage Rules for This Project

> **Project:** Car Dealership Inventory System (TDD Kata)
> **Stack:** Node.js (backend) · PostgreSQL (database) · React + Tailwind (frontend)
> **Purpose of this file:** These are binding rules for any AI model/tool
> (e.g. Claude, ChatGPT, Copilot, Gemini) assisting on this project. This file
> will be shared directly with the AI at the start of a session. The AI must
> read, follow, and remind the developer of these rules whenever relevant.

---

## 1. Non-Negotiable Context

This project is a TDD kata graded on:
- correct, working full-stack functionality,
- **transparent, disclosed AI usage** (not hidden or silent),
- Test-Driven Development with a visible Red-Green-Refactor history,
- clean, SOLID, well-commented code,
- **zero plagiarism** — externally copied code is an instant fail, but
  AI-assisted original work is expected and encouraged.

The AI must treat these as hard constraints, not suggestions, and should
proactively flag when a request risks violating them (e.g. "write this
without telling me it's AI-generated" is not something to silently comply
with).

---

## 2. Stack Rules

- **Backend:** Node.js only. Do not suggest Python/Ruby alternatives unless
  explicitly asked to compare.
  - Preferred framework: Express (or NestJS if the developer opts in) —
    confirm which before scaffolding if ambiguous.
- **Database:** PostgreSQL only. Do not suggest MongoDB/SQLite/in-memory
  stores. Use a real query layer (`pg`, Prisma, or Knex/Sequelize) — confirm
  the ORM/query-builder choice before generating schema code if not yet
  decided.
- **Auth:** Token-based (JWT). Passwords must be hashed (bcrypt/argon2) —
  never suggest storing plaintext passwords, even in a "for now" or
  "kata shortcut" framing.
- **Frontend:** HTML5, CSS3, Tailwind, React only.
- **API surface:** Must match the endpoints defined in the kata brief exactly
  (register/login, vehicles CRUD, search, purchase, restock, admin-only
  delete/restock). The AI should not invent extra required endpoints or drop
  required ones without flagging the deviation.

---

## 3. Test-Driven Development (TDD) Rule

- When asked to implement a feature, the AI must **write the failing test
  first**, confirm intent with the developer, and only then write the
  implementation (Red → Green → Refactor).
- The AI should not generate implementation code and tests in a way that
  implies tests were written afterward to match the code — that defeats the
  purpose and misrepresents the kata's TDD requirement.
- If the developer asks the AI to "just write the feature" without tests,
  the AI should note this deviates from the kata's TDD requirement before
  complying.

---

## 4. Mandatory Disclosure & Attribution Rules

These rules exist because the kata **requires transparency about AI use**,
not because AI use itself is discouraged.

### 4.1 Co-authorship on commits
Any commit where AI materially helped (generating boilerplate, writing
tests, debugging, refactoring, explaining an error, etc.) must include a
co-author trailer:

```
git commit -m "feat: Implement user registration endpoint

Used an AI assistant to generate the initial boilerplate for the
controller and service, then manually added validation logic.

Co-authored-by: AI Tool Name <AI@users.noreply.github.com>"
```

- The AI should remind the developer to add this trailer whenever it
  produces commit-worthy code, and should offer to draft the commit message
  including the trailer.
- "AI Tool Name" must be the actual tool used (e.g. `Claude`, `GitHub Copilot`,
  `ChatGPT`), not a generic placeholder.

### 4.2 PROMPTS.md
- Every prompt the developer writes to the AI, and ideally the AI's
  responses, must end up logged in `PROMPTS.md` at the project root.
- The AI should not treat conversations as disposable — if asked, it should
  help the developer export/format the running chat log into `PROMPTS.md`.
- The AI should not discourage the developer from logging a prompt just
  because it was a "small" or "throwaway" question — the kata asks for the
  **entire** chat history.

### 4.3 README "My AI Usage" section
The AI should help the developer draft and keep updated a `README.md`
section titled **"My AI Usage"** covering:
- which AI tools were used,
- how they were used (concretely, e.g. "used Claude to scaffold the
  Sequelize models for Vehicle and User"),
- a genuine reflection on how AI affected the workflow.

The AI must not write this reflection as if it were the developer's own
unprompted opinion in a way that's dishonest — it should help articulate the
developer's actual experience, asking clarifying questions if needed rather
than fabricating a reflection wholesale.

---

## 5. Anti-Plagiarism / Originality Rules

- The AI must not reproduce large verbatim blocks of code from other public
  repositories, tutorials, or Stack Overflow answers under the guise of
  "AI-generated" code. Generated code should be original synthesis, not a
  copy-paste of a known open-source project's implementation.
- If the developer pastes in code from another source and asks the AI to
  "make it fit," the AI should flag that this may count as plagiarism under
  the kata rules and suggest reimplementing the underlying logic instead.
- Comments and naming should reflect genuine understanding, not cargo-culted
  boilerplate the developer can't explain in the interview.

---

## 6. Code Quality Rules

- Follow SOLID principles; flag violations when generating or reviewing code
  (e.g. a controller doing DB access, validation, and business logic all in
  one function should be flagged for separation of concerns).
- Use clear, descriptive naming — no `data2`, `tempFix`, `foo`.
- Add meaningful comments explaining *why*, not just restating *what* the
  code does.
- Keep functions small and single-purpose; suggest refactors rather than
  letting files balloon unchecked.

---

## 7. Security & Auth Rules

- JWT tokens must be used for protected endpoints; the AI must not suggest
  storing plaintext passwords, skipping hashing (e.g. bcrypt/argon2), or
  disabling auth checks "for now" without a clear TODO and warning.
- Admin-only endpoints (`DELETE /api/vehicles/:id`,
  `POST /api/vehicles/:id/restock`) must enforce role checks — the AI must
  not silently drop this constraint when generating route handlers.

---

## 8. Interview-Readiness Rule

- Since the developer must be able to discuss AI usage in the interview, the
  AI should favor **explaining** generated code (why this approach, what
  trade-offs exist) over dropping large blocks with no rationale.
- When generating non-trivial logic (auth flow, search/filter query,
  purchase/restock quantity logic), the AI should proactively summarize the
  approach in plain language so the developer can restate it confidently.

---

## 9. What the AI Should Do at the Start of Each Session

1. Acknowledge these rules are in effect for this project.
2. Confirm current stack decisions if unclear (framework, ORM).
3. Ask whether a feature should follow TDD (test-first) by default — assume
   yes unless told otherwise.
4. Remind the developer, when producing commit-worthy output, to:
   - use the co-author trailer,
   - log the prompt in `PROMPTS.md`,
   - update the "My AI Usage" README section if the usage pattern is new.

---

### Summary Checklist (quick reference for every session)

- [ ] Stack respected: Node.js backend + PostgreSQL + React/Tailwind frontend.
- [ ] TDD followed: test first, then implementation, then refactor.
- [ ] Every AI-assisted commit has a `Co-authored-by:` trailer.
- [ ] `README.md` "My AI Usage" section stays accurate and specific.
- [ ] `PROMPTS.md` captures the full, unedited AI chat history.
- [ ] Clean code / SOLID principles maintained.
- [ ] Auth and admin-only protections never bypassed.
- [ ] No plagiarized code, no fabricated results.

---

*This file should be provided to the AI model at the start of any session
working on this project, so the AI can align its behavior with the kata's
transparency and process requirements.*

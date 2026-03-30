# Restful-Booker API Tests

An automated API testing suite for the [Restful-Booker](https://restful-booker.herokuapp.com) API, built with Node.js, TypeScript, and Playwright Test.

## Tech Stack

- **[Playwright Test](https://playwright.dev/docs/api-testing)** — test runner and API client (`APIRequestContext`)
- **TypeScript** — strict typing throughout
- **[@faker-js/faker](https://fakerjs.dev/)** — dynamic test data generation
- **dotenv** — environment variable management
- **GitHub Actions** — CI/CD pipeline

## Project Structure

```
restful-booker-api-tests/
├── tests/
│   └── api/
│       ├── auth.spec.ts          # Health check & token generation
│       ├── booking.spec.ts       # CRUD operations (POST, GET, PUT, PATCH, DELETE)
│       ├── filter.spec.ts        # Query parameter filtering
│       ├── validation.spec.ts    # Negative/edge case validation
│       └── utils/
│           ├── auth.ts           # Token generation helper
│           └── dataFactory.ts    # Typed booking payload factory
├── playwright.config.ts
├── package.json
└── .github/
    └── workflows/
        └── playwright.yml        # CI pipeline
```

## Test Coverage

| File | Endpoints Covered |
|------|-------------------|
| `auth.spec.ts` | `GET /ping`, `POST /auth` |
| `booking.spec.ts` | `POST /booking`, `GET /booking/{id}`, `PUT /booking/{id}`, `PATCH /booking/{id}`, `DELETE /booking/{id}` |
| `filter.spec.ts` | `GET /booking?firstname=` |
| `validation.spec.ts` | `POST /booking` — missing fields, invalid types, inverted dates |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
npx playwright install chromium
```

### Environment Variables

Create a `.env` file in the project root:

```env
API_USERNAME=admin
API_PASSWORD=password123
```

### Running Tests

```bash
# Run all tests
npm test

# Run a specific suite
npm run test:auth
npm run test:booking
npm run test:filter
npm run test:validation

# Open the HTML report
npm run test:report
```

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions. The HTML report is uploaded as an artifact (`api-test-report`) and retained for 14 days.

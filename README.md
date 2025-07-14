# GPT03-TEST

This repository contains an example Node.js and TypeScript application with Express and GraphQL.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx ts-node src/server/index.ts
   ```
   The API will be available at `http://localhost:3000`.

### Onboarding a Tenant

A helper script is provided to create a tenant and generate credentials:

```bash
npx ts-node src/bin/onboardTenant.ts --name <TENANT_NAME>
```

This updates `data/tenants.json` and prints the login URL for the tenant.

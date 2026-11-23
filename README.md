# RosterFlow

RosterFlow is a workforce roster management demo built with React, TypeScript, Vite, and Tailwind CSS. It includes role-based admin, pod lead, and employee views, sample roster data, and light/dark themes.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm ci
npm run dev
```

Vite prints the local development URL after startup.

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Demo access

Use the demo role buttons on the sign-in page to open the Admin, Pod Lead, or Employee workspace. This project uses sample data and browser `localStorage`; it does not connect to a backend or provide production authentication.

## Deploy to Vercel

Import the GitHub repository into Vercel and use:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

No environment variables are currently required, so an `.env.example` file is not applicable.

## How I Think

1. **Data model and relationships:** Employees, pods, brands, and processes have stable IDs. Employees reference a pod and arrays of certified brand/process IDs; pods point to a lead employee; processes belong to a brand. A roster cell links one employee and date to a shift, with optional brand and process IDs.
2. **Roster generation and constraints:** The demo generator creates a monthly schedule by rotating shifts, honoring seeded approved leave and fixed weekly-off days, and assigning each employee's first certified brand and process. It locks earlier dates. The brand coverage view compares scheduled headcount with each brand's minimum. This is a deterministic sample generator, not a constraint solver; the current validation action reloads seeded conflict examples rather than evaluating every rule against the generated roster.
3. **Single- and multi-resource brands:** A brand's `resourceModel` distinguishes the two models, and single-resource brands can name a `dedicatedEmployeeId`. Multi-resource coverage is represented by the brand's minimum daily headcount and the employees assigned to it. The current coverage view counts assigned staff; enforcing dedicated coverage for every single-resource case is a known limitation.
4. **Unavailable single-resource owner:** Approving leave marks the employee's roster cells as leave. If they are the dedicated employee for a 365-day brand, the app adds a critical coverage-gap alert and suggests a peer. This explicit automatic alert does not yet cover every operating schedule or every process-level requirement.
5. **Conflicts and insufficient staffing:** The UI presents alerts by severity and supports manual resolution or backup assignment. The sudden-leave demo suggests the first same-pod employee who is off or on a general shift; when none is available, it calls for cross-pod reinforcement. The demo does not guarantee that all conflicts can be resolved.
6. **Automation and human control:** Monthly sample generation, leave-to-roster updates, and example alerts are automated. People retain control over leave approvals, manual roster edits, and conflict/backup decisions, since coverage trade-offs need operational review. The data is demo-only and stored in the browser.
7. **Scaling to twice the team and brands:** I would move state from browser storage to a backend database and API, add indexes and role-aware access, and replace the sample generator with a tested constraint-based scheduler that can handle larger assignment sets and explain infeasible requirements.
8. **One more week:** I would first implement real validation against the generated roster—with tests for availability, working days, certifications, minimum staffing, dedicated coverage, and rest rules—then connect the findings to actionable conflict suggestions. This closes the most important gap between the demo's planning UI and a dependable roster.

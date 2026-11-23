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

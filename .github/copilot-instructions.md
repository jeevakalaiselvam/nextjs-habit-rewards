# Copilot instructions — nextjs-habit-rewards

Summary

- This repository is a Next.js v15 app for tracking game achievements (UI + serverless API routes). Frontend lives in `components/` and `pages/`; server endpoints live under `pages/api/` and use `lib/db.js` to access MongoDB.

Run & build

- Development: `npm run dev` (local). Alternate dev host/port: `npm run dev1` (binds 0.0.0.0:3001).
- Build: `npm run build` then `npm start`.
- Requirement: Node >= 18 and a MongoDB URI set in `.env.local` as `MONGODB_URI` (see `lib/db.js` — it throws when missing).

Big picture & architecture

- Next.js pages provide both UI and API routes. Files under `pages/api/*` run server-side (Node). Example API routes: `pages/api/jeevaachievement/[id].js`, `pages/api/steam/index.js`, `pages/api/platinum/update.js`, `pages/api/hidden/[gameId]/index.js`.
- Database: `lib/db.js` exports a cached `MongoClient` promise. Important: keep the connection pattern intact (global caching in development) to avoid connection storms.
- State: Redux with `redux-persist` (persisted to localStorage) is configured in `store/store.js`. The app injects the store in `_app.jsx` and wraps UI in `PersistGate`.
- Drag-and-drop: `react-dnd` + `react-dnd-html5-backend` are used; DnD provider is in `_app.jsx`.

Project-specific conventions

- Styling: `styled-components` is used extensively — components export styled primitives at the bottom of each component file (see `components/GAMES_MAIN.jsx`).
- Helpers: reusable logic lives in `helpers/` (e.g., `trophyHelper.js`, `dateHelper.js`, `gameHelper.js`). Prefer calling these helpers rather than reimplementing logic.
- Component props: many components expect a `game` object shape. Common fields: `cover`, `achievements` (array of objects with `achieved` (0|1), `color` (string like "Gold"), `percentage` (number)). See `components/GAMES_MAIN.jsx` for a concrete example of reading these properties.
- File naming: React components use `.jsx` and are default-exported. Keep that when adding components.

Data flows & integration points

- UI -> API: user actions trigger UI handlers that call `pages/api/*` endpoints (serverless). Inspect `pages/api/*` for existing endpoint signatures before adding similar endpoints.
- External deps: `mongodb`, `googleapis`, `axios`, `cheerio` and several UI libraries (`antd`, `@mui`, `recharts`). Be mindful of bundle size when importing UI libraries into client components.

Editing APIs and DB access

- Use `lib/db.js` for Mongo connections. Do not instantiate raw MongoClients in API handlers. Keep the global caching pattern.
- API routes are standard Next.js serverless functions — they can access process.env. Tests and local runs require `MONGODB_URI` in `.env.local`.

Debugging & developer tips

- To reproduce API errors, run `npm run dev` and check terminal logs. API routes appear under `pages/api` and will log to console when hitting endpoints.
- Redux persisted state can hide bugs — clear localStorage or temporarily disable `redux-persist` when investigating state issues.

When to ask for human review

- Significant schema changes (achievement shape, DB collections) — coordinate before changing.
- Any change to `lib/db.js` connection logic or global cache.

Reference files (quick lookup)

- App bootstrap: `pages/_app.jsx`
- DB connection: `lib/db.js`
- Redux store: `store/store.js`
- Example UI: `components/GAMES_MAIN.jsx`
- API routes: `pages/api/*` (inspect files like `pages/api/platinum/update.js` and `pages/api/hidden/[gameId]/index.js`)

If you need more details, ask for which area to expand (API shapes, key helper functions, or common component props).

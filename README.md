<div align="center">

# 🛍️ NovaMart

**A fast, modern e-commerce storefront built with React, Redux Toolkit & TypeScript.**

Browse a live product catalog, search and filter in real time, manage a persistent
cart, and sign in — all in a snappy single-page app.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

</div>

---

## Features

- 🛒 **Persistent cart** — add, remove, and change quantities; the cart survives page reloads.
- 🔎 **Real-time search & category filtering** with debounced input.
- 📄 **Product detail pages** with pricing, discounts, ratings, and stock.
- 🔐 **Authentication** — JWT-based sign-in with proper loading and error states.
- 📑 **Paginated catalog** for browsing the full product range.
- 📱 **Responsive UI** that works from mobile to desktop.
- ⚡ **Fast by design** — code splitting, caching, and memoization throughout.

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | **React 19** + **TypeScript 5** |
| State | **Redux Toolkit 2** — slices, async thunks, memoized selectors |
| Data fetching | **RTK Query** — caching, request de-duplication, auto-generated hooks |
| Routing | **React Router 7** with lazy-loaded routes |
| Tooling | **Vite 6** dev server & bundler |
| API | [DummyJSON](https://dummyjson.com) |

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server → http://localhost:5173
npm run dev
```

Production build:

```bash
npm run build      # type-checks, then bundles for production
npm run preview    # serve the production build locally
```

### Demo login

```
username: emilys
password: emilyspass
```

---

## Architecture

State is split by ownership, so each concern uses the right tool:

- **Server data** (products, categories, a single product) is owned by **RTK Query**.
  It handles caching, loading/error state, and refetching, and exposes fully-typed
  hooks — components re-render only when the data they actually read changes.
- **Client state** (the shopping cart) lives in a **Redux slice** and is persisted to
  `localStorage`, with derived values (item count, order total) exposed through
  memoized selectors.
- **Authentication** uses an async thunk to model the sign-in lifecycle
  (`pending → fulfilled → rejected`) with clean loading and error handling.

The store's types are inferred from the store itself and consumed through pre-typed
hooks, so types stay in sync with the real state shape end to end.

```
src/
├── app/
│   ├── store.ts          # store config, typed RootState/AppDispatch, cart persistence
│   └── hooks.ts          # pre-typed useAppSelector / useAppDispatch
├── features/
│   ├── products/         # RTK Query API slice + types (server data)
│   ├── cart/             # cart slice + memoized selectors (client state)
│   └── auth/             # auth slice + async login thunk
├── components/           # Navbar, ProductCard
├── pages/                # lazy-loaded route pages
└── hooks/                # useDebouncedValue
```

---

## Performance

NovaMart is built to stay fast as the catalog grows:

| Technique | Impact |
|---|---|
| Route-level code splitting (`lazy` + `Suspense`) | Smaller initial bundle — each page loads on demand |
| Vendor chunk splitting | React/Redux stay cached across deploys |
| `memo` + stable `useCallback` | Product cards skip re-renders when unrelated state changes |
| Memoized selectors (`createSelector`) | Cart totals recompute only when the cart changes |
| Debounced search | One request per pause, not per keystroke |
| RTK Query caching | Repeat requests are served from cache |
| Lazy-loaded images | Off-screen product images defer their download |

---

## Roadmap

- [ ] Wishlist / favorites
- [ ] Optimistic cart updates with rollback
- [ ] Order history and checkout flow
- [ ] Product reviews and ratings submission

---

## License

MIT

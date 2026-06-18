# PETIT MONDE — Storefront (React + Vite)

A premium children's-fashion storefront built with **React 18, Vite, Tailwind CSS,
Framer Motion and React Router**. It talks to the Laravel API in `../backend` and
gracefully falls back to a bundled catalog when the API is offline, so it always
renders.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build
```

> If `npm install` warns about a blocked `esbuild` install script, run
> `npm approve-scripts esbuild` once, then `npm install` again.

## Configuration

Copy `.env.example` to `.env` to point at a different API:

```
VITE_API_URL=http://localhost:8000/api
```

## What's inside

| Area | Highlights |
| --- | --- |
| **Home** | Animated hero, brand marquee, category edit, new arrivals, editorial split, bestsellers, testimonials, newsletter |
| **Shop** | Filter by category / type / season / colour / price, live search, sorting, mobile filter drawer |
| **Product** | Image gallery, colour & size variant selection, live stock + size guide, related products |
| **Cart** | Slide-out drawer + full cart page, free-shipping progress, promo codes |
| **Checkout** | Multi-step flow (contact → shipping → payment) with order confirmation |
| **Account** | Login / signup (wired to Sanctum), order history, wishlist |

State (cart, wishlist, auth) is persisted to `localStorage` via React context.

## Project structure

```
src/
  components/   reusable UI (Navbar, Footer, CartDrawer, ProductCard, …)
  context/      Cart, Wishlist, Auth, Toast providers
  data/         bundled fallback catalog (mirrors the backend seeders)
  hooks/        useProducts / useProduct data hooks
  lib/          axios API client + utilities
  pages/        route screens
```

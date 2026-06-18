# PETIT MONDE — Children's Fashion E-Commerce

A full-stack children's-fashion store: a **Laravel 12 API** (`/backend`) and a
**React 18 + Vite storefront** (`/frontend`). Beautifully designed, fully
functional, and runnable end-to-end on a clean machine.

![storefront](https://images.unsplash.com/photo-1695263747144-a52aa3739d62?auto=format&fit=crop&w=1200&q=80)

---

## Stack

| Layer | Tech |
| --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| **Backend** | Laravel 12, Sanctum (token auth), spatie/permission (roles), SQLite (zero-config), Eloquent |
| **Domain** | Products · variants · categories · **branches** · **employees** · **orders** · **roles** · sales analytics |

The storefront calls the API and **falls back to a bundled catalog** if the API
is offline — so the UI always renders, with or without the backend.

---

## Run it

### 1. Backend (API) — http://localhost:8000

```bash
cd backend
composer install
cp .env.example .env          # ready-to-go SQLite config
php artisan key:generate
touch database/database.sqlite # create the empty SQLite file (Windows: New-Item database/database.sqlite)
php artisan migrate --seed    # seeds roles, 4 categories, 16 products, 248 variants,
                              # 4 branches, staff, 12 customers + 140 orders
php artisan serve
```

The included `.env` uses SQLite (`database/database.sqlite`) so no database server
is required. Demo accounts (all password `password`):

```
admin     test@example.com          → full analytics dashboard
employee  joao.costa@petitmonde.com → sales staff (Lisbon branch)
customer  amira.khan@example.com    → a regular shopper
```

### 2. Frontend (storefront) — http://localhost:3000

```bash
cd frontend
npm install
npm run dev
```

---

## API overview

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | — | Register, returns Sanctum token |
| `POST` | `/auth/login` | — | Log in, returns Sanctum token |
| `POST` | `/auth/logout` | token | Revoke current token |
| `GET` | `/product` | — | List products (with category + variants) |
| `GET` | `/product/{slug}` | — | Single product by slug |
| `GET` | `/category` | — | List categories with product counts |
| `GET` | `/branch`, `/branch/{slug}` | — | Branches with their employees |
| `GET` | `/orders` | token | The signed-in customer's orders |
| `POST` | `/orders` | token | Place an order (used by checkout) |
| `GET` | `/analytics/dashboard` | admin/manager | Full dashboard payload |
| `GET` | `/analytics/top-customers` | admin/manager | Best customers by spend |
| `GET` | `/analytics/employee-sales` | admin/manager | Sales per employee |
| `POST/PUT/DELETE` | `/product`, `/category`, `/branch` | token | Admin writes |

All responses use a consistent envelope:

```json
{ "success": true, "message": "data fetched successfully", "data": { ... } }
```

### Roles & analytics

Roles are managed with **spatie/laravel-permission**: `admin`, `manager`,
`employee`, `customer`. Each **branch** has a manager + sales associates
(`users.branch_id`), and every **order** records its customer, the employee who
closed the sale, and the branch. The analytics endpoints aggregate this into:

- **Best customers** — ranked by lifetime spend, with order counts
- **Employee sales** — how much each employee sold, grouped by branch
- **Branch performance** — revenue & orders per branch
- Revenue-by-month and recent-order feeds

Visualised in the **Admin Dashboard** (`/dashboard` in the storefront — sign in as
the admin account). Analytics routes return `403` for non-staff roles.

---

## Project layout

```
backend/    Laravel API — controllers, services, resources, requests, seeders
frontend/   React storefront — pages, components, contexts, hooks
```

See each folder's `README.md` for details.

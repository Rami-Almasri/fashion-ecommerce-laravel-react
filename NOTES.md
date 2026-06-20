# Project Notes — Petit Monde

Quick status notes for this repo. (Full setup lives in [`README.md`](README.md).)

## Status — 2026-06-20

Everything is committed and pushed to `origin/feat/storefront-and-analytics`.
Nothing was lost. The full stack runs end-to-end and the database seeder
populates the store with realistic demo data.

## Database seeder

Run from the `backend/` folder:

```bash
php artisan migrate:fresh --seed --force
```

This wipes and rebuilds the SQLite database, then fills every table with demo
data. Verified output (2026-06-20):

| Table        | Rows |
| ------------ | ---- |
| Categories   | 4    |
| Products     | 16   |
| Variants     | 248  |
| Branches     | 4    |
| Users        | 26   |
| Orders       | 140  |
| Order items  | 330  |

Seed order (see `backend/database/seeders/DatabaseSeeder.php`):
`RoleSeeder → CategorySeeder → ProductSeeder → BranchSeeder → StaffSeeder → OrderSeeder`,
then the admin account is created.

The order data is **deterministic** (`mt_srand(42)`), so analytics numbers stay
stable between re-seeds. Seeders use `updateOrCreate`/`firstOrCreate`, so
re-running them is safe and won't create duplicates.

## Demo logins (password: `password`)

| Role     | Email                       | Sees                       |
| -------- | --------------------------- | -------------------------- |
| admin    | `test@example.com`          | Full analytics dashboard   |
| employee | `joao.costa@petitmonde.com` | Sales staff (Lisbon)       |
| customer | `amira.khan@example.com`    | A regular shopper          |

## Notes

- `backend/database/database.sqlite` is **local only** (not in git). Run the
  seeder after cloning to get data.
- `SizeGuideSeeder` / `ProductVariantSeeder` are intentionally empty stubs —
  product variants are created inside `ProductSeeder`, and the `size_guides`
  table isn't exposed by the API.

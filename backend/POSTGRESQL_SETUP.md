# RideOps PostgreSQL setup

RideOps no longer uses `backend/data/rideops-db.json`. Application data is stored in PostgreSQL.

## 1. Create database

Using pgAdmin: create a database named `rideops`.

Or in psql:

```sql
CREATE DATABASE rideops;
```

PostGIS is recommended for spatial indexing. The application also works without PostGIS by retaining latitude/longitude columns.

## 2. Configure backend

Edit `backend/.env`:

`DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/rideops`

If PostgreSQL uses a different host/port/user, change the URL accordingly.

## 3. Install and run

```bash
cd backend
npm install
npm run build
npm start
```

On first startup the API creates the PostgreSQL tables and seeds demo users, employees, drivers, vehicles, vendors, shifts, routes and demo trips if the `users` table is empty.

## 4. Start frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend remains compatible with the existing `/api/*` endpoints.

## Demo accounts

- Super Admin: `superadmin@rideops.local` / `admin123`
- Transport Admin: `admin@rideops.local` / `admin123`
- Dispatcher: `dispatcher@rideops.local` / `admin123`
- Driver: `suresh@example.com` / `admin123`
- Driver: `prakash@example.com` / `admin123`
- Employee: `employee@rideops.local` / `admin123`
- Employee: `neha@example.com` / `admin123`

## Data architecture

`users -> employees/drivers -> trips -> trip_events/gps_logs`

Fleet, vendors, shifts, service routes, safety alerts, notifications and audit logs are also PostgreSQL tables.

GPS pings are inserted into `gps_logs`; the latest driver coordinates are also updated in `drivers`. The live-tracking endpoint uses PostgreSQL `LATERAL` queries to return the newest GPS point per active trip.

For production, replace the demo plaintext password storage with bcrypt/Argon2 password hashes and use a managed PostgreSQL instance with SSL, backups and restricted credentials.

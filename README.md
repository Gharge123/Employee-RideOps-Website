# RideOps Enterprise Mobility Platform — PostgreSQL Edition

This version uses **PostgreSQL as the application database**. The previous JSON persistence layer has been removed. RideOps keeps operational data in relational PostgreSQL tables and stores GPS telemetry in `gps_logs`.

## Main functionality
- Role-based login: Super Admin, Transport Admin, Dispatcher, Driver, Employee
- Employee cab request workflow
- Transport-admin driver assignment
- Employee-specific driver visibility
- Driver workflow: accept → OTP verify → start → pickup → drop → complete
- Live browser/device GPS publishing during trips
- Live command-centre tracking with latest GPS per active trip
- Google Maps proxy endpoints: geocoding, Places, address validation, Routes and route matrix
- Employee and driver Excel import/export
- Fleet / vehicle management
- Vendor management
- Shift management
- Service routes and stops
- Safety/SOS alert centre
- Notifications and audit trail
- Mobility analytics / reports
- Responsive enterprise dashboard for mobile, tablet and desktop

## PostgreSQL architecture

`users → employees / drivers → trips → trip_events / gps_logs`

Additional tables:
- `vehicles`
- `vendors`
- `shifts`
- `service_routes`
- `safety_alerts`
- `notifications`
- `audit_logs`

There is **no `backend/data/rideops-db.json` runtime database** in this edition.

## 1. Install PostgreSQL

Install PostgreSQL 14+ and optionally enable PostGIS if you want spatial database functions/indexes.

Create the database in pgAdmin or psql:

```sql
CREATE DATABASE rideops;
```

## 2. Configure PostgreSQL connection

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/rideops
DATABASE_SSL=false
DB_POOL_SIZE=20
```

If your PostgreSQL server uses another host, port, username or database name, update the connection string.

## 3. Install backend dependencies

```bash
cd backend
npm install
```

The backend now includes the official Node PostgreSQL driver (`pg`).

## 4. Start backend

Development:

```bash
npm run dev
```

Production-style:

```bash
npm run build
npm start
```

On first startup the API:
1. Connects to PostgreSQL.
2. Creates/updates the tables from `database/schema.sql`.
3. Seeds the existing demo/application records from `database/seed.sql` only when the PostgreSQL `users` table is empty.

After startup, new employees, drivers, rides, assignments, GPS points, alerts and other records are written to PostgreSQL.

## 5. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo accounts

- Super Admin: `superadmin@rideops.local` / `admin123`
- Transport Admin: `admin@rideops.local` / `admin123`
- Dispatcher: `dispatcher@rideops.local` / `admin123`
- Driver: `suresh@example.com` / `admin123`
- Driver: `prakash@example.com` / `admin123`
- Employee: `employee@rideops.local` / `admin123`
- Employee: `neha@example.com` / `admin123`

## GPS tracking

Driver GPS is posted to:

`POST /api/trips/:tripId/gps`

Each ping is stored in PostgreSQL in `gps_logs`, including:
- latitude / longitude
- accuracy
- speed
- bearing
- altitude
- battery level when supplied
- network/provider metadata
- device time and server time
- sequence number
- distance from the previous point

The latest driver coordinate is also stored in `drivers.current_lat`, `drivers.current_lng` and `drivers.last_seen_at`.

`GET /api/live-tracking` returns active assigned/in-progress trips with their newest GPS point. The existing dashboard polls this endpoint for the live command centre.

For continuous production tracking while a phone is locked/backgrounded, use a native driver app or vehicle GPS/telematics device. Browser geolocation is permission-based and may pause in the background.

## Google Maps

Configure:

```env
GOOGLE_MAPS_SERVER_API_KEY=YOUR_SERVER_KEY
GOOGLE_MAPS_BROWSER_API_KEY=YOUR_BROWSER_KEY
GOOGLE_MAPS_MAP_ID=YOUR_MAP_ID
```

Restrict the browser key by website referrer and never expose the server key to the frontend.

## Database files

- `database/schema.sql` — PostgreSQL schema and indexes
- `database/seed.sql` — one-time demo/application seed data migrated from the previous project data
- `backend/POSTGRESQL_SETUP.md` — quick PostgreSQL setup guide

The JSON runtime database has intentionally been removed.

## Security note

The demo accounts use simple demo passwords so the project remains easy to run locally. Before production deployment, replace demo password handling with bcrypt/Argon2 hashes, HTTPS, secure secrets, PostgreSQL SSL, least-privilege DB credentials, backups and appropriate audit/security controls.

-- RideOps PostgreSQL schema. Requires PostgreSQL 14+.
-- PostGIS is optional: the app will use geography columns when PostGIS is available.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS postgis; EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN','TRANSPORT_ADMIN','DISPATCHER','DRIVER','EMPLOYEE')),
 name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS employees (
 id TEXT PRIMARY KEY, user_id TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
 employee_code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
 phone TEXT NOT NULL, department TEXT, gender TEXT, pickup_address TEXT, drop_address TEXT,
 status TEXT NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS drivers (
 id TEXT PRIMARY KEY, user_id TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
 driver_code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
 phone TEXT NOT NULL, license_no TEXT NOT NULL, vehicle_no TEXT UNIQUE NOT NULL,
 vehicle_type TEXT, status TEXT NOT NULL DEFAULT 'AVAILABLE',
 current_lat DOUBLE PRECISION, current_lng DOUBLE PRECISION, last_seen_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS vehicles (
 id TEXT PRIMARY KEY, vehicle_no TEXT UNIQUE NOT NULL, vehicle_type TEXT NOT NULL,
 capacity INT DEFAULT 4, status TEXT DEFAULT 'AVAILABLE', driver_id TEXT REFERENCES drivers(id) ON DELETE SET NULL,
 make TEXT, model TEXT, fuel_type TEXT, insurance_expiry DATE, fitness_expiry DATE
);
CREATE TABLE IF NOT EXISTS vendors (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT, email TEXT,
 vehicle_count INT DEFAULT 0, status TEXT DEFAULT 'ACTIVE', sla TEXT
);
CREATE TABLE IF NOT EXISTS shifts (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, start_time TIME NOT NULL,
 end_time TIME NOT NULL, employee_count INT DEFAULT 0, status TEXT DEFAULT 'ACTIVE'
);
-- service_routes avoids collision with the operational daily routes table concept.
CREATE TABLE IF NOT EXISTS service_routes (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, direction TEXT,
 stops JSONB NOT NULL DEFAULT '[]'::jsonb, distance_km NUMERIC(10,2) DEFAULT 0,
 estimated_min INT DEFAULT 0, status TEXT DEFAULT 'ACTIVE'
);
CREATE TABLE IF NOT EXISTS trips (
 id TEXT PRIMARY KEY, employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
 driver_id TEXT REFERENCES drivers(id) ON DELETE SET NULL,
 pickup_address TEXT NOT NULL, drop_address TEXT NOT NULL, scheduled_at TIMESTAMPTZ,
 status TEXT NOT NULL DEFAULT 'REQUESTED', trip_type TEXT DEFAULT 'HOME_TO_OFFICE',
 passengers INT DEFAULT 1, note TEXT, otp TEXT, otp_verified_at TIMESTAMPTZ,
 driver_accepted_at TIMESTAMPTZ, employee_confirmed_at TIMESTAMPTZ, started_at TIMESTAMPTZ,
 completed_at TIMESTAMPTZ, picked_up_at TIMESTAMPTZ, dropped_at TIMESTAMPTZ,
 route_order INT, route_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gps_logs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
 route_id TEXT, driver_id TEXT REFERENCES drivers(id) ON DELETE SET NULL,
 employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
 lat DOUBLE PRECISION NOT NULL, lng DOUBLE PRECISION NOT NULL, accuracy DOUBLE PRECISION,
 speed DOUBLE PRECISION, bearing DOUBLE PRECISION, altitude DOUBLE PRECISION,
 battery_level DOUBLE PRECISION, network_type TEXT, provider TEXT, device_time TIMESTAMPTZ,
 server_time TIMESTAMPTZ NOT NULL DEFAULT now(), event TEXT NOT NULL DEFAULT 'GPS_PING',
 sequence_no BIGINT, distance_from_previous_meters DOUBLE PRECISION
);
-- Add a spatial point only when PostGIS is installed.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_extension WHERE extname='postgis') THEN
   EXECUTE 'ALTER TABLE gps_logs ADD COLUMN IF NOT EXISTS position geography(Point,4326)';
   EXECUTE 'ALTER TABLE drivers ADD COLUMN IF NOT EXISTS current_point geography(Point,4326)';
 END IF;
END $$;
CREATE TABLE IF NOT EXISTS trip_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
 event_type TEXT NOT NULL, route_order INT, gps_log_id UUID REFERENCES gps_logs(id) ON DELETE SET NULL,
 occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(), note TEXT
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
 action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT NOT NULL, details JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS safety_alerts (
 id TEXT PRIMARY KEY, type TEXT, severity TEXT, trip_id TEXT REFERENCES trips(id) ON DELETE SET NULL,
 employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL, driver_id TEXT REFERENCES drivers(id) ON DELETE SET NULL,
 message TEXT, status TEXT DEFAULT 'OPEN', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), resolved_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS notifications (
 id TEXT PRIMARY KEY, type TEXT, message TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), read BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS gps_logs_trip_time_idx ON gps_logs(trip_id,server_time DESC);
CREATE INDEX IF NOT EXISTS gps_logs_driver_time_idx ON gps_logs(driver_id,server_time DESC);
CREATE INDEX IF NOT EXISTS trips_employee_idx ON trips(employee_id,created_at DESC);
CREATE INDEX IF NOT EXISTS trips_driver_idx ON trips(driver_id,created_at DESC);
CREATE INDEX IF NOT EXISTS trip_events_trip_idx ON trip_events(trip_id,occurred_at);
CREATE INDEX IF NOT EXISTS safety_status_idx ON safety_alerts(status,created_at DESC);
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_extension WHERE extname='postgis') THEN
   EXECUTE 'CREATE INDEX IF NOT EXISTS gps_logs_position_gist ON gps_logs USING GIST(position)';
   EXECUTE 'CREATE INDEX IF NOT EXISTS drivers_current_point_gist ON drivers USING GIST(current_point)';
 END IF;
END $$;

create table if not exists public.crash_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  device_id text,
  device_name text not null,
  rider_name text,
  crash_time timestamptz not null,
  message text not null,
  g_force double precision not null default 0,
  accel_x double precision not null default 0,
  accel_y double precision not null default 0,
  accel_z double precision not null default 0,
  gyro_x double precision not null default 0,
  gyro_y double precision not null default 0,
  gyro_z double precision not null default 0,
  temperature double precision,
  gps_latitude double precision,
  gps_longitude double precision,
  gps_altitude double precision,
  emergency_contact1_name text,
  emergency_contact1_phone text,
  emergency_contact2_name text,
  emergency_contact2_phone text,
  created_at timestamptz not null default now()
);

create index if not exists crash_events_crash_time_idx
  on public.crash_events (crash_time desc);

create index if not exists crash_events_user_id_idx
  on public.crash_events (user_id);

alter table public.crash_events enable row level security;

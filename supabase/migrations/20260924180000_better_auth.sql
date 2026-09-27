alter table public.members
  add column if not exists email_verified boolean not null default false;

create table if not exists public.account (
  id text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" uuid not null references public.members(id) on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("providerId", "accountId")
);

create table if not exists public.session (
  id text primary key,
  "expiresAt" timestamptz not null,
  token text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" uuid not null references public.members(id) on delete cascade
);

create table if not exists public.verification (
  id text primary key,
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists account_user_id_idx on public.account ("userId");
create index if not exists session_user_id_idx on public.session ("userId");
create index if not exists verification_identifier_idx on public.verification (identifier);

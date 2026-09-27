alter table public.projects
  add column if not exists documents jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('project-documents', 'project-documents', true)
on conflict (id) do update set public = excluded.public;
-- Eletrodux | Esquema seguro para Supabase / PostgreSQL

-- 1. Extensão para criptografia e UUIDs
create extension if not exists pgcrypto;

-- 2. Criar o tipo ENUM com segurança (evita erro se já existir)
do $$ 
begin
    if not exists (select 1 from pg_type typ join pg_namespace nsp on nsp.oid = typ.typnamespace where nsp.nspname = 'public' and typ.typname = 'app_role') then
        create type public.app_role as enum ('tecnico', 'facilitador');
    end if;
end $$;

-- 3. Tabela de Perfis (ligada ao Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  role public.app_role not null default 'facilitador',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9._-]{3,40}$')
);

-- 4. Tabela de Máquinas
create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  machine_code text unique not null,
  name text not null,
  manufacturer text,
  model text,
  tonnage numeric(10,2),
  serial_number text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Tabela de Moldes
create table if not exists public.molds (
  id uuid primary key default gen_random_uuid(),
  mold_code text unique not null,
  part_code text,
  part_description text not null,
  mold_asset_number text,
  cavities integer check (cavities is null or cavities > 0),
  raw_material_code text,
  master_code text,
  master_percentage numeric(8,3),
  part_weight_kg numeric(10,4),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Fichas Técnicas (Revisão de máquina + molde)
create table if not exists public.technical_sheets (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines(id),
  mold_id uuid not null references public.molds(id),
  revision integer not null default 1 check (revision > 0),
  status text not null default 'rascunho' check (status in ('rascunho','em_aprovacao','aprovada','obsoleta')),
  cycle_time_seconds numeric(10,3),
  production_pieces_hour numeric(10,2),
  dosing_program text,
  injection_system text,
  extraction_system text,
  cushion numeric(10,3),
  general_notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(machine_id, mold_id, revision)
);

-- 7. Seções de Parâmetros
create table if not exists public.parameter_sections (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references public.technical_sheets(id) on delete cascade,
  section_code text not null,
  section_name text not null,
  sort_order integer not null default 0,
  notes text,
  unique(sheet_id, section_code)
);

-- 8. Parâmetros Detalhados
create table if not exists public.parameters (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.parameter_sections(id) on delete cascade,
  parameter_name text not null,
  stage_label text,
  position_index integer,
  value_text text,
  numeric_value numeric(14,4),
  unit text,
  tolerance_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Aprovações da Ficha
create table if not exists public.sheet_approvals (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references public.technical_sheets(id) on delete cascade,
  approval_stage integer not null check (approval_stage in (1,2)),
  approver_name text not null,
  approver_user_id uuid references public.profiles(id),
  approved_at timestamptz,
  comments text,
  unique(sheet_id, approval_stage)
);

-- 10. Anexos
create table if not exists public.sheet_attachments (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references public.technical_sheets(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  content_type text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- 11. Log de Auditoria
create table if not exists public.sheet_audit_log (
  id bigint generated always as identity primary key,
  sheet_id uuid references public.technical_sheets(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- 12. Funções auxiliares de permissão
create or replace function public.current_app_role()
returns public.app_role language sql stable security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() and active = true $$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer
set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and active = true) $$;

-- 13. Ativar RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.machines enable row level security;
alter table public.molds enable row level security;
alter table public.technical_sheets enable row level security;
alter table public.parameter_sections enable row level security;
alter table public.parameters enable row level security;
alter table public.sheet_approvals enable row level security;
alter table public.sheet_attachments enable row level security;
alter table public.sheet_audit_log enable row level security;

-- 14. Remoção de políticas antigas para evitar duplicidade antes de recriar
do $$ 
begin
    drop policy if exists "profile_read_self_or_technician" on public.profiles;
    drop policy if exists "technician_manage_profiles" on public.profiles;
    drop policy if exists "active_read_machines" on public.machines;
    drop policy if exists "technician_write_machines" on public.machines;
    drop policy if exists "active_read_molds" on public.molds;
    drop policy if exists "technician_write_molds" on public.molds;
    drop policy if exists "active_read_sheets" on public.technical_sheets;
    drop policy if exists "technician_write_sheets" on public.technical_sheets;
    drop policy if exists "active_read_sections" on public.parameter_sections;
    drop policy if exists "technician_write_sections" on public.parameter_sections;
    drop policy if exists "active_read_parameters" on public.parameters;
    drop policy if exists "technician_write_parameters" on public.parameters;
    drop policy if exists "active_read_approvals" on public.sheet_approvals;
    drop policy if exists "technician_write_approvals" on public.sheet_approvals;
    drop policy if exists "active_read_attachments" on public.sheet_attachments;
    drop policy if exists "technician_write_attachments" on public.sheet_attachments;
    drop policy if exists "technician_read_audit" on public.sheet_audit_log;
    drop policy if exists "system_insert_audit" on public.sheet_audit_log;
exception when undefined_object then 
    null;
end $$;

-- 15. Criação das Políticas de Segurança (RLS)
create policy "profile_read_self_or_technician" on public.profiles for select to authenticated
using (id = auth.uid() or public.current_app_role() = 'tecnico');

create policy "technician_manage_profiles" on public.profiles for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_machines" on public.machines for select to authenticated using (public.is_active_user());
create policy "technician_write_machines" on public.machines for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_molds" on public.molds for select to authenticated using (public.is_active_user());
create policy "technician_write_molds" on public.molds for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_sheets" on public.technical_sheets for select to authenticated using (public.is_active_user());
create policy "technician_write_sheets" on public.technical_sheets for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_sections" on public.parameter_sections for select to authenticated using (public.is_active_user());
create policy "technician_write_sections" on public.parameter_sections for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_parameters" on public.parameters for select to authenticated using (public.is_active_user());
create policy "technician_write_parameters" on public.parameters for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_approvals" on public.sheet_approvals for select to authenticated using (public.is_active_user());
create policy "technician_write_approvals" on public.sheet_approvals for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "active_read_attachments" on public.sheet_attachments for select to authenticated using (public.is_active_user());
create policy "technician_write_attachments" on public.sheet_attachments for all to authenticated
using (public.current_app_role() = 'tecnico') with check (public.current_app_role() = 'tecnico');

create policy "technician_read_audit" on public.sheet_audit_log for select to authenticated
using (public.current_app_role() = 'tecnico');

create policy "system_insert_audit" on public.sheet_audit_log for insert to authenticated
with check (actor_id = auth.uid());
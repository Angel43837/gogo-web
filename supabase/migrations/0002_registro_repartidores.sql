-- =============================================================================
-- GOGO — Registro de repartidores
--
-- Crea el bucket PRIVADO donde se guardan la identificación oficial y el
-- comprobante de domicilio.
--
-- CÓMO APLICARLO
--   Panel de Supabase -> SQL Editor -> pegar este archivo -> Run.
--
-- IMPORTANTE: a diferencia del bucket de restaurantes, este NO es público.
-- Una identificación oficial y un comprobante de domicilio son datos
-- personales sensibles: solo deben poder verlos su dueño y el personal de
-- revisión (service_role).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Bucket privado para identificación y comprobante de domicilio
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'identificaciones',
  'identificaciones',
  false,                                    -- PRIVADO
  5242880,                                  -- 5 MB por archivo
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Cada repartidor solo puede subir dentro de su propia carpeta:
--   identificaciones/<uid>/frente.jpg
--   identificaciones/<uid>/domicilio.jpg
drop policy if exists "identificaciones_subida_propia" on storage.objects;
create policy "identificaciones_subida_propia"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'identificaciones'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Y solo puede ver las suyas. El personal de revisión usa service_role,
-- que salta las políticas RLS.
drop policy if exists "identificaciones_lectura_propia" on storage.objects;
create policy "identificaciones_lectura_propia"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'identificaciones'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "identificaciones_actualiza_propia" on storage.objects;
create policy "identificaciones_actualiza_propia"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'identificaciones'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- 2. Bucket público para la foto de perfil
-- -----------------------------------------------------------------------------
-- Esta sí es pública: el restaurante y el cliente deben poder identificar al
-- repartidor cuando llega.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'repartidores',
  'repartidores',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "repartidores_lectura_publica" on storage.objects;
create policy "repartidores_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'repartidores');

drop policy if exists "repartidores_subida_propia" on storage.objects;
create policy "repartidores_subida_propia"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'repartidores'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "repartidores_actualiza_propia" on storage.objects;
create policy "repartidores_actualiza_propia"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'repartidores'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- 3. Datos del repartidor
-- -----------------------------------------------------------------------------
-- Los repartidores viven hoy en auth.users con el rol 'repartidor_plus' y sin
-- tabla propia. Para poder revisarlos y filtrarlos hace falta una:

create table if not exists public.drivers (
  id            uuid primary key references auth.users (id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  phone         text not null,
  email         text not null,
  city          text,
  state         text,
  lat           double precision,
  lng           double precision,
  vehicle       text,
  id_type       text,
  -- Solo las rutas dentro del bucket privado, nunca el contenido.
  id_front_path text,
  id_back_path  text,
  -- Comprobante de domicilio, en el mismo bucket privado.
  proof_of_address_path text,
  photo_url     text,
  -- Estado inicial del repartidor.
  --   Aprobación automática -> 'aprobado'
  --   Revisión manual       -> 'en_revision'
  -- Debe decidirse AQUÍ, no en el cliente: si el navegador manda el estado,
  -- cualquiera puede aprobarse solo manipulando la petición.
  status        text not null default 'aprobado',
  -- Constancia de las tres aceptaciones del registro.
  safety_ack_at     timestamptz,
  disclaimer_ack_at timestamptz,
  terms_ack_at      timestamptz,
  created_at    timestamptz not null default now()
);

-- El número de la identificación NO se guarda aquí a propósito: revisar la
-- foto basta para validar, y almacenarlo aumenta el daño de una filtración.
-- Si el negocio decide que hace falta, debe ir cifrado y con acceso auditado.

alter table public.drivers enable row level security;

drop policy if exists "drivers_lee_lo_suyo" on public.drivers;
create policy "drivers_lee_lo_suyo"
  on public.drivers for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "drivers_crea_lo_suyo" on public.drivers;
create policy "drivers_crea_lo_suyo"
  on public.drivers for insert
  to authenticated
  with check (id = auth.uid());

create index if not exists drivers_status_idx on public.drivers (status);

-- El repartidor NO debe poder cambiar su propio estado. La política de
-- inserción de arriba permite crear la fila, pero conviene además impedir
-- que la actualice: los cambios de estado los hace el personal de revisión
-- con service_role, que salta RLS.
-- (No se crea ninguna policy de UPDATE para 'authenticated' a propósito.)

-- Aprobación DIFERIDA (opcional): si prefieres que pasen a 'aprobado' tras
-- unos minutos en lugar de al instante, deja el default en 'en_revision' y
-- programa esto con pg_cron:
--
--   select cron.schedule(
--     'aprobar-repartidores',
--     '* * * * *',
--     $update public.drivers
--          set status = 'aprobado'
--        where status = 'en_revision'
--          and created_at < now() - interval '1 minute'$
--   );
create unique index if not exists drivers_phone_idx on public.drivers (phone);

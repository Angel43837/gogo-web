-- =============================================================================
-- GOGO — Registro de restaurantes
--
-- Añade a `restaurants` los campos que pide el alta web y crea el bucket
-- donde se guardan el logo y la portada.
--
-- CÓMO APLICARLO
--   Panel de Supabase -> SQL Editor -> pegar este archivo -> Run.
--
-- Es aditivo y idempotente: solo crea lo que falta, no borra ni modifica
-- ninguna columna existente, así que la app actual sigue funcionando igual.
-- Aun así, haz una copia de seguridad antes: es la base de PRODUCCIÓN.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Columnas nuevas
-- -----------------------------------------------------------------------------

alter table public.restaurants
  add column if not exists brand_name         text,
  add column if not exists phone              text,
  add column if not exists city               text,
  add column if not exists state              text,
  add column if not exists postal_code        text,
  add column if not exists establishment_type text,
  add column if not exists modality           text,
  add column if not exists open_days          text[]  default '{}',
  add column if not exists open_time          time,
  add column if not exists close_time         time,
  add column if not exists logo_url           text,
  add column if not exists cover_url          text,
  add column if not exists owner_name         text,
  add column if not exists owner_phone        text,
  add column if not exists terms_accepted_at  timestamptz,
  add column if not exists submitted_at       timestamptz,
  add column if not exists reviewed_at        timestamptz,
  -- Motivos concretos cuando el estado es 'requiere_correccion'.
  add column if not exists correction_notes   text[]  default '{}';

-- -----------------------------------------------------------------------------
-- 2. Estado del restaurante en la plataforma
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'restaurant_status') then
    create type public.restaurant_status as enum (
      'registro_iniciado',
      'registro_completado',
      'en_revision',
      'aprobado',
      'requiere_correccion',
      'rechazado',
      'activo'
    );
  end if;
end $$;

alter table public.restaurants
  add column if not exists status public.restaurant_status not null default 'en_revision';

-- Los restaurantes que ya existían estaban operando antes de esta migración,
-- así que no deben quedar "en revisión": se marcan como activos.
-- `submitted_at is null` los distingue de los que se den de alta desde la web.
update public.restaurants
   set status = 'activo'
 where submitted_at is null
   and status = 'en_revision';

-- Solo los aprobados o activos deben verse en la app de clientes.
create index if not exists restaurants_status_idx on public.restaurants (status);

-- -----------------------------------------------------------------------------
-- 3. Almacenamiento del logo y la portada
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurantes',
  'restaurantes',
  true,                                     -- lectura pública: son imágenes de catálogo
  5242880,                                  -- 5 MB por archivo
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Cualquiera puede VER las imágenes (aparecen en la app de clientes).
drop policy if exists "restaurantes_lectura_publica" on storage.objects;
create policy "restaurantes_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'restaurantes');

-- Solo un usuario autenticado puede SUBIR, y únicamente dentro de su carpeta,
-- que se nombra con su propio uid: restaurantes/<uid>/logo.png
drop policy if exists "restaurantes_subida_propia" on storage.objects;
create policy "restaurantes_subida_propia"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'restaurantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "restaurantes_actualiza_propia" on storage.objects;
create policy "restaurantes_actualiza_propia"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'restaurantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- 4. Comprobación
-- -----------------------------------------------------------------------------

-- select column_name, data_type
--   from information_schema.columns
--  where table_name = 'restaurants'
--  order by ordinal_position;

-- Run once, before the first Instagram import.
-- Schema of record lives in my-app/CLAUDE.md ("Feature: What's For Dinner").

-- Makes the import idempotent: re-running a batch inserts nothing the second
-- time. source_url is already in the schema and is unique per Instagram post,
-- so no new column is needed. Postgres does not collide NULLs in a unique
-- index, so the existing seed rows (all NULL source_url) are unaffected.
create unique index if not exists recipes_source_url_key
  on public.recipes (source_url);

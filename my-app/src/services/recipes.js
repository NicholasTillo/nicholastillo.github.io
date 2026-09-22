/*
 * Recipes — read live from Supabase Postgres via its REST (PostgREST) API.
 * --------------------------------------------------------------------------
 * The site is static (GitHub Pages), so there is no server to proxy through.
 * The browser reads the three tables directly with the public anon key, and
 * Row Level Security is what makes that safe: a `select`-only policy means the
 * key in this bundle cannot write anything. See CLAUDE.md for the schema.
 *
 * ponytail: plain fetch instead of @supabase/supabase-js. The app does three
 * anonymous GETs; the SDK is ~60 kB of auth/realtime/storage that never runs.
 * If this ever needs writes or auth, that's the moment to add the dependency.
 *
 * ponytail: the anon key is hardcoded, not a REACT_APP_* env var. CRA inlines
 * env vars into the bundle at build time, so they add zero secrecy — only a
 * file that must exist on whatever machine runs `npm run deploy`.
 */

import { seedRecipes, seedProteins, seedSides } from '../data/seedRecipes';

// --- Supabase project ------------------------------------------------------
const SUPABASE_URL = 'https://pgbgeyjnrzyjsbsvnmqv.supabase.co';
// Supabase's publishable key. Public by design — it ships in this bundle,
// and RLS (select-only for `anon`) is the security boundary, not this string.
// The sb_secret_* counterpart bypasses RLS and must never appear here.
const SUPABASE_ANON_KEY = 'sb_publishable_KC2D00xK9pdRiEVsb0uAKQ_IMIPsynd';
const USE_REMOTE = true;
// ---------------------------------------------------------------------------

const COLUMNS = 'id,name,ingredients,ingredient_lines,steps,image_url,source_url';

// A Postgres row -> the shape the page uses. `ingredient_lines` falls back to
// `ingredients` so a recipe entered without amounts still displays.
export function normalizeRecipe(row, kind = null) {
  const ingredients = row.ingredients ?? [];
  return {
    id: row.id,
    name: row.name,
    kind: kind ?? row.kind ?? 'old',
    ingredients,
    ingredientLines: row.ingredient_lines?.length ? row.ingredient_lines : ingredients,
    steps: row.steps ?? [],
    imageUrl: row.image_url ?? null,
    sourceUrl: row.source_url ?? null,
  };
}

async function readTable(table, select, { signal }) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&order=id`;
  const res = await fetch(url, {
    signal,
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) {
    // Distinct messages so a misconfiguration is debuggable from the console;
    // the user never sees these, they just get the seed list.
    const why =
      res.status === 401 || res.status === 403
        ? 'bad anon key, or the RLS select policy is missing'
        : res.status === 404
        ? `table "${table}" not found`
        : `HTTP ${res.status}`;
    throw new Error(`Supabase read failed (${why}).`);
  }
  return res.json();
}

/*
 * Everything the deck needs, in one call.
 *
 * Only ever rejects on abort. Any other failure — unreachable, paused project,
 * bad key, empty table — resolves the bundled seed lists with source: 'seed'.
 * A dead page is the one outcome worth engineering away here: she opens this
 * to answer a question, not to debug it.
 */
export async function fetchDinnerData({ signal } = {}) {
  if (!USE_REMOTE) {
    return { recipes: seedRecipes, proteins: seedProteins, sides: seedSides, source: 'seed' };
  }

  try {
    const [recipeRows, proteinRows, sideRows] = await Promise.all([
      readTable('recipes', `${COLUMNS},kind`, { signal }),
      readTable('proteins', COLUMNS, { signal }),
      readTable('sides', COLUMNS, { signal }),
    ]);

    const recipes = recipeRows.map((row) => normalizeRecipe(row));
    if (!recipes.length) throw new Error('Supabase returned no recipes.');

    return {
      recipes,
      proteins: proteinRows.map((row) => normalizeRecipe(row)),
      sides: sideRows.map((row) => normalizeRecipe(row)),
      source: 'remote',
    };
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    console.warn(`[recipes] falling back to the built-in list — ${e.message}`);
    return { recipes: seedRecipes, proteins: seedProteins, sides: seedSides, source: 'seed' };
  }
}

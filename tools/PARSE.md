# Parsing a caption batch

Say to Claude Code: **"parse tools/captions/batch-07.md"**.

These instructions exist so batch 07 parsed today and batch 22 parsed next week
come out identical. Read this file and `tools/ingredients.txt` before starting a
batch.

## Input

`tools/captions/batch-NN.md`, blocks separated by `---`:

```
## <shortcode>
https://www.instagram.com/p/<shortcode>/

<the raw Instagram caption>
```

## Output

`tools/sql/batch-NN.sql` — one `insert` statement, plus a comment line for every
post that was skipped and every ingredient the vocabulary was missing.

## Rules

**Skip anything that is not a cookable dinner.** Drinks, desserts, baking,
restaurant ads, gadget promos, "recipe in comments" with no actual method,
captions that are only hashtags. Record each one:

```sql
-- skipped C1x2y3z: dessert
```

Never drop a post silently — the skip comments are how we know the parse saw all
50.

**`name`** — short, recognizable, title case. No emoji, no hashtags, no
"VIRAL!!", no author handle. `Garlic Butter Chicken`, not
`🔥 THE BEST Garlic Butter Chicken you'll EVER make #easydinner`.

**`ingredients`** — **only** names from `tools/ingredients.txt`, exact spelling.
This is the filter-chip column; inventing a name here breaks the feature.

A real ingredient with no vocabulary match does *not* get a made-up chip. Leave
it out of `ingredients` (it still appears in `ingredient_lines`) and note it at
the bottom of the file:

```sql
-- vocab candidate: Halloumi
```

Only list the handful of things that genuinely block a dinner — a recipe's 3-5
main components, not all 14 lines. Spices and pantry staples are out by design.

**`ingredient_lines`** — the verbatim lines with amounts, emoji and hashtags
stripped, one per array element. This is what she reads while cooking, so keep
the quantities exactly as written.

**`steps`** — one imperative sentence per element. Strip `1.` / `Step 1:`
numbering prefixes; the UI numbers them. If the caption has no method at all,
skip the post — a card with no steps is useless.

**`kind`** — always `'new'`.

**`source_url`** — `https://www.instagram.com/p/<shortcode>/`

**Leave out** `image_url` (stays null) and `id` (generated always).

## SQL shape

Escape `'` as `''`. Smart quotes (`’`) need no escaping and are already used in
`supabase/seed.sql`. Match that file's `ARRAY[...]::text[]` style exactly.

```sql
-- batch-07 — 50 captions in, 43 recipes out.

insert into public.recipes (name, kind, ingredients, ingredient_lines, steps, source_url) values
  ('Garlic Butter Chicken', 'new',
   ARRAY['Chicken','Garlic']::text[],
   ARRAY['2 chicken breasts','3 tbsp butter','4 cloves garlic, minced']::text[],
   ARRAY['Season the chicken and sear it 5 minutes a side.','Melt the butter with the garlic.','Spoon the garlic butter over and rest 5 minutes.']::text[],
   'https://www.instagram.com/p/AAA111/'),
  ('Lemon Orzo', 'new',
   ARRAY['Pasta','Lemon','Cheese']::text[],
   ARRAY['300 g orzo','1 lemon','150 g feta']::text[],
   ARRAY['Cook the orzo in salted water until just tender.','Off the heat, stir through lemon zest and juice.','Crumble the feta over.']::text[],
   'https://www.instagram.com/p/BBB222/')
on conflict (source_url) do nothing;

-- skipped CCC333: dessert
-- skipped DDD444: no method in caption
-- vocab candidate: Halloumi
```

`on conflict (source_url) do nothing` makes the file safe to run twice —
`supabase/import-schema.sql` creates the index it needs.

## After the batch

1. Paste `tools/sql/batch-NN.sql` into the Supabase SQL editor and run it.
2. Append that batch's shortcodes to `tools/imported.txt` (one per line), so
   `batch-captions.mjs` stops re-emitting them:
   ```bash
   grep -o '^## .*' tools/captions/batch-07.md | cut -d' ' -f2 >> tools/imported.txt
   ```
3. Every few batches, fold the accumulated `-- vocab candidate:` lines into
   `tools/ingredients.txt` so later batches match more.

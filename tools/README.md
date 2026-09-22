# Instagram → /dinner import

Gets ~1400 recipes saved in Instagram into `public.recipes`. Run once; this
whole folder is disposable afterwards.

Why it looks like this: Instagram's official API only returns media you *own*,
never your saved collection, and Meta's "Download Your Information" export gives
saved-post links with no captions. The online converters (cooking.guru and
friends) have no API, no batch mode, and a 5-a-month free tier. So instaloader
gets the caption text and Claude Code does the structuring.

## Phase 0 — once

1. Run `supabase/import-schema.sql` in the Supabase SQL editor. It adds a unique
   index on `source_url` so re-running any batch is a no-op.
2. Raise **Max Rows** from 1000 to 2000 in the Supabase dashboard
   (Settings → API → Max Rows, or Integrations → Data API → Settings). Without
   this the app silently receives only the first 1000 recipes — no error, just
   missing data.

## Phase 1 — download captions (~a week, one command a day)

Mom logs into Instagram in Chrome on this machine once; instaloader borrows the
session, so no password or 2FA handling.

```bash
pip install instaloader
mkdir -p tools/instaloader-out && cd tools/instaloader-out
instaloader -b chrome \
  --dirname-pattern saved \
  --no-pictures --no-videos --no-video-thumbnails \
  --no-compress-json \
  --abort-on 401,429 \
  :saved
```

- Images were ruled out, and skipping them cuts the request count hard — which
  is what gets you rate-limited.
- `--dirname-pattern saved` because the default `:saved` is not a legal
  directory name on Windows.
- JSON metadata is written by default; it carries the shortcode.
- Instagram 401s after roughly **150–300 posts**. That is expected. Resume is on
  by default (`--resume-prefix iterator`) and works for `:saved`, so just run the
  same command again tomorrow.

Nothing downstream waits for this to finish — Phases 2 and 3 work on whatever
has landed so far.

## Phase 2 — batch the captions

```bash
node tools/batch-captions.mjs
```

Writes `tools/captions/batch-NN.md`, 50 posts each, skipping anything already in
`tools/imported.txt`. Re-run it after every instaloader pass; it only emits
batches for posts that are new.

## Phase 3 — parse (the loop)

Tell Claude Code: **"parse tools/captions/batch-07.md"**. It follows
`tools/PARSE.md` and writes `tools/sql/batch-07.sql`.

Then:

```bash
# paste tools/sql/batch-07.sql into the Supabase SQL editor, run it, then:
grep -o '^## .*' tools/captions/batch-07.md | cut -d' ' -f2 >> tools/imported.txt
```

~28 batches total. Every few, fold the `-- vocab candidate:` lines the parse
leaves behind into `tools/ingredients.txt`.

## Files

| | |
|---|---|
| `batch-captions.mjs` | instaloader dump → caption batches |
| `PARSE.md` | instructions each parsing session follows |
| `ingredients.txt` | controlled vocabulary for `ingredients[]` |
| `imported.txt` | ledger of shortcodes already in the database |
| `instaloader-out/` | raw dump — gitignored, Mom's data |
| `captions/`, `sql/` | batch inputs and outputs |

## Note on instaloader

Scraping a personal account is against Instagram's ToS in the strict reading,
even for your own saved posts on your own session. The practical risk is a
temporary rate-limit block, not a ban — but it is Mom's account, so it is her
call.

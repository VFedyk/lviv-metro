# lviv-metro

A humorous Node.js CLI about the legendary (fictional) Lviv Metro. Lviv is a major Ukrainian city with over 1 million people — and no subway. This tool fetches real news from the official metro website and provides other metro-related functionality.

## Commands

```bash
npm test    # run Mocha test suite
npm start   # run the CLI
```

## CLI Usage

```bash
lviv-metro news              # fetch and display RSS news feed
lviv-metro check-existence   # check if the metro is built (spoiler: it isn't)
lviv-metro map               # open the metro map in your browser
```

## Project Structure

```
bin/           # thin executables — one per command + main dispatcher
src/commands/  # business logic for each CLI command
src/utils/     # get-url.js (fetch + TextDecoder), parse-rss.js (RSS parser)
test/          # Mocha + Chai specs
```

## Testing

Framework: Mocha + Chai. Spec files in `test/`:

- `get-url.spec.js` — tests CP1251/UTF-8 decoding via mocked `globalThis.fetch`
- `parse-rss.spec.js` — tests the pure `parseItems(xml)` function directly

```bash
npm test
```

## Key Implementation Notes

- The project is ESM (`"type": "module"` in package.json). All imports use ES module syntax with explicit `.js` extensions. Minimum supported Node.js is v22 (LTS).
- `get-url.js` uses the global `fetch` (built into Node.js 22) and `TextDecoder` to handle cp1251 (Cyrillic) encoding of the RSS feed — no third-party HTTP or encoding libraries.
- `parse-rss.js` exports two functions: `parseItems(xml)` (pure, synchronous) and `parseRSS(url, encoding)` (fetches + parses). Tests cover `parseItems` directly without any mocking.
- The RSS feed (`https://metro.lviv.ua/news/rss.xml`) redirects; `fetch` follows redirects automatically.
- Each command has a thin `bin/lviv-metro-<cmd>.js` entry point that delegates to `src/commands/<cmd>.js`.
- Runtime dependencies are `chalk`, `commander`, and `open` only — no HTTP, XML, or encoding packages.

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
src/utils/     # get-url.js (HTTPS fetch + encoding), parse-rss.js (xml2js wrapper)
test/          # Mocha + Chai specs
```

## Testing

Framework: Mocha + Chai. Single spec file: `test/ultimate-test-of-lviv.spec.js`.

```bash
npm test
```

## Key Implementation Notes

- `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `bin/lviv-metro-news.js` to bypass TLS issues with the RSS endpoint — intentional.
- The RSS feed (`https://metro.lviv.ua/news/rss.xml`) uses cp1251 (Cyrillic) encoding; `get-url.js` and `parse-rss.js` handle the decoding via iconv-lite.
- Each command has a thin `bin/lviv-metro-<cmd>.js` entry point that delegates to `src/commands/<cmd>.js`.

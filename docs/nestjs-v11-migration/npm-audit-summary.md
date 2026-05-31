# npm audit summary (post NestJS 11 migration)

After upgrading to NestJS 11, `npm audit` initially reported **17 vulnerabilities**. Step 1 (`npm audit fix`) cleared 9 with no code impact. Six newly-disclosed advisories then surfaced, bringing the count back to 14. Step 2 removed `@compodoc/compodoc` outright (-9 dev-only). Step 3 bumped `bcrypt` 5 → 6, clearing the entire `tar` chain and removing typeorm's transitive flag. Three brand-new transitive disclosures (`brace-expansion`, `fast-uri`, `qs`) landed during step 3 and are tracked as a follow-up.

| Severity | Initial | After `npm audit fix` | After new disclosures | After compodoc removed | After bcrypt v6 |
|----------|---------|-----------------------|-----------------------|------------------------|-----------------|
| Critical | 1 | 0 | 0 | 0 | 0 |
| High | 8 | 4 | 4 | 3 | 1 |
| Moderate | 7 | 4 | 10 | 2 | 3 |
| Low | 1 | 0 | 0 | 0 | 0 |
| **Total** | **17** | **8** | **14** | **5** | **4** |

Step 3 itself cleared 4 (bcrypt+chain ×3, typeorm ×1) and gained 3 newly-disclosed transitive advisories — net 5 → 4.

## Remaining vulnerabilities

| Package | Severity | Issue | Fix | Status |
|---------|----------|-------|-----|--------|
| `uuid` (<14.0.0) | Moderate | Missing buffer bounds check in v3/v5/v6 when `buf` is provided (`GHSA-w5hq-g745-h8pq`) | `uuid` 10 → 14 (breaking, runtime) | ⏳ Pending |
| `fast-uri` (<=3.1.1) | High | Path traversal via percent-encoded dot segments + host confusion via percent-encoded authority delimiters | `npm audit fix` (safe, transitive) | ⏳ Pending — newly disclosed during step 3 |
| `brace-expansion` (5.0.2 – 5.0.5) | Moderate | Large-numeric-range DoS defeating `max` protection (`GHSA-jxxr-4gwj-5jf2`) | `npm audit fix` (safe, transitive) | ⏳ Pending — newly disclosed during step 3 |
| `qs` (6.11.1 – 6.15.1) | Moderate | DoS via `qs.stringify` crash on null/undefined entries in comma-format arrays with `encodeValuesOnly` | `npm audit fix` (safe, transitive) | ⏳ Pending — newly disclosed during step 3 |

## What was cleared

### Step 1 — `npm audit fix` (safe)

Cleared 9 of the original 17: `qs`, `undici`, `yaml`, `diff`, `flatted`, `brace-expansion` family, `@isaacs/brace-expansion`, `handlebars` (the lone critical), and one more in the eslint/jest internals chain.

### Step 2 — remove `@compodoc/compodoc`

`@compodoc/compodoc` is a dev-only API-docs generator. After NestJS 11, its transitive dependency tree accumulated 9 advisories with no clean upgrade path (downgrading was the only `npm audit fix --force` option, sacrificing features for a chain that's only used to render HTML docs). We removed it entirely.

| Package | Severity | Why it was here |
|---------|----------|-----------------|
| `@compodoc/compodoc` | Moderate | direct dev dep |
| `@compodoc/live-server` | Moderate | compodoc → live-server |
| `http-auth` | Moderate | live-server → http-auth |
| `vis-network`, `vis-data` | Moderate (×2) | compodoc graph rendering |
| `@angular-devkit/core`, `@angular-devkit/schematics` | Moderate (×2) | compodoc schematics |
| `ajv` | Moderate | angular-devkit → ajv |
| `picomatch` | High | compodoc → picomatch |

If module-graph docs are needed in the future, `npx @compodoc/compodoc -p tsconfig.json` can be run as a one-off without a permanent dependency. Swagger UI ([@nestjs/swagger](../../package.json)) remains as the API documentation surface.

### Step 3 — `bcrypt` 5.1.1 → 6.0.0

bcrypt 6 replaced its `@mapbox/node-pre-gyp` build-time dependency with `prebuildify`, eliminating the vulnerable `tar` extraction chain entirely. The JS API (`hash`, `compare`) is unchanged.

| Package | Severity | Why it was here |
|---------|----------|-----------------|
| `bcrypt` (5.x) | High | direct runtime dep |
| `@mapbox/node-pre-gyp` | High | bcrypt 5 build-time |
| `tar` (<=7.5.10) | High | node-pre-gyp → tar (6 collapsed CVEs) |
| `typeorm` | Moderate | bundled `uuid@11.1.0` — no longer flagged after the install refreshed the tree |

Verified:
- Existing **v5-generated `$2b$10$` hashes verify cleanly under v6** (`compare()` round-trip).
- Wrong passwords still rejected.
- `@types/bcrypt` bumped 5.0.2 → 6.0.0 alongside.
- Unit tests (16 suites / 98 tests) and e2e (4 suites / 30 tests) pass; full auth flow exercised by `auth.e2e-spec.ts` and `user.e2e-spec.ts`.

## Next steps

1. **Safe transitive fixes** — `npm audit fix` for the 3 newly-disclosed advisories (`fast-uri`, `brace-expansion`, `qs`). Non-breaking, lockfile-only. Clears 3 of the 4 remaining advisories.
2. **`uuid` 10 → 14** — dedicated PR. Major bump; check call-sites that pass a `buf` argument or rely on v1/v3/v5/v6 generation. Clears the last remaining advisory.

# npm audit summary (post NestJS 11 migration)

After upgrading to NestJS 11, `npm audit` initially reported **17 vulnerabilities**:

| Severity | Initial | After `npm audit fix` |
|----------|---------|-----------------------|
| Critical | 1 | 0 |
| High | 8 | 4 |
| Moderate | 7 | 4 |
| Low | 1 | 0 |
| **Total** | **17** | **8** |

Step 1 (safe fixes) is complete — 9 vulnerabilities resolved with zero breaking changes, only `package-lock.json` touched. The remaining 8 all require breaking changes (see the "Breaking fixes" section below).

This document categorizes them by **runtime impact** and lays out the safe fix path.

## Vulnerabilities by runtime impact

### Runtime (production) dependencies

These ship with the built app and represent real attack surface:

| Package | Severity | Issue | Fix | Status |
|---------|----------|-------|-----|--------|
| `qs` (<=6.14.1) | Moderate | `arrayLimit` bypass in comma + bracket parsing → DoS | `npm audit fix` (safe) | ✅ Done |
| `undici` (7.0.0 – 7.23.0) | High | HTTP request/response smuggling, WebSocket crashes, unbounded decompression, CRLF injection | `npm audit fix` (safe) | ✅ Done |
| `bcrypt` (5.0.1 – 5.1.1) → `@mapbox/node-pre-gyp` → `tar` (<=7.5.10) | High | Path traversal, symlink poisoning, hardlink escape in `tar` extraction | `bcrypt` 5 → 6 (breaking, dedicated PR) | ⏳ Pending |

### Dev-only dependencies

These are consumed only during build/test/docs generation. No prod impact:

| Package | Severity | Enters via | Fix | Status |
|---------|----------|-----------|-----|--------|
| `handlebars` (4.0.0 – 4.7.8) | Critical | `@compodoc/compodoc` (docs generator) | ~~`npm audit fix --force`~~ — resolved by safe `npm audit fix` | ✅ Done |
| `ajv` (<6.14.0 / 7.x–8.17.x) | Moderate | `@angular-devkit/core` → `@compodoc/compodoc`; also `eslint` | `npm audit fix --force` (compodoc downgrade) | ⏳ Pending |
| `flatted` | High | `eslint`/`jest` internals | `npm audit fix` (safe) | ✅ Done |
| `@isaacs/brace-expansion`, `brace-expansion` | High / Moderate | `eslint`, `jest`, `@mapbox/node-pre-gyp` | `npm audit fix` (safe) | ✅ Done |
| `picomatch` | Various | `chokidar`, `jest`, `micromatch`, `@compodoc/live-server` | `npm audit fix --force` (compodoc downgrade) | ⏳ Pending |
| `diff` | Low/Moderate | `jest-diff` | `npm audit fix` (safe) | ✅ Done |
| `yaml` (2.0.0 – 2.8.2) | Moderate | Likely a config/docs tool | `npm audit fix` (safe) | ✅ Done |

## Fix paths

### Safe fixes (no breaking changes)

```bash
npm audit fix
```

Addresses: `qs`, `undici`, `yaml`, `diff`, `flatted`, `brace-expansion` family, `@isaacs/brace-expansion`. Expected to clear the majority of the 17 findings with no code impact.

### Breaking fixes (require evaluation)

```bash
npm audit fix --force
```

Would additionally apply:

1. **`bcrypt` 5.x → 6.0.0** (runtime dep). This is used for password hashing in the auth service. A major bump needs dedicated testing:
   - Existing hashed passwords must still verify (bcrypt hashes are forward-compatible, but confirm)
   - Review [bcrypt 6 release notes](https://github.com/kelektiv/node.bcrypt.js/releases) for any API changes
   - Full auth flow smoke test: register, login, password hash round-trip
2. **`@compodoc/compodoc` 1.1.32 → 1.1.23** (dev-only, **downgrade**).
   - **Current version:** `^1.1.32` (from `package.json`)
   - **Target version:** `1.1.23` — this is what `npm audit fix --force` now suggests
     - Note: before safe fixes ran, the target was `1.1.16` because `handlebars` (critical) was in the chain up through 1.1.23. The safe fix resolved `handlebars`, so the lowest safe compodoc version climbed to `1.1.23`.
   - **Why downgrade?** compodoc `>=1.1.24` depends on `@angular-devkit/schematics` versions that transitively pull in vulnerable `ajv` (ReDoS) and `picomatch` (ReDoS). `1.1.23` is currently the newest version whose transitive deps don't trigger the audit.
   - **Trade-off:** We lose bug fixes / features added in `1.1.24` through `1.1.32`. Since compodoc is dev-only (docs generation), that loss is low-impact.

## Recommended rollout

1. **Safe fixes first.** Run `npm audit fix`, run tests, open PR. Low risk. **✅ Done** — 9 of 17 resolved, build + tests pass.
2. **bcrypt 6 separately.** Dedicated PR with auth flow regression testing. ⏳ Pending — clears the remaining 6 runtime (`tar` chain) advisories.

After these two steps the audit report should be mostly clean, with remaining findings (if any) being acknowledged dev-only noise from the compodoc chain.

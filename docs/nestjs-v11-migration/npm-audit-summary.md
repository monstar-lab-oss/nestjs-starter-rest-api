# npm audit summary (post NestJS 11 migration)

After upgrading to NestJS 11, `npm audit` reports **17 vulnerabilities**:

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 8 |
| Moderate | 7 |
| Low | 1 |

This document categorizes them by **runtime impact** and lays out the safe fix path.

## Vulnerabilities by runtime impact

### Runtime (production) dependencies

These ship with the built app and represent real attack surface:

| Package | Severity | Issue | Fix | Status |
|---------|----------|-------|-----|--------|
| `qs` (<=6.14.1) | Moderate | `arrayLimit` bypass in comma + bracket parsing → DoS | `npm audit fix` (safe) | ⏳ Pending |
| `undici` (7.0.0 – 7.23.0) | High | HTTP request/response smuggling, WebSocket crashes, unbounded decompression, CRLF injection | `npm audit fix` (safe) | ⏳ Pending |
| `bcrypt` (5.0.1 – 5.1.1) → `@mapbox/node-pre-gyp` → `tar` (<=7.5.10) | High | Path traversal, symlink poisoning, hardlink escape in `tar` extraction | `bcrypt` 5 → 6 (breaking, dedicated PR) | ⏳ Pending |

### Dev-only dependencies

These are consumed only during build/test/docs generation. No prod impact:

| Package | Severity | Enters via | Fix | Status |
|---------|----------|-----------|-----|--------|
| `handlebars` (4.0.0 – 4.7.8) | Critical | `@compodoc/compodoc` (docs generator) | `npm audit fix --force` (compodoc downgrade) | ⏳ Pending |
| `ajv` (<6.14.0 / 7.x–8.17.x) | Moderate | `@angular-devkit/core` → `@compodoc/compodoc`; also `eslint` | `npm audit fix --force` (compodoc downgrade) | ⏳ Pending |
| `flatted` | High | `eslint`/`jest` internals | `npm audit fix` (safe) | ⏳ Pending |
| `@isaacs/brace-expansion`, `brace-expansion` | High / Moderate | `eslint`, `jest`, `@mapbox/node-pre-gyp` | `npm audit fix` (safe) | ⏳ Pending |
| `picomatch` | Various | `chokidar`, `jest`, `micromatch`, `@compodoc/live-server` | `npm audit fix --force` (compodoc downgrade) | ⏳ Pending |
| `diff` | Low/Moderate | `jest-diff` | `npm audit fix` (safe) | ⏳ Pending |
| `yaml` (2.0.0 – 2.8.2) | Moderate | Likely a config/docs tool | `npm audit fix` (safe) | ⏳ Pending |

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
2. **`@compodoc/compodoc` 1.1.32 → 1.1.16** (dev-only, **downgrade**).
   - **Current version:** `^1.1.32` (from `package.json`)
   - **Target version:** `1.1.16` — this is what `npm audit fix --force` will install
   - **Why downgrade?** Starting with compodoc `1.1.17`, it began depending on newer versions of `@angular-devkit/schematics` that in turn pull in vulnerable versions of `ajv` (ReDoS), `picomatch` (ReDoS), and `handlebars` (critical — JS injection via AST type confusion). Version `1.1.16` is the last release before that chain was introduced, so it's the newest version of compodoc whose transitive deps don't trigger the audit.
   - **Trade-off:** We lose any bug fixes / features added in `1.1.17` through `1.1.32`. Since compodoc is dev-only (docs generation), that loss is low-impact.

## Recommended rollout

1. **Safe fixes first.** Run `npm audit fix`, run tests, open PR. Low risk.
2. **bcrypt 6 separately.** Dedicated PR with auth flow regression testing.

After these two steps the audit report should be mostly clean, with remaining findings (if any) being acknowledged dev-only noise.

# NestJS 10 to 11 Migration - Action Items

## 1. Upgrade NestJS packages to v11

Update all `@nestjs/*` packages in `package.json`:

- `@nestjs/common` ^10 -> ^11
- `@nestjs/core` ^10 -> ^11
- `@nestjs/platform-express` ^10 -> ^11
- `@nestjs/config` ^3 -> ^4
- `@nestjs/jwt` ^10 -> ^11
- `@nestjs/passport` ^10 -> ^11
- `@nestjs/swagger` ^7 -> ^11 (aligns with NestJS 11 peer deps; latest is 11.3.0)
- `@nestjs/typeorm` ^10 -> ^11
- `@nestjs/cli` ^10 -> ^11 (devDependency)
- `@nestjs/schematics` ^10 -> ^11 (devDependency)
- `@nestjs/testing` ^10 -> ^11 (devDependency)

Use `npx npm-check-updates -u "/@nestjs.*/"` to streamline this.

## 2. Upgrade Express to v5

`@nestjs/platform-express` v11 ships with Express v5 by default.

- Update `@types/express` from `^4` to `^5` in devDependencies.
- Update `swagger-ui-express` to a version compatible with Express v5 (currently pinned at `5.0.1`).

## 3. Express v5 - Query parser change

Express v5 uses the `simple` query parser by default instead of `qs`.

- **Check**: Does the project rely on nested query params (e.g. `?filter[where][name]=John`)?
- **If yes**: Add `app.set('query parser', 'extended')` in `main.ts` and type the app as `NestExpressApplication`.
- **If no**: No action needed, but be aware of the change.

Currently `main.ts` does not type the app as `NestExpressApplication`. Consider updating:

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

**Verified — no action needed.** Only two `@Query()` usages in the codebase (article/user list endpoints), both binding to `PaginationParamsDto` which has flat fields (`limit`, `offset`). No nested query patterns, no direct `req.query` access. Flat params parse identically under the new `simple` and old `qs` parsers. Since we don't need `app.set('query parser', 'extended')`, typing the app as `NestExpressApplication` is also unnecessary.

## 4. Express v5 - Wildcard route syntax

Express v5 requires named wildcards (`*splat`) instead of bare `*`.

- **Current state**: No wildcard routes (`@Get('*')` etc.) found in the codebase.
- **Current state**: No `forRoutes('*')` middleware patterns found.
- **Action**: No changes needed currently, but keep this in mind for future route additions.

## 5. `@nestjs/config` v4 - Config priority change

The order in which `ConfigService#get` reads values has changed in v4:
1. Internal configuration (config namespaces / custom config files)
2. Validated environment variables
3. `process.env`

Previously `process.env` took precedence; now internal config takes precedence.

- **Check**: Review `src/shared/configs/configuration.ts` and `module-options.ts` to verify that the config namespace values and `.env` values don't conflict in unexpected ways.
- The `ignoreEnvVars` option is deprecated; use `validatePredefined` instead (project currently doesn't use `ignoreEnvVars`, so no action needed).

**Verified — no impact.** Internal config and env vars use separate namespaces (lowercase/dotted vs. `UPPER_SNAKE`), so the three priority tiers never collide for the same key. Every `configService.get(...)` call in the codebase reads from the internal-config namespace only (`port`, `env`, `database.*`, `jwt.*`, `defaultAdminUserPassword`). No code change needed.

## 6. Reflector `getAllAndOverride` return type change

Return type changed from `T` to `T | undefined`.

- **Affected file**: `src/auth/guards/roles.guard.ts:17` uses `getAllAndOverride<ROLE[]>`.
- **Current state**: Already handles the `undefined` case (line 22: `if (!requiredRoles) return true`).
- **Action**: No code change needed, but TypeScript may surface new type errors after upgrade. Verify with `npm run build`.

## 7. Module resolution algorithm change

Dynamic modules now use object references instead of deep-hash for deduplication.

- **Affected**: `TypeOrmModule.forRootAsync(...)` in `shared.module.ts` and any `TypeOrmModule.forFeature([...])` usage.
- **Action**: Likely no runtime impact for the app itself, but test modules may behave differently. Run `npm run test` and `npm run test:e2e` after upgrade to verify.
- **Fallback**: If tests break, use `{ moduleIdGeneratorAlgorithm: 'deep-hash' }` option in `Test.createTestingModule()`.

## 8. Lifecycle hooks execution order change

Termination hooks (`OnModuleDestroy`, `BeforeApplicationShutdown`, `OnApplicationShutdown`) now run in reverse order.

- **Action**: Review if the project relies on a specific shutdown order. If not, no action needed.

## 9. Middleware registration order change

Global module middleware now executes first regardless of module graph position.

- **Current state**: No `forRoutes` middleware found in the codebase (middleware is applied globally via `app.use()` in `main.ts`).
- **Action**: No changes needed.

## 10. Verify Node.js version

NestJS 11 requires Node.js v20+.

- **Current state**: Already using Node.js 20.19.6 in Dockerfiles and GitHub Actions workflows.
- **Action**: No changes needed. Consider upgrading to Node.js 22 LTS in the future.

## 11. Not applicable to this project

These migration guide items do not apply:
- **Fastify v5**: Project uses Express.
- **CacheModule / Keyv migration**: Project does not use `@nestjs/cache-manager`.
- **TerminusModule / HealthIndicator**: Project does not use health checks.

## Summary of required actions

| # | Action | Priority | Status |
|---|--------|----------|--------|
| 1 | Upgrade `@nestjs/*` packages to v11 | Required | ✅ Done |
| 2 | Upgrade `@types/express` to v5, check `swagger-ui-express` compat | Required | ✅ Done |
| 3 | Decide on query parser setting in `main.ts` | Review needed | ✅ No action — only flat query params used |
| 5 | Review config priority change impact | Review needed | ✅ No impact — no namespace collision |
| 6 | Verify `getAllAndOverride` types compile | Verify after upgrade | ✅ Build passes (2 unrelated TS fixes — see below) |
| 7 | Run tests to check module resolution changes | Verify after upgrade | ✅ 98 unit + 30 e2e tests pass |

## Notable changes after migration

Actual code changes required to get the build passing after the v11 upgrade:

### JWT strategies — `ConfigService.get` → `getOrThrow`

**Files**: `src/auth/strategies/jwt-auth.strategy.ts`, `src/auth/strategies/jwt-refresh.strategy.ts`

`passport-jwt`'s `secretOrKey` option is typed as `string | Buffer` and no longer accepts `undefined`. `ConfigService.get<string>(key)` returns `string | undefined`, so the `secretOrKey` assignment fails type-check.

Switched to `configService.getOrThrow<string>('jwt.publicKey')`, which returns `string` and throws at bootstrap if the key is missing. This is a semantic change — the app will now fail loudly at startup if `jwt.publicKey` isn't configured, rather than silently registering a broken strategy.

### Swagger `ApiProperty({ type })` — narrowed `ApiPropertyType` union

**File**: `src/shared/dtos/base-api-response.dto.ts`

`@nestjs/swagger` v11 tightened the `type` field's accepted union. The local `ApiPropertyType` union was over-broad (included `string`, `Record<string, any>`, `undefined`), which caused TS to either reject `string` outright or match against the wrong `ApiProperty` overload (the enum one, which requires `enumName`).

Narrowed the union to match actual caller usage — only `Type<unknown>` and `[new (...args: any[]) => any]`. All 11 call sites (`SwaggerBaseApiResponse(SomeClass)` or `SwaggerBaseApiResponse([SomeClass])`) continue to work; the removed branches were dead code.

# NestJS 10 to 11 Migration - Action Items

## 1. Upgrade NestJS packages to v11

Update all `@nestjs/*` packages in `package.json`:

- `@nestjs/common` ^10 -> ^11
- `@nestjs/core` ^10 -> ^11
- `@nestjs/platform-express` ^10 -> ^11
- `@nestjs/config` ^3 -> ^4
- `@nestjs/jwt` ^10 -> ^11
- `@nestjs/passport` ^10 -> ^11
- `@nestjs/swagger` ^7 -> ^8 (check if v8 exists, otherwise keep ^7)
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

| # | Action | Priority |
|---|--------|----------|
| 1 | Upgrade `@nestjs/*` packages to v11 | Required |
| 2 | Upgrade `@types/express` to v5, check `swagger-ui-express` compat | Required |
| 3 | Decide on query parser setting in `main.ts` | Review needed |
| 5 | Review config priority change impact | Review needed |
| 6 | Verify `getAllAndOverride` types compile | Verify after upgrade |
| 7 | Run tests to check module resolution changes | Verify after upgrade |

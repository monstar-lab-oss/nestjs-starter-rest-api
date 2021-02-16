## Middleware

We use `middleware` to access/modify request and response objects. Middleware functions get executed before the router handler gets executed. More about `middleware` can be found [here in nestjs documentation](https://docs.nestjs.com/middleware).

This starter repository comes with the following middlewares:-

- [Request-ID middleware](#request-ID-middleware)
- [Logger middleware](#logger-middleware)

### Request-ID middleware

`RequestIdMiddleware` is declared under the `shared` module and initiated in `main.ts`. It adds a unique request-id to each HTTP call header as `x-request-id`. Unique request-id is very important to log/debug API calls, especially in a microservice environment.

#### Remove Request-ID middleware

To remove `RequestIdMiddleware` middleware,

- remove following lines of logger initiation in `main.ts`

```
  app.use(RequestIdMiddleware);
```

- Optionally remove `src/shared/middlewares/request-id` folder

### Logger middleware

We use the `nestjs-pino` package for request logging. Each request and its response time automatically gets logged with this package.

For generic logging purposes a wrapper logger service `AppLogger` and logging module `AppLoggerModule` is defined under `src/shared/logger`.

More about logging and `nestjs-pino` can be found here

- [Nestjs doc for logging](https://docs.nestjs.com/techniques/logger)
- [nestjs-pino logger](https://github.com/iamolegga/nestjs-pino)

#### Remove logger

To remove the pino logger

- Remove logger initiation in `main.ts`

```
  app.useLogger(new AppLogger(app.get(Logger)));
```

- Remove `AppLoggerModule` module from `imports` and `exports` sections of `SharedModule` declaration (`src/shared/shared.module.ts`).
- `AppLogger` is already being used in different places in the existing repo. Remove all those usage.

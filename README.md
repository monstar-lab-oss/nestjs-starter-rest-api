## NestJS Starter-Kit [WIP]

This starter kit has the following outline:

- Monolithic Project.
- REST API

This is a Github Template Repository, so it can be easily [used as a starter template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) for other repositories.

## Sample implementations

To view sample implementations based on this starter-kit, please visit the [nestjs-sample-solutions](https://github.com/monstar-lab-oss/nestjs-sample-solutions) repository.

## Starter-kit Features

| Feature                  | Info            | Progress |
| ------------------------ | --------------- | -------- |
| Authentication           | JWT             | Done     |
| ORM Integration          | TypeORM         | Done     |
| DB Migrations            | TypeORM         | Done     |
| Logging                  | nestjs-pino     | Done     |
| Request Validation       | class-validator | Done     |
| Docker Ready             | Dockerfile      | Done     |
| Auto-generated OpenAPI   | -               | Done     |
| Auto-generated ChangeLog | -               | WIP      |

## Installation

```bash
$ npm install
```

Create a `.env` file from the template `.env.template`.

Generate public and private key pair for jwt authentication:

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

You may save these key files in `./local` directory as it is ignored in git.

Must enter the location of the key files in `.env`.

```bash
JWT_PUBLIC_KEY_PATH=./local/jwtRS256.key.pub
JWT_PRIVATE_KEY_PATH=./local/jwtRS256.key
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# generate migration (replace CreateUsers with name of the migration)
$ npm run migration:generate -- -n CreateUsers

# run migration
$ npm run migration:run

# revert migration
$ npm run migration:revert
```

## Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume `pwd`:/usr/src/app --env-file .env my-app

# run using docker compose
$ docker-compose up
```

Learn more about Docker conventions [here](https://github.com/monstar-lab-group/nodejs-backend/blob/master/architecture/docker-ready.md). (WIP - Currently this is an internal org link.)

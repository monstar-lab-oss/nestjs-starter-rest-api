## NestJS Starter Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![build](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/actions/workflows/build-workflow.yml/badge.svg?branch=master&event=push)](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/actions/workflows/build-workflow.yml)
[![tests](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/actions/workflows/tests-workflow.yml/badge.svg?branch=master&event=push)](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/actions/workflows/tests-workflow.yml)

This NestJS 11 starter kit has the following outline:

- Monolithic Project
- REST API

This is a Github Template Repository, so it can be easily [used as a starter template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) for other repositories.

## Sample implementations

To view sample implementations based on this starter kit, please visit the [nestjs-sample-solutions](https://github.com/monstar-lab-oss/nestjs-sample-solutions) repository.

## Starter kit Features

One of our main principals has been to keep the starter kit as lightweight as possible. With that in mind, here are some of the features that we have added in this starter kit.

| Feature                  | Info               | Progress |
| ------------------------ | ------------------ | -------- |
| Authentication           | JWT                | Done     |
| Authorization            | RBAC (Role based)  | Done     |
| ORM Integration          | TypeORM            | Done     |
| DB Migrations            | TypeORM            | Done     |
| Logging                  | winston            | Done     |
| Request Validation       | class-validator    | Done     |
| Pagination               | SQL offset & limit | Done     |
| Docker Ready             | Dockerfile         | Done     |
| Devcontainer             | -                  | Done     |
| Auto-generated OpenAPI   | -                  | Done     |
| Auto-generated ChangeLog | -                  | WIP      |

Apart from these features above, our start-kit comes loaded with a bunch of minor awesomeness like prettier integration, commit-linting husky hooks, package import sorting, SonarCloud github actions, docker-compose for database dependencies, etc. :D

## Consulting

Most of the features added to this starter kit have already been tried out in production applications by us here at MonstarLab. Our production applications are more feature rich, and we constantly strive to bring those features to this OSS starter kit.

If you would like to use a more feature rich starter kit, with more awesome features from Day 1, then please reach out to us and we can collaborate on it together as technology partners. :)

## Installation

Prerequisites:

- Node.js 26 LTS (see `.tool-versions`)
- pnpm 12 (the exact version is pinned in `devEngines.packageManager` in `package.json`). Install it with `npm install -g pnpm@12` or the [standalone installer](https://pnpm.io/installation).

This project only supports pnpm. `npm install`, `npm run …` and `yarn` will fail on purpose, and pnpm refuses to install on a Node.js version older than the one in `engines.node`.

Note: when using docker, all the `pnpm` commands can also be performed using `./scripts/pnpm` (for example `./scripts/pnpm install`).
This script allows you to run the same commands inside the same environment and versions than the service, without relying on what is installed on the host.

```bash
$ pnpm install
```

Create a `.env` file from the template `.env.template` file.

Generate public and private key pair for jwt authentication:

### With docker

Run this command:

```bash
./scripts/generate-jwt-keys
```

It will output something like this. You only need to add it to your `.env` file.

```
To setup the JWT keys, please add the following values to your .env file:
JWT_PUBLIC_KEY_BASE64="(long base64 content)"
JWT_PRIVATE_KEY_BASE64="(long base64 content)"
```

### Without docker

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

You may save these key files in `./local` directory as it is ignored in git.

Encode keys to base64:

```bash
$ base64 -i local/jwtRS256.key

$ base64 -i local/jwtRS256.key.pub
```

Must enter the base64 of the key files in `.env`:

```bash
JWT_PUBLIC_KEY_BASE64=BASE64_OF_JWT_PUBLIC_KEY
JWT_PRIVATE_KEY_BASE64=BASE64_OF_JWT_PRIVATE_KEY
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- Postgres server running

Commands:

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker compose up
```

Learn more about Docker conventions [here](https://github.com/monstar-lab-group/nodejs-backend/blob/master/architecture/docker-ready.md). (WIP - Currently this is an internal org link.)

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Migrations

```bash
# using docker
$ docker compose exec app pnpm migration:run

# generate migration (replace CreateUsers with name of the migration)
$ pnpm migration:generate migrations/CreateUsers

# run migration
$ pnpm migration:run

# revert migration
$ pnpm migration:revert
```

## Architecture

- [Project Structure](./docs/project-structure.md)

## Contributors

- [Yash Murty](https://github.com/yashmurty)
- [S M Asad Rahman](https://github.com/asad-mlbd)
- [Tanveer Hassan](https://github.com/war1oc)
- [Saad Bin Amjad](https://github.com/Saad-Amjad)
- [Sivan Payyadakath](https://github.com/sivanpayyadakath)
- [Sébastien Caparros](https://github.com/Seb-C)

## External Links

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="150" alt="Nest Logo" /></a>

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=monstar-lab-oss_nestjs-starter-rest-api)

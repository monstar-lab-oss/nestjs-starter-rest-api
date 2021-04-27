## NestJS Starter Kit [v2]

![Build Badge](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/workflows/build/badge.svg)
![Tests Badge](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/workflows/tests/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=monstar-lab-oss_nestjs-starter-rest-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=monstar-lab-oss_nestjs-starter-rest-api)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=monstar-lab-oss_nestjs-starter-rest-api&metric=coverage)](https://sonarcloud.io/dashboard?id=monstar-lab-oss_nestjs-starter-rest-api)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=monstar-lab-oss_nestjs-starter-rest-api&metric=code_smells)](https://sonarcloud.io/dashboard?id=monstar-lab-oss_nestjs-starter-rest-api)

This starter kit has the following outline:

- Monolithic Project.
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
| Auto-generated OpenAPI   | -                  | Done     |
| Auto-generated ChangeLog | -                  | WIP      |

Apart from these features above, our start-kit comes loaded with a bunch of minor awesomeness like prettier integration, commit-linting husky hooks, package import sorting, SonarCloud github actions, docker-compose for database dependencies, etc. :D

## Consulting

Most of the features added to this starter kit have already been tried out in production applications by us here at MonstarLab. Our production applications are more feature rich, and we constantly strive to bring those features to this OSS starter kit.

If you would like to use a more feature rich starter kit, with more awesome features from Day 1, then please reach out to us and we can collaborate on it together as technology partners. :)

## Installation

```bash
$ npm install
```

Create a `.env` file from the template `.env.template` file.

Generate public and private key pair for jwt authentication:

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

- MySQL server running

Commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker-compose up
```

Learn more about Docker conventions [here](https://github.com/monstar-lab-group/nodejs-backend/blob/master/architecture/docker-ready.md). (WIP - Currently this is an internal org link.)

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

## Architecture

- [Project Structure](./docs/project-structure.md)

## Contributors

- [Yash Murty](https://github.com/yashmurty)
- [S M Asad Rahman](https://github.com/asad-mlbd)
- [Tanveer Hassan](https://github.com/war1oc)
- [Saad Bin Amjad](https://github.com/Saad-Amjad)
- [Sivan Payyadakath](https://github.com/sivanpayyadakath)

## External Links

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="150" alt="Nest Logo" /></a>

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=monstar-lab-oss_nestjs-starter-rest-api)

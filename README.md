<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
## Build Postgresql Database

```bash
  $ docker-compose up -d
```

## Execute Seed
This feature just work in development environment

1. Set NODE_ENV environment variable to development mode.
``` bash
  NODE_ENV=dev
```
2. Go to below path using GET http request
```
  http://host:port/api/seed
```
  __Example__

```bash
  http://localhost:3000/api/seed
```
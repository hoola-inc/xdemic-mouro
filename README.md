# mouro
uPort Edge Server

[![CircleCI](https://circleci.com/gh/uport-project/mouro.svg?style=svg)](https://circleci.com/gh/uport-project/mouro) [![codecov](https://codecov.io/gh/uport-project/mouro/branch/master/graph/badge.svg)](https://codecov.io/gh/uport-project/mouro)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


_In Spain mythology, the Mouros are a race of supernatural beings which were forced to take refuge under the earth. The Mouros work with gold, silver and gem stones with which they make up enormous treasures that are protected by cuélebres._

![Mouros](./mouros.jpg)

## Description

This lambda functions stores user data and information. 

If you want to run your own instance, please see [RUN_INSTANCE.md](./RUN_INSTANCE.md)

## API Description

### GraphQL

The GraphQL allows to query data from the service.

#### Endpoints

`POST /graphql`

#### Headers

| Header         | Description    | Example                                           |
|:---------------|----------------|---------------------------------------------------|
| Authorization  | DID-Auth Token | `Authorization Bearer eyJhbGciOiJIUzI1NiIsInR...` |


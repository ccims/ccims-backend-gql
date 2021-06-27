# CCIMS-Backend
The Backend for the ccims system using nodejs and providing a graphql library
To get a recent version of the api, please use the branch dev

# Usage / Installation

## No Login
If you want to test without login,
```json
{
    "debugNoLogin": true
}
```
should be set in `./config/api.json`

## Without docker
Make sure that you have installed postgres
```bash
npm i
node ./scripts/database.js | psql -U postgres -d ccims # only if you want to (re)create the database
npm start
```

## With docker
set `./config/postgres.json` to something like this:
```json
{
    "$schema": "./postgres.schema.json",
    "user": "ccims-user",
    "password": "ccims-password",
    "database": "ccims",
    "host": "db",
    "port": 5432
}
```
```bash
# for a clean build run this before docker compose:
rm tsconfig.tsbuildinfo
npm i
npm run database-file
docker-compose up
```
Access the db with psql:

```bash
psql --username ccims-user --dbname ccims --host localhost --port 5433
# password is 'ccims-password'
```

## Schema generation
### Schema for the `/api` access-restricted endpoint
For generating the schema file at `schema/schema.graphql` execute:
```
npm run schema schema/schema.graphq
```
This will generate a commented graphql schema from the most recent code version.

Printing schema to stdout: `npm run --silent schema`

### Schema for the `/api/public` public user registration endpoint
For generating the schema file at `schema/public.graphql` execute:
```
npm run schema -- schema/public.graphq -p
```
This will generate a commented graphql schema from the most recent code version.

Printing schema to stdout: `npm run --silent schema -- -p`

## FAQ
### The server does not start. I get the following error: `UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:5432`
The api was not able to connect to the postgres database. Make sure that you setup `config/postgres.json` correctly

### All passwords are invalid after a server restart
`passwordSecret` in `config/common.json` was not provided. Therefore, a random secret was generated, which results in broken passwords after restart.
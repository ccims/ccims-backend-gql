# CCIMS-Backend
The Backend for the ccims system using nodejs and providing a graphql library
To get a recent version of the api, please use the branch dev

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
```
npm i
node .\scripts\database.js | psql -U postgres -d ccims
npm start
```

## With docker
```bash
# for a clean build run this before docker compose:
rm tsconfig.tsbuildinfo
npm i
npm run database-file
docker-compose up
```
`./config/postgres.json` should look like this:
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
Access the db with psql:

```bash
psql --username ccims-user --dbname ccims --host localhost --port 5433
# password is 'ccims-password'
```
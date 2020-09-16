# CCIMS-Backend
The Backend for the ccims system using nodejs and providing a graphql library

## Schema generation
For generating the schema file at `schema/schema.graphql` execute:
```
npm run schema schema/schema.graphq
```
This will generate a commented graphql schema from the most recent code version.

Printing schema to stdout: `npm run --silent schema`

## Usage/Installation
```
npm i
node .\scripts\database.js | psql -U postgres -d ccims
npm start
```
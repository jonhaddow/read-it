# read-it

Store links from across the web

# Prerequites

- Install Node v12+
- Install Postgres

## Local Development

Run `npm install`

then `npm run dev` to start both client and server dev environments.

## Environment variables

Copy `.env.example` and rename to `.env` (this should be gitignored).

Update the variables before starting the server. These will be imported into `process.env`.

## Database entity changes

After modifying any entities, run `npm run typeorm:generate <<NameOfChange>>`. This will create the migration file in `src/server/migrations` to be run on production.

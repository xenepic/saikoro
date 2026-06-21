import knexLib, { Knex } from 'knex';
import { env } from '../config/env';

export const db: Knex = knexLib({
  client: 'mysql2',
  connection: {
    host: env.db.host,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

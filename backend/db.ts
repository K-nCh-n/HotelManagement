import { Pool } from 'pg';
import { ISearchParams } from './interfaces';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hotel_management',
  password: 'admin',
  port: 5432,
});

export const search = (searchParams: ISearchParams) => {
  return pool.query('SELECT * FROM hotel');
}
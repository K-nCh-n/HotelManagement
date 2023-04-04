import { Pool } from 'pg';
import { ISearchParams, IUserInfo } from './interfaces';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: 5432,
});

export const search = (searchParams: ISearchParams) => {
  return pool.query('SELECT * FROM room INNER JOIN hotel ON hotel.hotel_id = room.hotel_id');
}

export const createClientAcct = async (userInfo: IUserInfo) => {
  try{
    const { NAS: customerNas, firstName, lastName, address, email, password } = userInfo;
    const text = `INSERT INTO customer(customer_nas, first_name, last_name, address, registration_date, email, password) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [customerNas, firstName, lastName, address, new Date(Date.now()).toISOString(), email, password];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const loginUser = async (email: string, password: string) => {
  try{
    const text = `SELECT 'employee' AS account_type, employee_nas AS token FROM employee WHERE email = $1 AND password = $2 UNION SELECT 'customer' AS account_type, customer_nas AS token FROM customer WHERE email = $1 AND password = $2;`;
    const values = [email, password];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const accountInfo = async (id: string) => {
  try{
    const text = `SELECT customer_nas as nas, email, first_name, last_name, address, password FROM customer WHERE customer_nas = $1 UNION SELECT employee_nas as nas, email, first_name, last_name, address, password FROM employee WHERE employee_nas = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const userReservations = async (id: string) => {
  try{
    const text = `SELECT * FROM reservation WHERE customer_nas = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

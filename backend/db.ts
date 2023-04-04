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
    const text = `SELECT reservation_id, reservation.room_id, reservation.customer_nas, reservation_start_date, reservation_end_date, reservation_date, chain_name, zone, hotel.address, hotel.phone_number, hotel.email FROM reservation INNER JOIN room ON room.room_id = reservation.room_id INNER JOIN hotel ON hotel.hotel_id = room.hotel_id WHERE customer_nas = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const employeeReservations = async (id: string) => {
  try{
    const text = `SELECT reservation_id, reservation.room_id, reservation.customer_nas, reservation_start_date, reservation_end_date, reservation_date, chain_name, zone, hotel.address, hotel.phone_number, hotel.email, customer.email, customer.phone_number, first_name, last_name FROM reservation INNER JOIN room ON room.room_id = reservation.room_id INNER JOIN hotel ON hotel.hotel_id = room.hotel_id INNER JOIN customer ON customer.customer_nas = reservation.customer_nas`;
    return pool.query(text);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const cancelReservation = async (id: string) => {
  try{
    const text = `DELETE FROM reservation WHERE reservation_id = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const confirmReservation = async (reservationId: string, employeeNas: string) => {
  try{
    const query = `SELECT customer_nas, room_id, reservation_start_date, reservation_end_date FROM reservation WHERE reservation_id = $1`;
    const queryValues = [reservationId];
    const { customer_nas, room_id, reservation_start_date, reservation_end_date } = (await pool.query(query, queryValues)).rows[0];

    const text = `INSERT INTO rental(rental_id, reservation_id, customer_nas, room_id, rental_start_date, rental_end_date, employee_nas) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const rentalId = `${room_id}${(Math.random() + 1).toString(36).substring(7)}`;
    const values = [rentalId, reservationId, customer_nas, room_id, reservation_start_date, reservation_end_date, employeeNas];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
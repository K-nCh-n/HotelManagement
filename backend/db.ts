import { Pool } from 'pg';
import { IEmployeeInfo, IReservationInfo, ISearchParams, IUserInfo } from './interfaces';

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
    const { NAS, firstName, lastName, address, email, password } = userInfo;
    const text = `INSERT INTO customer(customer_nas, first_name, last_name, address, registration_date, email, password) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [NAS, firstName, lastName, address, new Date(Date.now()).toISOString(), email, password];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const loginUser = async (email: string, password: string) => {
  try{
    const text = `SELECT 'employee' AS account_type, employee_nas AS token 
                  FROM employee WHERE email = $1 AND password = $2 
                  UNION 
                  SELECT 'customer' AS account_type, customer_nas AS token 
                  FROM customer WHERE email = $1 AND password = $2;`;
    const values = [email, password];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const accountInfo = async (id: string) => {
  try{
    const text = `SELECT customer_nas as nas, email, first_name, last_name, address, password, null as hotel_id 
                  FROM customer WHERE customer_nas = $1 
                  UNION 
                  SELECT employee_nas as nas, email, first_name, last_name, address, password, hotel_id FROM employee WHERE employee_nas = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const userReservations = async (id: string) => {
  try{
    const text = `SELECT reservation.reservation_id, reservation.room_id, reservation.customer_nas, reservation_start_date, reservation_end_date,
                  reservation_date, chain_name, zone, hotel.address, hotel.phone_number, hotel.email, confirmation.rental_id FROM reservation 
                  INNER JOIN room ON room.room_id = reservation.room_id INNER JOIN hotel ON hotel.hotel_id = room.hotel_id 
                  FULL JOIN confirmation ON reservation.reservation_id = confirmation.reservation_id 
                  WHERE customer_nas = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const employeeReservations = async (id: string) => {
  try{
    const text = `SELECT reservation_id, reservation.room_id, reservation.customer_nas, reservation_start_date, reservation_end_date,
                  reservation_date, chain_name, zone, hotel.address,  hotel.phone_number, hotel.email, customer.email, customer.phone_number, first_name, last_name 
                  FROM reservation INNER JOIN room ON room.room_id = reservation.room_id INNER JOIN hotel ON hotel.hotel_id = room.hotel_id
                  INNER JOIN customer ON customer.customer_nas = reservation.customer_nas
                  WHERE reservation_id NOT IN (SELECT reservation_id FROM confirmation)`;
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
    const query = `SELECT customer_nas, room_id, reservation_start_date, reservation_end_date 
                   FROM reservation 
                   WHERE reservation_id = $1`;
    const queryValues = [reservationId];
    const { customer_nas, room_id, reservation_start_date, reservation_end_date } = (await pool.query(query, queryValues)).rows[0];

    const text = `INSERT INTO rental(rental_id, reservation_id, customer_nas, room_id, rental_start_date, rental_end_date, employee_nas)
                  VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const rentalId = `${room_id}${(Math.random() + 1).toString(36).substring(7)}`;
    const values = [rentalId, reservationId, customer_nas, room_id, reservation_start_date, reservation_end_date, employeeNas];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const deleteAccount = async (id: string, isEmployee: boolean) => {
  try{
    let text: string;
    if (isEmployee) {
      text = `DELETE FROM employee WHERE employee_nas = $1`;
    } else {
      text = `DELETE FROM customer WHERE customer_nas = $1`;
    }
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const editAccountInfo = async (userInfo: IUserInfo) => {
  try{
    const { firstName, lastName, address, email, password, NAS } = userInfo;
    const text = `UPDATE customer SET first_name = $1, last_name = $2, address = $3, email = $4, password = $5 WHERE customer_nas = $6`;
    const values = [firstName, lastName, address, email, password, NAS];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const roomInfo = async (id: string) => {
  try{
    const text = `SELECT * FROM room INNER JOIN hotel ON hotel.hotel_id = room.hotel_id WHERE room_id = $1`;
    const values = [id];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
} 

export const reserveRoom = async (reservationInfo: IReservationInfo) => {
  try{
    const { roomId, customerNas, reservationStartDate, reservationEndDate } = reservationInfo;
    const text = `INSERT INTO reservation(reservation_id, room_id, customer_nas, reservation_start_date, reservation_end_date, reservation_date)
                  VALUES($1, $2, $3, $4, $5, $6)`;
    const reservationId = `${roomId}${(Math.random() + 1).toString(36).substring(7)}`;
    const values = [reservationId, roomId, customerNas, reservationStartDate, reservationEndDate, new Date(Date.now()).toISOString()];
    const isAvailable = await checkRoomAvailability(reservationInfo);
    console.log(isAvailable);
    if (isAvailable) {
      return pool.query(text, values);
    } else {
      throw new Error('Room is not available');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const checkRoomAvailability = async (reservationInfo: IReservationInfo) => {
  try {
    const { roomId, reservationStartDate, reservationEndDate } = reservationInfo;
    const text = `SELECT count(reservation_id) FROM reservation WHERE room_id = $1 AND reservation_start_date <= $3 AND reservation_end_date >= $2 
                  UNION
                  SELECT count(rental_id) FROM Rental WHERE room_id = $1 AND rental_start_date <= $3 AND rental_end_date >= $2`;
    const values = [roomId, reservationStartDate, reservationEndDate];
    const result = await pool.query(text, values);
    return parseInt(result.rows[0].count) === 0;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const getRoomAvailability = async (roomId: string) => {
  try {
    const text = `SELECT reservation_start_date as start_date, reservation_end_date as end_date 
                  FROM reservation WHERE room_id = $1 
                  UNION 
                  SELECT rental_start_date as start_date, rental_end_date as end_date 
                  FROM rental WHERE room_id = $1`;
    const values = [roomId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const createRental = async (rentalInfo: any) => {
  try {
    const { rentalId, reservationId, customerNas, roomId, rentalStartDate, rentalEndDate, employeeNas } = rentalInfo;
    const text = `INSERT INTO rental(rental_id, reservation_id, customer_nas, room_id, rental_start_date, rental_end_date, employee_nas) 
                  VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [rentalId, reservationId, customerNas, roomId, rentalStartDate, rentalEndDate, employeeNas];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const createEmployee = async (employeeInfo: IEmployeeInfo) => {
  try {
    const { NAS, firstName, lastName, address, email, password, hotelId, yearlySalary } = employeeInfo;
    const text = `INSERT INTO employee(employee_nas, first_name, last_name, address, email, password, hotel_id) 
                  VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [NAS, firstName, lastName, address, email, password, hotelId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addHotelChain = async (hotelChainName: string) => {
  try {
    const text = `INSERT INTO hotel_chain(chain_name) VALUES($1)`;
    const values = [hotelChainName];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addHotel = async (hotelInfo: any) => {
  try {
    const { hotelId, hotelName, hotelAddress, hotelChainId } = hotelInfo;
    const text = `INSERT INTO hotel(hotel_id, hotel_name, hotel_address, hotel_chain_id) VALUES($1, $2, $3, $4)`;
    const values = [hotelId, hotelName, hotelAddress, hotelChainId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addRoom = async (roomInfo: any) => {
  try {
    const { roomId, roomType, roomPrice, hotelId } = roomInfo;
    const text = `INSERT INTO room(room_id, room_type, room_price, hotel_id) VALUES($1, $2, $3, $4)`;
    const values = [roomId, roomType, roomPrice, hotelId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
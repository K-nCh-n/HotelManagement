import { Pool } from 'pg';
import { IEmployeeInfo, IHotel, IReservationInfo, ISearchParams, IUserInfo } from './interfaces';
import e from 'express';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: 5432,
});

export const search = (searchParams: ISearchParams) => {
  try {
    const { stayStartDate, stayEndDate, areaLower, areaUpper, priceLower, priceUpper, chain, category, numberOfRoomsLower, numberOfRoomsUpper, location } = searchParams;
    console.log(stayStartDate, stayEndDate, areaLower, areaUpper, priceLower, priceUpper, chain, category, numberOfRoomsLower, numberOfRoomsUpper, location);
    const text = `
      SELECT 
        room.room_id, 
        room.hotel_id, 
        room.price, 
        room.commodities, 
        room.capacity, 
        room.view, 
        room.extendable, 
        room.problems, 
        hotel.rating,
        hotel.chain_name, 
        hotel.zone, 
        hotel.address, 
        hotel.phone_number, 
        room.image
      FROM 
        room 
      INNER JOIN 
        hotel ON hotel.hotel_id = room.hotel_id
      WHERE 
        (
          ($1::date IS NULL OR $2::date IS NULL) OR 
          (
            room.room_id NOT IN (
              SELECT room_id
              FROM reservation
              WHERE 
                reservation_start_date <= $2::date AND reservation_end_date >= $1::date
                OR reservation_start_date BETWEEN $1::date AND $2::date
                OR reservation_end_date BETWEEN $1::date AND $2::date
            )
          )
        )
        AND ($3::integer IS NULL OR room.capacity >= $3::integer)
        AND ($4::integer IS NULL OR room.capacity <= $4::integer)
        AND ($5::integer IS NULL OR room.price >= $5::integer)
        AND ($6::integer IS NULL OR room.price <= $6::integer)
        AND ($7::text IS NULL OR hotel.chain_name LIKE $7::text)
        AND ($8::integer IS NULL OR hotel.rating = $8::integer)
        AND (
          $9::integer IS NULL OR $10::integer IS NULL OR 
          (
            SELECT COUNT(*)
            FROM room r2
            WHERE r2.hotel_id = hotel.hotel_id
          ) BETWEEN $9::integer AND $10::integer
        )
        AND ($11::text IS NULL OR CONCAT(hotel.zone, ' ', hotel.address) LIKE $11::text)
`;
    const values = [stayStartDate, stayEndDate, areaLower, areaUpper, priceLower, priceUpper, chain, category, numberOfRoomsLower, numberOfRoomsUpper, location];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const createClientAcct = async (userInfo: IUserInfo) => {
  try{
    const { NAS, firstName, lastName, address, email, password } = userInfo;
    const text = `INSERT INTO customer(customer_nas, first_name, last_name, address, email, password) VALUES($1, $2, $3, $4, $5, $6)`;
    const values = [NAS, firstName, lastName, address, email, password];
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
    const query = `SELECT room_id
                   FROM reservation 
                   WHERE reservation_id = $1`;
    const queryValues = [reservationId];
    const results = await pool.query(query, queryValues);
    if (results.rows.length === 0) {
      throw new Error('Reservation not found');
    } else if (results.rows.length > 1) {
      throw new Error('Multiple reservations found');
    } else {
      const { room_id } = results.rows[0];
      const rentalId = `${room_id}${(Math.random() + 1).toString(36).substring(7)}`;

      const confirmationText = `INSERT INTO confirmation(reservation_id, rental_id, employee_nas) VALUES($1, $2, $3)`;
      const confirmationValues = [reservationId, rentalId, employeeNas];
      return pool.query(confirmationText, confirmationValues);
    }
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

export const editAccountInfo = async (accountInfo: IUserInfo | IEmployeeInfo, isEmployee: boolean) => {
  try{
    if (isEmployee && 'hotelId' in accountInfo) {
      const { firstName, lastName, address, email, password, NAS, hotelId } = accountInfo;
      const text = `UPDATE employee SET first_name = $1, last_name = $2, address = $3, email = $4, password = $5, hotel_id = $6 WHERE employee_nas = $7`;
      const values = [firstName, lastName, address, email, password, hotelId, NAS];
      return pool.query(text, values);
    } else {
      const { firstName, lastName, address, email, password, NAS } = accountInfo;
      const text = `UPDATE customer SET first_name = $1, last_name = $2, address = $3, email = $4, password = $5 WHERE customer_nas = $6`;
      const values = [firstName, lastName, address, email, password, NAS];
      return pool.query(text, values);
    }
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

export const getHotelChains = async () => {
  try {
    const text = `SELECT * FROM hotel_chain`;
    return pool.query(text);
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

export const deleteHotelChain = async (hotelChainName: string) => {
  try {
    const text = `DELETE FROM hotel_chain WHERE chain_name = $1`;
    const values = [hotelChainName];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const getHotels = async (chainName: string) => {
  try {
    const text = `SELECT * FROM hotel WHERE chain_name = $1`;
    const values = [chainName];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addHotel = async (hotelInfo: IHotel) => {
  try {
    const { hotelId, chainName, email, phoneNumber, rating, zone, address } = hotelInfo;
    const text = `INSERT INTO hotel(hotel_id, chain_name, email, phone_number, zone, address) VALUES($1, $2, $3, $4, $5, $6)`;
    
    const values = [hotelId, chainName, email, phoneNumber, zone, address];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const deleteHotel = async (hotelId: string) => {
  try {
    const text = `DELETE FROM hotel WHERE hotel_id = $1`;
    const values = [hotelId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const getRooms = async (hotelId: string) => {
  try {
    const text = `SELECT * FROM room WHERE hotel_id = $1`;
    const values = [hotelId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addRoom = async (roomInfo: any) => {
  try {
    const { roomId, hotelId, price, commodities, capacity, view, extendable, problems, image } = roomInfo;
    const text = `INSERT INTO room(room_id, hotel_id, price, commodities, capacity, view, extendable, problems, image)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [roomId, hotelId, price, commodities, capacity, view, extendable, problems, image];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const deleteRoom = async (roomId: string) => {
  try {
    const text = `DELETE FROM room WHERE room_id = $1`;
    const values = [roomId];
    return pool.query(text, values);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
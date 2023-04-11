import * as dotenv from 'dotenv';
dotenv.config(); 
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { ISearchParams, IUserInfo, IReservationEmployee, IReservation, IRoomAugmented, IUserLogin, IReservationInfo, IReservedDates, IEmployeeInfo } from './interfaces';
import { search, createClientAcct, loginUser, accountInfo, userReservations, employeeReservations, cancelReservation, confirmReservation, deleteAccount, editAccountInfo, roomInfo, reserveRoom, getRoomAvailability, createEmployee } from './db';

const app: Express = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/signup', async (req: Request, res: Response) => {
  try {
    const user: IUserInfo = req.body.clientInfo;
    await createClientAcct(user);
    res.status(200).send("Created");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Creating Account");
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const loginInfo: IUserLogin = req.body.loginInfo;
    const result = await loginUser(loginInfo.email, loginInfo.password);
    console.log(result.rows)
    if (result.rows.length === 0) {
      res.status(401).send("Invalid Credentials");
    } else if (result.rows.length > 1) {
      res.status(500).send("Error Logging In");
    } else {
      const isEmployee = result.rows[0].account_type === "employee";
      const token = result.rows[0].token;
      res.send({ token, isEmployee });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Logging In");
  }
});

app.get('/search', async (req: Request, res: Response) => {
  try {
    const searchParams = req.query as ISearchParams;
    console.log(searchParams);
    const result = await search(searchParams);
    const rooms: IRoomAugmented[] = result.rows.map((room: any) => {
      return {
        roomId: room.room_id,
        hotelId: room.hotel_id,
        price: room.price,
        commodities: room.commodities,
        capacity: room.capacity,
        view: room.view,
        extendable: room.extendable,
        problems: room.problems,
        hotelName: room.chain_name + " " + room.zone,
        hotelAddress: room.address,
        rating: room.rating,
        hotelChain: room.chain_name,
        hotelPhoneNumber: room.phone_number,
        roomImage: room.image,
      }
    });
    res.send(rooms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Searching");
  }
});

app.get('/account/:id', async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    const result = await accountInfo(id);
    if (result.rows.length === 0) {
      res.status(404).send("Account Not Found");
    } else if (result.rows.length > 1) {
      res.status(500).send("Error Getting Account Info");
    } else {
      const accountInfo = result.rows[0];
      const userInfo: IUserInfo|IEmployeeInfo = {
        NAS: accountInfo.nas,
        email: accountInfo.email,
        firstName: accountInfo.first_name,
        lastName: accountInfo.last_name,
        address: accountInfo.address,
        password: accountInfo.password,
        hotelId: accountInfo.hotel_id,
      }
      res.send(userInfo);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Getting Account Info");
  }
});

app.get('/userReservations/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await userReservations(id);
    const reservations: IReservation[] = result.rows.map((reservation: any) => {
      return {
        reservationId: reservation.reservation_id,
        roomId: reservation.room_id,
        reservationStartDate: reservation.reservation_start_date,
        reservationEndDate: reservation.reservation_end_date,
        reservationDate: reservation.reservation_date,
        customerNas: reservation.customer_nas,
        guests: reservation.guests,
        hotelZone: reservation.zone,
        hotelAddress: reservation.address,
        hotelPhoneNumber: reservation.phone_number,
        hotelEmail: reservation.email,
        clientEmail: reservation.email,
        clientPhoneNumber: reservation.phone_number,
        chainName: reservation.chain_name,
        status: reservation.rental_id ? "Confirmed" : "Pending"
      }
    });
    res.send(reservations);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Getting User Reservations");
  }
});

app.get('/employeeReservations', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await employeeReservations(id);
    console.log(result.rows)
    const reservations: IReservationEmployee[] = result.rows.map((reservation: any) => {
      return {
        reservationId: reservation.reservation_id,
        roomId: reservation.room_id,
        reservationStartDate: reservation.reservation_start_date,
        reservationEndDate: reservation.reservation_end_date,
        reservationDate: reservation.reservation_date,
        customerNas: reservation.customer_nas,
        guests: reservation.guests,
        hotelZone: reservation.zone,
        hotelAddress: reservation.address,
        hotelPhoneNumber: reservation.phone_number,
        hotelEmail: reservation.email,
        clientEmail: reservation.email,
        clientPhoneNumber: reservation.phone_number,
        chainName: reservation.chain_name,
        clientName: `${reservation.first_name} ${reservation.last_name}`,
        status: "Pending"
      }
    });
    res.send(reservations);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Getting Employee Reservations");
  }
});

app.delete('/cancelReservation/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await cancelReservation(id);
    res.send("Cancelled");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Cancelling Reservation");
  }
});

app.put('/confirmReservation/:id/:employeeNas', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const employeeNas = req.params.employeeNas;
    console.log(employeeNas);
    console.log(id);
    if (employeeNas === "null") {
      res.status(400).send("Employee Not Logged In");
    } else{
      const result = await confirmReservation(id, employeeNas);
      res.send("Confirmed");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Confirming Reservation");
  }
});

app.delete('/deleteUser', async (req: Request, res: Response) => {
  try {
    const {token, isEmployee} = req.body;
    const result = await deleteAccount(token, isEmployee);
    res.send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Deleting User");
  }
});

app.post('/editaccountinfo', (req: Request, res: Response) => {
  try {
    const userInfo: IUserInfo = req.body;
    const result = editAccountInfo(userInfo);
    res.send("Edited");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Editing Account Info");
  }
});

app.get('/roomInfo/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await roomInfo(id);
    if (result.rows.length === 0) {
      res.status(404).send("Room Not Found");
    } else if (result.rows.length > 1) {
      res.status(500).send("Error Getting Room Info");
    } else {
      const roomInfo = result.rows[0];
      const roomInfoToSend: IRoomAugmented = {
        roomId: roomInfo.room_id,
        hotelId: roomInfo.hotel_id,
        price: roomInfo.price,
        commodities: roomInfo.commodities,
        capacity: roomInfo.capacity,
        view: roomInfo.view,
        extendable: roomInfo.extendable,
        problems: roomInfo.problems,
        roomImage: roomInfo.image,
        hotelName: `${roomInfo.chain_name} ${roomInfo.zone}`,
        hotelAddress: roomInfo.address,
        rating: roomInfo.rating,
        hotelPhoneNumber: roomInfo.phone_number,
        hotelChain: roomInfo.chain_name,
      }
      res.send(roomInfoToSend);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Getting Room Info");
  }
});

app.post('/reserveRoom', async (req: Request, res: Response) => {
  try {
    const reservationInfo: IReservationInfo = req.body;
    reservationInfo.guests = Math.floor(Math.random() * 5);
    const result = await reserveRoom(reservationInfo);
    res.send("Reserved");
  } catch (err: any) {
    console.log(err);
    if (err.message == "Room is not available") {
      res.status(400).send("Room is not available");
    } else {
      res.status(500).send("Error Reserving Room");
    }
  }
});

app.get('/roomAvailability/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await getRoomAvailability(id);
    const reservedDates: IReservedDates[] = result.rows.map((date: any) => {
      return {
        reservationStartDate: date.start_date,
        reservationEndDate: date.end_date,
      }
    });
    res.send(reservedDates);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Getting Room Availability");
  }
});

app.post('/employeeCreateRental', (req: Request, res: Response) => {
  res.send("Added");
});

app.post('/employeeSignUp', async (req: Request, res: Response) => {
  try {
    const employeeInfo: IEmployeeInfo = req.body.employeeInfo;
    const result = await createEmployee(employeeInfo);
    res.send("Added");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Signing Up");
  }
});

///

app.post('/add', (req: Request, res: Response) => {
  res.send(req.body);
}); // Not Needed

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
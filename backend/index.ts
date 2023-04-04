import * as dotenv from 'dotenv';
dotenv.config(); 
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { ISearchParams, IUserInfo, IReservationAugmented, IReservation, IRoomAugmented, IUserLogin } from './interfaces';
import { search, createClientAcct, loginUser } from './db';

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
  const searchParams: ISearchParams = req.query;
  console.log(searchParams);
  const result = await search(searchParams);
  const rooms = result.rows.map((room: any) => {
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
      hotelRating: room.rating,
      hotelChain: room.chain_name,
      hotelPhoneNumber: room.phone_number,
      roomImage: room.image,
    }
  });
  console.log(rooms);
  res.send(rooms);
});

///

app.post('/add', (req: Request, res: Response) => {
  res.send(req.body);
});

app.get('/account/:id', (req: Request, res: Response) => {
  const account: IUserInfo = {
    customerNas: "NAS",
    email: "email@example.com",
    firstName: "John",
    lastName: "Doe",
    address: "123, Street",
    password: "qwerty",
  };
  res.send(account);
});

app.get('/userReservations/:id', (req: Request, res: Response) => {
  const testReservations: IReservation[] = [
    {
      "reservationId": "1",
      "roomId": "1",
      "reservationStartDate": "2020-12-01",
      "reservationEndDate": "2020-12-05",
      "reservationDate": "2020-11-01",
      "customerNas": "123456789",
      "guests": 2
    },
    {
      "reservationId": "2",
      "roomId": "2",
      "reservationStartDate": "2020-12-01",
      "reservationEndDate": "2020-12-05",
      "reservationDate": "2020-11-01",
      "customerNas": "123456789",
      "guests": 2
    }
  ];
  res.send(testReservations);
});

app.delete('deleteUser/:id', (req: Request, res: Response) => {
  res.send("Deleted");
});

app.delete('/cancelReservation/:id', (req: Request, res: Response) => {
  res.send("Deleted");
});



app.post('/editaccountinfo', (req: Request, res: Response) => {
  res.send("Edited");
});

app.get('/employeeReservations', (req: Request, res: Response) => {
  const testReservationsAugmented: IReservationAugmented[] = [
    {
      "reservationId": "1",
      "chainName": "Hilton",
      "clientName": "John Smith",
      "roomId": "1",
      "reservationStartDate": "2020-12-01",
      "reservationEndDate": "2020-12-05",
      "reservationDate": "2020-11-01",
      "customerNas": "123456789",
      "guests": 2
    },
    {
      "reservationId": "2",
      "chainName": "Royal",
      "clientName": "Jane Doe",
      "roomId": "2",
      "reservationStartDate": "2020-12-01",
      "reservationEndDate": "2020-12-05",
      "reservationDate": "2020-11-01",
      "customerNas": "123456789",
      "guests": 2
    }
  ];
  res.send(testReservationsAugmented);
});

app.post('/employeeCreateRental', (req: Request, res: Response) => {
  res.send("Added");
});

app.get('/roomInfo/:id', (req: Request, res: Response) => {
  const testRoom: IRoomAugmented = {
    roomId: 1234,
    price: 100,
    commodities: "Queen Bed, TV, Fridge",
    capacity: 2,
    extendable: true,
    hotelId: 1,
    hotelName: "Hotel Name",
    hotelAddress: "Hotel Address",
    hotelChain: "Hotel Chain",
    hotelRating: 5,
    hotelPhoneNumber: "Hotel Phone Number",
    view: "Seaside",
    problems: "No AC",
    roomImage: ""
  };
  res.send(testRoom);
});

app.post('/reserveRoom', (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Reserved");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
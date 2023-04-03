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

///

app.post('/add', (req: Request, res: Response) => {
  res.send(req.body);
});

app.get('/search', async (req: Request, res: Response) => {
  const testResults: IRoomAugmented[] = [
    {
      "roomId": 1,
      "hotelId": 1,
      "price": 100,
      "capacity": 2,
      "extendable": true,
      "commodities": "TV, Wifi, AC",
      "view": "City",
      "problems": "None",
      "hotelName": "Hotel 1",
      "hotelAddress": "123 Main St",
      "hotelPhoneNumber": "123-456-7890",
      "hotelChain": "Chain 1",
      "hotelRating": 5
    },
    {
      "roomId": 2,
      "hotelId": 1,
      "price": 200,
      "capacity": 4,
      "extendable": false,
      "commodities": "TV, Wifi, AC",
      "view": "City",
      "problems": "None",
      "hotelName": "Hotel 2",
      "hotelAddress": "123 Main St",
      "hotelPhoneNumber": "123-456-7890",
      "hotelChain": "Chain 1",
      "hotelRating": 5
    }
  ];
  console.log(req.query);
  res.send(testResults);
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
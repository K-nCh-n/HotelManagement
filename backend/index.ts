import * as dotenv from 'dotenv';
dotenv.config(); 
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { ISearchParams } from './interfaces';
import { search } from './db';

const app: Express = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/add', (req: Request, res: Response) => {
  res.send(req.body);
});

app.get('/search', async (req: Request, res: Response) => {
  try{
    const { searchParams }: { searchParams: ISearchParams } = req.body;
    console.log(searchParams);
    const query = await search(searchParams);
    res.send(query.rows);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
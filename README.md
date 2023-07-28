# CSI 2532 Project - Hotel Management

This repository contains the backend (Node + Express) and React app for the CSI2532 Project - Hotel Management. The project description is avaiable below (translated from french using Google Translate).

The Project follows a PERN stack (PostgreSQL, Express, React, Node). 

## Project Description

> Five of the most well-known hotel chains, with hotels in more than 14 different locations in North America, have decided to collaborate and develop an application that will allow their customers to easily book rooms in their hotels, by seeing the availability of rooms in real time. You are welcome to develop the application that enables the above.
> For each hotel chain, we need to know the address of its central offices, the number of its hotels, contact email addresses and telephone numbers. Hotel chains are rated (e.g. 1 star to 5 star). For each hotel, we need to know the number of rooms, the address of the hotel, and the contact phone and email numbers for that hotel. For rooms in a hotel, we need to know their price, all amenities (e.g. TV, air conditioning, refrigerator, etc.), room capacity (e.g., single, double, etc.), whether they have a sea or mountain view, if they can be extended (eg adding an extra bed) and if there are any problems/damages in the room. For the customers, we need to store their full name, address and social security number/SIN, date of registration in our system. For hotel employees, we need to store their full name, address, and social security number/SIN. Employees can have different roles/positions in a hotel. Every hotel needs a manager. Customers can search and book rooms through the online application for specific dates. When they check into the hotel, their room reservation becomes a rental and they can also pay for that rental. The employee who checks in for a guest is responsible for converting the room reservation into a rental. A customer can physically show up at a hotel without a reservation and request a room directly. In this case, the hotel employee can rent the room immediately without prior reservation. We need to store reservation and rental history (archives) in the database, but we do not need to store payment history. Information about an old (archived) room reservation/rental must exist in the database, even if the information about the room itself no longer exists in the database. We should be able to remove hotel chains, hotels and rooms from our database. We cannot have information about a room in the database without having information about the corresponding hotel (i.e. the hotel to which the room also belongs) in the database. In the same way, we cannot have information about a hotel in the database without having information about the corresponding hotel chain in the database (i.e. the hotel chain to which the hotel also belongs).

## Installation

### Clone the repository
  
```bash
git clone https://github.com/K-nCh-n/HotelManagement.git
```

### Navigate to the cloned directory

```bash
cd HotelManagement
```

### Install the dependencies for both the backend and React app

```bash
cd backend && npm install
cd ../react-app && npm install
```

## Running the app

### Start the backend server

```bash
cd backend && npm run dev
```

### Start the React app

```bash
cd ../react-app && npm start
```

The React app will run on <http://localhost:3000> and the backend server will run on <http://localhost:5000>.

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import EmployeePortal from './pages/EmployeePortal';
import EmployeeReservations from './pages/EmployeeReservations';
import RoomDetails from './pages/RoomDetails';
import NotFound from './pages/NotFound';
import useToken from './components/Token';
import EditHotelInfo from './pages/EditHotelInfo';

function App() {
  const { token, setToken, isEmployee, setIsEmployee } = useToken();
  return (
    <Router basename='HotelManagement'>
      <div>
        <NavigationBar token={token} />
        <div>
          <Routes>
            <Route path="/" element={<Home isEmployee={isEmployee} />} />
            <Route path="/search" element={<Search />} />
            <Route path="employee" element={<EmployeePortal isEmployee={isEmployee} />}/>
            <Route path="/employeeReservations" element={<EmployeeReservations isEmployee={isEmployee} employeeNas={token} />} />
            <Route path="/editHotelInfo" element={<EditHotelInfo isEmployee={isEmployee} />} />
            <Route path="/login" element={<Login setToken={setToken} setIsEmployee={setIsEmployee} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account token={token} isEmployee={isEmployee} />} />
            <Route path="/room/:id" element={<RoomDetails token={token} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

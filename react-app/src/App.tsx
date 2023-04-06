import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Employee from './pages/Employee';
import RoomDetails from './pages/RoomDetails';
import NotFound from './pages/NotFound';
import useToken from './components/Token';

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
            <Route path="/employee" element={<Employee isEmployee={isEmployee} employeeNas={token} />} />
            <Route path="/login" element={<Login setToken={setToken} setIsEmployee={setIsEmployee} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account token={token} />} />
            <Route path="/room/:id" element={<RoomDetails token={token} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

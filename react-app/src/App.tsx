import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Employee from './pages/Employee';
import NotFound from './pages/NotFound';
import useToken from './components/Token';

function App() {
  const { token, setToken } = useToken();
  return (
    <Router>
      <div>
        <NavigationBar token={token} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Client from './pages/Client';
import Employee from './pages/Employee';

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/client" element={<Client />} />
            <Route path="/employee" element={<Employee />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

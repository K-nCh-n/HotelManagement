import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = tokenString !== null && JSON.parse(tokenString);
    return userToken?.token
  };
  const [token, setToken] = useState(getToken());

  const saveToken = (token: string) => {
    setToken(token);
    localStorage.setItem('token', JSON.stringify({"token": token}));
  };

  const checkEmployee = () => {
    const tokenString = localStorage.getItem('isEmployee');
    const empToken = tokenString !== null && JSON.parse(tokenString);
    return empToken?.isEmployee || false;
  };
  const [isEmployee, setIsEmployee] = useState(checkEmployee());
  const saveEmployee = (val: boolean) => {
    setIsEmployee(val);
    localStorage.setItem('isEmployee', JSON.stringify({"isEmployee": val}));
  };


  return {
    token,
    setToken: saveToken,
    isEmployee,
    setIsEmployee: saveEmployee
  }
}
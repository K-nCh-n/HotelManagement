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

  return {
    token,
    setToken: saveToken,
  }
}
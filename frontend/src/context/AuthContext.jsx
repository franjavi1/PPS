import React, { createContext, useState, useContext } from 'react';
import { parseJWT, obtenerRolNormalizado } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = parseJWT(token);
      return obtenerRolNormalizado(decoded);
    }
    return null;
  });

  const login = (token) => {
    sessionStorage.setItem('token', token);
    const decoded = parseJWT(token);
    const role = obtenerRolNormalizado(decoded);
    setCurrentUserRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setCurrentUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

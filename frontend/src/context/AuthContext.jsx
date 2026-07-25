import React, { createContext, useState, useContext } from 'react';
import { parseJWT, obtenerRolNormalizado } from '../utils/auth';

// Creamos el contexto de autenticación para propagar el rol del usuario a todo el árbol de componentes.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Iniciamos el estado síncronamente leyendo sessionStorage al levantar la app.
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = parseJWT(token);
      return obtenerRolNormalizado(decoded);
    }
    return null;
  });

  // Guardamos el token en la sesión y parseamos el rol normalizado para actualizar el estado global.
  const login = (token) => {
    sessionStorage.setItem('token', token);
    const decoded = parseJWT(token);
    const role = obtenerRolNormalizado(decoded);
    setCurrentUserRole(role);
  };

  // Limpiamos los datos del almacenamiento de sesión y restablecemos el rol.
  // Al usar sessionStorage, garantizamos que si cierra la pestaña la sesión se destruye automáticamente.
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

// Exponemos un hook personalizado para consumir el contexto de forma mucho más limpia en nuestros componentes.
export const useAuth = () => useContext(AuthContext);
